import React from "react";
import CardFilme from "./CardFilme";
import "../style/style_components/SecaoFilmes.css";

/**
 * Componente de Seção de Filmes
 * Recebe um título e uma lista de filmes para exibir
 */
function SecaoFilmes({ titulo, filmes }) {
  return (
    <section className="secao-filmes" aria-label={`Seção ${titulo}`}>
      <h2 className="secao-titulo">{titulo}</h2>
      <div className="lista-filmes">
        {filmes && filmes.length > 0 ? (
          filmes.map((filme) => (
            <CardFilme
              key={filme.id}
              titulo={filme.titulo}
              imagem={filme.imagem_url}
              onAcessar={() => alert(`Acessar ${filme.titulo}`)}
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
