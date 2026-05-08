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

## 5. Backend Go (Podman)

> A VPS não armazena código-fonte. A imagem é buildada pelo GitHub Actions e publicada no GHCR. A VPS só faz `podman pull`.

### Pré-requisito: configurar Secrets no GitHub

No repositório GitHub → **Settings → Secrets and variables → Actions**, adicionar:

| Secret | Valor |
|---|---|
| `VPS_HOST` | IP da VPS |
| `VPS_SSH_KEY` | Conteúdo da chave privada SSH (`~/.ssh/id_rsa` ou similar) |

O `GITHUB_TOKEN` é automático — não precisa criar.

### Primeiro deploy manual (antes do CI/CD estar rodando)

```bash
# Baixar a imagem publicada pelo GitHub Actions
podman pull ghcr.io/samuelpanzera/portfolio-api:latest

# Rodar o container
podman run -d \
  --name portfolio-api \
  --restart always \
  -p 127.0.0.1:3000:3000 \
  -e PORT=3000 \
  ghcr.io/samuelpanzera/portfolio-api:latest

podman ps
podman logs portfolio-api
```

### Auto-start no boot (sem daemon)

```bash
podman generate systemd --name portfolio-api --restart-policy=always --files
mv container-portfolio-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable container-portfolio-api
systemctl start container-portfolio-api
systemctl status container-portfolio-api
```

### Deploys futuros (automático via CI/CD)

Qualquer push em `apps/backend/**` no branch `master` dispara o workflow `.github/workflows/deploy-api.yml`, que:
1. Builda a imagem
2. Faz push para `ghcr.io/samuelpanzera/portfolio-api:latest`
3. Conecta na VPS via SSH e reinicia o container

---

## 6. Frontend estático

> Buildado pelo GitHub Actions e enviado via SCP. Para o primeiro deploy, faça manualmente:

```bash
# Rodar LOCALMENTE:
scp -r apps/frontend/dist/* root@<IP_DA_VPS>:/var/www/portfolio/
```

### Deploys futuros (automático via CI/CD)

Qualquer push em `apps/frontend/**` no branch `master` dispara `.github/workflows/deploy-frontend.yml`, que builda e envia o `dist/` para a VPS automaticamente.

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
