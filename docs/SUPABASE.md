# Supabase — banco de dados e login do Finance Control

> **O que é o Supabase?** Um serviço na internet que guarda os dados do app (o "banco de dados") e cuida do login (e-mail e senha). É ele que permite abrir o app em outro celular e ver as mesmas informações.

Diagnóstico feito em **06/11/2026** (consulta só de leitura, rodada pelo Renan no SQL Editor).

## Resultado geral: ✅ seguro

Todas as tabelas estão com a **proteção RLS ligada** e com regras que deixam cada pessoa ver e alterar **apenas os próprios dados**.

> **RLS (Row Level Security / Segurança por linha):** é como um porteiro em cada tabela. Antes de entregar ou gravar qualquer linha, ele confere: "esta linha é de quem está pedindo?". Sem RLS, qualquer pessoa com o link do app poderia ler os dados de todo mundo.

## Tabelas

| Tabela | Para que serve | Colunas |
|---|---|---|
| `app_state` | **Todos os dados** de cada usuário (1 linha por pessoa) | `user_id`, `data` (tudo do app, em JSON), `version` (contador de versões), `updated_at` |
| `app_state_history` | **Cópias de segurança automáticas**: guarda as 50 versões anteriores de cada usuário | `id`, `user_id`, `data`, `version`, `saved_at` |
| `shares` | **Convites do Casal**: quem compartilhou o resumo com quem | `id`, `owner_id`, `owner_email`, `viewer_email`, `accepted`, `created_at` |
| `summaries` | **Resumo** que o parceiro(a) pode ver (não os dados completos) | `user_id`, `owner_email`, `name`, `data`, `updated_at` |

## Regras de acesso (políticas RLS)

| Tabela | Ver | Criar | Alterar | Apagar |
|---|---|---|---|---|
| `app_state` | só a própria linha | só a própria | só a própria | ninguém |
| `app_state_history` | só o próprio histórico | só o banco (automático) | ninguém | só o banco (limpeza automática) |
| `shares` | quem convidou **ou** quem foi convidado | só quem convida, em seu nome, como "não aceito" | só pela função `accept_share` | quem convidou ou quem foi convidado |
| `summaries` | o dono **ou** quem aceitou um convite dele | só o próprio | só o próprio | ninguém |

## Funções do banco

- **`accept_share(p_id)`** — aceita um convite do Casal. Só funciona se o e-mail de quem está logado for o e-mail convidado.
- **`keep_history()`** — toda vez que `app_state` é atualizado, guarda a versão anterior em `app_state_history` e mantém só as 50 mais recentes. ✅ *Confirmado em 06/11/2026: o gatilho `app_state_keep_history` (BEFORE UPDATE em `app_state`) está ativo.*

> **Função / trigger:** uma *função* é uma pequena receita guardada no banco. Um *trigger* (gatilho) é a regra "quando acontecer X, rode a receita Y automaticamente".

## Pendências / pontos de atenção

1. ✅ **Cadastro público fechado** — a chave *"Allow new users to sign up"* (Authentication → Sign In / Providers → User Signups) está **desligada**: ninguém de fora consegue criar conta, nem com o e-mail de outra pessoa. Por isso o *"Confirm email"* (também desligado) **não é necessário**. Contas novas são criadas pelo Renan no painel (ver "Como criar a conta de alguém" abaixo).
2. ✅ **Backup automático (trigger) ativo** — confirmado em 06/11/2026.
3. ✅ **Site URL** (Authentication → URL Configuration) = `https://finance-renan.pages.dev` *(corrigido em 06/11/2026; antes era `http://localhost:3000`)* — é para onde levam os links dos e-mails (confirmação de conta, recuperação de senha).
4. O app ainda **não tem botão** para restaurar uma versão de `app_state_history`; hoje isso seria feito manualmente no Supabase (com ajuda do Claude).

## Como criar a conta de alguém (cadastro público fechado)
1. Supabase → projeto **finance-control** → **Authentication** → **Users**.
2. **Add user** → **Create new user** (não usar "Send invitation": o app não trata esse link).
3. Preencher **Email** e **Password** (mín. 6 caracteres, escolhida pela pessoa — o app ainda não tem tela de trocar senha) e deixar **Auto Confirm User** ligado.
4. **Create user**. A pessoa entra pelo botão **"Entrar"** do app (não "Criar minha conta").

Usuários atuais (06/11/2026): Renan e a esposa (`eduardafmaia@hotmail.com`, criada pelo painel).

## Chaves e ligações entre tabelas (06/11/2026)
| Tabela | Chave principal | Observação |
|---|---|---|
| `app_state` | `user_id` | 1 linha por usuário |
| `app_state_history` | `id` | — |
| `shares` | `id` | Não deixa convidar o mesmo e-mail duas vezes (`owner_id` + `viewer_email` únicos) |
| `summaries` | `user_id` | 1 resumo por usuário |

> ⚠️ **Cuidado:** todas as tabelas estão ligadas ao usuário com **"ON DELETE CASCADE"** — se um usuário for apagado em
> *Authentication → Users*, **todos os dados dele (inclusive o histórico de backup) são apagados junto**, sem volta.
> Nunca apague um usuário ali sem antes fazer backup pelo app.

### Consulta: triggers e chaves (só leitura)
```sql
select 'trigger' as tipo, event_object_table || ' → ' || trigger_name as nome,
       action_timing || ' ' || event_manipulation || ' | ' || action_statement as detalhe
from information_schema.triggers where trigger_schema = 'public'
union all
select 'chave', conrelid::regclass::text || ' → ' || conname, pg_get_constraintdef(oid)
from pg_constraint where connamespace = 'public'::regnamespace
order by 1, 2;
```

## Consulta de diagnóstico completo (só leitura)
Para repetir o diagnóstico no futuro: Supabase → seu projeto → **SQL Editor** → **New query** → cole → **Run**.
```sql
select 'tabela' as tipo, c.relname::text as nome,
       case when c.relrowsecurity then 'PROTEÇÃO (RLS) LIGADA' else 'PROTEÇÃO (RLS) DESLIGADA' end as detalhe
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
union all
select 'regra', (tablename || ' → ' || policyname)::text,
       (cmd || ' | quem: ' || array_to_string(roles, ',') || ' | ler: ' || coalesce(qual, '-') || ' | gravar: ' || coalesce(with_check, '-'))::text
from pg_policies where schemaname = 'public'
union all
select 'coluna', (table_name || '.' || column_name)::text, data_type::text
from information_schema.columns where table_schema = 'public'
union all
select 'função', p.proname::text, pg_get_functiondef(p.oid)::text
from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'
order by 1, 2;
```

## Como o app conversa com o Supabase
1. **Login:** e-mail e senha (`signInWithPassword` / `signUp`).
2. **Ao entrar:** baixa a linha do usuário em `app_state`. Se não existir, cria.
3. **Ao salvar:** ~0,7 s depois, envia tudo para `app_state` com `version + 1`. Se outro aparelho tiver salvo antes (versão diferente), o app baixa a versão mais nova e avisa.
4. **Sem internet:** guarda no aparelho e envia quando a conexão voltar.
5. **Casal:** cria convites em `shares`, aceita com `accept_share` e publica um resumo em `summaries`. **Nenhum e-mail é enviado no convite**: o par precisa criar conta com o e-mail convidado e abrir a tela Casal.
