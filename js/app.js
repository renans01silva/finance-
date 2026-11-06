/* FINANCE CONTROL — app: telas, login, sincronização com o Supabase e botões. Usa window.FC (js/motor.js) e window.FCT (js/temas.js). */
const E = window.FC, $ = (s) => document.querySelector(s);
const P = { menu: 'M4 7h16M4 12h16M4 17h10', x: 'M6 6l12 12M18 6L6 18', chevR: 'M9 6l6 6-6 6', chevL: 'M15 6l-6 6 6 6', chevD: 'M6 9l6 6 6-6', plus: 'M12 5v14M5 12h14', home: 'M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z', list: 'M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01', swap: 'M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7', receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6', card: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18', target: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11.2a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6z', chart: 'M4 20V11M10 20V4M16 20v-7M22 20H2', bank: 'M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18', sliders: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M7 10v4M17 16v4', user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6', moon: 'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z', download: 'M12 4v12M7 11l5 5 5-5M5 20h14', repeat: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3', chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z', down: 'M12 5v14M6 13l6 6 6-6', up: 'M12 19V5M6 11l6-6 6 6', check: 'M5 12l5 5 10-10', alert: 'M12 8v5M12 17h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01', cart: 'M3 4h2l2.4 11h10.2L20 7H6M9 20h.01M17 20h.01', car: 'M5 16h14M6 16l1.5-6h9L18 16M7 19v-3M17 19v-3', heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z', book: 'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10', film: 'M4 5h16v14H4zM8 5v14M16 5v14M4 10h4M4 14h4M16 10h4M16 14h4', users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20c0-3.5 3.5-5 7-5s7 1.5 7 5M17 4.5a3.5 3.5 0 0 1 0 6.5M18 15c2.5.5 4 2 4 5', wrench: 'M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z', brief: 'M3 8h18v12H3zM9 8V5h6v3M3 13h18', tag: 'M3 12V4h8l10 10-8 8zM7.5 8h.01', wallet: 'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l2-3h12M16 14h.01', cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', eyeoff: 'M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.4 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2', search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3', filter: 'M4 5h16l-6 8v6l-4-2v-4z', brush: 'M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.2-1.6-.4-1 .2-2 1.3-2H17a4 4 0 0 0 4-4c0-5-4-10.4-9-10.4zM7.5 12h.01M9 8h.01M14 7.5h.01M17 11h.01', undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3', x: 'M6 6l12 12M18 6L6 18' };
const ic = (n, c = '') => `<svg class="i ${c}" viewBox="0 0 24 24"><path d="${P[n]}"/></svg>`;
$('#fab').innerHTML = ic('plus');
const KEY = 'fc_v1';
let S; try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
if (!S || !S.accounts) S = E.newState();
S.prefs = S.prefs || { ctx: 'personal', lastSaved: null };
let tab = 'inicio', sub = 'pagar', month = E.ym(E.today());
const save = () => { S.prefs.lastSaved = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} if (typeof scheduleSync === 'function') scheduleSync(); };
const ctx = () => S.prefs.ctx;
const CTXN = { personal: 'Pessoal', business: 'Profissional', all: 'Consolidado' };
const esc = (x) => String(x == null ? '' : x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const toast = (m) => { const d = document.createElement('div'); d.className = 'toast'; d.textContent = m; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); };
const catName = (id) => (S.categories.find((c) => c.id === id) || {}).name || 'Sem categoria';
const CATI = { 'e_Alimentação': 'cart', 'e_Moradia': 'home', 'e_Transporte': 'car', 'e_Saúde': 'heart', 'e_Educação': 'book', 'e_Lazer': 'film', 'e_Família': 'users', 'e_Veículos': 'wrench', 'e_Despesas profissionais': 'brief' };
const catIcon = (id) => ic(CATI[id] || 'tag');
const brl = E.brl, fd = E.fmtDate;
const hour = new Date().getHours(), greet = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
const ctxAccounts = () => S.accounts.filter((a) => !a.archived && (ctx() === 'all' || a.context === ctx()));
// ───── aparência: as cores vêm todas do themes.js (design tokens)
const FCT = window.FCT;
const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const prefersDark = () => !mq || mq.matches;
let PREF = (() => { let p = {}; try { p = JSON.parse(lsGet('fc_pref') || '{}'); } catch (e) {} const pr = (S && S.profile) || {}; return { palette: FCT.palettes[p.palette] ? p.palette : (FCT.palettes[pr.palette] ? pr.palette : 'azul'), mode: FCT.modes.includes(p.mode) ? p.mode : (FCT.modes.includes(pr.mode) ? pr.mode : (pr.theme === 'light' ? 'light' : 'dark')) }; })();
const applyTheme = () => FCT.apply(document, PREF.palette, PREF.mode, prefersDark());
if (mq && mq.addEventListener) mq.addEventListener('change', () => { if (PREF.mode === 'auto') applyTheme(); });
// depois de carregar os dados (nuvem, backup): a preferência salva na conta vale em todos os aparelhos
const syncPref = () => { const pr = S.profile || {}; if (FCT.palettes[pr.palette]) PREF.palette = pr.palette; if (FCT.modes.includes(pr.mode)) PREF.mode = pr.mode; else if (pr.theme === 'light' || pr.theme === 'dark') PREF.mode = pr.theme; lsSet('fc_pref', JSON.stringify(PREF)); applyTheme(); };
window.setPalette = (id) => { if (!FCT.palettes[id]) return; PREF.palette = id; S.profile.palette = id; lsSet('fc_pref', JSON.stringify(PREF)); applyTheme(); save(); markAppearance(); };
window.setMode = (m) => { if (!FCT.modes.includes(m)) return; PREF.mode = m; S.profile.mode = m; delete S.profile.theme; lsSet('fc_pref', JSON.stringify(PREF)); applyTheme(); save(); markAppearance(); };
const markAppearance = () => { document.querySelectorAll('[data-pal-id]').forEach((b) => { const on = b.dataset.palId === PREF.palette; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); document.querySelectorAll('[data-mode-id]').forEach((b) => { const on = b.dataset.modeId === PREF.mode; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); };
window.openAppearance = () => sheet(`<h2>Personalizar aparência</h2><p class="lead">A cor muda na hora. O layout, os dados e o jeito de usar continuam iguais.</p>
  ${F('Modo', `<div class="seg" style="margin:0">${[['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Escuro']].map(([k, l]) => `<button data-mode-id="${k}" aria-pressed="${PREF.mode === k}" class="${PREF.mode === k ? 'on' : ''}" onclick="setMode('${k}')">${l}</button>`).join('')}</div>`, 'Automático acompanha o modo do seu aparelho.')}
  ${F('Cor do aplicativo', `<div class="pals">${FCT.order.map((id) => { const p = FCT.palettes[id]; return `<button class="pal ${PREF.palette === id ? 'on' : ''}" data-pal-id="${id}" aria-pressed="${PREF.palette === id}" onclick="setPalette('${id}')"><span class="sw"><i style="background:${p.swatch[0]}"></i><i style="background:${p.swatch[1]}"></i></span><b>${p.name}<span class="ck">${ic('check')}</span></b><small>${p.desc}</small></button>`; }).join('')}</div>`)}
  <div style="height:20px"></div><button class="btn" onclick="closeSheet()">Concluir</button>`);
const palName = () => FCT.palettes[PREF.palette].name + ' · ' + { auto: 'Automático', light: 'Claro', dark: 'Escuro' }[PREF.mode];

// ───── privacidade do saldo (só esconde o número na tela; não é segurança de acesso)
let hideBal = false;
const ssGet = () => { try { return sessionStorage.getItem('fc_hide'); } catch (e) { return null; } };
const initHide = () => { const v = ssGet(); hideBal = v !== null ? v === '1' : !!(S.prefs && S.prefs.startHidden); };
window.toggleBal = () => { hideBal = !hideBal; try { sessionStorage.setItem('fc_hide', hideBal ? '1' : '0'); } catch (e) {} const b = $('#balbox'); if (b) b.innerHTML = balHtml(); const bt = b && b.querySelector('.eye'); if (bt) bt.focus(); };

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const moneyIn = (c) => c ? (c / 100).toFixed(2).replace('.', ',') : '';


// ───── nuvem (Supabase): só ativa quando existe config.js
const CFG = window.FC_CONFIG || {};
const CFG_SET = !!(CFG.url && CFG.key && !/^COLE/.test(CFG.url) && !/^COLE/.test(CFG.key));
const CLOUD = CFG_SET && !!window.supabase;
let sb = null, user = null, cloudVer = 0, syncState = CLOUD ? 'idle' : 'local', syncAt = null, pushTimer = null, pushing = false, dirty = false;
const syncLabel = () => ({ local: 'Dados salvos só neste aparelho', idle: 'Conectando…', syncing: 'Sincronizando…', ok: 'Sincronizado' + (syncAt ? ' às ' + syncAt : ''), offline: 'Sem conexão: salvo aqui e será enviado depois', error: 'Não foi possível sincronizar. Tentaremos de novo.' }[syncState]);
const hhmm = () => new Date().toTimeString().slice(0, 5);
const keepLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const fixState = () => { S.prefs = S.prefs || { ctx: 'personal', lastSaved: null }; S.profile = S.profile || { name: 'Renan' }; S.profile.mode = S.profile.mode || S.profile.theme || PREF.mode; S.profile.palette = S.profile.palette || PREF.palette; };
function runMigrations() { const snap = JSON.stringify(S); const ch = E.migrate(S); if (ch) { if (!lsGet('fc_v1_pre2')) lsSet('fc_v1_pre2', snap); save(); } return ch; }
function scheduleSync() { if (!CLOUD || !user) return; dirty = true; syncState = 'syncing'; clearTimeout(pushTimer); pushTimer = setTimeout(push, 700); }
async function push() {
  if (!CLOUD || !user || pushing) return; pushing = true;
  try {
    if (cloudVer === 0) {
      const { error } = await sb.from('app_state').insert({ user_id: user.id, data: S, version: 1 });
      if (error) { if (String(error.code) === '23505') { pushing = false; return pull(true); } throw error; }
      cloudVer = 1;
    } else {
      const { data, error } = await sb.from('app_state').update({ data: S, version: cloudVer + 1, updated_at: new Date().toISOString() }).eq('user_id', user.id).eq('version', cloudVer).select('version');
      if (error) throw error;
      if (!data || !data.length) { pushing = false; return pull(true); }
      cloudVer = data[0].version;
    }
    dirty = false; syncState = 'ok'; syncAt = hhmm(); schedSummary();
  } catch (e) { syncState = navigator.onLine === false ? 'offline' : 'error'; setTimeout(() => { if (dirty) scheduleSync(); }, 15000); }
  pushing = false; softRender();
}
async function pull(conflict) {
  try {
    const { data, error } = await sb.from('app_state').select('data,version').maybeSingle();
    if (error) throw error;
    if (data) {
      if (conflict) toast('Seus dados foram alterados em outro aparelho. Carregamos a versão mais recente.');
      const snap = JSON.stringify(data.data); S = data.data; fixState(); const mig = E.migrate(S); syncPref(); initHide(); cloudVer = data.version; keepLocal(); dirty = false; syncState = 'ok'; syncAt = hhmm(); if (mig) { if (!lsGet('fc_v1_pre2')) lsSet('fc_v1_pre2', snap); save(); }
    } else { S.profile.mode = PREF.mode; S.profile.palette = PREF.palette; cloudVer = 0; await push(); }
  } catch (e) { syncState = navigator.onLine === false ? 'offline' : 'error'; }
  softRender();
}
const softRender = () => { if (!$('#sheetbg') && !$('#drawer') && user) render(); };
function renderLogin(msg) {
  $('#nav').style.display = 'none'; $('#fab').style.display = 'none';
  $('#app').innerHTML = `<div class="login"><h1>Finance Control</h1><div class="lead" style="margin-bottom:22px">Entre para ver suas finanças em qualquer aparelho.</div>${msg ? `<div class="alert warn" style="border-radius:16px;background:var(--warnbg);margin-bottom:8px">${ic('info')}<span>${esc(msg)}</span></div>` : ''}${F('E-mail', '<input id="lg-e" type="email" autocomplete="email" inputmode="email" placeholder="voce@email.com">')}${F('Senha', '<input id="lg-p" type="password" autocomplete="current-password" placeholder="Mínimo de 6 caracteres">')}<div style="height:22px"></div><button class="btn" onclick="doLogin()">Entrar</button><button class="btn ghost" onclick="doSignup()">Criar minha conta</button></div>`;
}
window.doLogin = async () => {
  const email = val('lg-e').trim(), password = val('lg-p');
  if (!email || !password) return toast('Informe e-mail e senha.');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return toast(/confirm/i.test(error.message) ? 'Confirme seu e-mail primeiro (veja sua caixa de entrada).' : 'E-mail ou senha incorretos.');
  user = data.user; await afterLogin();
};
window.doSignup = async () => {
  const email = val('lg-e').trim(), password = val('lg-p');
  if (!email || password.length < 6) return toast('Use um e-mail válido e senha com 6+ caracteres.');
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return toast('Não foi possível criar a conta: ' + error.message);
  if (!data.session) return renderLogin('Conta criada. Enviamos um e-mail de confirmação. Confirme e depois toque em Entrar.');
  user = data.user; await afterLogin();
};
async function afterLogin() {
  $('#nav').style.display = ''; syncState = 'syncing';
  await pull(false); loadCouple();
  if (S.recurrences && S.recurrences.length && E.generateRecurring(S, E.today(), 12)) save();
  render();
}
window.doLogout = async () => { await sb.auth.signOut(); user = null; cloudVer = 0; couple = { loaded: false, shares: [], theirs: null, who: 'casal', err: null }; try { localStorage.removeItem(KEY); } catch (e) {} S = E.newState(); fixState(); closeSheet(); renderLogin(); };
async function bootCloud() {
  sb = window.supabase.createClient(CFG.url, CFG.key);
  const { data } = await sb.auth.getSession();
  if (!data || !data.session) return renderLogin();
  user = data.session.user; await afterLogin();
  window.addEventListener('online', () => { if (dirty) scheduleSync(); else pull(false); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && user && !dirty) pull(false); });
}
window.openImport = () => sheet(`<h2>Restaurar backup</h2><p class="lead">Cole aqui o texto do backup que você copiou antes. Isto substitui os dados atuais.</p><textarea id="im" rows="6" placeholder="Cole o backup"></textarea><div style="height:14px"></div><button class="btn" onclick="doImport()">Restaurar</button>`);
window.doImport = () => { try { const d = JSON.parse(val('im')); if (!d || !Array.isArray(d.accounts) || !Array.isArray(d.tx)) throw 0; ask('Substituir TODOS os dados atuais pelo backup?', () => { S = d; fixState(); E.migrate(S); syncPref(); save(); closeSheet(); toast('Backup restaurado'); render(); }, 'Restaurar'); } catch (e) { toast('Backup inválido.'); } };

const NAV = [['inicio', 'home', 'Início'], ['mov', 'list', 'Movimentos'], ['contas', 'receipt', 'Contas'], ['cartoes', 'card', 'Cartões'], ['orc', 'wallet', 'Orçamento']];
function renderNav() { $('#nav').innerHTML = NAV.map(([k, i, l]) => `<button class="${tab === k ? 'on' : ''}" onclick="go('${k}')">${ic(i)}${l}</button>`).join('') + `<button onclick="openDrawer()">${ic('menu')}Menu</button>`; }
window.go = (k) => { tab = k; closeDrawer(); render(); window.scrollTo(0, 0); };
window.setCtx = (c) => { S.prefs.ctx = c; save(); closeSheet(); closeDrawer(); render(); };

// ───── menu lateral (estilo foto 3)
window.openDrawer = () => {
  closeDrawer();
  const it = (k, i, l) => `<button class="it ${tab === k ? 'sel' : ''}" onclick="go('${k}')">${ic(i)}<span class="l">${l}</span>${ic('chevR', 'c')}</button>`;
  const cx = (k, l) => `<button class="it ${ctx() === k ? 'sel' : ''}" onclick="setCtx('${k}')">${ic(k === 'business' ? 'brief' : k === 'all' ? 'chart' : 'user')}<span class="l">${l}</span>${ctx() === k ? ic('check', 'c') : ''}</button>`;
  const d = document.createElement('div'); d.className = 'drawer-back'; d.id = 'drawer';
  d.innerHTML = `<div class="drawer"><div class="head"><div class="av">${esc(S.profile.name[0].toUpperCase())}</div><div><b>${esc(S.profile.name)}</b><small>Visão: ${CTXN[ctx()]}</small></div><button class="x" onclick="closeDrawer()" aria-label="Fechar">${ic('x')}</button></div>
  <button class="newbtn" onclick="closeDrawer();openPlus()">${ic('plus')}Novo lançamento</button>
  <h4>Gestão</h4>${it('rec', 'cal', 'Recebimentos')}${it('orc', 'wallet', 'Orçamento')}${it('casal', 'users', 'Casal')}${it('plan', 'target', 'Planejamento')}${it('rel', 'chart', 'Relatórios')}${it('bancos', 'bank', 'Contas bancárias')}
  <h4>Visão</h4>${cx('personal', 'Pessoal')}${cx('business', 'Profissional')}${cx('all', 'Consolidado')}
  <h4>Conta e ajuda</h4><button class="it" onclick="closeDrawer();openAppearance()">${ic('brush')}<span class="l">Personalizar aparência</span>${ic('chevR', 'c')}</button><button class="it" onclick="closeDrawer();openSettings()">${ic('sliders')}<span class="l">Configurações</span>${ic('chevR', 'c')}</button><button class="it" onclick="closeDrawer();exportData()">${ic('download')}<span class="l">Backup dos dados</span>${ic('chevR', 'c')}</button></div>`;
  d.addEventListener('click', (e) => { if (e.target === d) closeDrawer(); });
  document.body.appendChild(d);
};
window.closeDrawer = () => { const d = $('#drawer'); if (d) d.remove(); };

// ───── sheets
function sheet(html) { closeSheet(); const bg = document.createElement('div'); bg.className = 'back'; bg.id = 'sheetbg'; bg.innerHTML = `<div class="sheet">${html}</div>`; bg.addEventListener('click', (e) => { if (e.target === bg) closeSheet(); }); document.body.appendChild(bg); }
window.closeSheet = () => { const b = $('#sheetbg'); if (b) b.remove(); };
window.ask = (msg, fn, yes = 'Continuar') => { window._askfn = fn; sheet(`<h2>Confirmar</h2><p class="lead" style="font-size:15px;color:var(--tx)">${msg}</p><button class="btn" onclick="const f=window._askfn;closeSheet();f()">${yes}</button><div style="height:10px"></div><button class="btn ghost" onclick="closeSheet()">Voltar</button>`); };
const accOpts = (sel) => ctxAccounts().map((a) => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
const catOpts = (kind, sel) => S.categories.filter((c) => c.kind === kind).map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
const ctxOfNew = () => ctx() === 'all' ? 'personal' : ctx();
const val = (id) => document.getElementById(id).value;
const planOpts = (sel) => E.planItems(S).filter((i) => ['fixed', 'variable'].includes(i.kind)).map((i) => `<option value="${i.id}" ${i.id === sel ? 'selected' : ''}>${esc(i.name)} · dia ${E.cfg(S).payDays[i.slot - 1]}</option>`).join('');
const F = (label, html, hint) => `<div class="field"><label>${label}</label>${html}${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;
const optBtn = (i, t, s, fn) => `<button class="opt" onclick="${fn}"><span class="sq">${ic(i)}</span><span class="t"><b>${t}</b><small>${s}</small></span>${ic('chevR', 'chev')}</button>`;
const needAccount = () => { if (!ctxAccounts().length) { toast('Primeiro cadastre uma conta bancária.'); openAccount(); return true; } return false; };
window.pick = (id, v, group) => { document.getElementById(id).value = v; document.querySelectorAll('[data-g="' + group + '"]').forEach((b) => b.classList.toggle('on', b.dataset.v === v)); if (group === 'xm') mchg(); };
const chipsFor = (id, group, opts, sel) => `<input type="hidden" id="${id}" value="${sel}"><div class="chips">${opts.map(([v, l]) => `<button type="button" class="chip ${v === sel ? 'on' : ''}" data-g="${group}" data-v="${v}" onclick="pick('${id}','${v}','${group}')">${l}</button>`).join('')}</div>`;

$('#fab').onclick = () => openPlus();
window.openPlus = () => sheet(`<h2>Novo lançamento</h2><p class="lead">O que você quer registrar?</p>
  ${optBtn('up', 'Despesa', 'Um pagamento ou compra', 'openExpense()')}${optBtn('down', 'Entrada', 'Salário, venda ou outro valor recebido', 'openIncome()')}${optBtn('swap', 'Transferência', 'Mover dinheiro entre suas contas', 'openTransfer()')}${optBtn('chat', 'Escrever uma frase', 'Ex.: “Hoje gastei R$ 85 no mercado via Pix”', 'openNL()')}`);

window.openNL = () => { if (needAccount()) return; sheet(`<h2>Escreva como falaria</h2><p class="lead">Eu entendo e mostro um resumo para você confirmar antes de salvar.</p><textarea id="nl" rows="3" placeholder="Hoje gastei R$ 85 no mercado via Pix"></textarea><div style="height:14px"></div><button class="btn" onclick="doNL()">Interpretar</button>`); };
window.doNL = () => {
  const r = E.parseNatural(S, val('nl'));
  if (r.kind === 'income') return openIncome({ amountCents: r.amountCents, desc: r.desc, date: r.date });
  openExpense({ amountCents: r.amountCents, desc: r.desc, date: r.date, method: r.method, categoryId: r.categoryId, note: r.missing.length ? 'Faltou informar: ' + r.missing.join(' e ') + '.' : 'Confira o resumo e salve.' });
};

const d0 = (o) => ({ desc: o.desc, amountCents: o.amountCents, date: o.date, method: o.method, categoryId: o.categoryId });
window.openExpense = (d = {}) => {
  if (needAccount()) return;
  const m = d.method || 'pix';
  sheet(`<h2>Nova despesa</h2><p class="lead">${d.note ? esc(d.note) : 'Preencha só o essencial.'}</p>
  ${F('O que você pagou?', `<input id="x-desc" value="${esc(d.desc || '')}" placeholder="Ex.: Mercado" oninput="sugg()">`)}
  ${F('Quanto?', `<input id="x-val" inputmode="decimal" placeholder="R$ 0,00" value="${moneyIn(d.amountCents)}">`)}
  ${F('Quando?', `<input id="x-date" type="date" value="${d.date || E.today()}" oninput="refreshFund()">`)}
  ${F('Categoria', `<select id="x-cat">${catOpts('expense', d.categoryId)}</select>`, '<span id="x-sug">Sugerida automaticamente pelo que você digita.</span>')}
  ${E.planItems(S).some((i) => ['fixed', 'variable'].includes(i.kind)) ? F('Item do orçamento (opcional)', `<select id="x-plan"><option value="">Automático</option>${planOpts()}</select>`, 'Automático usa o nome e a categoria. Escolha um item para ter certeza.') : ''}
  ${F('Como pagou?', chipsFor('x-m', 'xm', [['pix', 'Pix'], ['cash', 'Dinheiro'], ['debit_card', 'Débito'], ['boleto', 'Boleto'], ['credit_card', 'Cartão de crédito']], m))}
  <div id="x-acc"></div><div id="x-paidbox"></div><div id="x-fundbox"></div><div style="height:22px"></div><button class="btn" onclick="saveExpense()">Salvar despesa</button>`);
  mchg(); if (!d.categoryId) sugg();
};
window.sugg = () => { const id = E.suggestCategory(S, val('x-desc')); const el = $('#x-sug'); if (id && el) { $('#x-cat').value = id; el.textContent = 'Sugestão: ' + catName(id) + '. Você pode trocar.'; } };
window.mchg = () => {
  const credit = val('x-m') === 'credit_card', cards = S.cards.filter((c) => ctx() === 'all' || c.context === ctx());
  if (credit && !cards.length) { $('#x-acc').innerHTML = F('Cartão', '<div class="pill warn">Nenhum cartão cadastrado. Cadastre em Cartões.</div>'); $('#x-paidbox').innerHTML = ''; $('#x-fundbox').innerHTML = ''; return; }
  $('#x-acc').innerHTML = credit ? F('Qual cartão?', `<select id="x-card">${cards.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select>`) + F('Estabelecimento (opcional)', '<input id="x-merch" placeholder="Ex.: Magazine Luiza">') + F('Parcelas', '<input id="x-inst" type="number" min="1" max="48" value="1">', 'Entra na fatura certa. As parcelas futuras são criadas sozinhas.') : F('De qual conta saiu?', `<select id="x-ac">${accOpts()}</select>`);
  $('#x-paidbox').innerHTML = credit ? '' : F('Já foi pago?', `<div class="seg" style="margin:0"><button id="p1" class="on" onclick="setPaid(1)">Sim, já paguei</button><button id="p0" onclick="setPaid(0)">Ainda não</button></div><div id="x-due"></div>`);
  window._paid = 1; refreshFund();
};
window.setPaid = (v) => { window._paid = v; $('#p1').classList.toggle('on', !!v); $('#p0').classList.toggle('on', !v); $('#x-due').innerHTML = v ? '' : F('Vence em', `<input id="x-dd" type="date" value="${val('x-date')}" oninput="refreshFund()">`); refreshFund(); };
window.refreshFund = () => {
  const box = $('#x-fundbox'); if (!box) return; if (val('x-m') === 'credit_card') { box.innerHTML = ''; return; }
  const due = (window._paid === 0 && document.getElementById('x-dd')) ? val('x-dd') : val('x-date'); if (!due) { box.innerHTML = ''; return; }
  const cur = document.getElementById('x-fund') ? val('x-fund') : '', sug = E.suggestFund(S, due);
  box.innerHTML = F('Pago com qual recebimento?', `<select id="x-fund"><option value="">Decidir depois</option>${E.fundOptions(S, due).map((pk) => `<option value="${pk}" ${pk === cur ? 'selected' : ''}>${E.fundLabel(S, pk)}${pk === sug ? ' · sugerido' : ''}</option>`).join('')}</select>`, 'Opcional. Liga esta conta a um recebimento para ver quanto sobra em cada período.');
};
window.commitExpense = (o) => { try { E.addExpense(S, o); save(); closeSheet(); toast('Despesa salva'); render(); } catch (e) { toast(e.message); } };
window.saveExpense = (force) => {
  try {
    const credit = val('x-m') === 'credit_card', o = { amountCents: E.toCents(val('x-val')), desc: val('x-desc'), date: val('x-date'), categoryId: val('x-cat'), method: val('x-m'), context: ctxOfNew() };
    if (!o.desc.trim()) throw new Error('Diga o que foi pago.');
    if (!o.amountCents || o.amountCents <= 0) throw new Error('Informe o valor.');
    const xp = document.getElementById('x-plan'); if (xp && xp.value) o.planItemId = xp.value;
    if (credit) { o.cardId = val('x-card'); o.merchant = val('x-merch'); o.installments = +val('x-inst') || 1; o.context = S.cards.find((x) => x.id === o.cardId).context; }
    else { o.accountId = val('x-ac'); o.fund = val('x-fund') || null; o.paid = window._paid === 1; if (!o.paid) o.dueDate = val('x-dd'); o.context = S.accounts.find((a) => a.id === o.accountId).context; }
    const dup = E.findDuplicate(S, Object.assign({ kind: 'expense' }, o));
    if (dup && force !== true) return ask('Já existe um lançamento igual: ' + esc(dup.desc) + ', ' + brl(dup.amountCents) + ' em ' + fd(dup.purchaseDate) + '. Salvar mesmo assim?', () => commitExpense(o), 'Salvar mesmo assim');
    commitExpense(o);
  } catch (e) { toast(e.message); }
};
window.openIncome = (d = {}) => {
  if (needAccount()) return;
  sheet(`<h2>Nova entrada</h2><p class="lead">${d.desc ? 'Confira e salve.' : 'Registre um valor recebido ou previsto.'}</p>
  ${F('O que você recebeu?', `<input id="i-desc" value="${esc(d.desc || '')}" placeholder="Ex.: Salário">`)}
  ${F('Quanto?', `<input id="i-val" inputmode="decimal" placeholder="R$ 0,00" value="${moneyIn(d.amountCents)}">`)}
  ${F('Quando?', `<input id="i-date" type="date" value="${d.date || E.today()}">`)}
  ${F('Em qual conta?', `<select id="i-ac">${accOpts()}</select>`)}${F('Categoria', `<select id="i-cat">${catOpts('income')}</select>`)}
  ${F('Em qual período entra?', `<select id="i-slot"><option value="">Automático (pela data)</option><option value="1" ${d.slot === 1 ? 'selected' : ''}>Recebimento do dia ${E.cfg(S).payDays[0]}</option><option value="2" ${d.slot === 2 ? 'selected' : ''}>Recebimento do dia ${E.cfg(S).payDays[1]}</option></select>`, 'Define em qual período esta entrada conta no planejamento.')}
  ${F('Já caiu na conta?', `<div class="seg" style="margin:0"><button id="r1" class="on" onclick="window._rec=1;r1.classList.add('on');r0.classList.remove('on')">Sim, recebi</button><button id="r0" onclick="window._rec=0;r0.classList.add('on');r1.classList.remove('on')">Ainda não</button></div>`)}
  <div style="height:22px"></div><button class="btn" onclick="saveIncome()">Salvar entrada</button>`);
  window._rec = 1;
};
window.saveIncome = () => {
  try { const acc = S.accounts.find((a) => a.id === val('i-ac')); E.addIncome(S, { amountCents: E.toCents(val('i-val')), desc: val('i-desc') || 'Entrada', date: val('i-date'), dueDate: val('i-date'), accountId: acc.id, categoryId: val('i-cat'), received: window._rec === 1, context: acc.context, slot: +val('i-slot') || undefined }); save(); closeSheet(); toast('Entrada salva'); render(); } catch (e) { toast(e.message); }
};
window.openTransfer = () => {
  const l = ctxAccounts(); if (l.length < 2) { toast('Você precisa de pelo menos 2 contas.'); return; }
  sheet(`<h2>Transferência</h2><p class="lead">Só muda o dinheiro de lugar. Não conta como receita nem despesa.</p>
  ${F('De', `<select id="t-f">${accOpts(l[0].id)}</select>`)}${F('Para', `<select id="t-t">${accOpts(l[1].id)}</select>`)}${F('Quanto?', '<input id="t-v" inputmode="decimal" placeholder="R$ 0,00">')}${F('Quando?', `<input id="t-d" type="date" value="${E.today()}">`)}<div style="height:22px"></div><button class="btn" onclick="saveTransfer()">Transferir</button>`);
};
window.saveTransfer = () => { try { const f = S.accounts.find((a) => a.id === val('t-f')); E.addTransfer(S, { amountCents: E.toCents(val('t-v')), fromId: val('t-f'), toId: val('t-t'), date: val('t-d'), context: f.context }); save(); closeSheet(); toast('Transferido'); render(); } catch (e) { toast(e.message); } };

window.openAccount = () => sheet(`<h2>Nova conta</h2><p class="lead">Pode ser banco, carteira ou reserva.</p>${F('Nome', '<input id="a-n" placeholder="Ex.: Nubank, Carteira">')}${F('Quanto tem nela hoje?', '<input id="a-v" inputmode="decimal" placeholder="R$ 0,00">', 'Este é o saldo inicial. Daqui em diante o app calcula sozinho.')}${F('Tipo', '<select id="a-t"><option value="checking">Conta bancária</option><option value="cash">Dinheiro</option><option value="savings">Poupança ou reserva</option></select>')}<div style="height:22px"></div><button class="btn" onclick="saveAccount()">Salvar conta</button>`);
window.saveAccount = () => { try { E.addAccount(S, { name: val('a-n'), openingCents: val('a-v') ? E.toCents(val('a-v')) : 0, type: val('a-t'), context: ctxOfNew() }); save(); closeSheet(); toast('Conta criada'); render(); } catch (e) { toast(e.message); } };
window.openCard = () => sheet(`<h2>Novo cartão</h2><p class="lead">Os dias estão na fatura do seu cartão.</p>${F('Nome', '<input id="c-n" placeholder="Ex.: Nubank">')}${F('Limite total', '<input id="c-l" inputmode="decimal" placeholder="R$ 0,00">')}${F('Dia em que a fatura fecha', '<input id="c-c" type="number" min="1" max="28" placeholder="1 a 28">')}${F('Dia do vencimento', '<input id="c-d" type="number" min="1" max="28" placeholder="1 a 28">')}<div style="height:22px"></div><button class="btn" onclick="saveCard()">Salvar cartão</button>`);
window.saveCard = () => { try { E.addCard(S, { name: val('c-n'), limitCents: E.toCents(val('c-l') || '0'), closingDay: +val('c-c'), dueDay: +val('c-d'), context: ctxOfNew() }); save(); closeSheet(); toast('Cartão criado'); render(); } catch (e) { toast(e.message); } };
window.openRecurring = () => { if (needAccount()) return; sheet(`<h2>Conta mensal</h2><p class="lead">Criamos os próximos 12 meses como “a pagar”. Você confirma cada um quando acontecer.</p>${F('Tipo', `<div class="seg" style="margin:0"><button id="rk1" class="on" onclick="window._rk='expense';rk1.classList.add('on');rk0.classList.remove('on')">Despesa</button><button id="rk0" onclick="window._rk='income';rk0.classList.add('on');rk1.classList.remove('on')">Entrada</button></div>`)}${F('Nome', '<input id="rc-d" placeholder="Ex.: Aluguel">')}${F('Valor', '<input id="rc-v" inputmode="decimal" placeholder="R$ 0,00">')}${F('Dia do mês', '<input id="rc-day" type="number" min="1" max="31" value="5">')}${F('Recebimento do dia', `<select id="rc-slot"><option value="">Decidir depois</option><option value="1">Dia ${E.cfg(S).payDays[0]}</option><option value="2">Dia ${E.cfg(S).payDays[1]}</option></select>`, 'Despesa: é paga com o recebimento escolhido. Entrada: define o período em que ela entra.')}${F('Conta', `<select id="rc-a">${accOpts()}</select>`)}${F('Categoria', `<select id="rc-c">${catOpts('expense')}</select>`)}<div style="height:22px"></div><button class="btn" onclick="saveRec()">Programar</button>`); window._rk = 'expense'; };
window.saveRec = () => { try { const acc = S.accounts.find((a) => a.id === val('rc-a')); E.addRecurring(S, { kind: window._rk, desc: val('rc-d'), amountCents: E.toCents(val('rc-v')), accountId: acc.id, categoryId: val('rc-c'), day: +val('rc-day'), startDate: E.today(), context: acc.context, fundSlot: +val('rc-slot') || null }); save(); closeSheet(); toast('Programado'); render(); } catch (e) { toast(e.message); } };

window.confirmTx = (id) => { const t = S.tx.find((x) => x.id === id), inc = t.kind === 'income'; sheet(`<h2>${inc ? 'Confirmar recebimento' : 'Confirmar pagamento'}</h2><p class="lead">${esc(t.desc)} · vence em ${fd(t.dueDate)}. Só marcamos como ${inc ? 'recebido' : 'pago'} depois da sua confirmação.</p>${F('Data', `<input id="cf-d" type="date" value="${E.today()}">`)}${F(inc ? 'Valor recebido' : 'Valor pago', `<input id="cf-v" inputmode="decimal" value="${moneyIn(t.amountCents)}">`)}<div style="height:22px"></div><button class="btn" onclick="doConfirm('${id}')">Confirmar</button><div style="height:10px"></div><button class="btn ghost" onclick="openResched('${id}')">Mudar o vencimento</button>`); };
window.doConfirm = (id) => { try { E.confirm(S, id, { date: val('cf-d'), cents: E.toCents(val('cf-v')) }); save(); closeSheet(); toast('Confirmado'); render(); } catch (e) { toast(e.message); } };
window.openResched = (id) => sheet(`<h2>Novo vencimento</h2>${F('Data', `<input id="rs-d" type="date" value="${E.today()}">`)}<div style="height:22px"></div><button class="btn" onclick="E.reschedule(S,'${id}',val('rs-d'));save();closeSheet();render()">Salvar</button>`);
window.openPayInvoice = (cardId, due) => { const inv = E.invoices(S, cardId).find((i) => i.dueDate === due); sheet(`<h2>Pagar fatura</h2><p class="lead">Vence em ${fd(due)}. Pagar a fatura não cria nova despesa, as compras já foram contadas.</p><div class="big">${brl(inv.remainingCents)}</div>${F('Sai de qual conta?', `<select id="pi-a">${accOpts()}</select>`)}${F('Valor', `<input id="pi-v" inputmode="decimal" value="${moneyIn(inv.remainingCents)}">`, 'Você pode pagar só uma parte.')}<div style="height:22px"></div><button class="btn" onclick="doPayInv('${cardId}','${due}')">Confirmar pagamento</button>`); };
window.doPayInv = (c, d) => { try { E.payInvoice(S, { cardId: c, dueDate: d, accountId: val('pi-a'), amountCents: E.toCents(val('pi-v')), date: E.today() }); save(); closeSheet(); toast('Fatura paga'); render(); } catch (e) { toast(e.message); } };
const statusOf = (t) => t.status === 'cancelled' ? ['Cancelado', ''] : t.kind === 'refund' ? ['Estorno', 'ok'] : t.status === 'paid' ? [t.kind === 'income' ? 'Recebido' : 'Pago', 'ok'] : E.isOverdue(t, E.today()) ? ['Atrasada', 'bad'] : t.cardId ? ['No cartão', 'pri'] : (() => { const d = E.diffDays(E.today(), t.dueDate); return d === 0 ? ['Vence hoje', 'warn'] : d === 1 ? ['Vence amanhã', 'warn'] : ['Pendente', '']; })();
window.openTx = (id) => { const t = S.tx.find((x) => x.id === id); if (t && t.cardId && t.purchaseId && S.purchases.some((p) => p.id === t.purchaseId)) return openPurchase(t.purchaseId, id); openTxPlain(id); };
window.openTxPlain = (id) => {
  const t = S.tx.find((x) => x.id === id), st = statusOf(t), inc = t.kind === 'income';
  sheet(`<h2>${esc(t.desc)}</h2><div class="big ${inc ? 'pos' : ''}">${brl(t.amountCents)}</div><span class="pill ${st[1]}">${st[0]}</span>
  <div class="card" style="margin:16px 0 0"><div class="stat"><span>Categoria</span><b>${esc(catName(t.categoryId))}</b></div>${t.kind === 'expense' && !t.cardId ? `<div class="stat"><span>Paga com o recebimento</span><b>${t.fund ? E.fundLabel(S, t.fund) : 'Sem vínculo'}</b></div>` : t.kind === 'income' ? `<div class="stat"><span>Período de recebimento</span><b>Dia ${E.cfg(S).payDays[E.slotOf(S, t) - 1]}</b></div>` : ''}<div class="stat"><span>Data da compra</span><b>${fd(t.purchaseDate)}</b></div><div class="stat"><span>Vencimento</span><b>${fd(t.dueDate) || '—'}</b></div>${t.paidDate ? `<div class="stat"><span>Pagamento</span><b>${fd(t.paidDate)}</b></div>` : ''}</div>
  ${t.kind === 'expense' && !t.cardId && t.status !== 'cancelled' ? `<button class="link" onclick="openLink('tx','${t.id}')">Escolher o recebimento desta conta</button>` : ''}<details class="how" style="padding:12px 0 0"><summary>Histórico de alterações</summary>${(t.history || []).map((h) => fd(h.at.slice(0, 10)) + ' · ' + esc(h.what)).join('<br>')}</details>
  <div style="height:16px"></div>${t.status !== 'cancelled' && t.kind !== 'transfer' && t.kind !== 'invoice_payment' ? `<button class="btn ghost" onclick="openEdit('${t.id}')">Editar lançamento</button><div style="height:10px"></div>` : ''}${t.status === 'pending' && !t.cardId ? `<button class="btn" onclick="confirmTx('${t.id}')">${inc ? 'Confirmar recebimento' : 'Confirmar pagamento'}</button><div style="height:10px"></div>` : ''}${t.status !== 'cancelled' && t.kind !== 'invoice_payment' ? `<button class="link" style="color:var(--bad)" onclick="ask('Cancelar este lançamento? Ele continua no histórico, só deixa de contar.', () => {E.cancel(S,'${t.id}');save();render()}, 'Cancelar lançamento')">Cancelar lançamento</button>` : ''}`);
};
window.openEditAccount = (id) => {
  const a = S.accounts.find((x) => x.id === id), b = E.accountBalance(S, a);
  sheet(`<h2>Editar conta</h2><p class="lead">Saldo atual: <b>${brl(b)}</b></p>${F('Nome', `<input id="ea-n" value="${esc(a.name)}">`)}${F('Saldo inicial', `<input id="ea-v" inputmode="decimal" value="${moneyIn(a.openingCents)}">`, 'É o valor com que a conta começou. Os lançamentos são somados a ele. Se mudar, o saldo atual muda na mesma medida.')}<div style="height:22px"></div><button class="btn" onclick="saveAccountEdit('${id}')">Salvar alterações</button><div style="height:10px"></div><button class="link" style="color:var(--bad)" onclick="ask('Arquivar esta conta? Ela some das listas e do saldo, mas os lançamentos continuam no histórico.', () => {S.accounts.find((x) => x.id === '${id}').archived = true;save();render()}, 'Arquivar conta')">Arquivar conta</button>`);
};
window.saveAccountEdit = (id) => {
  try {
    const a = S.accounts.find((x) => x.id === id), n = val('ea-n').trim(), v = val('ea-v') ? E.toCents(val('ea-v')) : 0;
    if (!n) throw new Error('Dê um nome para a conta.'); if (isNaN(v)) throw new Error('Valor inválido.');
    if (S.accounts.some((x) => x.id !== id && x.context === a.context && x.name.toLowerCase() === n.toLowerCase())) throw new Error('Você já tem uma conta com esse nome.');
    a.name = n; a.openingCents = v; save(); closeSheet(); toast('Conta atualizada'); render();
  } catch (e) { toast(e.message); }
};
window.openEdit = (id) => {
  const t = S.tx.find((x) => x.id === id), inc = t.kind === 'income', dt = t.cardId ? null : (t.status === 'paid' ? t.paidDate : t.dueDate);
  sheet(`<h2>Editar lançamento</h2><p class="lead">As mudanças ficam registradas no histórico.</p>
  ${F('Descrição', `<input id="e-desc" value="${esc(t.desc)}">`)}
  ${F('Valor', `<input id="e-val" inputmode="decimal" value="${moneyIn(t.status === 'paid' ? (t.paidCents || t.amountCents) : t.amountCents)}" ${t.cardId ? 'disabled' : ''}>`, t.cardId ? 'O valor de compra no cartão não muda aqui. Cancele e lance de novo se precisar.' : '')}
  ${dt ? F(t.status === 'paid' ? (inc ? 'Data do recebimento' : 'Data do pagamento') : 'Vencimento', `<input id="e-date" type="date" value="${dt}">`) : ''}
  ${F('Categoria', `<select id="e-cat">${catOpts(inc ? 'income' : 'expense', t.categoryId)}</select>`)}
  ${t.kind === 'expense' && !t.cardId && E.planItems(S).some((i) => ['fixed', 'variable'].includes(i.kind)) ? F('Item do orçamento', `<select id="e-plan"><option value="">Automático</option>${planOpts(t.planItemId)}</select>`) : ''}
  ${t.kind === 'expense' && !t.cardId ? F('Paga com qual recebimento?', `<select id="e-fund"><option value="">Sem vínculo</option>${[...new Set(E.fundOptions(S, t.dueDate || t.purchaseDate).concat(t.fund ? [t.fund] : []))].map((pk) => `<option value="${pk}" ${pk === t.fund ? 'selected' : ''}>${E.fundLabel(S, pk)}</option>`).join('')}</select>`) : ''}
  ${inc ? F('Período de recebimento', `<select id="e-slot"><option value="">Automático (pela data)</option><option value="1" ${t.slot === 1 ? 'selected' : ''}>Dia ${E.cfg(S).payDays[0]}</option><option value="2" ${t.slot === 2 ? 'selected' : ''}>Dia ${E.cfg(S).payDays[1]}</option></select>`) : ''}
  <div style="height:22px"></div><button class="btn" onclick="saveEdit('${id}')">Salvar alterações</button>`);
};
window.saveEdit = (id) => {
  try {
    const t = S.tx.find((x) => x.id === id), patch = { desc: val('e-desc').trim(), categoryId: val('e-cat') };
    if (!patch.desc) throw new Error('Diga o que foi.');
    if (t.kind === 'expense' && !t.cardId) patch.fund = val('e-fund') || null;
    if (document.getElementById('e-plan')) patch.planItemId = val('e-plan') || null;
    if (t.kind === 'income') patch.slot = +val('e-slot') || null;
    if (!t.cardId) {
      const c = E.toCents(val('e-val')); if (!Number.isInteger(c) || c <= 0) throw new Error('Informe um valor maior que zero.');
      patch.amountCents = c; if (t.status === 'paid') patch.paidCents = c;
      const d = val('e-date'); if (!d) throw new Error('Informe a data.');
      if (t.status === 'paid') patch.paidDate = d; else patch.dueDate = d;
      patch.purchaseDate = d;
    }
    E.edit(S, id, patch); save(); closeSheet(); toast('Lançamento atualizado'); render();
  } catch (e) { toast(e.message); }
};
window.openSettings = () => sheet(`<h2>Configurações</h2>${F('Seu nome', `<input id="s-n" value="${esc(S.profile.name)}">`)}
  <div style="height:8px"></div>${optBtn('brush', 'Personalizar aparência', esc(palName()), 'openAppearance()')}${optBtn('cal', 'Dias de recebimento', 'Dia ' + E.cfg(S).payDays[0] + ' e dia ' + E.cfg(S).payDays[1], 'openPayDays()')}
  ${F('Saldo ao abrir o app', `<div class="seg" style="margin:0"><button class="${!S.prefs.startHidden ? 'on' : ''}" onclick="S.prefs.startHidden=false;save();openSettings()">Visível</button><button class="${S.prefs.startHidden ? 'on' : ''}" onclick="S.prefs.startHidden=true;save();openSettings()">Oculto</button></div>`, 'No painel, o ícone de olho esconde ou mostra o saldo na hora. É só privacidade visual e não substitui a senha do app.')}
  <div style="height:22px"></div><button class="btn" onclick="S.profile.name=val('s-n')||'Renan';save();closeSheet();render()">Salvar</button>
  ${CLOUD && user ? `<p class="foot" style="text-align:left">Conectado como <b>${esc(user.email)}</b>. ${syncLabel()}.</p><button class="btn ghost" onclick="doLogout()">Sair desta conta</button><div style="height:10px"></div>` : `<p class="foot" style="text-align:left">Versão de teste: os dados ficam só neste navegador. Faça backup pelo menu.</p>`}<button class="link" onclick="openImport()">Restaurar backup</button><br>${CLOUD ? '' : `<button class="link" style="color:var(--bad)" onclick="ask('Apagar TODOS os dados deste aparelho? Não dá para desfazer.', () => {try{localStorage.removeItem('fc_v1')}catch(e){};location.reload()}, 'Apagar tudo')">Apagar dados deste aparelho</button>`}`);
window.exportData = () => { const j = JSON.stringify(S); sheet(`<h2>Backup dos dados</h2><p class="lead">Copie e guarde em lugar seguro, como Notas ou um e-mail para você mesmo.</p><textarea id="bk" rows="6" readonly>${esc(j)}</textarea><div style="height:14px"></div><button class="btn" onclick="const t=document.getElementById('bk');t.select();try{navigator.clipboard.writeText(t.value).then(()=>toast('Copiado'),()=>toast('Selecione e copie manualmente'))}catch(e){toast('Selecione e copie manualmente')}">Copiar backup</button>`); };

// ───── blocos de tela
const money = (c, cls = '') => { const neg = c < 0, a = Math.abs(c), r = String(Math.floor(a / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), d = String(a % 100).padStart(2, '0'); return `<span class="money ${cls} ${neg ? 'neg' : ''}">${neg ? '−' : ''}R$ ${r}<span class="d">,${d}</span></span>`; };
const topbar = (hello) => `<div class="top"><button class="who" onclick="openDrawer()" aria-label="Abrir menu"><div class="av">${esc(S.profile.name[0].toUpperCase())}</div>${hello ? `<span>Olá, <b>${esc(S.profile.name)}</b></span>` : ''}</button><button class="ctxpill" onclick="openCtx()">${CTXN[ctx()]}${ic('chevD')}</button></div>`;
window.openCtx = () => sheet(`<h2>Qual visão?</h2><p class="lead">Pessoal e profissional ficam separados. O consolidado só soma para consulta.</p>${['personal', 'business', 'all'].map((k) => `<button class="opt" onclick="setCtx('${k}')"><span class="sq">${ic(k === 'business' ? 'brief' : k === 'all' ? 'chart' : 'user')}</span><span class="t"><b>${CTXN[k]}</b><small>${{ personal: 'Suas finanças pessoais', business: 'Suas atividades profissionais', all: 'Soma das duas, só leitura' }[k]}</small></span>${ctx() === k ? ic('check', 'chev') : ''}</button>`).join('')}`);
const pageH = (t, lead, action) => `<div class="page-h"><div><h1>${t}</h1>${lead ? `<div class="lead">${lead}</div>` : ''}</div>${action || ''}</div>`;
const monthPicker = () => `<div class="mpick"><button onclick="chMonth(-1)" aria-label="Mês anterior">${ic('chevL')}</button><b>${MONTHS[+month.slice(5) - 1]} ${month.slice(0, 4)}</b><button onclick="chMonth(1)" aria-label="Próximo mês">${ic('chevR')}</button></div>`;
window.chMonth = (n) => { month = E.addMonths(month + '-01', n).slice(0, 7); render(); };
const empty = (i, t, s, btn) => `<div class="empty">${ic(i)}<b>${t}</b>${s}${btn || ''}</div>`;

const txRow = (t) => {
  const inc = t.kind === 'income', rf = t.kind === 'refund', tr = t.kind === 'transfer', ip = t.kind === 'invoice_payment', st = statusOf(t);
  const icon = inc ? 'down' : rf ? 'undo' : tr ? 'swap' : ip ? 'card' : null;
  const when = rf ? 'Fatura ' + fd(t.invoiceDue) : t.status === 'paid' ? (inc ? 'Recebido em ' : 'Pago em ') + fd(t.paidDate) : t.cardId ? 'Fatura ' + fd(t.invoiceDue) : st[0] === 'Pendente' ? 'Vence ' + fd(t.dueDate) : st[0] === 'Atrasada' ? 'Atrasada desde ' + fd(t.dueDate) : st[0];
  const kind = inc ? 'Entrada' : rf ? 'Estorno' : tr ? 'Transferência' : ip ? 'Fatura' : esc(catName(t.categoryId));
  return `<div class="row" onclick="openTx('${t.id}')"><div class="sq">${icon ? ic(icon) : catIcon(t.categoryId)}</div><div class="m"><b>${esc(t.desc)}</b><small class="${st[1]}">${kind} · ${when}</small></div><div class="a ${inc || rf ? 'pos' : st[1] === 'bad' ? 'bad' : st[1] === 'warn' ? 'warn' : ''}">${inc || rf ? '+' : tr ? '' : '−'}${brl(t.amountCents)}</div></div>`;
};
const invRow = (u) => `<div class="row" onclick="openInvoice('${u.cardId}','${u.dueDate}')"><div class="sq">${ic('card')}</div><div class="m"><b>${esc(u.desc)}</b><small class="${u.overdue ? 'bad' : 'warn'}">${u.overdue ? 'Atrasada · ' : ''}Vence ${fd(u.dueDate)}</small></div><div class="a ${u.overdue ? 'bad' : 'warn'}">−${brl(u.amountCents)}</div></div>`;
const listCtx = () => S.tx.filter((t) => ctx() === 'all' || t.context === ctx());

const partMoney = (c) => { const a = Math.abs(c), r = String(Math.floor(a / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return (c < 0 ? '−' : '') + 'R$ ' + r + `<span class="d">,${String(a % 100).padStart(2, '0')}</span>`; };
const balHtml = () => {
  const m = E.monthSummary(S, month, ctx(), E.today()), nacc = ctxAccounts().length, neg = m.projectedCents < 0;
  return `<div class="lblrow"><span class="lbl">Saldo disponível hoje</span><button class="eye" onclick="toggleBal()" aria-label="${hideBal ? 'Mostrar saldo disponível' : 'Ocultar saldo disponível'}" aria-pressed="${hideBal}">${ic(hideBal ? 'eyeoff' : 'eye')}</button></div>
  <div class="num">${hideBal ? '<span class="money msk" aria-label="Saldo oculto">••••••••</span>' : money(m.availableCents)}<span class="badge ${neg ? 'neg' : ''}">${neg ? 'Projeção negativa' : 'Vai sobrar ' + brl(m.projectedCents)}</span></div>
  <div class="lead" style="margin-top:10px">${nacc ? `Somando ${nacc} conta${nacc > 1 ? 's' : ''}. ` : ''}<button class="link" style="padding:0" onclick="go('bancos')">${nacc ? 'Ver contas' : 'Cadastrar conta'}</button></div>`;
};
window.setView = (v) => { S.prefs.view = v; save(); render(); };
const periodTiles = (pk) => {
  const p = E.periodSummary(S, pk, ctx(), E.today()), q = E.parsePk(pk);
  return `<div class="lead" style="margin:-4px 2px 12px">Dia ${E.cfg(S).payDays[q.slot - 1]} · ${p.range.start.slice(8)}/${p.range.start.slice(5, 7)} a ${p.range.end.slice(8)}/${p.range.end.slice(5, 7)}</div>
  <div class="kgrid"><div class="glass kpi"><div class="t"><i class="dot" style="background:var(--ok)"></i>Total recebido</div><div class="v">${partMoney(p.receivedCents)}</div></div><div class="glass kpi"><div class="t"><i class="dot" style="background:var(--grad2)"></i>Total previsto</div><div class="v">${partMoney(p.expectedCents)}</div></div></div>
  <div class="kgrid"><div class="glass kpi"><div class="t">Despesas vinculadas</div><div class="v">${partMoney(p.linkedCents)}</div></div><div class="glass kpi"><div class="t">Contas pendentes · ${p.pendingCount}</div><div class="v">${partMoney(p.pendingCents)}</div></div></div>
  <div class="kgrid"><div class="glass kpi"><div class="t">Contas pagas · ${p.paidCount}</div><div class="v">${partMoney(p.paidCents)}</div></div><div class="glass kpi"><div class="t">Saldo projetado</div><div class="v ${p.projectedCents < 0 ? 'neg' : ''}">${partMoney(p.projectedCents)}</div></div></div>
  <div class="glass sobrar" style="margin-bottom:12px"><div><div class="t">Saldo disponível do período</div><div class="v ${p.availableCents < 0 ? 'neg' : ''}">${partMoney(p.availableCents)}</div><small>Só o que já entrou menos o que já foi pago</small></div><button class="link" onclick="go('rec')">Detalhes</button></div>
  ${E.planItems(S).length ? (() => { const P = E.planPeriod(S, pk, ctx()); return `<div class="glass sobrar" style="margin-bottom:12px" onclick="go('orc')"><div><div class="t">Orçamento deste recebimento</div><div class="v ${P.balanceCents < 0 ? 'neg' : ''}">${partMoney(P.balanceCents)}</div><small>Sobra do plano · planejado ${brl(P.plannedTotal)} de ${brl(P.incomeBase)}</small></div><button class="link" style="padding:0">Abrir</button></div>`; })() : ''}
  <details class="how"><summary>Como calculamos?</summary>Previsto: tudo que você espera receber neste período. Recebido: o que você já confirmou. Projetado: previsto − despesas vinculadas. Disponível: recebido − o que já foi pago. Receita que ainda não entrou nunca conta como dinheiro disponível.</details>`;
};
function orcTile() {
  if (!E.planItems(S).length) return `<button class="glass orcq" onclick="go('orc')"><span class="sq">${ic('wallet')}</span><span class="t"><b>Monte seu orçamento</b><small>Decida quanto cada recebimento vai pagar</small></span>${ic('chevR', 'chev')}</button>`;
  const pd = E.cfg(S).payDays, a = E.planPeriod(S, E.pk(month, 1), ctx()), b = E.planPeriod(S, E.pk(month, 2), ctx());
  const cell = (d, P) => `<div><small>Dia ${d}</small><b class="${P.balanceCents < 0 ? 'neg' : 'pos'}">${brl(P.balanceCents)}</b><small>${P.balanceCents < 0 ? 'falta no plano' : 'sobra no plano'}</small></div>`;
  return `<button class="glass orcq col" onclick="go('orc')"><span class="top"><span class="sq">${ic('wallet')}</span><b>Orçamento de ${MONTHS[+month.slice(5) - 1].toLowerCase()}</b>${ic('chevR', 'chev')}</span><span class="two3">${cell(pd[0], a)}${cell(pd[1], b)}</span></button>`;
}
function vInicio() {
  const today = E.today(), m = E.monthSummary(S, month, ctx(), today), ups = E.upcoming(S, 7, ctx(), today), ins = E.insights(S, ctx(), today);
  const first = !S.accounts.length, view = S.prefs.view || 'month', pd = E.cfg(S).payDays;
  const seg = `<div class="seg" role="group" aria-label="Período do painel">${[['month', 'Visão geral'], ['1', 'Dia ' + pd[0]], ['2', 'Dia ' + pd[1]]].map(([k, l]) => `<button class="${view === k ? 'on' : ''}" aria-pressed="${view === k}" onclick="setView('${k}')">${l}</button>`).join('')}</div>`;
  const monthBlock = `<div class="kgrid"><div class="glass kpi"><div class="t"><i class="dot" style="background:var(--ok)"></i>Recebido</div><div class="v">${partMoney(m.receivedCents)}</div></div><div class="glass kpi"><div class="t"><i class="dot" style="background:var(--grad2)"></i>Gasto</div><div class="v">${partMoney(m.spentCents)}</div></div></div>
  <div class="glass sobrar" style="margin-bottom:12px"><div><div class="t">Ainda a pagar</div><div class="v">${partMoney(m.toPayCents)}</div><small>Contas e faturas até o fim do mês</small></div></div>
  <details class="how"><summary>Como calculamos “vai sobrar”?</summary>Saldo disponível (${brl(m.availableCents)}) + o que ainda vai receber (${brl(m.toReceiveCents)}) − o que vence até o fim do mês (${brl(m.toPayCents)}). “Gasto” inclui compras no cartão, e pagar a fatura não conta duas vezes. Disponível e projetado são coisas diferentes.</details>`;
  return `${topbar(true)}
  <div class="bal" id="balbox">${balHtml()}</div>
  <div class="qa"><button onclick="openExpense()"><span class="c">${ic('up')}</span>Despesa</button><button onclick="openIncome()"><span class="c">${ic('down')}</span>Entrada</button><button onclick="openTransfer()"><span class="c">${ic('swap')}</span>Transferir</button><button onclick="openNL()"><span class="c">${ic('chat')}</span>Por frase</button></div>
  ${first ? `<div class="glass" style="margin-top:22px"><b style="font-size:17px">Comece por aqui</b><div class="lead" style="margin:6px 0 16px">Cadastre onde seu dinheiro está. Depois é só registrar despesas e entradas.</div><button class="btn light" onclick="openAccount()">Cadastrar primeira conta</button></div>` : ''}
  ${orcTile()}${casalTile()}
  <div class="eyebrow">${view === 'month' ? 'Neste mês' : 'Neste período'}<small>${MONTHS[+month.slice(5) - 1]}</small></div>
  ${seg}${view === 'month' ? monthBlock : periodTiles(E.pk(month, +view))}
  ${m.overdueCents || ins.length ? `<div class="eyebrow">Atenção</div><div class="card">${m.overdueCents ? `<div class="alert bad">${ic('alert')}<span>Você tem ${brl(m.overdueCents)} em contas atrasadas.</span></div>` : ''}${ins.map((i) => `<div class="alert ${i.level === 'bad' ? 'bad' : i.level === 'warn' ? 'warn' : 'info'}">${ic(i.level === 'info' ? 'info' : 'alert')}<span>${esc(i.text)}</span></div>`).join('')}</div>` : ''}
  <div class="eyebrow">Próximos 7 dias${ups.length > 5 ? '<small onclick="go(\'contas\')" style="cursor:pointer">Ver todas</small>' : ''}</div>
  <div class="card">${ups.length ? ups.slice(0, 5).map((u) => u.type === 'invoice' ? invRow(u) : txRow(S.tx.find((t) => t.id === u.id))).join('') : empty('cal', 'Nada vencendo esta semana', 'Quando algo for vencer, aparece aqui.')}</div>
  <div class="foot">${syncLabel()}</div>`;
}

// ───── Recebimentos por período (dia 10 / dia 25 — configuráveis)
const shortD = (d) => d.slice(8) + '/' + d.slice(5, 7);
const invRow2 = (i) => `<div class="row" onclick="openInvoice('${i.cardId}','${i.dueDate}')"><div class="sq">${ic('card')}</div><div class="m"><b>Fatura ${esc(i.card.name)}</b><small class="${i.remainingCents <= 0 ? 'ok' : 'warn'}">${i.remainingCents <= 0 ? 'Paga' : 'Vence ' + fd(i.dueDate)}</small></div><div class="a ${i.remainingCents <= 0 ? 'pos' : 'warn'}">−${brl(i.remainingCents > 0 ? i.remainingCents : i.totalCents)}</div></div>`;
function periodCard(pk) {
  const p = E.periodSummary(S, pk, ctx(), E.today()), q = E.parsePk(pk), day = E.cfg(S).payDays[q.slot - 1], n = p.exps.length + p.invs.length;
  const stat = (l, v, cls = '') => `<div class="stat"><span>${l}</span><b class="${cls}">${v}</b></div>`;
  return `<div class="card"><div class="phead"><h3>Recebimentos do dia ${day}</h3><div class="lead">Período de ${shortD(p.range.start)} a ${shortD(p.range.end)}</div></div>
  <div class="mini"><div><small>Previsto</small><b>${brl(p.expectedCents)}</b></div><div><small>Recebido</small><b class="pos">${brl(p.receivedCents)}</b></div></div>
  <div class="sub"><span>Entradas</span><button class="link" style="padding:0" onclick="openIncome({date:'${E.paydayDate(S, pk)}',slot:${q.slot}})">+ Entrada</button></div>
  ${p.incomes.length ? p.incomes.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(txRow).join('') : `<div class="empty" style="padding:16px">Nenhuma entrada prevista neste período.</div>`}
  <div class="sub"><span>Contas pagas com este recebimento · ${n}</span><button class="link" style="padding:0" onclick="openLinker('${q.ym}')">Vincular</button></div>
  ${n ? p.exps.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(txRow).join('') + p.invs.map(invRow2).join('') : `<div class="empty" style="padding:16px">Nenhuma conta vinculada ainda.</div>`}
  <div style="height:8px"></div>${stat('Despesas vinculadas', brl(p.linkedCents))}${stat('Pendentes · ' + p.pendingCount, brl(p.pendingCents))}${stat('Pagas · ' + p.paidCount, brl(p.paidCents))}${stat('Saldo projetado', brl(p.projectedCents), p.projectedCents < 0 ? 'neg' : '')}${stat('Saldo disponível', brl(p.availableCents), p.availableCents < 0 ? 'neg' : '')}</div>`;
}
// ───── Orçamento por recebimento
const planKinds = ['fixed', 'variable', 'card', 'reserve', 'invest', 'saving'];
const planGroupTitle = { fixed: 'Contas fixas', card: 'Cartão de crédito', variable: 'Orçamentos variáveis', alloc: 'Reservas e investimentos' };
const planIcon = (k) => ({ fixed: 'receipt', variable: 'cart', card: 'card', reserve: 'wallet', invest: 'chart', saving: 'wallet' }[k]);
const planStatus = (r) => ({ pending: ['A pagar', 'warn'], paid: ['Pago', 'ok'], none: ['Não lançado', ''], over: ['Passou do orçado', 'bad'], near: ['Quase no limite', 'warn'], ok: ['Dentro do orçado', 'ok'], done: ['Separado', 'ok'], todo: ['A separar', ''] }[r.status]);
const planRow = (r, pk) => {
  const it = r.item, alloc = it.kind === 'reserve' || it.kind === 'invest' || it.kind === 'saving', st = planStatus(r);
  let sub, right, bar = '';
  if (alloc) { sub = E.PLAN_KINDS[it.kind] + ' · ' + st[0]; right = `<button class="pill ${r.done ? '' : 'pri'}" onclick="event.stopPropagation();togglePlanDone('${pk}','${it.id}')">${r.done ? 'Desfazer' : 'Separei'}</button>`; }
  else if (it.kind === 'fixed') { sub = (it.dueDay ? 'Vence dia ' + it.dueDay + ' · ' : '') + st[0] + (r.usedCents && r.usedCents !== it.amountCents ? ' · real ' + brl(r.usedCents) : ''); right = `<div class="a ${r.status === 'paid' ? 'pos' : ''}">${brl(it.amountCents)}</div>`; }
  else { const left = it.amountCents - r.usedCents, pct = Math.min(100, Math.round(r.usedCents * 100 / it.amountCents)); sub = (it.kind === 'card' ? (it.dueDay ? 'Fatura vence dia ' + it.dueDay + ' · ' : '') + 'Fatura ' : 'Gasto ') + brl(r.usedCents) + ' de ' + brl(it.amountCents); right = `<div class="a ${left < 0 ? 'bad' : ''}">${left < 0 ? '−' + brl(-left) : brl(left)}<small style="display:block;font-size:11px;font-weight:700;color:var(--mut)">${left < 0 ? 'acima' : 'resta'}</small></div>`; bar = `<div class="bar"><i style="width:${pct}%;${r.status === 'over' ? 'background:var(--bad)' : r.status === 'near' ? 'background:var(--warn)' : ''}"></i></div>`; }
  return `<div class="row" onclick="openPlanItem('${it.id}')"><div class="sq">${ic(planIcon(it.kind))}</div><div class="m"><b>${esc(it.name)}</b><small>${esc(sub)}</small>${bar}</div>${right}</div>`;
};
function planCard(pk) {
  const P = E.planPeriod(S, pk, ctx()), q = E.parsePk(pk), day = E.cfg(S).payDays[q.slot - 1];
  const grp = (key, f) => { const rows = P.rows.filter(f); if (!rows.length) return ''; const tot = rows.reduce((a, r) => a + r.plannedCents, 0); return `<div class="sub"><span>${planGroupTitle[key]} · ${brl(tot)}</span></div>${rows.map((r) => planRow(r, pk)).join('')}`; };
  const stat = (l, v, cls = '') => `<div class="stat"><span>${l}</span><b class="${cls}">${v}</b></div>`;
  return `<div class="card"><div class="phead"><h3>Orçamento do dia ${day}</h3><div class="lead">Período de ${shortD(P.range.start)} a ${shortD(P.range.end)}</div></div>
  <div class="mini"><div><small>Rendimento</small><b>${brl(P.incomeBase)}</b></div><div><small>Planejado</small><b>${brl(P.plannedTotal)}</b></div></div>
  ${grp('fixed', (r) => r.item.kind === 'fixed')}${grp('card', (r) => r.item.kind === 'card')}${grp('variable', (r) => r.item.kind === 'variable')}${grp('alloc', (r) => !['fixed', 'variable', 'card'].includes(r.item.kind))}
  <div style="padding:6px 18px 2px"><button class="link" style="padding:0" onclick="openPlanItem(null,${q.slot})">+ Adicionar item</button></div>
  <div style="height:6px"></div>${P.offCents ? `<div class="stat" onclick="openOffPlan('${pk}')" style="cursor:pointer"><span>Gastos fora do orçamento · ${P.off.length}</span><b>${brl(P.offCents)}</b></div>` : ''}
  ${stat('Sobra do plano', brl(P.balanceCents), P.balanceCents < 0 ? 'neg' : 'pos')}${stat('Sobra com o que já aconteceu', brl(P.realBalanceCents), P.realBalanceCents < 0 ? 'neg' : '')}</div>`;
}
function planUpdateNote() {
  if (!E.planItems(S).length) return '';
  const n = E.planPreviewUpdate(S, E.planTemplate(), E.today()).changes.length; if (!n) return '';
  return `<div class="note" style="margin:0 0 14px"><b>Nova versão da planilha disponível.</b> ${n} mudança${n > 1 ? 's' : ''} em relação ao seu orçamento atual.<br><button class="link" style="padding:6px 0 0" onclick="openPlanUpdate()">Ver e atualizar</button></div>`;
}
window.openPlanUpdate = () => {
  const r = E.planPreviewUpdate(S, E.planTemplate(), E.today()), lab = { novo: 'Novo', alterado: 'Alterado', removido: 'Sai do orçamento' }, ord = ['alterado', 'novo', 'removido'];
  sheet(`<h2>Atualizar o orçamento</h2><p class="lead">Confira o que muda. Contas mensais e contas a pagar ainda não pagas acompanham as mudanças. O que já foi pago e os seus lançamentos não são alterados.</p>
  ${ord.map((t) => { const l = r.changes.filter((c) => c.type === t); return l.length ? `<div class="eyebrow" style="margin-top:6px">${lab[t]} · ${l.length}</div><div class="card" style="margin:0 0 10px">${l.map((c) => `<div class="row" style="cursor:default"><div class="m"><b>${esc(c.name)}</b><small>${esc(c.text)}</small></div></div>`).join('')}</div>` : ''; }).join('')}
  <div style="height:12px"></div><button class="btn" onclick="doPlanUpdate()">Atualizar orçamento</button><div style="height:10px"></div><button class="btn ghost" onclick="closeSheet()">Agora não</button>`);
};
window.doPlanUpdate = () => { try { const r = E.planUpdate(S, E.planTemplate(), E.today()); save(); closeSheet(); toast('Orçamento atualizado · ' + r.changes.length + ' mudanças'); render(); } catch (e) { toast(e.message); } };
function vOrc() {
  const pk1 = E.pk(month, 1), pk2 = E.pk(month, 2), pd = E.cfg(S).payDays;
  if (!E.planItems(S).length) return `${topbar()}${pageH('Orçamento', 'Decida quanto cada recebimento vai pagar.')}
  <div class="card" style="padding:20px"><h3 style="margin:0 0 8px">Seu orçamento por recebimento</h3><p class="lead" style="margin:0 0 16px">Para cada recebimento (dia ${pd[0]} e dia ${pd[1]}), liste as contas fixas, os gastos que quer limitar e o que vai guardar. O app compara com o que você realmente gasta.</p>
  <button class="btn" onclick="importPlan()">Usar o orçamento da minha planilha</button><div style="height:10px"></div><button class="btn ghost" onclick="openPlanIncome()">Começar do zero</button></div>`;
  const a = E.planPeriod(S, pk1, ctx()), b = E.planPeriod(S, pk2, ctx());
  const row = (l, x, y, cls = '', tot = false) => `<tr class="${tot ? 'tot' : ''}"><td>${l}</td><td class="${cls}">${brl(x)}</td><td class="${cls}">${brl(y)}</td><td class="${cls}">${brl(x + y)}</td></tr>`;
  const warn = [a, b].filter((p) => p.balanceCents < 0).map((p) => `O orçamento do dia ${pd[E.parsePk(p.pk).slot - 1]} passa do rendimento em ${brl(-p.balanceCents)}.`);
  return `${topbar()}${pageH('Orçamento', 'Quanto cada recebimento paga, comparado ao que você gasta.', `<button class="link" onclick="openPlanIncome()">Rendimentos</button>`)}${monthPicker()}
  <div class="card"><table class="cmp"><thead><tr><th></th><th>Dia ${pd[0]}</th><th>Dia ${pd[1]}</th><th>Mês</th></tr></thead><tbody>
  ${row('Rendimento', a.incomeBase, b.incomeBase)}${row('Planejado', a.plannedTotal, b.plannedTotal)}${row('Já pago', a.paidTotal, b.paidTotal, 'pos')}${row('Sobra do plano', a.balanceCents, b.balanceCents, '', true)}</tbody></table></div>
  ${warn.length ? `<div class="note warn" style="margin:-4px 0 14px">${warn.join(' ')} Ajuste algum item para fechar a conta.</div>` : ''}
  ${planUpdateNote()}<button class="btn ghost" style="margin-bottom:14px" onclick="openGenerate()">Lançar as contas fixas deste mês</button>
  ${planCard(pk1)}${planCard(pk2)}
  <details class="how"><summary>Como funciona?</summary>Cada item pertence a um recebimento. Contas fixas viram lançamentos "a pagar" quando você usa o botão acima (nunca duplicam e nada é pago sozinho). Orçamentos variáveis comparam o limite com o que você gastou no período, pelo item escolhido no lançamento, pelo nome na descrição ou pela categoria, quando ela é única. O "Cartão reservado" é o teto da fatura que vence naquele recebimento: compras no cartão contam nele e não nos orçamentos em dinheiro (a menos que você escolha o item no lançamento). Reservas e investimentos são separações de dinheiro: marque "Separei" quando fizer. Tirar um item do orçamento nunca apaga gastos.</details>`;
}
window.togglePlanDone = (pk, id) => { E.planSetDone(S, pk, id, !S.plan.done[pk + '|' + id]); save(); render(); };
window.importPlan = () => ask('Vou preencher o orçamento com os itens e valores da sua planilha (dia 10 e dia 25). Você pode editar tudo depois. Nenhum lançamento é criado agora.', () => { try { E.planImport(S, E.planTemplate()); E.planFillBudgets(S, month, 12); save(); toast('Orçamento importado e limites por categoria preenchidos'); render(); } catch (e) { toast(e.message); } }, 'Importar');
window.openPlanIncome = () => { const pd = E.cfg(S).payDays, pl = S.plan; sheet(`<h2>Rendimentos planejados</h2><p class="lead">Quanto você espera receber em cada dia. É a base do orçamento.</p>
  ${F('Recebimento do dia ' + pd[0], `<input id="pi-1" inputmode="decimal" value="${pl.income[0] ? moneyIn(pl.income[0]) : ''}" placeholder="0,00">`)}${F('Recebimento do dia ' + pd[1], `<input id="pi-2" inputmode="decimal" value="${pl.income[1] ? moneyIn(pl.income[1]) : ''}" placeholder="0,00">`)}
  <div style="height:22px"></div><button class="btn" onclick="savePlanIncome()">Salvar</button>`); };
window.savePlanIncome = () => { try { [1, 2].forEach((n) => { const v = val('pi-' + n).trim(); E.planSetIncome(S, n, v ? E.toCents(v) : 0); }); save(); closeSheet(); render(); } catch (e) { toast(e.message); } };
window.openPlanItem = (id, slot) => {
  const it = id ? S.plan.items.find((x) => x.id === id) : { slot: slot || 1, kind: 'fixed', name: '', amountCents: 0, dueDay: '', categoryId: '' }, pd = E.cfg(S).payDays;
  sheet(`<h2>${id ? 'Editar item' : 'Novo item'}</h2>
  ${F('Nome', `<input id="pl-n" value="${esc(it.name)}" placeholder="Ex.: Aluguel">`)}
  ${F('Tipo', `<select id="pl-k" onchange="$('#pl-due').style.display=(this.value==='fixed'||this.value==='card')?'block':'none'">${planKinds.map((k) => `<option value="${k}" ${k === it.kind ? 'selected' : ''}>${E.PLAN_KINDS[k]}</option>`).join('')}</select>`)}
  ${F('Valor planejado', `<input id="pl-v" inputmode="decimal" value="${it.amountCents ? moneyIn(it.amountCents) : ''}" placeholder="0,00">`)}
  ${F('Sai de qual recebimento?', `<select id="pl-s"><option value="1" ${it.slot === 1 ? 'selected' : ''}>Dia ${pd[0]}</option><option value="2" ${it.slot === 2 ? 'selected' : ''}>Dia ${pd[1]}</option></select>`)}
  <div id="pl-due" style="display:${it.kind === 'fixed' || it.kind === 'card' ? 'block' : 'none'}">${F('Dia do vencimento', `<input id="pl-d" type="number" min="1" max="31" inputmode="numeric" value="${it.dueDay || ''}" placeholder="Ex.: 10">`, 'Conta fixa: usado para lançar com a data certa. Cartão: dia em que a fatura vence.')}</div>
  ${F('Categoria', `<select id="pl-c"><option value="">Sem categoria</option>${catOpts('expense', it.categoryId)}</select>`, 'Ajuda a contar os gastos deste item.')}
  <div style="height:22px"></div><button class="btn" onclick="savePlanItem('${id || ''}')">Salvar</button>
  ${id ? `<div style="height:10px"></div><button class="btn ghost" onclick="removePlanItem('${id}')">Tirar do orçamento</button>` : ''}`);
};
window.savePlanItem = (id) => {
  try {
    const o = { name: val('pl-n'), kind: val('pl-k'), amountCents: E.toCents(val('pl-v')), slot: +val('pl-s'), dueDay: val('pl-d') ? +val('pl-d') : null, categoryId: val('pl-c') || null };
    if (id) E.planEdit(S, id, o); else E.planAdd(S, o);
    save(); closeSheet(); toast('Orçamento atualizado'); render();
  } catch (e) { toast(e.message); }
};
window.removePlanItem = (id) => ask('Tirar este item do orçamento? Os lançamentos e gastos já feitos continuam existindo.', () => { E.planRemove(S, id); save(); closeSheet(); render(); }, 'Tirar');
window.openOffPlan = (pk) => { const P = E.planPeriod(S, pk, ctx()); sheet(`<h2>Fora do orçamento</h2><p class="lead">Gastos deste período que não se encaixam em nenhum item. Para incluí-los, escolha o item ao editar o lançamento.</p><div class="card" style="margin:0">${P.off.map(txRow).join('')}</div>`); };
window.openGenerate = () => {
  const accs = ctxAccounts(); if (!accs.length) return notice('Cadastre uma conta', 'Para lançar as contas fixas, o app precisa saber de qual conta elas saem.', () => go('contas'));
  sheet(`<h2>Lançar contas fixas</h2><p class="lead">Cria, como "a pagar", as contas fixas de ${MONTHS[+month.slice(5) - 1]} que ainda não foram lançadas, ligadas ao recebimento do orçamento. Nada é pago automaticamente e nada é duplicado.</p>${F('De qual conta saem?', `<select id="gn-a">${accOpts()}</select>`)}
  <div style="height:22px"></div><button class="btn" onclick="doGenerate()">Lançar</button>`);
};
window.doGenerate = () => { try { const acc = S.accounts.find((a) => a.id === val('gn-a')), r = E.planGenerate(S, month, { accountId: acc.id, context: acc.context }); save(); closeSheet(); toast(r.made.length ? r.made.length + ' contas lançadas' + (r.skipped.length ? ' · ' + r.skipped.length + ' já existiam' : '') : 'Nada novo para lançar'); render(); } catch (e) { toast(e.message); } };

function vRec() {
  const pk1 = E.pk(month, 1), pk2 = E.pk(month, 2), a = E.periodSummary(S, pk1, ctx(), E.today()), b = E.periodSummary(S, pk2, ctx(), E.today()), pd = E.cfg(S).payDays;
  const un = E.unlinked(S, ctx(), { from: month + '-01', to: E.endOfMonth(month + '-01') }), unSum = un.reduce((x, i) => x + i.amountCents, 0);
  const row = (l, x, y, cls = '', tot = false) => `<tr class="${tot ? 'tot' : ''}"><td>${l}</td><td class="${cls}">${brl(x)}</td><td class="${cls}">${brl(y)}</td><td class="${cls}">${brl(x + y)}</td></tr>`;
  return `${topbar()}${pageH('Recebimentos', 'Quanto entra em cada período e quais contas ele paga.', `<button class="link" onclick="openPayDays()">Dias: ${pd[0]} e ${pd[1]}</button>`)}${monthPicker()}
  <div class="card"><table class="cmp"><thead><tr><th></th><th>Dia ${pd[0]}</th><th>Dia ${pd[1]}</th><th>Mês</th></tr></thead><tbody>
  ${row('Receitas previstas', a.expectedCents, b.expectedCents)}${row('Já recebido', a.receivedCents, b.receivedCents, 'pos')}${row('Contas vinculadas', a.linkedCents, b.linkedCents)}
  ${un.length ? `<tr><td>Sem vínculo · ${un.length}</td><td></td><td></td><td>${brl(unSum)}</td></tr>` : ''}
  ${row('Saldo projetado', a.projectedCents, b.projectedCents, '', true)}</tbody></table></div>
  ${un.length ? `<div class="note warn" style="margin:-4px 0 14px">${un.length} conta${un.length > 1 ? 's' : ''} ainda sem recebimento definido neste mês (${brl(unSum)}). <button class="link" style="padding:0;color:inherit;text-decoration:underline" onclick="openLinker('${month}')">Vincular agora</button></div>` : ''}
  ${periodCard(pk1)}${periodCard(pk2)}
  <details class="how"><summary>Como funciona?</summary>Você escolhe com qual recebimento cada conta será paga (a sugestão é o recebimento mais recente antes do vencimento, mas nada é vinculado sem você aceitar). “Projetado” = previsto − contas vinculadas. “Disponível” = só o que já entrou − o que já foi pago. Os dias de recebimento podem ser trocados quando quiser.</details>`;
}
window.openPayDays = () => { const pd = E.cfg(S).payDays; sheet(`<h2>Dias de recebimento</h2><p class="lead">Informe os dias do mês em que seu dinheiro costuma entrar. Seus lançamentos e vínculos continuam valendo.</p>${F('Primeiro recebimento', `<input id="pd1" type="number" min="1" max="28" inputmode="numeric" value="${pd[0]}">`)}${F('Segundo recebimento', `<input id="pd2" type="number" min="1" max="28" inputmode="numeric" value="${pd[1]}">`, 'O segundo precisa ser depois do primeiro (dias de 1 a 28).')}<div style="height:22px"></div><button class="btn" onclick="savePayDays()">Salvar</button>`); };
window.savePayDays = () => { try { E.setPayDays(S, val('pd1'), val('pd2')); save(); closeSheet(); toast('Dias atualizados'); render(); } catch (e) { toast(e.message); } };
// escolher o recebimento de uma conta/fatura
window.openLink = (kind, a, b, back) => {
  let cur = '', due, title;
  if (kind === 'tx') { const t = S.tx.find((x) => x.id === a); cur = t.fund || ''; due = t.dueDate; title = t.desc; } else { cur = E.invoiceFundOf(S, a, b) || ''; due = b; title = 'Fatura ' + (S.cards.find((c) => c.id === a) || {}).name; }
  const sug = E.suggestFund(S, due);
  sheet(`<h2>Pago com qual recebimento?</h2><p class="lead">${esc(title)} · vence ${fd(due)}. A escolha é sua; a sugestão é o recebimento mais recente antes do vencimento.</p>
  ${optBtn(cur ? 'x' : 'check', 'Sem vínculo', 'Decidir depois', `setLink('${kind}','${a}','${b || ''}','','${back || ''}')`)}
  ${E.fundOptions(S, due).map((pk) => { const p = E.periodSummary(S, pk, ctx(), E.today()); return optBtn(cur === pk ? 'check' : 'cal', E.fundLabel(S, pk) + (pk === sug ? ' · sugerido' : ''), `Previsto ${brl(p.expectedCents)} · já vinculado ${brl(p.linkedCents)}`, `setLink('${kind}','${a}','${b || ''}','${pk}','${back || ''}')`); }).join('')}`);
};
window.setLink = (kind, a, b, pk, back) => { try { if (kind === 'tx') E.linkExpense(S, a, pk || null); else E.linkInvoice(S, a, b, pk || null); save(); toast(pk ? 'Vinculado ao ' + E.fundLabel(S, pk) : 'Vínculo removido'); if (back) { openLinker(back); render(); } else { closeSheet(); render(); } } catch (e) { toast(e.message); } };
window.openLinker = (ym) => {
  const un = E.unlinked(S, ctx(), { from: ym + '-01', to: E.endOfMonth(ym + '-01') });
  window._lk = un;
  sheet(`<h2>Contas sem recebimento</h2><p class="lead">${un.length ? 'Toque numa conta para escolher com qual recebimento ela será paga.' : 'Tudo vinculado neste mês.'}</p>
  ${un.length ? `<div class="card" style="margin:0 0 14px">${un.map((i) => `<div class="row" onclick="openLink('${i.type}','${i.type === 'tx' ? i.id : i.cardId}','${i.type === 'tx' ? '' : i.dueDate}','${ym}')"><div class="sq">${ic(i.type === 'tx' ? 'receipt' : 'card')}</div><div class="m"><b>${esc(i.desc)}</b><small>Vence ${fd(i.dueDate)} · sugestão: ${E.fundLabel(S, i.suggested)}</small></div><div class="a">${brl(i.amountCents)}</div></div>`).join('')}</div><button class="btn" onclick="acceptAll('${ym}')">Aceitar as ${un.length} sugestões</button><div style="height:10px"></div>` : ''}<button class="btn ghost" onclick="closeSheet()">Fechar</button>`);
};
window.acceptAll = (ym) => ask(`Vincular as ${window._lk.length} contas aos recebimentos sugeridos? Você pode mudar cada uma depois.`, () => { const n = E.acceptSuggestions(S, window._lk); save(); closeSheet(); toast(n + ' contas vinculadas'); render(); }, 'Vincular todas');

function vMov() {
  const L = listCtx().filter((t) => E.ym(t.purchaseDate) === month || (t.paidDate && E.ym(t.paidDate) === month)).sort((a, b) => (b.paidDate || b.dueDate || b.purchaseDate).localeCompare(a.paidDate || a.dueDate || a.purchaseDate));
  return `${topbar()}${pageH('Movimentações', 'Tudo que entrou, saiu ou foi transferido.')}${monthPicker()}<div class="card">${L.length ? L.map(txRow).join('') : empty('list', 'Nada neste mês', 'Use o botão + para registrar.')}</div>`;
}

let showAllBills = false;
window.openRecFromPlan = () => {
  if (needAccount()) return;
  const noPlan = !E.planItems(S).length, items = noPlan ? E.planTemplate().items.filter((i) => i.kind === 'fixed' && i.dueDay) : E.planRecurrenceCandidates(S), pd = E.cfg(S).payDays;
  sheet(`<h2>Contas da planilha</h2><p class="lead">Vou programar estas ${items.length} contas para todo mês, com o dia de vencimento de cada uma, e lançar os próximos 12 meses como "a pagar". Nada é pago automaticamente.</p>
  <div class="card" style="margin:0 0 14px">${items.slice().sort((a, b) => a.dueDay - b.dueDay).map((i) => `<div class="row" style="cursor:default"><div class="m"><b>${esc(i.name)}</b><small>Todo dia ${i.dueDay} · paga com o dia ${pd[i.slot - 1]}</small></div><div class="a">${brl(i.amountCents)}</div></div>`).join('')}</div>
  ${F('De qual conta saem?', `<select id="rp-a">${accOpts()}</select>`)}
  ${F('Contas deste mês que já venceram', `<select id="rp-p"><option value="0">Não incluir (começar pelas próximas)</option><option value="1">Incluir como "a pagar"</option></select>`, 'Se você já pagou, deixe em "Não incluir".')}
  <div style="height:22px"></div><button class="btn" onclick="doRecFromPlan()">Incluir contas</button>`);
};
window.doRecFromPlan = () => {
  try {
    const acc = S.accounts.find((a) => a.id === val('rp-a')), past = val('rp-p') === '1';
    if (!E.planItems(S).length) { E.planImport(S, E.planTemplate()); E.planFillBudgets(S, month, 12); }
    const r = E.planRecurrences(S, { accountId: acc.id, context: acc.context, includePast: past }); save(); closeSheet(); sub = 'pagar'; toast(r.made.length + ' contas mensais incluídas'); render();
  } catch (e) { toast(e.message); }
};
window.openRecItem = (id) => {
  const r = S.recurrences.find((x) => x.id === id), next = S.tx.filter((t) => t.recurrenceId === id && t.status === 'pending').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  sheet(`<h2>${esc(r.desc)}</h2><p class="lead">Vence todo dia ${r.day}.${next ? ' Próxima: ' + fd(next.dueDate) + '.' : ''}</p>
  ${F('Valor mensal', `<input id="rv-v" inputmode="decimal" value="${moneyIn(r.amountCents)}">`, 'Muda o valor das contas futuras ainda não pagas. As já pagas ficam como estão.')}
  <div style="height:22px"></div><button class="btn" onclick="saveRecItem('${id}')">Salvar valor</button><div style="height:10px"></div><button class="btn ghost" onclick="stopRecItem('${id}')">Parar esta conta mensal</button>`);
};
window.saveRecItem = (id) => { try { const n = E.editRecurringAmount(S, id, E.toCents(val('rv-v'))); save(); closeSheet(); toast(n + ' contas futuras atualizadas'); render(); } catch (e) { toast(e.message); } };
window.stopRecItem = (id) => ask('Parar esta conta mensal? As contas futuras ainda não pagas serão canceladas. O que já foi pago continua no histórico.', () => { const n = E.stopRecurring(S, id); save(); closeSheet(); toast(n + ' contas futuras canceladas'); render(); }, 'Parar');
// Prazos: cada conta cai em uma faixa de vencimento, com cor própria
const HZ = [
  { k: 'late', n: 'Atrasadas', d: 'já venceram', c: 'var(--bad)' },
  { k: 'week', n: 'Esta semana', d: 'até 7 dias', c: 'var(--warn)' },
  { k: 'fort', n: 'Quinzena', d: '8 a 15 dias', c: 'var(--link)' },
  { k: 'month', n: 'Este mês', d: '16 a 30 dias', c: 'var(--c2)' },
  { k: 'later', n: 'Mais adiante', d: 'depois de 30 dias', c: 'var(--mut)' }];
let billHz = 'all', billFund = 'all';
const hzOf = (t, today) => { const d = Math.round((new Date(t.dueDate + 'T12:00:00') - new Date(today + 'T12:00:00')) / 86400000); return d < 0 ? 'late' : d <= 7 ? 'week' : d <= 15 ? 'fort' : d <= 30 ? 'month' : 'later'; };
const fundOfTx = (t) => t.fund ? 'd' + E.parsePk(t.fund).slot : 'none';
const hzCount = (arr, today) => { const m = { all: arr.length }; HZ.forEach((h) => { m[h.k] = 0; }); arr.forEach((t) => { m[hzOf(t, today)]++; }); return m; };
function hzBlock(arr, today, withFund, emptyHtml) {
  if (!arr.length) return `<div class="card">${emptyHtml}</div>`;
  const pd = E.cfg(S).payDays;
  let list = arr;
  if (withFund && billFund !== 'all') list = arr.filter((t) => fundOfTx(t) === billFund);
  const cnt = hzCount(list, today), cntAll = hzCount(arr, today);
  if (billHz !== 'all' && !cnt[billHz]) billHz = 'all';
  const chips = `<div class="hzchips"><button class="hzc ${billHz === 'all' ? 'on' : ''}" onclick="billHz='all';render()">Todas <small>${cnt.all}</small></button>${HZ.filter((h) => cnt[h.k] || billHz === h.k).map((h) => `<button class="hzc ${billHz === h.k ? 'on' : ''}" style="--hzc:${h.c}" onclick="billHz='${h.k}';render()"><i></i>${h.n} <small>${cnt[h.k]}</small></button>`).join('')}</div>`;
  const fcnt = { all: arr.length, d1: 0, d2: 0, none: 0 }; arr.forEach((t) => { fcnt[fundOfTx(t)]++; });
  const fchips = withFund && (fcnt.d1 || fcnt.d2) ? `<div class="hzchips sm"><span class="hzl">Paga com</span>${[['all', 'Todos'], ['d1', 'Dia ' + pd[0]], ['d2', 'Dia ' + pd[1]], ['none', 'Sem vínculo']].filter(([k]) => k === 'all' || fcnt[k]).map(([k, l]) => `<button class="hzc ${billFund === k ? 'on' : ''}" onclick="billFund='${k}';render()">${l} <small>${fcnt[k]}</small></button>`).join('')}</div>` : '';
  const groups = HZ.filter((h) => (billHz === 'all' || billHz === h.k) && cnt[h.k]).map((h) => {
    const rows = list.filter((t) => hzOf(t, today) === h.k), tot = rows.reduce((x, t) => x + t.amountCents, 0), collapsed = billHz === 'all' && h.k === 'later' && !showAllBills;
    return `<div class="hzh" style="--hzc:${h.c}"><i></i><b>${h.n}</b><span>${h.d}</span><em>${rows.length} · ${brl(tot)}</em></div>${collapsed ? `<div style="padding:2px 16px 14px"><button class="link" style="padding:0" onclick="showAllBills=true;render()">Mostrar as ${rows.length} contas mais adiante</button></div>` : `<div class="hz" style="--hzc:${h.c}">${rows.map(txRow).join('')}</div>`}`;
  }).join('');
  const hidden = billHz === 'all' && showAllBills && cnt.later ? `<div style="padding:0 16px 14px"><button class="link" style="padding:0" onclick="showAllBills=false;render()">Esconder as contas mais adiante</button></div>` : '';
  return `${chips}${fchips}<div class="card">${groups || empty('check', 'Nada nesta combinação', 'Troque o filtro acima.')}${hidden}</div>`;
}
const dupNote = () => {
  const d = E.findDuplicates(S, ctx()), u = (() => { try { const x = lsGet('fc_dup_undo'); return x ? JSON.parse(x) : null; } catch (e) { return null; } })();
  return (d.total ? `<div class="note warn" style="margin:0 0 12px"><b>${d.total} item${d.total > 1 ? 'ns' : ''} repetido${d.total > 1 ? 's' : ''} encontrado${d.total > 1 ? 's' : ''}.</b> Ex.: ${esc([...d.recurrences, ...d.bills, ...d.planItems][0].name)}.<br><button class="link" style="padding:6px 0 0" onclick="openDups()">Ver e corrigir</button></div>` : '') + (u ? `<div style="margin:-4px 0 10px"><button class="link" style="padding:0" onclick="undoDups()">${ic('undo')}Desfazer a última correção de repetidos</button></div>` : '');
};
window.openDups = () => {
  const d = E.findDuplicates(S, ctx()), pd = E.cfg(S).payDays;
  const blk = (title, arr, text) => arr.length ? `<div class="eyebrow" style="margin-top:6px">${title} · ${arr.length}</div><div class="card" style="margin:0 0 10px">${arr.map((x) => `<div class="row" style="cursor:default"><div class="m"><b>${esc(x.name)}</b><small>${text(x)}</small></div></div>`).join('')}</div>` : '';
  sheet(`<h2>Itens repetidos</h2><p class="lead">Mantemos a melhor cópia de cada um (a já paga, ou a ligada ao orçamento ou à conta mensal) e cancelamos as outras. Nada é apagado e dá para desfazer.</p>
  ${blk('Contas mensais', d.recurrences, (x) => `${x.drop.length + 1} cópias · mantém a do dia ${x.keep.day}${x.keep.planItemId ? ' (ligada ao orçamento)' : ''}, encerra ${x.drop.length} e cancela as contas futuras que ela gerou`)}
  ${blk('Contas a pagar/receber', d.bills, (x) => `${x.drop.length + 1} cópias em ${fd(x.keep.dueDate)} · mantém ${x.keep.status === 'paid' ? 'a paga' : '1'}, cancela ${x.drop.length} (${brl(x.drop[0].amountCents)})`)}
  ${blk('Itens do orçamento', d.planItems, (x) => `${x.drop.length + 1} cópias no dia ${pd[x.keep.slot - 1]} · tira ${x.drop.length} do orçamento`)}
  <div style="height:12px"></div><button class="btn" onclick="doFixDups()">Corrigir repetidos</button><div style="height:10px"></div><button class="btn ghost" onclick="closeSheet()">Agora não</button>`);
};
window.doFixDups = () => { try { const r = E.fixDuplicates(S, ctx()); try { lsSet('fc_dup_undo', JSON.stringify(r.undo)); } catch (e) {} save(); closeSheet(); toast(`Corrigido: ${r.recurrences + r.bills + r.planItems} repetidos`); render(); } catch (e) { toast(e.message); } };
window.undoDups = () => ask('Desfazer a última correção? As contas e contas mensais repetidas voltam como estavam.', () => { try { const u = JSON.parse(lsGet('fc_dup_undo')); const n = E.undoFixDuplicates(S, u); localStorage.removeItem('fc_dup_undo'); save(); toast('Correção desfeita'); render(); } catch (e) { toast('Nada para desfazer'); } }, 'Desfazer');
function vContas() {
  const L = listCtx().filter((t) => t.status === 'pending' && !t.cardId && t.kind !== 'transfer'), today = E.today();
  const pay = L.filter((t) => t.kind === 'expense').sort((a, b) => a.dueDate.localeCompare(b.dueDate)), rec = L.filter((t) => t.kind === 'income').sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const recs = S.recurrences.filter((r) => !r.ended && (ctx() === 'all' || r.context === ctx())), cand = E.planRecurrenceCandidates(S).length, noPlan = !E.planItems(S).length;
  const seg = `<div class="seg">${[['pagar', 'A pagar'], ['receber', 'A receber'], ['rec', 'Mensais']].map(([k, l]) => `<button class="${sub === k ? 'on' : ''}" onclick="sub='${k}';render()">${l}</button>`).join('')}</div>`;
  let body = '', lead = '';
  if (sub === 'pagar') { const w = pay.filter((t) => hzOf(t, today) !== 'later'), tot = w.reduce((a, t) => a + t.amountCents, 0); lead = pay.length ? `${w.length} conta${w.length !== 1 ? 's' : ''} · ${brl(tot)} nos próximos 30 dias` : 'Nada pendente.'; body = hzBlock(pay, today, true, empty('check', 'Nenhuma conta a pagar', 'Use o botão + para adicionar uma despesa com vencimento.')); }
  if (sub === 'receber') { const tot = rec.reduce((a, t) => a + t.amountCents, 0); lead = rec.length ? `${rec.length} valor${rec.length > 1 ? 'es' : ''} · ${brl(tot)} a receber` : 'Nada previsto.'; body = hzBlock(rec, today, false, empty('down', 'Nada a receber', 'Registre uma entrada marcando “Ainda não” em “Já caiu na conta?”.')); }
  if (sub === 'rec') { lead = 'Contas que se repetem todo mês.'; body = `<div class="card">${recs.length ? recs.slice().sort((a, b) => a.day - b.day).map((r) => `<div class="row" onclick="openRecItem('${r.id}')"><div class="sq">${ic('repeat')}</div><div class="m"><b>${esc(r.desc)}</b><small>Todo dia ${r.day}${r.kind === 'income' ? ' · Entrada' : ''}${r.fundSlot ? ' · paga com o dia ' + E.cfg(S).payDays[r.fundSlot - 1] : ''}</small></div><div class="a">${brl(r.amountCents)}</div></div>`).join('') : empty('repeat', 'Nenhuma conta mensal', 'Aluguel, internet, escola... programe uma vez só.')}</div>${cand || noPlan ? `<button class="btn" style="margin:14px 0 4px" onclick="openRecFromPlan()">Incluir as contas da minha planilha</button>` : ''}<button class="link" onclick="openRecurring()">+ Programar conta mensal</button>`; }
  return `${topbar()}${pageH('Contas', lead)}${dupNote()}${seg}${body}`;
}

function vBancos() {
  const l = ctxAccounts(), tot = E.totalAvailable(S, ctx());
  return `${topbar()}${pageH('Contas bancárias', 'De onde vem e para onde vai o seu dinheiro.', `<button class="link" onclick="openAccount()">+ Nova</button>`)}<div class="hero"><div class="lbl">Total nas contas</div><div class="num ${tot < 0 ? 'neg' : ''}">${brl(tot)}</div></div><div class="card">${l.length ? l.map((a) => { const b = E.accountBalance(S, a); return `<div class="row" onclick="openEditAccount('${a.id}')"><div class="sq">${ic(a.type === 'cash' ? 'wallet' : 'bank')}</div><div class="m"><b>${esc(a.name)}</b><small>${a.context === 'business' ? 'Profissional' : 'Pessoal'}</small></div><div class="a ${b < 0 ? 'neg' : ''}">${brl(b)}</div></div>`; }).join('') : empty('bank', 'Nenhuma conta ainda', 'Cadastre onde seu dinheiro está.', `<br><button class="btn" onclick="openAccount()">Cadastrar conta</button>`)}</div>`;
}

// ───── Cartões: resumo, lançamentos (consulta e edição), parcelas, estorno
let cardSub = 'cartoes', cfLimit = 60;
const CF = { q: '', cardId: '', month: '', invoice: '', categoryId: '', merchant: '', type: '', from: '', to: '' };
const CF_KEYS = ['cardId', 'month', 'invoice', 'categoryId', 'merchant', 'type', 'from', 'to'];
const MS3 = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const mlabel = (ym) => MS3[+ym.slice(5, 7) - 1] + '/' + ym.slice(0, 4);
const ST = { open: ['Fatura aberta', ''], closed: ['Fatura fechada', 'warn'], paid: ['Fatura paga', 'ok'], cancelled: ['Cancelada', 'bad'], refund: ['Estorno', 'ok'] };
const cardsInCtx = () => S.cards.filter((c) => ctx() === 'all' || c.context === ctx());
const entryRow = (r) => {
  const st = ST[r.status], rf = r.status === 'refund';
  return `<div class="row" onclick="openTx('${r.tx.id}')"><div class="sq">${rf ? ic('undo') : catIcon(r.tx.categoryId)}</div><div class="m"><b>${esc(r.desc)}</b><small>${[r.merchant, r.card.name, r.of > 1 ? `parcela ${r.no}/${r.of}` : 'à vista'].filter(Boolean).map(esc).join(' · ')}</small><small class="s2">${esc(r.categoryName || 'Sem categoria')} · compra ${fd(r.date)} · fatura ${fd(r.invoiceDue)}</small><span class="pill ${st[1]}" style="margin-top:6px;display:inline-block">${st[0]}</span></div><div class="a two ${rf ? 'pos' : ''}">${rf ? '+' : '−'}${brl(r.installmentCents)}${r.of > 1 ? `<small>de ${brl(r.totalCents)}</small>` : ''}</div></div>`;
};
const cfActive = () => CF_KEYS.filter((k) => CF[k]);
const cfLabel = (k) => ({ cardId: () => (S.cards.find((c) => c.id === CF.cardId) || {}).name, month: () => mlabel(CF.month), invoice: () => 'Fatura ' + fd(CF.invoice), categoryId: () => catName(CF.categoryId), merchant: () => CF.merchant, type: () => CF.type === 'installment' ? 'Parceladas' : 'À vista', from: () => 'De ' + fd(CF.from), to: () => 'Até ' + fd(CF.to) }[k])();
const listHtml = () => {
  const all = E.cardEntries(S, CF, ctx()), rows = all.slice(0, cfLimit), tot = all.reduce((a, r) => a + (r.status === 'refund' ? -r.installmentCents : r.installmentCents), 0);
  return `<div class="lead" style="margin:0 2px 10px">${all.length} lançamento${all.length === 1 ? '' : 's'} · ${brl(tot)}</div><div class="card">${rows.length ? rows.map(entryRow).join('') : empty('search', 'Nada encontrado', cfActive().length || CF.q ? 'Tente outra busca ou limpe os filtros.' : 'As compras no cartão aparecem aqui.')}</div>${all.length > cfLimit ? `<button class="btn ghost" onclick="cfLimit+=60;render()">Mostrar mais (${all.length - cfLimit})</button>` : ''}`;
};
window.setQ = (v) => { CF.q = v; cfLimit = 60; const el = $('#clist'); if (el) el.innerHTML = listHtml(); };
window.clrF = (k) => { CF[k] = ''; if (k === 'cardId') CF.invoice = ''; cfLimit = 60; render(); };
window.openFilters = () => {
  const cs = cardsInCtx(), scope = CF.cardId ? cs.filter((c) => c.id === CF.cardId) : cs;
  const months = [...new Set(E.cardEntries(S, {}, ctx()).map((r) => E.ym(r.competence)).concat([E.ym(E.today())]))].sort().reverse();
  const dues = [...new Set([].concat(...scope.map((c) => E.invoices(S, c.id).map((i) => i.dueDate))))].sort().reverse();
  const sel = (id, opts, cur) => `<select id="${id}">${opts.map(([v, l]) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  sheet(`<h2>Filtros</h2><p class="lead">Combine como quiser. A busca por texto continua valendo junto.</p>
  ${F('Cartão', sel('f-card', [['', 'Todos os cartões']].concat(cs.map((c) => [c.id, c.name])), CF.cardId))}
  ${F('Mês', sel('f-month', [['', 'Todos os meses']].concat(months.map((m) => [m, mlabel(m)])), CF.month))}
  ${F('Fatura (vencimento)', sel('f-inv', [['', 'Todas as faturas']].concat(dues.map((d) => [d, fd(d)])), CF.invoice))}
  ${F('Categoria', sel('f-cat', [['', 'Todas as categorias']].concat(S.categories.filter((c) => c.kind === 'expense').map((c) => [c.id, c.name])), CF.categoryId))}
  ${F('Estabelecimento', `<input id="f-mer" value="${esc(CF.merchant)}" placeholder="Parte do nome">`)}
  ${F('Tipo', chipsFor('f-type', 'ft', [['', 'Todas'], ['installment', 'Parceladas'], ['single', 'À vista']], CF.type))}
  ${F('Período personalizado', `<div class="two2"><input id="f-from" type="date" value="${CF.from}" aria-label="De"><input id="f-to" type="date" value="${CF.to}" aria-label="Até"></div>`, 'Usa a data de cada cobrança.')}
  <div style="height:22px"></div><button class="btn" onclick="applyFilters()">Aplicar filtros</button><div style="height:10px"></div><button class="btn ghost" onclick="clearFilters()">Limpar filtros</button>`);
};
window.applyFilters = () => { Object.assign(CF, { cardId: val('f-card'), month: val('f-month'), invoice: val('f-inv'), categoryId: val('f-cat'), merchant: val('f-mer').trim(), type: val('f-type'), from: val('f-from'), to: val('f-to') }); cfLimit = 60; closeSheet(); render(); };
window.clearFilters = () => { CF_KEYS.forEach((k) => { CF[k] = ''; }); cfLimit = 60; closeSheet(); render(); };

const cardUndoGet = () => { try { const x = lsGet('fc_cards_undo'); return x ? JSON.parse(x) : null; } catch (e) { return null; } };
function cardTools() {
  const u = cardUndoGet();
  return `<div class="ctools"><button class="clear" onclick="openClearCards()">${ic('x')}Limpar valores</button>${u ? `<button class="link" style="padding:0" onclick="undoClearCards()">${ic('undo')}Desfazer limpeza</button>` : ''}</div>`;
}
window.openClearCards = () => {
  const p = E.previewClearCards(S);
  sheet(`<h2>Limpar valores dos cartões</h2><p class="lead" style="color:var(--tx);line-height:1.5">Zera esta aba para você informar tudo de novo. Os cartões continuam cadastrados (nome e dias), mas ficam com o <b>limite zerado</b>.</p>
  <div class="card" style="margin:0 0 12px"><div class="stat"><span>Compras</span><b>${p.purchases}</b></div><div class="stat"><span>Parcelas nas faturas</span><b>${p.installments}</b></div><div class="stat"><span>Estornos</span><b>${p.refunds}</b></div><div class="stat"><span>Pagamentos de fatura</span><b>${p.payments}${p.paymentsCents ? ' · ' + brl(p.paymentsCents) : ''}</b></div><div class="stat"><span>Limite total</span><b>${brl(p.limitsCents)} → R$ 0,00</b></div></div>
  ${p.paymentsCents ? `<div class="note warn">Os pagamentos de fatura (${brl(p.paymentsCents)}) também são apagados, e esse dinheiro volta para o saldo das contas.</div>` : ''}
  <div class="note">Você poderá desfazer logo depois, pelo botão "Desfazer limpeza" desta aba.</div>
  <div style="height:12px"></div><button class="btn" style="background:var(--bad)" onclick="doClearCards()">Limpar valores</button><div style="height:10px"></div><button class="btn ghost" onclick="closeSheet()">Voltar</button>`);
};
window.doClearCards = () => { try { const snap = E.clearCards(S); try { lsSet('fc_cards_undo', JSON.stringify(snap)); } catch (e) {} save(); closeSheet(); cardSub = 'cartoes'; toast('Cartões zerados'); render(); } catch (e) { toast(e.message); } };
window.undoClearCards = () => ask('Devolver tudo o que foi apagado na última limpeza? Compras, parcelas, pagamentos de fatura e limites voltam como estavam.', () => { const snap = cardUndoGet(); if (!snap) return toast('Nada para desfazer'); const n = E.restoreCards(S, snap); try { localStorage.removeItem('fc_cards_undo'); } catch (e) {} save(); toast(n + ' lançamentos restaurados'); render(); }, 'Desfazer');
window.openEditCard = (id) => { const c = S.cards.find((x) => x.id === id); sheet(`<h2>Editar cartão</h2>${F('Nome', `<input id="ec-n" value="${esc(c.name)}">`)}${F('Limite total', `<input id="ec-l" inputmode="decimal" value="${c.limitCents ? moneyIn(c.limitCents) : ''}" placeholder="0,00">`)}${F('Dia que fecha a fatura', `<input id="ec-c" type="number" min="1" max="28" inputmode="numeric" value="${c.closingDay}">`)}${F('Dia que vence', `<input id="ec-d" type="number" min="1" max="28" inputmode="numeric" value="${c.dueDay}">`, 'Mudar os dias vale para as próximas compras. As já lançadas ficam nas faturas em que estão.')}<div style="height:22px"></div><button class="btn" onclick="saveEditCard('${id}')">Salvar</button>`); };
window.saveEditCard = (id) => { try { E.editCard(S, id, { name: val('ec-n'), limitCents: E.toCents(val('ec-l') || '0'), closingDay: +val('ec-c'), dueDay: +val('ec-d') }); save(); closeSheet(); toast('Cartão atualizado'); render(); } catch (e) { toast(e.message); } };
function vCartoes() {
  const cards = cardsInCtx();
  const seg = `<div class="seg"><button class="${cardSub === 'cartoes' ? 'on' : ''}" onclick="cardSub='cartoes';render()">Cartões</button><button class="${cardSub === 'lanc' ? 'on' : ''}" onclick="cardSub='lanc';render()">Lançamentos</button></div>${cardTools()}`;
  const head = pageH('Cartões', cardSub === 'lanc' ? 'Todas as compras, com busca e edição.' : 'Limite, faturas e parcelas.', `<button class="link" onclick="openCard()">+ Novo</button>`);
  if (!cards.length) return `${topbar()}${head}<div class="card">${empty('card', 'Nenhum cartão cadastrado', 'Cadastre para acompanhar limite e faturas.', `<br><button class="btn" onclick="openCard()">Cadastrar cartão</button>`)}</div>`;
  if (cardSub === 'lanc') {
    const scope = CF.cardId ? cards.filter((c) => c.id === CF.cardId) : cards, sm = scope.map((c) => E.cardSummary(S, c)), sum = (k) => sm.reduce((a, x) => a + x[k], 0), nf = cfActive().length;
    return `${topbar()}${head}${seg}
    <div class="stats4"><div class="glass"><div class="t">Gasto no mês</div><div class="v">${partMoney(sum('spentMonthCents'))}</div></div><div class="glass"><div class="t">Fatura atual</div><div class="v">${partMoney(sum('currentCents'))}</div></div><div class="glass"><div class="t">Parcelas futuras</div><div class="v">${partMoney(sum('futureCents'))}</div></div><div class="glass"><div class="t">Limite disponível</div><div class="v">${partMoney(sum('availableCents'))}</div></div></div>
    <div class="search">${ic('search')}<input id="cq" type="search" value="${esc(CF.q)}" placeholder="Buscar compra, loja, categoria ou valor" oninput="setQ(this.value)" aria-label="Buscar lançamentos"></div>
    <div class="fbar"><button class="fbtn" onclick="openFilters()">${ic('filter')}Filtros${nf ? `<span class="n">${nf}</span>` : ''}</button>${cfActive().map((k) => `<button class="fchip" onclick="clrF('${k}')" aria-label="Remover filtro ${esc(cfLabel(k))}">${esc(cfLabel(k))}${ic('x')}</button>`).join('')}</div>
    <div id="clist">${listHtml()}</div>`;
  }
  return `${topbar()}${head}${seg}${cards.map((c) => {
    const lim = E.cardLimit(S, c), sm = E.cardSummary(S, c), invs = E.invoices(S, c.id).filter((i) => i.status !== 'paid' || i.remainingCents > 0), pct = c.limitCents ? Math.min(100, Math.round(lim.usedCents / c.limitCents * 100)) : 0;
    return `${!c.limitCents ? `<div class="note warn" style="margin:0 0 10px">Informe o limite do cartão ${esc(c.name)}. <button class="link" style="padding:0" onclick="openEditCard('${c.id}')">Informar limite</button></div>` : ''}<div class="creditcard"><div><div class="n">${esc(c.name)}</div><div class="v">${brl(lim.availableCents)}</div><small>de limite disponível · total ${brl(c.limitCents)}</small></div><div><div class="bar"><i style="width:${pct}%"></i></div><small style="display:block;margin-top:10px">Fecha dia ${c.closingDay} · vence dia ${c.dueDay} · <button class="link" style="padding:0;display:inline;color:inherit;text-decoration:underline" onclick="openEditCard('${c.id}')">Editar</button></small></div></div>
    <div class="stats4" style="margin-top:0"><div class="glass"><div class="t">Gasto no mês</div><div class="v">${partMoney(sm.spentMonthCents)}</div></div><div class="glass"><div class="t">Fatura atual</div><div class="v">${partMoney(sm.currentCents)}</div></div><div class="glass"><div class="t">Parcelas futuras</div><div class="v">${partMoney(sm.futureCents)}</div></div><div class="glass"><div class="t">Já usado do limite</div><div class="v">${partMoney(lim.usedCents)}</div></div></div>
    ${sm.closedCents ? `<div class="note warn" style="margin:-2px 0 12px">Fatura fechada a pagar: ${brl(sm.closedCents)}</div>` : ''}
    <div class="card">${invs.length ? invs.map((i) => `<div class="row" onclick="openInvoice('${c.id}','${i.dueDate}')"><div class="sq">${ic('receipt')}</div><div class="m"><b>Fatura de ${MONTHS[+i.dueDate.slice(5, 7) - 1].toLowerCase()}</b><small>${i.status === 'open' ? 'Aberta' : 'Fechada'} · vence ${fd(i.dueDate)} · ${i.items.length} lançamento${i.items.length === 1 ? '' : 's'}</small></div><div class="a">${brl(i.remainingCents)}</div></div>`).join('') : empty('check', 'Sem faturas em aberto', 'Compras no cartão aparecem aqui.')}</div>`;
  }).join('')}<button class="btn ghost" onclick="cardSub='lanc';render()">Ver todos os lançamentos</button><div class="foot" style="text-align:left">Os cartões são controlados manualmente: você lança as compras e o app organiza fatura e parcelas. Pagar a fatura não cria nova despesa.</div>`;
}

window.openInvoice = (cardId, due) => {
  const inv = E.invoices(S, cardId).find((i) => i.dueDate === due), card = S.cards.find((c) => c.id === cardId); if (!inv) return;
  const fund = E.invoiceFundOf(S, cardId, due), items = inv.items.slice().sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
  sheet(`<h2>Fatura ${esc(card.name)}</h2><p class="lead">Vence ${fd(due)} · ${inv.status === 'paid' ? 'Paga' : inv.status === 'open' ? 'Aberta' : 'Fechada'}</p>
  <div class="big">${brl(inv.totalCents)}</div>
  <div class="card" style="margin:0"><div class="stat"><span>Já pago</span><b>${brl(inv.paidCents)}</b></div><div class="stat"><span>Falta pagar</span><b>${brl(Math.max(inv.remainingCents, 0))}</b></div><div class="stat"><span>Paga com o recebimento</span><b>${fund ? E.fundLabel(S, fund) : 'Sem vínculo'}</b></div></div>
  <button class="link" onclick="openLink('inv','${cardId}','${due}')">Escolher o recebimento desta fatura</button>
  <div class="eyebrow" style="margin-top:14px">Compras desta fatura · ${items.length}</div><div class="card" style="margin:0">${items.length ? items.map(txRow).join('') : empty('receipt', 'Sem compras', '')}</div>
  <div style="height:16px"></div>${inv.remainingCents > 0 ? `<button class="btn" onclick="openPayInvoice('${cardId}','${due}')">Pagar fatura</button>` : ''}`);
};

const notice = (title, msg, fn) => { window._nfn = fn || null; sheet(`<h2>${esc(title)}</h2><p class="lead" style="font-size:15px;color:var(--tx);line-height:1.5">${esc(msg)}</p><button class="btn" onclick="const f=window._nfn;closeSheet();if(f)f()">Entendi</button>`); };
window.openPurchase = (pid, txid) => {
  const p = S.purchases.find((x) => x.id === pid); if (!p) return openTxPlain(txid);
  const rows = E.purchaseInstallments(S, pid), act = rows.filter((r) => !r.cancelled), cancelled = p.status === 'cancelled', refunds = E.purchaseRefunds(S, pid), dis = cancelled ? 'disabled' : '';
  const lock = act.some((r) => r.lock), inst = rows.map((r) => { const st = r.cancelled ? ['Cancelada', 'bad'] : r.lock === 'paid' ? ['Fatura paga', 'ok'] : r.invoiceStatus === 'closed' ? ['Fatura fechada', 'warn'] : ['Fatura aberta', '']; return `<div class="chg" ${r.cancelled ? 'style="opacity:.55"' : ''}><div><b>${p.installments > 1 ? 'Parcela ' + r.no + '/' + r.of : 'À vista'}</b><small>vence ${fd(r.tx.invoiceDue)} · <span class="pill ${st[1]}">${st[0]}</span></small></div><b>${brl(r.tx.amountCents)}</b></div>`; }).join('');
  const hist = (p.history || []).slice().reverse().map((h) => new Date(h.at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) + ' · ' + esc(h.what)).join('<br>');
  sheet(`<h2>${cancelled ? 'Compra cancelada' : 'Compra no cartão'}</h2><p class="lead">${esc(p.desc)} · ${brl(p.totalCents)}${p.installments > 1 ? ' em ' + p.installments + 'x' : ' à vista'}</p>
  <div class="card" style="margin:0 0 4px"><div class="sub" style="padding-top:14px"><span>${p.installments > 1 ? 'Parcelas e faturas' : 'Fatura'}</span></div><div style="padding:0 18px 8px">${inst}</div></div>
  ${refunds.length ? `<div class="note">Estornos: ${refunds.map((t) => brl(t.amountCents) + ' em ' + fd(t.purchaseDate)).join(', ')}</div>` : ''}
  ${F('Descrição', `<input id="pu-desc" value="${esc(p.desc)}" ${dis}>`)}
  ${F('Estabelecimento', `<input id="pu-merch" value="${esc(p.merchant || '')}" placeholder="Ex.: Magazine Luiza" ${dis}>`)}
  ${F('Valor total', `<input id="pu-total" inputmode="decimal" value="${moneyIn(p.totalCents)}" ${dis}>`)}
  <div class="two2">${F('Parcelas', `<input id="pu-n" type="number" min="1" max="48" inputmode="numeric" value="${p.installments}" ${dis}>`)}${F('Data da compra', `<input id="pu-date" type="date" value="${p.date}" ${dis}>`)}</div>
  ${lock && !cancelled ? '<div class="hint" style="font-size:12.5px;color:var(--mut);margin-top:6px">Parcelas de fatura paga ou fechada não são alteradas automaticamente. Você verá o impacto antes de confirmar.</div>' : ''}
  ${F('Categoria', `<select id="pu-cat" ${dis}>${catOpts('expense', p.categoryId)}</select>`)}
  ${F('Cartão', `<select id="pu-card" ${dis}>${S.cards.map((c) => `<option value="${c.id}" ${c.id === p.cardId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>`)}
  ${F('Observações', `<textarea id="pu-notes" rows="2" placeholder="Anotações sobre esta compra" ${dis}>${esc(p.notes || '')}</textarea>`)}
  <details class="how" style="padding:14px 0 0"><summary>Histórico de alterações · ${(p.history || []).length}</summary><div style="margin-top:8px">${hist}</div></details>
  <div style="height:20px"></div>${cancelled ? `<button class="btn ghost" onclick="closeSheet()">Fechar</button><div style="height:10px"></div><button class="link" style="color:var(--bad)" onclick="deletePurchase('${pid}')">Excluir compra por completo</button>` : `<button class="btn" onclick="savePurchase('${pid}')">Salvar alterações</button><div style="height:10px"></div><button class="btn ghost" onclick="closeSheet()">Cancelar</button><div style="height:6px"></div><div style="display:flex;justify-content:space-between"><button class="link" onclick="openRefund('${pid}')">Registrar estorno</button><button class="link" style="color:var(--bad)" onclick="deletePurchase('${pid}')">Excluir compra</button></div>`}`);
};
window.savePurchase = (pid) => {
  try {
    const p = S.purchases.find((x) => x.id === pid), tc = E.toCents(val('pu-total'));
    const patch = { desc: val('pu-desc').trim(), merchant: val('pu-merch').trim(), notes: val('pu-notes'), categoryId: val('pu-cat') || null, cardId: val('pu-card'), date: val('pu-date'), installments: parseInt(val('pu-n'), 10), totalCents: tc };
    if (!patch.desc) throw new Error('Diga o que foi a compra.');
    if (!Number.isInteger(tc) || tc <= 0) throw new Error('Informe um valor total maior que zero.');
    if (!(patch.installments >= 1 && patch.installments <= 48)) throw new Error('Parcelas: de 1 a 48.');
    if (!patch.date) throw new Error('Informe a data da compra.');
    const same = patch.desc === p.desc && patch.merchant === (p.merchant || '') && patch.notes.trim() === (p.notes || '') && (patch.categoryId || null) === (p.categoryId || null) && tc === p.totalCents && patch.installments === p.installments && patch.date === p.date && patch.cardId === p.cardId;
    if (same) return toast('Nada foi alterado.');
    window._pp = { pid, patch, allow: false };
    if (!E.previewPurchaseEdit(S, pid, patch).financial) { E.applyPurchaseEdit(S, pid, patch); save(); closeSheet(); toast('Compra atualizada'); return render(); }
    showImpact(false);
  } catch (e) { toast(e.message); }
};
window.showImpact = (allow) => {
  const { pid, patch } = window._pp, p = S.purchases.find((x) => x.id === pid); window._pp.allow = !!allow;
  const pv = E.previewPurchaseEdit(S, pid, patch, { allowClosed: !!allow });
  if (pv.blocked && !pv.needsClosedOk) return notice('Não foi possível alterar', pv.blocked, () => openPurchase(pid));
  if (pv.blocked) return sheet(`<h2>Fatura fechada</h2><p class="lead" style="font-size:15px;color:var(--tx);line-height:1.5">${esc(pv.blocked)}</p><div class="note warn">Alterar uma fatura fechada muda um valor que você pode já ter conferido ou pago. A alteração fica registrada no histórico.</div><div style="height:18px"></div><button class="btn" onclick="showImpact(true)">Autorizar e ver o impacto</button><div style="height:10px"></div><button class="btn ghost" onclick="openPurchase('${pid}')">Voltar e editar</button>`);
  const line = (pl) => {
    const n = pl.no, of = pv.newN, lbl = of > 1 ? `Parcela ${n}/${of}` : 'Compra';
    if (pl.action === 'keep') return `<div class="chg"><div><b>${lbl}</b><small>mantida (${pl.lock === 'paid' ? 'fatura paga' : 'fatura fechada'}) · fatura ${fd(pl.to.invoiceDue)}</small></div><b>${brl(pl.to.amountCents)}</b></div>`;
    if (pl.action === 'same') return '';
    if (pl.action === 'add') return `<div class="chg"><div><b>Nova ${lbl.toLowerCase()}</b><small>fatura ${fd(pl.to.invoiceDue)}</small></div><b class="pos">+${brl(pl.to.amountCents)}</b></div>`;
    if (pl.action === 'remove') return `<div class="chg"><div><b>${pv.oldN > 1 ? 'Parcela ' + n + '/' + pv.oldN : 'Compra'}</b><small>será cancelada (continua no histórico)</small></div><b class="neg">−${brl(pl.from.amountCents)}</b></div>`;
    return `<div class="chg"><div><b>${lbl}</b><small>${pl.from.invoiceDue !== pl.to.invoiceDue ? `fatura ${fd(pl.from.invoiceDue)} → ${fd(pl.to.invoiceDue)}` : 'fatura ' + fd(pl.to.invoiceDue)}${pl.lock === 'closed' ? ' · fatura fechada' : ''}</small></div><b>${brl(pl.from.amountCents)} → ${brl(pl.to.amountCents)}</b></div>`;
  };
  const other = [];
  if (patch.desc !== p.desc) other.push('Descrição: ' + esc(p.desc) + ' → ' + esc(patch.desc));
  if (patch.merchant !== (p.merchant || '')) other.push('Estabelecimento alterado');
  if ((patch.categoryId || null) !== (p.categoryId || null)) other.push('Categoria: ' + esc(catName(p.categoryId)) + ' → ' + esc(catName(patch.categoryId)));
  sheet(`<h2>Confirmar alteração</h2><p class="lead">Veja o que muda antes de salvar.</p>
  <div class="card" style="margin:0 0 12px"><div class="stat"><span>Valor total</span><b>${brl(pv.oldTotal)}${pv.newTotal !== pv.oldTotal ? ' → ' + brl(pv.newTotal) : ''}</b></div><div class="stat"><span>Parcelas</span><b>${pv.oldN}x${pv.newN !== pv.oldN ? ' → ' + pv.newN + 'x' : ''}</b></div></div>
  <div class="eyebrow" style="margin:14px 2px 4px">Parcelas</div><div class="card" style="margin:0 0 12px;padding:4px 16px">${pv.plan.map(line).join('') || '<div class="empty">Sem mudanças nas parcelas.</div>'}</div>
  <div class="eyebrow" style="margin:14px 2px 4px">Faturas afetadas</div><div class="card" style="margin:0 0 12px;padding:4px 16px">${pv.impact.length ? pv.impact.map((i) => `<div class="chg"><div><b>Fatura ${fd(i.dueDate)}</b><small>${ST[i.status] ? ST[i.status][0] : ''}</small></div><b class="${i.deltaCents > 0 ? 'neg' : 'pos'}">${i.deltaCents > 0 ? '+' : '−'}${brl(Math.abs(i.deltaCents))}</b></div>`).join('') : '<div class="empty">Nenhuma fatura muda de valor.</div>'}</div>
  ${other.length ? `<div class="note">Também será salvo: ${other.join(' · ')}</div>` : ''}
  ${pv.warnings.map((w) => `<div class="note warn">${esc(w)}</div>`).join('')}
  ${pv.hasClosed && !allow ? `<div class="note">Há parcela em fatura fechada. Ela foi mantida. <button class="link" style="padding:0;text-decoration:underline" onclick="showImpact(true)">Incluir também a fechada</button></div>` : ''}${pv.hasClosed && allow ? `<div class="note">Você autorizou alterar fatura fechada. <button class="link" style="padding:0;text-decoration:underline" onclick="showImpact(false)">Manter as fechadas</button></div>` : ''}
  <div style="height:18px"></div><button class="btn" onclick="confirmPurchaseEdit()">Confirmar alteração</button><div style="height:10px"></div><button class="btn ghost" onclick="openPurchase('${pid}')">Voltar e editar</button>`);
};
window.confirmPurchaseEdit = () => { try { const { pid, patch, allow } = window._pp; E.applyPurchaseEdit(S, pid, patch, { allowClosed: allow }); save(); closeSheet(); toast('Compra atualizada'); render(); } catch (e) { toast(e.message); } };
window.deletePurchase = (pid) => {
  const pv = E.previewPurchaseDelete(S, pid); if (pv.blocked) return notice('Não é possível excluir', pv.blocked, () => openPurchase(pid));
  ask(`Excluir esta compra por completo? ${pv.count} parcela${pv.count === 1 ? '' : 's'}${pv.refunds ? ' e ' + pv.refunds + ' estorno' + (pv.refunds === 1 ? '' : 's') : ''} somem das faturas e do histórico de gastos, sem deixar valor nenhum. Isso não pode ser desfeito.${pv.closed ? ' Atenção: há parcela em fatura já fechada.' : ''}`, () => { try { E.deletePurchase(S, pid, { allowClosed: true }); save(); closeSheet(); toast('Compra excluída por completo'); render(); } catch (e) { toast(e.message); } }, 'Excluir por completo');
};
window.openRefund = (pid) => { const left = E.refundable(S, pid); if (left <= 0) return notice('Sem saldo para estorno', 'Esta compra já foi estornada por inteiro.', () => openPurchase(pid)); sheet(`<h2>Registrar estorno</h2><p class="lead">O valor volta como crédito na fatura e reduz o gasto. Não mexe no saldo das suas contas. Restam ${brl(left)} para estornar.</p>${F('Valor estornado', `<input id="rf-v" inputmode="decimal" value="${moneyIn(left)}">`)}${F('Data do estorno', `<input id="rf-d" type="date" value="${E.today()}">`)}<div style="height:22px"></div><button class="btn" onclick="saveRefund('${pid}')">Registrar estorno</button><div style="height:10px"></div><button class="btn ghost" onclick="openPurchase('${pid}')">Voltar</button>`); };
window.saveRefund = (pid) => { try { E.refundPurchase(S, pid, { amountCents: E.toCents(val('rf-v')), date: val('rf-d') }); save(); closeSheet(); toast('Estorno registrado'); render(); } catch (e) { toast(e.message); } };

let projDays = 30;
function catSummary() {
  const spent = E.byCategory(S, month, ctx()), bs = E.budgetStatus(S, month, ctx());
  const cats = S.categories.filter((c) => c.kind === 'expense'), lim = (c) => S.budgets[month + '|' + c.id] || 0;
  const list = cats.filter((c) => lim(c) || spent[c.id] > 0).sort((x, y) => (spent[y.id] || 0) - (spent[x.id] || 0));
  const totS = cats.reduce((t, c) => t + (spent[c.id] || 0), 0), totL = cats.reduce((t, c) => t + lim(c), 0), left = totL - totS;
  const planCat = E.planCategoryBudgets(S), canFill = E.planItems(S).length && Object.keys(planCat).some((c) => S.budgets[month + '|' + c] !== planCat[c]);
  const row = (c) => { const used = spent[c.id] || 0, b = lim(c), pct = b ? Math.round(used * 100 / b) : 0, over = b && used > b;
    return `<div class="row" onclick="setBudget('${c.id}')"><div class="sq">${catIcon(c.id)}</div><div class="m"><b>${esc(c.name)}</b>${b ? `<div class="bar"><i style="width:${Math.min(100, pct)}%;${pct >= 100 ? 'background:var(--bad)' : pct >= 70 ? 'background:var(--warn)' : ''}"></i></div><small>${brl(used)} de ${brl(b)} · ${pct}%</small>` : `<small>${brl(used)} gastos · sem limite</small>`}</div>${b ? `<div class="a ${over ? 'bad' : ''}">${over ? '−' + brl(used - b) : brl(b - used)}<small style="display:block;font-size:11px;font-weight:700;color:var(--mut)">${over ? 'acima' : 'resta'}</small></div>` : ic('chevR', 'chev')}</div>`; };
  const rest = cats.filter((c) => !list.includes(c));
  return `<div class="eyebrow">Gasto por categoria<small>${MONTHS[+month.slice(5) - 1]}</small></div>${monthPicker()}
  <div class="card catsum"><div class="mini" style="padding-top:14px"><div><small>Gasto</small><b>${brl(totS)}</b></div><div><small>${left < 0 ? 'Acima do limite' : 'Ainda pode gastar'}</small><b class="${left < 0 ? 'neg' : 'pos'}">${totL ? brl(Math.abs(left)) : '—'}</b></div></div>
  ${list.length ? list.map(row).join('') : `<div class="empty" style="padding:18px">Nenhum gasto neste mês ainda.</div>`}
  ${rest.length ? `<div style="padding:8px 18px 14px"><button class="link" style="padding:0" onclick="openMoreCats()">+ Definir limite em outra categoria</button></div>` : ''}</div>
  ${canFill ? `<button class="btn ghost" style="margin-top:12px" onclick="fillBudgetsFromPlan()">Preencher limites com o meu orçamento</button>` : ''}
  <div class="foot" style="text-align:left">Avisamos quando uma categoria chegar a 70%, 90% e 100% do limite. Toque numa categoria para ajustar.</div>`;
}
window.fillBudgetsFromPlan = () => ask('Vou preencher o limite de cada categoria com a soma do seu orçamento (contas fixas e gastos variáveis dos dois recebimentos), neste mês e nos próximos 11. Limites que você já definiu não são alterados.', () => { const n = E.planFillBudgets(S, month, 12); save(); toast(n ? 'Limites preenchidos' : 'Nada novo para preencher'); render(); }, 'Preencher');
window.openMoreCats = () => { const rest = S.categories.filter((c) => c.kind === 'expense' && !S.budgets[month + '|' + c.id] && !(E.byCategory(S, month, ctx())[c.id] > 0)); sheet(`<h2>Escolha a categoria</h2><div class="card" style="margin:0">${rest.map((c) => `<div class="row" onclick="setBudget('${c.id}')"><div class="sq">${catIcon(c.id)}</div><div class="m"><b>${esc(c.name)}</b></div>${ic('chevR', 'chev')}</div>`).join('')}</div>`); };
function vPlan() {
  const n = projDays, proj = E.projection(S, n, ctx());
  const min = Math.min(...proj.map((p) => p.balanceCents)), neg = proj.find((p) => p.balanceCents < 0), last = proj[proj.length - 1].balanceCents;
  const W = 320, H = 130, vals = proj.map((p) => p.balanceCents), lo = Math.min(0, ...vals), hi = Math.max(1, ...vals), X = (i) => i / n * W, Y = (v) => H - (v - lo) / (hi - lo || 1) * (H - 16) - 8;
  const pts = proj.map((p, i) => X(i) + ',' + Y(p.balanceCents)).join(' ');
  return `${topbar()}${pageH('Planejamento', 'Quanto você gastou em cada categoria e o que vem pela frente.')}
  ${catSummary()}
  <div class="eyebrow" style="margin-top:26px">Projeção do saldo</div>
  <div class="card pad"><div class="lead" style="margin:0">Saldo projetado em ${n} dias</div><div style="margin:6px 0 0">${money(last)}</div>
  <div class="rng">${[7, 15, 30, 60, 90].map((d) => `<button class="${n === d ? 'on' : ''}" onclick="projDays=${d};render()">${d}d</button>`).join('')}</div>
  <svg viewBox="0 0 ${W} ${H}" width="100%" style="margin:8px 0"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1)" stop-opacity=".45"/><stop offset="1" style="stop-color:var(--c1)" stop-opacity="0"/></linearGradient></defs>${[0, .25, .5, .75, 1].map((f) => `<line x1="0" x2="${W}" y1="${8 + f * (H - 16)}" y2="${8 + f * (H - 16)}" stroke="var(--line)" stroke-dasharray="1 5" stroke-linecap="round"/>`).join('')}<line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--bad)" stroke-opacity=".5" stroke-dasharray="4 4"/><polygon fill="url(#ga)" points="0,${H} ${pts} ${W},${H}"/><polyline fill="none" stroke="var(--tx)" stroke-width="2.4" stroke-linejoin="round" points="${pts}"/></svg>
  <div style="font-size:14px;font-weight:700" class="${neg ? 'neg' : 'pos'}">${neg ? 'Atenção: saldo negativo previsto em ' + fd(neg.date) + '.' : 'Saldo positivo no período. Menor ponto: ' + brl(min) + '.'}</div></div>`;
}
window.setBudget = (cid) => sheet(`<h2>${esc(catName(cid))}</h2><p class="lead">Limite de gasto para ${MONTHS[+month.slice(5) - 1].toLowerCase()}.</p>${F('Quanto quer gastar?', `<input id="b-v" inputmode="decimal" placeholder="R$ 0,00" value="${moneyIn(S.budgets[month + '|' + cid])}">`)}<div style="height:22px"></div><button class="btn" onclick="S.budgets['${month}|${cid}']=E.toCents(val('b-v'));save();closeSheet();render()">Salvar</button>`);

function vRel() {
  const cur = E.byCategory(S, month, ctx()), prev = E.byCategory(S, E.addMonths(month + '-01', -1).slice(0, 7), ctx()), tot = Object.values(cur).filter((x) => x > 0).reduce((a, b) => a + b, 0), ser = E.monthSeries(S, month, 6, ctx()), mx = Math.max(1, ...ser.flatMap((s) => [s.income, s.expense]));
  const rows = Object.entries(cur).filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]), nw = E.netWorth(S, ctx()), mn = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${topbar()}${pageH('Relatórios', 'Entenda para onde o dinheiro está indo.')}${monthPicker()}
  <div class="card pad"><b>Entradas e saídas</b><div class="lead" style="margin:2px 0 0">Últimos 6 meses</div><svg viewBox="0 0 320 120" width="100%" style="margin-top:10px">${ser.map((s, i) => { const x = i * 53 + 6; return `<rect x="${x}" y="${100 - s.income / mx * 85}" width="19" height="${Math.max(2, s.income / mx * 85)}" rx="5" fill="var(--ok)"/><rect x="${x + 21}" y="${100 - s.expense / mx * 85}" width="19" height="${Math.max(2, s.expense / mx * 85)}" rx="5" fill="var(--c1)"/><text x="${x + 20}" y="115" text-anchor="middle">${mn[+s.month.slice(5) - 1]}</text>`; }).join('')}</svg><div class="lead" style="margin-top:6px"><span class="pos">■</span> recebido &nbsp; <span style="color:var(--c1)">■</span> gasto</div></div>
  <div class="eyebrow">Gastos por categoria · ${brl(tot)}</div><div class="card">${rows.length ? rows.map(([k, v]) => { const p = prev[k] || 0, d = p ? Math.round((v - p) / p * 100) : null; return `<div class="row" style="cursor:default"><div class="sq">${catIcon(k)}</div><div class="m"><div style="display:flex;justify-content:space-between"><b>${esc(catName(k))}</b><b>${brl(v)}</b></div><div class="bar"><i style="width:${Math.round(v / tot * 100)}%"></i></div><small>${Math.round(v / tot * 100)}% do total${d !== null ? ' · ' + (d >= 0 ? '+' : '') + d + '% vs. mês anterior' : ''}</small></div></div>`; }).join('') : empty('chart', 'Sem gastos neste mês', 'Os gráficos aparecem conforme você registra.')}</div>
  <div class="eyebrow">Patrimônio</div><div class="card"><div class="stat"><span>Em contas</span><b>${brl(nw.assetsCents)}</b></div><div class="stat"><span>Faturas em aberto</span><b>−${brl(nw.liabilitiesCents)}</b></div><div class="stat total"><span>Patrimônio líquido</span><b class="${nw.netCents < 0 ? 'neg' : ''}">${brl(nw.netCents)}</b></div></div><div class="foot" style="text-align:left">Investimentos e bens entram em uma próxima fase.</div>`;
}


// ───── casal: resumo do par (só leitura). Os lançamentos de cada um nunca saem da conta do dono.
let couple = { loaded: false, shares: [], theirs: null, who: 'casal', err: null, busy: false };
const lc = (x) => String(x || '').toLowerCase();
const myEmail = () => lc(user && user.email);
const cOut = () => couple.shares.find((x) => user && x.owner_id === user.id) || null;
const cIn = () => couple.shares.find((x) => user && x.owner_id !== user.id && lc(x.viewer_email) === myEmail()) || null;
const partnerEmail = () => { const i = cIn(), o = cOut(); return i ? i.owner_email : o ? o.viewer_email : ''; };
let sumTimer = null;
function schedSummary() { clearTimeout(sumTimer); if (!CLOUD || !user || !cOut()) return; sumTimer = setTimeout(pushSummary, 4000); }
async function pushSummary() {
  if (!CLOUD || !user) return;
  try { await sb.from('summaries').upsert({ user_id: user.id, owner_email: user.email, name: S.profile.name, data: E.coupleSummary(S, E.today()), updated_at: new Date().toISOString() }); } catch (e) {}
}
async function loadCouple() {
  if (!CLOUD || !user) return;
  try {
    const r = await sb.from('shares').select('*'); if (r.error) throw r.error;
    couple.shares = r.data || []; couple.theirs = null;
    const pend = couple.shares.find((x) => !x.accepted && x.owner_id !== user.id && lc(x.viewer_email) === myEmail() && couple.shares.some((o) => o.owner_id === user.id && lc(o.viewer_email) === lc(x.owner_email)));
    if (pend) { await sb.rpc('accept_share', { p_id: pend.id }); const r2 = await sb.from('shares').select('*'); if (!r2.error) couple.shares = r2.data || []; }
    const inc = couple.shares.find((x) => x.accepted && x.owner_id !== user.id && lc(x.viewer_email) === myEmail());
    if (inc) { const s = await sb.from('summaries').select('data').eq('user_id', inc.owner_id).maybeSingle(); if (s.data) couple.theirs = s.data.data; }
    couple.err = null; if (cOut()) pushSummary();
  } catch (e) { couple.err = 'Não foi possível carregar o resumo do casal. Confira se o SQL do casal foi executado no Supabase.'; }
  couple.loaded = true; if (tab === 'casal' && !$('#sheetbg')) render();
}
const cName = (w) => w === 'me' ? 'Eu' : ((couple.theirs && couple.theirs.name) || 'Par').split(' ')[0];
function vCasal() {
  const head = `${topbar()}${pageH('Casal', 'O resumo de vocês dois, só para ler.', CLOUD && user ? `<button class="link" onclick="openShare()">Compartilhar</button>` : '')}`;
  if (!CLOUD || !user) return `${head}<div class="card" style="padding:20px"><h3 style="margin:0 0 8px">Entre com sua conta</h3><p class="lead" style="margin:0">O resumo do casal usa o login de cada um. Ele aparece aqui quando você entra com seu e-mail e senha.</p></div>`;
  if (!couple.loaded) { loadCouple(); return `${head}<div class="card" style="padding:20px"><p class="lead" style="margin:0">Carregando…</p></div>`; }
  if (couple.err) return `${head}<div class="note bad">${esc(couple.err)}</div><button class="btn ghost" style="margin-top:12px" onclick="couple.loaded=false;render()">Tentar de novo</button>`;
  const inc = cIn(), out = cOut();
  const pend = inc && !inc.accepted ? `<div class="card" style="padding:18px"><b style="font-size:16px">${esc(inc.owner_email)} quer compartilhar o resumo com você</b><p class="lead" style="margin:6px 0 14px">Você verá só totais por categoria, renda, saldo e contas a vencer. Nunca as compras.</p><button class="btn" onclick="acceptShare('${inc.id}',true)">Aceitar e compartilhar o meu também</button><div style="height:8px"></div><button class="btn ghost" onclick="acceptShare('${inc.id}',false)">Aceitar sem compartilhar o meu</button><div style="height:8px"></div><button class="btn ghost" onclick="stopShare('${inc.id}')">Recusar</button></div>` : '';
  if (!couple.theirs) {
    const wait = out && !out.accepted ? `<div class="card" style="padding:18px"><b style="font-size:16px">Convite enviado</b><p class="lead" style="margin:6px 0 0">Aguardando ${esc(out.viewer_email)} aceitar. Seu par precisa entrar no app com esse e-mail.</p></div>` : '';
    const accWait = inc && inc.accepted ? `<div class="card" style="padding:18px"><b style="font-size:16px">Aguardando o primeiro resumo</b><p class="lead" style="margin:6px 0 0">${esc(inc.owner_email)} ainda não enviou dados. Peça para abrir o app uma vez.</p></div>` : '';
    const empty = !pend && !wait && !accWait ? `<div class="card" style="padding:20px"><h3 style="margin:0 0 8px">Veja as finanças dos dois</h3><p class="lead" style="margin:0 0 16px">Convide seu par pelo e-mail. Cada um continua com o próprio login e os próprios dados. Vocês só trocam o resumo, para leitura.</p><button class="btn" onclick="openShare()">Convidar meu par</button></div>` : '';
    return `${head}${pend}${wait}${accWait}${empty}`;
  }
  const mine = E.coupleSummary(S, E.today()), who = couple.who || 'casal', ym = month;
  const mg = E.coupleMerge(mine, couple.theirs, ym);
  const seg = `<div class="seg" role="group" aria-label="Quem ver">${[['me', 'Eu'], ['other', cName('other')], ['casal', 'Casal']].map(([k, l]) => `<button class="${who === k ? 'on' : ''}" aria-pressed="${who === k}" onclick="couple.who='${k}';render()">${esc(l)}</button>`).join('')}</div>`;
  if (!mg) return `${head}${pend}${monthPicker()}${seg}<div class="note">O resumo de ${MONTHS[+ym.slice(5) - 1].toLowerCase()} não está disponível. Ele cobre o mês anterior, o atual e o próximo.</div>`;
  const pd = mine.payDays, pk = who === 'casal' ? null : (who === 'me' ? mg.a : mg.b);
  const pdO = (couple.theirs.payDays || pd);
  const tot = pk ? pk : { incomeCents: mg.incomeCents, plannedCents: mg.plannedCents, spentCents: mg.spentCents, balanceCents: mg.balanceCents };
  const label = who === 'casal' ? 'Sobra do casal no mês' : 'Sobra de ' + (who === 'me' ? 'você' : cName('other')) + ' no mês';
  const hero = `<div class="glass sobrar" style="margin-bottom:12px"><div><div class="t">${label}</div><div class="v">${partMoney(tot.balanceCents)}</div><small>Renda ${brl(tot.incomeCents)} · Planejado ${brl(tot.plannedCents)}</small></div></div>`;
  const per = (m, i) => m.periods[i];
  let income;
  if (who === 'casal') {
    const r = (i) => { const a = per(mg.a, i), b = per(mg.b, i); return `<tr><td>Dia ${a.day}${b.day !== a.day ? ' / ' + b.day : ''}</td><td>${brl(a.incomeCents)}</td><td>${brl(b.incomeCents)}</td><td>${brl(a.incomeCents + b.incomeCents)}</td></tr>`; };
    income = `<table class="cmp"><thead><tr><th>Renda</th><th>${esc(cName('me'))}</th><th>${esc(cName('other'))}</th><th>Total</th></tr></thead><tbody>${r(0)}${r(1)}<tr class="tot"><td>Mês</td><td>${brl(mg.a.incomeCents)}</td><td>${brl(mg.b.incomeCents)}</td><td>${brl(mg.incomeCents)}</td></tr></tbody></table>`;
  } else {
    const m = pk, row = (l, f, cls = '', t = false) => `<tr class="${t ? 'tot' : ''}"><td>${l}</td><td class="${cls}">${brl(f(m.periods[0]))}</td><td class="${cls}">${brl(f(m.periods[1]))}</td><td class="${cls}">${brl(f(m.periods[0]) + f(m.periods[1]))}</td></tr>`;
    income = `<table class="cmp"><thead><tr><th></th><th>Dia ${m.periods[0].day}</th><th>Dia ${m.periods[1].day}</th><th>Mês</th></tr></thead><tbody>${row('Renda', (p) => p.incomeCents)}${row('Planejado', (p) => p.plannedCents)}${row('Já pago', (p) => p.paidCents, 'pos')}${row('Sobra', (p) => p.balanceCents, '', true)}</tbody></table>`;
  }
  const cats = mg.cats.filter((c) => who === 'casal' ? c.me + c.other > 0 : (who === 'me' ? c.me : c.other) > 0).slice(0, 8);
  const catHtml = !cats.length ? `<div class="alert info">${ic('info')}<span>Ainda não há gastos neste mês.</span></div>` : who === 'casal'
    ? `<table class="cmp"><thead><tr><th>Categoria</th><th>${esc(cName('me'))}</th><th>${esc(cName('other'))}</th><th>Total</th></tr></thead><tbody>${cats.map((c) => `<tr><td>${esc(c.name)}</td><td>${brl(c.me)}</td><td>${brl(c.other)}</td><td>${brl(c.me + c.other)}</td></tr>`).join('')}<tr class="tot"><td>Gasto</td><td>${brl(mg.a.spentCents)}</td><td>${brl(mg.b.spentCents)}</td><td>${brl(mg.spentCents)}</td></tr></tbody></table>`
    : `<table class="cmp"><tbody>${cats.map((c) => `<tr><td>${esc(c.name)}</td><td>${brl(who === 'me' ? c.me : c.other)}</td></tr>`).join('')}<tr class="tot"><td>Gasto</td><td>${brl(who === 'me' ? mg.a.spentCents : mg.b.spentCents)}</td></tr></tbody></table>`;
  const today = E.today(), bl = mg.bills.filter((b) => who === 'casal' || b.who === who).slice(0, 10);
  const billHtml = !bl.length ? `<div class="alert info">${ic('info')}<span>Nenhuma conta a vencer nos próximos 45 dias.</span></div>` : bl.map((b) => { const z = hzOf({ dueDate: b.dueDate }, today), cls = z === 'late' ? 'bad' : z === 'week' ? 'warn' : ''; return `<div class="row" style="cursor:default"><div class="m"><b>${esc(b.desc)}</b><small class="${cls}">${who === 'casal' ? esc(cName(b.who)) + ' · ' : ''}${z === 'late' ? 'Atrasada · ' : ''}${fd(b.dueDate).slice(0, 5)}</small></div><span class="a ${cls}">${brl(b.cents)}</span></div>`; }).join('');
  const at = couple.theirs.at ? new Date(couple.theirs.at) : null, hh = at && !isNaN(at) ? at.toTimeString().slice(0, 5) : '';
  return `${head}${pend}${monthPicker()}${seg}${hero}
  <div class="eyebrow">Renda por recebimento</div><div class="card">${income}</div>
  <div class="eyebrow">Gasto por categoria</div><div class="card">${catHtml}</div>
  <div class="eyebrow">Contas a vencer</div><div class="card">${billHtml}</div>
  <div class="note" style="display:flex;gap:8px;align-items:center">${ic('eye')}<span>Só leitura. O resumo de ${esc(cName('other'))} foi atualizado ${hh ? 'às ' + hh : 'recentemente'}.</span></div>`;
}
window.openShare = () => {
  const o = cOut(), i = cIn();
  sheet(`<h2>Compartilhar com meu par</h2>
  ${o ? `<div class="chg"><span><b>${esc(o.viewer_email)}</b><small>${o.accepted ? 'Vê o seu resumo' : 'Convite enviado, aguardando aceitar'}</small></span><button class="link" onclick="stopShare('${o.id}')">${o.accepted ? 'Parar de compartilhar' : 'Cancelar convite'}</button></div>` : `${F('E-mail do seu par', '<input id="sh-e" type="email" inputmode="email" autocomplete="off" placeholder="nome@email.com">', 'Seu par precisa ter conta no app com esse e-mail.')}<div style="height:12px"></div><button class="btn" onclick="sendInvite()">Enviar convite</button>`}
  ${i && i.accepted ? `<div class="chg"><span><b>${esc(i.owner_email)}</b><small>Você vê o resumo dele(a)</small></span><button class="link" onclick="stopShare('${i.id}')">Deixar de ver</button></div>` : ''}
  <h4 style="margin:18px 0 6px">O que seu par vê</h4><p class="lead" style="margin:0">Renda, totais por categoria, saldo e contas a vencer. Não aparecem descrições de compras, valores de cartão nem os lançamentos.</p>`);
};
window.sendInvite = async () => {
  const e = lc(val('sh-e').trim()); if (!/^\S+@\S+\.\S+$/.test(e)) return toast('Informe um e-mail válido.'); if (e === myEmail()) return toast('Use o e-mail do seu par, não o seu.');
  const r = await sb.from('shares').insert({ owner_id: user.id, owner_email: user.email, viewer_email: e });
  if (r.error) return toast(String(r.error.code) === '23505' ? 'Você já convidou esse e-mail.' : 'Não foi possível enviar o convite.');
  await pushSummary(); await loadCouple(); closeSheet(); toast('Convite enviado'); render();
};
window.acceptShare = async (id, both) => {
  const i = couple.shares.find((x) => x.id === id); if (!i) return;
  const r = await sb.rpc('accept_share', { p_id: id }); if (r.error) return toast('Não foi possível aceitar o convite.');
  if (both && !cOut()) await sb.from('shares').insert({ owner_id: user.id, owner_email: user.email, viewer_email: lc(i.owner_email) });
  await pushSummary(); await loadCouple(); toast('Pronto'); render();
};
window.stopShare = (id) => ask('Parar este compartilhamento? O resumo deixa de aparecer para a outra pessoa.', async () => { const r = await sb.from('shares').delete().eq('id', id); if (r.error) return toast('Não foi possível parar agora.'); await loadCouple(); closeSheet(); render(); }, 'Parar');
function casalTile() {
  if (!CLOUD || !user) return '';
  return `<button class="glass orcq" onclick="go('casal')"><span class="sq">${ic('users')}</span><span class="t"><b>Casal</b><small>${couple.theirs ? 'Veja o resumo dos dois' : 'Compartilhe o resumo com seu par'}</small></span>${ic('chevR', 'chev')}</button>`;
}
function render() {
  if (!CLOUD || user) { $('#nav').style.display = ''; }
  renderNav(); $('#fab').style.display = tab === 'inicio' || tab === 'casal' ? 'none' : 'grid';
  $('#app').innerHTML = { inicio: vInicio, mov: vMov, contas: vContas, cartoes: vCartoes, plan: vPlan, rel: vRel, bancos: vBancos, rec: vRec, orc: vOrc, casal: vCasal }[tab]();
}
applyTheme(); initHide();
if (CFG_SET && !window.supabase) { $('#nav').style.display = 'none'; $('#app').innerHTML = '<div class="login"><h1>Sem conexão</h1><div class="lead">Não foi possível carregar o serviço de login. Verifique a internet e abra o app novamente. Seus dados continuam guardados.</div></div>'; } else if (CLOUD) { renderLoginSoon(); } else { fixState(); syncPref(); runMigrations(); initHide(); if (S.recurrences.length) { E.generateRecurring(S, E.today(), 12); save(); } render(); }
function renderLoginSoon() { S = E.newState(); fixState(); applyTheme(); bootCloud(); }
