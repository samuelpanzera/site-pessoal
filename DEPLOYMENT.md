# Guia de Deploy e Infraestrutura (Monorepo & Multi-Tenant)

Documentação completa sobre como a infraestrutura funciona, como fazer mudanças e como o pipeline de CI/CD automatiza tudo de forma segura.

---

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Configuração do Nginx (Isolado e Seguro)](#configuração-do-nginx-isolado-e-seguro)
3. [Mapeamento de Portas e Quadlet (Podman)](#mapeamento-de-portas-e-quadlet-podman)
4. [CI/CD - Como funciona](#cicd---como-funciona)
5. [Configurações Iniciais da VPS](#configurações-iniciais-da-vps)
6. [Troubleshooting](#troubleshooting)

---

## Arquitetura

Este repositório é um **monorepo** composto por dois serviços independentes implantados na VPS Debian 13 em containers rootless via **Podman** e expostos através do **Nginx global** ativo no sistema operacional.

```
Repositório (Monorepo GitHub)
     ↓
     ├─── apps/frontend/ (React 19 + Vite) ──► Container Frontend (Porta 3100)
     │                                                              ▲ (Proxy Reverso)
     ├─── apps/backend/  (Go/Fiber)        ──► Container API Go     (Porta 3101)
     │                                                              ▲ (Proxy Reverso)
     └─── infra/nginx/site-pessoal.conf    ──► Nginx Global (Hospedeiro VPS)
```

**Fluxo de Deploy:**
1. Alterações no diretório `apps/`, `infra/` ou na pipeline disparam o deploy ao fazer push na branch `master`.
2. O GitHub Actions compila as duas imagens Docker em paralelo e as envia para o GitHub Container Registry (GHCR).
3. O workflow sincroniza os arquivos de configuração do Nginx e do Podman (Quadlet) com a VPS.
4. É executada uma atualização automática atômica: as novas imagens são baixadas, os serviços do Podman reiniciados e a configuração do Nginx é testada antes do reload.

---

## Configuração do Nginx (Isolado e Seguro)

Para que a VPS atue de forma segura no modelo **Multi-Tenant** (hospedando vários sites como `samuelpanzera.com.br`, `outraurl.com`, etc.), o arquivo de configuração de Nginx deste projeto fica descentralizado no repositório em:
*   [infra/nginx/site-pessoal.conf](file:///d:/Projetos/Typescript/pdipessoal/infra/nginx/site-pessoal.conf)

### Validação Atômica contra Quebras
A pipeline valida a configuração global do Nginx com `nginx -t` antes de aplicar as mudanças em produção. Se houver qualquer erro de sintaxe, o arquivo provisório é removido imediatamente, protegendo os demais sites da VPS contra interrupções.

---

## Mapeamento de Portas e Quadlet (Podman)

Para evitar conflito de portas entre os diferentes projetos da VPS, cada projeto é alocado em um intervalo específico de portas no host (`127.0.0.1`). Para o `site-pessoal`, reservamos a faixa **`3100-3199`**:

*   **Frontend (Porta 3100):** [site-pessoal-frontend.container](file:///d:/Projetos/Typescript/pdipessoal/infra/frontend/site-pessoal-frontend.container)
*   **API Go (Porta 3101):** [site-pessoal-api.container](file:///d:/Projetos/Typescript/pdipessoal/infra/backend/site-pessoal-api.container)

Os arquivos `.container` usam o gerador do systemd **Quadlet** integrado ao Podman. Quando o arquivo `.container` é colocado em `/etc/containers/systemd/` e executamos `systemctl daemon-reload`, o Quadlet gera automaticamente uma unit `.service` correspondente para gerenciamento via systemd padrão.

### Comandos de Controle na VPS:
```bash
# Verificar status dos serviços
sudo systemctl status site-pessoal-frontend
sudo systemctl status site-pessoal-api

# Reiniciar serviços
sudo systemctl restart site-pessoal-frontend
sudo systemctl restart site-pessoal-api

# Logs em tempo real
journalctl -u site-pessoal-frontend -f
journalctl -u site-pessoal-api -f
```

---

## CI/CD - Como funciona

Toda a automação de compilação, envio e deploy está definida no workflow unificado:
*   [.github/workflows/deploy.yml](file:///d:/Projetos/Typescript/pdipessoal/.github/workflows/deploy.yml)

### Variáveis Protegidas (Secrets) Necessárias:
No painel do GitHub (**Settings -> Secrets and variables -> Actions**), configure:

| Secret | Descrição |
|---|---|
| `VPS_HOST` | Endereço IP público da sua VPS Debian 13. |
| `VPS_SSH_USER` | Nome do usuário SSH configurado para deploy (`deploy`). |
| `VPS_SSH_KEY` | Chave privada SSH para acesso sem senha à VPS. |

---

## Configurações Iniciais da VPS

Na VPS (com privilégios de `root`), execute a preparação para receber este projeto:

### 1. Ajuste de Permissões Sudo para o Usuário `deploy`
Edite o arquivo `/etc/sudoers.d/deploy` para permitir que o usuário execute comandos de Podman, Nginx e Systemd:
```bash
deploy ALL=(ALL) NOPASSWD: /usr/bin/podman, /bin/systemctl, /usr/sbin/nginx
```

### 2. Criação das Pastas da Aplicação
```bash
# Pastas de configuração do Quadlet
mkdir -p /etc/containers/systemd
chown -R deploy:deploy /etc/containers/systemd
```

### 3. Remoção de Configurações Antigas
Se você já configurou as portas ou diretórios legados, lembre-se de limpar os links simbólicos antigos do Nginx para evitar duplicidade de `server_name`:
```bash
sudo rm -f /etc/nginx/sites-enabled/portfolio
sudo rm -f /etc/nginx/sites-enabled/portfolio-api
sudo systemctl reload nginx
```

---

## Troubleshooting

### "O deploy quebrou a configuração do Nginx"
O Nginx não será recarregado se o teste falhar. Verifique os logs de execução da pipeline no GitHub Actions para ver a linha do arquivo `site-pessoal.conf` que causou o erro. Corrija o arquivo localmente, faça o commit e o push novamente.

### "Os containers não sobem ou dão erro ao puxar imagens"
Garanta que as packages geradas no GitHub estejam com visibilidade **pública** nas configurações do pacote no seu perfil do GitHub (Packages -> `site-pessoal-frontend` e `site-pessoal-api` -> Package Settings -> Change Visibility to Public).
