// ═══════════════════════════════════════════════════════════════
// /api/chat.js — Serverless Function per Vercel (Node runtime)
//
// 🔐 Sicurezza: la API key NON sta nel client. Va impostata in
//    Vercel → Settings → Environment Variables come ANTHROPIC_API_KEY
//    (o OPENAI_API_KEY). Se nessuna chiave è presente, risponde
//    comunque usando un piccolo motore server-side, così la demo
//    funziona anche senza configurazione.
//
// 📥 Body atteso (JSON):
//    { model, max_tokens, system, section, profile, messages: [{role,content}] }
//
// 📤 Risposta:
//    { reply: "testo markdown", provider: "anthropic" | "openai" | "local" }
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS basico (utile se in futuro chiami la function da altri domini)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const system = body.system || 'Sei un assistente AI gentile e conciso.';
  const userText = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

  // ─── 1) Provider: Anthropic Claude (se configurato) ─────────────
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
        const reply = data.content?.[0]?.text || '';
        if (reply) return res.status(200).json({ reply, provider: 'anthropic' });
      }
    } catch (e) {
      console.error('Anthropic error:', e.message);
    }
  }

  // ─── 2) Provider: OpenAI (se configurato) ───────────────────────
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
        const reply = data.choices?.[0]?.message?.content || '';
        if (reply) return res.status(200).json({ reply, provider: 'openai' });
      }
    } catch (e) {
      console.error('OpenAI error:', e.message);
    }
  }

  // ─── 3) Fallback: motore locale server-side ─────────────────────
  // Replica semplificata del WAP Engine: se né Anthropic né OpenAI
  // sono configurati (o falliscono), rispondiamo comunque.
  const reply = serverFallback(userText, body.section, body.profile);
  return res.status(200).json({ reply, provider: 'local' });
}

// ───────────────────────────────────────────────────────────────
// Motore di fallback server-side (intent matching minimale).
// Non sostituisce il WAP Engine client (più ricco), ma serve nel
// caso il client lo chiami direttamente per future integrazioni.
// ───────────────────────────────────────────────────────────────
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

  if (/(ciao|salve|buongiorno|buonasera|hey)/.test(t)) {
    return `Ciao${name?' '+name:''}! 👋 Sono l'AI di WeAreProject Academy. Posso aiutarti con corsi, Academy4U, career path e info sul Gruppo.`;
  }
  if (/(academy4u|neodiplomati|neolaureati|tirocinio)/.test(t)) {
    return `**Academy4U** è il percorso gratuito di 2 mesi per neodiplomati/neolaureati ICT. Include lezioni con tech lead WeAreProject, affiancamento on the job e possibile assunzione. Candidati a **job@weareproject.it**.`;
  }
  if (/(posizion|lavoro|stage|candidat|cv)/.test(t)) {
    return `Aperture attuali: Junior Frontend/Backend, Junior Cybersecurity Analyst, Junior Cloud Engineer, AI Engineer Trainee. Sede: Bergamo/Stezzano.`;
  }
  if (/(weareproject|gruppo|azienda|project informatica)/.test(t)) {
    return `**Gruppo WeAreProject**: 510 M€ fatturato, 700+ professionisti, 7.500+ clienti enterprise, 9 aziende specializzate. Capogruppo: **Project Informatica** (Stezzano, BG).`;
  }
  if (/(aws|cloud)/.test(t)) {
    return `Il corso **AWS Cloud Practitioner** (24h, Beginner) prepara alla certificazione AWS ufficiale e copre EC2, S3, IAM, networking e billing.`;
  }
  if (/(cyber|sicurezza|security|soc|siem)/.test(t)) {
    return `Il corso **Cybersecurity Fundamentals** (18h) copre threat analysis, SIEM, SOC operations e incident response — stesso know-how usato dai team NOC WeAreProject.`;
  }
  if (/(ai|machine learning|ml|llm|genai)/.test(t)) {
    return `Per l'AI abbiamo due corsi: **AI & Machine Learning con Python** (30h, advanced) e **Generative AI in Azienda** (10h) — dal Centro di Competenza AI del Gruppo.`;
  }
  if (/(docker|kubernetes|k8s|devops)/.test(t)) {
    return `Il corso **Docker & Kubernetes** (22h) copre container, orchestrazione, deploy su cluster K8s e pipeline CI/CD con GitLab e ArgoCD.`;
  }
  if (/(grazie|thanks)/.test(t)) {
    return `Figurati! 😊 Se vuoi posso suggerirti il prossimo corso da seguire.`;
  }

  return `Posso aiutarti con: 📚 corsi, 🎓 Academy4U, 🚀 career path, 🏢 info Gruppo WeAreProject, 📩 posizioni aperte. Cosa ti interessa?`;
}
