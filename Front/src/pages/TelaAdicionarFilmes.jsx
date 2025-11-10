import React, { useState } from "react"; // Importar useState
import "../style/style_pages/TelaAdicionarFilmes.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import imagemDiretor from "../assets/imagem_diretor.png";

export default function TelaAdicionarFilmes() {
  
  // --- CONEXÃO COM O BACKEND (INÍCIO) ---

  // 1. Estado para controlar TODOS os campos do formulário
  const [formData, setFormData] = useState({
    titulo: "",
    diretor: "", // Vai para 'diretores_texto' no backend
    atores: "",  // Vai para 'atores_texto' no backend
    ano: "",
    genero: "",  // Vai para 'generos_texto' no backend
    sinopse: "",
    poster_url: "", // CAMPO ADICIONADO (obrigatório no backend)
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 2. Função para atualizar o estado quando o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 3. Função para ENVIAR o formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setErrorMsg("");
    setSuccessMsg("");

    // 4. Pegar o token de autenticação do localStorage
    // Seu backend exige autenticação para esta rota
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMsg("Erro: Você precisa estar logado para enviar um filme.");
      return;
    }

    // 5. Preparar os dados para enviar ao backend
    // O backend espera 'generos_texto', 'diretores_texto', etc.
    const dadosParaEnviar = {
      titulo: formData.titulo,
      ano: formData.ano,
      sinopse: formData.sinopse,
      poster_url: formData.poster_url,
      generos_texto: formData.genero,
      diretores_texto: formData.diretor,
      atores_texto: formData.atores,
    };

    try {
      // 6. Fazer a requisição POST para a rota
      const response = await fetch("http://localhost:8000/filmes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Envia o token no header
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o backend retornar um erro (ex: 400, 401, 500)
        throw new Error(data.erro || "Falha ao enviar formulário.");
      }

      // Se der certo (ex: 201 Created)
      setSuccessMsg(data.mensagem || "Formulário enviado com sucesso!");
      // Opcional: limpar o formulário
      setFormData({
        titulo: "", diretor: "", atores: "", ano: "", genero: "", sinopse: "", poster_url: "",
      });

    } catch (err) {
      setErrorMsg(err.message);
      console.error("Erro ao enviar formulário:", err);
    }
  };

  // --- CONEXÃO COM O BACKEND (FIM) ---

  return (
    <div className="tela-adicionar-filmes">
      <Header />

      <main className="formulario-container">
        <section className="formulario-conteudo">
          <h2>Formulário</h2>

          {/* O 'onSubmit' agora chama nossa função 'handleSubmit' */}
          {/* O 'id' foi adicionado para conectar ao botão */}
          <form className="form-filme" id="form-filme-id" onSubmit={handleSubmit}>
            
            {/* Campo Título */}
            <div className="campo">
              <label htmlFor="titulo">Título do filme</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Título do filme..."
                required
                value={formData.titulo} // Conecta ao estado
                onChange={handleChange} // Conecta à função
              />
            </div>

            {/* --- CAMPO NOVO (OBRIGATÓRIO) --- */}
            {/* O seu backend exige 'poster_url' */}
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
                type="text" // Pode mudar para type="number" se preferir
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
          {errorMsg && <p className="form-mensagem form-erro">{errorMsg}</p>}
          {successMsg && <p className="form-mensagem form-sucesso">{successMsg}</p>}

        </section>

        <aside className="imagem-diretor-section">
          <img src={imagemDiretor} alt="Ilustração de diretor" />
          {/* O botão 'type="submit"' agora tem o atributo 'form'
              para se conectar ao <form> pelo 'id' */}
          <button type="submit" className="btn-enviar" form="form-filme-id">
            Enviar Formulário
          </button>
        </aside>
      </main>

      {/* --- CURVA DE TRANSIÇÃO --- */}
      {/* (Seu código original, mantido) */}
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