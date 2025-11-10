import React from "react";
import "../style/style_components/CardFilme.css";

/**
 * Componente de Card de Filme
 * Reutilizável em qualquer página (listagens, seções, etc.)
 */
function CardFilme({ titulo, imagem, onAcessar }) {
  return (
    <article className="card-filme" aria-label={`Filme ${titulo}`}>
      <img
        src={imagem || "https://via.placeholder.com/200x300"}
        alt={`Capa do filme ${titulo}`}
        className="card-imagem"
      />
      <h3 className="card-titulo">{titulo}</h3>
      <button className="card-botao" onClick={onAcessar}>
        Acessar
      </button>
    </article>
  );
}

export default CardFilme;
