import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/style_components/Header.css";
import userIcon from "../assets/icons8-usuário-30.png"; 


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
  const location = useLocation(); 
  const userRole = getUserRole(); 
  const homeLink = userRole === 'adm' ? '/admin' : '/home';
  const filmesLink = userRole === 'adm' ? '/admin/visualizar-filmes' : '/filmes';
  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (!searchTerm.trim()) {
      return; 
    }
    navigate(`/filmes?titulo=${searchTerm.trim()}`);
    setSearchTerm('');
  };


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login'); 
  };


  const renderProfileMenu = () => {
    if (location.pathname.includes('login') || location.pathname.includes('cadastro') || location.pathname === '/') {
        return null;
    }
    
    return (
      <div className="navbar-perfil-container">
        <button className="navbar-perfil-icon" onClick={() => setMenuAberto(!menuAberto)}>
          <img src={userIcon} alt="Ícone de Perfil" className="perfil-img" />
        </button>
        
        {menuAberto && (
          <div className="navbar-perfil-dropdown">
            {userRole === 'adm' ? (
              <>
                <button onClick={handleLogout}>Sair</button>
              </>
            ) : userRole === 'comum' ? (
              <>
                <Link to="/login-adm">Login Admin</Link>
                <button onClick={handleLogout}>Sair</button>
              </>
            ) : (
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
          <Link to={homeLink}>LOGO</Link>
        </div>

        <nav className="navbar-links">
          <Link to={homeLink}>Home</Link>
          <Link to={filmesLink}>Filmes</Link>
        </nav>

        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.g.target.value)} 
          />
          <button type="submit">Buscar</button>
        </form>

        {renderProfileMenu()}

        <div className="navbar-menu">
          <span>☰</span>
        </div>
      </div>
    </header>
  );
}