import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/style_pages/TelaLogin.css'; 

function TelaLoginADM() {
  // Estados para guardar o email e a senha que o admin digita
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Uso o navigate para mudar de página depois do login
  const navigate = useNavigate();

  // Função que roda quando clico no botão "Conectar"
  const handleLoginSubmit = async (event) => {
    event.preventDefault(); // Evito que a página recarregue
    setErrorMsg('');

    // Verifico se os campos estão preenchidos
    if (!email || !senha) {
      setErrorMsg('Por favor, preencha o email e a senha.');
      return;
    }

    try {
      // Envio os dados para o backend verificar
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      const data = await response.json();

      // Se o login falhar, mostro o erro
      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao tentar fazer login.');
      }

      // Se der certo, verifico se o usuário é REALMENTE um admin
      if (data.usuario.role === 'adm') {
        // Salvo o token e os dados para usar depois
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.usuario));
        console.log('Login de ADM bem-sucedido!', data);
        // Mando ele para o painel de admin
        navigate('/admin'); 
      } else {
        setErrorMsg('Acesso negado. Esta página é apenas para administradores.');
      }

    } catch (err) {
      setErrorMsg(err.message);
      console.error('Erro ao fazer login:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" role="main">
        <div className="login-image-section" aria-label="Espaço para imagem">
        </div>

        <div className="login-form-section">
          <h1 className="login-title">Login (Admin)</h1>

          <form className="login-form" aria-labelledby="login-title" onSubmit={handleLoginSubmit}>
            
            <div className="form-group">
              <label htmlFor="email" className="sr-only">Email (Usuário)</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Usuário (Email)"
                aria-required="true"
                aria-label="Campo de email do usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="sr-only">Senha</label>
              <div className="password-input-wrapper">
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Senha"
                  aria-required="true"
                  aria-label="Campo de senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password-visibility"
                  aria-label="Mostrar ou esconder senha"
                >
                  <span className="eye-icon" aria-hidden="true">&#128065;</span>
                </button>
              </div>
            </div>

            {/* Se tiver erro, mostro a mensagem aqui */}
            {errorMsg && (
              <div className="login-error-message" role="alert">
                {errorMsg}
              </div>
            )}

            <button type="submit" className="connect-button">
              Conectar
            </button>
          </form>

          <div className="login-links">
            <p>
              Não é administrador? <Link to="/login">Login de usuário</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelaLoginADM;