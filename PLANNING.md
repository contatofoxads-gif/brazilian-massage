# Brazilian Massage — Funnel Planning
**Executor:** Codex  
**Supervisor:** Claude (revisor e arquiteto)  
**Objetivo:** Construir funil completo de vendas para curso de massagem brasileira vendido para homens 45+ no mercado internacional.

---

## Visão Geral do Funil

```
Meta Ad → /q1 → /q2 → /q3 → /q4 → /q5 → /result → /invite → Telegram Group → Stripe Payment
```

- **Produto:** Brazilian Massage (curso online)
- **Expert:** Camila
- **Preço:** $97 USD
- **Público:** Homens 45+, EUA, Reino Unido, Canadá, Europa
- **Hospedagem:** Vercel (free tier)
- **Repositório:** https://github.com/contatofoxads-gif/brazilian-massage.git
- **Pagamento:** Stripe + PayPal (configurado depois do primeiro recebimento)

---

## Stack Técnica

- **HTML5 + CSS3 puro** — sem frameworks, sem dependências, carrega rápido
- **JavaScript vanilla** — lógica do quiz e localStorage
- **Google Fonts** — Playfair Display (títulos) + Inter (corpo)
- **Vercel** — deploy automático via GitHub, HTTPS incluso

---

## Estrutura de Arquivos

```
/
├── index.html              ← redireciona automaticamente para /q1
├── q1/
│   └── index.html          ← Pergunta 1
├── q2/
│   └── index.html          ← Pergunta 2
├── q3/
│   └── index.html          ← Pergunta 3
├── q4/
│   └── index.html          ← Pergunta 4
├── q5/
│   └── index.html          ← Pergunta 5
├── result/
│   └── index.html          ← Página de resultado personalizado
├── invite/
│   └── index.html          ← Bridge page — convite para o Telegram
├── css/
│   └── style.css           ← CSS global compartilhado por todas as páginas
├── js/
│   └── quiz.js             ← Lógica do quiz, localStorage, navegação
└── vercel.json             ← Configuração de rotas do Vercel
```

---

## Design System

### Paleta de Cores

```css
--bg-primary: #0D0D0D;       /* fundo principal — preto profundo */
--bg-card: #1A1A1A;          /* fundo dos cards/perguntas */
--bg-option: #242424;        /* fundo das opções de resposta */
--bg-option-hover: #2E2E2E;  /* hover nas opções */
--accent: #C9A96E;           /* dourado — cor principal de destaque */
--accent-dark: #B8935A;      /* dourado escuro — hover de botões */
--text-primary: #F5F5F5;     /* texto principal */
--text-muted: #A0A0A0;       /* texto secundário/subtítulos */
--border: #2A2A2A;           /* bordas sutis */
--success: #4CAF50;          /* confirmação de seleção */
```

### Tipografia

```html
<!-- Adicionar no <head> de todas as páginas -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

- **Títulos (h1, h2):** Playfair Display, weight 600-700
- **Corpo e opções:** Inter, weight 400-500
- **Botões:** Inter, weight 600, uppercase, letter-spacing: 0.05em

### Espaçamento e Layout

- **Max-width do container:** 600px (mobile-first, centralizado)
- **Padding lateral mobile:** 20px
- **Padding lateral desktop:** 0
- **Border-radius cards:** 12px
- **Border-radius botões:** 8px
- **Border-radius opções:** 10px

---

## vercel.json

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

> Isso garante URLs limpas: `/q1` em vez de `/q1/index.html`

---

## index.html (raiz)

Redireciona automaticamente para /q1. Não exibe nada visualmente.

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=/q1">
  <title>Brazilian Massage Quiz</title>
</head>
<body></body>
</html>
```

---

## CSS Global — css/style.css

O arquivo CSS deve conter:

### Reset e Base

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; }

body {
  background-color: #0D0D0D;
  color: #F5F5F5;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
```

### Container Principal

```css
.quiz-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
```

### Barra de Progresso

```css
.progress-wrapper {
  margin-bottom: 32px;
}

.progress-label {
  font-size: 13px;
  color: #A0A0A0;
  margin-bottom: 8px;
  font-family: 'Inter', sans-serif;
}

.progress-bar {
  height: 4px;
  background-color: #2A2A2A;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #C9A96E;
  border-radius: 2px;
  transition: width 0.4s ease;
}
```

### Card da Pergunta

```css
.question-card {
  background-color: #1A1A1A;
  border-radius: 12px;
  padding: 40px 32px;
  border: 1px solid #2A2A2A;
}

.question-tag {
  font-size: 12px;
  font-weight: 600;
  color: #C9A96E;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.question-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(22px, 5vw, 28px);
  font-weight: 600;
  line-height: 1.35;
  color: #F5F5F5;
  margin-bottom: 32px;
}
```

### Opções de Resposta

```css
.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  background-color: #242424;
  border: 1px solid #2A2A2A;
  border-radius: 10px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #F5F5F5;
}

.option:hover {
  background-color: #2E2E2E;
  border-color: #C9A96E;
  transform: translateY(-1px);
}

.option.selected {
  background-color: #1E1810;
  border-color: #C9A96E;
  color: #C9A96E;
}

.option-letter {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #2A2A2A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #A0A0A0;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.option.selected .option-letter {
  background-color: #C9A96E;
  color: #0D0D0D;
}
```

### Botão de Continuar

```css
.btn-continue {
  display: block;
  width: 100%;
  margin-top: 24px;
  padding: 18px;
  background-color: #C9A96E;
  color: #0D0D0D;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
}

.btn-continue.visible {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0);
}

.btn-continue:hover {
  background-color: #B8935A;
  transform: translateY(-1px);
}
```

### Rodapé

```css
.quiz-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #555555;
}
```

### Responsividade

```css
@media (max-width: 480px) {
  .question-card {
    padding: 28px 20px;
  }
  .option {
    padding: 16px;
  }
}
```

---

## JavaScript — js/quiz.js

O arquivo deve conter:

### Armazenamento de Respostas

```javascript
// Salvar resposta no localStorage
function saveAnswer(question, answer) {
  const answers = JSON.parse(localStorage.getItem('bm_answers') || '{}');
  answers[question] = answer;
  localStorage.setItem('bm_answers', JSON.stringify(answers));
}

// Recuperar todas as respostas
function getAnswers() {
  return JSON.parse(localStorage.getItem('bm_answers') || '{}');
}
```

### Lógica de Seleção de Opção

```javascript
document.querySelectorAll('.option').forEach(option => {
  option.addEventListener('click', function() {
    // Remove seleção anterior
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    // Seleciona atual
    this.classList.add('selected');
    // Mostra botão continuar
    document.querySelector('.btn-continue').classList.add('visible');
    // Salva resposta
    saveAnswer('q' + CURRENT_QUESTION, this.dataset.value);
  });
});
```

> **IMPORTANTE:** Cada página HTML deve definir `const CURRENT_QUESTION = N;` antes de carregar quiz.js, onde N é o número da pergunta (1 a 5).

### Navegação Entre Páginas

Cada botão "Continue" deve navegar para a próxima página:
- q1 → `/q2`
- q2 → `/q3`
- q3 → `/q4`
- q4 → `/q5`
- q5 → `/result`

---

## Páginas do Quiz — Template HTML

**Usar este template para q1, q2, q3, q4 e q5. Apenas trocar o conteúdo marcado.**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brazilian Massage Quiz</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="quiz-container">

    <!-- Barra de Progresso -->
    <div class="progress-wrapper">
      <p class="progress-label">Step [N] of 5</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: [N*20]%"></div>
      </div>
    </div>

    <!-- Card da Pergunta -->
    <div class="question-card">
      <p class="question-tag">Quick Quiz</p>
      <h1 class="question-title">[TÍTULO DA PERGUNTA]</h1>

      <div class="options-list">
        <button class="option" data-value="a">
          <span class="option-letter">A</span>
          [OPÇÃO A]
        </button>
        <button class="option" data-value="b">
          <span class="option-letter">B</span>
          [OPÇÃO B]
        </button>
        <button class="option" data-value="c">
          <span class="option-letter">C</span>
          [OPÇÃO C]
        </button>
        <button class="option" data-value="d">
          <span class="option-letter">D</span>
          [OPÇÃO D]
        </button>
      </div>

      <button class="btn-continue" onclick="window.location.href='/q[N+1]'">
        Continue →
      </button>
    </div>

    <p class="quiz-footer">Your answers are 100% private</p>

  </div>

  <script>const CURRENT_QUESTION = [N];</script>
  <script src="/js/quiz.js"></script>
</body>
</html>
```

---

## Copy das Perguntas do Quiz

### Q1 — /q1/index.html
- **Progresso:** Step 1 of 5 (20%)
- **Título:** "How would you describe your current intimate life?"
- **A:** Very fulfilling — I feel deeply connected
- **B:** Decent, but something is missing
- **C:** Distant — we've lost that spark
- **D:** I'm single and want to be more confident
- **Próxima página:** /q2

### Q2 — /q2/index.html
- **Progresso:** Step 2 of 5 (40%)
- **Título:** "How often do you feel stressed, tired, or emotionally disconnected?"
- **A:** Almost every day — it's taking a toll
- **B:** A few times a week
- **C:** Occasionally, but I manage
- **D:** Rarely — I'm pretty balanced
- **Próxima página:** /q3

### Q3 — /q3/index.html
- **Progresso:** Step 3 of 5 (60%)
- **Título:** "Have you ever experienced a professional therapeutic massage?"
- **A:** Yes, regularly — I love it
- **B:** A few times in my life
- **C:** Once or twice
- **D:** Never, but I'm very curious
- **Próxima página:** /q4

### Q4 — /q4/index.html
- **Progresso:** Step 4 of 5 (80%)
- **Título:** "What would improve your quality of life the most right now?"
- **A:** Deeper emotional and physical connection
- **B:** More confidence in intimate moments
- **C:** Better stress relief and body awareness
- **D:** A more fulfilling and passionate relationship
- **Próxima página:** /q5

### Q5 — /q5/index.html
- **Progresso:** Step 5 of 5 (100%)
- **Título:** "If you could learn one transformative skill, what would it be?"
- **A:** The art of mindful touch and presence
- **B:** How to create deep emotional connection
- **C:** Sensual awareness and body confidence
- **D:** Techniques to reignite passion and attraction
- **Próxima página:** /result

---

## Página de Resultado — /result/index.html

### Layout

1. **Ícone de check** (SVG simples, dourado)
2. **Tag:** "Your Results Are Ready"
3. **Título:** "You're the Perfect Fit for Brazilian Massage Mastery"
4. **Parágrafo 1** (personalização baseada nas respostas — ver lógica abaixo)
5. **Bloco de destaque** com 3 bullet points do que o curso oferece
6. **CTA Button** → leva para /invite

### Copy do Resultado

```
Tag: Your Results Are Ready

H1: You're the Perfect Fit for Brazilian Massage Mastery

Parágrafo personalizado baseado em Q1:
  - Se resposta foi "a": "You have a strong foundation — and what Camila teaches will take your connection to a completely new level."
  - Se resposta foi "b": "You already sense there's something more. Camila's method will show you exactly what's been missing."
  - Se resposta foi "c": "You're not alone. Thousands of men feel this way — and this is the turning point."
  - Se resposta foi "d": "Confidence starts with the right knowledge. What you're about to discover will change everything."
  - Default (sem resposta): "Based on your answers, you're ready to discover something that most men never learn."

Bloco de destaque:
  ✦ The Brazilian touch technique that creates instant deep connection
  ✦ How to be the most memorable partner she's ever had
  ✦ Camila's step-by-step method — taught privately, practiced at home

CTA Button: "Show Me How → Join Camila's Private Group"
(Botão leva para /invite)
```

### Lógica JavaScript para Personalização

```javascript
// No <script> da página result/index.html
const answers = JSON.parse(localStorage.getItem('bm_answers') || '{}');
const q1Answer = answers['q1'] || 'default';

const messages = {
  a: "You have a strong foundation — and what Camila teaches will take your connection to a completely new level.",
  b: "You already sense there's something more. Camila's method will show you exactly what's been missing.",
  c: "You're not alone. Thousands of men feel this way — and this is the turning point.",
  d: "Confidence starts with the right knowledge. What you're about to discover will change everything.",
  default: "Based on your answers, you're ready to discover something that most men never learn."
};

document.getElementById('personalized-text').textContent = messages[q1Answer] || messages['default'];
```

---

## Bridge Page — /invite/index.html

### Objetivo
Converter o lead em membro do grupo Telegram privado da Camila.

### Layout (de cima para baixo)

1. **Logo/nome:** "Camila | Brazilian Massage"
2. **Título principal**
3. **Player de vídeo** (placeholder — div com aspect ratio 16:9, cor de fundo #1A1A1A, ícone de play centralizado)
4. **3 bullet points** de credibilidade
5. **CTA Button** → link do Telegram (deixar como `#telegram-link` por enquanto)
6. **Aviso de privacidade**

### Copy da Bridge Page

```
Nome: Camila | Brazilian Massage

H1: This Private Group Is Changing How Men Experience Intimacy

Subtítulo: In the next few minutes, I'll show you exactly what I teach inside my exclusive group — and why hundreds of men are calling it life-changing.

[ÁREA DO VÍDEO — placeholder 16:9]

Bullet points:
  ✦ Over 500 men have transformed their relationships using this method
  ✦ No experience needed — Camila guides you step by step
  ✦ The group is private, safe, and exclusive

CTA Button: "Join Camila's Private Group — It's Free →"

Aviso abaixo do botão:
  🔒 Private & secure. No spam. Leave anytime.
```

### CSS Específico da Bridge Page

```css
/* Player placeholder */
.video-placeholder {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #1A1A1A;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px 0;
  border: 1px solid #2A2A2A;
  cursor: pointer;
}

.play-icon {
  width: 64px;
  height: 64px;
  background-color: #C9A96E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bullet points */
.benefits-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 28px 0;
}

.benefits-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: #F5F5F5;
  line-height: 1.5;
}

.benefits-list li::before {
  content: "✦";
  color: #C9A96E;
  flex-shrink: 0;
  margin-top: 1px;
}

/* CTA da invite page */
.btn-telegram {
  display: block;
  width: 100%;
  padding: 20px;
  background-color: #C9A96E;
  color: #0D0D0D;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.btn-telegram:hover {
  background-color: #B8935A;
  transform: translateY(-2px);
}

.privacy-note {
  text-align: center;
  font-size: 12px;
  color: #555555;
  margin-top: 12px;
}
```

---

## Checklist de Compliance — Meta Ads

O Codex deve garantir que NENHUMA das páginas contenha:

- [ ] Linguagem sexual explícita
- [ ] Imagens de nudez ou semi-nudez
- [ ] Promessas de resultados sexuais diretos
- [ ] Palavras como "sex", "erotic", "adult" em textos visíveis ou meta tags
- [ ] Pop-ups que bloqueiam o conteúdo
- [ ] Redirecionamentos automáticos inesperados
- [ ] Formulários coletando dados sensíveis sem aviso de privacidade

**O que é PERMITIDO e deve estar presente:**
- [ ] Link de Privacy Policy no rodapé de todas as páginas (pode ser uma página simples)
- [ ] HTTPS (automático no Vercel)
- [ ] Conteúdo em inglês correto e profissional
- [ ] Carregamento rápido (sem imagens pesadas)

---

## Página de Privacy Policy — /privacy/index.html

Criar uma página simples de política de privacidade. Conteúdo mínimo necessário:

```
Title: Privacy Policy — Brazilian Massage

- What data we collect (only what's entered in the quiz)
- How we use it (to personalize your experience)
- We do not sell your data
- Contact email: [a ser definido]
- Last updated: [data atual]
```

---

## Ordem de Construção (Prioridade)

1. `vercel.json` — configurar primeiro
2. `css/style.css` — base visual de tudo
3. `js/quiz.js` — lógica compartilhada
4. `q1/index.html` até `q5/index.html` — quiz completo
5. `result/index.html` — resultado personalizado
6. `invite/index.html` — bridge page
7. `index.html` — redirect
8. `privacy/index.html` — política de privacidade

---

## Instruções Gerais para o Codex

1. **Mobile-first:** Testar sempre em viewport 375px (iPhone SE). O público acessa pelo celular.
2. **Sem dependências externas** além do Google Fonts. Nenhum jQuery, nenhum Bootstrap.
3. **Performance:** Nenhuma imagem pesada. SVG inline para ícones.
4. **Sem comentários desnecessários** no código.
5. **O link do Telegram** deve ficar como `href="#telegram-link"` por enquanto — será substituído quando o grupo for criado.
6. **Consistência visual:** Todas as páginas usam o mesmo `css/style.css`. Não criar CSS inline nas páginas HTML.
7. **Testar o fluxo completo:** Clicar em q1 → q2 → q3 → q4 → q5 → result → invite deve funcionar sem erros.
8. **localStorage:** Não quebrar se o usuário tiver localStorage desabilitado — usar try/catch.

---

## O Que NÃO Fazer

- Não criar frameworks ou sistemas complexos — HTML/CSS/JS puro
- Não adicionar animações pesadas
- Não usar imagens de banco de imagens genéricas (deixar placeholder)
- Não criar arquivos desnecessários
- Não instalar npm packages

---

*Documento criado por Claude — arquiteto do projeto. Última atualização: 2026-05-27*
