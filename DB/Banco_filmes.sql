CREATE DATABASE IF NOT EXISTS filminis_db;
USE filminis_db;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS diretores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS atores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano INT,
    sinopse TEXT,
    poster_url VARCHAR(255)

);

CREATE TABLE IF NOT EXISTS filmes_generos (
    filme_id INT NOT NULL,
    genero_id INT NOT NULL,
    PRIMARY KEY (filme_id, genero_id),
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(id)
);

CREATE TABLE IF NOT EXISTS filmes_diretores (
    filme_id INT NOT NULL,
    diretor_id INT NOT NULL,
    PRIMARY KEY (filme_id, diretor_id),
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (diretor_id) REFERENCES diretores(id)
);

CREATE TABLE IF NOT EXISTS filmes_atores (
    filme_id INT NOT NULL,
    ator_id INT NOT NULL,
    PRIMARY KEY (filme_id, ator_id),
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (ator_id) REFERENCES atores(id)
);

CREATE TABLE IF NOT EXISTS solicitacoes_adicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano INT,
    sinopse TEXT,
    poster_url VARCHAR(255),
    generos_texto VARCHAR(255), 
    diretores_texto VARCHAR(255),
    atores_texto TEXT,
    
    solicitado_por_id INT NOT NULL,
    status ENUM('pendente', 'aprovado', 'rejeitado') NOT NULL DEFAULT 'pendente',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solicitado_por_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS solicitacoes_edicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filme_id INT NOT NULL,
    campo_alterado VARCHAR(100) NOT NULL, 
    valor_antigo TEXT,
    valor_novo TEXT,
    
    solicitado_por_id INT NOT NULL,
    status ENUM('pendente', 'aprovado', 'rejeitado') NOT NULL DEFAULT 'pendente',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (solicitado_por_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('adicao', 'edicao') NOT NULL,
    referencia_id INT NOT NULL, 
    lida BOOLEAN NOT NULL DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT IGNORE INTO roles (id, nome) VALUES (1, 'comum');
INSERT IGNORE INTO roles (id, nome) VALUES (2, 'adm');