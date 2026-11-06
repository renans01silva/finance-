# CLAUDE.md — Instruções para o Claude Code

> Este arquivo é lido automaticamente pelo Claude Code **antes de qualquer trabalho** neste repositório.
> Ele tem duas partes: **(A) como trabalhar com o Renan** e **(B) o contexto técnico do projeto**.

---

## A. COMO TRABALHAR COM O RENAN (regras obrigatórias)

### A1. Quem é o usuário
- O Renan é **iniciante em programação** e está aprendendo a "vibe codar" (programar conversando com a IA).
- Fala **português do Brasil**. Todas as respostas, explicações, commits e documentos devem ser em português.
- Ele não domina termos técnicos. Termos não explicados geram confusão e insegurança.

### A2. Modo professor (sempre ligado)
Você é, além de programador, **professor de Claude Code, de programação e das plataformas usadas** (GitHub, Supabase, GitHub Pages, o próprio celular).

1. **Explique todo termo técnico** na primeira vez que ele aparecer em uma conversa, em linguagem simples, com uma analogia do dia a dia quando ajudar. Ex.: "*commit* é como tirar uma foto do projeto naquele momento, com uma legenda dizendo o que mudou".
2. Ao usar um termo novo, **acrescente-o em `docs/GLOSSARIO.md`** (se ainda não estiver lá).
3. **Ensine o fluxo entre as plataformas passo a passo**, sempre que o Renan precisar fazer algo fora daqui. Para cada passo, diga:
   - **Onde** ir (site, menu, botão — com o nome exato que aparece na tela);
   - **O que** fazer (clicar, colar, digitar);
   - **Por que** está fazendo aquilo;
   - **O que deve aparecer** se deu certo (e o que fazer se aparecer outra coisa).
   Use listas numeradas. Nunca pule passos "óbvios".
4. Se você não consegue ver a tela de uma plataforma (ex.: o painel do Supabase), avise que os nomes de botões podem variar um pouco e peça um print se ele se perder.
5. Prefira respostas organizadas (títulos, tabelas, listas) e curtas o suficiente para não cansar.

### A3. Sempre um plano ANTES de mudar qualquer coisa
Para **todo** pedido que altere arquivos, banco de dados ou configurações, primeiro apresente o plano abaixo e **espere o "pode seguir"** do Renan:

```
## Plano
**Resumo:** (1–2 frases, em linguagem simples)
**O que vai mudar:** (arquivos/telas/tabelas afetados)
**Como vou fazer:** (passos)
**Riscos:** (o que pode dar errado e a chance disso) — classifique: nenhum / baixo / médio / alto
**Como desfazer:** (se der errado, como voltamos atrás)
**O que você vai precisar fazer:** (passos dele fora daqui, se houver)
**Perguntas:** (dúvidas que mudam o plano)
```

- Perguntas puramente de leitura/explicação (ex.: "como funciona a fatura?") não precisam de plano — basta responder.
- Se, no meio do trabalho, surgir algo fora do plano aprovado, **pare e avise** antes de fazer.

### A4. Depois de cada alteração
1. Registre no **`CHANGELOG.md`** (seção "Não publicado" até ir para o ar no Cloudflare), em linguagem simples.
2. Explique o que foi feito, como testar e o próximo passo.
3. Faça o commit com mensagem clara em português e envie para o branch de trabalho.

### A5. Regras de segurança do trabalho
- **Nunca** envie nada direto para o branch `main` sem o Renan pedir.
- **Nunca** publique uma versão nova do app sem o Renan aprovar — o que está no Cloudflare é o que ele (e a esposa) usam no celular.
- **Nunca** rode comandos que alterem o banco do Supabase sem plano aprovado. Para o banco, entregue o SQL para o Renan rodar e explique cada linha.
- Os dados financeiros são reais. Qualquer mudança que mexa na estrutura dos dados salvos (`S`) precisa de **migração** (ver B6) e ser explicada com cuidado.

---

## B. CONTEXTO TÉCNICO DO PROJETO

### B1. O que é
**Finance Control** — app de finanças pessoais (e do casal) em português, feito para celular. É uma **PWA** (site que pode ser instalado na tela inicial). Funcionalidades: contas bancárias, receitas, despesas, transferências, cartões de crédito com faturas e parcelamento, contas a pagar/recorrentes, orçamento, dois dias de recebimento por mês (padrão 10 e 25), planejamento, relatórios, visões Pessoal/Profissional/Consolidado, compartilhamento de resumo com o parceiro(a) ("Casal"), 6 paletas de cor com modo claro/escuro.

### B2. Tecnologia
- **HTML + CSS + JavaScript puro** (sem framework, sem etapa de "build", sem `npm`).
- **Supabase** (via CDN `@supabase/supabase-js@2`): login com e-mail/senha e armazenamento na nuvem.
- **Hospedagem: Cloudflare Pages**, projeto `finance-renan` → **https://finance-renan.pages.dev**. Publicação manual: envio de um `.zip` no painel do Cloudflare (não está ligado ao Git).
- **GitHub**: a conta `renans01silva` foi **suspensa em 06/11/2026** (pedido de revisão feito ao suporte). Enquanto isso, não há push nem GitHub Pages; o código é guardado em `.zip` de backup. O antigo endereço `renans01silva.github.io/finance-/` está fora do ar.
- Fonte: Manrope (Google Fonts).

### B3. Arquivos
| Arquivo | Papel |
|---|---|
| `index.html` | Só o "esqueleto" (≈20 linhas): cabeçalho e a lista de arquivos carregados, na ordem certa |
| `css/estilo.css` | Toda a aparência (CSS) |
| `js/temas.js` | Paletas de cor e modo claro/escuro (`window.FCT`) |
| `js/motor.js` | Motor financeiro: todos os cálculos (`window.FC`) |
| `js/app.js` | Telas, login, sincronização e botões |
| `config.js` | URL do Supabase e chave **publishable** (pública por natureza; a segurança vem do RLS — ver `docs/SUPABASE.md`) |
| `manifest.webmanifest` | Dados da PWA (nome, ícones, cores) |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Ícones |
| `docs/` | Documentação (glossário, Supabase) |
| `tests/` | Testes automáticos do motor financeiro (não fazem parte do app) |
| `CHANGELOG.md` | Diário de alterações |

### B4. Como o código está organizado
A **ordem de carregamento** no `index.html` importa: `config.js` → Supabase (CDN) → `js/temas.js` → `js/motor.js` → `js/app.js`.
1. **`css/estilo.css`** — todo o CSS. Cores sempre por variáveis CSS (`var(--pri)` etc.).
2. **`js/temas.js`** — exporta `window.FCT`. Paletas (`azul`, `verde`, `roxo`, `grafite`, `marinho`, `claro`) × modos (`auto`, `light`, `dark`). Também calcula contraste (WCAG).
3. **`js/motor.js`** — exporta `window.FC` (usado como `E` no app). Só lógica, sem tela: funções `E.addIncome`, `E.addExpense`, `E.invoiceFor`, `E.invoices`, `E.payInvoice`, `E.accountBalance`, `E.monthSummary`, `E.plan*`, `E.migrate`, `E.couple*` etc. Também roda no Node (`module.exports`) — é assim que os testes o carregam.
4. **`js/app.js`** — estado `S`, salvar/sincronizar, login, navegação e as telas `vInicio`, `vMov`, `vContas`, `vCartoes`, `vOrc`, `vRec`, `vPlan`, `vRel`, `vBancos`, `vCasal`. A função `render()` escolhe a tela pela variável `tab`. Formulários abrem em "sheets" (`sheet(html)`).
- **Etiqueta de versão:** o `index.html` carrega os arquivos com `?v=N` (ex.: `js/app.js?v=2`). **Ao publicar uma mudança em CSS/JS, aumentar o N** em todas as linhas, para o celular não usar uma cópia antiga guardada na memória.

### B5. Regras de negócio que NUNCA podem ser quebradas
- **Dinheiro sempre em centavos inteiros** (`amountCents`), nunca número com vírgula. Converter com `E.toCents`, exibir com `E.brl`. Dividir parcelas com `E.splitCents` (não perde centavo).
- **Nunca apagar lançamento**: usar `E.cancel` (status `cancelled`). Toda mudança registra `history`.
- Lançamento só vira "pago" por `E.confirm`. Compra no cartão é paga **pela fatura** (`E.payInvoice`), e pagar fatura **não** é nova despesa.
- Datas são texto `AAAA-MM-DD`. Usar as funções `E.addMonths`, `E.addDays` etc.
- Dias de fechamento/vencimento de cartão e dias de recebimento: entre 1 e 28.
- Cores: só pelos tokens de tema — nada de cor fixa espalhada.
- Texto vindo do usuário exibido na tela sempre passa por `esc()` (evita injeção de código).
- Textos da interface em português, tom simples e amigável.

### B6. Dados e sincronização
- Estado principal `S` (objeto JSON): `schema`, `profile`, `settings.payDays`, `accounts`, `cards`, `categories`, `tx` (lançamentos), `purchases` (compras no cartão), `budgets`, `recurrences`, `plan`, `invoiceFund`, `prefs`, `log`.
- **Migração**: ao mudar a estrutura de `S`, atualizar `E.migrate` (e o número `schema`) para converter dados antigos sem perder nada.
- Armazenamento local (`localStorage`): `fc_v1` (dados), `fc_pref` (aparência), `fc_v1_pre2` (cópia antes da migração), `fc_dup_undo`, `fc_cards_undo` (desfazer). `sessionStorage` `fc_hide` (ocultar saldo).
- Nuvem: tabela `app_state` (1 linha por usuário com todo o `S`). Envio ~0,7 s após salvar, com controle de **versão** (se outro aparelho salvou antes, baixa a versão mais recente). Cada alteração guarda a versão anterior em `app_state_history` (últimas 50).
- **Contas de usuário:** o cadastro público está **fechado** no Supabase ("Allow new users to sign up" desligado). O botão "Criar minha conta" do app mostra "Signups not allowed". Contas novas são criadas pelo Renan no painel (passo a passo em `docs/SUPABASE.md`).
- Casal: tabelas `shares` (convites) e `summaries` (resumo que o parceiro pode ver); função `accept_share`. **O app não envia e-mail de convite**: o convite só fica registrado no banco, e o par precisa criar conta com o mesmo e-mail e abrir a tela Casal para aceitar.
- Detalhes do banco e da segurança: **`docs/SUPABASE.md`**.

### B7. Como testar
- **Testes automáticos do motor financeiro** (29 testes): rodar `node --test tests/motor.test.js` na pasta do projeto. Não precisa instalar nada (usa o Node puro).
  - `tests/carregar-motor.js` carrega o `js/motor.js` isolado, sem navegador.
  - **Sempre** rodar os testes antes e depois de mexer no motor. Se um teste falhar, parar e explicar ao Renan.
  - Ao criar ou alterar uma regra de dinheiro, acrescentar um teste para ela.
- Para conferir as telas: abrir `index.html` em um navegador (o Chromium com Playwright está disponível no ambiente do Claude Code). Sem acesso ao Supabase no ambiente, o teste de nuvem é feito pelo Renan no celular **depois** de publicar.
- Antes de enviar mudanças no código, verificar no navegador que o app abre sem erros no console. Em mudanças de organização (sem mudar comportamento), comparar as telas da versão antiga e da nova com os mesmos dados — foi assim na Fase 2.
- Separar também o backup completo do projeto (`git archive --format=zip HEAD`) para o Renan guardar no iCloud.

### B8. Git e publicação
- Trabalhar sempre em branch separado (ex.: `claude/...`). Mensagens de commit em português, descrevendo o que e por quê.
- **Publicar (hoje):** gerar o `.zip` **do site** — só os arquivos do app, sem `docs/`, `tests/` e `.md`:
  `git archive --format=zip -o finance-site.zip HEAD index.html config.js manifest.webmanifest icon-192.png icon-512.png apple-touch-icon.png css js`
  Enviar ao Renan e guiá-lo no Cloudflare: **Workers & Pages** → `finance-renan` → **Create deployment** → menu **"···"** (no celular o botão fica escondido) → escolher **Versão prévia** (nome `teste` → `teste.finance-renan.pages.dev`) para testar primeiro → tocar no link "arquivo" (no iPhone, a área de arrastar não funciona) → **Salvar e implantar**. Depois de testado, repetir com **Produção**.
- Depois de publicar, pedir ao Renan para testar no celular (login + dados aparecendo).
- Se o GitHub voltar: decidir com o Renan se conecta o Cloudflare ao repositório (publicação automática) ou mantém o envio manual.
