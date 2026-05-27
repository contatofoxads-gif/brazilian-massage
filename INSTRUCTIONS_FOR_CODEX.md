Follow PLANNING.md and build the entire project exactly as specified.

Priority order (must follow):
1. vercel.json (project config, routing)
2. css/style.css (design system, colors, fonts, spacing)
3. js/quiz.js (logic: localStorage, question flow, navigation)
4. pages: q1.html, q2.html, q3.html, q4.html, q5.html
5. result.html (personalized results + CTA to /invite)
6. invite.html (bridge page: video placeholder + CTA Telegram)
7. assets/ (images, thumbnails). Ensure images comply with Meta policies: neutral, non-explicit, no nudity.
8. Add README.md and deployment instructions for Vercel.

Implementation details:
- Mobile-first responsive HTML/CSS, minimal JS, no frameworks.
- All copy in English; tone: male, 45+, international.
- Each quiz page must be a separate route (q1..q5) and include a visible "Next" button.
- Result page must summarize profile and include CTA to /invite.
- Use Stripe for payments; stub checkout links in a config file (config.json) so we can replace later.

When finished:
- Commit all changes and push to the repository.
- Deploy to Vercel and provide the preview URL.

Notes for Codex:
- Do not include the word "tantra" in domains or image filenames.
- Use neutral wellness imagery and avoid sexualized content.
- Start with small, testable commits (vercel.json, css, js, then pages).

If anything is unclear, open an issue named: "QUESTION: implementation detail" with description.
