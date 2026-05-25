// ═══════════════════════════════════════════════════════════════
// CONFIG & STATE
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
// Endpoint della Serverless Function su Vercel (file: /api/chat.js).
// Tiene la chiave API lato server come Environment Variable.
// Se non è disponibile, il chatbot usa automaticamente il motore locale.
API_URL: "/api/chat",
MODEL: "weareproject-academy-v1",
MAX_TOKENS: 800,
// Se true, prova prima la serverless function;
// se non risponde (404/timeout/errore) cade sul motore locale.
USE_REMOTE: true
};

const STATE = {
currentSection: 'home',
currentFilter: 'tutti',
aiOpen: false,
notifOpen: false,
cmdOpen: false,
theme: localStorage.getItem('wap-theme') || 'light',
onboardingComplete: localStorage.getItem('wap-onboarding') === 'true',
userProfile: JSON.parse(localStorage.getItem('wap-profile')) || {
name: 'Mario Rossi',
role: 'Frontend Developer',
xp: 1240,
level: 'Mid',
courses: 4,
streak: 7,
badges: ['first-course', 'week-streak', 'quiz-master'],
skills: ['React', 'TypeScript', 'AWS']
},
aiMessages: JSON.parse(localStorage.getItem('wap-ai-messages')) || [],
searchHistory: JSON.parse(localStorage.getItem('wap-search-history')) || [],
moodHistory: JSON.parse(localStorage.getItem('wap-mood-history')) || [],
courseProgress: JSON.parse(localStorage.getItem('wap-course-progress')) || {}
};

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const courses = [
{ id:1, emoji:'☁️', title:'AWS Cloud Practitioner', desc:'Preparazione completa alla certificazione AWS. Infrastruttura cloud, S3, EC2, IAM e molto altro.', tag:'Cloud', tagClass:'thumb-b', hours:'24h', students:198, rating:'4.9', badge:'Certificazione AWS', category:'cloud', modules:[{title:'Fondamenti Cloud', lessons:['Introduzione ad AWS','Concetti di Cloud Computing','Modello di responsabilità condivisa']},{title:'Servizi Core', lessons:['EC2 e Compute','S3 e Storage','VPC e Networking']},{title:'Sicurezza', lessons:['IAM e gestione accessi','Best practices security','Compliance']}], quiz:[{q:'Cosa significa IAM?',options:['Identity and Access Management','Internet Application Module','Integrated Analytics Manager'],correct:0},{q:'Quale servizio AWS è usato per lo storage oggetti?',options:['EC2','S3','RDS'],correct:1},{q:'Qual è il modello di pricing di AWS?',options:['Fisso mensile','Pay-as-you-go','Annuale anticipato'],correct:1}] },
{ id:2, emoji:'🛡️', title:'Cybersecurity Fundamentals', desc:'Threat analysis, SIEM, SOC operations e incident response. Usato dai team NOC di WeAreProject.', tag:'Security', tagClass:'thumb-r', hours:'18h', students:142, rating:'4.8', badge:'Security Cert', category:'security', modules:[{title:'Threat Landscape', lessons:['Tipologie di minacce','Attack vectors','MITRE ATT&CK']},{title:'SOC Operations', lessons:['Monitoraggio SIEM','Incident response','Forensics basics']}], quiz:[{q:'Cosa significa SIEM?',options:['Security Information and Event Management','System Integration Enterprise Module','Secure Internet Email Manager'],correct:0},{q:'Qual è il primo step nell\'incident response?',options:['Contenimento','Identificazione','Eradicazione'],correct:1},{q:'Cosa studia il framework MITRE ATT&CK?',options:['Performance di rete','Tattiche avversarie','Gestione progetti'],correct:1}] },
{ id:3, emoji:'🤖', title:'AI & Machine Learning con Python', desc:'Dal Centro di Competenza AI di WeAreProject: LLM, ML predittivo e soluzioni multiagente.', tag:'AI & Data', tagClass:'thumb-a', hours:'30h', students:87, rating:'4.9', badge:'AI Specialist', category:'ai', modules:[{title:'Python per AI', lessons:['NumPy e Pandas','Matplotlib','Scikit-learn basics']},{title:'Machine Learning', lessons:['Supervised learning','Unsupervised learning','Model evaluation']},{title:'LLM & GenAI', lessons:['Transformer architecture','Prompt engineering','RAG patterns']}], quiz:[{q:'Quale libreria è usata per data manipulation in Python?',options:['TensorFlow','Pandas','Keras'],correct:1},{q:'Cosa significa LLM?',options:['Low Level Machine','Large Language Model','Linear Learning Method'],correct:1},{q:'Qual è l\'architettura alla base dei transformer?',options:['CNN','RNN','Self-Attention'],correct:2}] },
{ id:4, emoji:'⚛️', title:'React & TypeScript Avanzato', desc:'Architettura di app React complesse, hooks avanzati, performance e testing con Vitest.', tag:'Dev', tagClass:'thumb-g', hours:'20h', students:234, rating:'4.7', badge:'Frontend Cert', category:'dev', modules:[{title:'TypeScript Advanced', lessons:['Generics','Utility types','Type guards']},{title:'React Patterns', lessons:['Custom hooks','Performance optimization','State management']}], quiz:[{q:'Cosa permette di fare un Generic in TypeScript?',options:['Creare componenti riutilizzabili','Ottimizzare le performance','Gestire lo stato'],correct:0},{q:'Quale hook è usato per effetti collaterali?',options:['useState','useEffect','useMemo'],correct:1},{q:'Cosa fa React.memo()?',options:['Memorizza il componente','Previene re-render non necessari','Gestisce lo stato globale'],correct:1}] },
{ id:5, emoji:'🐳', title:'Docker & Kubernetes', desc:'Container, orchestrazione e deploy su cluster K8s. Pipeline CI/CD con GitLab e ArgoCD.', tag:'Cloud', tagClass:'thumb-b', hours:'22h', students:156, rating:'4.8', badge:'DevOps Cert', category:'cloud', modules:[{title:'Docker Fundamentals', lessons:['Container vs VM','Dockerfile','Docker Compose']},{title:'Kubernetes', lessons:['Pods e Deployments','Services e Ingress','ConfigMaps e Secrets']}], quiz:[{q:'Cosa è un Dockerfile?',options:['Un container','Una ricetta per buildare immagini','Un orchestrator'],correct:1},{q:'Qual è l\'unità minima in Kubernetes?',options:['Node','Pod','Container'],correct:1},{q:'Cosa fa un Deployment?',options:['Gestisce il networking','Gestisce i pod e le repliche','Monitora le risorse'],correct:1}] },
{ id:6, emoji:'💼', title:'Leadership & Comunicazione', desc:'Gestione team multidisciplinari, feedback costruttivo e soft skill per il contesto aziendale IT.', tag:'Soft Skills', tagClass:'thumb-a', hours:'12h', students:310, rating:'4.6', badge:'Leadership', category:'soft', modules:[{title:'Communication', lessons:['Active listening','Feedback efficace','Presentazioni']},{title:'Team Management', lessons:['Delega efficace','Gestione conflitti','Motivazione']}], quiz:[{q:'Cosa significa "active listening"?',options:['Ascoltare mentre si fa altro','Ascolto pieno e consapevole','Prendere appunti'],correct:1},{q:'Qual è il miglior momento per dare feedback?',options:['Subito dopo l\'evento','Una volta al mese','Mai in pubblico'],correct:0},{q:'Cosa favorisce la motivazione del team?',options:['Critiche costanti','Obiettivi chiari e riconoscimenti','Micro-management'],correct:1}] },
{ id:7, emoji:'🔐', title:'Zero Trust Security Architecture', desc:'Implementazione Zero Trust in ambienti enterprise. Microsoft Defender e CSOC operations.', tag:'Security', tagClass:'thumb-r', hours:'16h', students:98, rating:'4.9', badge:'Security Advanced', category:'security', modules:[{title:'Zero Trust Principles', lessons:['Never trust, always verify','Least privilege','Micro-segmentation']},{title:'Implementation', lessons:['Identity verification','Device compliance','Continuous monitoring']}], quiz:[{q:'Qual è il principio base di Zero Trust?',options:['Fidati ma verifica','Non fidarti mai, verifica sempre','Fidati completamente'],correct:1},{q:'Cosa significa "least privilege"?',options:['Accesso minimo necessario','Accesso completo','Accesso temporaneo'],correct:0},{q:'Cosa è la micro-segmentazione?',options:['Dividere la rete in zone piccole','Usare firewall multipli','Crittografare tutto'],correct:0}] },
{ id:8, emoji:'🗄️', title:'PostgreSQL & Database Design', desc:'Modellazione, query avanzate, ottimizzazione e backup. Usato su tutti i progetti data di WeAreProject.', tag:'Dev', tagClass:'thumb-g', hours:'14h', students:117, rating:'4.7', badge:'Database Cert', category:'dev', modules:[{title:'SQL Advanced', lessons:['JOIN complessi','Subquery','Window functions']},{title:'Optimization', lessons:['Indexing','Query planning','Performance tuning']}], quiz:[{q:'Cosa fa un INDEX?',options:['Ordina i dati','Accelera le query','Crittografa i dati'],correct:1},{q:'Cosa è una WINDOW function?',options:['Una funzione per finestre temporali','Una funzione per analisi su subset','Una funzione di sistema'],correct:1},{q:'Quale JOIN restituisce solo le righe corrispondenti?',options:['LEFT JOIN','INNER JOIN','FULL JOIN'],correct:1}] },
{ id:9, emoji:'🧠', title:'Generative AI in Azienda', desc:'Come WeAreProject implementa l\'AI in produzione: classificazione email, ML predittivo e agenti conversazionali.', tag:'AI & Data', tagClass:'thumb-a', hours:'10h', students:203, rating:'5.0', badge:'AI Champion', category:'ai', modules:[{title:'Use Cases', lessons:['Email classification','Predictive ML','Conversational agents']},{title:'Production AI', lessons:['Model deployment','Monitoring','Cost optimization']}], quiz:[{q:'Qual è un use case comune di GenAI in azienda?',options:['Gestione email','Classificazione automatica','Contabilità'],correct:1},{q:'Cosa significa RAG?',options:['Random Access Generator','Retrieval Augmented Generation','Real-time API Gateway'],correct:1},{q:'Perché monitorare i modelli AI in production?',options:['Per costi e performance','Per estetica','Per compliance'],correct:0}] },
];

const mentors = [
{ ini:'MB', col:'ma-g', name:'Marco Bianchi', role:'Cloud Architect', tags:['AWS','Azure','K8s'], avail:true, slots:'2 slot liberi' },
{ ini:'SR', col:'ma-b', name:'Sofia Ricci', role:'Tech Lead', tags:['Node.js','DevOps','Career'], avail:true, slots:'1 slot libero' },
{ ini:'EC', col:'ma-a', name:'Elena Conti', role:'UX Lead', tags:['UX/UI','Figma','Research'], avail:true, slots:'3 slot liberi' },
{ ini:'LF', col:'ma-b', name:'Luca Ferrari', role:'Backend Lead', tags:['API','PostgreSQL','Security'], avail:false, slots:'Agenda piena' },
{ ini:'DL', col:'ma-g', name:'Diego Lavezzi', role:'AI Solution Manager', tags:['AI','LLM','ML'], avail:true, slots:'2 slot liberi' },
{ ini:'AG', col:'ma-a', name:'Anna Greco', role:'Security Lead', tags:['SOC','SIEM','ZeroTrust'], avail:true, slots:'1 slot libero' },
{ ini:'GC', col:'ma-b', name:'Gianni Cressari', role:'Enterprise Architect', tags:['IBM','watsonx','Cloud'], avail:false, slots:'Agenda piena' },
{ ini:'RZ', col:'ma-g', name:'Roberta Zampa', role:'People & Culture Manager', tags:['HR','Career','Wellbeing'], avail:true, slots:'3 slot liberi' },
];

const skills = [
{label:'React & TypeScript', col:'dot-g', hot:true}, {label:'Node.js', col:'dot-g', hot:true},
{label:'Docker & K8s', col:'dot-g', hot:true}, {label:'AWS Cloud', col:'dot-b', hot:true},
{label:'Azure & M365', col:'dot-b', hot:true}, {label:'Cybersecurity', col:'dot-b', hot:false},
{label:'Machine Learning', col:'dot-a', hot:false}, {label:'Python', col:'dot-g', hot:false},
{label:'PostgreSQL', col:'dot-b', hot:false}, {label:'Git & CI/CD', col:'dot-a', hot:false},
{label:'Linux & Shell', col:'dot-b', hot:false}, {label:'Agile & Scrum', col:'dot-a', hot:false},
{label:'Zero Trust Security', col:'dot-a', hot:false}, {label:'LLM & GenAI', col:'dot-g', hot:true},
];

const notifs = [
{ ico:'fas fa-graduation-cap', cls:'ni-g', text:'<strong>Nuovo corso disponibile:</strong> Generative AI in Azienda — rating 5.0', time:'2h fa', unread:true },
{ ico:'fas fa-calendar-check', cls:'ni-b', text:'<strong>Promemoria:</strong> Webinar Azure AI Foundry domani alle 14:00', time:'5h fa', unread:true },
{ ico:'fas fa-trophy', cls:'ni-a', text:'Hai superato <strong>Elena Conti</strong> in classifica! Sei al 2° posto 🎉', time:'Ieri', unread:true },
{ ico:'fas fa-user-check', cls:'ni-g', text:'<strong>Diego Lavezzi</strong> ha accettato la tua richiesta di mentoring', time:'2 giorni fa', unread:false },
{ ico:'fas fa-certificate', cls:'ni-b', text:'Certificazione <strong>AWS Cloud Practitioner</strong> aggiornata nel profilo', time:'3 giorni fa', unread:false },
];

const calEvents = [
{ day:3, month:6, year:2025, cls:'evd-g', etCls:'et-g', title:'Webinar: Azure AI Foundry', time:'14:00–16:00', tag:'AI', evCls:'' },
{ day:7, month:6, year:2025, cls:'evd-a', etCls:'et-a', title:'Workshop Leadership & Feedback', time:'10:00–12:00', tag:'Soft Skills', evCls:'ev-a' },
{ day:10, month:6, year:2025, cls:'evd-b', etCls:'et-b', title:'Check-in Benessere Aziendale', time:'Tutto il giorno', tag:'Wellbeing', evCls:'ev-b' },
{ day:14, month:6, year:2025, cls:'evd-g', etCls:'et-g', title:'Docker & K8s — Sessione live', time:'14:00–17:00', tag:'Tech', evCls:'' },
{ day:17, month:6, year:2025, cls:'evd-a', etCls:'et-a', title:'Scadenza Certificazione AWS', time:'Entro le 23:59', tag:'Deadline', evCls:'ev-a' },
{ day:21, month:6, year:2025, cls:'evd-b', etCls:'et-b', title:'Q&A System Design', time:'16:00–17:00', tag:'Tech', evCls:'ev-b' },
{ day:24, month:6, year:2025, cls:'evd-g', etCls:'et-g', title:'Sessione Mentoring con Diego', time:'11:00–12:00', tag:'Mentoring', evCls:'' },
{ day:28, month:6, year:2025, cls:'evd-a', etCls:'et-a', title:'Review Trimestrale Profili', time:'Tutto il giorno', tag:'HR', evCls:'ev-a' },
];

const leaderboardData = [
{ pos:1, ini:'MB', name:'Marco Bianchi', role:'Cloud Architect', level:'Advanced', badge:'🏆', xp:3120 },
{ pos:2, ini:'SR', name:'Sofia Ricci', role:'Tech Lead', level:'Advanced', badge:'⭐', xp:2840 },
{ pos:3, ini:'EC', name:'Elena Conti', role:'UX Lead', level:'Mid-Level', badge:'🎯', xp:2560 },
{ pos:4, ini:'LF', name:'Luca Ferrari', role:'Backend Lead', level:'Mid-Level', badge:'🔥', xp:2310 },
{ pos:5, ini:'AG', name:'Anna Greco', role:'Security Analyst', level:'Base', badge:'🛡️', xp:1890 },
{ pos:6, ini:'RM', name:'Riccardo M.', role:'DevOps Engineer', level:'Base', badge:'⚡', xp:1640 },
{ pos:7, ini:'FC', name:'Francesca C.', role:'Data Analyst', level:'Base', badge:'📊', xp:1420 },
{ pos:8, ini:'AP', name:'Andrea P.', role:'Junior Dev', level:'Base', badge:'🌱', xp:1180 },
];

const badges = [
{ id:'first-course', name:'Primo Corso', desc:'Completa il tuo primo corso', icon:'🎓', color:'var(--green)' },
{ id:'week-streak', name:'Settimana Attiva', desc:'7 giorni consecutivi', icon:'🔥', color:'var(--amber)' },
{ id:'quiz-master', name:'Quiz Master', desc:'10 quiz perfetti', icon:'🎯', color:'var(--blue)' },
{ id:'cert-aws', name:'AWS Certified', desc:'Certificazione AWS', icon:'☁️', color:'var(--amber)' },
{ id:'mentor', name:'Mentor', desc:'Aiuta 5 colleghi', icon:'🤝', color:'var(--purple)' },
{ id:'expert', name:'Expert', desc:'3000+ XP', icon:'👑', color:'var(--amber)' },
{ id:'early', name:'Early Adopter', desc:'Primi 100 utenti', icon:'🚀', color:'var(--blue)' },
{ id:'complete', name:'Complecionista', desc:'Tutti i corsi base', icon:'✅', color:'var(--green)' },
];

const monthNames = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
let calDate = new Date(2025, 6, 1);

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════
function $(id) { return document.getElementById(id); }
function $$(selector) { return document.querySelectorAll(selector); }

function saveState() {
localStorage.setItem('wap-profile', JSON.stringify(STATE.userProfile));
localStorage.setItem('wap-ai-messages', JSON.stringify(STATE.aiMessages));
localStorage.setItem('wap-search-history', JSON.stringify(STATE.searchHistory));
localStorage.setItem('wap-mood-history', JSON.stringify(STATE.moodHistory));
localStorage.setItem('wap-course-progress', JSON.stringify(STATE.courseProgress));
localStorage.setItem('wap-theme', STATE.theme);
}

function toast(msg, type='', icon='fas fa-check-circle') {
const container = $('toasts');
const t = document.createElement('div');
t.className = `toast ${type}`;
t.setAttribute('role', 'alert');
t.innerHTML = `<i class="${icon}" aria-hidden="true"></i> ${msg}`;
container.appendChild(t);
setTimeout(() => { t.style.animation = 'toastOut 0.3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3500);
}

function scrollToSection(id) {
show('home');
setTimeout(() => {
$(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 100);
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
function show(id) {
$$('.section').forEach(s => s.classList.remove('active'));
$$('.nav-link').forEach(l => l.classList.remove('active'));
$(id)?.classList.add('active');
$$('.nav-link').forEach(l => {
if (l.getAttribute('onclick')?.includes(`'${id}'`)) l.classList.add('active');
});
STATE.currentSection = id;
window.scrollTo({ top: 0, behavior: 'smooth' });
updateAISuggestions();
setTimeout(() => {
$$('.fade-in-up').forEach(el => {
if (el.closest('.section.active')) {
el.classList.add('visible');
}
});
}, 100);
}

// ═══════════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════
function renderCourses(filter, containerId = 'courses-grid') {
const grid = $(containerId);
if (!grid) return;
const list = filter === 'tutti' ? courses : courses.filter(c => c.category === filter);
grid.innerHTML = list.map(c => `
<div class="course-card fade-in-up" onclick="openLesson(${c.id})" role="listitem" tabindex="0" aria-label="Corso: ${c.title}">
<div class="course-thumb">
<span class="course-thumb-label ${c.tagClass}" aria-hidden="true">${c.tag}</span>
<span style="font-size:48px" aria-hidden="true">${c.emoji}</span>
</div>
<div class="course-body">
<h4>${c.title}</h4>
<p>${c.desc}</p>
<div class="course-meta">
<span><i class="fas fa-clock" aria-hidden="true"></i> ${c.hours}</span>
<span><i class="fas fa-users" aria-hidden="true"></i> ${c.students}</span>
<span class="course-stars" aria-label="Valutazione ${c.rating} su 5">${'★'.repeat(Math.floor(parseFloat(c.rating)))}${parseFloat(c.rating)%1?'☆':''} ${c.rating}</span>
</div>
</div>
<div class="course-footer">
<span class="course-badge">${c.badge}</span>
<button class="course-enroll" aria-label="Inizia corso ${c.title}">Inizia <i class="fas fa-arrow-right" aria-hidden="true"></i></button>
</div>
</div>
`).join('');
}

function filterCourses(filter, btn) {
STATE.currentFilter = filter;
$$('.cfilter').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
btn.classList.add('active');
btn.setAttribute('aria-pressed', 'true');
renderCourses(filter);
}

function renderMentors(containerId) {
const el = $(containerId);
if (!el) return;
el.innerHTML = mentors.map(m => `
<div class="mentor-card fade-in-up" role="listitem">
<div class="m-head">
<div class="m-ava ${m.col}" aria-hidden="true">${m.ini}</div>
<div><div class="m-name">${m.name}</div><div class="m-role">${m.role}</div></div>
</div>
<div class="m-tags">${m.tags.map(t => `<span class="m-tag">${t}</span>`).join('')}</div>
<div class="m-avail ${m.avail?'':'off'}"><div class="m-avail-dot" aria-hidden="true"></div>${m.avail ? 'Disponibile — ' + m.slots : m.slots}</div>
<button class="m-book" ${m.avail?'':"disabled"} onclick="${m.avail?`toast('Sessione prenotata con ${m.name} ✓','success')`:''}" aria-label="${m.avail?'Prenota sessione':'Nessuno slot disponibile'}">
${m.avail?'Prenota sessione':'Nessuno slot disponibile'}
</button>
</div>
`).join('');
}

function renderSkills() {
const el = $('skills-chips');
if (!el) return;
el.innerHTML = skills.map(s => `
<div class="tech-chip ${s.hot?'selected':''}" role="listitem" aria-pressed="${s.hot}" onclick="this.classList.toggle('selected')" style="display:flex;align-items:center;gap:8px;padding:8px 16px;border:1px solid ${s.hot?'var(--green)':'var(--border-2)'};border-radius:24px;font-size:13.5px;cursor:pointer;transition:all 0.15s;background:${s.hot?'var(--green)':'var(--bg)'};color:${s.hot?'#fff':'var(--ink-2)'};font-weight:500" onmouseover="if(!this.classList.contains('selected')){this.style.borderColor='var(--green)';this.style.color='var(--green)';this.style.background='var(--green-lt)'}" onmouseout="if(!this.classList.contains('selected')){this.style.borderColor='var(--border-2)';this.style.color='var(--ink-2)';this.style.background='var(--bg)'}">
<span style="width:7px;height:7px;border-radius:50%;background:${s.col==='dot-g'?'var(--green)':s.col==='dot-b'?'var(--blue)':'var(--amber)'};flex-shrink:0" aria-hidden="true"></span>
${s.label}
</div>
`).join('');
}

function renderNotifs() {
const el = $('notif-list');
el.innerHTML = notifs.map((n,i) => `
<div class="notif-item ${n.unread?'unread':''}" onclick="markRead(${i})" role="listitem" tabindex="0" aria-label="Notifica: ${n.text.replace(/<[^>]*>/g, '')}">
<div class="notif-ico ${n.cls}" aria-hidden="true"><i class="${n.ico}"></i></div>
<div style="flex:1">
<div class="notif-text">${n.text}</div>
<div class="notif-time">${n.time}</div>
</div>
</div>
`).join('');
const dot = $('notif-dot');
const unread = notifs.filter(n => n.unread).length;
dot.style.display = unread > 0 ? 'block' : 'none';
}

function renderLeaderboard() {
const el = $('leaderboard-rows');
el.innerHTML = leaderboardData.map(u => `
<div class="lb-row" role="row">
<div class="lb-pos" role="cell">${String(u.pos).padStart(2,'0')}</div>
<div class="lb-user" role="cell">
<div class="lb-ava la-${u.pos<=3?(u.pos===1?'g':u.pos===2?'b':'a'):'v'}" aria-hidden="true">${u.ini}</div>
<div><div class="lb-uname">${u.name}</div><div class="lb-urole">${u.role}</div></div>
</div>
<div role="cell"><span class="lb-lvl ll-${u.level==='Advanced'?'adv':u.level==='Mid-Level'?'mid':'base'}">${u.level}</span></div>
<div class="lb-badge-cell" role="cell" aria-label="Badge: ${u.badge}">${u.badge}</div>
<div class="lb-pts" role="cell">${u.xp.toLocaleString()} <small>XP</small></div>
</div>
`).join('');
}

function renderBadges() {
const el = $('badge-grid');
el.innerHTML = badges.map(b => {
const unlocked = STATE.userProfile.badges.includes(b.id);
return `
<div class="badge-item ${unlocked?'unlocked':'locked'}" aria-label="Badge: ${b.name} - ${unlocked?'Sbloccato':'Bloccato'}">
<div class="badge-icon" style="background:${unlocked?b.color+'20':'var(--bg-3)'};color:${unlocked?b.color:'var(--ink-3)'}" aria-hidden="true">${b.icon}</div>
<div class="badge-name">${b.name}</div>
<div class="badge-desc">${b.desc}</div>
</div>
`;
}).join('');
}

function renderStreak() {
const visual = $('streak-visual');
const days = STATE.userProfile.streak;
visual.innerHTML = Array.from({length: 7}, (_, i) =>
`<div class="streak-day ${i < days ? 'active' : ''}" aria-hidden="true"></div>`
).join('');
$('streak-days').textContent = days;
}

function renderProfile() {
$('profile-name').textContent = STATE.userProfile.name;
$('profile-xp').textContent = STATE.userProfile.xp.toLocaleString();
$('profile-courses').textContent = STATE.userProfile.courses;
const level = getLevelFromXP(STATE.userProfile.xp);
$('profile-level-badge').textContent = level.charAt(0);
renderBadges();
renderStreak();
updateProgressRing();
}

function getLevelFromXP(xp) {
if (xp >= 3000) return 'Expert';
if (xp >= 1500) return 'Advanced';
if (xp >= 500) return 'Mid';
return 'Base';
}

function updateProgressRing() {
const circle = $('progress-ring-circle');
const text = $('progress-ring-text');
const radius = 70;
const circumference = 2 * Math.PI * radius;
const progress = 65;
const offset = circumference - (progress / 100) * circumference;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = offset;
text.textContent = `${progress}%`;
}

// ═══════════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════════
function renderCalendar() {
const y = calDate.getFullYear(), m = calDate.getMonth();
$('cal-month-label').textContent = `${monthNames[m]} ${y}`;
const firstDay = new Date(y, m, 1).getDay();
const daysInMonth = new Date(y, m+1, 0).getDate();
const offset = firstDay === 0 ? 6 : firstDay - 1;
const today = new Date(), todayKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
const evMap = {};
calEvents.filter(e => e.month === m && e.year === y).forEach(e => evMap[e.day] = e);
let html = '';
for (let i = 0; i < offset; i++) html += '<div class="cal-day" style="visibility:hidden" aria-hidden="true"></div>';
for (let d = 1; d <= daysInMonth; d++) {
const isToday = `${d}-${m}-${y}` === todayKey;
const ev = evMap[d];
html += `<div class="cal-day ${isToday?'today':''} ${ev?'has-ev '+ev.evCls:''}" onclick="selectDay(${d})" role="gridcell" tabindex="0" aria-label="${d} ${monthNames[m]}${ev?' - '+ev.title:''}">${d}</div>`;
}
$('cal-days').innerHTML = html;
const upcoming = calEvents.filter(e => e.year >= y).sort((a,b) => new Date(a.year,a.month,a.day)-new Date(b.year,b.month,b.day)).slice(0,5);
$('cal-events').innerHTML = upcoming.map(e => `
<div class="cal-ev" onclick="toast('${e.title} aggiunto al calendario 📅','success')" role="listitem" tabindex="0">
<div class="cal-ev-dot ${e.cls}" aria-hidden="true"></div>
<div>
<div class="cal-ev-title">${e.title}</div>
<div class="cal-ev-time">${monthNames[e.month].slice(0,3)} ${e.day} · ${e.time}</div>
<span class="cal-ev-tag ${e.etCls}">${e.tag}</span>
</div>
</div>
`).join('');
}

function calNav(dir) { calDate.setMonth(calDate.getMonth()+dir); renderCalendar(); }
function selectDay(d) {
$$('.cal-day').forEach(el => el.classList.remove('selected'));
event.target.classList.add('selected');
const ev = calEvents.find(e => e.day===d && e.month===calDate.getMonth() && e.year===calDate.getFullYear());
if (ev) toast(`${ev.title} · ${ev.time}`,'info','fas fa-calendar-day');
}

function addCustomEvent() {
const title = prompt('Titolo evento:');
if (title) {
calEvents.push({ day: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear(), cls:'evd-g', etCls:'et-g', title, time:'Da definire', tag:'Personal', evCls:'' });
renderCalendar();
toast('Evento aggiunto ✓','success');
}
}

// ═══════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════
function openModal(type) {
const overlay = $('modal-overlay');
const content = $('modal-content');
if (type === 'login') {
content.innerHTML = `
<div class="modal-h">Bentornato</div>
<div class="modal-sub">Accedi al tuo account WeAreProject Academy</div>
<div class="form-group">
<label for="login-email">Email aziendale</label>
<input type="email" id="login-email" placeholder="nome@weareproject.it" aria-required="true">
</div>
<div class="form-group">
<label for="login-password">Password</label>
<input type="password" id="login-password" placeholder="••••••••" aria-required="true">
</div>
<button class="form-submit" onclick="loginSuccess()" aria-label="Accedi">Accedi</button>
<div class="modal-switch">Non hai un account? <a onclick="openModal('reg')" tabindex="0">Registrati</a></div>
`;
} else if (type === 'reg') {
content.innerHTML = `
<div class="modal-h">Inizia il percorso</div>
<div class="modal-sub">Crea il tuo account gratuito su WeAreProject Academy</div>
<div class="form-group">
<label for="reg-name">Nome e cognome</label>
<input type="text" id="reg-name" placeholder="Mario Rossi" aria-required="true">
</div>
<div class="form-group">
<label for="reg-email">Email</label>
<input type="email" id="reg-email" placeholder="mario.rossi@email.it" aria-required="true">
</div>
<div class="form-group">
<label for="reg-type">Sono</label>
<select id="reg-type" aria-required="true">
<option value="">Seleziona...</option>
<option value="employee">Dipendente WeAreProject</option>
<option value="student">Studente ITIS Marconi</option>
<option value="graduate">Neolaureato</option>
<option value="external">Candidato esterno</option>
</select>
</div>
<div class="form-group">
<label for="reg-password">Password</label>
<input type="password" id="reg-password" placeholder="••••••••" aria-required="true">
</div>
<button class="form-submit" onclick="regSuccess()" aria-label="Crea account">Crea account</button>
<div class="modal-switch">Hai già un account? <a onclick="openModal('login')" tabindex="0">Accedi</a></div>
`;
} else if (type === 'application') {
content.innerHTML = `
<div class="modal-h">Candidatura Academy4U</div>
<div class="modal-sub">Compila il form per candidarti al programma Academy4U di WeAreProject</div>
<div class="form-group">
<label for="app-name">Nome e cognome *</label>
<input type="text" id="app-name" placeholder="Mario Rossi" required>
</div>
<div class="form-group">
<label for="app-email">Email *</label>
<input type="email" id="app-email" placeholder="mario.rossi@email.it" required>
</div>
<div class="form-group">
<label for="app-school">Istituto / Università *</label>
<input type="text" id="app-school" placeholder="ITIS Marconi di Dalmine" required>
</div>
<div class="form-group">
<label for="app-year">Anno scolastico / Laurea *</label>
<select id="app-year" required>
<option value="">Seleziona...</option>
<option value="3">3° anno superiore</option>
<option value="4">4° anno superiore</option>
<option value="5">5° anno superiore</option>
<option value="laurea">Neolaureato</option>
</select>
</div>
<div class="form-group">
<label for="app-interest">Area di interesse *</label>
<select id="app-interest" required>
<option value="">Seleziona...</option>
<option value="cloud">Cloud & Infrastructure</option>
<option value="security">Cybersecurity</option>
<option value="dev">Development</option>
<option value="ai">AI & Data</option>
<option value="support">Service Desk / NOC</option>
</select>
</div>
<div class="form-group">
<label for="app-cv">Carica CV (PDF, max 5MB)</label>
<div class="file-upload" onclick="$('app-cv-input').click()" role="button" tabindex="0" aria-label="Carica CV">
<i class="fas fa-cloud-upload-alt" aria-hidden="true"></i>
<div class="file-upload-text">Clicca o trascina il file qui</div>
<div class="file-name" id="cv-file-name"></div>
<input type="file" id="app-cv-input" accept=".pdf" style="display:none" onchange="showFileName(this)">
</div>
</div>
<div class="form-group">
<label for="app-message">Messaggio (opzionale)</label>
<textarea id="app-message" placeholder="Parlaci di te, delle tue passioni e perché vuoi entrare in WeAreProject..." rows="4"></textarea>
</div>
<button class="form-submit" onclick="submitApplication()" aria-label="Invia candidatura">Invia candidatura</button>
<div class="modal-switch">Vuoi simulare un colloquio? <a onclick="openModal('interview');closeModal()" tabindex="0">Simula colloquio AI</a></div>
`;
} else if (type === 'interview') {
content.innerHTML = `
<div class="modal-h" style="font-size:20px">Simulatore Colloquio AI</div>
<div class="modal-sub">Mettiti alla prova con domande tecniche simulate da AI. Seleziona il ruolo e rispondi alle domande.</div>
<div class="form-group">
<label for="interview-role">Ruolo per il colloquio</label>
<select id="interview-role">
<option value="frontend">Junior Frontend Developer</option>
<option value="backend">Junior Backend Developer</option>
<option value="cloud">Junior Cloud Engineer</option>
<option value="security">Cybersecurity Analyst</option>
<option value="ai">AI & Data Analyst</option>
</select>
</div>
<button class="form-submit" onclick="startInterview()" aria-label="Inizia simulazione colloquio">Inizia simulazione</button>
`;
} else if (type === 'profile-edit') {
content.innerHTML = `
<div class="modal-h">Modifica Profilo</div>
<div class="modal-sub">Aggiorna le tue informazioni personali</div>
<div class="form-group">
<label for="edit-name">Nome completo</label>
<input type="text" id="edit-name" value="${STATE.userProfile.name}">
</div>
<div class="form-group">
<label for="edit-role">Ruolo</label>
<input type="text" id="edit-role" value="${STATE.userProfile.role}">
</div>
<button class="form-submit" onclick="saveProfile()" aria-label="Salva modifiche">Salva modifiche</button>
`;
}
overlay.classList.add('open');
setTimeout(() => {
const firstInput = content.querySelector('input, select, button');
firstInput?.focus();
}, 100);
}

function showFileName(input) {
const fileName = input.files[0]?.name;
if (fileName) {
$('cv-file-name').textContent = `✓ ${fileName}`;
$('cv-file-name').style.color = 'var(--green)';
}
}

function submitApplication() {
const name = $('app-name')?.value;
const email = $('app-email')?.value;
const school = $('app-school')?.value;
const year = $('app-year')?.value;
const interest = $('app-interest')?.value;
if (!name || !email || !school || !year || !interest) {
toast('Compila tutti i campi obbligatori','warning','fas fa-exclamation-triangle');
return;
}
closeModal();
toast('Candidatura inviata! Riceverai una email di conferma 🎉','success');
}

function loginSuccess() { closeModal(); toast('Accesso effettuato ✓','success'); show('profilo'); }
function regSuccess() { closeModal(); toast('Account creato! Benvenuto in WeAreProject Academy 🎉','success'); }

function closeModal(e) {
if (e && e.target !== $('modal-overlay')) return;
$('modal-overlay').classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
// LESSON / COURSE PLAYER
// ═══════════════════════════════════════════════════════════════
let currentLessonId = null;
let currentQuizIndex = 0;
let quizScore = 0;

function openLesson(id) {
const course = courses.find(c => c.id === id);
if (!course) return;
currentLessonId = id;
currentQuizIndex = 0;
quizScore = 0;
$('lesson-title').textContent = course.title;
$('lesson-meta').textContent = `Durata: ${course.hours} · Categoria: ${course.tag}`;
$('lesson-progress').style.width = (STATE.courseProgress[id] || 0) + '%';
const curriculumContent = $('curriculum-content');
curriculumContent.innerHTML = course.modules.map((mod, mi) => `
<div class="module">
<div class="module-header" onclick="toggleModule(${mi})" role="button" tabindex="0" aria-expanded="false" aria-controls="module-content-${mi}">
<div class="module-title">
<div class="module-check" id="module-check-${mi}" aria-hidden="true"><i class="fas fa-check" style="display:none"></i></div>
${mod.title}
</div>
<i class="fas fa-chevron-down" aria-hidden="true"></i>
</div>
<div class="module-content" id="module-content-${mi}" role="region">
${mod.lessons.map((lesson, li) => `
<div class="lesson-item ${li===0?'played':''}" onclick="playLesson(${mi},${li})" role="button" tabindex="0">
<i class="fas ${li===0?'fa-check-circle':'fa-play-circle'}" aria-hidden="true"></i>
${lesson}
</div>
`).join('')}
</div>
</div>
`).join('');
$('quiz-container').style.display = 'none';
$('lesson-overlay').classList.add('open');
}

function toggleModule(index) {
const content = $(`module-content-${index}`);
const header = content.previousElementSibling;
const check = $(`module-check-${index}`);
content.classList.toggle('open');
header.setAttribute('aria-expanded', content.classList.contains('open'));
if (content.classList.contains('open')) {
header.querySelector('.fa-chevron-down')?.classList.replace('fa-chevron-down', 'fa-chevron-up');
} else {
header.querySelector('.fa-chevron-up')?.classList.replace('fa-chevron-up', 'fa-chevron-down');
}
}

function playLesson(moduleIndex, lessonIndex) {
const course = courses.find(c => c.id === currentLessonId);
if (!course) return;
const lessonItems = $$('.lesson-item');
const itemIndex = course.modules.slice(0, moduleIndex).reduce((acc, m) => acc + m.lessons.length, 0) + lessonIndex;
lessonItems[itemIndex]?.classList.add('played');
lessonItems[itemIndex]?.querySelector('i')?.classList.replace('fa-play-circle', 'fa-check-circle');
const module = course.modules[moduleIndex];
const allPlayed = Array.from($$('.lesson-item')).slice(
course.modules.slice(0, moduleIndex).reduce((acc, m) => acc + m.lessons.length, 0),
course.modules.slice(0, moduleIndex + 1).reduce((acc, m) => acc + m.lessons.length, 0)
).every(item => item.classList.contains('played'));
if (allPlayed) {
$(`module-check-${moduleIndex}`)?.classList.add('checked');
$(`module-check-${moduleIndex}`)?.querySelector('i')?.style.setProperty('display', 'block');
}
toast('Lezione completata! +20 XP','success');
STATE.userProfile.xp += 20;
saveState();
renderProfile();
const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
if (itemIndex === totalLessons - 1) {
setTimeout(() => {
$('quiz-container').style.display = 'block';
renderQuiz();
$('quiz-container').scrollIntoView({ behavior: 'smooth' });
}, 500);
}
}

function renderQuiz() {
const course = courses.find(c => c.id === currentLessonId);
if (!course || !course.quiz) return;
const question = course.quiz[currentQuizIndex];
$('quiz-progress').textContent = `Domanda ${currentQuizIndex + 1}/${course.quiz.length}`;
$('quiz-content').innerHTML = `
<div class="quiz-question">${question.q}</div>
<div class="quiz-options">
${question.options.map((opt, i) => `
<div class="quiz-option" onclick="selectQuizOption(${i})" role="button" tabindex="0" aria-label="Opzione ${i+1}: ${opt}">${opt}</div>
`).join('')}
</div>
`;
$('quiz-actions').innerHTML = `
<button class="btn btn-s" onclick="closeLesson()" aria-label="Chiudi quiz">Annulla</button>
<button class="btn btn-p" onclick="submitQuizAnswer()" id="submit-quiz-btn" disabled aria-label="Conferma risposta">Conferma</button>
`;
}

let selectedQuizOption = null;

function selectQuizOption(index) {
selectedQuizOption = index;
$$('.quiz-option').forEach((opt, i) => {
opt.classList.toggle('selected', i === index);
});
$('submit-quiz-btn').disabled = false;
}

function submitQuizAnswer() {
const course = courses.find(c => c.id === currentLessonId);
if (!course || !course.quiz) return;
const question = course.quiz[currentQuizIndex];
const isCorrect = selectedQuizOption === question.correct;
if (isCorrect) quizScore++;
const feedback = document.createElement('div');
feedback.className = `quiz-feedback ${isCorrect?'correct':'incorrect'}`;
feedback.innerHTML = isCorrect
? '<i class="fas fa-check-circle" aria-hidden="true"></i> <strong>Corretto!</strong> +10 XP'
: `<i class="fas fa-times-circle" aria-hidden="true"></i> <strong>Sbagliato.</strong> La risposta corretta era: ${question.options[question.correct]}`;
$('quiz-content').appendChild(feedback);
if (isCorrect) {
STATE.userProfile.xp += 10;
saveState();
renderProfile();
}
setTimeout(() => {
currentQuizIndex++;
if (currentQuizIndex < course.quiz.length) {
selectedQuizOption = null;
renderQuiz();
} else {
finishQuiz();
}
}, 2000);
}

function finishQuiz() {
const course = courses.find(c => c.id === currentLessonId);
const percentage = Math.round((quizScore / course.quiz.length) * 100);
$('quiz-content').innerHTML = `
<div style="text-align:center;padding:20px">
<div style="font-size:48px;margin-bottom:16px" aria-hidden="true">${percentage >= 70 ? '🎉' : '📚'}</div>
<h4 style="font-size:20px;margin-bottom:8px">Quiz completato!</h4>
<p style="color:var(--ink-2);margin-bottom:16px">Hai risposto correttamente a ${quizScore}/${course.quiz.length} domande (${percentage}%)</p>
${percentage >= 70 ? '<p style="color:var(--green);font-weight:600">Ottimo lavoro! Corso completato ✓</p>' : '<p style="color:var(--amber)">Riprova per migliorare il punteggio</p>'}
</div>
`;
$('quiz-actions').innerHTML = `
<button class="btn btn-s" onclick="closeLesson()" aria-label="Chiudi">Chiudi</button>
${percentage >= 70 ? `<button class="btn btn-p" onclick="generateCertificate('${course.title}')" aria-label="Scarica certificato">Scarica certificato</button>` : ''}
`;
if (percentage >= 70) {
STATE.userProfile.courses++;
STATE.courseProgress[currentLessonId] = 100;
saveState();
renderProfile();
}
}

function generateCertificate(courseName) {
const certWindow = window.open('', '_blank');
const date = new Date().toLocaleDateString('it-IT');
certWindow.document.write(`
<!DOCTYPE html>
<html><head><title>Certificato - ${courseName}</title>
<style>
body{font-family:'Syne',system-ui,sans-serif;padding:60px;background:linear-gradient(135deg,#f8f7f4,#e8e4dc);text-align:center}
.cert{border:12px solid #0E5C36;padding:60px;max-width:700px;margin:0 auto;background:#fff}
.logo{font-size:36px;font-weight:800;color:#0E5C36;margin-bottom:20px}
.title{font-size:24px;color:#17150F;margin-bottom:30px}
.name{font-size:42px;font-weight:700;color:#17150F;margin:40px 0;border-bottom:2px solid #0E5C36;padding-bottom:20px;display:inline-block}
.course{font-size:20px;color:#4B4640;margin:30px 0}
.date{font-family:'JetBrains Mono',monospace;font-size:14px;color:#8E8880}
.sigs{display:flex;justify-content:space-around;margin-top:60px}
.sig{border-top:2px solid #17150F;padding-top:10px;font-size:12px;color:#8E8880;width:200px}
</style></head><body>
<div class="cert">
<div class="logo">WeAreProject Academy</div>
<div class="title">Certificato di Completamento</div>
<p>Questo certifica che</p>
<div class="name">${STATE.userProfile.name}</div>
<p>ha completato con successo il corso</p>
<div class="course">${courseName}</div>
<div class="date">${date}</div>
<div class="sigs">
<div class="sig">Direttore Academy</div>
<div class="sig">HR Manager</div>
</div>
</div>
<script>window.print()<\/script>
</body></html>
`);
certWindow.document.close();
toast('Certificato generato! Si aprirà una finestra per la stampa 📜','success');
}

function completeCourse() {
const course = courses.find(c => c.id === currentLessonId);
if (course) {
generateCertificate(course.title);
}
closeLesson();
}

function closeLesson() { $('lesson-overlay').classList.remove('open'); }

// ═══════════════════════════════════════════════════════════════
// INTERVIEW SIMULATOR
// ═══════════════════════════════════════════════════════════════
let interviewState = { questionIndex: 0, answers: [], role: '' };
const interviewQuestions = {
frontend: [
'Spiega la differenza tra useState e useEffect in React. Quando useresti ciascuno?',
'Come ottimizzeresti le performance di un\'applicazione React con molti componenti?',
'Descrivi il Virtual DOM e come funziona il reconciliation process.'
],
backend: [
'Qual è la differenza tra SQL e NoSQL? Fai un esempio di quando usare ciascuno.',
'Spiega cos\'è un\'API REST e quali sono i principali HTTP methods.',
'Come gestisci l\'autenticazione e l\'autorizzazione in un\'applicazione backend?'
],
cloud: [
'Spiega la differenza tra IaaS, PaaS e SaaS con esempi concreti.',
'Come progetteresti un\'architettura cloud highly available su AWS?',
'Cosa è Kubernetes e quali problemi risolve rispetto a Docker standalone?'
],
security: [
'Descrivi il principio del least privilege e perché è importante.',
'Quali sono le principali vulnerabilità OWASP Top 10? Spiegane almeno 3.',
'Come funziona un attacco SQL injection e come si previene?'
],
ai: [
'Spiega la differenza tra supervised e unsupervised learning.',
'Cosa è un transformer e perché ha rivoluzionato il NLP?',
'Descrivi il concetto di RAG (Retrieval Augmented Generation).'
]
};

async function startInterview() {
const role = $('interview-role')?.value || 'frontend';
interviewState = { questionIndex: 0, answers: [], role };
const content = $('modal-content');
content.innerHTML = `
<div class="interview-container">
<div class="interview-header">
<div class="interview-avatar" aria-hidden="true">AI</div>
<div class="interview-info">
<div class="interview-role">Interviewer AI</div>
<div class="interview-company">WeAreProject Academy</div>
</div>
</div>
<div id="interview-content"></div>
</div>
`;
await askInterviewQuestion();
}

async function askInterviewQuestion() {
const questions = interviewQuestions[interviewState.role];
if (interviewState.questionIndex >= questions.length) {
await evaluateInterview();
return;
}
const question = questions[interviewState.questionIndex];
$('interview-content').innerHTML = `
<div class="interview-question">
<strong>Domanda ${interviewState.questionIndex + 1}/${questions.length}:</strong><br><br>
${question}
</div>
<textarea class="interview-answer" id="interview-answer" placeholder="Scrivi la tua risposta..." rows="6"></textarea>
<div class="quiz-actions" style="margin-top:16px">
<button class="btn btn-s" onclick="closeModal()" aria-label="Annulla colloquio">Annulla</button>
<button class="btn btn-blue" onclick="submitInterviewAnswer()" aria-label="Invia risposta">Invia risposta</button>
</div>
`;
setTimeout(() => $('interview-answer')?.focus(), 100);
}

async function submitInterviewAnswer() {
const answer = $('interview-answer')?.value;
if (!answer || answer.trim().length < 20) {
toast('La risposta è troppo breve. Scrivi almeno 20 caratteri.','warning');
return;
}
interviewState.answers.push(answer);
interviewState.questionIndex++;
$('interview-content').innerHTML = `
<div style="text-align:center;padding:40px">
<i class="fas fa-circle-notch fa-spin" style="font-size:32px;color:var(--blue);margin-bottom:16px" aria-hidden="true"></i>
<p style="color:var(--ink-2)">Valutazione risposta in corso...</p>
</div>
`;
await askInterviewQuestion();
}

async function evaluateInterview() {
const content = $('modal-content');
content.innerHTML = `
<div class="interview-container">
<div class="interview-header">
<div class="interview-avatar" aria-hidden="true">AI</div>
<div class="interview-info">
<div class="interview-role">Valutazione Completata</div>
<div class="interview-company">WeAreProject Academy</div>
</div>
</div>
<div style="text-align:center;padding:30px">
<i class="fas fa-spinner fa-spin" style="font-size:40px;color:var(--green);margin-bottom:20px" aria-hidden="true"></i>
<h4 style="font-size:18px;margin-bottom:12px">L'AI sta valutando le tue risposte...</h4>
<p style="color:var(--ink-2)">Questo richiede qualche secondo</p>
</div>
</div>
`;
setTimeout(() => {
const score = Math.floor(Math.random() * 30) + 60;
const feedback = getInterviewFeedback(score);
content.innerHTML = `
<div class="interview-container">
<div class="interview-feedback">
<h5>Valutazione Complessiva</h5>
<div class="interview-score">
<div class="score-bar"><div class="score-fill" style="width:${score}%"></div></div>
<div class="score-text">${score}/100</div>
</div>
<div style="margin-top:16px;font-size:14px;color:var(--ink-2);line-height:1.6">${feedback}</div>
</div>
<div class="quiz-actions" style="margin-top:20px">
<button class="btn btn-s" onclick="closeModal()" aria-label="Chiudi">Chiudi</button>
<button class="btn btn-blue" onclick="openModal('application')" aria-label="Candidati ora">Candidati ora</button>
</div>
</div>
`;
}, 2500);
}

function getInterviewFeedback(score) {
if (score >= 85) return '🌟 <strong>Eccellente!</strong> Le tue risposte dimostrano una solida preparazione tecnica. Sei pronto per un colloquio reale con i nostri team.';
if (score >= 70) return '✅ <strong>Buon lavoro!</strong> Hai buone basi tecniche. Con qualche approfondimento sarai pronto per il colloquio.';
return '📚 <strong>Continua a studiare!</strong> Hai delle basi ma ci sono aree da migliorare. Ti consigliamo di completare i corsi Academy4U.';
}

// ═══════════════════════════════════════════════════════════════
// AI CHATBOT
// ═══════════════════════════════════════════════════════════════
const AI_SYSTEM = `Sei l'assistente virtuale di WeAreProject Academy, la piattaforma di formazione del Gruppo WeAreProject (capogruppo: Project Informatica, sede a Stezzano BG).

Informazioni chiave:
- WeAreProject è un gruppo politecnologico da oltre 510 milioni di fatturato, 700+ dipendenti, 7.500+ clienti
- Composto da: Project Informatica (capogruppo), Sinthera, Extraordy, Personal Data, 3P Technologies, Ates Informatica, Converge, Project Adriatica, Fasternet
- Aree di specializzazione: Cybersecurity (SOC/NOC), Digital Workplace, Hybrid Cloud & Networking, Application & Data, AI, Managed Services
- Academy4U: percorso gratuito di 2 mesi per neodiplomati e neolaureati in area informatica
- PCTO: collaborazioni con istituti tecnici del territorio, incluso ITIS Marconi di Dalmine
- Corsi disponibili: AWS Cloud, Cybersecurity, AI & ML, React & TypeScript, Docker & K8s, Leadership, PostgreSQL, Generative AI

Rispondi in italiano, in modo professionale ma amichevole. Sii conciso (max 4-5 frasi per risposta).`;

function toggleAI() {
STATE.aiOpen = !STATE.aiOpen;
$('ai-chat-panel').classList.toggle('open', STATE.aiOpen);
$('ai-fab-icon').className = STATE.aiOpen ? 'fas fa-times' : 'fas fa-comment-dots';
if (STATE.notifOpen && STATE.aiOpen) toggleNotif();
if (STATE.aiOpen) $('ai-input')?.focus();
}

function updateAISuggestions() {
const sugBar = $('ai-sug-bar');
const suggestions = {
'home': ['Cos\'è Academy4U?', 'Corsi disponibili', 'Posizioni aperte'],
'dashboard': ['Come leggere analytics', 'Migliora KPI team', 'Report competenze'],
'dipendenti': ['Certificazioni incluse', 'Piano sviluppo', 'Sessioni mentoring'],
'studenti': ['Requisiti Academy4U', 'Durata programma', 'Assunzione dopo corso'],
'classifiche': ['Come guadagnare XP', 'Livelli e badge', 'Premi classifica'],
'profilo': ['Modifica competenze', 'Scarica certificati', 'Streak bonus']
};
const sectionSugs = suggestions[STATE.currentSection] || suggestions['home'];
sugBar.innerHTML = sectionSugs.map(s => `<button class="ai-sug" onclick="aiSug('${s}')" aria-label="${s}">${s}</button>`).join('');
}

function aiSug(text) {
$('ai-input').value = text;
aiSend();
}

function aiKeydown(e) {
if (e.key === 'Enter') aiSend();
}

async function aiSend() {
try {
const input = document.getElementById('ai-input');
if (!input) { console.error('[WAP AI] input non trovato'); return; }
const text = (input.value || '').trim();
if (!text || STATE.aiTyping) return;
input.value = '';
console.log('[WAP AI] >>>', text);
appendAIMessage(text, 'user');
STATE.aiMessages.push({ role: 'user', content: text });
STATE.aiTyping = true;
const sendBtn = document.getElementById('ai-send-btn');
if (sendBtn) sendBtn.disabled = true;
const typingEl = showAITyping();
let reply = null;
if (CONFIG.USE_REMOTE) {
try {
const ctrl = new AbortController();
const tid = setTimeout(() => ctrl.abort(), 6000);
const res = await fetch(CONFIG.API_URL, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
signal: ctrl.signal,
body: JSON.stringify({
model: CONFIG.MODEL,
max_tokens: CONFIG.MAX_TOKENS,
system: (typeof AI_SYSTEM !== 'undefined') ? AI_SYSTEM : '',
section: STATE.currentSection,
profile: { name: STATE.userProfile && STATE.userProfile.name, role: STATE.userProfile && STATE.userProfile.role, level: STATE.userProfile && STATE.userProfile.level },
messages: STATE.aiMessages.slice(-10)
})
});
clearTimeout(tid);
console.log('[WAP AI] /api/chat status:', res.status);
if (res.ok) {
const data = await res.json();
reply = data.reply || (data.content && data.content[0] && data.content[0].text) || null;
console.log('[WAP AI] provider:', data.provider);
} else if (res.status === 404) {
CONFIG.USE_REMOTE = false;
}
} catch (err) {
console.warn('[WAP AI] remote failed:', err && err.message);
}
}
if (!reply) {
await new Promise(function(r){ setTimeout(r, 350 + Math.random() * 450); });
try {
reply = wapLocalAI(text, STATE.aiMessages, STATE.currentSection);
} catch (err) {
console.error('[WAP AI] localAI error:', err);
reply = 'Ops, c\'e un problema interno. Riprova! 🔧';
}
}
if (!reply) reply = 'Non sono riuscito a generare una risposta. Riprova! 🤔';
if (typingEl && typingEl.remove) typingEl.remove();
console.log('[WAP AI] <<<', reply.substring(0, 100));
STATE.aiMessages.push({ role: 'assistant', content: reply });
appendAIMessage(reply, 'bot');
STATE.aiTyping = false;
if (sendBtn) sendBtn.disabled = false;
try { saveState(); } catch(e) { console.warn('saveState failed:', e); }
} catch (fatalErr) {
console.error('[WAP AI] FATAL:', fatalErr);
STATE.aiTyping = false;
const sb = document.getElementById('ai-send-btn');
if (sb) sb.disabled = false;
try { appendAIMessage('⚠️ Errore interno: ' + (fatalErr && fatalErr.message), 'bot'); } catch(e) {}
}
}

// ═══════════════════════════════════════════════════════════════
// MOTORE AI LOCALE — "WeAreProject Academy Engine v1"
// Intent matching + slot extraction + risposte context-aware.
// Funziona 100% offline: nessuna chiave API, nessun costo, nessun dato esfiltrato.
// ═══════════════════════════════════════════════════════════════
const WAP_KB = {
courses: [
{ key:'aws', kw:['aws','amazon','cloud practitioner'], title:'AWS Cloud Practitioner', hours:24, level:'Beginner', cert:'AWS Certified' },
{ key:'cyber', kw:['cyber','security','sicurezza','soc','siem'], title:'Cybersecurity Fundamentals', hours:18, level:'Intermediate', cert:'Security Cert' },
{ key:'ai', kw:['intelligenza','machine learning','ml python','python ai'], title:'AI & Machine Learning con Python', hours:30, level:'Advanced', cert:'AI Specialist' },
{ key:'react', kw:['react','typescript','frontend','ts','javascript'], title:'React & TypeScript Avanzato', hours:20, level:'Intermediate', cert:'Frontend Cert' },
{ key:'docker', kw:['docker','kubernetes','k8s','devops','container'], title:'Docker & Kubernetes', hours:22, level:'Intermediate', cert:'DevOps Cert' },
{ key:'lead', kw:['leadership','soft skill','comunicazione','team manager'], title:'Leadership & Comunicazione', hours:12, level:'All levels', cert:'Leadership' },
{ key:'zt', kw:['zero trust','defender','csoc'], title:'Zero Trust Security Architecture', hours:16, level:'Advanced', cert:'Security Advanced' },
{ key:'pg', kw:['postgres','sql','database','db design'], title:'PostgreSQL & Database Design', hours:14, level:'Intermediate', cert:'Database Cert' },
{ key:'gen', kw:['generative','genai','llm','prompt','rag','chatbot'], title:'Generative AI in Azienda', hours:10, level:'Intermediate', cert:'AI Champion' }
],
intents: [
{ id:'greet', kw:['ciao','salve','hey','buongiorno','buonasera','hi','hello'] },
{ id:'thanks', kw:['grazie','thank','thanks','ottimo','perfetto'] },
{ id:'bye', kw:['arrivederci','addio','a presto'] },
{ id:'who', kw:['chi sei','chi siete','cosa sei','presentati','about'] },
{ id:'company', kw:['weareproject','project informatica','gruppo','sede','bergamo','stezzano','ecosistema'] },
{ id:'academy4u', kw:['academy4u','academy 4u','neodiplomati','neolaureati','stage 2 mesi'] },
{ id:'jobs', kw:['posizion','lavoro','assunzion','candidat','job','stage','tirocinio','cv','curriculum'] },
{ id:'courses', kw:['corso','corsi','catalogo','formazione','impara','imparare','studiare'] },
{ id:'cert', kw:['certificazion','certificat','attestato','badge esame'] },
{ id:'career', kw:['carriera','career','percorso','crescita','consigli','suggeris','roadmap','diventare'] },
{ id:'mentor', kw:['mentor','tutor','affiancamento','1to1','one to one','session'] },
{ id:'wellbeing', kw:['benessere','wellbeing','mood','umore','stress','burnout','salute'] },
{ id:'analytics', kw:['dashboard','analytics','metric','kpi','grafico','statistic'] },
{ id:'ranking', kw:['classific','ranking','xp','livello','punti','leaderboard','premi'] },
{ id:'pcto', kw:['pcto','itis','marconi','scuola','studente','liceo','superior'] },
{ id:'price', kw:['cost','prezzo','quanto cost','tariff','pagament','gratuit'] },
{ id:'contact', kw:['contatt','email','telefono','recapit','scrivi'] }
]
};

function wapNorm(t) {
return (t || '').toLowerCase()
.replace(/[àáâä]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
.replace(/[òóôö]/g,'o').replace(/[ùúûü]/g,'u')
.replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
}

function wapDetectIntents(text) {
const t = wapNorm(text);
const scores = {};
for (const it of WAP_KB.intents) {
let s = 0;
for (const k of it.kw) if (t.includes(wapNorm(k))) s += k.length >= 6 ? 2 : 1;
if (s > 0) scores[it.id] = s;
}
return Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([id])=>id);
}

function wapMatchCourses(text) {
const t = wapNorm(text);
const hits = [];
for (const c of WAP_KB.courses) {
for (const k of c.kw) {
if (t.includes(wapNorm(k))) { hits.push(c); break; }
}
}
return hits;
}

function wapAnswer(intent, ctx) {
const name = (ctx && ctx.profile && ctx.profile.name || '').split(' ')[0] || '';
const hi = name ? (name + ', ') : '';
switch(intent){
case 'greet':
return `Ciao${name?' '+name:''}! 👋 Sono **WAP Assistant**, l'AI dell'Academy. Posso aiutarti con:\n• 📚 Corsi e certificazioni\n• 🎓 Academy4U (per studenti)\n• 💼 Posizioni aperte\n• 🚀 Career path personalizzato\n\nDi cosa vuoi parlare?`;
case 'thanks':
return `Figurati! 😊 Se vuoi posso suggerirti un **prossimo passo** nel tuo percorso formativo. Basta dirmi cosa stai studiando ora.`;
case 'bye':
return `A presto${name?' '+name:''}! 👋 Ricorda: la tua streak di studio ti aspetta nella sezione Profilo.`;
case 'who':
return `Sono **WAP Assistant**, l'assistente AI di WeAreProject Academy. Conosco il catalogo corsi, i percorsi di carriera del Gruppo e Academy4U.\n\n_Demo locale: nessun dato lascia il tuo browser._`;
case 'company':
return `**Gruppo WeAreProject** in numeri:\n• 510 M€ di fatturato\n• 700+ professionisti\n• 7.500+ clienti enterprise\n• 9 aziende specializzate\n\nCapogruppo: **Project Informatica** (Stezzano, BG). Aree: Cybersecurity SOC/NOC, Hybrid Cloud, AI Solutions, Digital Workplace, Application & Data, Managed Services.`;
case 'academy4u':
return `**Academy4U** è il percorso gratuito di 2 mesi per neodiplomati/neolaureati ICT.\n\n✅ Include:\n• Lezioni con tech lead WeAreProject\n• Affiancamento on the job su progetti reali\n• Possibile assunzione in apprendistato\n\n📩 Candidati: CV a **job@weareproject.it** con oggetto _"Candidatura Project ICT Academy"_.`;
case 'jobs':
return `${hi}al momento sono aperte:\n• 💻 Junior Frontend / Backend Developer\n• 🛡️ Junior Cybersecurity Analyst (SOC)\n• ☁️ Junior Cloud Engineer\n• 🤖 AI Engineer Trainee\n• 🎓 PCTO Cybersecurity & AI\n\nSede: Bergamo/Stezzano. Apri la sezione **Studenti** per candidarti.`;
case 'cert':
return `Le certificazioni del Gruppo includono:\n• AWS (Practitioner → Solutions Architect)\n• Microsoft Azure (Fundamentals → Expert)\n• Cisco CCNA / CCNP\n• VMware VCP\n• ISC2 / CompTIA Security+\n• Kubernetes CKA / CKAD\n\nOgni corso Academy include un **badge verificato** e prepara all'esame ufficiale. Vuoi un consiglio per un ruolo specifico?`;
case 'mentor':
return `Puoi prenotare una sessione 1to1 dalla sezione **Mentori**:\n• Marco Bianchi — Cloud Architect (AWS/Azure/K8s)\n• Sofia Ricci — Tech Lead Node.js & DevOps\n• Anna Greco — Security Lead (SOC/SIEM/Zero Trust)\n• Diego Lavezzi — AI Solution Manager\n\nLe sessioni durano 45 min e sono gratuite per i membri Academy.`;
case 'wellbeing':
return `Il tuo **wellbeing** conta. Dalla sezione Benessere puoi:\n• Fare il check-in settimanale dell'umore\n• Accedere allo sportello psicologico convenzionato\n• Prenotare la palestra aziendale\n• Consultare la polizza sanitaria estesa\n\nVuoi che apra il check-in adesso?`;
case 'analytics':
return `Nella **Dashboard formativa** trovi in tempo reale:\n• Ore di formazione tue e del team\n• Trend mensile di completamento\n• Distribuzione skill del reparto\n• Gap analysis vs ruoli target\n\nFiltri per dipartimento, periodo e tipologia di corso.`;
case 'ranking':
return `Il sistema di **gamification** funziona così:\n• +50 XP per modulo completato\n• +200 XP per quiz finale ≥80%\n• +500 XP per ogni certificazione\n• Streak giornaliera: +20 XP/giorno\n\nI primi 10 in classifica mensile ricevono **buoni Amazon 50€** e accesso prioritario ai workshop.`;
case 'pcto':
return `Per i **PCTO** collaboriamo con istituti tecnici del territorio (es. ITIS Marconi di Dalmine). Percorsi:\n• Intro a Cybersecurity & SOC\n• Lab di AI / Generative AI\n• Cloud basics su AWS/Azure\n• Soft skill per il mondo IT\n\nDocenti scuola + tutor aziendali. Parla con il referente PCTO del tuo istituto per attivarlo.`;
case 'price':
return `Per i **dipendenti** WeAreProject tutti i corsi Academy sono **gratuiti** (piano formativo annuale).\n\nPer gli **studenti** Academy4U è gratuita: l'unico investimento è il tuo tempo (2 mesi). Niente costi, niente clausole.`;
case 'contact':
return `Puoi raggiungerci qui:\n• 📧 academy@weareproject.it (info corsi)\n• 📧 job@weareproject.it (candidature)\n• 🏢 Via Galileo Galilei, 24050 Stezzano (BG)\n• 🌐 weareproject.it`;
case 'courses':
return `Abbiamo **9 corsi flagship** nel catalogo Academy:\n\n☁️ AWS Cloud Practitioner · 🛡️ Cybersecurity Fundamentals\n🤖 AI & ML con Python · ⚛️ React & TypeScript\n🐳 Docker & Kubernetes · 💼 Leadership\n🔐 Zero Trust Security · 🗄️ PostgreSQL\n🧠 Generative AI in Azienda\n\nVuoi dettagli su uno specifico? Scrivi il nome (es. _"parlami di docker"_).`;
}
return null;
}

function wapCareerAdvisor(text) {
const t = wapNorm(text);
const profiles = [
{ role:'cloud', kw:['cloud','aws','azure','infrastruttur','sysadm','devops','sre'],
  path:['AWS Cloud Practitioner', 'Docker & Kubernetes', 'Zero Trust Security Architecture'],
  end:'Cloud Engineer → Cloud Architect (3-5 anni)' },
{ role:'security', kw:['security','sicurezza','soc','siem','hack','pentest','defender'],
  path:['Cybersecurity Fundamentals', 'Zero Trust Security Architecture', 'AI & Machine Learning con Python'],
  end:'SOC Analyst L1 → Security Engineer → Security Lead' },
{ role:'ai', kw:['ai','ml','machine learning','data scientist','llm','python','intelligenza','genai'],
  path:['AI & Machine Learning con Python', 'Generative AI in Azienda', 'PostgreSQL & Database Design'],
  end:'AI Engineer → AI Solution Manager' },
{ role:'fe', kw:['frontend','front end','react','typescript','ui','ux','web'],
  path:['React & TypeScript Avanzato', 'PostgreSQL & Database Design', 'Leadership & Comunicazione'],
  end:'Frontend Dev → Full Stack → Tech Lead' },
{ role:'be', kw:['backend','back end','api','postgres','java','node','microservizi'],
  path:['PostgreSQL & Database Design', 'Docker & Kubernetes', 'AWS Cloud Practitioner'],
  end:'Backend Dev → Senior Backend → Solution Architect' }
];
for (const p of profiles) {
if (p.kw.some(k => t.includes(wapNorm(k)))) {
const steps = p.path.map((c,i)=>`${i+1}. **${c}**`).join('\n');
return `🚀 **Career path consigliato** (profilo: ${p.role.toUpperCase()})\n\n${steps}\n\n🎯 Obiettivo: _${p.end}_\n\nVuoi che ti apra il primo corso?`;
}
}
return null;
}

function wapLocalAI(text, history, section) {
if (!text || !text.trim()) return 'Dimmi pure, sono qui per aiutarti! 😊';

const t = wapNorm(text);
const courseHits = wapMatchCourses(text);
const intents = wapDetectIntents(text);
const userName = (STATE.userProfile && STATE.userProfile.name || '').split(' ')[0];

// ─── Domande dirette su specifico corso ───────────────────────
if (courseHits.length === 1) {
const c = courseHits[0];
const correlated = WAP_KB.courses.filter(x => x.key !== c.key && x.kw.some(k => c.kw.some(ck => ck.includes(k.split(' ')[0]) || k.split(' ')[0].includes(ck)))).slice(0,2);
const rel = correlated.length ? `\n\n💡 _Corsi correlati:_ ${correlated.map(x=>'**'+x.title+'**').join(', ')}` : '';
return `📘 **${c.title}**\n• Durata: **${c.hours}h**\n• Livello: ${c.level}\n• Badge finale: ${c.cert}\n\nIl corso è disponibile nella sezione **Catalogo**.${rel}`;
}
if (courseHits.length > 1) {
const list = courseHits.slice(0,5).map(c=>`• **${c.title}** — ${c.hours}h (${c.level})`).join('\n');
return `Ho trovato ${courseHits.length} corsi in linea con la tua domanda:\n\n${list}\n\nDi quale vuoi sapere di più?`;
}

// ─── Domande "quanti / quanto / qual è / dove / come / chi" ───
if (/\b(quanti|quante)\b/.test(t) && /\b(corsi|corso)\b/.test(t)) {
return `Nel catalogo Academy ci sono **${WAP_KB.courses.length} corsi flagship**, suddivisi in Cloud, Cybersecurity, AI & Data, Development e Soft Skills. Per il catalogo completo apri la sezione **Catalogo corsi**.`;
}
if (/\b(quanto|quante ore|durata)\b/.test(t) && /\b(academy4u|programma|percorso)\b/.test(t)) {
return `**Academy4U dura 2 mesi**: prime settimane in aula con docenti WeAreProject, poi affiancamento on the job su progetti reali. Al termine i profili migliori entrano nel Gruppo con apprendistato.`;
}
if (/\b(quanto|quanti)\b/.test(t) && /\b(dipendenti|persone|professionist)\b/.test(t)) {
return `WeAreProject conta **700+ professionisti** in 9 aziende del Gruppo, distribuiti su tutto il territorio nazionale.`;
}
if (/\b(cost|prezz|gratis|gratuit|pagar|tariff|tassa)\b/.test(t)) {
return `Per i **dipendenti** WeAreProject i corsi Academy sono **gratuiti** (rientrano nel piano formativo). Per gli **studenti**, **Academy4U è completamente gratuita**: niente costi, niente clausole, solo il tuo tempo (2 mesi).`;
}
if (/\b(fatturato|turnover|ricav|revenue)\b/.test(t) || (/\bquanto\b/.test(t) && /\b(guadagn|incass|vale)\b/.test(t))) {
return `Il Gruppo WeAreProject ha un fatturato di **510 milioni di €** (dato 2024), con oltre **7.500 clienti enterprise**.`;
}
if (/\b(dove|sede|indirizzo|ufficio)\b/.test(t)) {
return `La sede del capogruppo **Project Informatica** è a **Stezzano (BG)**, Via Galileo Galilei. Le altre aziende del Gruppo sono distribuite in tutta Italia (Brescia, Adriatica, ecc.).`;
}
if (/(candidar|iscriver|come fare per|come entrar|come acceder|come partecipo|invio cv|invia cv|invio del cv|invio del curriculum|invia il cv|mandar.{0,8}cv|partecipar.{0,15}academy)/.test(t)) {
return `Per candidarti ad **Academy4U** invia il CV a 📧 **job@weareproject.it** con oggetto _"Candidatura Project ICT Academy"_. Nessuna esperienza richiesta, valutiamo motivazione e attitudine.`;
}
if (/\b(chi)\b/.test(t) && /\b(mentor|insegn|docent|tutor)\b/.test(t)) {
return `I nostri **mentor** sono tech lead WeAreProject: Marco Bianchi (Cloud), Sofia Ricci (DevOps), Anna Greco (Security), Diego Lavezzi (AI), Elena Conti (UX), Luca Ferrari (Backend) e altri. Sessioni 45 min gratuite.`;
}
if (/\b(quali|quale|che)\b/.test(t) && /\b(linguaggi|tecnologie|stack)\b/.test(t)) {
return `Le tecnologie principali in WeAreProject:\n• **Cloud**: AWS, Azure, Kubernetes\n• **Backend**: Node.js, Python, Java\n• **Frontend**: React, TypeScript\n• **Data**: PostgreSQL, Snowflake\n• **AI**: LLM, RAG, scikit-learn\n• **Security**: SIEM, Zero Trust, Defender`;
}
if (/\b(piu|più) (popolar|richiest|vendut|seguit)\b/.test(t)) {
return `Il corso più seguito al momento è **Leadership & Comunicazione** (310 studenti) seguito da **React & TypeScript Avanzato** (234) e **Generative AI in Azienda** (203). _GenAI ha anche il rating più alto: 5.0_ ⭐`;
}

// ─── Career advisor (prima degli intent perché matcha anche "ruolo") ───
if (intents.includes('career') || /\b(diventare|diventar|vorrei essere|voglio fare|aspiro|punto a)\b/.test(t)) {
const ca = wapCareerAdvisor(text);
if (ca) return ca;
return `Per costruirti un **career path personalizzato**, dimmi:\n1. Ruolo o area di interesse? (cloud, security, AI, frontend, backend)\n2. Livello attuale? (junior / mid / senior)\n3. Obiettivo? (certificazione / promozione / cambio ruolo)\n\nCosì ti propongo la roadmap giusta.`;
}

// ─── Intent principali ───────────────────────────────────────
if (intents.length) {
const ans = wapAnswer(intents[0], { section, profile: STATE.userProfile });
if (ans) return ans;
}

// ─── Domande "yes/no" comuni ───────────────────────────────────
if (/^(si|sì|yes|ok|certo|certamente|sicuro|d accordo)$/.test(t)) {
return `Ottimo! 👌 Dimmi qual è l'argomento: corsi, Academy4U, career path, posizioni aperte, info azienda... Resto in ascolto.`;
}
if (/^(no|nope|non ora)$/.test(t)) {
return `Nessun problema! Quando vuoi sono qui. Posso aiutarti con corsi, certificazioni, Academy4U o consigliarti un career path. 😊`;
}

// ─── Suggerimenti context-aware in base alla sezione ──────────
const sectionTips = {
'dashboard': '📊 Sei sulla **Dashboard**. Posso aiutarti a interpretare gli analytics o suggerirti come migliorare i KPI del tuo team. Cosa vuoi vedere?',
'studenti': '🎓 Sei nella sezione **Studenti**: chiedimi di Academy4U, requisiti, candidature o simulazioni di colloquio.',
'dipendenti': '💼 Sei nella sezione **Dipendenti**: posso consigliarti certificazioni, mentor disponibili o il prossimo modulo nel tuo piano formativo.',
'classifiche': '🏆 Sei nelle **Classifiche**: dimmi se vuoi sapere come guadagnare XP, sbloccare badge o vincere i premi mensili.',
'profilo': '👤 Sei sul tuo **Profilo**: posso aiutarti a modificare competenze, scaricare certificati o gestire la streak di studio.'
};
if (sectionTips[section]) return sectionTips[section];

// ─── Fallback strutturato (non più "non ho capito") ───────────
const greeting = userName ? userName + ', forse ' : 'Forse ';
return `${greeting}stai cercando una di queste informazioni? 🤔\n\n• 📚 **Corsi** — chiedimi "_parlami di AWS_", "_quanti corsi ci sono_"\n• 🎓 **Academy4U** — "_come funziona_", "_quanto dura_"\n• 🚀 **Career Path** — "_voglio diventare cloud engineer_"\n• 💼 **Posizioni aperte** — "_quali stage avete?_"\n• 🏢 **Gruppo WeAreProject** — "_quanti dipendenti_", "_dove siete_"\n• 👥 **Mentor** — "_chi mi può aiutare con K8s?_"\n\nProva a riformulare oppure scegli uno di questi argomenti!`;
}


// Compat: alcuni vecchi pezzi del codice chiamano ancora getFallbackAI
function getFallbackAI(question) {
return wapLocalAI(question, STATE.aiMessages, STATE.currentSection);
}

function appendAIMessage(text, from) {
const msgs = $('ai-messages');
const div = document.createElement('div');
div.className = `ai-msg ${from === 'user' ? 'user' : ''}`;
const renderedText = text
.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
.replace(/\*(.*?)\*/g, '<em>$1</em>')
.replace(/\n• /g, '<br>• ')
.replace(/\n/g, '<br>');
div.innerHTML = `
<div class="ai-msg-ava ${from === 'user' ? 'ai-ava-user' : 'ai-ava-bot'}" aria-hidden="true">${from === 'user' ? 'TU' : 'WP'}</div>
<div class="ai-msg-bubble ${from}">${renderedText}</div>
`;
msgs.appendChild(div);
msgs.scrollTop = msgs.scrollHeight;
}

function showAITyping() {
const msgs = $('ai-messages');
const div = document.createElement('div');
div.className = 'ai-msg';
div.innerHTML = `
<div class="ai-msg-ava ai-ava-bot" aria-hidden="true">WP</div>
<div class="ai-typing"><div class="ai-typing-dot" aria-hidden="true"></div><div class="ai-typing-dot" aria-hidden="true"></div><div class="ai-typing-dot" aria-hidden="true"></div></div>
`;
msgs.appendChild(div);
msgs.scrollTop = msgs.scrollHeight;
return div;
}

// ═══════════════════════════════════════════════════════════════
// COMMAND PALETTE
// ═══════════════════════════════════════════════════════════════
function openCmdPalette() {
STATE.cmdOpen = true;
$('cmd-overlay').classList.add('open');
$('cmd-input').value = '';
$('cmd-input').focus();
renderCmdResults('');
renderCmdHistory();
}

function closeCmdPalette(e) {
if (e && e.target !== $('cmd-overlay')) return;
STATE.cmdOpen = false;
$('cmd-overlay').classList.remove('open');
}

function renderCmdResults(query) {
const results = $('cmd-results');
const q = query.toLowerCase();
const sections = [];
const courseResults = courses.filter(c =>
c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q)
).slice(0, 4);
if (courseResults.length) {
sections.push({
title: 'Corsi',
items: courseResults.map(c => ({
icon: c.emoji,
iconClass: c.tagClass.replace('thumb-', 'cmd-item-icon-'),
title: c.title,
desc: `${c.hours} · ${c.tag}`,
action: () => { openLesson(c.id); closeCmdPalette(); }
}))
});
}
const sectionResults = [
{ id: 'home', title: 'Home', desc: 'Pagina principale', icon: '🏠' },
{ id: 'dashboard', title: 'Dashboard', desc: 'Analytics e KPI', icon: '📊' },
{ id: 'dipendenti', title: 'Area Dipendenti', desc: 'Corsi e mentoring', icon: '👔' },
{ id: 'studenti', title: 'Academy4U', desc: 'Programma studenti', icon: '🎓' },
{ id: 'classifiche', title: 'Classifiche', desc: 'Leaderboard XP', icon: '🏆' },
{ id: 'profilo', title: 'Profilo', desc: 'Il tuo profilo', icon: '👤' }
].filter(s => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
if (sectionResults.length) {
sections.push({
title: 'Sezioni',
items: sectionResults.map(s => ({
icon: s.icon,
iconClass: 'cmd-item-icon-s',
title: s.title,
desc: s.desc,
action: () => { show(s.id); closeCmdPalette(); }
}))
});
}
const eventResults = calEvents.filter(e => e.title.toLowerCase().includes(q)).slice(0, 3);
if (eventResults.length) {
sections.push({
title: 'Eventi',
items: eventResults.map(e => ({
icon: '📅',
iconClass: 'cmd-item-icon-g',
title: e.title,
desc: `${monthNames[e.month]} ${e.day} · ${e.time}`,
action: () => { toast(`${e.title} aggiunto al calendario`,'success'); closeCmdPalette(); }
}))
});
}
if (!sections.length) {
results.innerHTML = '<div style="padding:30px;text-align:center;color:var(--ink-3)">Nessun risultato trovato</div>';
return;
}
results.innerHTML = sections.map(s => `
<div class="cmd-section">${s.title}</div>
${s.items.map((item, i) => `
<div class="cmd-item ${i===0?'selected':''}" onclick="${item.action.toString().includes('function')?'void(0)':item.action}" role="option" tabindex="0">
<div class="cmd-item-icon ${item.iconClass}" aria-hidden="true">${item.icon}</div>
<div class="cmd-item-content">
<div class="cmd-item-title">${item.title}</div>
<div class="cmd-item-desc">${item.desc}</div>
</div>
<span class="cmd-item-shortcut">↵</span>
</div>
`).join('')}
`).join('');
$$('.cmd-item').forEach((item, i) => {
item.onclick = () => { sections.flatMap(s => s.items)[i]?.action(); };
item.onkeydown = (e) => {
if (e.key === 'Enter') { sections.flatMap(s => s.items)[i]?.action(); }
};
});
}

function renderCmdHistory() {
const history = $('cmd-history');
if (!STATE.searchHistory.length) {
history.innerHTML = '';
return;
}
history.innerHTML = `
<span class="cmd-history-label">Recenti:</span>
${STATE.searchHistory.slice(0, 5).map(s => `
<span class="cmd-history-item" onclick="$('cmd-input').value='${s}';renderCmdResults('${s}')" role="button" tabindex="0">${s}</span>
`).join('')}
`;
}

$('cmd-input')?.addEventListener('input', (e) => {
const val = e.target.value;
renderCmdResults(val);
if (val.length > 2 && !STATE.searchHistory.includes(val)) {
STATE.searchHistory.unshift(val);
STATE.searchHistory = STATE.searchHistory.slice(0, 10);
saveState();
renderCmdHistory();
}
});

// ═══════════════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════════════
function handleSearch(val) {
if (val.length > 2) {
const found = courses.filter(c =>
c.title.toLowerCase().includes(val.toLowerCase()) ||
c.desc.toLowerCase().includes(val.toLowerCase())
);
if (found.length > 0) {
show('home');
setTimeout(() => $('corsi-section')?.scrollIntoView({behavior:'smooth'}), 100);
filterCourses('tutti', $$('.cfilter')[0]);
}
}
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════
function markRead(i) { notifs[i].unread = false; renderNotifs(); }
function markAllRead() { notifs.forEach(n => n.unread = false); renderNotifs(); toast('Tutte le notifiche segnate come lette','info'); }
function toggleNotif() {
STATE.notifOpen = !STATE.notifOpen;
$('notif-panel').classList.toggle('open', STATE.notifOpen);
if (STATE.aiOpen && STATE.notifOpen) toggleAI();
}

// ═══════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════
function toggleTheme() {
STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
document.body.classList.toggle('dark', STATE.theme === 'dark');
$('theme-icon').className = STATE.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
saveState();
}

// ═══════════════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════════════
let onboardingStep = 1;
let onboardingData = { type: '', skills: [], goal: '' };

function showOnboarding() {
if (STATE.onboardingComplete) return;
$('onboarding-overlay').classList.add('open');
renderOnboardingStep(1);
}

function renderOnboardingStep(step) {
onboardingStep = step;
$$('.onboarding-step').forEach((s, i) => {
s.classList.toggle('active', i + 1 === step);
s.classList.toggle('completed', i + 1 < step);
});
const content = $('onboarding-content');
if (step === 1) {
content.innerHTML = `
<h2 class="onboarding-h">Benvenuto in WeAreProject Academy</h2>
<p class="onboarding-sub">Iniziamo configurando il tuo profilo. Chi sei?</p>
<div class="onboarding-options">
<div class="onboarding-option" onclick="selectOnboardingOption('type','employee',this)" role="button" tabindex="0">
<div class="onboarding-option-icon oi-g" aria-hidden="true"><i class="fas fa-id-badge"></i></div>
<div class="onboarding-option-text">
<div class="onboarding-option-title">Dipendente WeAreProject</div>
<div class="onboarding-option-desc">Hai già un'azienda email e vuoi crescere professionalmente</div>
</div>
</div>
<div class="onboarding-option" onclick="selectOnboardingOption('type','student',this)" role="button" tabindex="0">
<div class="onboarding-option-icon oi-b" aria-hidden="true"><i class="fas fa-graduation-cap"></i></div>
<div class="onboarding-option-text">
<div class="onboarding-option-title">Studente / Neolaureato</div>
<div class="onboarding-option-desc">Vuoi entrare nel Gruppo con Academy4U</div>
</div>
</div>
<div class="onboarding-option" onclick="selectOnboardingOption('type','external',this)" role="button" tabindex="0">
<div class="onboarding-option-icon oi-a" aria-hidden="true"><i class="fas fa-user-tie"></i></div>
<div class="onboarding-option-text">
<div class="onboarding-option-title">Candidato Esterno</div>
<div class="onboarding-option-desc">Vuoi esplorare opportunità di carriera</div>
</div>
</div>
</div>
<div class="onboarding-actions">
<button class="btn-primary" onclick="nextOnboardingStep()" disabled id="onboarding-next-1">Continua</button>
</div>
`;
} else if (step === 2) {
content.innerHTML = `
<h2 class="onboarding-h">Quali tecnologie conosci?</h2>
<p class="onboarding-sub">Seleziona tutte quelle che hai già utilizzato. Ci aiuterà a consigliarti i corsi giusti.</p>
<div class="tech-chips" style="margin-bottom:28px">
${['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'SQL', 'Git', 'Linux', 'Cybersecurity'].map(t => `
<div class="tech-chip" onclick="toggleOnboardingSkill('${t}',this)" role="button" tabindex="0" aria-pressed="false">${t}</div>
`).join('')}
</div>
<div class="onboarding-actions">
<button class="btn-secondary" onclick="prevOnboardingStep()">Indietro</button>
<button class="btn-primary" onclick="nextOnboardingStep()">Continua</button>
</div>
`;
} else if (step === 3) {
content.innerHTML = `
<h2 class="onboarding-h">Qual è il tuo obiettivo?</h2>
<p class="onboarding-sub">Cosa vuoi raggiungere con WeAreProject Academy?</p>
<div class="onboarding-options">
<div class="onboarding-option" onclick="selectOnboardingOption('goal','advancement',this)" role="button" tabindex="0">
<div class="onboarding-option-icon oi-g" aria-hidden="true"><i class="fas fa-chart-line"></i></div>
<div class="onboarding-option-text">
<div class="onboarding-option-title">Avanzamento di carriera</div>
<div class="onboarding-option-desc">Vuoi ottenere una promozione o cambio ruolo</div>
</div>
</div>
<div class="onboarding-option" onclick="selectOnboardingOption('goal','certification',this)" role="button" tabindex="0">
<div class="onboarding-option-icon oi-b" aria-hidden="true"><i class="fas fa-certificate"></i></div>
<div class="onboarding-option-text">
<div class="onboarding-option-title">Certificazioni</div>
<div class="onboarding-option-desc">Vuoi ottenere certificazioni vendor (AWS, Azure, etc.)</div>
</div>
</div>
<div class="onboarding-option" onclick="selectOnboardingOption('goal','hiring',this)" role="button" tabindex="0">
<div class="onboarding-option-icon oi-a" aria-hidden="true"><i class="fas fa-briefcase"></i></div>
<div class="onboarding-option-text">
<div class="onboarding-option-title">Assunzione in WeAreProject</div>
<div class="onboarding-option-desc">Vuoi entrare nel Gruppo come dipendente</div>
</div>
</div>
</div>
<div class="onboarding-actions">
<button class="btn-secondary" onclick="prevOnboardingStep()">Indietro</button>
<button class="btn-primary" onclick="completeOnboarding()" id="onboarding-complete">Completa</button>
</div>
`;
}
}

function selectOnboardingOption(key, value, el) {
onboardingData[key] = value;
el.parentElement.querySelectorAll('.onboarding-option').forEach(o => o.classList.remove('selected'));
el.classList.add('selected');
if (key === 'type') $('onboarding-next-1').disabled = false;
if (key === 'goal') $('onboarding-complete').disabled = false;
}

function toggleOnboardingSkill(skill, el) {
el.classList.toggle('selected');
el.setAttribute('aria-pressed', el.classList.contains('selected'));
if (el.classList.contains('selected')) {
onboardingData.skills.push(skill);
} else {
onboardingData.skills = onboardingData.skills.filter(s => s !== skill);
}
}

function nextOnboardingStep() {
if (onboardingStep < 3) renderOnboardingStep(onboardingStep + 1);
}

function prevOnboardingStep() {
if (onboardingStep > 1) renderOnboardingStep(onboardingStep - 1);
}

function completeOnboarding() {
STATE.onboardingComplete = true;
localStorage.setItem('wap-onboarding', 'true');
if (onboardingData.type === 'student') {
STATE.userProfile.role = 'Studente Academy4U';
}
STATE.userProfile.skills = [...new Set([...STATE.userProfile.skills, ...onboardingData.skills])];
saveState();
$('onboarding-overlay').classList.remove('open');
toast('Profilo configurato! Benvenuto in WeAreProject Academy 🎉','success');
showPersonalizedBanner();
}

function showPersonalizedBanner() {
const banner = document.createElement('div');
banner.style.cssText = 'background:var(--green-lt);border:1px solid rgba(14,92,54,0.2);border-radius:var(--r-lg);padding:20px 28px;margin:20px auto;max-width:1140px;display:flex;align-items:center;gap:16px';
banner.innerHTML = `
<div style="font-size:28px" aria-hidden="true">🎯</div>
<div style="flex:1">
<strong style="color:var(--green);font-size:15px">Il tuo percorso consigliato</strong>
<p style="color:var(--ink-2);font-size:13.5px;margin-top:4px">Basato sul tuo profilo, ti consigliamo di iniziare con: <strong>AWS Cloud Practitioner</strong> e <strong>React & TypeScript</strong></p>
</div>
<button class="btn btn-p" onclick="scrollToSection('corsi-section');this.parentElement.remove()" aria-label="Vedi corsi consigliati">Vedi corsi</button>
`;
const heroInner = document.querySelector('.hero-inner');
heroInner?.insertAdjacentElement('afterend', banner);
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD ANALYTICS
// ═══════════════════════════════════════════════════════════════
let progressChart, skillsChart, moodChart;

function initCharts() {
const progressCtx = document.getElementById('progressChart');
if (progressCtx) {
progressChart = new Chart(progressCtx, {
type: 'line',
data: {
labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
datasets: [{
label: 'Ore di formazione',
data: [120, 145, 180, 210, 245, 280],
borderColor: 'var(--green)',
backgroundColor: 'rgba(14,92,54,0.1)',
tension: 0.4,
fill: true
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: { legend: { display: false } },
scales: {
y: { beginAtZero: true, grid: { color: 'var(--border)' } },
x: { grid: { display: false } }
}
}
});
}
const skillsCtx = document.getElementById('skillsChart');
if (skillsCtx) {
skillsChart = new Chart(skillsCtx, {
type: 'doughnut',
data: {
labels: ['Cloud', 'Security', 'Development', 'AI/Data', 'Soft Skills'],
datasets: [{
data: [35, 25, 20, 15, 5],
backgroundColor: ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--amber)', 'var(--purple)'],
borderWidth: 0
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: { position: 'right', labels: { usePointStyle: true } }
}
}
});
}
const moodCtx = document.getElementById('moodChart');
if (moodCtx) {
moodChart = new Chart(moodCtx, {
type: 'line',
data: {
labels: ['1', '2', '3', '4', '5', '6', '7'],
datasets: [{
label: 'Umore',
data: STATE.moodHistory.length ? STATE.moodHistory.slice(-7) : [3, 4, 3, 5, 4, 4, 5],
borderColor: 'var(--green)',
tension: 0.4,
pointBackgroundColor: 'var(--green)'
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: { legend: { display: false } },
scales: {
y: { min: 1, max: 5, ticks: { stepSize: 1 } },
x: { display: false }
}
}
});
}
}

function renderHeatmap() {
const heatmap = $('activity-heatmap');
if (!heatmap) return;
let html = '';
for (let i = 0; i < 28; i++) {
const intensity = Math.floor(Math.random() * 5);
html += `<div class="heatmap-day hm-${intensity}" title="Attività: ${intensity}" aria-label="Giorno ${i+1}, livello attività ${intensity}"></div>`;
}
heatmap.innerHTML = html;
}

function setDashFilter(filter, btn) {
$$('.dash-filter').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
toast(`Filtro applicato: ${btn.textContent}`,'info');
}

function animateCounters() {
$$('.kpi-card-value[data-count]').forEach(el => {
const target = parseInt(el.dataset.count);
let current = 0;
const increment = target / 50;
const timer = setInterval(() => {
current += increment;
if (current >= target) {
el.textContent = target.toLocaleString();
clearInterval(timer);
} else {
el.textContent = Math.floor(current).toLocaleString();
}
}, 30);
});
}

// ═══════════════════════════════════════════════════════════════
// WELLNESS & MOOD
// ═══════════════════════════════════════════════════════════════
function submitMoodCheck() {
const slider = $('mood-slider');
const mood = parseInt(slider.value);
STATE.moodHistory.push(mood);
saveState();
if (moodChart) {
moodChart.data.datasets[0].data = STATE.moodHistory.slice(-7);
moodChart.update();
}
toast('Check-in inviato! Grazie per il feedback 💚','success');
if (mood <= 2) {
$('ai-wellness-suggestion').style.display = 'block';
$('wellness-suggestion-text').textContent = 'Abbiamo notato un momento difficile. Ricorda che puoi: • Parlare con il tuo manager • Contattare HR • Usare il supporto psicologico 24/7';
}
}

// ═══════════════════════════════════════════════════════════════
// HERO CANVAS PARTICLES
// ═══════════════════════════════════════════════════════════════
function initHeroCanvas() {
const canvas = $('hero-canvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 40;
function resize() {
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;
}
resize();
window.addEventListener('resize', resize);
class Particle {
constructor() {
this.x = Math.random() * canvas.width;
this.y = Math.random() * canvas.height;
this.vx = (Math.random() - 0.5) * 0.3;
this.vy = (Math.random() - 0.5) * 0.3;
this.size = Math.random() * 2 + 1;
}
update() {
this.x += this.vx;
this.y += this.vy;
if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
}
draw() {
ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--green');
ctx.beginPath();
ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
ctx.fill();
}
}
for (let i = 0; i < particleCount; i++) particles.push(new Particle());
function animate() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
particles.forEach(p => { p.update(); p.draw(); });
requestAnimationFrame(animate);
}
animate();
}

// ═══════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER FOR ANIMATIONS
// ═══════════════════════════════════════════════════════════════
function initIntersectionObserver() {
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
}
});
}, { threshold: 0.1 });
$$('.fade-in-up').forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════
function initKeyboardShortcuts() {
document.addEventListener('keydown', e => {
if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
e.preventDefault();
openCmdPalette();
}
if (e.key === 'Escape') {
closeModal({ target: $('modal-overlay') });
closeLesson();
if (STATE.aiOpen) toggleAI();
if (STATE.notifOpen) toggleNotif();
if (STATE.cmdOpen) closeCmdPalette();
}
});
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION PERMISSION
// ═══════════════════════════════════════════════════════════════
function requestNotificationPermission() {
if ('Notification' in window && Notification.permission === 'default') {
setTimeout(() => { Notification.requestPermission(); }, 5000);
}
}

// ═══════════════════════════════════════════════════════════════
// SIMULATE LIVE UPDATES
// ═══════════════════════════════════════════════════════════════
function simulateLiveUpdates() {
setInterval(() => {
if (STATE.currentSection === 'classifiche') {
const randomIdx = Math.floor(Math.random() * (leaderboardData.length - 2)) + 2;
leaderboardData[randomIdx].xp += Math.floor(Math.random() * 50);
renderLeaderboard();
}
}, 30000);
}

// ═══════════════════════════════════════════════════════════════
// INIT - SEMPLIFICATO (NO LOADING SCREEN)
// ═══════════════════════════════════════════════════════════════
function initApp() {
// Applica tema salvato
if (STATE.theme === 'dark') {
document.body.classList.add('dark');
const themeIcon = document.getElementById('theme-icon');
if (themeIcon) themeIcon.className = 'fas fa-sun';
}

// Render iniziale
renderCourses('tutti');
renderCourses('tutti', 'student-courses-grid');
renderMentors('mentor-grid');
renderMentors('mentor-grid-2');
renderSkills();
renderNotifs();
renderCalendar();
renderLeaderboard();
renderProfile();

// Charts & animations
initCharts();
renderHeatmap();
initHeroCanvas();
initIntersectionObserver();
initKeyboardShortcuts();

// Notifications & live features
requestNotificationPermission();
simulateLiveUpdates();

// Animate KPI counters on dashboard
setTimeout(() => {
const dashboard = document.getElementById('dashboard');
if (dashboard && dashboard.classList.contains('active')) {
animateCounters();
}
}, 500);

// Onboarding & welcome
setTimeout(() => showOnboarding(), 800);
setTimeout(() => toast('👋 Benvenuto all\'Hackathon ITIS Marconi! Esplora l\'Academy', 'info', 'fas fa-star'), 1200);
}

// Avvio immediato - nessun loading screen
document.addEventListener('DOMContentLoaded', () => {
setTimeout(initApp, 50);
});
