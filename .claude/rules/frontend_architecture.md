---
trigger: glob
description: Regras e padrões de arquitetura para a aplicação React no diretório apps/frontend.
globs: apps/frontend/**/*
---

# Padrões de Arquitetura Frontend

Estas regras aplicam-se **exclusivamente** ao diretório `apps/frontend` e definem a estrutura, as convenções e as melhores práticas para o desenvolvimento em React/TypeScript.

## Estrutura de Diretórios (Modular React Architecture)

A organização de pastas segue uma abordagem modular, focada em responsabilidades claras:

```text
/ (raiz do projeto frontend)
  ├── index.html         # Ponto de entrada HTML utilizado pelo Vite
  ├── vite.config.ts     # Configurações de build e dev server
  ├── package.json       # Dependências e scripts do frontend
  └── /src               # Código-fonte principal da aplicação
      ├── main.tsx       # Entry point do React (renderiza App no DOM)
      ├── App.tsx        # Componente raiz e configuração global (Providers/Rotas)
      ├── /assets        # Arquivos estáticos globais (imagens, fontes, vetores, CSS base)
      ├── /components    # Componentes de UI puros, isolados e reutilizáveis
      ├── /pages         # Componentes de tela inteira (Containers de regras e roteamento)
      ├── /hooks         # Hooks customizados para encapsular regras de negócio e estado
      ├── /services      # Integração com APIs externas, backend (fetch/axios)
      ├── /utils         # Funções puras, helpers, formatadores (sem dependência do React)
      └── /types         # Definições globais de interfaces e tipagens do TypeScript
```

##  Diretrizes Arquiteturais (Clean Code & Boas Práticas)

### 1. Separação de Responsabilidades (Separation of Concerns)
*   **Componentes (`/components`)**: Devem ser majoritariamente **"Burros" (Presentational)**. Sua única função é receber `props` e renderizar a interface UI. Não devem fazer chamadas de API diretamente nem gerenciar estados globais complexos.
*   **Páginas (`/pages`)**: Devem atuar como **"Inteligentes" (Containers)**. São responsáveis por orquestrar a tela, invocar `/hooks`, gerenciar o estado da rota, lidar com requisições e passar os dados via props para os componentes.
*   **Lógica de Negócio (`/hooks`)**: Qualquer lógica complexa de estado, manipulação de dados ou regra de negócio deve ser extraída para um Hook customizado (`useSomething`), facilitando o reuso e os testes.
*   **Comunicação Externa (`/services`)**: Funções de rede e chamadas ao Backend devem residir exclusivamente aqui. Nenhuma URL de API ou lógica de fetch deve estar "hardcoded" dentro de um componente React.

### 2. Padrões de Nomenclatura (Naming Conventions)
*   **Componentes e Páginas**: Utilizar `PascalCase` (ex: `Button.tsx`, `HeroSection.tsx`, `Home.tsx`).
*   **Hooks**: Utilizar `camelCase` sempre com o prefixo `use` (ex: `useAuth.ts`, `useFetchData.ts`).
*   **Serviços e Utils**: Utilizar `camelCase` (ex: `apiService.ts`, `dateFormatter.ts`).
*   **Tipos e Interfaces**: Utilizar `PascalCase`. Prefira nomes que descrevam claramente o dado (ex: `UserProps`, `ApiErrorResponse`).
*   **Arquivos**: Cada arquivo deve conter apenas **uma** entidade principal exportada, facilitando a busca e organização.

### 3. Tipagem Rigorosa (TypeScript Strict Mode)
*   Uso **obrigatório** de TypeScript em todos os arquivos (`.ts`, `.tsx`).
*   É **estritamente proibido** o uso de `any`. Utilize tipagens estritas, ou `unknown` caso o formato inicial da variável seja desconhecido.
*   As propriedades recebidas por componentes devem estar sempre tipadas via `interface` ou `type`.

### 4. Estilização e Design System
*   O projeto deve utilizar **Tailwind CSS** alinhado com as diretrizes da marca documentadas no arquivo `design.md` (Obsidian Pulse).
*   **Evite** o uso de estilos inline (`style={{...}}`). Utilize o inline apenas em cenários onde propriedades dinâmicas e variáveis em tempo real (como coordenadas do mouse ou animações) precisem ser passadas ao DOM e não possam ser resolvidas pelo Tailwind.
*   Mantenha coerência visual consumindo variáveis globais ou tokens definidos na arquitetura.

### 5. Performance e Otimização
*   Construa com a prevenção de re-renders desnecessários em mente. Para componentes com lógica pesada ou listas extensas, utilize `React.memo`, `useMemo` ou `useCallback` estrategicamente.
*   Mantenha o estado o mais próximo possível de onde ele é utilizado. Se apenas um botão precisa de um estado de "loading", o estado deve residir nele ou no seu container mais imediato, não na aplicação toda.

### 6. Funções Puras e Testabilidade
*   Sempre que uma lógica matemática, manipulação de string/array, ou formatação de dados não precisar de nenhuma API do React (como estado ou ciclo de vida), ela deve ser extraída para uma função pura no diretório `/utils`. Isso simplifica testes e desacopla a UI da lógica de processamento.