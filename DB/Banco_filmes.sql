CREATE DATABASE IF NOT EXISTS filminis_db;
USE filminis_db;

-- -----------------------------------------------------
-- Grupo 1: Tabelas de Autenticação e Usuários
-- Requisitos: [cite: 27, 28, 29]
-- -----------------------------------------------------

-- Tabela 1: roles
-- Armazena os papéis de usuário (comum, adm) [cite: 29]
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE -- (Ex: 'comum', 'adm')
);

-- Tabela 2: usuarios
-- Armazena os dados de login dos usuários [cite: 28]
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- -----------------------------------------------------
-- Grupo 2: Tabelas de "Entidades" (Para Normalização)
-- Requisitos: [cite: 21, 26] (Filtros e Informações)
-- -----------------------------------------------------

-- Tabela 3: generos
-- Armazena os gêneros (Ex: Ação, Terror) para os filtros 
CREATE TABLE IF NOT EXISTS generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela 4: diretores
-- Armazena os diretores para os filtros 
CREATE TABLE IF NOT EXISTS diretores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- Tabela 5: atores
-- Armazena os atores para os filtros 
CREATE TABLE IF NOT EXISTS atores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Grupo 3: Tabela Principal e Ligações (Many-to-Many)
-- -----------------------------------------------------

-- Tabela 6: filmes
-- Armazena APENAS os filmes JÁ APROVADOS [cite: 11]
CREATE TABLE IF NOT EXISTS filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano INT,
    sinopse TEXT,
    poster_url VARCHAR(255)
    -- Note que gênero, diretor e ator não estão aqui
);

-- Tabela 7: filmes_generos (Tabela de Ligação)
-- Conecta um filme (id) a um ou mais gêneros (id)
CREATE TABLE IF NOT EXISTS filmes_generos (
    filme_id INT NOT NULL,
    genero_id INT NOT NULL,
    PRIMARY KEY (filme_id, genero_id),
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(id)
);

-- Tabela 8: filmes_diretores (Tabela de Ligação)
-- Conecta um filme (id) a um ou mais diretores (id)
CREATE TABLE IF NOT EXISTS filmes_diretores (
    filme_id INT NOT NULL,
    diretor_id INT NOT NULL,
    PRIMARY KEY (filme_id, diretor_id),
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (diretor_id) REFERENCES diretores(id)
);

-- Tabela 9: filmes_atores (Tabela de Ligação)
-- Conecta um filme (id) a um ou mais atores (id)
CREATE TABLE IF NOT EXISTS filmes_atores (
    filme_id INT NOT NULL,
    ator_id INT NOT NULL,
    PRIMARY KEY (filme_id, ator_id),
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (ator_id) REFERENCES atores(id)
);

-- -----------------------------------------------------
-- Grupo 4: Fluxo de Aprovação do ADM
-- Requisitos: [cite: 30, 31, 32]
-- -----------------------------------------------------

-- Tabela 10: solicitacoes_adicao
-- Onde os filmes dos usuários comuns [cite: 30] ficam PENDENTES
-- até o ADM aceitar 
CREATE TABLE IF NOT EXISTS solicitacoes_adicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano INT,
    sinopse TEXT,
    poster_url VARCHAR(255),
    -- Armazena os nomes (texto) para o ADM aprovar
    generos_texto VARCHAR(255), 
    diretores_texto VARCHAR(255),
    atores_texto TEXT,
    
    solicitado_por_id INT NOT NULL,
    status ENUM('pendente', 'aprovado', 'rejeitado') NOT NULL DEFAULT 'pendente',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solicitado_por_id) REFERENCES usuarios(id)
);

-- Tabela 11: solicitacoes_edicao
-- Onde as EDIÇÕES ficam PENDENTES ("Adms tem que aceitar a ... edição") 
CREATE TABLE IF NOT EXISTS solicitacoes_edicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filme_id INT NOT NULL, -- O filme que está sendo editado
    campo_alterado VARCHAR(100) NOT NULL, -- (Ex: 'titulo', 'sinopse')
    valor_antigo TEXT,
    valor_novo TEXT,
    
    solicitado_por_id INT NOT NULL,
    status ENUM('pendente', 'aprovado', 'rejeitado') NOT NULL DEFAULT 'pendente',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (solicitado_por_id) REFERENCES usuarios(id)
);

-- Tabela 12: notificacoes
-- (Inferida das suas telas do Figma "Tela de notificações")
-- Gera uma notificação para o ADM quando uma solicitação é criada
CREATE TABLE IF NOT EXISTS notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL, -- O ADM que deve receber
    mensagem TEXT NOT NULL,
    tipo ENUM('adicao', 'edicao') NOT NULL,
    referencia_id INT NOT NULL, -- O ID da solicitacao_adicao ou solicitacao_edicao
    lida BOOLEAN NOT NULL DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- -----------------------------------------------------
-- Insere os dados iniciais (Roles)
-- -----------------------------------------------------
INSERT IGNORE INTO roles (id, nome) VALUES (1, 'comum');
INSERT IGNORE INTO roles (id, nome) VALUES (2, 'adm');