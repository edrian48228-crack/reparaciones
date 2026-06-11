const App = (() => {
  let current = 'dashboard';
  let currentArg = null;

  // SVG logo por defecto: llave inglesa + destornillador cruzados (más limpio)
  const BRAND_LOGO_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lgA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".95"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity=".75"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="url(#lgA)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
    <!-- Llave inglesa -->
    <path d="M14 50 L36 28" />
    <path d="M12 52 a4 4 0 1 1 5 -5" />
    <path d="M40 24 a8 8 0 1 0 -10 -10 l5 5 -3 3 -5 -5 a8 8 0 0 0 10 10 z" fill="url(#lgA)" fill-opacity=".18"/>
    <!-- Destornillador cruzado -->
    <path d="M50 14 L30 34" />
    <path d="M52 12 l4 4 -4 4 -4 -4 z" fill="url(#lgA)" fill-opacity=".25"/>
    <path d="M30 34 L26 38 L22 34 L26 30 Z" fill="url(#lgA)" fill-opacity=".25"/>
  </g>
</svg>`.trim();

  // Presets de logos (iconos intuitivos de taller)
  const LOGO_PRESETS = [
    { key:'tools', name:'Herramientas', svg: BRAND_LOGO_SVG },
    { key:'gear',  name:'Engranaje', svg: `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor">
    <path d="M32 20a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
    <path d="M55 32l-3.7-2.1.6-4.2-4.1-1.1-1.5-4-4.2.3-3-3-3.4 2.5L32 19l-3.7-1.6-3.4-2.5-3 3-4.2-.3-1.5 4-4.1 1.1.6 4.2L9 32l3.7 2.1-.6 4.2 4.1 1.1 1.5 4 4.2-.3 3 3 3.4-2.5L32 45l3.7 1.6 3.4 2.5 3-3 4.2.3 1.5-4 4.1-1.1-.6-4.2z" fill="none" stroke="currentColor" stroke-width="2"/>
  </g>
</svg>`.trim() },
    { key:'wrench', name:'Llave', svg: `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M44 8a12 12 0 0 0-11 16L10 47a4 4 0 0 0 0 6l1 1a4 4 0 0 0 6 0l23-23a12 12 0 0 0 14-15l-7 7-6-1-1-6z" fill="currentColor" fill-opacity=".18"/>
  </g>
</svg>`.trim() },
    { key:'circuit', name:'Circuito', svg: `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="14" width="36" height="36" rx="4" fill="currentColor" fill-opacity=".08"/>
    <path d="M22 22h8v8h-8z M34 22h8M34 30h8M22 38h20M22 46h8M34 46h8"/>
    <circle cx="42" cy="22" r="2.4" fill="currentColor"/>
    <circle cx="42" cy="30" r="2.4" fill="currentColor"/>
    <circle cx="30" cy="46" r="2.4" fill="currentColor"/>
  </g>
</svg>`.trim() },
    { key:'bolt', name:'Energía', svg: `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <path d="M36 4 L14 36 h12 L22 60 L50 26 H38 z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
</svg>`.trim() },
    { key:'screwdriver', name:'Destornillador', svg: `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M44 6 L58 20 L40 38 L26 24 z" fill="currentColor" fill-opacity=".2"/>
    <path d="M26 24 L8 42 a4 4 0 0 0 0 6 l8 8 a4 4 0 0 0 6 0 L40 38" />
  </g>
</svg>`.trim() }
  ];


  function logoHtml(){
    const custom = DB.settings.logo;
    if(custom) return `<img src="${custom}" alt="logo">`;
    const key = DB.settings.logoPreset || 'tools';
    const p = LOGO_PRESETS.find(x=>x.key===key) || LOGO_PRESETS[0];
    return p.svg;
  }
  function getPresets(){ return LOGO_PRESETS; }

  function applyBrand(){
    const name = DB.settings.appName || 'Taller';
    const html = UI.renderBrand(name);
    const app = document.getElementById('appTitle');
    const login = document.getElementById('loginTitle');
    if(app) app.innerHTML = html;
    if(login) login.innerHTML = html;
    document.title = name;
    // logos
    const lh = logoHtml();
    const al = document.getElementById('appLogo');
    const ll = document.getElementById('loginLogo');
    if(al) al.innerHTML = lh;
    if(ll) ll.innerHTML = lh;
    // creator contacts
    renderCreatorChips();
  }

  function renderCreatorChips(){
    const box = document.getElementById('creatorContacts');
    if(!box) return;
    const c = (DB.settings.creator || {});
    const tel = UI.phoneClean(c.phone);
    const wa = UI.phoneWa(c.whatsapp);
    const ICON_PHONE = '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1l-2.23 2.2z" fill="currentColor"/></svg>';
    const ICON_WA = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.4.7 4.7 1.9 6.7L3 29l7-1.8a12.5 12.5 0 0 0 6 1.5c7 0 12.5-5.5 12.5-12.5S23 3 16 3zm6.9 17.5c-.3.8-1.7 1.6-2.4 1.6-.6.1-1.4.1-2.3-.1-.5-.2-1.2-.4-2.1-.8-3.7-1.6-6.2-5.3-6.4-5.6-.2-.2-1.5-2-1.5-3.9 0-1.8.9-2.7 1.3-3.1.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .8.6.3.7 1 2.5 1.1 2.6.1.2.2.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.5-.5.6-.2.2-.4.4-.2.7.2.3 1 1.6 2.1 2.6 1.5 1.3 2.7 1.7 3 1.9.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2.3.1 2 1 2.4 1.2.4.2.6.3.7.4 0 .1 0 .8-.3 1.6z" fill="currentColor"/></svg>';
    const parts = [];
    if(tel) parts.push(`<a class="creator-chip tel" href="tel:${UI.escape(tel)}" title="Llamar al creador">${ICON_PHONE}<span>Tel</span></a>`);
    if(wa) parts.push(`<a class="creator-chip wa" href="https://wa.me/${UI.escape(wa)}" target="_blank" rel="noopener" title="WhatsApp del creador">${ICON_WA}<span>WhatsApp</span></a>`);
    box.innerHTML = parts.join('');
  }

  function showLogin(){
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  }
  function showApp(){
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    go('dashboard');
  }
  function go(v, arg, extra){
    current = v; currentArg = arg;
    document.querySelectorAll('.tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.view === v);
    });
    if(v==='dashboard') Views.dashboard();
    else if(v==='repairs') Views.repairsList(arg);
    else if(v==='new') Views.newRepair(extra);
    else if(v==='search') Views.search();
    else if(v==='admin') Views.admin();
    window.scrollTo(0,0);
  }
  function refresh(){ go(current, currentArg); }

  function init(){
    applyBrand();
    document.getElementById('loginBtn').addEventListener('click', tryLogin);
    document.getElementById('loginPass').addEventListener('keydown', e=>{
      if(e.key==='Enter') tryLogin();
    });
    document.getElementById('logoutBtn').addEventListener('click', ()=>{
      Auth.logout();
      showLogin();
    });
    document.getElementById('modalClose').addEventListener('click', UI.closeModal);
    document.getElementById('modal').addEventListener('click', e=>{
      if(e.target.id==='modal') UI.closeModal();
    });
    document.querySelectorAll('.tab').forEach(t=>{
      t.addEventListener('click', ()=> go(t.dataset.view));
    });
    if(Auth.isLoggedIn()) showApp();
    else {
      if(!DB.settings.passwordHash){
        document.querySelector('#loginScreen .muted').textContent = 'Primer acceso: define tu contraseña';
      }
      showLogin();
    }
  }
  async function tryLogin(){
    const pass = document.getElementById('loginPass').value;
    const err = document.getElementById('loginError');
    if(await Auth.login(pass)){
      err.classList.add('hidden');
      document.getElementById('loginPass').value = '';
      applyBrand();
      showApp();
    } else {
      err.classList.remove('hidden');
    }
  }
  return { init, go, refresh, applyBrand, getPresets };
})();
document.addEventListener('DOMContentLoaded', App.init);
