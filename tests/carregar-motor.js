// Adaptador de testes: lê o arquivo js/motor.js (o "motor financeiro") e o carrega
// sem abrir navegador e sem tocar no app.
// Cada chamada devolve um motor "novo", isolado dos outros testes.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const codigoMotor = fs.readFileSync(path.join(__dirname, '..', 'js', 'motor.js'), 'utf8');

function carregarMotor(hoje = '2026-11-06') {
  const modulo = { exports: {} };
  vm.runInNewContext(codigoMotor, { module: modulo });
  const E = modulo.exports;
  E._fixed = hoje; // "congela" a data de hoje para os testes darem sempre o mesmo resultado
  return E;
}

module.exports = { carregarMotor };
