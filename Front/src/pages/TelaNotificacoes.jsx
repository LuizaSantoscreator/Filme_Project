import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaNotificacao.css";
import { useNavigate } from "react-router-dom";

export default function TelaNotificacao() {
  // Lista de notificações que vem do backend
  const [notificacoes, setNotificacoes] = useState([]);
  const [error, setError] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  // Busco as notificações assim que a tela carrega
  useEffect(() => {
    const fetchNotificacoes = async () => {
      const token = localStorage.getItem("authToken");

      // Verifico se é admin
      if (!token) {
        setError("Acesso negado. Faça login como administrador.");
        return;
      }

      try {
        // Busco as solicitações pendentes
        const response = await fetch(
          "http://localhost:8000/admin/solicitacoes",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.erro || "Falha ao buscar notificações.");
        }

        const data = await response.json();
        setNotificacoes(data); 
      
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchNotificacoes();
  }, []); 

  // Função para rejeitar (excluir) uma solicitação direto da lista
  const handleExcluir = async (id) => {
    setError("");
    setMensagem("");

    if (!window.confirm("Tem certeza que deseja REJEITAR esta solicitação?")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Acesso negado. Faça login como administrador.");
      return;
    }

    try {
      // Chamo a rota de rejeição
      const response = await fetch(`http://localhost:8000/admin/rejeitar/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.erro || "Falha ao rejeitar a solicitação.");
      }

      setMensagem(data.mensagem);
      // Removo a notificação da lista visualmente para não precisar recarregar a página
      setNotificacoes(notificacoes.filter((n) => n.id !== id));

    } catch (err) {
      console.error(err);
      setError(err.message); 
    }
  };

  // Vai para a tela de detalhes para ver mais sobre o pedido
  const handleVerEspecificacoes = (id) => {
    console.log("Ver detalhes da solicitação", id);
    navigate(`/admin/solicitacao/${id}`);
  };

  return (
    <div className="telaNotificacao">
      <Header />

      <main className="mainNotificacao">
        <h1>Notificações</h1>

        {error && <p className="semNotificacoes erro-msg">{error}</p>}
        {mensagem && <p className="semNotificacoes sucesso-msg">{mensagem}</p>}

        <div className="listaNotificacoes">
          {/* Se não tiver erro nem notificações, mostro mensagem vazia */}
          {!error && notificacoes.length === 0 && !mensagem ? (
            <p className="semNotificacoes">Nenhuma notificação no momento.</p>
          ) : (
            // Mapeio cada notificação para um card na tela
            notificacoes.map((notificacao) => (
              <div key={notificacao.id} className="cardNotificacao">
                <p>
                  <strong>{notificacao.solicitado_por_nome || `Usuário ID ${notificacao.solicitado_por_id}`}</strong> solicitou a adição do filme “
                  {notificacao.titulo}”
                </p>

                <div className="acoesNotificacao">
                  <button
                    className="btnVer"
                    onClick={() => handleVerEspecificacoes(notificacao.id)}
                  >
                    Ver <br /> Especificações
                  </button>
                  <button
                    className="btnExcluir"
                    onClick={() => handleExcluir(notificacao.id)}
                    aria-label="Rejeitar solicitação"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}