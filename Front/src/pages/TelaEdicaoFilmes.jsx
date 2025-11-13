// src/pages/TelaEdicaoFilmes.jsx (LAYOUT CORRIGIDO)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
// 1. IMPORTAR O CSS DA TELA DE ADICIONAR FILMES para o layout
import "../style/style_pages/TelaAdicionarFilmes.css"; 
// 2. IMPORTAR O CSS ORIGINAL DA EDIÇÃO para os botões e cores
import "../style/style_pages/TelaEdicaoFilmes.css";
import imagemDiretor from "../assets/imagem_diretor.png"; // Imagem lateral

export default function TelaEdicaoFilmes() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    titulo: "",
    diretor: "",
    atores: "",
    ano: "",
    genero: "",
    sinopse: "",
    poster_url: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");

  // --- LÓGICA DE CARREGAMENTO (Continua a mesma e correta) ---
  useEffect(() => {
    const fetchFilme = async () => {
      try {
        const response = await fetch(`http://localhost:8000/filmes/${id}`);
        if (!response.ok) throw new Error("Filme não encontrado.");
        
        const data = await response.json();
        
        setFormData({
          titulo: data.titulo || "",
          ano: data.ano || "",
          sinopse: data.sinopse || "",
          poster_url: data.poster_url || "",
          diretor: data.diretores ? data.diretores.join(", ") : "",
          atores: data.atores ? data.atores.join(", ") : "",
          genero: data.generos ? data.generos.join(", ") : "",
        });

      } catch (err) {
        setError(`Erro ao carregar dados: ${err.message}`);
      }
    };
    fetchFilme();
  }, [id]); 
  // --- FIM DA LÓGICA DE CARREGAMENTO ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LÓGICA DE SALVAR (PUT /admin/filmes/<id> - Continua a mesma e correta) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setMensagem("");
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Acesso negado. Faça login.");

      const dadosParaEnviar = {
        titulo: formData.titulo,
        ano: formData.ano,
        sinopse: formData.sinopse,
        poster_url: formData.poster_url,
        generos_texto: formData.genero,
        diretores_texto: formData.diretor,
        atores_texto: formData.atores,
      };

      const response = await fetch(`http://localhost:8000/admin/filmes/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao salvar.");

      setMensagem(data.mensagem); 
      setTimeout(() => navigate("/admin/visualizar-filmes"), 2000);

    } catch (err) {
      setError(`Não foi possível salvar: ${err.message}`);
    }
  };
  // --- FIM DA LÓGICA DE SALVAR ---

  // --- LÓGICA DE EXCLUIR (DELETE /filmes/<id> - Continua a mesma e correta) ---
  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este filme?")) return;
    setError("");
    setMensagem("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Acesso negado. Faça login.");

      const response = await fetch(`http://localhost:8000/filmes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao excluir.");

      alert(data.mensagem);
      navigate("/admin/visualizar-filmes");

    } catch (err) {
      setError(`Não foi possível excluir: ${err.message}`);
    }
  };
  // --- FIM DA LÓGICA DE EXCLUIR ---


  return (
    <div className="tela-adicionar-filmes"> {/* Usamos a classe do Adicionar Filmes */}
      <Header />

      <main className="formulario-container"> {/* Usamos o container do Adicionar Filmes */}
        <section className="formulario-conteudo">
          <h2>Editar Filmes</h2>

          {/* O 'id' foi adicionado para conectar ao botão de Enviar */}
          <form className="form-filme" id="form-filme-id" onSubmit={handleSave}> 
            
            {/* Campo Título */}
            <div className="campo">
              <label htmlFor="titulo">Título do filme</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Título do filme..."
                required
                value={formData.titulo}
                onChange={handleChange}
              />
            </div>

            {/* Campo Poster URL */}
            <div className="campo">
              <label htmlFor="poster_url">URL do Pôster</label>
              <input
                type="text"
                id="poster_url"
                name="poster_url"
                placeholder="https://link.com/imagem.jpg..."
                required
                value={formData.poster_url}
                onChange={handleChange}
              />
            </div>

            {/* Campo Diretor */}
            <div className="campo">
              <label htmlFor="diretor">Nome do diretor</label>
              <input
                type="text"
                id="diretor"
                name="diretor"
                placeholder="Nome do diretor..."
                required
                value={formData.diretor}
                onChange={handleChange}
              />
            </div>

            {/* Campo Atores */}
            <div className="campo">
              <label htmlFor="atores">Atores principais</label>
              <input
                type="text"
                id="atores"
                name="atores"
                placeholder="Atores principais..."
                required
                value={formData.atores}
                onChange={handleChange}
              />
            </div>

            {/* Campo Ano */}
            <div className="campo">
              <label htmlFor="ano">Data de lançamento</label>
              <input
                type="text" 
                id="ano"
                name="ano"
                placeholder="Data de lançamento..."
                required
                value={formData.ano}
                onChange={handleChange}
              />
            </div>

            {/* Campo Gênero */}
            <div className="campo">
              <label htmlFor="genero">Gênero</label>
              <input
                type="text"
                id="genero"
                name="genero"
                placeholder="Gênero..."
                required
                value={formData.genero}
                onChange={handleChange}
              />
            </div>

            {/* Campo Sinopse */}
            <div className="campo campo-textarea">
              <label htmlFor="sinopse">Sinopse</label>
              <textarea
                id="sinopse"
                name="sinopse"
                placeholder="Sinopse..."
                required
                value={formData.sinopse}
                onChange={handleChange}
              ></textarea>
            </div>
          </form>

          {/* Exibição de mensagens de erro ou sucesso */}
          {error && <p className="form-mensagem form-erro">{error}</p>}
          {mensagem && <p className="form-mensagem form-sucesso">{mensagem}</p>}

        </section>

        {/* --- Estrutura lateral (Imagem e Botões) --- */}
        <aside className="imagem-diretor-section"> 
          <img src={imagemDiretor} alt="Ilustração de diretor" />
          
          <div className="botoesAcoes" style={{ display: 'flex', gap: '15px' }}> {/* Estilo inline temporário */}
            {/* Botão Salvar (tipo submit, conectado ao form) */}
            <button type="submit" className="btn-enviar" form="form-filme-id">
              Salvar Edição
            </button>
            
            {/* Botão Excluir */}
            <button type="button" className="btnExcluir" onClick={handleDelete}>
              Excluir Filme
            </button>
          </div>

        </aside>
      </main>

      {/* A curva do Adicionar Filmes */}
      <div className="curva-divisoria">
        <svg
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,256L80,245.3C160,235,320,213,480,176C640,139,800,85,960,69.3C1120,53,1280,75,1360,85.3L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      <Footer />
    </div>
  );
}