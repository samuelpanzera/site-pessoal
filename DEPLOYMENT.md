# Guia de Deploy e Infraestrutura

Documentação completa sobre como a infraestrutura funciona, como fazer mudanças, e como o CI/CD automatiza tudo.

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Como funciona Quadlet](#como-funciona-quadlet)
3. [Alterar uma config existente](#alterar-uma-config-existente)
4. [Adicionar um novo serviço](#adicionar-um-novo-serviço)
5. [CI/CD - Como funciona](#cicd---como-funciona)
6. [Troubleshooting](#troubleshooting)

---

## Arquitetura

```
Repositório (GitHub)
    ↓
    ├─── apps/backend/ (código Go)
    │       ↓ (push)
    │   .github/workflows/deploy-api.yml
    │       ↓
    │   ├─ Build imagem Docker
    │   ├─ Push para GHCR (ghcr.io/samuelpanzera/portfolio-api:latest)
    │   └─ SSH na VPS: sync .container + restart
    │
    └─── infra/portfolio-api/portfolio-api.container (declarativo)
            ↓ (push)
            SSH na VPS: copy .container → /etc/containers/systemd/
            ↓
        systemctl daemon-reload (Quadlet gera .service)
            ↓
        systemctl restart portfolio-api
            ↓
        Novo container rodando com a imagem atualizada
```

**Fluxo:**
1. Você edita `apps/backend/main.go` ou `infra/portfolio-api/portfolio-api.container`
2. Commit + push para `master`
3. GitHub Actions dispara `.github/workflows/deploy-api.yml`
4. Workflow: builda imagem → pusha GHCR → SSH na VPS → systemd reinicia container
5. 30 segundos depois: novo código rodando em produção

---

## Como funciona Quadlet

**Quadlet** é um generator do systemd que converte arquivos `.container`, `.network`, `.volume` em units `.service`.

### Fluxo Quadlet

```
Arquivo: /etc/containers/systemd/portfolio-api.container
    ↓
systemctl daemon-reload
    ↓
Quadlet generator processa o arquivo
    ↓
Gera: /run/systemd/generator/portfolio-api.service (automático)
    ↓
systemctl knows about portfolio-api.service agora
```

### Formato do arquivo `.container`

```ini
[Unit]
Description=Portfolio API
After=network-online.target        # começa DEPOIS da rede estar online

[Container]
Image=ghcr.io/samuelpanzera/portfolio-api:latest  # qual imagem rodar
ContainerName=portfolio-api        # nome do container
PublishPort=127.0.0.1:3000:3000   # porta (localhost:3000)
Environment=PORT=3000             # env vars
AutoUpdate=registry               # permite `podman auto-update`

[Service]
Restart=always                    # reinicia se crashear
TimeoutStartSec=300              # timeout pra iniciar

[Install]
WantedBy=multi-user.target        # auto-start no boot (sem precisar enable)
```

**Comandos systemd normais funcionam:**
```bash
systemctl start portfolio-api
systemctl stop portfolio-api
systemctl restart portfolio-api
systemctl status portfolio-api
journalctl -u portfolio-api -f    # logs em tempo real
```

---

## Alterar uma config existente

Cenário: você quer mudar a porta de 3000 para 3001, ou adicionar uma variável de ambiente.

### Passo 1: Edite o arquivo `.container` localmente

`infra/portfolio-api/portfolio-api.container`:
```ini
[Container]
PublishPort=127.0.0.1:3001:3000   # ← mudou de 3000 para 3001
Environment=PORT=3001
Environment=LOG_LEVEL=debug        # ← adicionou nova var
```

### Passo 2: Commit + Push

```bash
git add infra/portfolio-api/portfolio-api.container
git commit -m "infra: update portfolio-api port to 3001"
git push origin master
```

### Passo 3: Workflow faz tudo automaticamente

O workflow detecta mudança em `infra/portfolio-api/**`:
1. ✅ SCP manda o arquivo atualizado pra `/etc/containers/systemd/`
2. ✅ SSH roda `systemctl daemon-reload` (Quadlet relê o arquivo)
3. ✅ SSH roda `systemctl restart portfolio-api`
4. ✅ Container reinicia com a config nova

**Dentro de 2-3 minutos: mudança live.**

### Testar localmente (opcional)

Antes de fazer push, pode validar a sintaxe:
```bash
podman build -t portfolio-api ./apps/backend
podman run -p 3001:3000 portfolio-api   # testa com a porta nova
```

---

## Adicionar um novo serviço

Cenário: você quer hospedar um segundo projeto/API na mesma VPS.

### Passo 1: Criar estrutura no repo

```bash
mkdir -p infra/projeto-novo
```

### Passo 2: Criar `.container` file

`infra/projeto-novo/projeto-novo.container`:
```ini
[Unit]
Description=Projeto Novo API
After=network-online.target

[Container]
Image=ghcr.io/samuelpanzera/projeto-novo-api:latest
ContainerName=projeto-novo-api
PublishPort=127.0.0.1:3001:3000
Environment=PORT=3000

[Service]
Restart=always
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
```

### Passo 3: Criar workflow de deploy

Copiar `.github/workflows/deploy-api.yml` e adaptar:

`.github/workflows/deploy-projeto-novo.yml`:
```yaml
name: Build & Deploy Projeto Novo

on:
  push:
    branches: [master]
    paths:
      - apps/projeto-novo/**           # ← seu código aqui
      - infra/projeto-novo/**
      - .github/workflows/deploy-projeto-novo.yml

env:
  IMAGE: ghcr.io/samuelpanzera/projeto-novo-api

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    # ... (mesmo que deploy-api.yml)

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Sync Quadlet config
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_SSH_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: infra/projeto-novo/projeto-novo.container
          target: /etc/containers/systemd/
          strip_components: 2

      - name: Pull and restart
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_SSH_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            sudo podman pull ghcr.io/samuelpanzera/projeto-novo-api:latest
            sudo systemctl daemon-reload
            sudo systemctl restart projeto-novo-api
```

### Passo 4: Configurar NGINX (manual na VPS)

Adicionar config em `/etc/nginx/sites-available/projeto-novo`:
```nginx
server {
    listen 80;
    server_name novo.samuelpanzera.com.br;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable e test:
```bash
ln -s /etc/nginx/sites-available/projeto-novo /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Passo 5: SSL

```bash
certbot --nginx -d novo.samuelpanzera.com.br
```

### Passo 6: Push

```bash
git add infra/projeto-novo .github/workflows/deploy-projeto-novo.yml
git commit -m "feat: add projeto-novo infrastructure"
git push origin master
```

Workflow roda automaticamente → container ativo em produção.

---

## CI/CD - Como funciona

### Workflows disponiveis

**`deploy-api.yml`** — Backend (Go/Fiber)
- Trigger: push em `apps/backend/**` ou `infra/portfolio-api/**`
- Build: Docker image → GHCR
- Deploy: SCP .container + systemctl restart

**`deploy-frontend.yml`** — Frontend (React/Vite)
- Trigger: push em `apps/frontend/**`
- Build: `bun run build` → gera `dist/`
- Deploy: rsync `dist/` para `/var/www/portfolio/` na VPS

### Cronograma típico

```
22:15 - você edita apps/backend/main.go e faz push
22:15 - GitHub Actions dispara workflow
22:15-22:18 - build docker image (3 min com cache)
22:18 - push image para GHCR
22:18-22:20 - SSH na VPS, sync .container, restart (2 min)
22:20 - Novo código rodando em produção
```

### Ver logs do workflow

https://github.com/samuelpanzera/site-pessoal/actions

Cada job tem output completo de cada step. Se falhar:
- Build falhou? → erro no Docker build
- Push falhou? → credenciais GHCR
- Deploy falhou? → SSH connection ou sudoers issue

---

## Troubleshooting

### "systemctl restart não funciona"

```bash
# Check se o .container file está lá
ls -la /etc/containers/systemd/

# Check se a syntax está correta
podman run ... (teste manual)

# Check se o deploy user tem sudo
sudo -u deploy sudo systemctl status portfolio-api
```

### "Imagem não foi pulled"

```bash
# GHCR privado?
podman pull ghcr.io/samuelpanzera/portfolio-api:latest

# Se falhar: tornar público em https://github.com/samuelpanzera?tab=packages
```

### "Mudança no .container não refletiu"

```bash
# Daemon reload é necessário
sudo systemctl daemon-reload

# Depois restart
sudo systemctl restart portfolio-api
```

### "Service não aparece no systemctl"

```bash
# Quadlet só processa em daemon-reload
sudo systemctl daemon-reload

# Confirma que apareceu
systemctl list-unit-files | grep seu-servico
```

---

## Resumo: O que você precisa fazer no futuro

| Mudança | Onde editar | Push = Deploy? |
|---|---|---|
| Alterar código backend | `apps/backend/` | ✅ Automático |
| Alterar código frontend | `apps/frontend/` | ✅ Automático |
| Mudar porta, env var, etc | `infra/portfolio-api/portfolio-api.container` | ✅ Automático |
| Configuração NGINX (domínios, SSL) | Manual na VPS | ❌ Manual |
| Adicionar novo serviço | `infra/novo/novo.container` + novo workflow | ✅ Automático |

**Fluxo padrão:**
1. Edite arquivo
2. `git push`
3. Espere 2-3 min
4. Mudança está live

Tudo o mais é automático.
