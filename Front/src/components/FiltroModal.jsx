// src/components/FiltroModal.jsx (CORRIGIDO)

import React, { useEffect } from "react";
import "../style/style_components/FiltroModal.css";

/**
 * Componente Modal de Filtros de Filmes
 * Props:
 * - isOpen: controla se o modal está aberto
 * - onClose: função para fechar o modal
 * - onApply: função chamada ao aplicar filtros
 */
export default function FiltroModal({ isOpen, onClose, onApply }) {
  // Fecha modal ao pressionar "ESC"
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    
    // Pega o valor do ano e remove espaços em branco
    const anoValor = data.get("ano").trim();

    const filtros = {
      generos: data.getAll("generos"),
      atores: data.get("atores"),
      diretor: data.get("diretor"),
      ano: anoValor || null, // Envia 'null' se o campo estiver vazio
    };
    
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

          {/* --- GÊNEROS (sem alteração) --- */}
          <div className="filtro-generos">
            {[
              "Romance",
              "Fantasia",
              "Suspense",
              "Aventura",
              "Comédia",
              "Drama",
              "Musical",
              "Terror",
              "Ação",
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

          {/* --- CAMPOS DE BUSCA (sem alteração) --- */}
          <div className="filtro-campo">
            <label htmlFor="atores">Pesquise por:</label>
            <input
              type="text"
              id="atores"
              name="atores"
              placeholder="Atores principais..."
            />
          </div>

          <div className="filtro-campo">
            <label htmlFor="diretor">Pesquise por:</label>
            <input
              type="text"
              id="diretor"
              name="diretor"
              placeholder="Nome do diretor..."
            />
          </div>

          {/* --- CAMPO DE ANO (CORRIGIDO) --- */}
          {/* Trocamos o <select> por um <input> */}
          <div className="filtro-campo">
            <label htmlFor="ano">Pesquise por ano:</label>
            <input
              type="number" // 'number' é melhor para ano (mostra teclado numérico no mobile)
              id="ano"
              name="ano"
              placeholder="Ex: 1997"
              // O CSS já pega '.filtro-campo input'
            />
          </div>
          {/* --- FIM DA CORREÇÃO --- */}

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