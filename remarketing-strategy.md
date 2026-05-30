# Estratégia de Remarketing - Brazilian Massage

## Audiências a criar no Meta Ads Manager

**Caminho:** Audiences → Criar Audiência → Audiência Personalizada → Site

---

### Audiência 1 — Entrou no quiz mas abandonou cedo
- URL contém `/q1` nos últimos 30 dias
- **Uso:** mostrar anúncio relembrando o quiz

### Audiência 2 — Abandonou no meio do quiz
- URL contém `/q3` MAS NÃO contém `/result`
- **Uso:** anúncio tipo "você não terminou o quiz..."

### Audiência 3 — Viu o resultado mas não foi para invite
- Evento ViewContent com content_name = "Quiz Result"
- MAS NÃO tem ViewContent com content_name = "Bridge Page"
- **Uso:** anúncio mostrando o que perdeu de ver na invite

### Audiência 4 — Viu a invite mas NÃO clicou (MAIS IMPORTANTE)
- Evento ViewContent com content_name = "Bridge Page"
- MAS NÃO tem evento Lead
- **Uso:** retargeting direto para quem chegou até o fim e não entrou no grupo

### Audiência 5 — Converteu (clicou no Telegram)
- Evento Lead
- **Uso:** excluir das campanhas de prospecção, criar lookalike

---

## Lookalike recomendado

Quando tiver 100+ eventos Lead acumulados:
- Criar Lookalike 1% baseado na Audiência 5 (quem converteu)
- Países: US, UK, CA, AU
- Esse lookalike vai encontrar perfis similares aos que já entraram no grupo

---

## Ordem de prioridade para implementar

1. Audiência 4 (viu invite, não clicou) — maior chance de conversão
2. Audiência 2 (abandonou no meio) — volume alto, custo baixo
3. Lookalike da Audiência 5 — quando tiver dados suficientes
4. Audiências 1 e 3 — fase de escala

---

## Passo a passo para criar no Meta Ads Manager

1. Ads Manager → menu superior → Audiências
2. Criar Audiência → Audiência Personalizada → Site
3. Selecionar o pixel 1533245258416400
4. Configurar a regra conforme tabela acima
5. Janela de tempo: 30 dias (padrão)
6. Nomear no padrão: `RMK - [descrição]` ex: `RMK - Viu Invite Nao Clicou`
7. Criar audiência
8. Aguardar população (mínimo 100 pessoas para ativar)
