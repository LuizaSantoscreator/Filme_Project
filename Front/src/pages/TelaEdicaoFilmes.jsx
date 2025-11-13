import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaEdicaoFilmes.css";

export default function TelaEdicaoFilmes() {
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

  // 🔹 Aqui futuramente você pode buscar o filme pelo ID para preencher os campos
  useEffect(() => {
    // Exemplo de simulação de carregamento de dados
    const filmeExemplo = {
      titulo: "Alice no país das maravilhas",
      diretor: "Tim Burton",
      atores: "Mia Wasikowska, Johnny Depp, Helena Bonham Carter",
      ano: "2010",
      genero: "Fantasia, Aventura",
      sinopse:
        "Alice retorna ao país das maravilhas e se depara com novos desafios ao tentar derrotar a Rainha Vermelha.",
    };
    setFormData(filmeExemplo);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPoster(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      for (let key in formData) form.append(key, formData[key]);
      if (poster) form.append("poster", poster);

      const response = await fetch("http://localhost:8000/filmes/editar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao editar filme.");

      setMensagem("Filme atualizado com sucesso!");
    } catch {
      setMensagem("Não foi possível salvar as alterações.");
    }
  };

  const handleDelete = async () => {
    const confirmacao = window.confirm(
      "Tem certeza de que deseja excluir este filme?"
    );
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/filmes/excluir", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao excluir filme.");

      setMensagem("Filme excluído com sucesso!");
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
      setMensagem("Não foi possível excluir o filme.");
    }
  };

  return (
    <div className="telaEdicaoFilmeAdm">
      <Header />

      <main className="mainEdicao">
        <section className="secaoSuperior">
          <h1>Editar Filmes</h1>
        </section>

        <section className="secaoFormulario">
          <form onSubmit={handleSave} className="formularioFilme">
            {/* Coluna esquerda */}
            <div className="colunaEsquerda">
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
            <aside className="colunaDireita">
              <div className="uploadContainer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Pré-visualização do pôster"
                    className="posterPreview"
                  />
                ) : (
                  <>
                    <span className="iconeUpload">⬆️</span>
                    <p>Faça upload do pôster do filme (formato vertical)</p>
                  </>
                )}
                <label className="btnUpload">
                  Anexar Arquivo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
              </div>

              <div className="botoesAcoes">
                <button type="submit" className="btnSalvar">
                  Salvar
                </button>
                <button
                  type="button"
                  className="btnExcluir"
                  onClick={handleDelete}
                >
                  Excluir Filme
                </button>
              </div>

              {mensagem && <p className="mensagemStatus">{mensagem}</p>}
            </aside>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
