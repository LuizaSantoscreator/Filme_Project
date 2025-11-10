import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SecaoFilmes from "../components/SecaoFilmes";
import "../style/style_pages/TelaFilmes.css";

/**
 * Página principal de Filmes
 * Exibe destaques e múltiplas seções de categorias
 */
function TelaFilmes() {
  const [filmes, setFilmes] = useState([]);
  const [erro, setErro] = useState("");

  // Busca filmes do backend
  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await fetch("http://localhost:8000/filmes");
        if (!response.ok) throw new Error("Erro ao carregar filmes.");
        const data = await response.json();
        setFilmes(data);
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os filmes.");
      }
    };
    fetchFilmes();
  }, []);

  return (
    <div className="tela-filmes">
      <Header />

      {/* Seção de destaque principal */}
      <section className="banner-filme" aria-label="Filme em destaque">
        <div className="overlay"></div>
        <div className="conteudo-banner">
          <h1>TITANIC</h1>
          <p className="descricao-banner">
            Um épico de James Cameron sobre amor, classe e destino a bordo do
            Titanic.
          </p>
          <button className="btn-principal">Saiba Mais</button>
        </div>
      </section>

      {/* Seções dinâmicas */}
      {erro && <p className="mensagem-erro">{erro}</p>}

      <SecaoFilmes titulo="Filmes para dar risada" filmes={filmes} />
      <SecaoFilmes titulo="Filmes para se emocionar" filmes={filmes} />

      {/* Segundo destaque */}
      <section
        className="banner-filme banner-secundario"
        aria-label="Filme destaque 2"
      >
        <div className="overlay"></div>
        <div className="conteudo-banner">
          <h1>O LOBO DE WALL STREET</h1>
          <p className="descricao-banner">
            A ascensão e queda de Jordan Belfort, um corretor de ações
            carismático e implacável.
          </p>
          <button className="btn-principal">Saiba Mais</button>
        </div>
      </section>

      <SecaoFilmes titulo="Filmes para dar risada" filmes={filmes} />
      <SecaoFilmes titulo="Filmes para se emocionar" filmes={filmes} />

      <Footer />
    </div>
  );
}

export default TelaFilmes;
