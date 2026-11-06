# Finance Control

App de finanças pessoais (e do casal), em português, feito para o celular.
Funciona no navegador e pode ser **instalado na tela inicial** (PWA).

🔗 **Acesso:** https://renans01silva.github.io/finance-/

## O que o app faz
- **Início:** saldo disponível, quanto vai sobrar no mês e alertas.
- **Movimentos:** receitas, despesas e transferências, com busca e filtros.
- **Contas a pagar:** vencimentos, contas recorrentes e confirmação de pagamento.
- **Cartões:** faturas, limite, compras parceladas, estornos e pagamento de fatura.
- **Orçamento e Planejamento:** quanto pode gastar por categoria e por período de recebimento (dias 10 e 25, configuráveis).
- **Recebimentos:** cada despesa ligada ao salário que vai pagá-la.
- **Relatórios:** gastos por categoria e evolução mês a mês.
- **Casal:** compartilha um resumo das finanças com o parceiro(a).
- **Visões:** Pessoal, Profissional ou Consolidado.
- **Aparência:** 6 paletas de cor, modo claro, escuro ou automático.
- **Privacidade:** botão para esconder o saldo da tela.

## Como funciona por dentro
| Parte | Onde |
|---|---|
| Telas, cores e lógica | `index.html` |
| Conexão com o banco de dados | `config.js` → [Supabase](docs/SUPABASE.md) |
| Instalação no celular | `manifest.webmanifest` + ícones |

Os dados ficam no aparelho e são sincronizados com o Supabase, com login por e-mail e senha.

## Documentação
- [`CLAUDE.md`](CLAUDE.md): instruções para o Claude Code.
- [`CHANGELOG.md`](CHANGELOG.md): histórico de alterações.
- [`docs/SUPABASE.md`](docs/SUPABASE.md): banco de dados e segurança.
- [`docs/GLOSSARIO.md`](docs/GLOSSARIO.md): termos técnicos explicados.

## Publicação
Tudo o que entra no branch `main` é publicado automaticamente pelo **GitHub Pages** em cerca de 1 a 2 minutos.
