import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/style_pages/TelaLogin.css'; // Ajuste o caminho para seu CSS

/**
 * Componente funcional para a tela de Login.
 * Lida com a entrada de dados, submissão para a API backend
 * e redirecionamento do usuário.
 */
function TelaLogin() {
  // --- Estados do Componente ---

  // Guarda o email (campo "Usuário")
  const [email, setEmail] = useState('');
  // Guarda a senha
  const [senha, setSenha] = useState('');
  // Guarda mensagens de erro vindas do backend
  const [errorMsg, setErrorMsg] = useState('');

  // Hook para navegar para outras telas
  const navigate = useNavigate();

  /**
   * Lida com a submissão do formulário de login.
   * Envia os dados para o backend e processa a resposta.
   * @param {React.FormEvent} event - O evento de submissão do formulário.
   */
  const handleLoginSubmit = async (event) => {
    // 1. Impede que a página recarregue (comportamento padrão do form)
    event.preventDefault();
    // 2. Limpa erros antigos
    setErrorMsg('');

    // 3. Validação simples no frontend
    if (!email || !senha) {
      setErrorMsg('Por favor, preencha o email e a senha.');
      return;
    }

    // 4. Tenta fazer a requisição para o backend
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 5. Envia o JSON exatamente como o 'auth_handler.py' espera
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      // 6. Lê a resposta do backend como JSON
      const data = await response.json();

      // 7. Verifica se a resposta NÃO foi bem-sucedida (ex: 401, 404, 500)
      if (!response.ok) {
        // 'data.erro' é a mensagem que seu 'send_error_response' envia
        throw new Error(data.erro || 'Falha ao tentar fazer login.');
      }

      // --- SUCESSO NO LOGIN ---

      // 8. Salva o token no localStorage para usar em futuras requisições
      localStorage.setItem('authToken', data.token);
      // Salva os dados do usuário (nome, email, role)
      localStorage.setItem('userData', JSON.stringify(data.usuario));

      console.log('Login bem-sucedido!', data);

      // 9. Redireciona o usuário com base no 'role'
      if (data.usuario.role === 'adm') {
        navigate('/admin'); // Redireciona ADM para a dashboard de admin
      } else {
        navigate('/filmes'); // Redireciona usuário comum para a lista de filmes
      }

    } catch (err) {
      // --- FALHA NO LOGIN ---

      // 10. Mostra a mensagem de erro (vinda do backend ou de rede)
      setErrorMsg(err.message);
      console.error('Erro ao fazer login:', err);
    }
  };

  // --- Renderização do JSX ---
  return (
    <div className="login-container">
      <div className="login-card" role="main">
        {/* Lado esquerdo do card com a área para imagem */}
        <div className="login-image-section" aria-label="Espaço para imagem de fundo ou logotipo">
          {/* Lembre-se de adicionar sua <img> ou background-image aqui */}
        </div>

        {/* Lado direito do card com o formulário de login */}
        <div className="login-form-section">
          <h1 className="login-title">Login</h1>

          {/* O 'onSubmit' no <form> é a forma correta de lidar com a submissão */}
          <form className="login-form" aria-labelledby="login-title" onSubmit={handleLoginSubmit}>
            
            {/* Campo de Usuário (Email) */}
            <div className="form-group">
              <label htmlFor="email" className="sr-only">Email (Usuário)</label>
              <input
                type="email" // Mudei para 'email' para melhor semântica e validação
                id="email"   // Importante ser 'email'
                className="form-input"
                placeholder="Usuário (Email)" // Deixei claro que é o email
                aria-required="true"
                aria-label="Campo de email do usuário"
                value={email} // Conecta o input ao estado 'email'
                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
              />
            </div>

            {/* Campo de Senha */}
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
                  value={senha} // Conecta o input ao estado 'senha'
                  onChange={(e) => setSenha(e.target.value)} // Atualiza o estado
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

            {/* --- Seção de Erro --- */}
            {/* Mostra a mensagem de erro se 'errorMsg' não estiver vazio */}
            {errorMsg && (
              <div className="login-error-message" role="alert">
                {errorMsg}
              </div>
            )}

            {/* Botão Conectar (tipo submit) */}
            <button type="submit" className="connect-button">
              Conectar
            </button>
          </form>

          {/* Links adicionais */}
          <div className="login-links">
            <p>
              Não tem login? <a href="/cadastro">Clique aqui</a>
            </p>
            <p>
              Administrador? <a href="/admin/login">Clique aqui!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelaLogin;