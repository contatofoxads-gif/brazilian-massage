# Plano De Testes Das Paginas De Convite

## Objetivo

Descobrir qual pagina leva mais homens para o grupo da aula ao vivo da Camila.

## Variantes

### Variante A: `/invite-video`

Pagina com placeholder de VSL/video antes do botao do Telegram.

Hipotese:

O video aumenta confianca e prepara melhor para a aula.

### Variante B: `/invite-no-video`

Pagina direta, sem video, com texto curto e botao para o grupo.

Hipotese:

Menos friccao pode gerar mais cliques para o Telegram.

### Variante C: `/invite-form`

Pagina com formulario de nome, telefone e email antes do grupo.

Hipotese:

Menos pessoas entram no Telegram, mas os leads ficam mais rastreaveis e podem ser recuperados.

## Rota De Distribuicao

Use `/invite-test` para distribuir automaticamente entre:

- `/invite-video`
- `/invite-no-video`
- `/invite-form`

A escolha fica salva no navegador do visitante para ele continuar vendo a mesma variante.

## Como Medir No Comeco

Sem ferramenta extra:

- Criar tres links de Telegram diferentes, um por variante.
- Exemplo:
  - `/invite-video` -> link Telegram A
  - `/invite-no-video` -> link Telegram B
  - `/invite-form` -> link Telegram C

Assim voce mede quantas pessoas entraram por cada link.

Com formulario:

- Trocar `#lead-form-action` por um endpoint real.
- Opcoes: Tally, Formspree, Google Forms, Make, Zapier ou API propria na Vercel.

## Metricas

- Cliques no botao do Telegram.
- Entradas no grupo.
- Pessoas que assistem a aula ao vivo.
- Pessoas que pedem link de pagamento.
- Vendas.

## Recomendacao Inicial

Rodar por pelo menos 300 visitas totais antes de decidir vencedor.

Se o trafego for pequeno, testar primeiro:

1. `/invite-video`
2. `/invite-no-video`

Depois testar `/invite-form` quando ja houver sinais de interesse.
