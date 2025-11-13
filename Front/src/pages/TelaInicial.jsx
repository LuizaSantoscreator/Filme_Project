import React, { useState, useEffect } from "react";
// Importe o 'Link' para fazer os botões navegarem
import { Link } from "react-router-dom";
import "../style/style_pages/TelaInicial.css";
import imagemInicial from "../assets/mulher_pagina_inicial.png";
import imagemForm from "../assets/Imagem_tela _inicial_forms.png";
// Imports de 'personagem', 'garota', 'avatar' não estão sendo usados
// import personagem from "../assets/Imagem_adm.png";
// import garota from "../assets/imagem_titanic.png";
// import avatar from "../assets/imagem_lobo_wall_streats.png";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function TelaInicial() {
  // --- CONEXÃO COM O BACKEND (INÍCIO) ---

  // Criamos um 'estado' para guardar os filmes que vêm do backend
  const [filmes, setFilmes] = useState([]);
  const [error, setError] = useState(null);

  // 'useEffect' roda o código uma vez, quando o componente carrega
  useEffect(() => {
    // Criamos uma função para buscar os dados
    const fetchFilmes = async () => {
      try {
        // Faz a requisição GET para a rota do seu backend
        const response = await fetch('http://localhost:8000/filmes');

        if (!response.ok) {
          throw new Error('Falha ao buscar filmes do servidor.');
        }

        const data = await response.json();
        // Pegamos apenas os 4 primeiros filmes para esta seção
        setFilmes(data.slice(0, 4));

      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar filmes:", err);
      }
    };

    fetchFilmes(); // Executa a função
  }, []); // O array vazio [] faz com que isso rode só uma vez

  // --- CONEXÃO COM O BACKEND (FIM) ---

  return (
    <div className="tela-inicial">
      {/* HEADER FIXO */}
      <Header />

      {/* SEÇÃO 1 - Apresentação */}
      <section className="hero-section">
        <div className="texto-hero">
          <h2>ACESSE NOSSA LISTA COMPLETA DE FILMES</h2>
          {/* O botão agora é um Link que leva para a página de filmes */}
          <Link to="/filmes" className="btn-primario">
            Filmes
          </Link>
        </div>
        <div className="img-hero">
          <img src={imagemInicial} alt="Imagem inicial" />
        </div>
      </section>

      {/* SEÇÃO 2 - Filmes populares (AGORA DINÂMICO) */}
      <section className="populares-section">
        <h3>FILMES MAIS POPULARES</h3>
        <div className="lista-filmes">

          {/* Se der erro, mostramos a mensagem */}
          {error && <p>Erro ao carregar filmes: {error}</p>}

          {/* Se não der erro, usamos .map() para criar os cards */}
          {!error && filmes.map((filme) => (
            <div className="card-filme" key={filme.id}>
              {/* Usamos a poster_url do backend */}
              <img
                src={filme.poster_url}
                alt={`Pôster do filme ${filme.titulo}`}
                className="card-filme-poster" // Adicionei uma classe
              />
              <h4>{filme.titulo}</h4>
              {/* O botão agora é um Link para a página de detalhes do filme */}
              <Link to={`/filmes/${filme.id}`} className="btn-card-acessar">
                Acessar
              </Link>
            </div>
          ))}

        </div>
      </section>

      {/* SEÇÃO 3 - Sugestões */}
      <section className="sugestoes-section">
        <div className="texto-sugestoes">
          <h3>AGORA VOCÊ PODE ENVIAR SUGESTÕES DE FILMES!!!</h3>
          <p>
            Acesse o formulário abaixo e envie o filme que gostaria de ver na
            plataforma!
          </p>
          {/* O botão agora é um Link para o formulário de adição */}
          <Link to="/admin/adicionar-filme" className="btn-secundario">
            Acesse o formulário
          </Link>
        </div>
        <div className="img-sugestoes">
          <img src={imagemForm} alt="Ilustração" />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}