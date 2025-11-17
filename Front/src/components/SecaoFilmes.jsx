import React from "react";
import CardFilme from "./CardFilme";
import "../style/style_components/SecaoFilmes.css";

// Componente que cria uma seção inteira de filmes (título + lista de cards)
function SecaoFilmes({ titulo, filmes }) {
  return (
    <section className="secao-filmes" aria-label={`Seção ${titulo}`}>
      <h2 className="secao-titulo">{titulo}</h2>
      
      <div className="lista-filmes">
        {/* Se tiver filmes na lista, eu mapeio e crio um CardFilme para cada um */}
        {filmes && filmes.length > 0 ? (

          filmes.map((filme) => (
            <CardFilme
              key={filme.id}
              filme={filme}
            />
          ))
        ) : (
          // Se a lista estiver vazia, aviso o usuário
          <p className="mensagem-vazia">Nenhum filme encontrado.</p>
        )}
      </div>
    </section>
  );
}

export default SecaoFilmes;