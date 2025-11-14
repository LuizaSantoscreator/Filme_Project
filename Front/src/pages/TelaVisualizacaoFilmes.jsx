import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaVisualizacaoFilmes.css"; 

export default function TelaDetalhes() {
  const { id } = useParams();
  const [filme, setFilme] = useState(null);


  useEffect(() => {
    async function fetchFilme() {
      try {
        const response = await fetch(`http://localhost:8000/filmes/${id}`);
        const data = await response.json();
        setFilme(data);
      } catch (error) {
        console.error("Erro ao carregar o filme:", error);
      }
    }
    fetchFilme();
  }, [id]);

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
              <strong>Atores:</strong> {filme.atores?.join(", ") || "Não informado"}
            </p>
            <p>
              <strong>Diretor:</strong> {filme.diretores?.join(", ") || "Não informado"}
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}