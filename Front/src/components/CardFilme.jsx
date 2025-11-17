import React from "react";
import { Link } from "react-router-dom";
import "../style/style_components/CardFilme.css";

// Componente que desenha cada card de filme na tela
function CardFilme({ filme }) {
  return (
    // Crio um 'article' para o card, o que é bom para semântica
    <article className="card-filme" aria-label={`Filme ${filme.titulo}`}>
      {/* Se o filme não tiver imagem, coloco uma imagem de 'placeholder' */}
      <img
        src={filme.poster_url || "https://via.placeholder.com/200x300"}
        alt={`Capa do filme ${filme.titulo}`}
        className="card-imagem"
      />

      <div className="card-body"> 
        <h3 className="card-titulo">{filme.titulo}</h3>
        {/* Link que leva para a página de detalhes do filme */}
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