import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

import '../style/style_pages/TelaCadastro.css';

function TelaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!nome || !email || !senha) {
      setErrorMsg('Todos os campos são obrigatórios.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao tentar cadastrar.');
      }
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
        <div className="cadastro-image-section" aria-label="Espaço para imagem de fundo">
        </div>
        <div className="cadastro-form-section">
          <h1 className="cadastro-title">Cadastro</h1>
          <form className="cadastro-form" aria-labelledby="cadastro-title" onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="nome" className="sr-only">Nome</label>
              <input type="text" id="nome" className="form-input" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="sr-only">Email</label>
              <input type="email" id="email" className="form-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="sr-only">Senha</label>
              <input type="password" id="password" className="form-input" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            {errorMsg && (<div className="cadastro-error-message" role="alert">{errorMsg}</div>)}
            {successMsg && (<div className="cadastro-success-message" role="alert">{successMsg}</div>)}
            <button type="submit" className="connect-button">Cadastrar</button>
          </form>

          <div className="cadastro-links">
            <p>
              Já tem login? <Link to="/login">Clique aqui</Link>
            </p>
            <p>
              Administrador? <Link to="/login-adm">Clique aqui</Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default TelaCadastro;