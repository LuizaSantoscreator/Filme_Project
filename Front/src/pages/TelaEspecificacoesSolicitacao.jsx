import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaEspecificacoesSolicitacao.css";

export default function TelaEspecificacoesSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensagem, setMensagem] = useState("");

  // === Carrega a solicitação específica ===
  useEffect(() => {
    const fetchSolicitacao = async () => {
      try {
        const response = await fetch(`http://localhost:8000/solicitacoes/${id}`);
        if (!response.ok) throw new Error("Falha ao buscar a solicitação.");
        const data = await response.json();
        setSolicitacao(data);
      } catch (error) {
        console.error("Erro ao carregar a solicitação:", error);
        setMensagem("❌ Erro ao carregar os dados da solicitação.");
      }
    };

    fetchSolicitacao();
  }, [id]);

  // === Manipula o upload de pôster ===
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // === Aceita a solicitação e cadastra o filme ===
  const handleAceitar = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Adiciona os campos da solicitação
      Object.entries(solicitacao).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (poster) formData.append("poster", poster);

      const response = await fetch("http://localhost:8000/filmes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao aceitar o filme.");

      setMensagem("✅ Filme adicionado com sucesso!");
      setTimeout(() => navigate("/admin/notificacoes"), 2000);
    } catch (error) {
      console.error(error);
      setMensagem("❌ Não foi possível aceitar o filme.");
    }
  };

  // === Exclui a solicitação ===
  const handleDeletar = async () => {
    try {
      const response = await fetch(`http://localhost:8000/solicitacoes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir a solicitação.");

      setMensagem("🗑️ Solicitação excluída com sucesso!");
      setTimeout(() => navigate("/admin/notificacoes"), 2000);
    } catch (error) {
      console.error(error);
      setMensagem("❌ Erro ao excluir a solicitação.");
    }
  };

  // === Estado de carregamento ===
  if (!solicitacao) {
    return (
      <div className="telaEspecificacoesSolicitacao">
        <Header />
        <main className="mainEspecificacoesSolicitacao">
          <p className="carregando" role="status">
            Carregando dados da solicitação...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="telaEspecificacoesSolicitacao">
      <Header />

      <main className="mainEspecificacoesSolicitacao" role="main">
        <section
          className="containerSolicitacao"
          aria-labelledby="titulo-detalhes-solicitacao"
        >
          {/* Upload do pôster */}
          <aside
            className="uploadContainer"
            aria-label="Upload de pôster do filme"
          >
            {preview ? (
              <img
                src={preview}
                alt={`Prévia do pôster de ${solicitacao.titulo}`}
                className="posterPreview"
              />
            ) : (
              <>
                <span className="iconeUpload" aria-hidden="true">
                  ⬆️
                </span>
                <p>Faça upload do pôster do filme (formato vertical)</p>
              </>
            )}

            <label className="btnUpload" htmlFor="uploadPoster">
              Anexar Arquivo
            </label>
            <input
              id="uploadPoster"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </aside>

          {/* Detalhes do filme */}
          <article className="detalhesSolicitacao">
            <h1 id="titulo-detalhes-solicitacao">{solicitacao.titulo}</h1>
            <p className="sinopse">{solicitacao.sinopse}</p>

            <p>
              <strong>Atores:</strong> {solicitacao.atores || "Não informado"}
            </p>
            <p>
              <strong>Diretor:</strong> {solicitacao.diretor || "Não informado"}
            </p>
            <p>
              <strong>Data de lançamento:</strong>{" "}
              {solicitacao.ano || "Não informado"}
            </p>

            <div className="generos" aria-label="Gêneros do filme">
              {solicitacao.genero?.split(",").map((g, i) => (
                <span key={i} className="tagGenero">
                  {g.trim()}
                </span>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="botoesAcoes">
              <button
                className="btnDeletar"
                onClick={handleDeletar}
                aria-label="Excluir solicitação"
              >
                Deletar
              </button>

              <button
                className="btnAceitar"
                onClick={handleAceitar}
                aria-label="Aceitar e adicionar filme"
              >
                Aceitar Filme
              </button>
            </div>

            {/* Mensagem de status */}
            {mensagem && (
              <p
                className={`mensagemStatus ${
                  mensagem.includes("❌") ? "erro" : "sucesso"
                }`}
                role="alert"
              >
                {mensagem}
              </p>
            )}
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
