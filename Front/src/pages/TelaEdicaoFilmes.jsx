import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaAdicionarFilmes.css";
import "../style/style_pages/TelaEdicaoFilmes.css";
import imagemDiretor from "../assets/imagem_diretor.png";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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


  return (
    <div className="tela-adicionar-filmes">
      <Header />

      <main className="formulario-container">
        <section className="formulario-conteudo">
          <h2>Editar Filmes</h2>


          <form className="form-filme" id="form-filme-id" onSubmit={handleSave}>


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


          {error && <p className="form-mensagem form-erro">{error}</p>}
          {mensagem && <p className="form-mensagem form-sucesso">{mensagem}</p>}

        </section>


        <aside className="imagem-diretor-section">
          <img src={imagemDiretor} alt="Ilustração de diretor" />

          <div className="botoesAcoes" style={{ display: 'flex', gap: '15px' }}>

            <button type="submit" className="btn-enviar" form="form-filme-id">
              Salvar Edição
            </button>


            <button type="button" className="btnExcluir" onClick={handleDelete}>
              Excluir Filme
            </button>
          </div>

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