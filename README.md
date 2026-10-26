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
## API em Node (Aula 21)
 
Uma segunda versao da API, em JavaScript, na pasta `api-node/`.
O contrato de GET /api/projetos e o mesmo do `api/projetos.php`.
 
Como rodar:
 
cd api-node
npm install
node server.js
 
A API sobe em http://localhost:3000. Teste com:
   curl -i http://localhost:3000/api/projetos
 
### Aula 22: a API lê do banco
 
Antes de subir a API, o MariaDB precisa estar de pé:
 
    sudo service mariadb start
    cd api-node
    node server.js
 
Rotas que leem do `dwii_db`:
 
    curl -i http://localhost:3000/api/projetos
    curl -i http://localhost:3000/api/projetos/23
    curl -i http://localhost:3000/api/tecnologias
    
### Aula 23: a API cria, altera e apaga
 
A API em uso e a de `api-node/`. Os arquivos `api/*.php` e `conexao.php` ficam no
repositorio como historico do 2o trimestre.
 
    curl -i -X POST http://localhost:3000/api/projetos -H "Content-Type: application/json" -d '{"nome":"Teste","ano":2026}'
    curl -i -X PUT http://localhost:3000/api/projetos/25 -H "Content-Type: application/json" -d '{"nome":"Teste (editado)","ano":2026}'
    curl -i -X DELETE http://localhost:3000/api/projetos/25
 
## Aula 24: a tranca da API (usuário, token e middleware)
 
Nesta aula a API do Portfólio em Node ganhou uma tranca. Qualquer pessoa pode **ler** projetos e tecnologias, mas só quem faz login consegue **criar, alterar e apagar**.
 
### Como rodar do zero
 
```bash
# 1. Banco de dados no ar (na raiz do repositório)
sudo service mariadb start
sudo mariadb < sql/setup.sql
sudo mariadb < sql/usuarios.sql
 
# 2. Dependências e dono da API
cd api-node
npm install
node criar-usuario.js <email> <senha>
 
# 3. Subir a API (porta 3000)
node server.js
```
 
O `setup.sql` cria o banco `dwii_db`, as tabelas e os dados de exemplo. O `usuarios.sql` cria a tabela do dono. O `criar-usuario.js` grava o email e o **hash** da senha, nunca a senha em si.
 
### O usuário e o hash
 
Conferindo no banco, a coluna `senha_hash` guarda só o hash do bcrypt:
 
```
+----+-----------------------------+--------------------------------------------------------------+
| id | email                       | senha_hash                                                   |
+----+-----------------------------+--------------------------------------------------------------+
|  4 | murilonefidefaria@gmail.com | $2b$10$b5wb8b3OehrFAmZ.bIADYO/4.iQY1lQXYqXl9OFk47XA24o1ozWA. |
+----+-----------------------------+--------------------------------------------------------------+
```
 
### Como a tranca funciona
 
- `POST /api/login` recebe email e senha e devolve um token. Sem um dos dois campos responde **400**; com credencial errada responde **401**.
- O token vale **30 minutos**. Escolhi um tempo curto porque só eu uso a API, e em sessões pequenas. Se o token vazasse, ele deixaria de funcionar logo, e eu só preciso fazer login de novo.
- O login responde a **mesma frase** para email que não existe e para senha errada. Fiz assim para quem estiver tentando invadir não conseguir descobrir quais emails estão cadastrados.
- O middleware `autenticar` lê o cabeçalho `Authorization: Bearer <token>` e confere o token. Sem token ou com token inválido responde **401** e a rota nem chega a executar.
- Ele protege `POST`, `PUT` e `DELETE` de `/api/projetos` e de `/api/tecnologias`. Os `GET` continuam públicos, então o Portfólio em Angular segue lendo os dados normalmente.
| Rota | Sem token | Com token |
|---|---|---|
| `GET /api/projetos` e `/api/tecnologias` | 200 | 200 |
| `POST /api/projetos` e `/api/tecnologias` | 401 | 201 |
| `PUT /api/projetos/:id` e `/api/tecnologias/:id` | 401 | 200 (ou 404 se o id não existe) |
| `DELETE /api/projetos/:id` e `/api/tecnologias/:id` | 401 | 204 (ou 404 se o id não existe) |
 
### O que esta API ainda não faz
 
- O segredo que assina os tokens está escrito direto no `server.js`. Como o repositório é público, quem ler o código conhece o segredo; o certo seria guardá-lo numa variável de ambiente fora do GitHub.
- Não há limite de tentativas de login, então alguém poderia testar senhas sem parar.
- Também não existe logout nem revogação: se um token for roubado, ele continua valendo até vencer.
### Uso de IA
 
Usei o Claude como apoio nesta tarefa: para middleware e das rotas do catálogo. Rodei tudo no meu Codespace, testei os `curl` e conferi as respostas.
 
### Testes da tranca (respostas reais)
 
Abaixo está cada `curl` com a resposta que recebi. A senha aparece como `<senha>` e o token como `<token>`. Os testes foram: login sem campos (400), login com senha errada (401), login certo (200), `POST` e `DELETE` de projeto sem token (401) e com token (201 e 204), `GET` público (200), `PUT` de projeto sem token (401), `POST` de tecnologia sem token (401), `POST` com token (201) e `DELETE` com token (204).
```

### 1. Login sem email e senha (400)
$ curl -i -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{}'
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 32
ETag: W/"20-sqCMSDh77HwmN9gNyVfEQ10XtLs"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Informe email e senha"}

### 2. Login com senha errada (401)
$ curl -i -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"murilonefidefaria@gmail.com","senha":"errada"}'
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 65
ETag: W/"41-ptKzsPeEHaUpUxwGo/APVz4Mhm0"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Nao consegui te identificar, confira o email e a senha"}

### 3. Login certo (200 e token)
$ curl -i -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"murilonefidefaria@gmail.com","senha":"<senha>"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 149
ETag: W/"95-x+SbyKzEs8GUcwzFNkIG6cF47FY"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"token":"<token>"}

### 4. POST de projeto SEM token (401)
$ curl -i -X POST http://localhost:3000/api/projetos -H "Content-Type: application/json" -d '{"nome":"Teste da tranca"}'
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 83
ETag: W/"53-6XkZNTWxr3MaOhqQA/k8fFtP2CY"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Essa acao so vale para o dono do portfolio, entre com seu login primeiro"}

### 5. POST de projeto COM token (201)
$ curl -i -X POST http://localhost:3000/api/projetos -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"nome":"Teste da tranca"}'
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 9
ETag: W/"9-dTeGE2/s0ZI4n65rYCSdMqMN7gI"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":28}

### 6. DELETE de projeto SEM token (401)
$ curl -i -X DELETE http://localhost:3000/api/projetos/28
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 83
ETag: W/"53-6XkZNTWxr3MaOhqQA/k8fFtP2CY"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Essa acao so vale para o dono do portfolio, entre com seu login primeiro"}

### 7. DELETE de projeto COM token (204)
$ curl -i -X DELETE http://localhost:3000/api/projetos/28 -H "Authorization: Bearer <token>"
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: *
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5



### 8. GET de projetos continua publico (200)
$ curl -i http://localhost:3000/api/projetos
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 1116
ETag: W/"45c-Eqb9nicnFORSphae3Ke8s/KWOK8"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"nome":"Portfolio Pessoal","descricao":"Site de portfolio responsivo com PHP, PDO e MariaDB, painel admin e login.","tecnologias":"PHP, MariaDB, CSS, Git","link_github":"https://github.com/usuario/portfolio","status":"publicado"},{"id":2,"nome":"Sistema de Biblioteca","descricao":"CRUD de acervo e emprestimos, com busca e relatorios.","tecnologias":"PHP, MariaDB, Bootstrap","link_github":"https://github.com/usuario/biblioteca","status":"publicado"},{"id":3,"nome":"App de Tarefas","descricao":"Lista de tarefas com categorias, prazos e filtro por status.","tecnologias":"JavaScript, HTML, CSS","link_github":"https://github.com/usuario/tarefas","status":"publicado"},{"id":4,"nome":"Loja Virtual (prototipo)","descricao":"Catalogo de produtos com carrinho e checkout simulado.","tecnologias":"PHP, MariaDB, JavaScript","link_github":"https://github.com/usuario/loja","status":"publicado"},{"id":23,"nome":"API de Clima","descricao":"Microsservico que consome uma API publica e devolve a previsao em JSON.","tecnologias":"PHP, REST","link_github":"https://github.com/usuario/clima","status":"publicado"}]

### 9. PUT de projeto SEM token (401)
$ curl -i -X PUT http://localhost:3000/api/projetos/1 -H "Content-Type: application/json" -d '{"nome":"X"}'
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 83
ETag: W/"53-6XkZNTWxr3MaOhqQA/k8fFtP2CY"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Essa acao so vale para o dono do portfolio, entre com seu login primeiro"}

### 10. POST de tecnologia SEM token (401)
$ curl -i -X POST http://localhost:3000/api/tecnologias -H "Content-Type: application/json" -d '{"nome":"Node","categoria":"Backend"}'
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 83
ETag: W/"53-6XkZNTWxr3MaOhqQA/k8fFtP2CY"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Essa acao so vale para o dono do portfolio, entre com seu login primeiro"}

### 11. POST de tecnologia COM token (201)
$ curl -i -X POST http://localhost:3000/api/tecnologias -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"nome":"Node","categoria":"Backend","ano_criacao":2009}'
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 9
ETag: W/"9-cLKC9NU7d5duKTB2EyEYSLHM6Qc"
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":15}

### 12. DELETE de tecnologia COM token (204)
$ curl -i -X DELETE http://localhost:3000/api/tecnologias/15 -H "Authorization: Bearer <token>"
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: *
Date: Mon, 26 Oct 2026 20:21:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5



```