# Changelog — diário de alterações

Aqui ficam registradas, em linguagem simples, **todas** as mudanças do Finance Control.

- **Não publicado** = a mudança está pronta, mas ainda não foi enviada ao Cloudflare (o app no celular ainda não mudou).
- Cada versão publicada ganha a data do dia em que foi ao ar.

Tipos de mudança: **Adicionado** (novidade) · **Alterado** (algo que já existia mudou) · **Corrigido** (erro consertado) · **Removido** · **Segurança**.

---

## [06/11/2026] — App movido para o Cloudflare Pages

### Alterado
- O app agora está em **https://finance-renan.pages.dev** (Cloudflare Pages).
  Motivo: a conta do GitHub foi suspensa, o que tirou do ar o endereço antigo (`renans01silva.github.io/finance-/`).
- O código do app **não mudou**: é a mesma versão de antes. Os dados continuam no Supabase e voltaram normalmente ao fazer login.
- Documentação (`README.md`, `CLAUDE.md`, `docs/SUPABASE.md`) atualizada com o endereço novo e o jeito novo de publicar (envio de `.zip`).

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
- Diagnóstico do Supabase (06/11/2026): todas as 4 tabelas com RLS ligado e regras corretas. Pendências: confirmar "Confirm email" ligado e se o backup automático (trigger) está ativo.

> Nenhuma linha do app foi alterada nesta etapa.

---

## [Antes do Changelog] — até 06/11/2026

Estado do app quando a documentação começou (histórico anterior feito por uploads, sem descrição):
- App completo em `index.html`: contas, receitas, despesas, transferências, cartões com faturas e parcelamento, estornos, contas recorrentes, orçamento, dois dias de recebimento (10 e 25), planejamento, relatórios, visões Pessoal/Profissional/Consolidado, função Casal, 6 paletas de cor com modo claro/escuro, ocultar saldo, backup/restauração, detecção e correção de duplicados.
- Login e sincronização na nuvem com Supabase.
- Publicado como PWA pelo GitHub Pages.
