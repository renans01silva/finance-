// Testes automáticos do motor financeiro.
// Como rodar (na pasta do projeto):  node --test tests/
// Cada "test" é uma prova: se o resultado do app for diferente do esperado, o teste falha e avisa.
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { carregarMotor } = require('./carregar-motor');

// Compara listas/objetos pelo CONTEÚDO (o motor roda isolado, então comparamos os valores, não a "caixa").
const igual = (atual, esperado) => assert.deepEqual(JSON.parse(JSON.stringify(atual)), esperado);

// Monta um cenário padrão: 1 conta com R$ 1.000,00 e 1 cartão (fecha dia 5, vence dia 12).
function cenario(hoje = '2026-11-06') {
  const E = carregarMotor(hoje);
  const s = E.newState();
  const conta = E.addAccount(s, { name: 'Nubank', openingCents: 100000 });
  const cartao = E.addCard(s, { name: 'Visa', limitCents: 500000, closingDay: 5, dueDay: 12, accountId: conta.id });
  return { E, s, conta, cartao };
}

describe('1. Dinheiro (sempre em centavos)', () => {
  const E = carregarMotor();

  test('converte texto em reais para centavos', () => {
    assert.equal(E.toCents('1.234,56'), 123456);
    assert.equal(E.toCents('10'), 1000);
    assert.equal(E.toCents('10,5'), 1050);
    assert.equal(E.toCents('R$ 85,90'), 8590);
    assert.equal(E.toCents(19.99), 1999);
  });

  test('texto sem números vira 0 — e valor 0 é recusado ao lançar', () => {
    assert.equal(E.toCents('abc'), 0);
    const s = E.newState();
    const conta = E.addAccount(s, { name: 'Conta' });
    assert.throws(() => E.addExpense(s, { amountCents: E.toCents('abc'), accountId: conta.id, desc: 'X' }));
  });

  test('mostra centavos no formato brasileiro', () => {
    assert.equal(E.brl(123456), 'R$ 1.234,56');
    assert.equal(E.brl(5), 'R$ 0,05');
    assert.equal(E.brl(-150000), '-R$ 1.500,00');
    assert.equal(E.brl(100000000), 'R$ 1.000.000,00');
  });

  test('divide parcelas sem perder nenhum centavo', () => {
    igual(E.splitCents(1000, 3), [334, 333, 333]);
    igual(E.splitCents(10000, 3), [3334, 3333, 3333]);
    for (const [total, n] of [[1, 2], [99999, 7], [12345, 12]]) {
      const partes = E.splitCents(total, n);
      assert.equal(partes.length, n);
      assert.equal(partes.reduce((a, b) => a + b, 0), total);
    }
  });
});

describe('2. Datas', () => {
  const E = carregarMotor();

  test('somar 1 mês em 31 de janeiro cai no último dia de fevereiro', () => {
    assert.equal(E.addMonths('2026-01-31', 1), '2026-02-28');
    assert.equal(E.addMonths('2028-01-31', 1), '2028-02-29'); // ano bissexto
  });

  test('virada de ano', () => {
    assert.equal(E.addMonths('2026-12-15', 1), '2027-01-15');
    assert.equal(E.addDays('2026-12-31', 1), '2027-01-01');
    assert.equal(E.addMonths('2026-03-10', -3), '2025-12-10');
  });

  test('diferença de dias e fim do mês', () => {
    assert.equal(E.diffDays('2026-11-01', '2026-11-30'), 29);
    assert.equal(E.endOfMonth('2026-02-10'), '2026-02-28');
    assert.equal(E.fmtDate('2026-11-06'), '06/11/2026');
  });
});

describe('3. Cartão e fatura', () => {
  test('compra até o dia do fechamento cai na fatura do mês; depois, na do mês seguinte', () => {
    const { E, cartao } = cenario();
    assert.equal(E.invoiceFor(cartao, '2026-11-05').dueDate, '2026-11-12');
    assert.equal(E.invoiceFor(cartao, '2026-11-06').dueDate, '2026-12-12');
  });

  test('cartão que vence antes do dia de fechamento: vencimento vai para o mês seguinte', () => {
    const { E, s, conta } = cenario();
    const c2 = E.addCard(s, { name: 'Master', limitCents: 100000, closingDay: 25, dueDay: 5, accountId: conta.id });
    assert.equal(E.invoiceFor(c2, '2026-11-10').dueDate, '2026-12-05');
  });

  test('parcelamento: 3x soma o total e cada parcela vai para uma fatura', () => {
    const { E, s, cartao } = cenario();
    const parcelas = E.addExpense(s, { amountCents: 10000, cardId: cartao.id, installments: 3, desc: 'TV', date: '2026-11-06' });
    assert.equal(parcelas.length, 3);
    assert.equal(parcelas.reduce((a, p) => a + p.amountCents, 0), 10000);
    igual(parcelas.map((p) => p.invoiceDue), ['2026-12-12', '2027-01-12', '2027-02-12']);
    igual(parcelas.map((p) => p.desc), ['TV (1/3)', 'TV (2/3)', 'TV (3/3)']);
  });

  test('pagar a fatura tira da conta, zera a fatura e NÃO conta como despesa nova', () => {
    const { E, s, conta, cartao } = cenario();
    E.addExpense(s, { amountCents: 20000, cardId: cartao.id, desc: 'Mercado', date: '2026-11-06' });
    const gastoAntes = E.monthSummary(s, '2026-11').spentCents;
    E.payInvoice(s, { cardId: cartao.id, dueDate: '2026-12-12', accountId: conta.id, amountCents: 20000, date: '2026-11-06' });
    const fatura = E.invoices(s, cartao.id).find((i) => i.dueDate === '2026-12-12');
    assert.equal(fatura.remainingCents, 0);
    assert.equal(fatura.status, 'paid');
    assert.equal(E.accountBalance(s, conta), 80000);
    assert.equal(E.monthSummary(s, '2026-11').spentCents, gastoAntes); // o gasto continua sendo só a compra
  });

  test('não deixa pagar mais do que o valor da fatura', () => {
    const { E, s, conta, cartao } = cenario();
    E.addExpense(s, { amountCents: 5000, cardId: cartao.id, desc: 'Farmácia', date: '2026-11-06' });
    assert.throws(() => E.payInvoice(s, { cardId: cartao.id, dueDate: '2026-12-12', accountId: conta.id, amountCents: 5001 }));
  });

  test('limite disponível desconta o que está nas faturas em aberto', () => {
    const { E, s, cartao } = cenario();
    E.addExpense(s, { amountCents: 30000, cardId: cartao.id, installments: 3, desc: 'Celular', date: '2026-11-06' });
    const lim = E.cardLimit(s, cartao);
    assert.equal(lim.usedCents, 30000);
    assert.equal(lim.availableCents, 470000);
  });

  test('dias de fechamento/vencimento fora de 1 a 28 são recusados', () => {
    const { E, s, conta } = cenario();
    assert.throws(() => E.addCard(s, { name: 'X', limitCents: 1000, closingDay: 30, dueDay: 10, accountId: conta.id }));
  });
});

describe('4. Saldo das contas', () => {
  test('receita recebida soma; receita a receber não soma', () => {
    const { E, s, conta } = cenario();
    E.addIncome(s, { amountCents: 50000, accountId: conta.id, desc: 'Salário', received: true });
    E.addIncome(s, { amountCents: 70000, accountId: conta.id, desc: 'Freela', dueDate: '2026-11-20' });
    assert.equal(E.accountBalance(s, conta), 150000);
  });

  test('conta a pagar só desconta depois de confirmada', () => {
    const { E, s, conta } = cenario();
    const [luz] = E.addExpense(s, { amountCents: 15000, accountId: conta.id, desc: 'Luz', dueDate: '2026-11-15' });
    assert.equal(E.accountBalance(s, conta), 100000);
    E.confirm(s, luz.id, { date: '2026-11-06' });
    assert.equal(E.accountBalance(s, conta), 85000);
  });

  test('transferência tira de uma conta e coloca na outra (total não muda)', () => {
    const { E, s, conta } = cenario();
    const poup = E.addAccount(s, { name: 'Poupança', openingCents: 0 });
    E.addTransfer(s, { amountCents: 30000, fromId: conta.id, toId: poup.id });
    assert.equal(E.accountBalance(s, conta), 70000);
    assert.equal(E.accountBalance(s, poup), 30000);
    assert.equal(E.totalAvailable(s, 'all'), 100000);
    assert.equal(E.monthSummary(s, '2026-11').spentCents, 0); // transferência não é gasto
  });

  test('lançamento cancelado não conta no saldo nem no gasto', () => {
    const { E, s, conta } = cenario();
    const [t] = E.addExpense(s, { amountCents: 9900, accountId: conta.id, desc: 'Cinema', paid: true });
    E.cancel(s, t.id);
    assert.equal(E.accountBalance(s, conta), 100000);
    assert.equal(E.monthSummary(s, '2026-11').spentCents, 0);
  });
});

describe('5. Regras de segurança', () => {
  test('não aceita valor zero ou negativo', () => {
    const { E, s, conta } = cenario();
    assert.throws(() => E.addExpense(s, { amountCents: 0, accountId: conta.id, desc: 'X' }));
    assert.throws(() => E.addIncome(s, { amountCents: -100, accountId: conta.id, desc: 'X' }));
  });

  test('despesa sem conta (e sem cartão) é recusada', () => {
    const { E, s } = cenario();
    assert.throws(() => E.addExpense(s, { amountCents: 1000, desc: 'X' }));
  });

  test('compra no cartão não pode ser "confirmada" fora da fatura', () => {
    const { E, s, cartao } = cenario();
    const [t] = E.addExpense(s, { amountCents: 1000, cardId: cartao.id, desc: 'Lanche' });
    assert.throws(() => E.confirm(s, t.id));
  });

  test('cancelar NÃO apaga: o lançamento continua guardado e o histórico registra', () => {
    const { E, s, conta } = cenario();
    const [t] = E.addExpense(s, { amountCents: 1000, accountId: conta.id, desc: 'Café' });
    const qtd = s.tx.length;
    E.cancel(s, t.id);
    assert.equal(s.tx.length, qtd);
    assert.equal(t.status, 'cancelled');
    assert.ok(t.history.some((h) => h.what === 'cancelada'));
  });

  test('transferência para a mesma conta é recusada', () => {
    const { E, s, conta } = cenario();
    assert.throws(() => E.addTransfer(s, { amountCents: 1000, fromId: conta.id, toId: conta.id }));
  });

  test('não deixa criar duas contas com o mesmo nome', () => {
    const { E, s } = cenario();
    assert.throws(() => E.addAccount(s, { name: 'nubank' }));
  });
});

describe('6. Contas recorrentes', () => {
  test('gera as contas dos próximos meses e não duplica se rodar de novo', () => {
    const { E, s, conta } = cenario();
    E.addRecurring(s, { kind: 'expense', desc: 'Aluguel', amountCents: 150000, accountId: conta.id, day: 10, startDate: '2026-11-01', today: '2026-11-06' });
    const qtd = s.tx.filter((t) => t.desc === 'Aluguel').length;
    assert.ok(qtd >= 12);
    assert.equal(E.generateRecurring(s, '2026-11-06', 12), 0);
    assert.equal(s.tx.filter((t) => t.desc === 'Aluguel').length, qtd);
  });

  test('dia 31 em fevereiro vira o último dia do mês', () => {
    const { E, s, conta } = cenario();
    E.addRecurring(s, { kind: 'expense', desc: 'Internet', amountCents: 9990, accountId: conta.id, day: 31, startDate: '2026-11-01', today: '2026-11-06' });
    const datas = s.tx.filter((t) => t.desc === 'Internet').map((t) => t.dueDate);
    assert.ok(datas.includes('2027-02-28'));
    assert.ok(datas.includes('2026-11-30'));
  });
});

describe('7. Migração de dados antigos', () => {
  test('dados antigos ganham os campos novos sem perder lançamentos', () => {
    const { E, s, cartao } = cenario();
    E.addExpense(s, { amountCents: 6000, cardId: cartao.id, installments: 2, desc: 'Tênis', date: '2026-11-06' });
    // simula um backup da versão antiga: sem "purchases", "plan", "settings" e sem o vínculo purchaseId
    delete s.purchases; delete s.plan; delete s.settings; delete s.invoiceFund; s.schema = 1;
    s.tx.forEach((t) => { delete t.purchaseId; });
    const qtd = s.tx.length;
    assert.equal(E.migrate(s), true);
    assert.equal(s.schema, 2);
    assert.equal(s.tx.length, qtd);
    assert.equal(s.purchases.length, 1);
    assert.equal(s.purchases[0].totalCents, 6000);
    igual(s.settings.payDays, [10, 25]);
  });

  test('rodar a migração de novo não muda nada', () => {
    const { E, s } = cenario();
    E.migrate(s);
    assert.equal(E.migrate(s), false);
  });
});

describe('8. Duplicidade', () => {
  test('avisa quando já existe lançamento igual (valor, descrição e data)', () => {
    const { E, s, conta } = cenario();
    E.addExpense(s, { amountCents: 4590, accountId: conta.id, desc: 'Padaria', date: '2026-11-06' });
    assert.ok(E.findDuplicate(s, { kind: 'expense', amountCents: 4590, desc: 'padaria', date: '2026-11-06' }));
    assert.equal(E.findDuplicate(s, { kind: 'expense', amountCents: 4591, desc: 'Padaria', date: '2026-11-06' }), undefined);
  });
});
