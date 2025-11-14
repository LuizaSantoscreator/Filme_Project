import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaEspecificacoesSolicitacao.css";

export default function TelaEspecificacoesSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSolicitacao = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Acesso negado. Faça login como administrador.");
          return;
        }

        const response = await fetch(`http://localhost:8000/admin/solicitacoes/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.erro || "Falha ao buscar a solicitação.");
        }
        
        const data = await response.json();
        setSolicitacao(data);

      } catch (err) {
        console.error("Erro ao carregar a solicitação:", err);
        setError(`❌ Erro ao carregar os dados: ${err.message}`);
      }
    };

    fetchSolicitacao();
  }, [id]);


  const handleAceitar = async () => {
    setError("");
    setMensagem("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Acesso negado. Faça login.");

      const response = await fetch(`http://localhost:8000/admin/aprovar/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
      
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao aceitar o filme.");

      setMensagem("✅ Filme aprovado e publicado com sucesso!");
      setTimeout(() => navigate("/admin/notificacoes"), 2000);

    } catch (err) {
      console.error(err);
      setError(`❌ Não foi possível aprovar o filme: ${err.message}`);
    }
  };

 
  const handleRejeitar = async () => {
    setError("");
    setMensagem("");
    
    if (!window.confirm("Tem certeza que deseja REJEITAR esta solicitação?")) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Acesso negado. Faça login.");

      
      const response = await fetch(`http://localhost:8000/admin/rejeitar/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao rejeitar a solicitação.");

      setMensagem("🗑️ Solicitação rejeitada com sucesso!");
      setTimeout(() => navigate("/admin/notificacoes"), 2000);

    } catch (err) {
      console.error(err);
      setError(`❌ Erro ao rejeitar a solicitação: ${err.message}`);
    }
  };


  if (error) {
    return (
      <div className="telaEspecificacoesSolicitacao">
        <Header />
        <main className="mainEspecificacoesSolicitacao">
          <p className="carregando erro" role="alert">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

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
          <aside
            className="uploadContainer"
            aria-label="Pôster sugerido pelo usuário"
          >
            {solicitacao.poster_url ? (
              <img
                src={solicitacao.poster_url}
                alt={`Prévia do pôster de ${solicitacao.titulo}`}
                className="posterPreview"
              />
            ) : (
              <p>Usuário não forneceu um pôster.</p>
            )}
          </aside>


          <article className="detalhesSolicitacao">
            <h1 id="titulo-detalhes-solicitacao">{solicitacao.titulo}</h1>
            <p>
              <strong>Solicitado por:</strong> {solicitacao.solicitado_por_nome || `Usuário ID: ${solicitacao.solicitado_por_id}`}
            </p>
            <p className="sinopse">{solicitacao.sinopse}</p>

            <p>
              <strong>Atores:</strong> {solicitacao.atores_texto || "Não informado"}
            </p>
            <p>
              <strong>Diretor:</strong> {solicitacao.diretores_texto || "Não informado"}
            </p>
            <p>
              <strong>Data de lançamento:</strong>{" "}
              {solicitacao.ano || "Não informado"}
            </p>

            <div className="generos" aria-label="Gêneros do filme">
              {solicitacao.generos_texto?.split(",").map((g, i) => (
                <span key={i} className="tagGenero">
                  {g.trim()}
                </span>
              ))}
            </div>

    
            <div className="botoesAcoes">
              <button
                className="btnDeletar"
                onClick={handleRejeitar}
                aria-label="Rejeitar solicitação"
              >
                Rejeitar
              </button>

              <button
                className="btnAceitar"
                onClick={handleAceitar} 
                aria-label="Aceitar e adicionar filme"
              >
                Aceitar Filme
              </button>
            </div>

    
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