# Glossário — termos técnicos explicados de forma simples

> Dicionário que cresce com o tempo. Sempre que um termo novo aparecer nas conversas, ele entra aqui.

## Programação e projeto
- **Código-fonte** — o texto com as instruções que fazem o app funcionar.
- **HTML** — a "estrutura" de uma página (onde fica cada coisa).
- **CSS** — a "roupa" da página: cores, tamanhos, espaçamentos.
- **JavaScript (JS)** — o "cérebro": faz os cálculos e reage aos toques.
- **PWA (Progressive Web App)** — site que pode ser "instalado" na tela inicial e parece um app.
- **Manifest** — arquivo que diz ao celular o nome, o ícone e as cores do app instalado.
- **CDN** — servidor público de onde o app baixa bibliotecas prontas (ex.: a do Supabase).
- **Biblioteca** — código pronto, feito por outras pessoas, que reaproveitamos.
- **Framework** — biblioteca grande que define o jeito de organizar o app inteiro (este projeto **não** usa).
- **Função** — um bloco de código com nome que faz uma tarefa (ex.: `E.addExpense` lança uma despesa).
- **Estado (`S`)** — o "caderno" onde o app anota todos os seus dados enquanto está aberto.
- **JSON** — formato de texto para guardar dados organizados (`{ "nome": "Renan" }`).
- **localStorage** — gavetinha do navegador, no próprio aparelho, onde o app guarda dados.
- **Migração** — conversão automática dos dados antigos quando a estrutura deles muda, para nada se perder.
- **Centavos inteiros** — o app guarda R$ 10,50 como `1050`, evitando erros de arredondamento.
- **Design tokens** — "catálogo" de cores e estilos com nome (ex.: `--pri` = cor principal).
- **Teste automático** — "lista de checagem" que o computador roda sozinho para conferir se o código continua dando os resultados certos.
- **Node (Node.js)** — programa que roda JavaScript fora do navegador; usado aqui para rodar os testes.
- **Cache** — "memória" do navegador que guarda arquivos já baixados para abrir mais rápido. Por isso usamos a etiqueta `?v=N`: ao mudar o número, o navegador baixa a versão nova.
- **Console** — painel escondido do navegador onde aparecem mensagens de erro do código.

## Git e GitHub
- **Git** — sistema que guarda o histórico de todas as versões do projeto.
- **GitHub** — site onde o projeto (e seu histórico) fica guardado na internet.
- **Repositório (repo)** — a "pasta" do projeto no GitHub, com todo o histórico.
- **Commit** — uma "foto" do projeto em um momento, com uma legenda explicando o que mudou.
- **Branch (ramo)** — uma cópia paralela do projeto para trabalhar sem mexer na versão principal.
- **`main`** — o branch principal. Neste projeto, é o que está **publicado** no celular.
- **Push** — enviar os commits do computador para o GitHub.
- **Pull Request (PR)** — pedido para juntar um branch no `main`, onde dá para revisar as mudanças antes.
- **Merge** — o ato de juntar um branch no outro (ex.: publicar as mudanças no `main`).
- **GitHub Pages** — serviço do GitHub que transforma o repositório em um site (`...github.io`).
- **Changelog** — diário das alterações do projeto.

## Hospedagem (onde o site fica no ar)
- **Hospedagem** — o "terreno" na internet onde o site fica guardado para qualquer um abrir.
- **Cloudflare Pages** — serviço gratuito que hospeda o app hoje (`finance-renan.pages.dev`).
- **Deploy / Implantar** — publicar uma versão do site, colocando-a no ar.
- **Domínio** — o endereço do site (ex.: `finance-renan.pages.dev`). Domínios próprios (`meusite.com.br`) são pagos e opcionais.
- **.zip** — um "pacote" que junta vários arquivos em um só, para enviar ou guardar.
- **404** — código de "página não encontrada": não existe nada naquele endereço.
- **Conta suspensa** — conta bloqueada pela plataforma; só o suporte dela pode reativar.

## Supabase e banco de dados
- **Supabase** — serviço na nuvem que guarda os dados e cuida do login.
- **Banco de dados** — lugar organizado para guardar informações em tabelas.
- **Tabela** — como uma planilha: colunas (tipos de informação) e linhas (registros).
- **SQL** — a "língua" usada para conversar com o banco de dados.
- **SQL Editor** — tela do Supabase onde digitamos comandos SQL.
- **RLS (Row Level Security)** — "porteiro" que garante que cada pessoa só veja as próprias linhas.
- **Política (policy)** — cada regra do porteiro (ex.: "só pode ver a linha se for o dono").
- **Trigger (gatilho)** — regra "quando acontecer X, faça Y automaticamente".
- **Chave publishable / anon** — chave pública que identifica o app no Supabase; pode ficar visível, porque quem protege os dados é o RLS.
- **Chave primária (primary key)** — a coluna que identifica cada linha de forma única, como o CPF de uma pessoa.
- **Chave estrangeira (foreign key)** — coluna que "aponta" para uma linha de outra tabela (ex.: os dados apontam para o usuário dono).
- **ON DELETE CASCADE** — regra "efeito dominó": se o item principal for apagado, tudo o que aponta para ele é apagado junto.
- **`user_id` / UUID** — código único que identifica cada usuário.
