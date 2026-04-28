# Feature Specification: PDI Portfolio First Page

**Feature Branch**: `[001-pdi-portfolio]`  
**Created**: 2026-04-27  
**Status**: Draft  

## Visão Geral (Overview)

**Propósito:** Construir a página inicial do portfólio "DEV_VOID" de um Desenvolvedor Back-end ("Samuel"). O objetivo é demonstrar expertise técnica, projetos desenvolvidos, stack de tecnologias (com ênfase em sistemas distribuídos e otimização cloud-native) e um diário de execução (Execution Log).
**Problema Resolvido:** Fornece um cartão de visitas digital de altíssimo desempenho e design imersivo (Cyber-Atmospheric / Void) que destaca as habilidades do desenvolvedor de forma única, em vez de um portfólio genérico. O acesso restrito ao PDI (Plano de Desenvolvimento Individual) integrado incentiva a exploração contínua de sua carreira.

## Jornada do Usuário (User Flows)

### 1. Descoberta Inicial (Hero & Animação) (Priority: P1)
O usuário acessa o site e é recebido por uma interface escura (Void) com luminosidade pulsante (roxo #4B0082). A seção Hero apresenta o desenvolvedor, sua especialidade e exibe uma animação de arquitetura de software (gerada via script), que adiciona complexidade e profissionalismo sem sobrepor o texto.

**Acceptance Scenarios**:
1. **Given** o usuário acessa a raiz `/`, **When** a página carrega, **Then** a animação de arquitetura inicia automaticamente de forma fluida.

### 2. Exploração Técnica (Tech Stack & Projetos) (Priority: P2)
O usuário faz scroll para baixo para ler o "MAIN OBJECTIVE", avaliar as habilidades (Skills Container com barras de progresso estilo terminal unificadas) e visualizar os projetos em um grid organizado.

**Acceptance Scenarios**:
1. **Given** o usuário está na seção de projetos ou tech stack, **When** ele interage com os "Project Cards" ou skills, **Then** os elementos se iluminam de acordo com as regras do "Luminous Depth".

### 3. Acompanhamento de Execução (Execution Log) (Priority: P3)
O usuário rola até o "Execution Log" para ler uma linha do tempo vertical de atualizações de carreira ou de arquiteturas recentes.

**Acceptance Scenarios**:
1. **Given** a renderização da timeline de Logs, **When** visualizada, **Then** os logs (entry1, entry2) são listados sequencialmente.

### 4. Acesso ao PDI Restrito (Priority: P4)
No botão de navegação "PDI" (com ícone de cadeado) ou no CTA da PDI Section ("VER PDI COMPLETO").

**Acceptance Scenarios**:
1. **Given** o usuário tenta acessar o PDI, **When** ele clica no CTA, **Then** o sistema executa o fluxo simulado (mock) de Autenticação Google antes de liberar o acesso.

## Regras de Negócio e Lógica

- **Design System:** Estritamente baseado no `designs/desgin-pdi.pen`. Paleta "Obsidian Pulse", fontes Space Grotesk e Manrope. Efeitos de profundidade baseados em `box-shadow` com blurs (30px-60px) e cores rgba do `#4B0082`.
- **Animação da Arquitetura:** A animação Hero deve assentar-se atrás do conteúdo principal (Z-index apropriado) e possuir performance otimizada, refletindo conceitos de cloud e microsserviços.
- **Divisores de Seção:** Entre cada seção principal existe um frame `divider` linear (transparente a roxo e transparente novamente).
- **Arquitetura Vite + Go:** O Front-end será consumido em Vite/React com Tailwind configurado. A interface deve estar totalmente tipada para, na próxima fase, receber os dados formatados das APIs Golang.

## Critérios de Aceite (Acceptance Criteria)

- **SC-001 (Performance):** A renderização inicial da página (First Contentful Paint) acontece em menos de 1.5s, mesmo com as animações.
- **SC-002 (Design Accuracy):** Todos os componentes (Navigation, Hero, Tech, Projects, Log, PDI, Footer) estão presentes e fiéis visualmente ao arquivo `.pen`.
- **SC-003 (Componentes Interativos):** Botões (CTAs) e Cards reagem ao `hover` com intensificação de brilho nas bordas de 1px sólido purple e soft drop shadows internos/externos.
- **SC-004 (Responsividade Mobile):** A visualização em telas < 768px empilha o grid de projetos para coluna única e redimensiona a tipografia de forma harmônica.

## Edge Cases (Casos de Exceção)

- **Falha/Lentidão no Script de Animação:** Se o `arch-generator.js` falhar, um placeholder sutil escuro (ou layout void) será mantido para não quebrar a estética.
- **Requisições de Dados Faltantes (Mock/Futuro):** Se a lista de "Projetos" ou "Execution Log" estiver vazia, exibir mensagem "Awaiting new records..." com estilo terminal de forma elegante.
- **Problema de Hover em Mobile:** Efeitos de hover devem ser traduzidos para toques sutis no mobile ou ignorados em dispositivos touch sem perder legibilidade.

## Fora de Escopo (Out of Scope)

- Conexão *real* com o banco de dados no Backend em Golang (os dados do front serão estáticos/mockados inicialmente até a infra estar 100% pronta).
- Fluxo completo de Login OAuth 2.0 (usaremos o Mock estabelecido previamente).
- Painel Administrativo de Criação de Projetos/Logs.
