// src/components/Header.jsx (FINAL CORRIGIDO)

import React, { useState } from "react";
// 1. Importar 'useLocation' para ver a URL atual
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import "../style/style_components/Header.css";

// Função utilitária para obter o papel do usuário
const getUserRole = () => {
  const userDataString = localStorage.getItem("userData");
  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);
      return userData.role;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuAberto, setMenuAberto] = useState(false); // Novo estado para o menu
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber onde estamos
  
  const userRole = getUserRole(); // 'adm', 'comum', ou null

  // Links dinâmicos (que você já tinha)
  const homeLink = userRole === 'adm' ? '/admin' : '/home';
  const filmesLink = userRole === 'adm' ? '/admin/visualizar-filmes' : '/filmes';

  // --- CORREÇÃO DA BUSCA ---
  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (!searchTerm.trim()) {
      return; 
    }
    
    // 1. Redireciona SEMPRE para a tela de filmes do usuário ('/filmes')
    // 2. Adiciona o termo de busca como query param 'titulo' (como o backend espera)
    navigate(`/filmes?titulo=${searchTerm.trim()}`);
    setSearchTerm(''); // Limpa a barra após a busca
  };
  // --- FIM DA CORREÇÃO DA BUSCA ---

  // Lógica de Logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login'); // Redireciona para o login após sair
  };


  // Links do menu de perfil (Novo)
  const renderProfileMenu = () => {
    // Se estiver em uma página de login, não mostra nada
    if (location.pathname.includes('login') || location.pathname.includes('cadastro')) {
        return null;
    }
    
    return (
      <div className="navbar-perfil-container">
        <button className="navbar-perfil-icon" onClick={() => setMenuAberto(!menuAberto)}>
          {/* Ícone de Usuário (Você pode usar um ícone SVG ou texto '👤') */}
          {userRole === 'adm' ? '👑' : '👤'} 
        </button>
        
        {menuAberto && (
          <div className="navbar-perfil-dropdown">
            {userRole === 'adm' ? (
              // Links do ADM
              <>
                <Link to="/home">Acessar como Usuário</Link>
                <button onClick={handleLogout}>Sair</button>
              </>
            ) : userRole === 'comum' ? (
              // Links do Usuário Comum
              <>
                <Link to="/login-adm">Login Admin</Link>
                <button onClick={handleLogout}>Sair</button>
              </>
            ) : (
              // Links para deslogado (só Login)
              <>
                <Link to="/login">Fazer Login</Link>
                <Link to="/login-adm">Login Admin</Link>
              </>
            )}
          </div>
        )}
      </div>
    );
  };


  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo">
          <Link to={homeLink}>LOGO</Link>
        </div>

        {/* LINKS */}
        <nav className="navbar-links">
          <Link to={homeLink}>Home</Link>
          <Link to={filmesLink}>Filmes</Link>
        </nav>

        {/* BARRA DE PESQUISA (agora tipo submit) */}
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button type="submit">Buscar</button>
        </form>

        {/* --- NOVO: Ícone de Perfil e Menu --- */}
        {renderProfileMenu()}

        <div className="navbar-menu">
          <span>☰</span>
        </div>
      </div>
    </header>
  );
}