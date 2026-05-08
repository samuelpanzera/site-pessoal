# Infrastructure (Quadlet)

Cada subdiretório representa um projeto/serviço deployado na VPS.
Os arquivos `.container`, `.network`, `.volume`, `.pod` são processados pelo Quadlet do Podman e convertidos em systemd units automaticamente.

## Estrutura

```
infra/
├── portfolio-api/
│   └── portfolio-api.container         # API do portfólio (Go/Fiber)
└── <futuro-projeto>/
    ├── <projeto>.network               # rede interna (se múltiplos containers)
    ├── <projeto>-api.container
    ├── <projeto>-db.container
    └── <projeto>-db.volume
```

## Adicionando um novo serviço

1. Criar diretório: `infra/<nome-do-projeto>/`
2. Adicionar arquivos `.container` (e opcionalmente `.network`, `.volume`)
3. Criar workflow em `.github/workflows/deploy-<nome>.yml` espelhando o `deploy-api.yml`
4. Configurar uma porta única em `127.0.0.1:<PORTA>:<PORTA>` (ex: 3001, 3002...)
5. Adicionar config NGINX no servidor para `proxy_pass` para essa porta
6. Push → CI/CD deploya sozinho

## Como o Quadlet funciona

Na VPS, os arquivos `.container` são copiados para `/etc/containers/systemd/`.
Quando você roda `systemctl daemon-reload`, o Quadlet (generator do systemd) lê esses arquivos e gera units `.service` correspondentes em tempo real.

Exemplo: `portfolio-api.container` → `portfolio-api.service`

A partir daí, é só usar `systemctl` normal:
- `systemctl start portfolio-api`
- `systemctl status portfolio-api`
- `journalctl -u portfolio-api -f`

A flag `WantedBy=multi-user.target` no `[Install]` faz auto-start no boot — **sem precisar de `systemctl enable`** (limitação/feature dos generators).

## Local development

Quadlet é só pra produção. Pra rodar localmente:
```bash
podman build -t portfolio-api ./apps/backend
podman run -p 3000:3000 -e PORT=3000 portfolio-api
```

Ou rode o Go nativo: `cd apps/backend && go run ./cmd/`
