/* FINANCE CONTROL — temas (design tokens). Uma única fonte de cores: nada de cor fixa espalhada no código. */
(function (root) {
  const T = {};
  // Superfícies e cores semânticas (iguais em todas as paletas: verde = positivo, vermelho = alerta)
  const BASE = {
    dark: { bg: '#05070F', bg2: '#0B1030', card: '#0E1327', tx: '#F4F6FF', mut: '#9AA4CB', line: 'rgba(255,255,255,.10)', seg: 'rgba(255,255,255,.08)', navbg: 'rgba(8,11,28,.86)', white: '#FFFFFF', onwhite: '#05070F', ok: '#43DDA6', okbg: 'rgba(67,221,166,.14)', warn: '#F4C46A', warnbg: 'rgba(244,196,106,.14)', bad: '#FF7A8E', badbg: 'rgba(255,122,142,.14)', shadow: 'none', ga: 0.55, gb: 0.25 },
    light: { bg: '#F2F4FA', bg2: '#E6ECFF', card: '#FFFFFF', tx: '#0B1030', mut: '#5B6385', line: '#E4E8F4', seg: '#E4E8F4', navbg: 'rgba(255,255,255,.92)', white: '#0B1030', onwhite: '#FFFFFF', ok: '#086B49', okbg: '#DDF4EA', warn: '#8F5A06', warnbg: '#FCEFD6', bad: '#C42843', badbg: '#FCE3E8', shadow: '0 1px 2px rgba(11,16,48,.05),0 8px 24px rgba(11,16,48,.05)', ga: 0.18, gb: 0.08 },
  };
  // Paletas: só a identidade cromática. rgb1/rgb2 alimentam brilho de fundo, vidro e destaques.
  T.palettes = {
    azul: { name: 'Azul profissional', desc: 'Corporativo, moderno e elegante', swatch: ['#3563FF', '#8C5BFF'],
      dark: { pri: '#3563FF', pri2: '#2A52E0', onpri: '#FFFFFF', link: '#8BAAFF', rgb1: '53,99,255', rgb2: '110,70,235', grad2: '#8C5BFF', c1: '#6F95FF', c2: '#8C5BFF', drawer: '#4B2DB5' },
      light: { pri: '#2F5BFF', pri2: '#2447D6', onpri: '#FFFFFF', link: '#2447D6', rgb1: '47,91,255', rgb2: '110,70,235', grad2: '#8C5BFF', c1: '#3563FF', c2: '#8C5BFF', drawer: '#4B2DB5' } },
    verde: { name: 'Verde financeiro', desc: 'Crescimento e organização', swatch: ['#0B8A5F', '#38BDF8'],
      dark: { pri: '#09795A', pri2: '#076348', onpri: '#FFFFFF', link: '#52E3B0', rgb1: '16,185,129', rgb2: '6,148,162', grad2: '#14B8A6', c1: '#38BDF8', c2: '#2DD4BF', drawer: '#0B5D42', bg: '#040D0A', bg2: '#062A1E', card: '#0A1A14' },
      light: { pri: '#0B7A55', pri2: '#08654A', onpri: '#FFFFFF', link: '#08654A', rgb1: '16,185,129', rgb2: '6,148,162', grad2: '#14B8A6', c1: '#0284C7', c2: '#0F766E', drawer: '#0B5D42', bg: '#F0F7F4', bg2: '#DDF2E8' } },
    roxo: { name: 'Roxo premium', desc: 'Sofisticado e marcante', swatch: ['#7C3AED', '#E879F9'],
      dark: { pri: '#7C3AED', pri2: '#6728D6', onpri: '#FFFFFF', link: '#C4B0FF', rgb1: '124,58,237', rgb2: '192,38,211', grad2: '#C026D3', c1: '#A78BFA', c2: '#F0ABFC', drawer: '#5B21B6', bg: '#07040F', bg2: '#1A0B38', card: '#120B22' },
      light: { pri: '#6D28D9', pri2: '#5B21B6', onpri: '#FFFFFF', link: '#5B21B6', rgb1: '124,58,237', rgb2: '192,38,211', grad2: '#C026D3', c1: '#7C3AED', c2: '#C026D3', drawer: '#5B21B6', bg: '#F6F2FC', bg2: '#EBE0FB' } },
    grafite: { name: 'Grafite', desc: 'Discreto e tecnológico', swatch: ['#64748B', '#CBD5E1'],
      dark: { pri: '#64748B', pri2: '#556376', onpri: '#FFFFFF', link: '#B4BECE', rgb1: '148,163,184', rgb2: '100,116,139', grad2: '#94A3B8', c1: '#94A3B8', c2: '#CBD5E1', drawer: '#1F2937', bg: '#09090B', bg2: '#17181C', card: '#131316', ga: 0.3, gb: 0.15 },
      light: { pri: '#475569', pri2: '#334155', onpri: '#FFFFFF', link: '#334155', rgb1: '71,85,105', rgb2: '100,116,139', grad2: '#64748B', c1: '#475569', c2: '#94A3B8', drawer: '#1F2937', bg: '#F3F4F6', bg2: '#E5E7EB', ga: 0.12, gb: 0.05 } },
    marinho: { name: 'Azul-marinho', desc: 'Executivo e sóbrio', swatch: ['#1D4ED8', '#0EA5E9'],
      dark: { pri: '#2557E0', pri2: '#1D47BD', onpri: '#FFFFFF', link: '#8DB7FF', rgb1: '37,99,235', rgb2: '14,116,144', grad2: '#0EA5E9', c1: '#60A5FA', c2: '#38BDF8', drawer: '#0B2A5B', bg: '#030A16', bg2: '#0A1B3D', card: '#0B1830' },
      light: { pri: '#1E40AF', pri2: '#1E3A8A', onpri: '#FFFFFF', link: '#1E3A8A', rgb1: '30,64,175', rgb2: '14,116,144', grad2: '#0EA5E9', c1: '#1D4ED8', c2: '#0284C7', drawer: '#0B2A5B', bg: '#EEF2F8', bg2: '#DCE6F5' } },
    claro: { name: 'Claro minimalista', desc: 'Limpo e leve', swatch: ['#111111', '#A3A3A3'],
      dark: { pri: '#F5F5F5', pri2: '#E0E0E0', onpri: '#111111', link: '#E5E5E5', rgb1: '255,255,255', rgb2: '160,160,160', cc1: '96,96,104', cc2: '60,60,68', grad2: '#A3A3A3', c1: '#A3A3A3', c2: '#D4D4D4', drawer: '#262626', bg: '#0B0B0B', bg2: '#161616', card: '#141414', ga: 0.1, gb: 0.05 },
      light: { pri: '#111111', pri2: '#000000', onpri: '#FFFFFF', link: '#111111', rgb1: '17,17,17', rgb2: '120,120,120', grad2: '#737373', c1: '#525252', c2: '#A3A3A3', drawer: '#1F1F1F', bg: '#FAFAFA', bg2: '#F0F0F0', line: '#E5E5E5', seg: '#EFEFEF', mut: '#585858', ga: 0.05, gb: 0.03 } },
  };
  T.order = ['azul', 'verde', 'roxo', 'grafite', 'marinho', 'claro'];
  T.modes = ['auto', 'light', 'dark'];
  T.resolveMode = (mode, prefersDark) => mode === 'light' ? 'light' : mode === 'dark' ? 'dark' : (prefersDark ? 'dark' : 'light');
  // gera TODAS as variáveis CSS de uma paleta num modo
  T.tokens = (pal, mode) => {
    const p = T.palettes[pal] || T.palettes.azul, m = mode === 'light' ? 'light' : 'dark', b = BASE[m], o = p[m], v = Object.assign({}, b, o);
    const a = (rgb, x) => `rgba(${rgb},${x})`;
    return {
      '--bg': v.bg, '--bg2': v.bg2, '--card': v.card, '--tx': v.tx, '--mut': v.mut, '--line': v.line, '--seg': v.seg, '--navbg': v.navbg,
      '--white': v.white, '--onwhite': v.onwhite, '--ok': v.ok, '--okbg': v.okbg, '--warn': v.warn, '--warnbg': v.warnbg, '--bad': v.bad, '--badbg': v.badbg, '--shadow': v.shadow,
      '--pri': v.pri, '--pri2': v.pri2, '--onpri': v.onpri, '--link': v.link, '--soft': a(v.rgb1, m === 'dark' ? 0.18 : 0.12), '--grad2': v.grad2, '--c1': v.c1, '--c2': v.c2, '--drawer': v.drawer,
      '--glow1': a(v.rgb1, v.ga), '--glow2': a(v.rgb2, v.gb), '--sheetglow': a(v.rgb1, m === 'dark' ? 0.25 : 0.1), '--fabshadow': a(v.rgb1, m === 'dark' ? 0.5 : 0.3),
      '--glass': m === 'dark' ? `linear-gradient(135deg,${a(v.rgb1, 0.38)},${a(v.rgb2, 0.22)})` : '#FFFFFF',
      '--glassline': m === 'dark' ? 'rgba(255,255,255,.12)' : v.line,
      '--cc': m === 'dark' ? `linear-gradient(135deg,${a(v.cc1 || v.rgb1, 0.62)},${a(v.cc2 || v.rgb2, 0.4)} 60%,rgba(255,255,255,.12))` : `linear-gradient(135deg,${v.pri},${v.drawer})`,
    };
  };
  T.ccStops = (pal, mode) => {
    const m = mode === 'light' ? 'light' : 'dark', p = T.palettes[pal], v = Object.assign({}, BASE[m], p[m]), mix = (c, al, over) => c.map((x, i) => Math.round(x * al + over[i] * (1 - al)));
    if (m === 'light') return [hex(v.pri), hex(v.drawer)];
    const bg = hex(v.bg), s1 = mix(v.cc1 ? v.cc1.split(',').map(Number) : v.rgb1.split(',').map(Number), 0.62, bg), s2 = mix(v.cc2 ? v.cc2.split(',').map(Number) : v.rgb2.split(',').map(Number), 0.4, bg);
    return [s1, s2, mix([255, 255, 255], 0.12, s2)];
  };
  T.apply = (doc, pal, mode, prefersDark) => {
    const m = T.resolveMode(mode, prefersDark), tk = T.tokens(pal, m), el = doc.documentElement;
    Object.keys(tk).forEach((k) => el.style.setProperty(k, tk[k]));
    el.dataset.theme = m; el.dataset.pal = T.palettes[pal] ? pal : 'azul';
    const mt = doc.querySelector('meta[name=theme-color]'); if (mt) mt.setAttribute('content', tk['--bg']);
    return m;
  };
  // ───── contraste (WCAG)
  const hex = (h) => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  const parse = (c, over) => { if (c[0] === '#') return hex(c); const m = c.match(/rgba?\(([^)]+)\)/)[1].split(',').map(Number); if (m.length === 4 && over) { const o = parse(over); return m.slice(0, 3).map((x, i) => Math.round(x * m[3] + o[i] * (1 - m[3]))); } return m.slice(0, 3); };
  T.lum = (rgb) => { const f = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
  T.contrast = (fg, bg, under) => { const B = parse(bg, under), F = parse(fg, bg[0] === '#' ? bg : under || '#000000'); const l1 = T.lum(F), l2 = T.lum(B); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  if (typeof module !== 'undefined') module.exports = T; else root.FCT = T;
})(typeof window !== 'undefined' ? window : globalThis);
