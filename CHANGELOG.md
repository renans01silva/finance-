# Changelog — diário de alterações

Aqui ficam registradas, em linguagem simples, **todas** as mudanças do Finance Control.

- **Não publicado** = a mudança está pronta, mas ainda não foi enviada ao Cloudflare (o app no celular ainda não mudou).
- Cada versão publicada ganha a data do dia em que foi ao ar.

Tipos de mudança: **Adicionado** (novidade) · **Alterado** (algo que já existia mudou) · **Corrigido** (erro consertado) · **Removido** · **Segurança**.

---

## [Não publicado] — versão v4

### Alterado
- **Aba Movimentos agora mostra só os gastos realizados** (compras no cartão e contas já pagas), com o **total do mês no topo** — o mesmo número do "Gasto" da tela Início. Compras no cartão mostram o cartão e a data da compra (antes mostravam a data da fatura, o que confundia).
  Saíram dessa lista: contas a pagar (estão na aba Contas), entradas (em Menu → Recebimentos) e transferências entre contas (não são gasto).
- **Dias de recebimento podem ir até 31** (antes: até 28). Em mês mais curto, o recebimento cai no último dia (ex.: dia 30 em fevereiro → 28, ou 29 em ano bissexto). Motivo: a Duda recebe nos dias 15 e 30. Cada pessoa ajusta os seus em Menu → Configurações → Dias de recebimento; os do Renan continuam 10 e 25.
- Etiqueta de versão `?v=4`.

### Adicionado
- 8 testes novos (total: 37): lista de gastos (o que entra e o que fica de fora; total igual ao da tela Início) e dias 30/31 em meses curtos.

---

## [06/11/2026] — Conta da esposa (sem mudança no app)

### Adicionado
- Conta da esposa do Renan criada pelo painel do Supabase (o cadastro pelo app está fechado de propósito, por segurança).
- `docs/SUPABASE.md`: passo a passo "Como criar a conta de alguém" e registro de que o cadastro público está fechado — por isso o "Confirm email" deixou de ser pendência.

---

## [06/11/2026] — Versão v3 no ar (código organizado + correção da barra)

> Publicada em Produção no Cloudflare (`finance-site-v3.zip`), depois de testada na versão prévia `teste.finance-renan.pages.dev`. Conferido no celular: login, dados e barra legível.

### Corrigido
- **Barra "Projeção negativa" sem texto** (tela Início, embaixo do saldo): o texto tinha a mesma cor rosa do fundo e ficava invisível (duas regras de cor disputavam; a errada ganhava). Agora a barra negativa tem fundo rosa clarinho e texto rosa forte, como os outros avisos do app — contraste 6,8 no modo escuro e 4,6 no claro (mínimo recomendado: 4,5). A barra azul "Vai sobrar" não mudou.
- Etiqueta de versão dos arquivos subiu para `?v=3`.

### Alterado
- **Código organizado em arquivos separados** (Fase 2). O `index.html` de ≈2.150 linhas virou:
  `index.html` (esqueleto, ≈20 linhas) + `css/estilo.css` (aparência) + `js/temas.js` (cores) + `js/motor.js` (cálculos) + `js/app.js` (telas).
  O conteúdo foi só recortado e colado — **o app funciona exatamente igual**.
- Conferências feitas: (1) juntando os pedaços de volta, o resultado é idêntico ao original; (2) os 29 testes passam; (3) a versão antiga e a nova abertas no navegador com os mesmos dados de exemplo mostram as 10 telas, o menu e os formulários **idênticos**, sem nenhum erro.
- Etiqueta de versão `?v=2` nos arquivos, para o celular não misturar arquivos velhos e novos.
- O `.zip` enviado ao Cloudflare agora leva só os arquivos do app (documentação e testes deixam de ficar públicos no site).

### Adicionado
- **Testes automáticos** (`tests/`): 29 provas que conferem sozinhas os cálculos do motor financeiro — dinheiro em centavos, datas, faturas e parcelamento, saldos, regras de segurança, contas recorrentes, migração de dados antigos e duplicidade. Resultado: **29 de 29 passando**, nenhum erro de cálculo encontrado.
- Conferido que os testes realmente pegam erros: estragando de propósito a divisão de parcelas (numa cópia), 2 testes falharam na hora.

> O app não mudou; não é preciso reenviar ao Cloudflare.

---

## [06/11/2026] — App movido para o Cloudflare Pages

### Alterado
- O app agora está em **https://finance-renan.pages.dev** (Cloudflare Pages).
  Motivo: a conta do GitHub foi suspensa, o que tirou do ar o endereço antigo (`renans01silva.github.io/finance-/`).
- O código do app **não mudou**: é a mesma versão de antes. Os dados continuam no Supabase e voltaram normalmente ao fazer login.
- Documentação (`README.md`, `CLAUDE.md`, `docs/SUPABASE.md`) atualizada com o endereço novo e o jeito novo de publicar (envio de `.zip`).

- Supabase: **Site URL** trocado de `http://localhost:3000` (padrão) para `https://finance-renan.pages.dev`, para os links de e-mail (confirmação de conta, recuperação de senha) abrirem o app.

### Adicionado
- `docs/GLOSSARIO.md`: termos novos (Cloudflare Pages, deploy, .zip, 404, domínio).

---

## [Não publicado no GitHub] — documentação inicial

### Adicionado
- `CLAUDE.md`: instruções que o Claude Code lê antes de programar (contexto do projeto, regras de negócio e o "modo professor" com plano obrigatório antes de cada mudança).
- `CHANGELOG.md`: este diário.
- `README.md`: apresentação do projeto no GitHub.
- `docs/GLOSSARIO.md`: dicionário de termos técnicos.
- `docs/SUPABASE.md`: diagnóstico do banco de dados (tabelas, regras de segurança, funções e pendências).

### Segurança
- Diagnóstico do Supabase (06/11/2026): todas as 4 tabelas com RLS ligado e regras corretas. Backup automático (trigger `app_state_keep_history`) confirmado ativo. Pendência: ligar "Confirm email" depois que a esposa criar a conta.

> Nenhuma linha do app foi alterada nesta etapa.

---

## [Antes do Changelog] — até 06/11/2026

Estado do app quando a documentação começou (histórico anterior feito por uploads, sem descrição):
- App completo em `index.html`: contas, receitas, despesas, transferências, cartões com faturas e parcelamento, estornos, contas recorrentes, orçamento, dois dias de recebimento (10 e 25), planejamento, relatórios, visões Pessoal/Profissional/Consolidado, função Casal, 6 paletas de cor com modo claro/escuro, ocultar saldo, backup/restauração, detecção e correção de duplicados.
- Login e sincronização na nuvem com Supabase.
- Publicado como PWA pelo GitHub Pages.
