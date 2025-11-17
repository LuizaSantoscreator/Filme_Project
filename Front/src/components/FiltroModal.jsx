import React, { useEffect } from "react";
import "../style/style_components/FiltroModal.css";

// Esse é o modal (janela flutuante) para filtrar os filmes
export default function FiltroModal({ isOpen, onClose, onApply }) {
  
  // Aqui eu faço o modal fechar se o usuário apertar a tecla ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Se o modal não estiver aberto, não retorno nada (não mostro na tela)
  if (!isOpen) return null;

  // Quando o usuário clica em "Aplicar filtros"
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    
    const anoValor = data.get("ano").trim();

    // Pego todos os valores que o usuário preencheu
    const filtros = {
      generos: data.getAll("generos"),
      atores: data.get("atores"),
      diretor: data.get("diretor"),
      ano: anoValor || null, 
    };
    
    // Mando os filtros de volta para a TelaFilmes e fecho o modal
    onApply(filtros);
    onClose();
  };

  return (
    <div className="filtro-overlay" role="dialog" aria-modal="true">
      <div className="filtro-modal">
        <button
          className="filtro-fechar"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="filtro-form">
          <h2 className="filtro-titulo">Filtrar por:</h2>

          {/* Lista de gêneros com checkboxes */}
          <div className="filtro-generos">
            {[
              "Romance", "Fantasia", "Suspense", "Biografia", "Animação",
              "Aventura", "Comédia", "Drama", "Musical", "Terror", "Ação",
            ].map((genero) => (
              <label key={genero} className="checkbox-label">
                <input
                  type="checkbox"
                  name="generos"
                  value={genero}
                  className="checkbox-input"
                />
                {genero}
              </label>
            ))}
          </div>

          <div className="filtro-campo">
            <label htmlFor="atores">Pesquise por:</label>
            <input type="text" id="atores" name="atores" placeholder="Atores principais..." />
          </div>

          <div className="filtro-campo">
            <label htmlFor="diretor">Pesquise por:</label>
            <input type="text" id="diretor" name="diretor" placeholder="Nome do diretor..." />
          </div>

          <div className="filtro-campo">
            <label htmlFor="ano">Pesquise por ano:</label>
            <input type="number" id="ano" name="ano" placeholder="Ex: 1997" />
          </div>

          <div className="filtro-botoes">
            <button type="submit" className="btn-aplicar">
              Aplicar filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}