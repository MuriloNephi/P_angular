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