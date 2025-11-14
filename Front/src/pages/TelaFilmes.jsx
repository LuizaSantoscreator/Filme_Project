import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
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
  const [triggerFetch, setTriggerFetch] = useState(0);

  // Hook para ler a URL atual e extrair os parâmetros de busca
  const location = useLocation();

  // Escuta a URL para termos de busca
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const termoBuscaURL = query.get('titulo'); // Pega o valor de '?titulo='

    if (termoBuscaURL) {
      // Se houver um termo de busca na URL, usa ele
      setBusca(termoBuscaURL);
      setFiltros(null);  // Limpa filtros
      setTriggerFetch(t => t + 1); // Força uma nova busca
    } else if (!busca && !filtros && location.search) {
      // Caso a URL seja limpa, mas os estados não, garante que a busca seja zerada
      setTriggerFetch(t => t + 1);
    }
  }, [location.search]);  // Executa sempre que a query string mudar

  // Hook para buscar filmes do backend
  useEffect(() => {
    const fetchFilmes = async () => {
      let url = "";
      const params = new URLSearchParams();

      // Adiciona o termo de busca (se houver)
      if (busca) {
        params.append('titulo', busca);
      }

      // Adiciona os filtros (se houver)
      if (filtros) {
        if (filtros.generos && filtros.generos.length > 0) {
          params.append('genero', filtros.generos[0]); // Apenas o primeiro gênero
        }
        if (filtros.ano) {
          params.append('ano', filtros.ano);
        }
        if (filtros.diretor) {
          params.append('diretor', filtros.diretor);
        }
        if (filtros.atores) {
          params.append('ator', filtros.atores);
        }
      }

      const queryString = params.toString();

      if (queryString) {
        url = `http://localhost:8000/filmes/buscar?${queryString}`;
      } else {
        url = "http://localhost:8000/filmes"; // Se não houver filtros, busca todos os filmes
      }

      console.log("Buscando na URL:", url);

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
          setErro(""); // Limpa o erro se encontrar filmes
        }

      } catch (error) {
        console.error(error);
        setFilmes([]);
        setErro(`Não foi possível carregar os filmes: ${error.message}`);
      }
    };

    fetchFilmes();
  }, [triggerFetch, busca, filtros]); // Recarrega sempre que 'triggerFetch', 'busca' ou 'filtros' mudarem

  // Função para aplicar filtros
  const aplicarFiltros = (filtrosSelecionados) => {
    setFiltros(filtrosSelecionados);
    setBusca("");  // Limpa o campo de busca ao aplicar filtros
    setTriggerFetch(t => t + 1); // Força a requisição de filmes com filtros aplicados
    setModalAberto(false); // Fecha o modal de filtros
  };

  // Função para buscar filmes ao submeter o formulário de busca
  const handleBuscar = (e) => {
    e.preventDefault();
    setFiltros(null);  // Limpa os filtros ao fazer uma busca
    setTriggerFetch(t => t + 1); // Dispara nova requisição de filmes
  };

  return (
    <div className="tela-filmes">
      <Header />

      <section
        className="banner-filme"
        style={{ backgroundImage: `url(${imagemTitanic})` }}
      >
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
             Filtros
          </button>
        </form>
      </section>

      {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

      <main>
        <SecaoFilmes 
          titulo={filtros || busca ? "Resultados" : "Todos os Filmes"} 
          filmes={filmes} 
        />
      </main>

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
