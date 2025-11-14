
USE filminis_db;


INSERT IGNORE INTO generos (nome) VALUES 
('Ação'), ('Aventura'), ('Ficção Científica'), ('Drama'), ('Comédia'), 
('Terror'), ('Suspense'), ('Crime'), ('Fantasia'), ('Animação'), 
('Biografia'), ('Musical'), ('Romance'), ('Guerra');

INSERT IGNORE INTO diretores (nome) VALUES 
('Christopher Nolan'), ('Quentin Tarantino'), ('Martin Scorsese'), ('James Cameron'), 
('Irmãos Russo'), ('Peter Jackson'), ('Denis Villeneuve'), ('Greta Gerwig'), 
('Jordan Peele'), ('Bong Joon-ho'), ('Chad Stahelski'), ('Jon Favreau'), 
('Todd Phillips'), ('Damien Chazelle'), ('Lana Wachowski'), ('Lilly Wachowski'),
('Frank Darabont'), ('Ridley Scott'), ('James Gunn');

INSERT IGNORE INTO atores (nome) VALUES 
('Leonardo DiCaprio'), ('Christian Bale'), ('Margot Robbie'), ('Ryan Gosling'), 
('Cillian Murphy'), ('Robert Downey Jr.'), ('Chris Evans'), ('Scarlett Johansson'), 
('Joaquin Phoenix'), ('Uma Thurman'), ('John Travolta'), ('Samuel L. Jackson'), 
('Brad Pitt'), ('Keanu Reeves'), ('Laurence Fishburne'), ('Song Kang-ho'), 
('Timothée Chalamet'), ('Zendaya'), ('Daniel Kaluuya'), ('Emma Stone'), 
('Robert De Niro'), ('Al Pacino'), ('Kate Winslet'), ('Tim Robbins'), ('Morgan Freeman');


INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'O Cavaleiro das Trevas', 2008, 
    'Batman enfrenta o Coringa, um anarquista genial que mergulha Gotham no caos.', 
    'https://m.media-amazon.com/images/I/811S11n0-FL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ação')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Crime'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Christopher Nolan'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Christian Bale'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Pulp Fiction: Tempo de Violência', 1994, 
    'Vários contos entrelaçados de crime e redenção em Los Angeles.', 
    'https://m.media-amazon.com/images/I/71c0-j0j-YL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Crime')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Drama'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Quentin Tarantino'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'John Travolta')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Uma Thurman')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Samuel L. Jackson'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'O Lobo de Wall Street', 2013, 
    'A ascensão e queda de Jordan Belfort, um corretor da bolsa de Nova York.', 
    'https://m.media-amazon.com/images/I/71qaK50b-nL._AC_UF894,1000_QL80_.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Biografia')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Comédia')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Crime'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Martin Scorsese'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Leonardo DiCaprio')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Margot Robbie'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Titanic', 1997, 
    'Um romance floresce entre um artista pobre e uma aristocrata a bordo do malfadado navio.', 
    'https://m.media-amazon.com/images/I/71M-N-m-VQL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Drama')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Romance'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'James Cameron'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Leonardo DiCaprio')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Kate Winslet'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'A Origem', 2010, 
    'Um ladrão que rouba informações entrando nos sonhos das pessoas.', 
    'https://m.media-amazon.com/images/I/71qmS1x+aBL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ação')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ficção Científica'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Christopher Nolan'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Leonardo DiCaprio'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Vingadores: Guerra Infinita', 2018, 
    'Os Vingadores se unem para impedir o titã Thanos de coletar todas as Joias do Infinito.', 
    'https://m.media-amazon.com/images/I/810-lI-c-ML.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ação')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Aventura')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ficção Científica'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Irmãos Russo'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Robert Downey Jr.')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Chris Evans')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Scarlett Johansson'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Avatar: O Caminho da Água', 2022, 
    'Jake Sully vive com sua nova família em Pandora, mas uma ameaça familiar retorna.', 
    'https://m.media-amazon.com/images/I/81lVt6t-mIL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Aventura')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ficção Científica'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'James Cameron'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Nós', 2019, 
    'Uma família é aterrorizada por seus sósias sinistros.', 
    'https://m.media-amazon.com/images/I/91t-jo03-VL._AC_UF894,1000_QL80_.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Terror')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Suspense'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Jordan Peele'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Daniel Kaluuya'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'A Menina e o Dragão', 2021, 
    'A guerreira solitária Raya deve encontrar o último dragão para salvar seu mundo.', 
    'https://img.elo7.com.br/product/main/3484C14/poster-filme-a-menina-e-o-dragao-2019-FILME.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Animação')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Aventura')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Fantasia'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Barbie', 2023, 
    'Barbie e Ken deixam a Barbieland para descobrir as alegrias e perigos do mundo real.', 
    'https://m.media-amazon.com/images/I/717L-O2b6oL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Comédia')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Fantasia'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Greta Gerwig'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Margot Robbie')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Ryan Gosling'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Oppenheimer', 2023, 
    'A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.', 
    'https://m.media-amazon.com/images/I/71+2n0c-T4L.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Biografia')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Drama'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Christopher Nolan'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Cillian Murphy')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Robert Downey Jr.'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Parasita', 2019, 
    'A ganância e a discriminação de classe ameaçam a relação simbiótica recém-formada entre a rica família Park e a pobre família Kim.', 
    'https://m.media-amazon.com/images/I/71p1-I5nVNL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Suspense')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Drama'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Bong Joon-ho'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Song Kang-ho'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'John Wick: De Volta ao Jogo', 2014, 
    'Um ex-assassino de aluguel sai da aposentadoria para rastrear os gângsteres que levaram tudo dele.', 
    'https://m.media-amazon.com/images/I/81-K8aaD3rL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ação')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Suspense'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Chad Stahelski'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Keanu Reeves'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Homem de Ferro', 2008, 
    'O industrial bilionário Tony Stark constrói uma armadura de alta tecnologia e se torna o Homem de Ferro.', 
    'https://m.media-amazon.com/images/I/71wu5t60-HL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ação')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Aventura'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Jon Favreau'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Robert Downey Jr.'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Coringa', 2019, 
    'Em Gotham City, o comediante falido Arthur Fleck busca conexão enquanto caminha pelas ruas.', 
    'https://m.media-amazon.com/images/I/71K3-gEpftL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Crime')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Drama'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Todd Phillips'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Joaquin Phoenix'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'La La Land: Cantando Estações', 2016, 
    'Enquanto navegam por suas carreiras em Los Angeles, um pianista e uma atriz se apaixonam.', 
    'https://m.media-amazon.com/images/I/71nO4POtBBL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Comédia')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Drama')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Musical'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Damien Chazelle'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Ryan Gosling')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Emma Stone'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Matrix', 1999, 
    'Um hacker descobre a verdade sobre sua realidade e seu papel na guerra contra seus controladores.', 
    'https://m.media-amazon.com/images/I/511H-b-OitL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ação')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ficção Científica'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Lana Wachowski')),
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Lilly Wachowski'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Keanu Reeves')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Laurence Fishburne'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Duna', 2021, 
    'Paul Atreides, um jovem brilhante, deve viajar para o planeta mais perigoso do universo para garantir o futuro de seu povo.', 
    'https://m.media-amazon.com/images/I/81eB+l+n-OL.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Aventura')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Drama')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ficção Científica'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Denis Villeneuve'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Timothée Chalamet')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Zendaya'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Gladiador', 2000, 
    'Um general romano traído é forçado a se tornar um gladiador, buscando vingança contra o imperador.', 
    'https://m.media-amazon.com/images/I/71kBkIEOp+L.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Ação')),
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Aventura'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Ridley Scott'));

INSERT INTO filmes (titulo, ano, sinopse, poster_url)
VALUES (
    'Um Sonho de Liberdade', 1994, 
    'Dois homens presos criam um vínculo de amizade ao longo de vários anos, encontrando consolo e eventual redenção através de atos de decência comum.', 
    'https://m.media-amazon.com/images/I/71715eI-F-L.jpg'
);
SET @filme_id = LAST_INSERT_ID();
INSERT INTO filmes_generos (filme_id, genero_id) VALUES 
    (@filme_id, (SELECT id FROM generos WHERE nome = 'Drama'));
INSERT INTO filmes_diretores (filme_id, diretor_id) VALUES 
    (@filme_id, (SELECT id FROM diretores WHERE nome = 'Frank Darabont'));
INSERT INTO filmes_atores (filme_id, ator_id) VALUES 
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Tim Robbins')),
    (@filme_id, (SELECT id FROM atores WHERE nome = 'Morgan Freeman'));