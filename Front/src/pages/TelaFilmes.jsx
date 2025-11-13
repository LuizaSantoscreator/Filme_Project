import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SecaoFilmes from "../components/SecaoFilmes";
import FiltroModal from "../components/FiltroModal";
import "../style/style_pages/TelaFilmes.css";

import imagemTitanic from "../assets/imagem_titanic.png";
import imagemLobo from "../assets/imagem_lobo_wall_streats.png";
// Importe o 'Link' para os botões "Saiba Mais"
import { Link } from "react-router-dom";

function TelaFilmes() {
  const [filmes, setFilmes] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  
  const [filtros, setFiltros] = useState(null);
  const [busca, setBusca] = useState("");
  
  // Este estado "força" o useEffect a rodar
  const [triggerFetch, setTriggerFetch] = useState(0);

  // --- CONEXÃO COM O BACKEND (CORRIGIDO) ---
  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        let url = "";
        const params = new URLSearchParams();

        // 1. Adiciona o termo da barra de busca (se existir)
        // O backend espera 'titulo'
        if (busca) {
          params.append('titulo', busca);
        }

        // 2. Adiciona os filtros do modal (se existirem)
        if (filtros) {

          // ---- CORREÇÃO 1: GÊNEROS (PLURAL) ----
          // O modal envia 'generos' (plural) como um array.
          // O backend só suporta UM gênero, então pegamos o primeiro.
          if (filtros.generos && filtros.generos.length > 0) {
            params.append('genero', filtros.generos[0]); 
            // OBS: Seu backend só filtra um gênero.
            // Se quiser filtrar múltiplos, o backend precisará ser alterado.
          }

          if (filtros.ano) {
            params.append('ano', filtros.ano);
          }
          if (filtros.diretor) {
            params.append('diretor', filtros.diretor);
          }

          // ---- CORREÇÃO 2: ATORES (PLURAL/SINGULAR) ----
          // O modal envia 'atores' (plural).
          // O backend espera 'ator' (singular).
          if (filtros.atores) { 
            params.append('ator', filtros.atores); 
          }
        }

        const queryString = params.toString();

        // 3. Decide qual rota do backend chamar
        if (queryString) {
          url = `http://localhost:8000/filmes/buscar?${queryString}`;
        } else {
          url = "http://localhost:8000/filmes";
        }
        
        console.log("Buscando na URL:", url); // Para depuração

        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao carregar filmes.");
        const data = await response.json();
        
        setFilmes(data);
        if(data.length === 0) {
          setErro("Nenhum filme encontrado com esses critérios.");
        } else {
          setErro("");
        }

      } catch (error) {
        console.error(error);
        setFilmes([]); 
        setErro("Não foi possível carregar os filmes.");
      }
    };
    
    fetchFilmes();
    
  }, [triggerFetch]); // Roda sempre que 'triggerFetch' mudar

  
  // --- FUNÇÕES DE BUSCA E FILTRO ---

  const aplicarFiltros = (filtrosSelecionados) => {
    setFiltros(filtrosSelecionados); // Salva os filtros
    setBusca(""); // Limpa a busca de texto ao aplicar filtros
    setTriggerFetch(t => t + 1); // Dispara o useEffect
    setModalAberto(false);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setFiltros(null); // Limpa os filtros de modal ao usar a busca
    setTriggerFetch(t => t + 1); // Dispara o useEffect
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
          {/* Adicione o ID do filme se souber */}
          <Link to="/filmes/4" className="btn-principal">
            Saiba Mais
          </Link>
        </div>
      </section>

      {/* --- BARRA DE BUSCA E FILTRO --- */}
      <section className="filtro-section" aria-label="Busca e filtros de filmes">
        <form className="filtro-container" onSubmit={handleBuscar}>
          <input
            type="text"
            className="campo-busca"
            placeholder="Busque por título..."
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
        {/* Esta seção agora mostra os resultados da busca ou filtros */}
        <SecaoFilmes 
          titulo={filtros || busca ? "Resultados" : "Todos os Filmes"} 
          filmes={filmes} 
        />
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
          {/* Adicione o ID do filme se souber */}
          <Link to="/filmes/3" className="btn-principal">
            Saiba Mais
          </Link>
        </div>
      </section>

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