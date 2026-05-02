---
trigger: always_on
description: Princípios globais de engenharia de software (Clean Code, SOLID e uso de bibliotecas).
---

# Princípios Globais de Engenharia de Software

Estas diretrizes devem ser **sempre** aplicadas, independentemente da linguagem de programação ou da camada (Frontend ou Backend). Elas orientam a qualidade, manutenibilidade e sustentabilidade de todo o código gerado neste projeto.

## 1. Don't Reinvent the Wheel (Não reinvente a roda)

*   **Utilize Bibliotecas Consolidadas:** Antes de escrever do zero um algoritmo complexo, utilitário de formatação, criptografia, ou criar componentes visuais extremamente comuns, verifique se existe uma biblioteca madura, testada e bem mantida (no ecossistema Go ou NPM).
*   **Foco no Valor de Negócio:** O tempo e o esforço devem ser direcionados a resolver o problema real e exclusivo da aplicação. Solucionar problemas genéricos já resolvidos pela comunidade é um desperdício de energia.
*   **Segurança e Estabilidade:** Bibliotecas populares são constantemente testadas e auditadas por milhares de desenvolvedores. Construir ferramentas do zero frequentemente insere bugs ou vulnerabilidades inesperadas.

## 2. Princípios SOLID

O design e a arquitetura do código devem sempre seguir os princípios SOLID para garantir flexibilidade e escalabilidade:

*   **S - Single Responsibility Principle (SRP):** Cada arquivo, classe, função ou componente deve ter uma única responsabilidade e apenas um motivo para mudar. Funções não devem assumir trabalhos duplos.
*   **O - Open/Closed Principle (OCP):** O código deve estar aberto para extensão, mas fechado para modificação. Use interfaces, middlewares e polimorfismo para adicionar novos comportamentos sem alterar o código existente.
*   **L - Liskov Substitution Principle (LSP):** O código deve ser capaz de usar implementações de uma mesma interface de forma intercambiável sem quebrar o sistema.
*   **I - Interface Segregation Principle (ISP):** Crie interfaces pequenas e específicas ao invés de grandes interfaces monolíticas ("gordas"). Uma classe/struct não deve ser forçada a implementar funções que não usa.
*   **D - Dependency Inversion Principle (DIP):** Dependa de abstrações (interfaces/types), não de classes ou bibliotecas concretas. Utilize Injeção de Dependência em larga escala (seja no Go passando structs via construtor, seja no React via Context/Props).

## 3. Clean Code & Boas Práticas

Um código limpo é lido e compreendido muito mais facilmente do que é escrito. Pense no próximo desenvolvedor que irá ler.

*   **Nomes Significativos:** Variáveis, métodos e classes devem revelar imediatamente sua intenção. Evite acrônimos ou variáveis com apenas 1 letra (com exceção de contadores de loop tradicionais como `i` ou short-names em receivers no Go, desde que estritamente sob convenção). Ex: Use `getUserPermissions` em vez de `getPerms`.
*   **Funções Pequenas:** Uma função ideal deve ser pequena e fazer exatamente aquilo que o seu nome propõe. Se uma função for longa, separe-a em funções auxiliares privadas.
*   **KISS (Keep It Simple, Stupid):** Priorize a legibilidade e a simplicidade. Uma solução óbvia que resolva o problema perfeitamente é sempre melhor do que uma solução "over-engineered" apenas para provar capacidade técnica.
*   **DRY (Don't Repeat Yourself):** Elimine duplicações abstraindo lógicas repetidas para arquivos de `utils/`, funções `helpers` genéricas, ou classes base/services.
*   **Comentários Têm Custo:** Um código bem escrito documenta a si mesmo através de seus nomes. Comentários devem justificar o *porquê* (uma decisão de negócios obscura, um work-around de biblioteca) e não *o que* (descrever a linha seguinte do código).
*   **Tratamento de Erros Explícito:** Nunca ignore um erro (nunca use `try...catch` vazio, nunca silencie um `err != nil`). Lide com os erros na hora ou repasse-os explicitamente com contexto, criando abstrações de erro legíveis.
