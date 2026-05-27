# Brazilian Massage Funnel

Static quiz funnel for the Brazilian Massage project.

## Routes

- `/q1` to `/q5`: quiz steps
- `/result`: personalized quiz result
- `/invite`: private group invitation page
- `/privacy`: privacy policy

## Local Preview

This project is plain HTML, CSS, and JavaScript. To preview with clean routes, run a local static server from the project root.

```powershell
npx vercel dev
```

If you only need to inspect files directly, open `q1/index.html` in a browser.

## Deploy on Vercel

1. Import the GitHub repository into Vercel.
2. Keep the root directory as `./`.
3. Leave build command and output directory empty.
4. Deploy.

Vercel will use `vercel.json` to keep clean URLs like `/q1`.

## Placeholders To Replace Later

- Telegram group link: `#telegram-link` in `invite/index.html`
- Stripe checkout link: `#stripe-checkout-link` in `config.json`
- PayPal checkout link: `#paypal-checkout-link` in `config.json`
