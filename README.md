lataforma de Gerenciamento de Filmes

Uma aplicação web completa para listagem, busca e gerenciamento de filmes. O sistema permite que usuários visualizem catálogos e detalhes de filmes, enquanto administradores podem gerenciar o conteúdo e aprovar novas adições.

Tecnologias Utilizadas

Frontend:

React.js (Vite)

CSS3 (estilização customizada e responsiva)

React Router Dom (navegação)

Backend:

Python (servidor HTTP nativo/Flask)

MySQL (banco de dados)

Bcrypt e JWT (autenticação e segurança)

Instalação e Configuração

Pré-requisitos:

Node.js e npm

Python 3.x

MySQL Server (XAMPP, WAMP ou standalone)

Configuração do Banco de Dados:

Abra seu gerenciador MySQL (Workbench, phpMyAdmin, etc.).

Execute o script SQL fornecido no projeto (Banco_filmes.sql) para criar o banco “filminis_db” e as tabelas necessárias.

Configure as credenciais no arquivo Back/database/db_config.py com seu usuário e senha do MySQL.

Iniciando o Backend:
No terminal, navegue até a pasta do backend:

cd Back
pip install mysql-connector-python flask flask-cors bcrypt PyJWT
python server.py
