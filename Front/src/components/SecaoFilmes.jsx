import React from "react";
import CardFilme from "./CardFilme";
import "../style/style_components/SecaoFilmes.css";

function SecaoFilmes({ titulo, filmes }) {
  return (
    <section className="secao-filmes" aria-label={`Seção ${titulo}`}>
      <h2 className="secao-titulo">{titulo}</h2>
      <div className="lista-filmes">
        {filmes && filmes.length > 0 ? (

          filmes.map((filme) => (

            <CardFilme
              key={filme.id}
              filme={filme}
            />
          ))
        ) : (
          <p className="mensagem-vazia">Nenhum filme encontrado.</p>
        )}
      </div>
    </section>
  );
}

export default SecaoFilmes;
