import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importe 'useNavigate'
import "../style/style_components/Header.css";

export default function Header() {
  // Estado para guardar o termo da busca
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hook para navegar (redirecionar)
  const navigate = useNavigate();

  // Função que é chamada quando o formulário é enviado
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Impede que a página recarregue
    if (!searchTerm.trim()) {
      return; // Não faz nada se a busca estiver vazia
    }
    
    // Redireciona o usuário para a página de filmes,
    // adicionando o termo de busca na URL.
    navigate(`/filmes?search=${searchTerm}`);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo">
          <Link to="/">LOGO</Link>
        </div>

        {/* LINKS */}
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/filmes">Filmes</Link>
        </nav>

        {/* BARRA DE PESQUISA (MODIFICADA) */}
        {/* Usamos um <form> para semântica e funcionalidade (Enter) */}
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchTerm} // Controla o valor pelo estado
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado
          />
          <button type="submit">Buscar</button>
        </form>

        {/* ÍCONE DO MENU (para mobile futuramente) */}
        <div className="navbar-menu">
          <span>☰</span>
        </div>
      </div>
    </header>
  );
}