import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/style_pages/TelaCadastro.css';

function TelaCadastro() {
  // Estados para guardar o que o usuário digita
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Função chamada quando o usuário clica em "Cadastrar"
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    // Validação básica
    if (!nome || !email || !senha) {
      setErrorMsg('Todos os campos são obrigatórios.');
      return;
    }
    
    try {
      // Envia os dados para o backend criar o usuário
      const response = await fetch('http://localhost:8000/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao tentar cadastrar.');
      }
      
      // Se der certo, aviso o usuário e mando ele para o login
      setSuccessMsg(data.mensagem + " Você será redirecionado para o login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setErrorMsg(err.message);
      console.error('Erro ao cadastrar:', err);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card" role="main">
        <div className="cadastro-form-section">
          <h1 className="cadastro-title">Cadastro</h1>
          <form className="cadastro-form" onSubmit={handleRegisterSubmit}>
             {/* ... (Inputs do formulário) ... */}
            <button type="submit" className="connect-button">Cadastrar</button>
          </form>
          {/* Links para ir para outras telas */}
          <div className="cadastro-links">
            <p>Já tem login? <Link to="/login">Clique aqui</Link></p>
            <p>Administrador? <Link to="/login-adm">Clique aqui</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelaCadastro;