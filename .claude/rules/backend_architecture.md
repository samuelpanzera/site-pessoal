---
trigger: glob
description: "Regras e padrões de arquitetura para a aplicação Go no diretório apps/backend."
globs: apps/backend/**/*
---

# Padrões de Arquitetura Backend (Golang)

Estas regras aplicam-se **exclusivamente** ao diretório `apps/backend` (e subdiretórios correspondentes) e definem a estrutura, as convenções e as melhores práticas para o desenvolvimento do backend em Go (Golang). A arquitetura estabelecida segue princípios de "Clean Architecture", adaptados de maneira idiomática ao ecossistema Go para proporcionar modularidade, segurança e excelente testabilidade.

## Estrutura de Diretórios

A organização das pastas baseia-se fortemente na utilização do diretório especial `internal/`, garantindo encapsulamento rígido onde o código da regra de negócios não pode ser acessado de fora do escopo principal.

```text
meu-projeto/ (ou apps/backend/)
├── cmd/
│       └── main.go       # Ponto de entrada. Configura logs, DB e sobe o servidor HTTP.
├── internal/             # Código privado do projeto (ninguém de fora consegue importar)
│   ├── handler/          # Camada de Apresentação (Recebe a requisição HTTP/JSON)
│   ├── service/          # Camada de Negócio (Aplica as regras, validações)
│   └── repository/       # Camada de Dados (Faz os SELECTs/INSERTs no banco)
├── go.mod                # Gerenciador de dependências do módulo Go
└── go.sum                # Arquivo gerado de checksum das dependências do Go
```

## Diretrizes Arquiteturais e Boas Práticas

### 1. Separação de Camadas (Separation of Concerns)

A aplicação é dividida em três camadas distintas dentro do `internal/`, além de uma camada de infraestrutura inicial em `cmd/`:

*   **`cmd/main.go` (Configuração e Entry Point):** Este não é um local para regras de negócio. O `main.go` tem responsabilidades cruciais de *bootstrap*: ler variáveis de ambiente, estabelecer a conexão com o banco de dados (PostgreSQL, MySQL, etc.), instanciar repositórios, serviços e handlers, e por fim injetar as dependências até inicializar o router (servidor HTTP).
*   **`internal/handler/` (Apresentação/Delivery):** Essa camada se comunica diretamente com a web. É o lugar onde você extrai parâmetros da URL, headers e desserializa dados de requisição (`JSON`, `multipart/form-data`, etc.). Seu trabalho é receber a chamada, passá-la para a camada de Service, e depois transformar a resposta (ou erro) em uma resposta HTTP adequada (ex: formatação JSON e status codes 200, 400, 500). **Atenção:** Não deve existir nenhuma lógica de banco de dados ou regra de domínio no handler.
*   **`internal/service/` (Core e Lógica de Negócio):** É o coração do software. Toda a lógica de regras da aplicação, algoritmos, validações complexas de entidade e chamadas coordenadas ao banco devem residir aqui. Os Services não conhecem sobre HTTP (não devem ter referências ao pacote `net/http`) nem detalhes sobre a implementação do banco de dados (devem interagir utilizando interfaces).
*   **`internal/repository/` (Acesso a Dados):** Esta camada é a única autorizada a interagir diretamente com bancos de dados. Ela converte o pedido lógico (ex: `BuscarUsuarioPorID`) numa execução física (via Driver SQL, `sqlx`, ou GORM), monta os Models de Banco (Tabelas) e os transforma nas *Structs* (Entidades) usadas pelo Go.

### 2. Encapsulamento com `internal/`

O diretório `internal/` é uma restrição imposta pelo próprio compilador do Go. Nenhum código externo (outros repositórios, ou diretórios de nível superior que não descendam de `internal/` ou seus parentes) pode importar os pacotes criados ali. Isso impede o acoplamento excessivo e obriga as conexões externas a passarem estritamente pelos binários gerados pelo `cmd/`.

### 3. Injeção de Dependência

A comunicação entre `handler -> service -> repository` deve ocorrer sempre injetando a dependência inferior na camada superior através de **Interfaces**.
Por exemplo, o Service recebe uma interface de Repositório (`UserRepository`) em sua construção (uma função construtora como `NewUserService(repo UserRepository)`).
O benefício imediato é a facilidade em criar Mocks dessa interface na hora de implementar testes unitários de regras de negócio no Service, sem precisar subir uma instância de banco de dados.

### 4. Nomenclatura, Estilo e Convenções Go

*   Siga as convenções de código do [Effective Go](https://go.dev/doc/effective_go).
*   A nomenclatura de pacotes deve ser curta, sem capitalização e sem *underscores* (`_`). Utilize apenas: `handler`, `service`, `repository`.
*   O retorno do erro sempre deve ser gerenciado (o famoso `if err != nil`). Lide com o erro no local, ou enriqueça o erro e passe para a camada de cima. Nunca engula um erro sem tratá-lo ou anotá-lo em log.
*   Estruturas (`structs`) que precisam ser visíveis fora de seu pacote precisam iniciar com Letra Maiúscula (PascalCase). Dados e atributos não exportados iniciam em letra minúscula (camelCase).

### 5. Tratamento de Erros e Transparência HTTP

Erros lançados pelas camadas internas (como falha em driver de banco no repositório) **não devem** chegar transparentes até o cliente da API (vazamento de stack trace ou query SQL gera risco de segurança). A camada `handler` deve receber o erro do Service, logar os detalhes sensíveis via um `logger`, e traduzir esse erro numa mensagem amigável (como "Recurso não encontrado") combinada com o código `HTTP 404` ou `500`.