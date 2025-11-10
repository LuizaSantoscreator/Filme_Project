import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/style_pages/TelaInicial.css'; // Vamos criar este arquivo CSS

// Importe seus ícones e imagens (ex: react-icons)
// Por agora, usarei placeholders de texto (LOGO, 👤, 🔍)
// import { FaUser, FaSearch, FaFacebookF, FaInstagram } from 'react-icons/fa';

/**
 * Componente funcional para a Tela Inicial (Homepage).
 * Exibe o hero, uma lista de filmes populares (buscados do backend)
 * e um CTA para sugestão de filmes.
 */
function TelaInicial() {
  // --- Estados ---
  const [filmes, setFilmes] = useState([]);
  const [error, setError] = useState(null);

  // --- Efeito de Carregamento (Data Fetching) ---
  useEffect(() => {
    /**
     * Busca os filmes da API backend.
     * Baseado em 'handle_get_all_filmes'.
     */
    const fetchFilmes = async () => {
      try {
        const response = await fetch('http://localhost:8000/filmes');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados dos filmes.');
        }
        const data = await response.json();
        // O protótipo mostra 4 filmes; pegamos os 4 primeiros da lista
        setFilmes(data.slice(0, 4));
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar filmes:", err);
      }
    };

    fetchFilmes();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  /**
   * Renderiza a grade de filmes ou mensagens de erro/carregamento.
   */
  const renderMovieGrid = () => {
    if (error) {
      return <p className="error-message">Erro ao carregar filmes: {error}</p>;
    }
    if (filmes.length === 0) {
      return <p>Carregando filmes...</p>;
    }
    return (
      <div className="movie-grid">
        {filmes.map((filme) => (
          <article key={filme.id} className="movie-card" aria-labelledby={`filme-titulo-${filme.id}`}>
            <img src={filme.poster_url} alt={`Pôster do filme ${filme.titulo}`} className="movie-poster" />
            <h3 id={`filme-titulo-${filme.id}`} className="movie-card-title">{filme.titulo}</h3>
            {/* O link leva para a TelaDetalhes, conforme seu App.jsx */}
            <Link to={`/filmes/${filme.id}`} className="cta-button-small">
              Acessar
            </Link>
          </article>
        ))}
      </div>
    );
  };

  // --- Renderização do JSX ---
  return (
    <div className="tela-inicial-container">
      {/* Bloco: Header
        Cabeçalho principal do site com navegação e busca.
      */}
      <header className="home-header" role="banner">
        <div className="logo">
          <Link to="/">LOGO</Link>
        </div>
        <nav className="main-nav" role="navigation" aria-label="Navegação principal">
          <Link to="/">Home</Link>
          <Link to="/filmes">Filmes</Link>
        </nav>
        <form className="search-bar" role="search">
          <input
            type="search"
            placeholder="Buscar filmes..."
            aria-label="Campo de busca de filmes"
          />
          <button type="submit" aria-label="Buscar">
            Buscar {/* Substitua por ícone 🔍 */}
          </button>
        </form>
        <div className="user-profile">
          <Link to="/login" aria-label="Acessar perfil ou fazer login">
            👤 {/* Substitua por ícone FaUser */}
          </Link>
        </div>
      </header>

      {/* Bloco: Main Content
        Contém todo o conteúdo principal da página.
      */}
      <main role="main">
        {/* Seção: Hero
          Principal chamada para ação da página.
        */}
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-content">
            <h1 id="hero-title">ACESSE NOSSA LISTA COMPLETA DE FILMES</h1>
            <Link to="/filmes" className="cta-button hero-button">
              Filmes
            </Link>
          </div>
          <div className="hero-illustration">
            {/*  */}
            {/* Imagem de ilustração (placeholder) */}
            <div className="placeholder-image" aria-hidden="true"></div>
          </div>
        </section>

        {/* Seção: Filmes Mais Populares
          Exibe 4 filmes buscados da API.
        */}
        <section className="popular-movies" aria-labelledby="popular-title">
          <h2 id="popular-title">FILMES MAIS POPULARES</h2>
          {renderMovieGrid()}
        </section>

        {/* Seção: CTA de Sugestões
          Chamada para o usuário enviar sugestões de filmes.
        */}
        <section className="suggestion-cta" aria-labelledby="suggestion-title">
          <div className="suggestion-content">
            <h2 id="suggestion-title">AGORA VOCÊ PODE ENVIAR SUGESTÕES DE FILMES!!!</h2>
            <p>Acesse o formulário abaixo e envie o filme que gostaria de ver na plataforma!</p>
            {/* Link para a rota /admin/adicionar-filme, conforme seu App.jsx */}
            <Link to="/admin/adicionar-filme" className="cta-button-dark">
              Acesse o formulário
            </Link>
          </div>
          <div className="suggestion-illustration">
            {/*  */}
            {/* Imagem de ilustração (placeholder) */}
            <div className="placeholder-image" aria-hidden="true"></div>
          </div>
        </section>
      </main>

      {/* Bloco: Footer
        Rodapé do site com links sociais e "Sobre Nós".
      */}
      <footer className="home-footer" role="contentinfo">
        <div className="logo">
          <Link to="/">LOGO</Link>
        </div>
        <div className="footer-links">
          <a href="/sobre-nos">Sobre Nós</a>
          {/* Adicione mais links se necessário */}
        </div>
        <div className="social-icons" aria-label="Links de redes sociais">
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            {/* <FaFacebookF /> */} F
          </a>
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            {/* <FaInstagram /> */} I
          </a>
        </div>
      </footer>
    </div>
  );
}

export default TelaInicial;