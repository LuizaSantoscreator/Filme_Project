import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaEspecificacoesSolicitacao.css";

export default function TelaEspecificacoesSolicitacao() {
  // Pego o ID da solicitação na URL
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");

  // Busco os detalhes da solicitação específica
  useEffect(() => {
    const fetchSolicitacao = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Acesso negado. Faça login como administrador.");
          return;
        }

        // Rota específica para buscar uma solicitação
        const response = await fetch(`http://localhost:8000/admin/solicitacoes/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.erro || "Falha ao buscar a solicitação.");
        }
        
        const data = await response.json();
        setSolicitacao(data);

      } catch (err) {
        console.error("Erro ao carregar a solicitação:", err);
        setError(` Erro ao carregar os dados: ${err.message}`);
      }
    };

    fetchSolicitacao();
  }, [id]);


  // Função para aprovar o filme e adicioná-lo ao site
  const handleAceitar = async () => {
    setError("");
    setMensagem("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Acesso negado. Faça login.");

      const response = await fetch(`http://localhost:8000/admin/aprovar/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao aceitar o filme.");

      setMensagem("✅ Filme aprovado e publicado com sucesso!");
      // Volto para a lista de notificações depois de 2 segundos
      setTimeout(() => navigate("/admin/notificacoes"), 2000);

    } catch (err) {
      console.error(err);
      setError(` Não foi possível aprovar o filme: ${err.message}`);
    }
  };

  // Função para rejeitar a solicitação
  const handleRejeitar = async () => {
    setError("");
    setMensagem("");
    
    if (!window.confirm("Tem certeza que deseja REJEITAR esta solicitação?")) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Acesso negado. Faça login.");
      
      const response = await fetch(`http://localhost:8000/admin/rejeitar/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao rejeitar a solicitação.");

      setMensagem(" Solicitação rejeitada com sucesso!");
      setTimeout(() => navigate("/admin/notificacoes"), 2000);

    } catch (err) {
      console.error(err);
      setError(` Erro ao rejeitar a solicitação: ${err.message}`);
    }
  };

  // ... (O resto é renderização) ...
  return (
    <div className="telaEspecificacoesSolicitacao">
      <Header />
      {/* ... (Mostra os detalhes da solicitação) ... */}
      <Footer />
    </div>
  );
}