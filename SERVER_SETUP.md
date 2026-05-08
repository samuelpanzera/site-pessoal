# Runbook: Configuração da VPS

> Execute os comandos abaixo via SSH como root. Substitua `SEU_DOMINIO` pelo seu domínio real antes de começar.

```bash
DOMINIO="samuelpanzera.com.br"
IP_VPS="$(curl -s ifconfig.me)"
echo "Domínio: $DOMINIO | IP: $IP_VPS"
```

> **IMPORTANTE:** a variável `$DOMINIO` só existe na sessão SSH atual. Se fechar o terminal e reconectar, defina-a novamente antes de continuar. Para evitar retrabalho, exporte-a no início de cada sessão:
> ```bash
> export DOMINIO="samuelpanzera.com.br"
> ```

---

## 0. Pré-requisito: DNS

No painel do **registro.br**, crie os seguintes registros A apontando para o IP da VPS:

| Nome | Tipo | Valor |
|---|---|---|
| `@` | A | `<IP_DA_VPS>` |
| `www` | A | `<IP_DA_VPS>` |
| `api` | A | `<IP_DA_VPS>` |

Aguarde propagação (5–30min) e teste:
```bash
ping $DOMINIO
```

**Só continue após o DNS propagar.**

---

## 1. Firewall (UFW)

```bash
apt update && apt install ufw -y
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

---

## 2. Podman

> Escolhido no lugar do Docker por ser **daemonless** (sem processo em background consumindo RAM) e estar disponível nos repos oficiais do Debian 13.

```bash
apt update && apt install podman podman-compose -y
podman --version
podman-compose --version
```

Alias para compatibilidade com scripts que usam `docker`:
```bash
echo "alias docker=podman" >> ~/.bashrc
echo "alias docker-compose=podman-compose" >> ~/.bashrc
source ~/.bashrc
```

---

## 3. NGINX

```bash
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

### Config: frontend estático

```bash
# Garante que a variável está definida antes de continuar
[ -z "$DOMINIO" ] && echo "ERRO: defina DOMINIO primeiro" && exit 1

cat > /etc/nginx/sites-available/portfolio << EOF
server {
    listen 80;
    server_name $DOMINIO www.$DOMINIO;

    root /var/www/portfolio;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
```

### Config: backend API (reverse proxy para Podman)

```bash
[ -z "$DOMINIO" ] && echo "ERRO: defina DOMINIO primeiro" && exit 1

cat > /etc/nginx/sites-available/portfolio-api << EOF
server {
    listen 80;
    server_name api.$DOMINIO;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
```

### Ativar configs

```bash
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## 4. SSL (acme.sh + Let's Encrypt)

### Instalar acme.sh

```bash
apt install curl socat -y
curl https://get.acme.sh | sh -s email=samucapanzera@gmail.com
source ~/.bashrc
acme.sh --version
```

### Emitir certificado (webroot challenge)

```bash
acme.sh --issue \
  -d samuelpanzera.com.br \
  -d www.samuelpanzera.com.br \
  -d api.samuelpanzera.com.br \
  -w /var/www/portfolio \
  --force
```

Certs serão salvos em: `~/.acme.sh/samuelpanzera.com.br/`

### Configurar renovação automática

```bash
acme.sh --install-cronjob
crontab -l | grep acme.sh   # verificar
```

### Atualizar NGINX para usar os certs

```bash
cat > /etc/nginx/sites-available/portfolio << 'EOF'
server {
    listen 80;
    server_name samuelpanzera.com.br www.samuelpanzera.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name samuelpanzera.com.br www.samuelpanzera.com.br;

    ssl_certificate /root/.acme.sh/samuelpanzera.com.br/samuelpanzera.com.br.cer;
    ssl_certificate_key /root/.acme.sh/samuelpanzera.com.br/samuelpanzera.com.br.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

cat > /etc/nginx/sites-available/portfolio-api << 'EOF'
server {
    listen 80;
    server_name api.samuelpanzera.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.samuelpanzera.com.br;

    ssl_certificate /root/.acme.sh/samuelpanzera.com.br/samuelpanzera.com.br.cer;
    ssl_certificate_key /root/.acme.sh/samuelpanzera.com.br/samuelpanzera.com.br.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

nginx -t && systemctl reload nginx
```

---

## 5. Backend Go (Podman + Quadlet)

> A VPS não armazena código-fonte. Imagens são buildadas pelo GitHub Actions e publicadas no GHCR. Os arquivos `.container` (Quadlet) versionados em `infra/` no repositório são sincronizados na VPS via CI/CD e o systemd cuida de tudo.

### Como funciona Quadlet

`Arquivos .container` em `/etc/containers/systemd/` viram automaticamente services do systemd após `daemon-reload`. Não usa daemon, integra com `journalctl`, e o `[Install] WantedBy=` controla auto-start no boot **sem precisar de `systemctl enable`**.

### Passo 5.1 — Criar usuário `deploy` (uma vez)

```bash
useradd -m -s /bin/bash deploy
mkdir -p /home/deploy/.ssh

# Cole a chave pública SSH gerada localmente
cat > /home/deploy/.ssh/authorized_keys << 'EOF'
SUA_CHAVE_PUBLICA_AQUI
EOF

chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

# Permitir podman + systemctl sem senha
cat > /etc/sudoers.d/deploy << 'EOF'
deploy ALL=(ALL) NOPASSWD: /usr/bin/podman, /bin/systemctl
EOF
chmod 440 /etc/sudoers.d/deploy
```

### Passo 5.2 — Preparar diretório do Quadlet

```bash
mkdir -p /etc/containers/systemd
chown deploy:deploy /etc/containers/systemd
```

> O CI/CD vai escrever os arquivos `.container` aqui via SCP. Como o usuário `deploy` já tem `sudo NOPASSWD: podman` (efetivamente root), não há perda de segurança em deixar este diretório com ownership do `deploy`.

### Passo 5.3 — Configurar Secrets no GitHub

Repositório GitHub → **Settings → Secrets and variables → Actions** → **New repository secret**:

| Secret | Valor |
|---|---|
| `VPS_HOST` | IP da VPS |
| `VPS_SSH_USER` | `deploy` |
| `VPS_SSH_KEY` | Conteúdo da chave privada SSH dedicada |

`GITHUB_TOKEN` é automático.

### Passo 5.4 — Tornar o pacote GHCR público

Após o primeiro push de `apps/backend/**`, o workflow gera a imagem no GHCR. Antes do primeiro deploy:

1. Acesse https://github.com/samuelpanzera?tab=packages
2. Clique em `portfolio-api`
3. **Package settings → Change visibility → Public**

Sem isso, `podman pull` falha com `unauthorized`.

### Passo 5.5 — Primeiro deploy

Após o workflow rodar com sucesso (build + sync do `.container` + restart), a primeira vez precisa de uma intervenção:

```bash
# Como root (ou com sudo), na VPS:
systemctl daemon-reload    # Quadlet gera o service file de portfolio-api.container
systemctl start portfolio-api
systemctl status portfolio-api
journalctl -u portfolio-api -f   # acompanhar logs
```

A partir daqui, todos os deploys subsequentes são automáticos pelo workflow.

### Deploys futuros (automático)

Push em `apps/backend/**` ou `infra/portfolio-api/**`:
1. Workflow builda imagem → push GHCR (com cache)
2. SCP do `.container` para `/etc/containers/systemd/`
3. SSH na VPS: `sudo podman pull && sudo systemctl daemon-reload && sudo systemctl restart portfolio-api`

Para alterar config (porta, env vars, etc.): edite `infra/portfolio-api/portfolio-api.container`, commit, push.

### Adicionando um novo serviço

Veja `infra/README.md`. Resumo:
1. Criar `infra/<projeto>/<projeto>.container` no repo
2. Criar workflow espelhando `deploy-api.yml`
3. Adicionar config NGINX para o subdomínio
4. Push → systemd descobre e starta sozinho na VPS

---

## 6. Frontend estático

> Buildado pelo GitHub Actions e enviado via rsync (com `--delete` — remove arquivos antigos órfãos). Para o primeiro deploy, faça manualmente:

```bash
# Rodar LOCALMENTE:
rsync -avz --delete apps/frontend/dist/ deploy@<IP_DA_VPS>:/var/www/portfolio/
```

> O `deploy` user precisa ter permissão de escrita em `/var/www/portfolio/`. Na VPS:
> ```bash
> chown -R deploy:deploy /var/www/portfolio
> ```

### Deploys futuros (automático via CI/CD)

Qualquer push em `apps/frontend/**` no branch `master` dispara `.github/workflows/deploy-frontend.yml`, que builda e envia o `dist/` para a VPS via rsync com `--delete`.

---

## 7. Verificação final

```bash
# Infraestrutura
ufw status
podman ps
nginx -t

# Serviços HTTP(S)
curl -I https://$DOMINIO
curl https://api.$DOMINIO/api/health

# SSL
certbot certificates
```

---

## Padrão para adicionar novos serviços no futuro

1. Adicionar novo serviço no `docker-compose.yml` com porta única (ex: `127.0.0.1:3001:3001`)
2. Criar config NGINX:
   ```bash
   cat > /etc/nginx/sites-available/novo-servico << EOF
   server {
       listen 80;
       server_name novo.samuelpanzera.com.br;
       location / { proxy_pass http://127.0.0.1:3001; }
   }
   EOF
   ln -s /etc/nginx/sites-available/novo-servico /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```
3. Emitir SSL: `certbot --nginx -d novo.samuelpanzera.com.br`
4. Deploy: `podman-compose up -d --no-deps novo-servico`
