import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/style_pages/TelaInicial.css";
import imagemInicial from "../assets/mulher_pagina_inicial.png";
import imagemForm from "../assets/Imagem_tela _inicial_forms.png";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import CardFilme from "../components/CardFilme.jsx";

export default function TelaInicial() {
  const [filmes, setFilmes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await fetch('http://localhost:8000/filmes');
        if (!response.ok) {
          throw new Error('Falha ao buscar filmes do servidor.');
        }
        const data = await response.json();
        setFilmes(data.slice(0, 4));
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar filmes:", err);
      }
    };
    fetchFilmes(); 
  }, []); 

  return (
    <div className="tela-inicial">
      <Header />
      <section className="hero-section">
        <div className="texto-hero">
          <h2>ACESSE NOSSA LISTA COMPLETA DE FILMES</h2>
          <Link to="/filmes" className="btn-primario">
            Filmes
          </Link>
        </div>
        <div className="img-hero">
          <img src={imagemInicial} alt="Imagem inicial" />
        </div>
      </section>

      <section className="populares-section">
        <h3>FILMES MAIS POPULARES</h3>
        <div className="lista-filmes">

          {error && <p>Erro ao carregar filmes: {error}</p>}

          {!error && filmes.map((filme) => (
            <CardFilme 
              key={filme.id} 
              filme={filme} 
            />
          ))}

        </div>
      </section>


      <section className="sugestoes-section">
        <div className="texto-sugestoes">
          <h3>AGORA VOCÊ PODE ENVIAR SUGESTÕES DE FILMES!!!</h3>
          <p>
            Acesse o formulário abaixo e envie o filme que gostaria de ver na
            plataforma!
          </p>
          <Link to="/adicionar-filme" className="btn-secundario"> 
            Acesse o formulário
          </Link>
        </div>
        <div className="img-sugestoes">
          <img src={imagemForm} alt="Ilustração" />
        </div>
      </section>

      <Footer />
    </div>
  );
}