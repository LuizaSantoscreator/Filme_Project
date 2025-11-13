import React from "react";
// 1. Importe o Link
import { Link } from "react-router-dom";
import "../style/style_components/CardFilme.css";


function CardFilme({ filme }) {
  return (
    <article className="card-filme" aria-label={`Filme ${filme.titulo}`}>
      <img
        // 3. Use a poster_url do filme
        src={filme.poster_url || "https://via.placeholder.com/200x300"}
        alt={`Capa do filme ${filme.titulo}`}
        className="card-imagem"
      />
      <h3 className="card-titulo">{filme.titulo}</h3>

      {/* 4. O <button> foi trocado por um <Link> */}
      {/* Ele navega para a rota de detalhes [cite: O usuário forneceu o arquivo App.jsx] usando o ID do filme */}
      <Link
        to={`/filmes/${filme.id}`}
        className="card-botao"
      >
        Acessar
      </Link>
    </article>
  );
}

export default CardFilme;