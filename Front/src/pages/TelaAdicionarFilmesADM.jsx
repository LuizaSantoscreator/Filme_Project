import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaAdicionarFilmesADM.css";

export default function TelaAdicionarFilmesADM() {
  const [formData, setFormData] = useState({
    titulo: "",
    diretor: "",
    atores: "",
    ano: "",
    genero: "",
    sinopse: "",
  });
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPoster(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      for (let key in formData) form.append(key, formData[key]);
      if (poster) form.append("poster", poster);

      const response = await fetch("http://localhost:8000/filmes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao adicionar filme.");

      setMensagem("✅ Filme adicionado com sucesso!");
      setFormData({
        titulo: "",
        diretor: "",
        atores: "",
        ano: "",
        genero: "",
        sinopse: "",
      });
      setPoster(null);
      setPreview(null);
    } catch {
      setMensagem("❌ Não foi possível adicionar o filme.");
    }
  };

  return (
    <div className="tela-adicionar-filme-adm">
      <Header />

      <main className="main-adicionar">
        <section className="secao-superior">
          <h1>Adicionar Filme</h1>
        </section>

        <section className="secao-formulario">
          <form onSubmit={handleSubmit} className="formulario-filme">
            {/* Coluna esquerda */}
            <div className="coluna-esquerda">
              <label>
                Título do filme *
                <input
                  type="text"
                  name="titulo"
                  placeholder="Título do filme..."
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Nome do diretor *
                <input
                  type="text"
                  name="diretor"
                  placeholder="Nome do diretor..."
                  value={formData.diretor}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Atores principais *
                <input
                  type="text"
                  name="atores"
                  placeholder="Atores principais..."
                  value={formData.atores}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Data de lançamento *
                <input
                  type="text"
                  name="ano"
                  placeholder="Exemplo: 2024"
                  value={formData.ano}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Gênero *
                <input
                  type="text"
                  name="genero"
                  placeholder="Exemplo: Drama, Aventura..."
                  value={formData.genero}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Sinopse *
                <textarea
                  name="sinopse"
                  placeholder="Digite a sinopse..."
                  value={formData.sinopse}
                  onChange={handleChange}
                  required
                ></textarea>
              </label>
            </div>

            {/* Coluna direita */}
            <aside className="coluna-direita">
              <div className="upload-container">
                {preview ? (
                  <img
                    src={preview}
                    alt="Pré-visualização do pôster"
                    className="poster-preview"
                  />
                ) : (
                  <>
                    <span className="icone-upload">⬆️</span>
                    <p>Faça upload do pôster do filme (formato vertical)</p>
                  </>
                )}
                <label className="btn-upload">
                  Anexar Arquivo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
              </div>

              <button type="submit" className="btn-enviar">
                Adicionar Filme
              </button>

              {mensagem && <p className="mensagem-status">{mensagem}</p>}
            </aside>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
