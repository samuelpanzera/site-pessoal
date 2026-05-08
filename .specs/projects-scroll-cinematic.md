# Spec: Projects — Scroll Cinematic Experience

**Status:** Ideia / Rascunho  
**Área:** `apps/frontend/src/components/Projects.tsx` + nova página dedicada  
**Dependências:** Framer Motion (já instalado), GSAP ScrollTrigger (a avaliar)

---

## Visão Geral

Transformar a seção de projetos de um grid estático em uma **experiência cinematográfica de scroll**. O usuário desce a página e cada projeto "acontece" — com animações contextuais ligadas ao tema do projeto. O projeto BalizaApp, por ser sobre instrutores de trânsito, dispara a animação principal: um carro cruzando a tela horizontalmente enquanto o card entra em cena.

A lógica é: **cada projeto tem sua própria animação temática**, tornando a seção única e memorável para quem visita o portfólio.

---

## Estrutura da Página

A seção de projetos deixa de ser um grid e passa a ser uma **lista vertical de cenas de scroll**, full-width. Cada projeto ocupa `100vh` (ou `min-h-screen`), com o card centralizado e a animação acontecendo ao redor.

```
┌─────────────────────────────────────┐  ← viewport
│                                     │
│   [cena do projeto 1 — Nark]        │  100vh
│                                     │
├─────────────────────────────────────┤
│                                     │
│   [cena do projeto 2 — BalizaApp]   │  100vh  ← carro passa aqui
│                                     │
├─────────────────────────────────────┤
│                                     │
│   [cena do projeto 3 — Turnery]     │  100vh
│                                     │
└─────────────────────────────────────┘
```

---

## Animações por Projeto

### 1. Nark (plataforma Steam challenger)
**Tema:** universo gamer / interface de sistema / terminal

- Fundo: partículas de pixels caindo (estilo chuva de matrix, cor roxa `#4b0082`)
- Card entra com efeito de "boot de terminal" — texto aparece caractere a caractere
- Tech stack chips surgem com delay em cascata
- Borda do card pulsa suavemente (já existe `glow-purple`, amplificar no scroll)

### 2. BalizaApp (instrutores de trânsito)
**Tema:** pista de asfalto, trânsito urbano

- **Animação principal:** enquanto o card faz `fade-in` + `slide-up`, um **carro SVG** entra pela esquerda, percorre a tela horizontalmente e sai pela direita
- Velocidade do carro sincronizada com o progresso do scroll na seção
- Faixa de asfalto aparece no fundo (tira horizontal com tracejado branco animado)
- Faróis do carro emitem glow amarelo ao passar
- Seta de "Explore Project →" aparece como semáforo abrindo no verde

### 3. Turnery (usinagem de peças)
**Tema:** metal, indústria, precisão mecânica

- Fundo: grade isométrica de blueprints (linhas finas azul-cinza)
- Engrenagem SVG gira lentamente em `background`, sincronizada ao scroll
- Card entra com efeito de "montagem" — partes surgem de ângulos diferentes e se encaixam
- Tech stack chips aparecem com som visual (brilho metálico ao entrar)

---

## Arquitetura Técnica

### Componentes novos

```
apps/frontend/src/
├── components/
│   ├── projects/
│   │   ├── ProjectScene.tsx        ← wrapper de cena (100vh, scroll-snap opcional)
│   │   ├── scenes/
│   │   │   ├── NarkScene.tsx
│   │   │   ├── BalizaScene.tsx     ← carro SVG + asfalto
│   │   │   └── TurneryScene.tsx
│   │   └── assets/
│   │       ├── CarSVG.tsx          ← carro vetorial animável
│   │       └── GearSVG.tsx
```

### Scroll Engine

**Opção A — Framer Motion `useScroll` + `useTransform`** (preferível, já instalado):
```tsx
const { scrollYProgress } = useScroll({ target: sectionRef });
const carX = useTransform(scrollYProgress, [0, 1], ['-120%', '120%']);
```

**Opção B — GSAP ScrollTrigger** (mais poderoso para timelines complexas, mas adiciona ~30kb):
```ts
ScrollTrigger.create({ trigger: '.baliza-scene', scrub: 1, ... })
```

**Recomendação:** começar com Framer Motion (zero dependência nova). Migrar para GSAP somente se as timelines ficarem muito complexas.

### Hook de controle

```ts
// hooks/useProjectScene.ts
export function useProjectScene(projectId: string) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return { ref, scrollYProgress };
}
```

---

## Comportamento Responsivo

- Mobile (`< md`): animações simplificadas (sem carro, apenas fade-in dos cards)
- Tablet/Desktop: experiência completa
- `prefers-reduced-motion`: desativar todas as animações contextuais, manter apenas fade suave

```tsx
const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
```

---

## Fases de Implementação

| Fase | Escopo | Estimativa |
|------|--------|------------|
| 1 | Estrutura de cenas (scroll-snap, layout 100vh por projeto) | Pequeno |
| 2 | BalizaApp: carro SVG + asfalto sincronizado ao scroll | Médio |
| 3 | Nark: partículas + efeito terminal | Médio |
| 4 | Turnery: engrenagem + montagem de card | Médio |
| 5 | Responsividade + `prefers-reduced-motion` | Pequeno |

---

## Referências Visuais

- Awwwards sites com scroll storytelling (Apple iPhone pages, Linear.app)
- Efeito de carro: similar ao que [Bruno Simon](https://bruno-simon.com/) faz com Three.js, mas em 2D com SVG/CSS
- Terminal boot: efeito clássico de CLI com `typewriter` + cursor piscando

---

## Decisões em Aberto

- [ ] Scroll snap entre projetos? (melhora UX mas pode frustrar scroll natural)
- [ ] O carro do BalizaApp é um SVG inline desenhado do zero ou um asset externo?
- [ ] GSAP ou manter 100% Framer Motion?
- [ ] A seção de projetos vira uma página separada (`/projects`) ou continua na Home?
