FROM oven-sh/setup-bun:1.1.0-alpine AS builder
WORKDIR /app

# Copia arquivos de configuração do monorepo para instalar dependências
COPY package.json bun.lock turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN bun install --frozen-lockfile

# Copia o código fonte do frontend e executa o build
COPY apps/frontend ./apps/frontend
RUN bunx turbo build --filter=frontend

# Servidor web Nginx leve para servir os arquivos estáticos compilados
FROM nginx:1.27-alpine
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
