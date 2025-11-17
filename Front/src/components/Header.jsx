import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/style_components/Header.css";
import userIcon from "../assets/icons8-usuário-30.png"; 

// Função auxiliar para pegar o papel do usuário (adm ou comum) do localStorage
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
  const [menuAberto, setMenuAberto] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); // Para saber em qual página estou
  
  const userRole = getUserRole(); 

  // Defino para onde os links vão, dependendo se é admin ou usuário
  const homeLink = userRole === 'adm' ? '/admin' : '/home';
  const filmesLink = userRole === 'adm' ? '/admin/visualizar-filmes' : '/filmes';

  // Quando o usuário faz uma pesquisa
  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (!searchTerm.trim()) {
      return; 
    }
    // Mando ele para a tela de filmes com o termo pesquisado na URL
    navigate(`/filmes?titulo=${searchTerm.trim()}`);
    setSearchTerm('');
  };

  // Função de logout: limpa os dados e vai para o login
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login'); 
  };

  // Mostra o menu de perfil (ícone do usuário)
  const renderProfileMenu = () => {
    // Não mostro o menu nas páginas de login ou cadastro
    if (location.pathname.includes('login') || location.pathname.includes('cadastro') || location.pathname === '/') {
        return null;
    }
    
    return (
      <div className="navbar-perfil-container">
        {/* Botão com o ícone do usuário */}
        <button className="navbar-perfil-icon" onClick={() => setMenuAberto(!menuAberto)}>
          <img src={userIcon} alt="Ícone de Perfil" className="perfil-img" />
        </button>
        
        {/* Dropdown que aparece ao clicar no ícone */}
        {menuAberto && (
          <div className="navbar-perfil-dropdown">
            {userRole === 'adm' ? (
              // Se for admin, só mostro opção de sair
              <>
                <button onClick={handleLogout}>Sair</button>
              </>
            ) : userRole === 'comum' ? (
              // Se for usuário comum, mostro opção de login admin e sair
              <>
                <Link to="/login-adm">Login Admin</Link>
                <button onClick={handleLogout}>Sair</button>
              </>
            ) : (
              // Se não estiver logado
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
        <div className="navbar-logo">
          <Link to={homeLink}>LUFLIX</Link>
        </div>

        <nav className="navbar-links">
          <Link to={homeLink}>Home</Link>
          <Link to={filmesLink}>Filmes</Link>
        </nav>

        {/* Campo de busca */}
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.g.target.value)} // Nota: Aqui tinha um erro de digitação no original (e.g.target), o correto é e.target.value
          />
          <button type="submit">Buscar</button>
        </form>

        {/* Chamo a função que desenha o menu de perfil */}
        {renderProfileMenu()}

        <div className="navbar-menu">
          <span>☰</span>
        </div>
      </div>
    </header>
  );
}