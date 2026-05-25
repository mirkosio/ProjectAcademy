# Deploy su Vercel — Guida rapida

## Struttura repo

```
.
├── ProjectAcademy.html   # entry point
├── style.css             # stili
├── script.js             # logica frontend + WAP AI Engine (locale)
├── api/
│   └── chat.js           # Serverless Function (opzionale, LLM proxy)
├── vercel.json           # rewrite / + config function
└── package.json
```

## 1. Deploy minimale (AI 100% locale, zero config)

1. Push del repo su GitHub.
2. Su Vercel: **Add New → Project → Import** dal repo.
3. **Deploy**. Fine. La root `/` mostra il sito (rewrite verso `ProjectAcademy.html`).

L'AI Assistant funziona già **senza chiavi API**: usa il *WAP Engine* locale (intent matching + risposte context-aware) implementato in `script.js`. Il chatbot:
- Rileva intent (saluti, info azienda, Academy4U, posizioni, corsi, career path, mentoring, wellbeing, …)
- Riconosce i corsi citati nel testo e mostra dettagli (ore, livello, badge)
- Suggerisce career path personalizzati per ruolo (cloud / security / AI / frontend / backend)
- Adatta i suggerimenti alla sezione corrente del sito

## 2. Upgrade: collega un LLM reale (Anthropic o OpenAI)

La Serverless Function `api/chat.js` può fare da **proxy sicuro** verso Claude o GPT. La chiave **non viene mai esposta al browser**.

### Step

1. Su Vercel → **Project → Settings → Environment Variables**, aggiungi UNA delle due (o entrambe, la prima ha priorità):
   - `ANTHROPIC_API_KEY` = `sk-ant-...`  *(opzionale: `ANTHROPIC_MODEL`, default `claude-3-5-sonnet-20241022`)*
   - `OPENAI_API_KEY` = `sk-...`  *(opzionale: `OPENAI_MODEL`, default `gpt-4o-mini`)*

2. **Redeploy** (Deployments → … → Redeploy).

3. Apri il sito → la chat ora chiama l'LLM reale via `/api/chat`. Se la function fallisce (rate limit, timeout) il client **cade automaticamente sul WAP Engine locale**: la demo non si rompe mai.

### Disattivare il remote

In `script.js`, riga ~10:
```js
USE_REMOTE: false  // forza solo motore locale
```

## 3. ⚠️ Sicurezza — IMPORTANTE

Nel vecchio `script.js` c'era hardcodata una API key (`f5cf744eddde43...`). Quella key:
- È stata **rimossa** in questa versione.
- **DEVI REVOCARLA SUBITO** dal pannello del provider e generarne una nuova: chiunque ha clonato il repo / visitato il sito poteva leggerla.

D'ora in poi qualunque chiave va **solo** nelle Environment Variables di Vercel.

## Test locale

```bash
npx vercel dev
# apre su http://localhost:3000
```

La function `/api/chat` viene servita localmente; il sito è raggiungibile sulla root.
