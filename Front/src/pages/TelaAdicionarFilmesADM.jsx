import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaAdicionarFilmesADM.css";
import { useNavigate } from "react-router-dom";

export default function TelaAdicionarFilmesADM() {
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
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setError("");

    try {
      const token = localStorage.getItem("authToken"); 
      if (!token) {
        setError("Acesso negado. Faça login.");
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

      const response = await fetch("http://localhost:8000/admin/filmes", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(dadosParaEnviar), 
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao adicionar filme.");

      setMensagem(" Filme adicionado e publicado com sucesso!");
      

      setFormData({
        titulo: "", diretor: "", atores: "", ano: "", genero: "", sinopse: "", poster_url: "",
      });
      
      setTimeout(() => navigate("/admin"), 2000);

    } catch (err) {
      setError(` Não foi possível adicionar o filme: ${err.message}`);
      setMensagem(""); 
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
                URL do Pôster *
                <input
                  type="text"
                  name="poster_url"
                  placeholder="https://link.com/imagem.jpg..."
                  value={formData.poster_url}
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


            <aside className="coluna-direita">

              <button type="submit" className="btn-enviar">
                Adicionar Filme
              </button>

              {mensagem && <p className="mensagem-status sucesso">{mensagem}</p>}
              {error && <p className="mensagem-status erro">{error}</p>}
            </aside>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}