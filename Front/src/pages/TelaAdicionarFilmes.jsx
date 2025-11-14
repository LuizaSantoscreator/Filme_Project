import React, { useState } from "react";
import "../style/style_pages/TelaAdicionarFilmes.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import imagemDiretor from "../assets/imagem_diretor.png";

export default function TelaAdicionarFilmes() {


  const [formData, setFormData] = useState({
    titulo: "",
    diretor: "",
    atores: "",
    ano: "",
    genero: "",
    sinopse: "",
    poster_url: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMsg("Erro: Você precisa estar logado para enviar um filme.");
      return;
    }

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
      const response = await fetch("http://localhost:8000/filmes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Falha ao enviar formulário.");
      }

      setSuccessMsg(data.mensagem || "Formulário enviado com sucesso!");
      setFormData({
        titulo: "", diretor: "", atores: "", ano: "", genero: "", sinopse: "", poster_url: "",
      });

    } catch (err) {
      setErrorMsg(err.message);
      console.error("Erro ao enviar formulário:", err);
    }
  };

  return (
    <div className="tela-adicionar-filmes">
      <Header />

      <main className="formulario-container">
        <section className="formulario-conteudo">
          <h2>Formulário</h2>

          <form className="form-filme" id="form-filme-id" onSubmit={handleSubmit}>

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


          {errorMsg && <p className="form-mensagem form-erro">{errorMsg}</p>}
          {successMsg && <p className="form-mensagem form-sucesso">{successMsg}</p>}

        </section>

        <aside className="imagem-diretor-section">
          <img src={imagemDiretor} alt="Ilustração de diretor" />

          <button type="submit" className="btn-enviar" form="form-filme-id">
            Enviar Formulário
          </button>
        </aside>
      </main>


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