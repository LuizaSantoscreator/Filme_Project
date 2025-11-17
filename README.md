🎬 Filminis - Gerenciador de Filmes
Filminis é uma plataforma web completa para gerenciamento de catálogo de filmes. O projeto conta com uma área pública para visualização e sugestão de filmes por usuários comuns, e um painel administrativo robusto para moderação e gerenciamento direto do conteúdo.

🚀 Tecnologias Utilizadas
Front-end
React (com Vite)

React Router Dom (Navegação)

CSS (Estilização personalizada e responsiva)

Back-end
Python (Módulo http.server)

MySQL Connector (Conexão com banco de dados)

Bcrypt (Criptografia de senhas)

PyJWT (Autenticação via Tokens JWT)

Banco de Dados
MySQL

📦 Pré-requisitos
Antes de começar, você precisa ter instalado em sua máquina:

Node.js (para o Front-end)

Python (para o Back-end)

[link suspeito removido]

⚙️ Instalação e Configuração
1. Configuração do Banco de Dados (MySQL)
Abra seu gerenciador de banco de dados (MySQL Workbench, DBeaver, ou Terminal).

Execute o script de criação e população do banco (Pop_Filmes.sql ou o script completo fornecido).

Isso criará o banco filminis_db e todas as tabelas necessárias.

2. Configuração do Back-end (Python)
Navegue até a pasta do backend:

Bash

cd Back
Instale as dependências necessárias:

Bash

pip install mysql-connector-python bcrypt pyjwt
Configure o acesso ao banco:

Abra o arquivo src/database/db_config.py.

Verifique se o user e password correspondem ao seu MySQL local.

Inicie o servidor:

Bash

python server.py
O servidor iniciará em http://localhost:8000

3. Configuração do Front-end (React)
Abra um novo terminal e navegue até a pasta do frontend:

Bash

cd Front
Instale as dependências do projeto:

Bash

npm install
Inicie o servidor de desenvolvimento:

Bash

npm run dev
O site estará acessível (geralmente) em http://localhost:5173

🔐 Como Criar o Primeiro Administrador (Passo a Passo)
Por segurança e design do banco de dados, não existe uma tela de cadastro de administradores. Todo usuário nasce como "Comum". Para se tornar um Administrador, é necessário um processo manual de "promoção" no banco de dados.

Siga rigorosamente a ordem abaixo:

Passo 1: Cadastro Inicial
Acesse o site (http://localhost:5173). A primeira tela será a de cadastro. Crie um usuário com os seguintes dados (ou outros de sua preferência):

Nome: Admin

Email: admin@email.com

Senha: senhaadmin123

Clique em Cadastrar. Você será redirecionado para o Login. Não faça login ainda.

Passo 2: Promoção via Banco de Dados (Script SQL)
Agora, você precisa "promover" esse usuário de Comum (role_id 1) para Administrador (role_id 2).

Vá ao seu MySQL Workbench (ou terminal).

Execute o seguinte script SQL:

SQL

USE filminis_db;

UPDATE usuarios 
SET role_id = 2 
WHERE email = 'admin@email.com';
(Se você usou um email diferente no cadastro, altere o email no comando acima).

Passo 3: Acesso Administrativo
Volte ao navegador, na tela de Login.

Clique no link "Administrador? Clique aqui!".

Faça login com os dados que você cadastrou:

Email: admin@email.com

Senha: senhaadmin123

Pronto! Você será redirecionado para o Painel Administrativo.

🛠️ Funcionalidades
Perfil Público (Usuário Comum)
Visualização: Ver lista de filmes e detalhes completos.

Busca e Filtros: Pesquisar por título, ano, gênero, ator ou diretor (via Modal).

Sugestão: Enviar formulário sugerindo novos filmes para a plataforma (requer aprovação).

Perfil Administrativo (Admin)
Dashboard: Visão geral das ações.

Gerenciamento Direto: Adicionar, Editar e Excluir filmes diretamente (sem passar por aprovação).

Moderação: Visualizar notificações de usuários.

Aprovar: Aceita a sugestão do usuário e publica o filme.

Rejeitar: Recusa a sugestão e a remove da lista.
