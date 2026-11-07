# Changelog — diário de alterações

Aqui ficam registradas, em linguagem simples, **todas** as mudanças do Finance Control.

- **Não publicado** = a mudança está pronta, mas ainda não foi enviada ao Cloudflare (o app no celular ainda não mudou).
- Cada versão publicada ganha a data do dia em que foi ao ar.

Tipos de mudança: **Adicionado** (novidade) · **Alterado** (algo que já existia mudou) · **Corrigido** (erro consertado) · **Removido** · **Segurança**.

---

## [Não publicado] — versão v9 (inclui v5 a v8)

### Corrigido
- **Não dava para sair dos formulários** (Nova entrada, Despesa, Configurações etc.): eles só fechavam tocando na área escura de cima, e nos formulários compridos essa área ficava escondida atrás do relógio do iPhone. Agora **todos os formulários têm um botão "X"** no canto superior direito, que continua visível ao rolar. Tocar fora continua funcionando. O X fecha sem salvar.
- **Campo de data passando da tela no iPhone** ("Quando?"): aplicada a correção conhecida para esse comportamento do iPhone (a confirmar no celular, porque o navegador de teste não reproduz).
- Etiqueta de versão `?v=9`.

### Também nesta versão (preparados como v8)

### Corrigido
- **Gastos de hoje não apareciam no quadro do Orçamento.** Dois motivos: (1) o quadro mostrava os períodos do mês do calendário — em 07/11, os períodos de novembro (10/11 e 25/11) ainda não tinham começado, e os gastos de hoje pertencem ao período do dia 25 de outubro (25/10 a 09/11); (2) o "gasto no período" usava só o "Já pago" do plano, que deixava de fora compras no cartão (até pagar a fatura) e gastos fora do plano.

### Alterado
- O quadro virou **"Seu orçamento agora"**: mostra o período de recebimento que está acontecendo (**agora**) e o seguinte (**próximo**), com as datas de cada um. Avança sozinho no dia do recebimento. Vale para os dias de cada pessoa (Renan 10/25, Duda 15/30).
- **"Gasto no período" soma tudo** o que foi gasto entre o início e o fim do período: compras no cartão (data da compra), contas pagas e gastos fora do plano — a mesma regra da aba Movimentos. "Fora do orçamento" continua mostrando a parte que não está no plano.
- 4 testes novos (total: 41). Etiqueta de versão `?v=8`.

### Também nesta versão (preparados como v7)

### Corrigido
- **Quadro do Orçamento com espaço vazio no topo** (tela Início): o título do quadro herdava o espaço que o app reserva para a área do relógio do iPhone (que só deve existir no topo da tela). No navegador de teste esse espaço é zero, por isso não aparecia nas conferências; agora a conferência simula o iPhone.

### Alterado
- **Quadro do Orçamento mais compacto** (≈30% mais baixo): "gasto no período" e "fora do orçamento" com letras um pouco menores e mais juntos; a "sobra no plano" continua em destaque. Nenhum número mudou.
- Etiqueta de versão `?v=7`.

### Também nesta versão (preparados como v6)

### Adicionado
- **"Fora do orçamento" no quadro do Orçamento** (tela Início): embaixo do "gasto no período" de cada recebimento, aparece o total de gastos ligados àquele recebimento que não se encaixam em nenhum item do plano — em amarelo quando há algum, em cinza quando é zero. É o mesmo número da linha "Gastos fora do orçamento" da aba Orçamento (que, ao tocar, mostra a lista). Conta também contas fora do plano ainda não pagas.
- Etiqueta de versão `?v=6`.

### Também nesta versão (preparados como v5)
- **"Gasto no período" no quadro do Orçamento** (tela Início): embaixo da "sobra no plano" de cada recebimento (Dia 10 e Dia 25), aparece quanto do dinheiro daquele recebimento já foi gasto. É o mesmo número da linha "Já pago" da aba Orçamento (contas do plano e faturas já pagas com aquele recebimento). Gastos fora do plano não entram nesse número — eles aparecem na linha "fora do orçamento", logo abaixo.
- **Corrigido — topo da tela sobreposto ao saldo ao rolar**: o topo ("Olá, Renan" e o seletor de visão) era transparente, e o saldo grande aparecia por trás. Agora ele tem fundo escuro meio transparente, como a barra de menu de baixo.
- Etiqueta de versão `?v=5`.

---

## [07/11/2026] — versão v4 no ar

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
