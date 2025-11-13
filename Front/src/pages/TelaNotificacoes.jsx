// src/pages/TelaNotificacoes.jsx (CORRIGIDO)

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaNotificacao.css";
// Importe o 'useNavigate' para redirecionar o usuário
import { useNavigate } from "react-router-dom";

export default function TelaNotificacao() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [error, setError] = useState("");
  // Adiciona um estado de mensagem para feedback
  const [mensagem, setMensagem] = useState("");
  
  // Inicializa o hook de navegação
  const navigate = useNavigate();

  // --- CONEXÃO COM O BACKEND (Já estava correta) ---
  useEffect(() => {
    // Função para buscar as notificações (solicitações pendentes)
    const fetchNotificacoes = async () => {
      // 1. Pegar o token de autenticação do Admin
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Acesso negado. Faça login como administrador.");
        return;
      }

      try {
        // 2. Fazer a requisição para a rota protegida
        const response = await fetch(
          "http://localhost:8000/admin/solicitacoes",
          {
            method: "GET",
            headers: {
              // 3. Enviar o token para autorização
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.erro || "Falha ao buscar notificações.");
        }

        const data = await response.json();
        setNotificacoes(data); // 4. Salva os dados reais no estado
      
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchNotificacoes();
  }, []); // O array vazio [] faz com que rode apenas uma vez

  // --- Funções de Ação ---

  // --- 1. CORREÇÃO: Conecta o botão "Excluir" (Rejeitar) ---
  const handleExcluir = async (id) => {
    // Limpa mensagens antigas
    setError("");
    setMensagem("");

    // Adiciona uma confirmação
    if (!window.confirm("Tem certeza que deseja REJEITAR esta solicitação?")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Acesso negado. Faça login como administrador.");
      return;
    }

    try {
      // Chama a nova rota PUT de rejeição que criamos
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

      // Sucesso: Mostra a mensagem e remove da tela
      setMensagem(data.mensagem); // "Solicitação de adição rejeitada com sucesso."
      setNotificacoes(notificacoes.filter((n) => n.id !== id));

    } catch (err) {
      console.error(err);
      setError(err.message); // Mostra o erro na tela
    }
  };
  // --- FIM DA CORREÇÃO ---


  // Visualizar especificações (Já estava correto)
  const handleVerEspecificacoes = (id) => {
    console.log("Ver detalhes da solicitação", id);
    // Redireciona para a tela de detalhes da solicitação
    navigate(`/admin/solicitacao/${id}`);
  };

  return (
    <div className="telaNotificacao">
      <Header />

      <main className="mainNotificacao">
        <h1>Notificações</h1>

        {/* Mostra mensagens de erro ou sucesso */}
        {error && <p className="semNotificacoes erro-msg">{error}</p>}
        {mensagem && <p className="semNotificacoes sucesso-msg">{mensagem}</p>}

        <div className="listaNotificacoes">
          {!error && notificacoes.length === 0 && !mensagem ? (
            <p className="semNotificacoes">Nenhuma notificação no momento.</p>
          ) : (
            // Usa os dados reais vindos do backend
            notificacoes.map((notificacao) => (
              <div key={notificacao.id} className="cardNotificacao">
                <p>
                  {/* Agora usamos o nome do usuário que veio do backend */}
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
                    onClick={() => handleExcluir(notificacao.id)} // <-- Agora funciona
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