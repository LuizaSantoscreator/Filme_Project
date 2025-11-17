import React, { useState } from "react";
import "../style/style_pages/TelaAdicionarFilmes.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import imagemDiretor from "../assets/imagem_diretor.png";

export default function TelaAdicionarFilmes() {

  // Aqui guardo todos os dados que o usuário digitou no formulário
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

  // Essa função atualiza o estado 'formData' sempre que o usuário digita algo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Essa função envia os dados para o backend quando clico em "Enviar"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    setErrorMsg("");
    setSuccessMsg("");

    // Verifico se o usuário está logado
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMsg("Erro: Você precisa estar logado para enviar um filme.");
      return;
    }

    // Preparo os dados para enviar
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
      // Faço a requisição POST para criar a solicitação
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
      // Limpo o formulário depois de enviar
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
            {/* ... (Inputs do formulário) ... */}
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
            {/* ... (Outros campos omitidos para brevidade, seguem o mesmo padrão) ... */}
            
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
      
      {/* ... (Divisor svg e Footer) ... */}
      <Footer />
    </div>
  );
}