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
