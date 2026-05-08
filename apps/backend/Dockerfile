FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o api ./cmd/

FROM alpine:3.21
RUN apk add --no-cache ca-certificates wget && \
    adduser -D -u 1000 app
WORKDIR /app
COPY --from=builder /app/api .
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1
CMD ["./api"]
