/* FINANCE CONTROL — motor financeiro (valores em CENTAVOS inteiros, nunca float) */
(function (root) {
  const E = {};

  // ───── utilidades
  E.uid = () => 'x' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  E.toCents = (v) => {
    if (typeof v === 'number') return Math.round(v * 100);
    let s = String(v).replace(/[^\d,.-]/g, '');
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    const n = Number(s);
    return isNaN(n) ? NaN : Math.round(n * 100);
  };
  E.brl = (c) => {
    const neg = c < 0, a = Math.abs(c);
    const r = Math.floor(a / 100), cents = String(a % 100).padStart(2, '0');
    return (neg ? '-' : '') + 'R$ ' + String(r).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + cents;
  };
  const pad = (n) => String(n).padStart(2, '0');
  E.fmtDate = (d) => d ? d.slice(8, 10) + '/' + d.slice(5, 7) + '/' + d.slice(0, 4) : '';
  E.today = () => { if (E._fixed) return E._fixed; const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  E.ym = (d) => d.slice(0, 7);
  E.daysInMonth = (y, m) => new Date(y, m, 0).getDate();
  E.addMonths = (d, n) => {
    const y = +d.slice(0, 4), m = +d.slice(5, 7) - 1, day = +d.slice(8, 10);
    const t = y * 12 + m + n, ny = Math.floor(t / 12), nm = t % 12 + 1;
    return ny + '-' + pad(nm) + '-' + pad(Math.min(day, E.daysInMonth(ny, nm)));
  };
  E.addDays = (d, n) => {
    const dt = new Date(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10) + n);
    return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
  };
  E.endOfMonth = (d) => d.slice(0, 8) + pad(E.daysInMonth(+d.slice(0, 4), +d.slice(5, 7)));
  E.diffDays = (a, b) => Math.round((Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10)) - Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10))) / 864e5);

  // divide centavos sem perder nenhum (o resto vai para as primeiras parcelas)
  E.splitCents = (total, n) => {
    const base = Math.floor(total / n), rest = total - base * n;
    return Array.from({ length: n }, (_, i) => base + (i < rest ? 1 : 0));
  };

  // ───── estado
  E.newState = () => ({
    schema: 2, profile: { name: 'Renan', mode: 'dark', palette: 'azul' },
    settings: { payDays: [10, 25] }, invoiceFund: {}, purchases: [], plan: { income: [0, 0], items: [], done: {} },
    accounts: [], cards: [], categories: defaultCategories(), tx: [], budgets: {}, recurrences: [], log: [],
  });
  function defaultCategories() {
    const ex = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Família', 'Veículos', 'Despesas profissionais', 'Outros'];
    const inc = ['Salário', 'Serviços', 'Rendimentos', 'Outros'];
    return ex.map((n) => ({ id: 'e_' + n, name: n, kind: 'expense' })).concat(inc.map((n) => ({ id: 'i_' + n, name: n, kind: 'income' })));
  }

  E.addAccount = (s, { name, openingCents = 0, type = 'checking', context = 'personal' }) => {
    if (!name || !name.trim()) throw new Error('Dê um nome para a conta.');
    if (s.accounts.some((a) => a.name.toLowerCase() === name.trim().toLowerCase() && a.context === context)) throw new Error('Você já tem uma conta com esse nome.');
    const a = { id: E.uid(), name: name.trim(), type, openingCents, context, archived: false };
    s.accounts.push(a); return a;
  };
  E.addCard = (s, { name, limitCents, closingDay, dueDay, accountId, context = 'personal' }) => {
    if (!name) throw new Error('Dê um nome para o cartão.');
    if (!(closingDay >= 1 && closingDay <= 28 && dueDay >= 1 && dueDay <= 28)) throw new Error('Dias de fechamento e vencimento devem estar entre 1 e 28.');
    const c = { id: E.uid(), name, limitCents, closingDay, dueDay, accountId, context };
    s.cards.push(c); return c;
  };

  // ───── fatura: em qual vencimento cai uma compra?
  E.invoiceFor = (card, purchaseDate) => {
    const day = +purchaseDate.slice(8, 10);
    let closing = purchaseDate.slice(0, 8) + '01';
    if (day > card.closingDay) closing = E.addMonths(closing, 1);
    const closingDate = closing.slice(0, 8) + pad(card.closingDay);
    let due = closing.slice(0, 8) + pad(card.dueDay);
    if (card.dueDay <= card.closingDay) due = E.addMonths(due, 1);
    return { cardId: card.id, dueDate: due, closingDate };
  };

  const hist = (t, what) => { (t.history = t.history || []).push({ at: new Date().toISOString(), what }); };
  const phist = (p, what) => { (p.history = p.history || []).push({ at: new Date().toISOString(), what }); };
  const PK = /^\d{4}-\d{2}\|[12]$/;
  const checkPk = (pk) => { if (!PK.test(pk || '')) throw new Error('Período de recebimento inválido.'); };
  const base = (s, o) => ({
    id: E.uid(), context: o.context || 'personal', desc: (o.desc || '').trim(), categoryId: o.categoryId || null,
    purchaseDate: o.date || E.today(), dueDate: o.dueDate || null, paidDate: null, status: 'pending', notes: o.notes || '', history: [],
  });
  const needAmount = (c) => { if (!Number.isInteger(c) || c <= 0) throw new Error('Informe um valor maior que zero.'); };

  // possível duplicidade (mesmo valor, descrição e data)
  E.findDuplicate = (s, o) => s.tx.find((t) => t.status !== 'cancelled' && t.kind === o.kind && t.amountCents === o.amountCents &&
    t.desc.toLowerCase() === (o.desc || '').trim().toLowerCase() && t.purchaseDate === (o.date || E.today()) && !t.installmentGroup);

  // ───── lançar receita
  E.addIncome = (s, o) => {
    needAmount(o.amountCents);
    const t = Object.assign(base(s, o), { kind: 'income', amountCents: o.amountCents, accountId: o.accountId, dueDate: o.dueDate || o.date || E.today() });
    if (!t.accountId) throw new Error('Escolha a conta que recebe.');
    if (o.slot === 1 || o.slot === 2) t.slot = o.slot;
    if (o.received) { t.status = 'paid'; t.paidDate = o.paidDate || E.today(); t.paidCents = o.amountCents; }
    s.tx.push(t); hist(t, 'criada'); return t;
  };

  // ───── lançar despesa (conta ou cartão, à vista ou parcelada)
  E.addExpense = (s, o) => {
    needAmount(o.amountCents);
    const n = o.installments || 1;
    if (o.cardId) {
      const card = s.cards.find((c) => c.id === o.cardId);
      if (!card) throw new Error('Cartão não encontrado.');
      const parts = E.splitCents(o.amountCents, n), group = n > 1 ? E.uid() : null, out = [];
      const pur = { id: E.uid(), cardId: card.id, desc: (o.desc || '').trim(), merchant: (o.merchant || '').trim(), totalCents: o.amountCents, installments: n, date: o.date || E.today(), categoryId: o.categoryId || null, notes: o.notes || '', context: o.context || card.context || 'personal', status: 'active', history: [] };
      (s.purchases = s.purchases || []).push(pur); phist(pur, 'criada');
      parts.forEach((cents, i) => {
        const date = E.addMonths(o.date || E.today(), i);
        const inv = E.invoiceFor(card, date);
        const t = Object.assign(base(s, o), { kind: 'expense', amountCents: cents, cardId: card.id, invoiceDue: inv.dueDate, purchaseDate: date, dueDate: inv.dueDate, accountId: null, method: 'credit_card', purchaseId: pur.id });
        if (n > 1) { Object.assign(t, { installmentGroup: group, installmentNo: i + 1, installmentTotal: n, desc: `${t.desc} (${i + 1}/${n})`, originalDate: o.date || E.today() }); }
        s.tx.push(t); hist(t, 'criada'); out.push(t);
      });
      if (o.planItemId) out.forEach((t) => { t.planItemId = o.planItemId; });
      return out;
    }
    if (!o.accountId) throw new Error('Escolha a conta de onde sai o dinheiro.');
    const t = Object.assign(base(s, o), { kind: 'expense', amountCents: o.amountCents, accountId: o.accountId, method: o.method || 'pix', dueDate: o.dueDate || o.date || E.today() });
    if (o.fund) { checkPk(o.fund); t.fund = o.fund; }
    if (o.planItemId) t.planItemId = o.planItemId;
    if (o.paid) { t.status = 'paid'; t.paidDate = o.paidDate || E.today(); t.paidCents = o.amountCents; }
    s.tx.push(t); hist(t, 'criada'); return [t];
  };

  E.addTransfer = (s, o) => {
    needAmount(o.amountCents);
    if (!o.fromId || !o.toId || o.fromId === o.toId) throw new Error('Escolha duas contas diferentes.');
    const t = Object.assign(base(s, o), { kind: 'transfer', amountCents: o.amountCents, accountId: o.fromId, toAccountId: o.toId, status: 'paid', paidDate: o.date || E.today(), paidCents: o.amountCents, desc: o.desc || 'Transferência' });
    s.tx.push(t); hist(t, 'criada'); return t;
  };

  // confirmar pagamento / recebimento (única forma de uma conta virar "paga")
  E.confirm = (s, id, { date, cents, accountId } = {}) => {
    const t = s.tx.find((x) => x.id === id);
    if (!t) throw new Error('Lançamento não encontrado.');
    if (t.cardId) throw new Error('Compras no cartão são pagas pela fatura.');
    if (t.status === 'cancelled') throw new Error('Lançamento cancelado.');
    t.status = 'paid'; t.paidDate = date || E.today(); t.paidCents = cents || t.amountCents;
    if (accountId) t.accountId = accountId;
    hist(t, 'confirmado em ' + t.paidDate); return t;
  };
  E.reschedule = (s, id, newDue) => { const t = s.tx.find((x) => x.id === id); hist(t, `vencimento ${t.dueDate} → ${newDue}`); t.dueDate = newDue; return t; };
  E.edit = (s, id, patch) => {
    const t = s.tx.find((x) => x.id === id);
    if (!t) throw new Error('Lançamento não encontrado.');
    if (patch.fund) checkPk(patch.fund);
    const L = { desc: 'descrição', amountCents: 'valor', categoryId: 'categoria', dueDate: 'vencimento', paidDate: 'data do pagamento', fund: 'recebimento vinculado', slot: 'período da receita', planItemId: 'item do orçamento' };
    const show = (k, v) => k === 'amountCents' ? E.brl(v) : (k === 'dueDate' || k === 'paidDate') ? E.fmtDate(v) : k === 'fund' ? (v ? E.fundLabel(s, v) : 'sem vínculo') : k === 'planItemId' ? (((s.plan || { items: [] }).items.find((i) => i.id === v) || {}).name || 'nenhum') : k === 'slot' ? (v ? 'dia ' + E.cfg(s).payDays[v - 1] : 'automático') : String(v == null ? '—' : v).replace(/^[ei]_/, '');
    Object.keys(patch).forEach((k) => { if ((t[k] || null) !== (patch[k] || null) || (k !== 'fund' && k !== 'slot' && t[k] !== patch[k])) { if (L[k]) hist(t, `${L[k]}: ${show(k, t[k])} → ${show(k, patch[k])}`); if ((k === 'fund' || k === 'slot') && !patch[k]) delete t[k]; else t[k] = patch[k]; } });
    return t;
  };
  E.cancel = (s, id) => { const t = s.tx.find((x) => x.id === id); t.status = 'cancelled'; hist(t, 'cancelada'); return t; }; // nunca apaga

  // ───── faturas
  E.invoices = (s, cardId) => {
    const map = {};
    s.tx.filter((t) => t.cardId === cardId && t.status !== 'cancelled').forEach((t) => {
      (map[t.invoiceDue] = map[t.invoiceDue] || { cardId, dueDate: t.invoiceDue, totalCents: 0, paidCents: 0, items: [] });
      map[t.invoiceDue].totalCents += t.kind === 'refund' ? -t.amountCents : t.amountCents; map[t.invoiceDue].items.push(t);
    });
    s.tx.filter((t) => t.kind === 'invoice_payment' && t.cardRef === cardId && t.status === 'paid').forEach((t) => {
      (map[t.invoiceDue] = map[t.invoiceDue] || { cardId, dueDate: t.invoiceDue, totalCents: 0, paidCents: 0, items: [] }).paidCents += t.amountCents;
    });
    const card = s.cards.find((c) => c.id === cardId);
    return Object.values(map).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((i) => {
      i.remainingCents = i.totalCents - i.paidCents;
      i.closingDate = card ? E.invoiceFor(card, E.addMonths(i.dueDate, card.dueDay <= card.closingDay ? -1 : 0).slice(0, 8) + pad(card.closingDay)).closingDate : null;
      i.status = i.remainingCents <= 0 && i.totalCents > 0 ? 'paid' : (E.today() > i.closingDate ? 'closed' : 'open');
      return i;
    });
  };
  // paga a fatura: sai da conta, NÃO é nova despesa
  E.payInvoice = (s, { cardId, dueDate, accountId, amountCents, date }) => {
    needAmount(amountCents);
    const inv = E.invoices(s, cardId).find((i) => i.dueDate === dueDate);
    if (!inv) throw new Error('Fatura não encontrada.');
    if (amountCents > inv.remainingCents) throw new Error('O valor é maior que o restante da fatura.');
    const card = s.cards.find((c) => c.id === cardId);
    const t = { id: E.uid(), kind: 'invoice_payment', amountCents, paidCents: amountCents, accountId, cardRef: cardId, invoiceDue: dueDate, context: card.context, desc: 'Pagamento da fatura ' + card.name, status: 'paid', paidDate: date || E.today(), purchaseDate: date || E.today(), dueDate, categoryId: null, history: [] };
    s.tx.push(t); hist(t, 'criada'); return t;
  };
  E.cardLimit = (s, card) => {
    const used = E.invoices(s, card.id).reduce((a, i) => a + Math.max(i.remainingCents, 0), 0);
    return { usedCents: used, availableCents: card.limitCents - used };
  };

  // ───── recorrências (geram lançamentos novos; histórico intocado)
  E.addRecurring = (s, o) => {
    needAmount(o.amountCents);
    const r = { id: E.uid(), kind: o.kind, desc: o.desc, amountCents: o.amountCents, accountId: o.accountId, categoryId: o.categoryId, day: o.day, context: o.context || 'personal', startDate: o.startDate, generatedUntil: null, fundSlot: o.fundSlot === 1 || o.fundSlot === 2 ? o.fundSlot : null };
    if (o.planItemId) r.planItemId = o.planItemId;
    s.recurrences.push(r); E.generateRecurring(s, o.today || E.today(), 12); return r;
  };
  E.generateRecurring = (s, today, monthsAhead) => {
    const limit = E.addMonths(today.slice(0, 8) + '01', monthsAhead);
    let n = 0;
    s.recurrences.forEach((r) => {
      if (r.ended) return;
      for (let i = 0; i < 400; i++) {
        const m = E.addMonths(r.startDate.slice(0, 8) + '01', i);
        if (m > limit) break;
        const due = m.slice(0, 8) + pad(Math.min(r.day, E.daysInMonth(+m.slice(0, 4), +m.slice(5, 7))));
        if (due < r.startDate) continue;
        if (s.tx.some((t) => t.recurrenceId === r.id && t.dueDate === due)) continue; // nunca duplica
        if (r.planItemId && s.tx.some((t) => t.planItemId === r.planItemId && t.dueDate === due && t.kind === 'expense')) continue; // já lançada pelo orçamento
        if (s.tx.some((t) => t.status !== 'cancelled' && t.kind === r.kind && t.dueDate === due && !t.cardId && nrm(t.desc) === nrm(r.desc))) continue; // já existe a mesma conta nesta data
        const t = Object.assign(base(s, { desc: r.desc, categoryId: r.categoryId, context: r.context, date: due, dueDate: due }), { kind: r.kind, amountCents: r.amountCents, accountId: r.accountId, recurrenceId: r.id, method: 'auto_debit' });
        if (r.planItemId) t.planItemId = r.planItemId;
        if (r.fundSlot && r.kind === 'expense') t.fund = E.fundForSlot(s, due, r.fundSlot);
        if (r.fundSlot && r.kind === 'income') t.slot = r.fundSlot;
        s.tx.push(t); hist(t, 'gerada pela recorrência'); n++;
      }
    });
    return n;
  };

  // ───── consultas
  const inCtx = (t, ctx) => ctx === 'all' || t.context === ctx;
  const live = (s, ctx) => s.tx.filter((t) => t.status !== 'cancelled' && inCtx(t, ctx));
  // "gasto" = despesa já efetivada: compra no cartão (data da compra) ou conta paga (data do pagamento). Contas só previstas ficam em "a pagar".
  const spentDate = (t) => t.kind === 'refund' ? t.purchaseDate : t.kind !== 'expense' ? '' : t.cardId ? t.purchaseDate : (t.status === 'paid' ? t.paidDate : '');
  const spentVal = (t) => t.kind === 'refund' ? -t.amountCents : t.cardId ? t.amountCents : (t.paidCents || t.amountCents);
  E.isOverdue = (t, today) => t.status === 'pending' && !t.cardId && t.dueDate && t.dueDate < today;

  E.accountBalance = (s, acc) => {
    let c = acc.openingCents;
    s.tx.forEach((t) => {
      if (t.status !== 'paid') return;
      const v = t.paidCents || t.amountCents;
      if (t.kind === 'income' && t.accountId === acc.id) c += v;
      else if ((t.kind === 'expense' || t.kind === 'invoice_payment') && t.accountId === acc.id) c -= v;
      else if (t.kind === 'transfer') { if (t.accountId === acc.id) c -= v; if (t.toAccountId === acc.id) c += v; }
    });
    return c;
  };
  E.totalAvailable = (s, ctx) => s.accounts.filter((a) => !a.archived && inCtx(a, ctx)).reduce((a, x) => a + E.accountBalance(s, x), 0);

  // Faturas ainda a pagar (com vencimento até "until")
  const invoicesDue = (s, ctx, until) => {
    let total = 0;
    s.cards.filter((c) => inCtx(c, ctx)).forEach((c) => E.invoices(s, c.id).forEach((i) => { if (i.remainingCents > 0 && (!until || i.dueDate <= until)) total += i.remainingCents; }));
    return total;
  };

  E.monthSummary = (s, month, ctx = 'all', today = E.today()) => {
    const end = E.endOfMonth(month + '-01'), start = month + '-01';
    const L = live(s, ctx);
    const receivedCents = L.filter((t) => t.kind === 'income' && t.status === 'paid' && t.paidDate >= start && t.paidDate <= end).reduce((a, t) => a + (t.paidCents || t.amountCents), 0);
    const toReceiveCents = L.filter((t) => t.kind === 'income' && t.status === 'pending' && t.dueDate <= end).reduce((a, t) => a + t.amountCents, 0);
    // gasto = despesas (conta ou cartão) com data de competência no mês; transferências e pagamento de fatura NUNCA entram
    const spentCents = L.filter((t) => spentDate(t) >= start && spentDate(t) <= end).reduce((a, t) => a + spentVal(t), 0);
    const toPayAccount = L.filter((t) => t.kind === 'expense' && !t.cardId && t.status === 'pending' && t.dueDate <= end).reduce((a, t) => a + t.amountCents, 0);
    const toPayCards = invoicesDue(s, ctx, end);
    const toPayCents = toPayAccount + toPayCards;
    const availableCents = E.totalAvailable(s, ctx);
    const projectedCents = availableCents + toReceiveCents - toPayCents;
    const overdueCents = L.filter((t) => E.isOverdue(t, today) && t.kind === 'expense').reduce((a, t) => a + t.amountCents, 0);
    const incomeMonth = L.filter((t) => t.kind === 'income' && t.dueDate >= start && t.dueDate <= end).reduce((a, t) => a + t.amountCents, 0);
    return { receivedCents, toReceiveCents, spentCents, toPayCents, availableCents, projectedCents, overdueCents, incomeMonthCents: incomeMonth };
  };

  // próximos vencimentos (contas + faturas) em N dias
  E.upcoming = (s, days, ctx = 'all', today = E.today()) => {
    const lim = E.addDays(today, days), items = [];
    live(s, ctx).forEach((t) => {
      if (t.status !== 'pending' || t.cardId || t.kind === 'transfer') return;
      if (t.dueDate <= lim) items.push({ type: t.kind, id: t.id, desc: t.desc, amountCents: t.amountCents, dueDate: t.dueDate, overdue: t.dueDate < today });
    });
    s.cards.filter((c) => inCtx(c, ctx)).forEach((c) => E.invoices(s, c.id).forEach((i) => {
      if (i.remainingCents > 0 && i.dueDate <= lim) items.push({ type: 'invoice', cardId: c.id, dueDate: i.dueDate, desc: 'Fatura ' + c.name, amountCents: i.remainingCents, overdue: i.dueDate < today });
    }));
    return items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  };

  // projeção diária do saldo (para achar dia negativo)
  E.projection = (s, days, ctx = 'all', today = E.today()) => {
    let bal = E.totalAvailable(s, ctx), out = [];
    const items = E.upcoming(s, days, ctx, today);
    for (let d = 0; d <= days; d++) {
      const day = E.addDays(today, d);
      items.filter((i) => (d === 0 ? i.dueDate <= day : i.dueDate === day)).forEach((i) => { bal += i.type === 'income' ? i.amountCents : -i.amountCents; });
      out.push({ date: day, balanceCents: bal });
    }
    return out;
  };

  E.byCategory = (s, month, ctx = 'all') => {
    const m = {};
    live(s, ctx).filter((t) => spentDate(t) && E.ym(spentDate(t)) === month).forEach((t) => { const k = t.categoryId || 'sem'; m[k] = (m[k] || 0) + spentVal(t); });
    return m;
  };
  E.monthSeries = (s, endMonth, n, ctx = 'all') => Array.from({ length: n }, (_, i) => {
    const mo = E.addMonths(endMonth + '-01', i - n + 1).slice(0, 7);
    const L = live(s, ctx);
    return { month: mo,
      income: L.filter((t) => t.kind === 'income' && t.status === 'paid' && E.ym(t.paidDate) === mo).reduce((a, t) => a + (t.paidCents || t.amountCents), 0),
      expense: L.filter((t) => spentDate(t) && E.ym(spentDate(t)) === mo).reduce((a, t) => a + spentVal(t), 0) };
  });
  E.budgetStatus = (s, month, ctx = 'all') => {
    const spent = E.byCategory(s, month, ctx), out = [];
    Object.entries(s.budgets).forEach(([k, cents]) => {
      if (!k.startsWith(month + '|')) return;
      const cat = k.split('|')[1], used = spent[cat] || 0, pct = cents ? Math.round((used / cents) * 100) : 0;
      out.push({ categoryId: cat, budgetCents: cents, usedCents: used, pct, level: pct >= 100 ? 100 : pct >= 90 ? 90 : pct >= 70 ? 70 : 0 });
    });
    return out;
  };

  // ───── linguagem natural: "Hoje gastei R$ 85 no mercado via Pix"
  const METHODS = [['pix', /\bpix\b/i], ['credit_card', /cart[aã]o|cr[eé]dito/i], ['debit_card', /d[eé]bito/i], ['cash', /dinheiro|esp[eé]cie/i], ['boleto', /boleto/i], ['transfer', /transfer/i]];
  const KEYWORDS = { 'e_Alimentação': ['mercado', 'supermercado', 'padaria', 'restaurante', 'lanche', 'ifood', 'almoço', 'jantar', 'feira'], 'e_Transporte': ['uber', 'ônibus', 'onibus', 'metrô', 'metro', 'gasolina', 'combustível', 'estacionamento', 'pedágio'], 'e_Saúde': ['farmácia', 'farmacia', 'médico', 'medico', 'consulta', 'remédio', 'remedio'], 'e_Moradia': ['aluguel', 'condomínio', 'condominio', 'luz', 'água', 'agua', 'internet', 'gás', 'gas'], 'e_Lazer': ['cinema', 'netflix', 'spotify', 'passeio', 'viagem'], 'e_Educação': ['escola', 'curso', 'inglês', 'ingles', 'faculdade', 'livro'], 'e_Família': ['bebê', 'bebe', 'fralda', 'filho', 'brinquedo'] };
  E.suggestCategory = (s, desc) => {
    const d = (desc || '').toLowerCase(); if (!d) return null;
    const words = d.split(/\s+/).filter((w) => w.length > 2), score = {};
    s.tx.filter((t) => t.kind === 'expense' && t.categoryId).forEach((t) => { const td = t.desc.toLowerCase(); if (words.some((w) => td.includes(w))) score[t.categoryId] = (score[t.categoryId] || 0) + 1; });
    const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0]; if (best) return best[0];
    for (const [cat, ks] of Object.entries(KEYWORDS)) if (ks.some((k) => d.includes(k))) return cat;
    return null;
  };
  E.parseNatural = (s, text, today = E.today()) => {
    const out = { kind: 'expense', missing: [] }, t = text.trim();
    if (/\b(recebi|ganhei|entrou|caiu)\b/i.test(t)) out.kind = 'income';
    const m = t.match(/R\$\s*([\d.]+(?:,\d{1,2})?)|(\d+(?:[.,]\d{1,2})?)\s*(?:reais|real)/i);
    if (m) out.amountCents = E.toCents(m[1] || m[2]); else out.missing.push('valor');
    out.date = /\bontem\b/i.test(t) ? E.addDays(today, -1) : today;
    for (const [k, re] of METHODS) if (re.test(t)) { out.method = k; break; }
    if (!out.method && out.kind === 'expense') out.missing.push('forma de pagamento');
    const d = t.match(/\b(?:no|na|em|com|de|do|da)\s+([^\d,.]+?)(?:\s+(?:via|no|na|com|por)\b|$)/i);
    out.desc = d ? d[1].trim().replace(/^(o|a|os|as)\s+/i, '') : '';
    if (out.desc) out.desc = out.desc[0].toUpperCase() + out.desc.slice(1);
    out.categoryId = out.kind === 'expense' ? E.suggestCategory(s, out.desc) : null;
    return out;
  };

  // ───── patrimônio simples
  E.netWorth = (s, ctx = 'all') => {
    const assets = E.totalAvailable(s, ctx);
    const debt = s.cards.filter((c) => inCtx(c, ctx)).reduce((a, c) => a + E.cardLimit(s, c).usedCents, 0);
    return { assetsCents: assets, liabilitiesCents: debt, netCents: assets - debt };
  };

  // ───── textos de orientação (só com dados reais)
  E.insights = (s, ctx, today = E.today()) => {
    const out = [], mo = E.ym(today), prev = E.addMonths(today.slice(0, 8) + '01', -1).slice(0, 7);
    E.upcoming(s, 7, ctx, today).forEach((i) => {
      const d = E.diffDays(today, i.dueDate);
      if (i.type === 'income') return;
      if (d < 0) out.push({ level: 'bad', text: `${i.desc} está atrasada desde ${E.fmtDate(i.dueDate)} (${E.brl(i.amountCents)}).`, ref: i });
      else if (d === 0) out.push({ level: 'warn', text: `${i.desc} vence hoje (${E.brl(i.amountCents)}).`, ref: i });
      else if (d === 1) out.push({ level: 'warn', text: `${i.desc} vence amanhã (${E.brl(i.amountCents)}).`, ref: i });
    });
    E.budgetStatus(s, mo, ctx).filter((b) => b.level).forEach((b) => { const c = s.categories.find((x) => x.id === b.categoryId); out.push({ level: b.level >= 100 ? 'bad' : 'warn', text: `Você já usou ${b.pct}% do orçamento de ${c ? c.name : 'categoria'}.` }); });
    const cur = E.byCategory(s, mo, ctx), old = E.byCategory(s, prev, ctx);
    const tc = Object.values(cur).reduce((a, b) => a + b, 0), to = Object.values(old).reduce((a, b) => a + b, 0);
    if (to > 0 && tc > to && E.diffDays(mo + '-01', today) >= 15) out.push({ level: 'info', text: `Você gastou ${E.brl(tc - to)} a mais que em todo o mês passado.` });
    const proj = E.projection(s, 30, ctx, today).find((p) => p.balanceCents < 0);
    if (proj) out.push({ level: 'bad', text: `Atenção: sua projeção indica saldo negativo em ${E.fmtDate(proj.date)}.` });
    return out.concat(E.planInsights(s, ctx, today), E.periodInsights(s, ctx, today));
  };


  // ═════════ FINANCE CONTROL 2.0 ═════════

  // ───── 1) Recebimentos por período (dias configuráveis, padrão 10 e 25)
  const DEFAULT_PAYDAYS = [10, 25];
  const MS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  E.cfg = (s) => { const p = (s.settings || {}).payDays; return { payDays: Array.isArray(p) && p.length === 2 && p[0] >= 1 && p[1] <= 28 && p[0] < p[1] ? p.slice() : DEFAULT_PAYDAYS.slice() }; };
  E.setPayDays = (s, a, b) => {
    a = +a; b = +b;
    if (!(Number.isInteger(a) && Number.isInteger(b) && a >= 1 && b <= 28 && a < b)) throw new Error('Informe dois dias entre 1 e 28, sendo o primeiro menor que o segundo.');
    s.settings = s.settings || {}; s.settings.payDays = [a, b];
  };
  E.pk = (ym, slot) => ym + '|' + slot;
  E.parsePk = (pk) => ({ ym: pk.slice(0, 7), slot: +pk.slice(8) });
  E.paydayDate = (s, pk) => { const q = E.parsePk(pk); return q.ym + '-' + pad(E.cfg(s).payDays[q.slot - 1]); };
  E.fundLabel = (s, pk) => { const q = E.parsePk(pk); return 'Dia ' + E.cfg(s).payDays[q.slot - 1] + ' · ' + MS[+q.ym.slice(5) - 1] + '/' + q.ym.slice(0, 4); };
  E.periodRange = (s, pk) => {
    const q = E.parsePk(pk), start = E.paydayDate(s, pk);
    const next = q.slot === 1 ? E.paydayDate(s, E.pk(q.ym, 2)) : E.paydayDate(s, E.pk(E.addMonths(q.ym + '-01', 1).slice(0, 7), 1));
    return { start, end: E.addDays(next, -1) };
  };
  // em qual período entra uma receita: escolha do usuário (slot) ou o dia de recebimento mais próximo da data
  E.slotOfDate = (s, date) => { const [a, b] = E.cfg(s).payDays, d = +date.slice(8, 10); return Math.abs(d - a) <= Math.abs(d - b) ? 1 : 2; };
  E.slotOf = (s, t) => (t.slot === 1 || t.slot === 2) ? t.slot : E.slotOfDate(s, t.dueDate || t.purchaseDate);
  E.nextPayday = (s, today = E.today()) => {
    for (let m = 0; m < 3; m++) {
      const base = E.addMonths(today.slice(0, 8) + '01', m).slice(0, 7);
      for (const slot of [1, 2]) { const pk = E.pk(base, slot), date = E.paydayDate(s, pk); if (date >= today) return { pk, date, slot, day: +date.slice(8) }; }
    }
  };
  // SUGESTÃO (nunca aplicada sozinha): o recebimento mais recente que cai até o vencimento
  E.suggestFund = (s, dueDate) => {
    const c = [];
    [-1, 0].forEach((m) => { const base = E.addMonths(dueDate.slice(0, 8) + '01', m).slice(0, 7); [1, 2].forEach((sl) => c.push({ pk: E.pk(base, sl), date: E.paydayDate(s, E.pk(base, sl)) })); });
    const ok = c.filter((x) => x.date <= dueDate); return (ok.length ? ok[ok.length - 1] : c[0]).pk;
  };
  E.fundForSlot = (s, dueDate, slot) => {
    const c = [];
    [-1, 0].forEach((m) => { const base = E.addMonths(dueDate.slice(0, 8) + '01', m).slice(0, 7); const pk = E.pk(base, slot); c.push({ pk, date: E.paydayDate(s, pk) }); });
    const ok = c.filter((x) => x.date <= dueDate); return (ok.length ? ok[ok.length - 1] : c[0]).pk;
  };
  E.fundOptions = (s, dueDate) => { const out = []; [-1, 0, 1].forEach((m) => { const base = E.addMonths(dueDate.slice(0, 8) + '01', m).slice(0, 7); [1, 2].forEach((sl) => out.push(E.pk(base, sl))); }); return out; };

  const sumPaid = (t) => t.paidCents || t.amountCents;
  E.invoiceFundOf = (s, cardId, due) => (s.invoiceFund || {})[cardId + '|' + due] || null;
  E.linkExpense = (s, id, pk) => {
    const t = s.tx.find((x) => x.id === id);
    if (!t || t.kind !== 'expense') throw new Error('Despesa não encontrada.');
    if (t.cardId) throw new Error('Compras no cartão são vinculadas pela fatura.');
    if (t.status === 'cancelled') throw new Error('Lançamento cancelado.');
    if (pk) checkPk(pk);
    hist(t, 'recebimento vinculado: ' + (t.fund ? E.fundLabel(s, t.fund) : 'sem vínculo') + ' → ' + (pk ? E.fundLabel(s, pk) : 'sem vínculo'));
    if (pk) t.fund = pk; else delete t.fund; return t;
  };
  E.linkInvoice = (s, cardId, due, pk) => {
    if (!E.invoices(s, cardId).some((i) => i.dueDate === due)) throw new Error('Fatura não encontrada.');
    s.invoiceFund = s.invoiceFund || {}; const k = cardId + '|' + due, old = s.invoiceFund[k] || null;
    if (pk) checkPk(pk);
    (s.log = s.log || []).push({ at: new Date().toISOString(), what: `fatura ${cardId} ${due}: ${old ? E.fundLabel(s, old) : 'sem vínculo'} → ${pk ? E.fundLabel(s, pk) : 'sem vínculo'}` });
    if (pk) s.invoiceFund[k] = pk; else delete s.invoiceFund[k];
  };

  E.periodSummary = (s, pk, ctx = 'all', today = E.today()) => {
    const q = E.parsePk(pk), L = live(s, ctx);
    const incomes = L.filter((t) => t.kind === 'income' && E.ym(t.dueDate) === q.ym && E.slotOf(s, t) === q.slot);
    const expectedCents = incomes.reduce((a, t) => a + t.amountCents, 0);
    const receivedCents = incomes.filter((t) => t.status === 'paid').reduce((a, t) => a + sumPaid(t), 0);
    const pendingIncomeCents = incomes.filter((t) => t.status === 'pending').reduce((a, t) => a + t.amountCents, 0);
    const exps = L.filter((t) => t.kind === 'expense' && !t.cardId && t.fund === pk);
    const invs = [];
    s.cards.filter((c) => inCtx(c, ctx)).forEach((c) => E.invoices(s, c.id).forEach((i) => { if (E.invoiceFundOf(s, c.id, i.dueDate) === pk) invs.push(Object.assign({ card: c }, i)); }));
    const paidExp = exps.filter((t) => t.status === 'paid').reduce((a, t) => a + sumPaid(t), 0);
    const pendExp = exps.filter((t) => t.status === 'pending').reduce((a, t) => a + t.amountCents, 0);
    const invPaid = invs.reduce((a, i) => a + i.paidCents, 0), invPend = invs.reduce((a, i) => a + Math.max(i.remainingCents, 0), 0);
    const paidCents = paidExp + invPaid, pendingCents = pendExp + invPend, linkedCents = paidCents + pendingCents;
    return {
      pk, range: E.periodRange(s, pk), incomes, exps, invs,
      expectedCents, receivedCents, pendingIncomeCents,
      linkedCents, paidCents, pendingCents,
      pendingCount: exps.filter((t) => t.status === 'pending').length + invs.filter((i) => i.remainingCents > 0).length,
      paidCount: exps.filter((t) => t.status === 'paid').length + invs.filter((i) => i.paidCents > 0).length,
      projectedCents: expectedCents - linkedCents,       // previsto − tudo que está vinculado
      availableCents: receivedCents - paidCents,         // só dinheiro que realmente entrou, menos o que já foi pago
      afterPendingCents: receivedCents - paidCents - pendingCents,
    };
  };
  // contas e faturas ainda sem recebimento definido (dentro de um intervalo de vencimento)
  E.unlinked = (s, ctx, range) => {
    const inR = (d) => (!range || (d >= range.from && d <= range.to)), items = [];
    live(s, ctx).forEach((t) => { if (t.kind === 'expense' && !t.cardId && t.status === 'pending' && !t.fund && inR(t.dueDate)) items.push({ type: 'tx', id: t.id, desc: t.desc, amountCents: t.amountCents, dueDate: t.dueDate, suggested: E.suggestFund(s, t.dueDate) }); });
    s.cards.filter((c) => inCtx(c, ctx)).forEach((c) => E.invoices(s, c.id).forEach((i) => { if (i.remainingCents > 0 && !E.invoiceFundOf(s, c.id, i.dueDate) && inR(i.dueDate)) items.push({ type: 'inv', cardId: c.id, dueDate: i.dueDate, desc: 'Fatura ' + c.name, amountCents: i.remainingCents, suggested: E.suggestFund(s, i.dueDate) }); }));
    return items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  };
  E.acceptSuggestions = (s, items) => { items.forEach((i) => { if (i.type === 'tx') E.linkExpense(s, i.id, i.suggested); else E.linkInvoice(s, i.cardId, i.dueDate, i.suggested); }); return items.length; };
  E.periodInsights = (s, ctx, today = E.today()) => {
    const out = [];
    if (!s.tx.some((t) => t.kind === 'income' && t.status !== 'cancelled')) return out;
    const np = E.nextPayday(s, today), sm = E.periodSummary(s, np.pk, ctx, today);
    out.push({ level: 'info', text: `Seu próximo recebimento será no dia ${np.day} (${E.fmtDate(np.date)}).` });
    if (sm.pendingCents > 0) {
      out.push({ level: 'info', text: `Você possui ${E.brl(sm.pendingCents)} em compromissos vinculados ao próximo recebimento.` });
      const f = E.totalAvailable(s, ctx) + sm.pendingIncomeCents - sm.pendingCents;
      out.push({ level: f < 0 ? 'bad' : 'info', text: `Após os pagamentos programados, sua previsão é de ${E.brl(f)} disponíveis.` });
    }
    return out;
  };

  // ───── 2) Cartões: compras (registro único) → parcelas → faturas
  const invMap = (s, cardId) => { const m = {}; E.invoices(s, cardId).forEach((i) => { m[i.dueDate] = i; }); return m; };
  // 'paid' = a fatura já recebeu pagamento; 'closed' = fatura fechada. Ambas são protegidas.
  E.lockOf = (inv) => !inv ? null : inv.paidCents > 0 ? 'paid' : inv.status === 'closed' ? 'closed' : null;
  const stripSfx = (d) => d.replace(/ \(\d+\/\d+\)$/, '');
  const sfx = (no, n) => n > 1 ? ` (${no}/${n})` : '';

  E.migrate = (s) => {
    let ch = false;
    if (!s.settings) { s.settings = { payDays: DEFAULT_PAYDAYS.slice() }; ch = true; }
    if (!s.invoiceFund) { s.invoiceFund = {}; ch = true; }
    if (!s.purchases) { s.purchases = []; ch = true; }
    if (!s.plan) { s.plan = { income: [0, 0], items: [], done: {} }; ch = true; }
    const groups = {};
    s.tx.forEach((t) => {
      if (t.kind !== 'expense' || !t.cardId || t.purchaseId) return;
      const key = t.installmentGroup || t.id; let p = groups[key];
      if (!p) {
        const all = s.tx.filter((x) => x.kind === 'expense' && x.cardId && (x.installmentGroup || x.id) === key);
        const act = all.filter((x) => x.status !== 'cancelled');
        p = { id: E.uid(), cardId: t.cardId, desc: stripSfx(t.desc), merchant: '', totalCents: (act.length ? act : all).reduce((a, x) => a + x.amountCents, 0), installments: t.installmentTotal || 1, date: t.originalDate || t.purchaseDate, categoryId: t.categoryId || null, notes: t.notes || '', context: t.context, status: act.length ? 'active' : 'cancelled', history: [{ at: new Date().toISOString(), what: 'vinculada ao registro anterior (atualização do sistema)' }] };
        s.purchases.push(p); groups[key] = p;
      }
      t.purchaseId = p.id; ch = true;
    });
    if (s.schema !== 2) { s.schema = 2; ch = true; }
    return ch;
  };

  E.purchaseInstallments = (s, pid) => {
    const p = (s.purchases || []).find((x) => x.id === pid); if (!p) return [];
    const m = invMap(s, p.cardId);
    return s.tx.filter((t) => t.purchaseId === pid && t.kind === 'expense').sort((a, b) => (a.installmentNo || 1) - (b.installmentNo || 1) || a.id.localeCompare(b.id))
      .map((t) => { const inv = m[t.invoiceDue]; return { tx: t, no: t.installmentNo || 1, of: t.installmentTotal || 1, cancelled: t.status === 'cancelled', invoiceStatus: inv ? inv.status : 'open', lock: t.status === 'cancelled' ? null : E.lockOf(inv) }; });
  };
  E.purchaseRefunds = (s, pid) => s.tx.filter((t) => t.purchaseId === pid && t.kind === 'refund' && t.status !== 'cancelled');
  E.refundable = (s, pid) => { const p = s.purchases.find((x) => x.id === pid); return p.totalCents - E.purchaseRefunds(s, pid).reduce((a, t) => a + t.amountCents, 0); };

  // Calcula (sem gravar) o que mudaria. Parcelas de fatura paga ficam sempre intactas;
  // as de fatura fechada só mudam se o usuário autorizar (opts.allowClosed).
  E.previewPurchaseEdit = (s, id, patch, opts = {}) => {
    const p = (s.purchases || []).find((x) => x.id === id);
    if (!p) throw new Error('Compra não encontrada.');
    const res = { financial: false, blocked: null, plan: [], impact: [], warnings: [], hasClosed: false, oldTotal: p.totalCents, newTotal: p.totalCents, oldN: p.installments, newN: p.installments };
    if (p.status === 'cancelled') { res.blocked = 'Esta compra foi cancelada e não pode mais ser alterada.'; return res; }
    const totalCents = patch.totalCents != null ? patch.totalCents : p.totalCents, n = patch.installments != null ? patch.installments : p.installments;
    const date = patch.date || p.date, cardId = patch.cardId || p.cardId;
    res.newTotal = totalCents; res.newN = n;
    res.financial = totalCents !== p.totalCents || n !== p.installments || date !== p.date || cardId !== p.cardId;
    if (!res.financial) return res;
    if (!Number.isInteger(totalCents) || totalCents <= 0) { res.blocked = 'Informe um valor total maior que zero.'; return res; }
    if (!Number.isInteger(n) || n < 1 || n > 48) { res.blocked = 'O número de parcelas deve ficar entre 1 e 48.'; return res; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { res.blocked = 'Informe a data da compra.'; return res; }
    const card = s.cards.find((c) => c.id === cardId); if (!card) { res.blocked = 'Cartão não encontrado.'; return res; }
    const rows = E.purchaseInstallments(s, id).filter((r) => !r.cancelled);
    res.hasClosed = rows.some((r) => r.lock === 'closed');
    const frozen = rows.filter((r) => r.lock === 'paid' || (r.lock === 'closed' && !opts.allowClosed));
    if (cardId !== p.cardId && frozen.length) { res.blocked = 'Não é possível trocar o cartão: já existem parcelas em fatura paga ou fechada.'; return res; }
    const fnos = new Set(frozen.map((r) => r.no)), maxF = frozen.reduce((a, r) => Math.max(a, r.no), 0);
    if (n < maxF) { res.blocked = `Já existem parcelas protegidas até a ${maxF}ª (fatura paga ou fechada). O parcelamento não pode ficar menor que ${maxF}x.`; return res; }
    const free = []; for (let i = 1; i <= n; i++) if (!fnos.has(i)) free.push(i);
    const fsum = frozen.reduce((a, r) => a + r.tx.amountCents, 0), remaining = totalCents - fsum;
    if (!free.length && remaining !== 0) { res.blocked = `O valor total não bate com as parcelas protegidas (${E.brl(fsum)}).`; return res; }
    if (free.length && remaining < free.length) { res.blocked = `O valor total precisa ser maior que ${E.brl(fsum)}, que é o total das parcelas já protegidas (fatura paga ou fechada).`; return res; }
    const parts = free.length ? E.splitCents(remaining, free.length) : [];
    const m = invMap(s, p.cardId), delta = {};
    const addD = (due, c) => { delta[due] = (delta[due] || 0) + c; };
    for (let no = 1; no <= n; no++) {
      const ex = rows.find((r) => r.no === no);
      if (fnos.has(no)) { res.plan.push({ no, action: 'keep', lock: ex.lock, from: { amountCents: ex.tx.amountCents, invoiceDue: ex.tx.invoiceDue }, to: { amountCents: ex.tx.amountCents, invoiceDue: ex.tx.invoiceDue }, tx: ex.tx }); continue; }
      const amountCents = parts[free.indexOf(no)], pdate = E.addMonths(date, no - 1), inv = E.invoiceFor(card, pdate);
      const to = { amountCents, invoiceDue: inv.dueDate, purchaseDate: pdate };
      // a parcela nova/movida não pode cair, em silêncio, numa fatura que já foi paga ou fechada
      const tl = E.lockOf(m[inv.dueDate]), moving = !ex || ex.tx.invoiceDue !== inv.dueDate;
      if (tl && moving) {
        if (tl === 'paid') { res.blocked = `Com essa alteração, a parcela ${no} cairia na fatura de ${E.fmtDate(inv.dueDate)}, que já recebeu pagamento. Escolha outra data ou outro valor.`; return res; }
        if (!opts.allowClosed) { res.hasClosed = true; res.blocked = `Com essa alteração, a parcela ${no} cairia na fatura de ${E.fmtDate(inv.dueDate)}, que já está fechada. Para continuar, autorize alterar faturas fechadas.`; res.needsClosedOk = true; return res; }
        res.warnings.push(`A parcela ${no} entrará na fatura já fechada de ${E.fmtDate(inv.dueDate)}, porque você autorizou.`);
      }
      if (ex) {
        const same = ex.tx.amountCents === amountCents && ex.tx.invoiceDue === inv.dueDate && ex.tx.purchaseDate === pdate && ex.tx.cardId === cardId;
        res.plan.push({ no, action: same ? 'same' : 'update', lock: ex.lock, from: { amountCents: ex.tx.amountCents, invoiceDue: ex.tx.invoiceDue }, to, tx: ex.tx });
        if (!same) { addD(ex.tx.invoiceDue, -ex.tx.amountCents); addD(inv.dueDate, amountCents); }
        if (!same && ex.lock === 'closed') res.warnings.push(`A parcela ${no} está em fatura já fechada (${E.fmtDate(ex.tx.invoiceDue)}). Ela será alterada porque você autorizou.`);
      } else { res.plan.push({ no, action: 'add', lock: null, from: null, to }); addD(inv.dueDate, amountCents); }
    }
    rows.filter((r) => r.no > n).forEach((r) => { res.plan.push({ no: r.no, action: 'remove', lock: r.lock, from: { amountCents: r.tx.amountCents, invoiceDue: r.tx.invoiceDue }, to: null, tx: r.tx }); addD(r.tx.invoiceDue, -r.tx.amountCents); });
    res.impact = Object.keys(delta).filter((d) => delta[d] !== 0).sort().map((d) => ({ dueDate: d, deltaCents: delta[d], status: (m[d] || {}).status || 'open' }));
    if (frozen.length) res.warnings.push(`${frozen.length} parcela${frozen.length > 1 ? 's' : ''} de fatura paga ou fechada foi mantida sem alteração.`);
    res.protectedNos = frozen.map((r) => r.no);
    return res;
  };

  E.applyPurchaseEdit = (s, id, patch, opts = {}) => {
    const p = s.purchases.find((x) => x.id === id), pv = E.previewPurchaseEdit(s, id, patch, opts);
    if (pv.blocked) throw new Error(pv.blocked);
    const rowsAll = () => s.tx.filter((t) => t.purchaseId === id && t.kind === 'expense' && t.status !== 'cancelled');
    const oldDesc = p.desc; let changed = false;
    // dados que não mexem em valores
    if (patch.desc != null && patch.desc.trim() && patch.desc.trim() !== p.desc) { phist(p, `descrição: ${p.desc} → ${patch.desc.trim()}`); p.desc = patch.desc.trim(); changed = true; }
    if (patch.merchant != null && patch.merchant.trim() !== (p.merchant || '')) { phist(p, `estabelecimento: ${p.merchant || '—'} → ${patch.merchant.trim() || '—'}`); p.merchant = patch.merchant.trim(); changed = true; }
    if (patch.notes != null && patch.notes.trim() !== (p.notes || '')) { phist(p, 'observações alteradas'); p.notes = patch.notes.trim(); changed = true; }
    if (patch.categoryId !== undefined && (patch.categoryId || null) !== (p.categoryId || null)) {
      phist(p, `categoria: ${(p.categoryId || '—').replace(/^[ei]_/, '')} → ${(patch.categoryId || '—').replace(/^[ei]_/, '')}`);
      rowsAll().forEach((t) => { hist(t, `categoria: ${(t.categoryId || '—').replace(/^[ei]_/, '')} → ${(patch.categoryId || '—').replace(/^[ei]_/, '')}`); t.categoryId = patch.categoryId || null; });
      p.categoryId = patch.categoryId || null; changed = true;
    }
    if (pv.financial) {
      const card = s.cards.find((c) => c.id === (patch.cardId || p.cardId)), n = pv.newN, date = patch.date || p.date;
      const tmpl = rowsAll()[0] || s.tx.find((t) => t.purchaseId === id);
      const group = n > 1 ? (tmpl.installmentGroup || p.group || E.uid()) : null; if (group) p.group = group;
      pv.plan.forEach((pl) => {
        if (pl.action === 'update') {
          const t = pl.tx, bits = [];
          if (t.amountCents !== pl.to.amountCents) bits.push(`valor: ${E.brl(t.amountCents)} → ${E.brl(pl.to.amountCents)}`);
          if (t.invoiceDue !== pl.to.invoiceDue) bits.push(`fatura: ${E.fmtDate(t.invoiceDue)} → ${E.fmtDate(pl.to.invoiceDue)}`);
          if (t.purchaseDate !== pl.to.purchaseDate) bits.push(`data: ${E.fmtDate(t.purchaseDate)} → ${E.fmtDate(pl.to.purchaseDate)}`);
          if (pl.lock === 'closed') bits.push('fatura fechada: alteração confirmada pelo usuário');
          if (card.id !== t.cardId) { bits.push('cartão alterado'); t.cardId = card.id; }
          Object.assign(t, { amountCents: pl.to.amountCents, invoiceDue: pl.to.invoiceDue, dueDate: pl.to.invoiceDue, purchaseDate: pl.to.purchaseDate });
          if (bits.length) hist(t, bits.join('; '));
        } else if (pl.action === 'remove') { pl.tx.status = 'cancelled'; hist(pl.tx, 'removida: o parcelamento da compra foi reduzido'); }
        else if (pl.action === 'add') {
          const t = Object.assign(base(s, { desc: p.desc, categoryId: p.categoryId, context: tmpl.context, date: pl.to.purchaseDate, notes: p.notes }), { kind: 'expense', amountCents: pl.to.amountCents, cardId: card.id, invoiceDue: pl.to.invoiceDue, purchaseDate: pl.to.purchaseDate, dueDate: pl.to.invoiceDue, accountId: null, method: 'credit_card', purchaseId: id, originalDate: date, installmentNo: pl.no });
          s.tx.push(t); hist(t, 'criada na edição da compra');
        }
      });
      rowsAll().forEach((t) => {
        const no = t.installmentNo || (t.installmentNo = 1);
        if ((t.installmentTotal || 1) !== n) hist(t, `parcelamento: ${t.installmentTotal || 1}x → ${n}x`);
        t.installmentTotal = n; t.originalDate = date; if (group) t.installmentGroup = group;
        t.desc = p.desc + sfx(no, n);
      });
      const bits = [];
      if (pv.newTotal !== pv.oldTotal) bits.push(`valor total: ${E.brl(pv.oldTotal)} → ${E.brl(pv.newTotal)}`);
      if (n !== pv.oldN) bits.push(`parcelas: ${pv.oldN}x → ${n}x`);
      if (date !== p.date) bits.push(`data da compra: ${E.fmtDate(p.date)} → ${E.fmtDate(date)}`);
      if (card.id !== p.cardId) bits.push(`cartão: ${(s.cards.find((c) => c.id === p.cardId) || {}).name} → ${card.name}`);
      if (opts.allowClosed && pv.hasClosed) bits.push('inclui parcelas de fatura fechada (confirmado pelo usuário)');
      phist(p, bits.join('; '));
      Object.assign(p, { totalCents: pv.newTotal, installments: n, date, cardId: card.id }); changed = true;
    } else if (p.desc !== oldDesc) {
      rowsAll().forEach((t) => { const no = t.installmentNo || 1; hist(t, `descrição: ${t.desc} → ${p.desc + sfx(no, p.installments)}`); t.desc = p.desc + sfx(no, p.installments); });
    }
    if (pv.financial && p.desc !== oldDesc) { /* a descrição já foi refeita junto com as parcelas */ }
    return { changed, preview: pv };
  };

  E.previewPurchaseCancel = (s, id) => {
    const p = s.purchases.find((x) => x.id === id), rows = E.purchaseInstallments(s, id).filter((r) => !r.cancelled);
    const paid = rows.filter((r) => r.lock === 'paid'), closed = rows.filter((r) => r.lock === 'closed');
    return { blocked: !p ? 'Compra não encontrada.' : p.status === 'cancelled' ? 'Esta compra já foi cancelada.' : paid.length ? 'Há parcelas em fatura que já recebeu pagamento. Para devolver o dinheiro, use "Registrar estorno".' : null, closed: closed.map((r) => r.no), totalCents: rows.reduce((a, r) => a + r.tx.amountCents, 0), count: rows.length, due: rows.map((r) => r.tx.invoiceDue) };
  };
  E.cancelPurchase = (s, id, opts = {}) => {
    const pv = E.previewPurchaseCancel(s, id); if (pv.blocked) throw new Error(pv.blocked);
    if (pv.closed.length && !opts.allowClosed) throw new Error('Há parcelas em fatura fechada. Confirme que quer cancelar mesmo assim.');
    const p = s.purchases.find((x) => x.id === id);
    s.tx.filter((t) => t.purchaseId === id && t.status !== 'cancelled').forEach((t) => { t.status = 'cancelled'; hist(t, 'compra cancelada pelo usuário'); });
    p.status = 'cancelled'; phist(p, 'compra cancelada' + (pv.closed.length ? ' (inclui fatura fechada, confirmado pelo usuário)' : '')); return p;
  };
  // estorno: crédito na fatura (não mexe no saldo das contas e abate o "gasto")
  E.refundPurchase = (s, id, { amountCents, date }) => {
    needAmount(amountCents);
    const p = s.purchases.find((x) => x.id === id); if (!p || p.status === 'cancelled') throw new Error('Compra não encontrada.');
    const left = E.refundable(s, id);
    if (amountCents > left) throw new Error(`O estorno não pode passar do valor da compra (restam ${E.brl(left)}).`);
    const card = s.cards.find((c) => c.id === p.cardId), d = date || E.today(), inv = E.invoiceFor(card, d);
    const t = { id: E.uid(), kind: 'refund', context: p.context || card.context, desc: 'Estorno: ' + p.desc, categoryId: p.categoryId, amountCents, cardId: card.id, invoiceDue: inv.dueDate, purchaseDate: d, dueDate: inv.dueDate, paidDate: d, status: 'paid', purchaseId: id, history: [] };
    s.tx.push(t); hist(t, 'estorno registrado'); phist(p, `estorno de ${E.brl(amountCents)} na fatura de ${E.fmtDate(inv.dueDate)}`); return t;
  };

  E.cardSummary = (s, card, today = E.today()) => {
    const invs = E.invoices(s, card.id), lim = E.cardLimit(s, card);
    const open = invs.find((i) => i.status === 'open'), cur = open || null;
    const closedCents = invs.filter((i) => i.status === 'closed' && i.remainingCents > 0 && (!cur || i.dueDate < cur.dueDate)).reduce((a, i) => a + i.remainingCents, 0);
    const futureCents = invs.filter((i) => i.remainingCents > 0 && cur && i.dueDate > cur.dueDate).reduce((a, i) => a + i.remainingCents, 0);
    const spentMonthCents = s.tx.filter((t) => t.cardId === card.id && (t.kind === 'expense' || t.kind === 'refund') && t.status !== 'cancelled' && E.ym(t.purchaseDate) === E.ym(today)).reduce((a, t) => a + (t.kind === 'refund' ? -t.amountCents : t.amountCents), 0);
    return { limitCents: card.limitCents, usedCents: lim.usedCents, availableCents: lim.availableCents, current: cur, currentCents: cur ? cur.totalCents : 0, closedCents, futureCents, spentMonthCents };
  };

  const norm = (x) => String(x == null ? '' : x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  E.cardEntries = (s, f = {}, ctx = 'all') => {
    const maps = {}, pmap = {}; (s.purchases || []).forEach((p) => { pmap[p.id] = p; });
    const q = norm(f.q).trim();
    const rows = [];
    s.tx.forEach((t) => {
      if (!t.cardId || (t.kind !== 'expense' && t.kind !== 'refund') || !inCtx(t, ctx)) return;
      if (t.status === 'cancelled' && !f.includeCancelled) return;
      const card = s.cards.find((c) => c.id === t.cardId); if (!card) return;
      const p = pmap[t.purchaseId], m = maps[card.id] || (maps[card.id] = invMap(s, card.id)), inv = m[t.invoiceDue];
      const cat = (s.categories.find((c) => c.id === t.categoryId) || {}).name || '';
      const r = { tx: t, purchase: p, card, desc: p ? p.desc : stripSfx(t.desc), merchant: p ? (p.merchant || '') : '', totalCents: p ? p.totalCents : t.amountCents, installmentCents: t.amountCents, no: t.installmentNo || 1, of: t.installmentTotal || 1, date: p ? p.date : t.purchaseDate, competence: t.purchaseDate, invoiceDue: t.invoiceDue, categoryName: cat,
        status: t.status === 'cancelled' ? 'cancelled' : t.kind === 'refund' ? 'refund' : (inv ? inv.status : 'open') };
      if (f.cardId && card.id !== f.cardId) return;
      if (f.month && E.ym(r.competence) !== f.month) return;
      if (f.invoice && r.invoiceDue !== f.invoice) return;
      if (f.categoryId && t.categoryId !== f.categoryId) return;
      if (f.merchant && !norm(r.merchant).includes(norm(f.merchant).trim())) return;
      if (f.type === 'installment' && r.of < 2) return;
      if (f.type === 'single' && r.of > 1) return;
      if (f.from && r.competence < f.from) return;
      if (f.to && r.competence > f.to) return;
      if (q) { const hay = norm([r.desc, r.merchant, cat, card.name, p && p.notes, E.brl(r.installmentCents), E.brl(r.totalCents), String(r.installmentCents / 100).replace('.', ',')].join(' ')); if (!q.split(/\s+/).every((w) => hay.includes(w))) return; }
      rows.push(r);
    });
    return rows.sort((a, b) => b.competence.localeCompare(a.competence) || b.date.localeCompare(a.date) || a.no - b.no);
  };


  // ───── 3) Orçamento por recebimento (plano de cada período)
  // s.plan = { income:[previsto dia A, previsto dia B], items:[{id,slot,name,kind,amountCents,dueDay,categoryId,active}], done:{'pk|itemId':true} }
  E.PLAN_KINDS = { fixed: 'Conta fixa', variable: 'Orçamento variável', card: 'Cartão (fatura)', reserve: 'Reserva de caixa', invest: 'Investimento', saving: 'Poupança' };
  const isAlloc = (k) => k === 'reserve' || k === 'invest' || k === 'saving';
  const nrm = (x) => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const planOf = (s) => { if (!s.plan) s.plan = { income: [0, 0], items: [], done: {} }; return s.plan; };
  E.planItems = (s, slot) => planOf(s).items.filter((i) => i.active !== false && (!slot || i.slot === slot));
  E.planAdd = (s, o) => {
    needAmount(o.amountCents);
    if (!(o.slot === 1 || o.slot === 2)) throw new Error('Escolha o recebimento (dia ' + E.cfg(s).payDays[0] + ' ou ' + E.cfg(s).payDays[1] + ').');
    if (!E.PLAN_KINDS[o.kind]) throw new Error('Escolha o tipo do item.');
    if (!o.name || !o.name.trim()) throw new Error('Dê um nome para o item.');
    if ((o.kind === 'fixed' || o.kind === 'card') && o.dueDay != null && o.dueDay !== '' && !(o.dueDay >= 1 && o.dueDay <= 31)) throw new Error('O dia do vencimento deve estar entre 1 e 31.');
    const it = { id: E.uid(), slot: o.slot, name: o.name.trim(), kind: o.kind, amountCents: o.amountCents, dueDay: (o.kind === 'fixed' || o.kind === 'card') && o.dueDay ? +o.dueDay : null, categoryId: o.categoryId || null, active: true };
    planOf(s).items.push(it); return it;
  };
  E.planEdit = (s, id, patch) => {
    const it = planOf(s).items.find((x) => x.id === id); if (!it) throw new Error('Item não encontrado.');
    if (patch.amountCents != null) needAmount(patch.amountCents);
    if (patch.name != null && !patch.name.trim()) throw new Error('Dê um nome para o item.');
    ['name', 'kind', 'amountCents', 'slot', 'dueDay', 'categoryId', 'active'].forEach((k) => { if (patch[k] !== undefined) it[k] = k === 'name' ? patch[k].trim() : patch[k]; });
    if (it.kind !== 'fixed' && it.kind !== 'card') it.dueDay = null;
    return it;
  };
  // tirar do plano nunca apaga lançamentos: o item só fica inativo (os gastos continuam existindo)
  E.planRemove = (s, id) => E.planEdit(s, id, { active: false });
  E.planSetIncome = (s, slot, cents) => { if (!(cents >= 0)) throw new Error('Informe um valor válido.'); planOf(s).income[slot - 1] = cents; };
  E.planSetDone = (s, pk, id, v) => { const d = planOf(s).done; if (v) d[pk + '|' + id] = true; else delete d[pk + '|' + id]; };
  E.planTemplate = () => {
    const f = (slot, name, cents, dueDay, cat) => ({ slot, name, kind: 'fixed', amountCents: cents, dueDay, categoryId: cat });
    const v = (slot, name, cents, cat) => ({ slot, name, kind: 'variable', amountCents: cents, dueDay: null, categoryId: cat });
    const a = (slot, name, kind, cents) => ({ slot, name, kind, amountCents: cents, dueDay: null, categoryId: null });
    return { income: [378792, 267643], items: [
      f(1, 'Aluguel', 150000, 10, 'e_Moradia'), f(1, 'AABB Tênis', 7000, 10, 'e_Lazer'), f(1, 'Jiu-jítsu', 18000, 10, 'e_Saúde'), f(1, 'Inglês', 21586, 10, 'e_Educação'), f(1, 'Carro', 22500, 10, 'e_Veículos'),
      { slot: 1, name: 'Cartão reservado', kind: 'card', amountCents: 49200, dueDay: 13, categoryId: null },
      f(1, 'Internet', 10000, 15, 'e_Moradia'), f(1, 'Dízimo', 5000, 16, 'e_Outros'), f(1, 'Conta de luz', 30000, 23, 'e_Moradia'),
      v(1, 'Mercado', 50000, 'e_Alimentação'), v(1, 'Gasolina - parcela 1', 15506, 'e_Transporte'),
      f(2, 'Funcional', 17550, 25, 'e_Saúde'), f(2, 'Telefone', 18202, 26, 'e_Moradia'), f(2, 'Água', 12000, 27, 'e_Moradia'),
      v(2, 'Gasolina - parcela 2', 24494, 'e_Transporte'), v(2, 'Farmácia', 20000, 'e_Saúde'), v(2, 'Lazer', 35000, 'e_Lazer'), v(2, 'Cabelo', 12500, 'e_Outros'), v(2, 'Terapia', 10000, 'e_Saúde'),
      v(2, 'Manutenção do carro', 15000, 'e_Veículos'), f(2, 'Seguro', 26700, null, 'e_Veículos'), a(2, 'FII', 'invest', 12000), a(2, 'Reserva financeira', 'saving', 63900) ] };
  };
  // importa um modelo (ex.: a planilha do usuário). Só em plano vazio, para nunca duplicar nem sobrescrever.
  E.planImport = (s, tpl) => {
    const pl = planOf(s); if (pl.items.some((i) => i.active !== false)) throw new Error('Seu orçamento já tem itens. Importe só em um orçamento vazio.');
    pl.income = tpl.income.slice(); tpl.items.forEach((i) => E.planAdd(s, i)); return pl.items.length;
  };
  // quando uma despesa pertence a um período do orçamento
  const planDate = (t) => t.cardId ? t.purchaseDate : t.status === 'paid' ? t.paidDate : t.dueDate;
  const inPlanPeriod = (t, pk, range) => t.fund ? t.fund === pk : (planDate(t) >= range.start && planDate(t) <= range.end);
  // regras de associação (nesta ordem): 1) item escolhido no lançamento; 2) nome do item na descrição; 3) categoria, se for única entre os orçamentos variáveis do período
  E.planMatch = (s, pk, ctx = 'all') => {
    const q = E.parsePk(pk), range = E.periodRange(s, pk), all = E.planItems(s, q.slot), hasCard = all.some((i) => i.kind === 'card'), items = all.filter((i) => i.kind === 'fixed' || i.kind === 'variable');
    const txs = live(s, ctx).filter((t) => t.kind === 'expense' && inPlanPeriod(t, pk, range));
    const owner = {}, covered = {}, byName = items.slice().sort((a, b) => b.name.length - a.name.length);
    const varCat = {}; items.filter((i) => i.kind === 'variable' && i.categoryId).forEach((i) => { varCat[i.categoryId] = (varCat[i.categoryId] || []).concat(i); });
    txs.forEach((t) => {
      let it = t.planItemId && items.find((i) => i.id === t.planItemId);
      if (!it) { const d = nrm(t.desc); it = byName.find((i) => nrm(i.name).length >= 3 && d.includes(nrm(i.name))); }
      if (!it && t.categoryId && varCat[t.categoryId] && varCat[t.categoryId].length === 1) it = varCat[t.categoryId][0];
      if (it && hasCard && t.cardId && t.planItemId !== it.id) it = null;   // compra no cartão sem item escolhido fica por conta do "Cartão reservado"
      if (it) owner[t.id] = it.id; else if (hasCard && t.cardId) covered[t.id] = true;
    });
    return { txs, owner, covered };
  };
  E.planPeriod = (s, pk, ctx = 'all') => {
    const q = E.parsePk(pk), pl = planOf(s), range = E.periodRange(s, pk), { txs, owner, covered } = E.planMatch(s, pk, ctx);
    const val = (t) => t.status === 'paid' && !t.cardId ? (t.paidCents || t.amountCents) : t.amountCents;
    const isPaid = (t) => t.cardId || t.status === 'paid';
    const rows = E.planItems(s, q.slot).map((it) => {
      const mine = it.kind === 'card' ? [] : txs.filter((t) => owner[t.id] === it.id);
      let paid = mine.filter(isPaid).reduce((a, t) => a + val(t), 0), pending = mine.filter((t) => !isPaid(t)).reduce((a, t) => a + t.amountCents, 0);
      let status, committed, done = !!pl.done[pk + '|' + it.id];
      if (isAlloc(it.kind)) { status = done ? 'done' : 'todo'; committed = it.amountCents; }
      else if (it.kind === 'card') {
        const inv = s.cards.filter((c) => ctx === 'all' || c.context === ctx).flatMap((c) => E.invoices(s, c.id)).filter((i) => { const f = E.invoiceFundOf(s, i.cardId, i.dueDate); return f ? f === pk : (i.dueDate >= range.start && i.dueDate <= range.end); });
        paid = inv.reduce((a, i) => a + Math.min(i.paidCents, Math.max(i.totalCents, 0)), 0); pending = inv.reduce((a, i) => a + Math.max(i.remainingCents, 0), 0);
        const u = paid + pending; status = u > it.amountCents ? 'over' : u >= it.amountCents * 0.85 ? 'near' : 'ok'; committed = Math.max(it.amountCents, u);
      }
      else if (it.kind === 'fixed') { status = pending > 0 ? 'pending' : paid > 0 ? 'paid' : 'none'; committed = paid + pending > 0 ? paid + pending : it.amountCents; }
      else { const u = paid + pending; status = u > it.amountCents ? 'over' : u >= it.amountCents * 0.85 ? 'near' : 'ok'; committed = Math.max(it.amountCents, u); }
      return { item: it, plannedCents: it.amountCents, paidCents: paid, pendingCents: pending, usedCents: paid + pending, committedCents: committed, status, done, txIds: mine.map((t) => t.id) };
    });
    const sum = (f, k) => rows.filter(f).reduce((a, r) => a + r[k], 0), kindIs = (k) => (r) => r.item.kind === k;
    const off = txs.filter((t) => !owner[t.id] && !covered[t.id]), offCents = off.reduce((a, t) => a + (isPaid(t) ? val(t) : t.amountCents), 0);
    const sm = E.periodSummary(s, pk, ctx), incomePlanned = pl.income[q.slot - 1] || 0, incomeBase = incomePlanned || sm.expectedCents;
    const plannedTotal = sum(() => true, 'plannedCents'), committedTotal = sum(() => true, 'committedCents');
    return {
      pk, range, rows, off, offCents, incomePlanned, incomeRegistered: sm.expectedCents, incomeBase,
      fixedCents: sum(kindIs('fixed'), 'plannedCents'), variableCents: sum(kindIs('variable'), 'plannedCents'), cardCents: sum(kindIs('card'), 'plannedCents'), allocCents: sum((r) => isAlloc(r.item.kind), 'plannedCents'),
      plannedTotal, committedTotal, paidTotal: sum((r) => !isAlloc(r.item.kind), 'paidCents'),
      balanceCents: incomeBase - plannedTotal,                         // sobra do plano, como na planilha
      realBalanceCents: incomeBase - committedTotal - offCents,         // sobra considerando o que já aconteceu e gastos fora do plano
    };
  };
  E.planInsights = (s, ctx, today = E.today()) => {
    const out = [], pl = planOf(s); if (!pl.items.some((i) => i.active !== false)) return out;
    const np = E.nextPayday(s, today), cur = E.slotOfDate(s, today), curPk = E.pk(E.ym(today), cur);
    [curPk, np.pk].filter((x, i, a) => a.indexOf(x) === i).forEach((pk) => {
      const P = E.planPeriod(s, pk, ctx), dia = E.cfg(s).payDays[E.parsePk(pk).slot - 1];
      if (P.balanceCents < 0) out.push({ level: 'warn', text: `O orçamento do dia ${dia} passa do rendimento em ${E.brl(-P.balanceCents)}.` });
      P.rows.filter((r) => r.status === 'over').forEach((r) => out.push({ level: 'bad', text: `${r.item.name} passou do orçado: ${E.brl(r.usedCents)} de ${E.brl(r.plannedCents)}.` }));
    });
    return out;
  };
  // lança as contas fixas do orçamento como "a pagar", ligadas ao recebimento do plano. Nunca duplica.
  E.planGenerate = (s, ym, { accountId, context = 'personal' } = {}) => {
    if (!accountId) throw new Error('Escolha a conta de onde essas contas saem.');
    const made = [], skipped = [];
    [1, 2].forEach((slot) => {
      const pk = E.pk(ym, slot), startD = E.paydayDate(s, pk);
      E.planItems(s, slot).filter((i) => i.kind === 'fixed' && i.dueDay).forEach((i) => {
        let due = ym + '-' + pad(Math.min(i.dueDay, E.daysInMonth(+ym.slice(0, 4), +ym.slice(5, 7))));
        if (due < startD) { const n = E.addMonths(ym + '-01', 1); due = n.slice(0, 7) + '-' + pad(Math.min(i.dueDay, E.daysInMonth(+n.slice(0, 4), +n.slice(5, 7)))); }
        if (s.tx.some((t) => t.planItemId === i.id && t.dueDate === due && t.kind === 'expense')) { skipped.push(i.name); return; }
        if (s.tx.some((t) => t.kind === 'expense' && t.status !== 'cancelled' && !t.cardId && t.dueDate && t.dueDate.slice(0, 7) === due.slice(0, 7) && nrm(t.desc) === nrm(i.name))) { skipped.push(i.name); return; }   // já existe nesse mês
        const [t] = E.addExpense(s, { desc: i.name, amountCents: i.amountCents, categoryId: i.categoryId || 'e_Outros', method: 'pix', accountId, date: due, dueDate: due, paid: false, fund: pk, context, planItemId: i.id });
        (t.history = t.history || []).push({ at: new Date().toISOString(), what: 'criada a partir do orçamento' }); made.push(t);
      });
    });
    return { made, skipped };
  };

  // ───── 4) Limites por categoria vindos do orçamento + exclusão total de compra no cartão
  // soma, por categoria, tudo que o orçamento reserva (contas fixas + variáveis dos dois recebimentos)
  E.planCategoryBudgets = (s) => {
    const m = {}; E.planItems(s).filter((i) => (i.kind === 'fixed' || i.kind === 'variable') && i.categoryId).forEach((i) => { m[i.categoryId] = (m[i.categoryId] || 0) + i.amountCents; });
    return m;
  };
  // preenche limites vazios (nunca sobrescreve um limite que o usuário já definiu, a menos que opts.overwrite)
  E.planFillBudgets = (s, fromYm, months = 12, opts = {}) => {
    const cat = E.planCategoryBudgets(s); let n = 0;
    for (let k = 0; k < months; k++) {
      const ym = E.addMonths(fromYm + '-01', k).slice(0, 7);
      Object.entries(cat).forEach(([c, cents]) => { const key = ym + '|' + c; if (opts.overwrite || !s.budgets[key]) { if (s.budgets[key] !== cents) n++; s.budgets[key] = cents; } });
    }
    return n;
  };
  E.previewPurchaseDelete = (s, id) => {
    const p = (s.purchases || []).find((x) => x.id === id); if (!p) return { blocked: 'Compra não encontrada.' };
    const txs = s.tx.filter((t) => t.purchaseId === id), m = invMap(s, p.cardId), live2 = txs.filter((t) => t.status !== 'cancelled');
    const locks = live2.map((t) => E.lockOf(m[t.invoiceDue]));
    const inst = txs.filter((t) => t.kind === 'expense'), ref = txs.filter((t) => t.kind === 'refund');
    return { purchase: p, blocked: locks.includes('paid') ? 'Há parcelas em fatura que já recebeu pagamento. Excluir tudo faria o valor pago ficar sem compra. Use "Registrar estorno" para devolver o dinheiro.' : null,
      closed: locks.includes('closed'), count: inst.length, refunds: ref.length, totalCents: inst.filter((t) => t.status !== 'cancelled').reduce((a, t) => a + t.amountCents, 0), dues: [...new Set(txs.map((t) => t.invoiceDue))] };
  };
  // apaga de vez: compra, parcelas e estornos ligados a ela. As faturas se recalculam sozinhas e não sobra nenhum valor.
  E.deletePurchase = (s, id, opts = {}) => {
    const pv = E.previewPurchaseDelete(s, id); if (pv.blocked) throw new Error(pv.blocked);
    if (pv.closed && !opts.allowClosed) throw new Error('Há parcelas em fatura fechada. Confirme que quer excluir mesmo assim.');
    const p = pv.purchase, cardId = p.cardId;
    s.tx = s.tx.filter((t) => t.purchaseId !== id); s.purchases = s.purchases.filter((x) => x.id !== id);
    pv.dues.forEach((d) => { if (!s.tx.some((t) => t.cardId === cardId && t.invoiceDue === d) && s.invoiceFund) delete s.invoiceFund[cardId + '|' + d]; });
    (s.log = s.log || []).push({ at: new Date().toISOString(), what: `compra excluída: ${p.desc} (${pv.count} parcela${pv.count === 1 ? '' : 's'}, ${E.brl(p.totalCents)})` });
    return pv;
  };

  // ───── 5) Contas mensais a partir do orçamento (com vencimento) + parar/ajustar uma conta mensal
  const dueIn = (ym, day) => ym + '-' + pad(Math.min(day, E.daysInMonth(+ym.slice(0, 4), +ym.slice(5, 7))));
  E.planRecurrenceCandidates = (s) => E.planItems(s).filter((i) => i.kind === 'fixed' && i.dueDay && !s.recurrences.some((r) => r.planItemId === i.id && !r.ended));
  E.planRecurrences = (s, { accountId, context = 'personal', today = E.today(), includePast = false } = {}) => {
    if (!accountId) throw new Error('Escolha a conta de onde essas contas saem.');
    const made = [], skipped = [];
    E.planItems(s).filter((i) => i.kind === 'fixed' && i.dueDay).forEach((i) => {
      if (s.recurrences.some((r) => r.planItemId === i.id && !r.ended)) { skipped.push(i.name); return; }
      const man = s.recurrences.find((r) => !r.ended && !r.planItemId && r.kind === 'expense' && nrm(r.desc) === nrm(i.name));
      if (man) { man.planItemId = i.id; if (!man.fundSlot) man.fundSlot = i.slot; s.tx.filter((t) => t.recurrenceId === man.id && !t.planItemId).forEach((t) => { t.planItemId = i.id; }); skipped.push(i.name); return; }   // já existe uma conta mensal igual: só ligamos ao orçamento
      let start = dueIn(today.slice(0, 7), i.dueDay);
      if (start < today && !includePast) start = dueIn(E.addMonths(today.slice(0, 8) + '01', 1).slice(0, 7), i.dueDay);
      made.push(E.addRecurring(s, { kind: 'expense', desc: i.name, amountCents: i.amountCents, accountId, categoryId: i.categoryId || 'e_Outros', day: i.dueDay, context, startDate: start, fundSlot: i.slot, planItemId: i.id, today }));
    });
    return { made, skipped };
  };
  // parar: nada é apagado. Contas futuras ainda não pagas são canceladas; as já pagas ficam.
  E.stopRecurring = (s, id, today = E.today()) => {
    const r = s.recurrences.find((x) => x.id === id); if (!r) throw new Error('Conta mensal não encontrada.');
    r.ended = true; let n = 0;
    s.tx.filter((t) => t.recurrenceId === id && t.status === 'pending' && t.dueDate >= today).forEach((t) => { t.status = 'cancelled'; hist(t, 'conta mensal encerrada'); n++; });
    return n;
  };
  // ajustar valor: vale para a recorrência e para as contas futuras ainda não pagas
  E.editRecurringAmount = (s, id, cents, today = E.today()) => {
    needAmount(cents); const r = s.recurrences.find((x) => x.id === id); if (!r) throw new Error('Conta mensal não encontrada.');
    const old = r.amountCents; r.amountCents = cents; let n = 0;
    s.tx.filter((t) => t.recurrenceId === id && t.status === 'pending' && t.dueDate >= today).forEach((t) => { hist(t, `valor: ${E.brl(t.amountCents)} → ${E.brl(cents)} (ajuste da conta mensal)`); t.amountCents = cents; n++; });
    return n;
  };

  // ───── 6) Atualizar o orçamento com uma nova versão da planilha (sem perder vínculos) + cartões: editar e limpar
  // Itens iguais mantêm o mesmo id, então contas mensais, lançamentos e marcações continuam ligados. Itens que saíram só ficam inativos.
  E.planUpdate = (s, tpl, today = E.today()) => {
    const pl = planOf(s), oldCat = E.planCategoryBudgets(s), olds = pl.items.filter((i) => i.active !== false), claimed = new Set(), changes = [];
    const find = (n) => {
      const k = nrm(n.name), free = olds.filter((i) => !claimed.has(i.id));
      return free.find((i) => nrm(i.name) === k && i.slot === n.slot) || (free.filter((i) => nrm(i.name) === k).length === 1 ? free.find((i) => nrm(i.name) === k) : null) || free.find((i) => i.slot === n.slot && k.startsWith(nrm(i.name) + ' ')) || null;
    };
    const day = (sl) => 'dia ' + E.cfg(s).payDays[sl - 1];
    tpl.items.forEach((n) => {
      const o = find(n);
      if (!o) { const it = E.planAdd(s, n); claimed.add(it.id); changes.push({ type: 'novo', name: n.name, text: `${E.brl(n.amountCents)} no ${day(n.slot)}` }); return; }
      claimed.add(o.id); const d = [];
      if (o.amountCents !== n.amountCents) d.push(`${E.brl(o.amountCents)} → ${E.brl(n.amountCents)}`);
      if (o.slot !== n.slot) d.push(`${day(o.slot)} → ${day(n.slot)}`);
      if ((o.dueDay || null) !== (n.dueDay || null)) d.push(`vencimento ${o.dueDay ? 'dia ' + o.dueDay : 'a definir'} → ${n.dueDay ? 'dia ' + n.dueDay : 'a definir'}`);
      if (o.kind !== n.kind) d.push(`tipo: ${E.PLAN_KINDS[o.kind]} → ${E.PLAN_KINDS[n.kind]}`);
      if (o.name !== n.name) d.push(`nome: ${o.name} → ${n.name}`);
      if (d.length) changes.push({ type: 'alterado', name: n.name, text: d.join(' · ') });
      Object.assign(o, { name: n.name, kind: n.kind, amountCents: n.amountCents, slot: n.slot, dueDay: (n.kind === 'fixed' || n.kind === 'card') ? (n.dueDay || null) : null, categoryId: n.categoryId || null, active: true });
    });
    olds.filter((i) => !claimed.has(i.id)).forEach((i) => { i.active = false; changes.push({ type: 'removido', name: i.name, text: `${E.brl(i.amountCents)} (${day(i.slot)}) sai do orçamento` }); });
    if (!pl.income[0] && !pl.income[1] && tpl.income) pl.income = tpl.income.slice();
    // limites por categoria: troca só os que ainda estão como o orçamento antigo calculou (nunca os que você definiu); preenche os vazios
    const newCat = E.planCategoryBudgets(s), ym0 = today.slice(0, 7);
    Object.keys(s.budgets).forEach((key) => { const [ym, cat] = key.split('|'); if (ym >= ym0 && oldCat[cat] !== undefined && s.budgets[key] === oldCat[cat]) { if (newCat[cat] === undefined) delete s.budgets[key]; else s.budgets[key] = newCat[cat]; } });
    E.planFillBudgets(s, ym0, 12);
    const sync = E.planSyncBills(s, today);
    return { changes, sync };
  };
  // acerta contas mensais e contas a pagar (ainda não pagas) ligadas aos itens do orçamento
  E.planSyncBills = (s, today = E.today()) => {
    const byId = {}; planOf(s).items.forEach((i) => { byId[i.id] = i; }); const out = { recurrences: 0, bills: 0, cancelled: 0, created: 0 };
    s.recurrences.filter((r) => r.planItemId && !r.ended).forEach((r) => {
      const it = byId[r.planItemId];
      if (!it || it.active === false || it.kind !== 'fixed' || !it.dueDay) { E.stopRecurring(s, r.id, today); out.cancelled++; return; }
      if (r.amountCents !== it.amountCents || r.day !== it.dueDay || r.fundSlot !== it.slot || r.desc !== it.name) out.recurrences++;
      Object.assign(r, { amountCents: it.amountCents, day: it.dueDay, fundSlot: it.slot, categoryId: it.categoryId || r.categoryId, desc: it.name });
    });
    const ms = today.slice(0, 7) + '-01';
    s.tx.filter((t) => t.planItemId && t.kind === 'expense' && t.status === 'pending' && t.dueDate >= ms).forEach((t) => {
      const it = byId[t.planItemId];
      if (!it || it.active === false) { t.status = 'cancelled'; hist(t, 'item saiu do orçamento'); out.cancelled++; return; }
      let ch = false;
      if (t.amountCents !== it.amountCents) { hist(t, `valor: ${E.brl(t.amountCents)} → ${E.brl(it.amountCents)} (orçamento atualizado)`); t.amountCents = it.amountCents; ch = true; }
      if (it.kind === 'fixed' && it.dueDay) { const nd = dueIn(t.dueDate.slice(0, 7), it.dueDay); if (nd !== t.dueDate) { if (t.purchaseDate === t.dueDate) t.purchaseDate = nd; t.dueDate = nd; ch = true; } }
      if (t.fund && E.parsePk(t.fund).slot !== it.slot) { t.fund = E.fundForSlot(s, t.dueDate, it.slot); ch = true; }
      if (ch) out.bills++;
    });
    // quem já usa contas mensais do orçamento ganha as dos itens novos, na mesma conta
    const ref = s.recurrences.find((r) => r.planItemId && !r.ended);
    if (ref) { out.created = E.planRecurrences(s, { accountId: ref.accountId, context: ref.context, today }).made.length; }
    E.generateRecurring(s, today, 12);
    return out;
  };
  // mostra o que mudaria, sem alterar nada
  E.planPreviewUpdate = (s, tpl, today = E.today()) => E.planUpdate(JSON.parse(JSON.stringify(s)), tpl, today);

  E.editCard = (s, id, o) => {
    const c = s.cards.find((x) => x.id === id); if (!c) throw new Error('Cartão não encontrado.');
    if (o.name !== undefined && !String(o.name).trim()) throw new Error('Dê um nome para o cartão.');
    if (o.limitCents !== undefined && !(o.limitCents >= 0)) throw new Error('Informe um limite válido.');
    const cd = o.closingDay === undefined ? c.closingDay : o.closingDay, dd = o.dueDay === undefined ? c.dueDay : o.dueDay;
    if (!(cd >= 1 && cd <= 28 && dd >= 1 && dd <= 28)) throw new Error('Dias de fechamento e vencimento devem estar entre 1 e 28.');
    if (o.name !== undefined) c.name = String(o.name).trim(); if (o.limitCents !== undefined) c.limitCents = o.limitCents; c.closingDay = cd; c.dueDay = dd; return c;
  };
  // o que "Limpar valores" da aba Cartões vai apagar
  E.previewClearCards = (s) => {
    const cx = s.tx.filter((t) => t.cardId), pay = s.tx.filter((t) => t.kind === 'invoice_payment' && t.cardRef);
    return { cards: s.cards.length, purchases: (s.purchases || []).length, installments: cx.filter((t) => t.kind === 'expense' && t.status !== 'cancelled').length, refunds: cx.filter((t) => t.kind === 'refund').length, payments: pay.length, paymentsCents: pay.filter((t) => t.status === 'paid').reduce((a, t) => a + t.amountCents, 0), limitsCents: s.cards.reduce((a, c) => a + (c.limitCents || 0), 0) };
  };
  // zera a aba: compras, parcelas, estornos e pagamentos de fatura somem; os cartões continuam cadastrados, com limite zerado.
  // Devolve um "pacote de desfazer" para o app guardar.
  E.clearCards = (s) => {
    const snap = { at: new Date().toISOString(), tx: s.tx.filter((t) => t.cardId || (t.kind === 'invoice_payment' && t.cardRef)), purchases: (s.purchases || []).slice(), invoiceFund: JSON.parse(JSON.stringify(s.invoiceFund || {})), limits: {} };
    s.cards.forEach((c) => { snap.limits[c.id] = c.limitCents; c.limitCents = 0; });
    const ids = new Set(snap.tx.map((t) => t.id)); s.tx = s.tx.filter((t) => !ids.has(t.id)); s.purchases = []; s.invoiceFund = {};
    (s.log = s.log || []).push({ at: snap.at, what: `cartões zerados: ${snap.purchases.length} compras, ${snap.tx.length} lançamentos` });
    return snap;
  };
  E.restoreCards = (s, snap) => {
    const have = new Set(s.tx.map((t) => t.id)); snap.tx.forEach((t) => { if (!have.has(t.id)) s.tx.push(t); });
    const hp = new Set((s.purchases || []).map((p) => p.id)); snap.purchases.forEach((p) => { if (!hp.has(p.id)) s.purchases.push(p); });
    s.invoiceFund = Object.assign({}, snap.invoiceFund, s.invoiceFund || {});
    s.cards.forEach((c) => { if (snap.limits[c.id] !== undefined && !c.limitCents) c.limitCents = snap.limits[c.id]; });
    (s.log = s.log || []).push({ at: new Date().toISOString(), what: 'limpeza dos cartões desfeita' });
    return snap.tx.length;
  };

  // ───── 7) Itens repetidos: achar e corrigir (nada é apagado: o repetido é cancelado/encerrado e dá para desfazer)
  const dupKeep = (arr) => arr.slice().sort((a, b) => (b.planItemId ? 1 : 0) - (a.planItemId ? 1 : 0) || (b.recurrenceId ? 1 : 0) - (a.recurrenceId ? 1 : 0) || (s0idx.get(a) - s0idx.get(b)))[0];
  let s0idx = new Map();
  E.findDuplicates = (s, ctx = 'all') => {
    s0idx = new Map(); s.tx.forEach((t, i) => s0idx.set(t, i)); s.recurrences.forEach((r, i) => s0idx.set(r, i)); planOf(s).items.forEach((x, i) => s0idx.set(x, i));
    const out = { recurrences: [], bills: [], planItems: [], total: 0 };
    const grp = (arr, keyf) => { const m = {}; arr.forEach((x) => { const k = keyf(x); (m[k] = m[k] || []).push(x); }); return Object.values(m).filter((g) => g.length > 1); };
    // contas mensais iguais (mesmo nome e tipo)
    grp(s.recurrences.filter((r) => !r.ended && (ctx === 'all' || r.context === ctx)), (r) => r.kind + '|' + nrm(r.desc)).forEach((g) => { const keep = dupKeep(g); out.recurrences.push({ name: keep.desc, keep, drop: g.filter((x) => x !== keep) }); });
    // itens do orçamento repetidos
    grp(planOf(s).items.filter((i) => i.active !== false), (i) => nrm(i.name) + '|' + i.slot).forEach((g) => { const keep = dupKeep(g); out.planItems.push({ name: keep.name, keep, drop: g.filter((x) => x !== keep) }); });
    // contas (a pagar/receber) iguais: mesmo nome e tipo no mesmo mês, com o mesmo vencimento ou o mesmo valor
    const droppedByRec = new Set(); out.recurrences.forEach((x) => x.drop.forEach((r) => droppedByRec.add(r.id)));
    const cand = s.tx.filter((t) => t.status !== 'cancelled' && (t.kind === 'expense' || t.kind === 'income') && !t.cardId && t.dueDate && (ctx === 'all' || t.context === ctx) && !(t.recurrenceId && droppedByRec.has(t.recurrenceId) && t.status === 'pending'));
    grp(cand, (t) => t.kind + '|' + nrm(t.desc) + '|' + t.dueDate.slice(0, 7)).forEach((g) => {
      const par = g.map((_, i) => i), f = (i) => (par[i] === i ? i : (par[i] = f(par[i])));
      for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) if (g[i].dueDate === g[j].dueDate || g[i].amountCents === g[j].amountCents) par[f(i)] = f(j);
      const cl = {}; g.forEach((t, i) => { (cl[f(i)] = cl[f(i)] || []).push(t); });
      Object.values(cl).filter((c) => c.length > 1).forEach((c) => {
        const paid = c.filter((t) => t.status === 'paid'), pend = c.filter((t) => t.status === 'pending'); if (!pend.length) return;
        const keep = paid.length ? paid[0] : dupKeep(pend), drop = pend.filter((t) => t !== keep);
        if (drop.length) out.bills.push({ name: keep.desc, keep, drop });
      });
    });
    out.total = out.recurrences.reduce((a, x) => a + x.drop.length, 0) + out.bills.reduce((a, x) => a + x.drop.length, 0) + out.planItems.reduce((a, x) => a + x.drop.length, 0);
    return out;
  };
  E.fixDuplicates = (s, ctx = 'all', today = E.today()) => {
    const d = E.findDuplicates(s, ctx), undo = { rec: [], tx: [], items: [] }, pendBefore = new Set(s.tx.filter((t) => t.status === 'pending').map((t) => t.id));
    d.recurrences.forEach((x) => x.drop.forEach((r) => { E.stopRecurring(s, r.id, today); undo.rec.push(r.id); }));
    d.planItems.forEach((x) => x.drop.forEach((i) => { i.active = false; undo.items.push(i.id); }));
    if (d.planItems.length) E.planSyncBills(s, today);
    s.tx.filter((t) => pendBefore.has(t.id) && t.status === 'cancelled').forEach((t) => { undo.tx.push(t.id); hist(t, 'repetida: cancelada na verificação'); });
    const d2 = E.findDuplicates(s, ctx);     // o que sobrou depois de encerrar as contas mensais repetidas
    d2.bills.forEach((x) => x.drop.forEach((t) => { t.status = 'cancelled'; hist(t, 'repetida: cancelada na verificação'); undo.tx.push(t.id); }));
    (s.log = s.log || []).push({ at: new Date().toISOString(), what: `verificação de repetidos: ${undo.rec.length} contas mensais, ${undo.tx.length} contas, ${undo.items.length} itens do orçamento` });
    return { recurrences: undo.rec.length, bills: undo.tx.length, planItems: undo.items.length, undo };
  };
  E.undoFixDuplicates = (s, undo) => {
    let n = 0; s.recurrences.filter((r) => undo.rec.includes(r.id)).forEach((r) => { r.ended = false; });
    s.tx.filter((t) => undo.tx.includes(t.id) && t.status === 'cancelled').forEach((t) => { t.status = 'pending'; hist(t, 'restaurada (verificação desfeita)'); n++; });
    planOf(s).items.filter((i) => undo.items.includes(i.id)).forEach((i) => { i.active = true; });
    return n;
  };

  // ───── 8) casal: resumo compartilhável (sem descrições de compras nem dados de cartão) e consolidação
  E.coupleMonth = (s, ym, today = E.today()) => {
    const pd = E.cfg(s).payDays, periods = [1, 2].map((slot) => {
      const p = E.planPeriod(s, E.pk(ym, slot), 'all');
      return { slot, day: pd[slot - 1], incomeCents: p.incomeBase, plannedCents: p.plannedTotal, committedCents: p.committedTotal + p.offCents, paidCents: p.paidTotal, balanceCents: p.realBalanceCents };
    });
    const by = E.byCategory(s, ym, 'all'), bud = (s.budgets || {});
    const cats = Object.keys(by).filter((k) => by[k] > 0).map((k) => ({ id: k, name: (s.categories.find((c) => c.id === k) || {}).name || 'Sem categoria', cents: by[k] })).sort((a, b) => b.cents - a.cents);
    const ms = E.monthSummary(s, ym, 'all', today);
    return { periods, cats, incomeCents: periods[0].incomeCents + periods[1].incomeCents, plannedCents: periods[0].plannedCents + periods[1].plannedCents, spentCents: ms.spentCents, balanceCents: periods[0].balanceCents + periods[1].balanceCents };
  };
  E.coupleSummary = (s, today = E.today()) => {
    const ym = E.ym(today), months = {};
    [-1, 0, 1].forEach((d) => { const m = E.addMonths(ym + '-01', d).slice(0, 7); months[m] = E.coupleMonth(s, m, today); });
    const bills = E.upcoming(s, 45, 'all', today).filter((i) => i.type !== 'income').map((i) => ({ desc: i.type === 'invoice' ? i.desc : i.desc, dueDate: i.dueDate, cents: i.amountCents, overdue: !!i.overdue }));
    return { v: 1, name: (s.profile && s.profile.name) || '', today, payDays: E.cfg(s).payDays, months, bills, at: new Date().toISOString() };
  };
  // junta dois resumos (eu e o par) para um mês
  E.coupleMerge = (mine, other, ym) => {
    const a = mine.months[ym], b = other.months[ym];
    if (!a || !b) return null;
    const cat = {};
    [['me', a], ['other', b]].forEach(([w, m]) => m.cats.forEach((c) => { const k = c.name; cat[k] = cat[k] || { name: k, me: 0, other: 0 }; cat[k][w] += c.cents; }));
    const cats = Object.values(cat).sort((x, y) => (y.me + y.other) - (x.me + x.other));
    const sum = (k) => a[k] + b[k];
    const bills = mine.bills.map((x) => ({ ...x, who: 'me' })).concat(other.bills.map((x) => ({ ...x, who: 'other' }))).sort((x, y) => x.dueDate.localeCompare(y.dueDate));
    return { ym, a, b, cats, incomeCents: sum('incomeCents'), plannedCents: sum('plannedCents'), spentCents: sum('spentCents'), balanceCents: sum('balanceCents'), bills, names: { me: mine.name, other: other.name } };
  };

  if (typeof module !== 'undefined') module.exports = E; else root.FC = E;
})(typeof window !== 'undefined' ? window : globalThis);
