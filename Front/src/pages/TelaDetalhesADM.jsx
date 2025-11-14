import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaVisualizacaoFilmes.css"; 
import "../style/style_pages/TelaDetalhesADM.css"; 

export default function TelaDetalhesADM() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [filme, setFilme] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFilme() {
      try {
        const response = await fetch(`http://localhost:8000/filmes/${id}`);
        if (!response.ok) {
          throw new Error("Filme não encontrado.");
        }
        const data = await response.json();
        setFilme(data);
      } catch (error) {
        console.error("Erro ao carregar o filme:", error);
        setError(error.message);
      }
    }
    fetchFilme();
  }, [id]);
  const handleDeletar = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir este filme? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Erro: Você precisa estar logado como ADM.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/filmes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.erro || "Falha ao excluir o filme.");
      }

      alert(data.mensagem); 
      navigate("/admin/visualizar-filmes"); 
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div className="telaEspecificacoes">
        <Header />
        <main className="mainEspecificacoes">
          <p className="carregando">Erro: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!filme) {
    return (
      <div className="telaEspecificacoes">
        <Header />
        <main className="mainEspecificacoes">
          <p className="carregando">Carregando informações do filme...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="telaEspecificacoes">
      <Header />

      <main className="mainEspecificacoes">
        <div className="containerFilme">
          <img
            src={filme.poster_url}
            alt={`Pôster de ${filme.titulo}`}
            className="posterFilme"
          />

          <div className="detalhesFilme">
            <h1>{filme.titulo}</h1>
            <p className="sinopse">{filme.sinopse}</p>

            <p>
              <strong>Atores:</strong>{" "}
              {filme.atores?.join(", ") || "Não informado"}
            </p>
            <p>
              <strong>Diretor:</strong>{" "}
              {filme.diretores?.join(", ") || "Não informado"}
            </p>
            <p>
              <strong>Data de lançamento:</strong> {filme.ano}
            </p>

            <div className="generos">
              {filme.generos?.map((g, i) => (
                <span key={i} className="tagGenero">
                  {g}
                </span>
              ))}
            </div>

            <div className="admin-actions">
              <button
                onClick={handleDeletar}
                className="btn-admin-acao btn-admin-deletar"
              >
                Deletar
              </button>
              
              <Link
                to={`/admin/editar-filme/${filme.id}`} 
                className="btn-admin-acao btn-admin-editar"
              >
                Editar Filme
              </Link>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}