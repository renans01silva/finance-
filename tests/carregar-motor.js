// Adaptador de testes: lê o index.html e carrega SÓ o "motor financeiro" (o bloco <script>
// com o comentário "motor financeiro"), sem abrir navegador e sem tocar no app.
// Cada chamada devolve um motor "novo", isolado dos outros testes.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const blocos = [...HTML.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const codigoMotor = blocos.find((b) => b.includes('motor financeiro'));
if (!codigoMotor) throw new Error('Não encontrei o bloco "motor financeiro" no index.html.');

function carregarMotor(hoje = '2026-11-06') {
  const modulo = { exports: {} };
  vm.runInNewContext(codigoMotor, { module: modulo });
  const E = modulo.exports;
  E._fixed = hoje; // "congela" a data de hoje para os testes darem sempre o mesmo resultado
  return E;
}

module.exports = { carregarMotor };
