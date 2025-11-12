import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SecaoFilmes from "../components/SecaoFilmes";
import FiltroModal from "../components/FiltroModal";
import "../style/style_pages/TelaFilmes.css";

import imagemTitanic from "../assets/imagem_titanic.png";
import imagemLobo from "../assets/imagem_lobo_wall_streats.png";

function TelaFilmes() {
  const [filmes, setFilmes] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [filtros, setFiltros] = useState(null);
  const [busca, setBusca] = useState("");

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
  }, [filtros]);

  const aplicarFiltros = (filtrosSelecionados) => {
    console.log("Filtros aplicados:", filtrosSelecionados);
    setFiltros(filtrosSelecionados);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    console.log("Buscando por:", busca);
  };

  return (
    <div className="tela-filmes">
      <Header />

      {/* --- BANNER TITANIC --- */}
      <section
        className="banner-filme"
        style={{ backgroundImage: `url(${imagemTitanic})` }}
      >
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

      {/* --- BARRA DE BUSCA E FILTRO --- */}
      <section className="filtro-section" aria-label="Busca e filtros de filmes">
        <form className="filtro-container" onSubmit={handleBuscar}>
          <input
            type="text"
            className="campo-busca"
            placeholder="Busque por título, ator ou diretor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit" className="btn-buscar">
            Buscar
          </button>
          <button
            type="button"
            className="btn-filtro"
            onClick={() => setModalAberto(true)}
          >
            🔍 Filtros
          </button>
        </form>
      </section>

      {erro && <p className="mensagem-erro">{erro}</p>}

      {/* --- SEÇÕES DE FILMES --- */}
      <main>
        <SecaoFilmes titulo="Filmes para dar risada" filmes={filmes} />
        <SecaoFilmes titulo="Filmes para se emocionar" filmes={filmes} />
      </main>

      {/* --- BANNER SECUNDÁRIO --- */}
      <section
        className="banner-filme banner-secundario"
        style={{ backgroundImage: `url(${imagemLobo})` }}
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

      <main>
        <SecaoFilmes titulo="Filmes para dar risada" filmes={filmes} />
        <SecaoFilmes titulo="Filmes para se emocionar" filmes={filmes} />
      </main>

      {/* MODAL DE FILTRO */}
      <FiltroModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onApply={aplicarFiltros}
      />

      <Footer />
    </div>
  );
}

export default TelaFilmes;
