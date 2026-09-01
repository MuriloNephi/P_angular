# P_angular
Este é um portifólio online para mostrar os projetos do aluno Murilo Néfi de Faria
# Versões 
Node    v24.14.0
npm     11.9.0
Angular CLI 21.2.13
## API do Portfólio (PHP + MariaDB)

Back-end em PHP puro com PDO, servindo os dados do Portfólio em JSON.
### Como rodar

1. Instale as dependências:
   - sudo apt-get update
   - sudo apt-get install -y mariadb-server php-cli php-mysql
2. Suba o banco:
   - sudo service mariadb start
   - sudo mariadb < sql/setup.sql
3. Suba o servidor (sempre com /usr/bin/php, que tem o driver pdo_mysql):
   - /usr/bin/php -S 0.0.0.0:8000
4. Endpoints disponíveis:
   - GET /api/projetos.php — lista os projetos publicados
   - GET /api/projetos.php?id=1 — detalhe de um projeto
   - GET /api/tecnologias.php — catálogo de tecnologias

### Credenciais do banco (ambiente de desenvolvimento)

- Banco: dwii_db
- Usuário: dwii_user
- Senha: dwii2026
## 🎯 Autoavaliação
Conceito pretendido: A

Justificativa (cite o arquivo de cada critério):
- Consumo da API (Projetos): projeto.service.ts (GET + map extraindo a lista) + projetos.ts (subscribe com next/error) + projetos.html (@for, @if carregando/erro/vazio)
- Catalogo + botao GitHub: tecnologia.service.ts (GET) + catalogo.ts + catalogo.html (@for com estados) + projetos.html (mat-card-actions com [href]="p.link_github")
- Boas praticas: a URL e o HttpClient ficam só no service (projeto.service.ts e tecnologia.service.ts); os componentes (projetos.ts, catalogo.ts) só chamam listar() e guardam o estado em signals
- Extra (Nivel A): tratamento do estado "vazio" nas duas telas (projetos.html e catalogo.html, bloco @if (!carregando() && ...length === 0))
- Autoavaliacao: esta secao do README

## 🎯 Autoavaliação (Aula 18 — Contato à Prova de Erros)
Conceito pretendido: B

Justificativa (cite o arquivo de cada criterio):
- Form reativo + erro por campo: contato.html (mensagens com @if ... && touched, um bloco por campo) + contato.ts (Validators.required/minLength/email no FormBuilder)
- POST via service + tratamento: contato.service.ts (http.post tipado) + contato.ts (subscribe com next/error, tipado com HttpErrorResponse)
- Endpoint PHP (php://input, validacao no servidor, prepared statement, responde 201/400): api/contato.php
- Estados de envio completos: contato.ts (enviando/sucesso/erroGeral) + contato.html (texto "Enviando...", mensagem verde de sucesso com reset(), botao desabilita por enviando || form.invalid, erro de rede reabilita o botao)
- Autoavaliacao: esta secao do README

## Aula 19 — Testes CRUD (api/projetos.php)
- POST → 201 {"id":13}
- POST sem nome → 400
- PUT ?id=13 → 200 (idempotente)
- DELETE ?id=13 → 204, repetido → 404
- DELETE sem id → 400

## Aula 19 — Testes CRUD (api/projetos.php) — continuação

- OPTIONS (pré-voo) → 204
- PATCH (verbo que não existe) → 405 {"erro":"Metodo nao permitido"}

### Por que o mesmo arquivo faz 4 coisas

O projetos.php não olha o que tem dentro da requisição pra decidir o que fazer, ele olha o verbo (GET, POST, PUT, DELETE) que vem no `$_SERVER['REQUEST_METHOD']` (linha 23). Cada verbo cai num `if` diferente lá no arquivo. Por isso um endereço só serve pra ler, criar, editar e apagar — quem separa é o método da requisição, não o endereço.

### Se clicar 2x rápido no Adicionar

Ia mandar dois POST e cadastrar o projeto duas vezes, porque pro servidor cada clique é um pedido novo, ele não sabe que é repetido. O que evita isso é o `salvando`, que trava o botão (`[disabled]="salvando()"`) assim que o primeiro clique sai, até a resposta voltar. Sem isso ia duplicar.

### As duas formas de atualizar a lista

Depois de salvar (criar ou editar) eu chamo o `carregar()` de novo, que busca a lista inteira na API. Já no excluir eu não busco nada, só tiro o item do array com `.filter()`. Buscar de novo é mais "seguro" pq garante que tá igual ao banco, mas gasta uma requisição a mais. Tirar do array é na hora, só que só dá pra fazer isso quando eu já sei qual item mudou (no caso do excluir), não dá pra inventar um item novo sem perguntar pro servidor.

## 🎯 Autoavaliação (Aula 19 — Gestão do Portfólio)

Conceito pretendido: B

- R1 (decide pelo verbo + 405): api/projetos.php linhas 23, 121
- R1 (?todos=1 pra gestão ver rascunho): api/projetos.php linhas 25, 28-37
- R1 (testei 400/404/405 com curl): seção "Testes CRUD" acima
- R2 (sem http/URL no componente, só service): gestao.ts inteiro
- R2 (campo status no form): gestao.ts linha 27, gestao.html linhas 28-29
- R2 (status aparece na lista): gestao.html linha 50
- R2 (gestão traz os rascunhos também): gestao.ts linha 36, projeto.service.ts linhas 20-21
- R3 (lista atualiza sozinha depois de salvar): gestao.ts linha 63
- R3 (comparação das estratégias): seção acima
- R4 (justificativa): seção "Por que o mesmo arquivo faz 4 coisas"
- R4 (antecipação de erro): seção "Se clicar 2x rápido"
- R4 (autoavaliação): essa seção aqui
