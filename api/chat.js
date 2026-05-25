// ═══════════════════════════════════════════════════════════════
// /api/chat.js — Serverless Function per Vercel (Node 18+)
//
// 🔐 La API key sta lato server come Environment Variable.
//    Provider supportati (in ordine di priorità):
//      1. GROQ_API_KEY        → Llama 3.3 70B (GRATIS, free tier serio)
//                                https://console.groq.com/keys
//      2. ANTHROPIC_API_KEY   → Claude
//      3. OPENAI_API_KEY      → GPT
//      4. nessuna             → fallback locale server-side
//
// 📥 Body: { model, max_tokens, system, section, profile, messages }
// 📤 Resp: { reply, provider }
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const baseSystem = body.system || 'Sei un assistente AI italiano.';
  const profileCtx = body.profile
    ? `\n\nContesto utente: nome=${body.profile.name||'?'}, ruolo=${body.profile.role||'?'}, livello=${body.profile.level||'?'}.`
    : '';
  const sectionCtx = body.section
    ? `\nL'utente si trova nella sezione "${body.section}" del sito.`
    : '';
  const system = baseSystem + profileCtx + sectionCtx +
    '\n\nRispondi sempre in italiano, in tono professionale ma amichevole. Usa markdown (grassetti, liste puntate). Massimo 5-6 frasi a meno che non sia esplicitamente richiesto di approfondire.';

  const userText = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

  // ─── 1) Groq (GRATIS, consigliato per demo) ─────────────────────
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          max_tokens: Math.min(body.max_tokens || 800, 1500),
          temperature: 0.7,
          messages: [
            { role: 'system', content: system },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });
      if (r.ok) {
        const data = await r.json();
        const reply = data.choices?.[0]?.message?.content?.trim() || '';
        if (reply) return res.status(200).json({ reply, provider: 'groq' });
      } else {
        console.error('Groq', r.status, await r.text());
      }
    } catch (e) { console.error('Groq err:', e.message); }
  }

  // ─── 2) Anthropic ───────────────────────────────────────────────
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
          max_tokens: Math.min(body.max_tokens || 800, 1500),
          system,
          messages: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      if (r.ok) {
        const data = await r.json();
        const reply = data.content?.[0]?.text?.trim() || '';
        if (reply) return res.status(200).json({ reply, provider: 'anthropic' });
      }
    } catch (e) { console.error('Anthropic err:', e.message); }
  }

  // ─── 3) OpenAI ──────────────────────────────────────────────────
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          max_tokens: Math.min(body.max_tokens || 800, 1500),
          messages: [
            { role: 'system', content: system },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });
      if (r.ok) {
        const data = await r.json();
        const reply = data.choices?.[0]?.message?.content?.trim() || '';
        if (reply) return res.status(200).json({ reply, provider: 'openai' });
      }
    } catch (e) { console.error('OpenAI err:', e.message); }
  }

  // ─── 4) Fallback locale server-side ─────────────────────────────
  return res.status(200).json({ reply: serverFallback(userText, body.section, body.profile), provider: 'local' });
}

function norm(t) {
  return (t || '').toLowerCase()
    .replace(/[àáâä]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
    .replace(/[òóôö]/g,'o').replace(/[ùúûü]/g,'u')
    .replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
}

function serverFallback(text, section, profile) {
  const t = norm(text);
  const name = (profile?.name || '').split(' ')[0] || '';
  if (!t) return 'Dimmi pure, sono qui per aiutarti! 😊';
  if (/(ciao|salve|buongiorno|buonasera|hey)/.test(t))
    return `Ciao${name?' '+name:''}! 👋 Sono l'AI di WeAreProject Academy. Posso aiutarti con corsi, Academy4U, career path e info sul Gruppo.`;
  if (/(academy4u|neodiplomati|neolaureati|tirocinio)/.test(t))
    return `**Academy4U** è il percorso gratuito di 2 mesi per neodiplomati/neolaureati ICT. Include lezioni con tech lead WeAreProject, affiancamento on the job e possibile assunzione. Candidati a **job@weareproject.it**.`;
  if (/(posizion|lavoro|stage|candidat|cv)/.test(t))
    return `Aperture attuali: Junior Frontend/Backend, Junior Cybersecurity Analyst, Junior Cloud Engineer, AI Engineer Trainee. Sede: Bergamo/Stezzano.`;
  if (/(weareproject|gruppo|azienda|project informatica)/.test(t))
    return `**Gruppo WeAreProject**: 510 M€ fatturato, 700+ professionisti, 7.500+ clienti enterprise, 9 aziende. Capogruppo: **Project Informatica** (Stezzano, BG).`;
  if (/(aws|cloud)/.test(t))
    return `Il corso **AWS Cloud Practitioner** (24h, Beginner) copre EC2, S3, IAM, networking e prepara alla certificazione AWS ufficiale.`;
  if (/(cyber|sicurezza|security|soc|siem)/.test(t))
    return `Il corso **Cybersecurity Fundamentals** (18h) copre threat analysis, SIEM, SOC operations e incident response.`;
  if (/(ai|machine learning|ml|llm|genai|intelligenza)/.test(t))
    return `Abbiamo **AI & Machine Learning con Python** (30h) e **Generative AI in Azienda** (10h). Dal Centro di Competenza AI del Gruppo.`;
  if (/(docker|kubernetes|k8s|devops)/.test(t))
    return `Il corso **Docker & Kubernetes** (22h) copre container, K8s, pipeline CI/CD con GitLab e ArgoCD.`;
  if (/(grazie|thanks)/.test(t))
    return `Figurati! 😊 Se vuoi posso suggerirti il prossimo corso da seguire.`;
  return `Posso aiutarti con: 📚 corsi, 🎓 Academy4U, 🚀 career path, 🏢 info Gruppo WeAreProject, 📩 posizioni aperte. Cosa ti interessa?`;
}
