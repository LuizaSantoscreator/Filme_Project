import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SecaoFilmes from "../components/SecaoFilmes";
import FiltroModal from "../components/FiltroModal";
import "../style/style_pages/TelaFilmes.css";
import imagemTitanic from "../assets/imagem_titanic.png";

function TelaFilmes() {
  // Aqui eu guardo a lista de filmes, erros e se o modal de filtro está aberto
  const [filmes, setFilmes] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  
  // Aqui guardo os filtros e a busca que o usuário digitou
  const [filtros, setFiltros] = useState(null);
  const [busca, setBusca] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(0);

  // Uso isso para ver o que tem na URL (ex: ?titulo=Batman)
  const location = useLocation();

  // Essa parte roda sempre que a URL muda. Se tiver uma busca lá, eu pego ela.
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const termoBuscaURL = query.get('titulo'); 

    if (termoBuscaURL) {
      setBusca(termoBuscaURL);
      setFiltros(null);  
      setTriggerFetch(t => t + 1); // Forço a busca a acontecer
    } else if (!busca && !filtros && location.search) {
      setTriggerFetch(t => t + 1);
    }
  }, [location.search]);

  // Aqui é onde eu busco os filmes do meu backend
  useEffect(() => {
    const fetchFilmes = async () => {
      let url = "";
      const params = new URLSearchParams();

      // Se tiver busca, adiciono na URL
      if (busca) {
        params.append('titulo', busca);
      }

      // Se tiver filtros (ano, gênero), adiciono também
      if (filtros) {
        if (filtros.generos && filtros.generos.length > 0) {
          params.append('genero', filtros.generos[0]); 
        }
        if (filtros.ano) params.append('ano', filtros.ano);
        if (filtros.diretor) params.append('diretor', filtros.diretor);
        if (filtros.atores) params.append('ator', filtros.atores);
      }

      const queryString = params.toString();

      // Se tiver filtros, uso a rota de buscar. Se não, pego todos.
      if (queryString) {
        url = `http://localhost:8000/filmes/buscar?${queryString}`;
      } else {
        url = "http://localhost:8000/filmes"; 
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.erro || "Erro ao carregar filmes.");
        }
        const data = await response.json();

        setFilmes(data);
        if (data.length === 0) {
          setErro("Nenhum filme encontrado com esses critérios.");
        } else {
          setErro(""); 
        }

      } catch (error) {
        console.error(error);
        setFilmes([]);
        setErro(`Não foi possível carregar os filmes: ${error.message}`);
      }
    };

    fetchFilmes();
  }, [triggerFetch, busca, filtros]);

  // Essa função salva os filtros que o usuário escolheu no modal
  const aplicarFiltros = (filtrosSelecionados) => {
    setFiltros(filtrosSelecionados);
    setBusca(""); 
    setTriggerFetch(t => t + 1); 
    setModalAberto(false); 
  };

  // Essa função roda quando eu clico no botão "Buscar" da tela
  const handleBuscar = (e) => {
    e.preventDefault();
    setFiltros(null);  
    setTriggerFetch(t => t + 1); 
  };

  return (
    <div className="tela-filmes">
      <Header />

      <section className="banner-filme" style={{ backgroundImage: `url(${imagemTitanic})` }}>
        <div className="overlay"></div>
        <div className="conteudo-banner">
          <h1>TITANIC</h1>
          <p className="descricao-banner">
            Um épico de James Cameron sobre amor, classe e destino a bordo do Titanic.
          </p>
          <Link to="/filmes/4" className="btn-principal">
            Saiba Mais
          </Link>
        </div>
      </section>

      {/* Barra de busca e botão de filtro */}
      <section className="filtro-section" aria-label="Busca e filtros de filmes">
        <form className="filtro-container" onSubmit={handleBuscar}>
          <input
            type="text"
            className="campo-busca"
            placeholder="Busque por título..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit" className="btn-buscar">Buscar</button>
          <button type="button" className="btn-filtro" onClick={() => setModalAberto(true)}>
             Filtros
          </button>
        </form>
      </section>

      {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

      <main>
        {/* Aqui eu mostro os cards dos filmes */}
        <SecaoFilmes 
          titulo={filtros || busca ? "Resultados" : "Todos os Filmes"} 
          filmes={filmes} 
        />
      </main>

      {/* O Modal de filtros que abre por cima da tela */}
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