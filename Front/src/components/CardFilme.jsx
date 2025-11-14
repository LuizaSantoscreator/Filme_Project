import React from "react";
import { Link } from "react-router-dom";
import "../style/style_components/CardFilme.css";


function CardFilme({ filme }) {
  return (
    <article className="card-filme" aria-label={`Filme ${filme.titulo}`}>
      <img
        src={filme.poster_url || "https://via.placeholder.com/200x300"}
        alt={`Capa do filme ${filme.titulo}`}
        className="card-imagem"
      />

      <div className="card-body"> 
        <h3 className="card-titulo">{filme.titulo}</h3>
        <Link
          to={`/filmes/${filme.id}`}
          className="card-botao"
        >
          Acessar
        </Link>
      </div>
      
    </article>
  );
}

export default CardFilme;