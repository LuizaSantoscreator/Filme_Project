import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/style_pages/TelaLogin.css'; 

function TelaLogin() {
  // Estados para email, senha e mensagens de erro
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Função de login do usuário comum
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    
    if (!email || !senha) {
      setErrorMsg('Por favor, preencha o email e a senha.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao tentar fazer login.');
      }
      
      // Salvo o token no navegador
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.usuario));
      
      // Redireciono baseado no tipo de usuário
      if (data.usuario.role === 'adm') {
        navigate('/admin'); 
      } else {
        navigate('/home'); 
      }
    } catch (err) {
      setErrorMsg(err.message);
      console.error('Erro ao fazer login:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" role="main">
        <div className="login-image-section" aria-label="Espaço para imagem de fundo ou logotipo">
        </div>
        <div className="login-form-section">
          <h1 className="login-title">Login</h1>
          <form className="login-form" aria-labelledby="login-title" onSubmit={handleLoginSubmit}>
             {/* ... (Campos de input) ... */}
            {errorMsg && (<div className="login-error-message" role="alert">{errorMsg}</div>)}
            <button type="submit" className="connect-button">Conectar</button>
          </form>

          <div className="login-links">
            <p>
              Não tem login? <Link to="/">Clique aqui</Link> 
            </p>
            <p>
              Administrador? <Link to="/login-adm">Clique aqui!</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TelaLogin;