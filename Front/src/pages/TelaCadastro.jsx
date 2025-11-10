import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importando o CSS que está na sua pasta /style/style_pages
import '../style/style_pages/TelaCadastro.css';

/**
 * Componente funcional para a tela de Cadastro.
 * Lida com a entrada de dados, submissão para a API backend
 * e redirecionamento do usuário.
 */
function TelaCadastro() {
  // --- Estados do Componente ---
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Hook para navegar para outras telas
  const navigate = useNavigate();

  /**
   * Lida com a submissão do formulário de cadastro.
   * Envia os dados para o backend e processa a resposta.
   */
  const handleRegisterSubmit = async (event) => {
    // 1. Impede o recarregamento da página
    event.preventDefault();
    // 2. Limpa mensagens antigas
    setErrorMsg('');
    setSuccessMsg('');

    // 3. Validação simples no frontend
    if (!nome || !email || !senha) {
      setErrorMsg('Todos os campos são obrigatórios.');
      return;
    }

    // 4. Tenta fazer a requisição para o backend
    try {
      const response = await fetch('http://localhost:8000/register', { // Rota do server.py
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 5. Envia o JSON como o 'auth_handler.py' espera
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
          // O 'role' será 'comum' por padrão no backend
        }),
      });

      // 6. Lê a resposta do backend
      const data = await response.json();

      // 7. Verifica se a resposta NÃO foi bem-sucedida (ex: 409, 500)
      if (!response.ok) {
        // 'data.erro' é a mensagem do seu 'send_error_response'
        // Ex: "Email já cadastrado."
        throw new Error(data.erro || 'Falha ao tentar cadastrar.');
      }

      // --- SUCESSO NO CADASTRO ---

      // 8. Mostra a mensagem de sucesso do backend
      setSuccessMsg(data.mensagem + " Você será redirecionado para o login...");

      // 9. Aguarda 2 segundos e redireciona para a tela de login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // --- FALHA NO CADASTRO ---
      setErrorMsg(err.message);
      console.error('Erro ao cadastrar:', err);
    }
  };

  // --- Renderização do JSX ---
  return (
    // Reutilizei a estrutura da tela de login para manter o estilo
    <div className="cadastro-container">
      <div className="cadastro-card" role="main">
        {/* Lado esquerdo (para imagem) */}
        <div className="cadastro-image-section" aria-label="Espaço para imagem de fundo">
          {/* Adicione sua imagem aqui */}
        </div>

        {/* Lado direito (formulário) */}
        <div className="cadastro-form-section">
          <h1 className="cadastro-title">Cadastro</h1>

          <form className="cadastro-form" aria-labelledby="cadastro-title" onSubmit={handleRegisterSubmit}>

            {/* Campo de Nome */}
            <div className="form-group">
              <label htmlFor="nome" className="sr-only">Nome</label>
              <input
                type="text"
                id="nome"
                className="form-input"
                placeholder="Nome"
                aria-required="true"
                aria-label="Campo de nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* Campo de Email */}
            <div className="form-group">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Email"
                aria-required="true"
                aria-label="Campo de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                {/* Você pode adicionar o ícone de olho aqui se desejar */}
              </div>
            </div>

            {/* --- Seção de Mensagens --- */}
            {errorMsg && (
              <div className="cadastro-error-message" role="alert">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="cadastro-success-message" role="alert">
                {successMsg}
              </div>
            )}

            {/* Botão Cadastrar */}
            <button type="submit" className="connect-button">
              Cadastrar
            </button>
          </form>

          {/* Links adicionais */}
          <div className="cadastro-links">
            <p>
              Já tem login? <a href="/login">Clique aqui</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelaCadastro;