DROP DATABASE IF EXISTS filminis_db;
CREATE DATABASE filminis_db;
USE filminis_db;

-- --- CRIAÇÃO DAS TABELAS ---
CREATE TABLE roles (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(50) NOT NULL UNIQUE);
CREATE TABLE usuarios (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(100), email VARCHAR(100) UNIQUE, senha VARCHAR(255), role_id INT, FOREIGN KEY (role_id) REFERENCES roles(id));
CREATE TABLE generos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(100) UNIQUE);
CREATE TABLE diretores (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) UNIQUE);
CREATE TABLE atores (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) UNIQUE);
CREATE TABLE filmes (id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(255), ano INT, sinopse TEXT, poster_url VARCHAR(500));
CREATE TABLE filmes_generos (filme_id INT, genero_id INT, PRIMARY KEY(filme_id, genero_id), FOREIGN KEY(filme_id) REFERENCES filmes(id) ON DELETE CASCADE, FOREIGN KEY(genero_id) REFERENCES generos(id));
CREATE TABLE filmes_diretores (filme_id INT, diretor_id INT, PRIMARY KEY(filme_id, diretor_id), FOREIGN KEY(filme_id) REFERENCES filmes(id) ON DELETE CASCADE, FOREIGN KEY(diretor_id) REFERENCES diretores(id));
CREATE TABLE filmes_atores (filme_id INT, ator_id INT, PRIMARY KEY(filme_id, ator_id), FOREIGN KEY(filme_id) REFERENCES filmes(id) ON DELETE CASCADE, FOREIGN KEY(ator_id) REFERENCES atores(id));
CREATE TABLE solicitacoes_adicao (id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(255), ano INT, sinopse TEXT, poster_url VARCHAR(500), generos_texto VARCHAR(255), diretores_texto VARCHAR(255), atores_texto TEXT, solicitado_por_id INT, status ENUM('pendente','aprovado','rejeitado') DEFAULT 'pendente', data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(solicitado_por_id) REFERENCES usuarios(id));
CREATE TABLE solicitacoes_edicao (id INT AUTO_INCREMENT PRIMARY KEY, filme_id INT, campo_alterado VARCHAR(100), valor_antigo TEXT, valor_novo TEXT, solicitado_por_id INT, status ENUM('pendente','aprovado','rejeitado') DEFAULT 'pendente', data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(filme_id) REFERENCES filmes(id) ON DELETE CASCADE, FOREIGN KEY(solicitado_por_id) REFERENCES usuarios(id));

-- --- INSERÇÃO DE USUÁRIOS E GÊNEROS ---
INSERT INTO roles (id, nome) VALUES (1, 'comum'), (2, 'adm');
INSERT INTO usuarios (nome, email, senha, role_id) VALUES 
('Admin', 'admin@email.com', '$2b$12$r/hHqZ.Gj/o.g.o/o.g.oe.g.oe.g.oe.g.oe.g.oe.g.oe.g.oe', 2),
('Usuario', 'user@email.com', '$2b$12$r/hHqZ.Gj/o.g.o/o.g.oe.g.oe.g.oe.g.oe.g.oe.g.oe.g.oe', 1);

INSERT INTO generos (nome) VALUES 
('Romance'), ('Fantasia'), ('Suspense'), ('Biografia'), ('Animação'), 
('Aventura'), ('Comédia'), ('Drama'), ('Musical'), ('Terror'), ('Ação'), ('Ficção Científica');

-- populando o banco --
INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Titanic', 1997, 'Um artista pobre e uma jovem rica se apaixonam em uma viagem fatídica a bordo do Titanic.', 'https://upload.wikimedia.org/wikipedia/pt/2/22/Titanic_poster.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('James Cameron'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='James Cameron';
INSERT IGNORE INTO atores (nome) VALUES ('Leonardo DiCaprio'), ('Kate Winslet'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Leonardo DiCaprio', 'Kate Winslet');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Romance';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Orgulho e Preconceito', 2005, 'Elizabeth Bennet enfrenta a pressão social para casar, mas faíscas voam quando ela conhece o orgulhoso Sr. Darcy.', 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/87/84/14/20028635.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Joe Wright'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Joe Wright';
INSERT IGNORE INTO atores (nome) VALUES ('Keira Knightley'), ('Matthew Macfadyen'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Keira Knightley', 'Matthew Macfadyen');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Romance';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Harry Potter e a Pedra Filosofal', 2001, 'Um menino órfão descobre que é um bruxo e entra na Escola de Magia e Bruxaria de Hogwarts.', 'https://upload.wikimedia.org/wikipedia/pt/1/1d/Harry_Potter_Pedra_Filosofal_2001.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Chris Columbus'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Chris Columbus';
INSERT IGNORE INTO atores (nome) VALUES ('Daniel Radcliffe'), ('Emma Watson'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Daniel Radcliffe', 'Emma Watson');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Fantasia';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('O Senhor dos Anéis: A Sociedade do Anel', 2001, 'Um hobbit e seus companheiros partem em uma jornada para destruir um anel poderoso e impedir o lorde das trevas.', 'https://upload.wikimedia.org/wikipedia/pt/3/38/Lord_of_the_Rings_Fellowship_of_the_Ring.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Peter Jackson'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Peter Jackson';
INSERT IGNORE INTO atores (nome) VALUES ('Elijah Wood'), ('Ian McKellen'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Elijah Wood', 'Ian McKellen');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Fantasia';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Ilha do Medo', 2010, 'Um marechal dos EUA investiga o desaparecimento de uma assassina que escapou de um hospital psiquiátrico.', 'https://m.media-amazon.com/images/M/MV5BNDE4NDk1ODItMWVkNi00YTA0LWIzNDEtYzdjYjA2MGE3MzllXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Martin Scorsese'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Martin Scorsese';
INSERT IGNORE INTO atores (nome) VALUES ('Leonardo DiCaprio'), ('Mark Ruffalo'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Leonardo DiCaprio', 'Mark Ruffalo');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Suspense';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Psicose', 1960, 'Uma secretária em fuga se hospeda em um motel isolado administrado por um jovem estranho e sua mãe dominadora.', 'https://m.media-amazon.com/images/I/81RXnX6ilpL._UF1000,1000_QL80_.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Alfred Hitchcock'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Alfred Hitchcock';
INSERT IGNORE INTO atores (nome) VALUES ('Anthony Perkins'), ('Janet Leigh'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Anthony Perkins', 'Janet Leigh');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Suspense';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('A Rede Social', 2010, 'A história da criação do Facebook e as batalhas legais e pessoais enfrentadas por Mark Zuckerberg.', 'https://m.media-amazon.com/images/S/pv-target-images/0007148a033c995e36aaff6749431d416589d3cf4777bef8fc1bde48ba1f9fd7.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('David Fincher'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='David Fincher';
INSERT IGNORE INTO atores (nome) VALUES ('Jesse Eisenberg'), ('Andrew Garfield'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Jesse Eisenberg', 'Andrew Garfield');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Biografia';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Oppenheimer', 2023, 'A história do cientista J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.', 'https://br.web.img2.acsta.net/pictures/23/05/08/10/29/0695770.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Christopher Nolan'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Christopher Nolan';
INSERT IGNORE INTO atores (nome) VALUES ('Cillian Murphy'), ('Robert Downey Jr.'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Cillian Murphy', 'Robert Downey Jr.');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Biografia';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('A Viagem de Chihiro', 2001, 'Chihiro vaga por um mundo mágico governado por deuses, bruxas e espíritos, e onde humanos são transformados em bestas.', 'https://images.justwatch.com/poster/265231008/s718/a-viagem-de-chihiro.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Hayao Miyazaki'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Hayao Miyazaki';
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Animação';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Toy Story', 1995, 'Um boneco cowboy se sente ameaçado e com ciúmes quando um novo boneco astronauta de alta tecnologia se torna o favorito de seu dono.', 'https://m.media-amazon.com/images/I/71PB+z2xjeL._AC_UF894,1000_QL80_.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('John Lasseter'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='John Lasseter';
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Animação';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Indiana Jones e os Caçadores da Arca Perdida', 1981, 'O arqueólogo Indiana Jones corre contra o tempo para encontrar uma relíquia bíblica antes dos nazistas.', 'https://br.web.img3.acsta.net/medias/nmedia/18/91/97/58/20172484.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Steven Spielberg'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Steven Spielberg';
INSERT IGNORE INTO atores (nome) VALUES ('Harrison Ford'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Harrison Ford');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Aventura';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('As Aventuras de Pi', 2012, 'Um jovem que sobrevive a um desastre no mar é lançado em uma jornada épica de aventura e descoberta com um tigre de bengala.', 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/91/30/40/20328542.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Ang Lee'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Ang Lee';
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Aventura';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('As Branquelas', 2004, 'Dois agentes do FBI se disfarçam de mulheres ricas para investigar uma série de sequestros.', 'https://upload.wikimedia.org/wikipedia/pt/thumb/d/de/White_chicks.jpeg/250px-White_chicks.jpeg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Keenen Ivory Wayans'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Keenen Ivory Wayans';
INSERT IGNORE INTO atores (nome) VALUES ('Shawn Wayans'), ('Marlon Wayans'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Shawn Wayans', 'Marlon Wayans');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Comédia';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Se Beber, Não Case!', 2009, 'Três padrinhos acordam de uma despedida de solteiro em Las Vegas sem memória da noite anterior e com o noivo desaparecido.', 'https://play-lh.googleusercontent.com/vaUQFY-v9IkDclMcpqb2o3On9csvI1I4fl_wS7-IdoxdMkzClv3mtweZbon2Mpo_Zqddaw');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Todd Phillips'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Todd Phillips';
INSERT IGNORE INTO atores (nome) VALUES ('Bradley Cooper'), ('Zach Galifianakis'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Bradley Cooper', 'Zach Galifianakis');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Comédia';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Um Sonho de Liberdade', 1994, 'Dois homens presos criam um vínculo de amizade ao longo de anos, encontrando consolo e eventual redenção.', 'https://br.web.img2.acsta.net/medias/nmedia/18/90/16/48/20083748.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Frank Darabont'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Frank Darabont';
INSERT IGNORE INTO atores (nome) VALUES ('Tim Robbins'), ('Morgan Freeman'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Tim Robbins', 'Morgan Freeman');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Drama';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Forrest Gump', 1994, 'A história de um homem simples do Alabama que presencia e influencia momentos históricos nos Estados Unidos.', 'https://upload.wikimedia.org/wikipedia/pt/c/c0/ForrestGumpPoster.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Robert Zemeckis'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Robert Zemeckis';
INSERT IGNORE INTO atores (nome) VALUES ('Tom Hanks'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Tom Hanks');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Drama';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('La La Land', 2016, 'Um pianista de jazz e uma aspirante a atriz se apaixonam em Los Angeles enquanto perseguem seus sonhos.', 'https://br.web.img2.acsta.net/pictures/17/01/24/17/13/228823.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Damien Chazelle'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Damien Chazelle';
INSERT IGNORE INTO atores (nome) VALUES ('Ryan Gosling'), ('Emma Stone'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Ryan Gosling', 'Emma Stone');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Musical';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('O Mágico de Oz', 1939, 'Dorothy Gale é varrida por um tornado para a terra mágica de Oz e embarca em uma jornada para encontrar o Mágico.', 'https://br.web.img3.acsta.net/medias/nmedia/18/93/94/10/20287529.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Victor Fleming'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Victor Fleming';
INSERT IGNORE INTO atores (nome) VALUES ('Judy Garland'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Judy Garland');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Musical';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('O Iluminado', 1980, 'Uma família se isola em um hotel no inverno, onde o pai sucumbe à loucura e a influências sobrenaturais.', 'https://br.web.img3.acsta.net/pictures/14/10/10/19/21/152595.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Stanley Kubrick'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Stanley Kubrick';
INSERT IGNORE INTO atores (nome) VALUES ('Jack Nicholson'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Jack Nicholson');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Terror';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('O Exorcista', 1973, 'Quando uma menina é possuída por uma entidade misteriosa, sua mãe busca a ajuda de dois padres.', 'https://br.web.img2.acsta.net/medias/nmedia/18/87/26/84/19873738.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('William Friedkin'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='William Friedkin';
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Terror';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('O Cavaleiro das Trevas', 2008, 'Batman enfrenta o Coringa, que pretende mergulhar Gotham City na anarquia.', 'https://play-lh.googleusercontent.com/b0bqoD27ib25NwPutF8Kf740iiFQ53CKUz27VBQkCQtvSfhdWQtb8vwFxxn-SzI-5ZATXXkDwf2qPODkNQ');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Christopher Nolan'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Christopher Nolan';
INSERT IGNORE INTO atores (nome) VALUES ('Christian Bale'), ('Heath Ledger'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Christian Bale', 'Heath Ledger');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Ação';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Mad Max: Estrada da Fúria', 2015, 'Em um futuro pós-apocalíptico, uma mulher se rebela contra um governante tirânico em busca de sua terra natal.', 'https://m.media-amazon.com/images/M/MV5BZDJkNzQ2ZGMtZmI5YS00NzUxLThmNGEtZmE2OWY0MzE1NGM3XkEyXkFqcGc@._V1_.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('George Miller'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='George Miller';
INSERT IGNORE INTO atores (nome) VALUES ('Tom Hardy'), ('Charlize Theron'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Tom Hardy', 'Charlize Theron');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Ação';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Matrix', 1999, 'Um hacker de computador aprende sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.', 'https://upload.wikimedia.org/wikipedia/pt/c/c1/The_Matrix_Poster.jpg');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Irmãs Wachowski'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Irmãs Wachowski';
INSERT IGNORE INTO atores (nome) VALUES ('Keanu Reeves'), ('Laurence Fishburne'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Keanu Reeves', 'Laurence Fishburne');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Ficção Científica';

INSERT INTO filmes (titulo, ano, sinopse, poster_url) VALUES ('Interestelar', 2014, 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.', 'https://upload.wikimedia.org/wikipedia/pt/3/3a/Interstellar_Filme.png');
SET @fid = LAST_INSERT_ID();
INSERT IGNORE INTO diretores (nome) VALUES ('Christopher Nolan'); INSERT INTO filmes_diretores (filme_id, diretor_id) SELECT @fid, id FROM diretores WHERE nome='Christopher Nolan';
INSERT IGNORE INTO atores (nome) VALUES ('Matthew McConaughey'), ('Anne Hathaway'); INSERT INTO filmes_atores (filme_id, ator_id) SELECT @fid, id FROM atores WHERE nome IN ('Matthew McConaughey', 'Anne Hathaway');
INSERT INTO filmes_generos (filme_id, genero_id) SELECT @fid, id FROM generos WHERE nome='Ficção Científica';