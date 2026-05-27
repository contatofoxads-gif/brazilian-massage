# Brazilian Massage Funnel

Funil estatico em HTML, CSS e JavaScript para o projeto Brazilian Massage.

O projeto esta publicado na Vercel.

## Rotas

- `/age`: confirmacao de idade 18+
- `/q1` ate `/q5`: perguntas do quiz
- `/result`: resultado personalizado
- `/invite`: convite para o grupo/aula privada
- `/privacy`: politica de privacidade

## Rota Do Funil

```text
Anuncio
  -> /age
  -> /q1
  -> /q2
  -> /q3
  -> /q4
  -> /q5
  -> /result
  -> /invite
  -> Telegram
  -> Aula ao vivo
  -> Oferta
```

## Preview Local

Este projeto nao usa framework. Para testar com URLs limpas, rode um servidor estatico local ou use:

```powershell
npx vercel dev
```

## Deploy Na Vercel

1. Importar o repositorio do GitHub na Vercel.
2. Manter o root directory como `./`.
3. Usar `vercel.json` com build desativado.
4. Deploy.

## Links Para Substituir Depois

- Link do grupo Telegram: `#telegram-link` em `invite/index.html`
- Link Stripe: `#stripe-checkout-link` em `config.json`
- Link PayPal: `#paypal-checkout-link` em `config.json`
