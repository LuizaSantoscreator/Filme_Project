import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaNotificacao.css";
// Importe o 'useNavigate' para redirecionar o usuário
import { useNavigate } from "react-router-dom";

export default function TelaNotificacao() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [error, setError] = useState("");
  // Inicializa o hook de navegação
  const navigate = useNavigate();

  // --- CONEXÃO COM O BACKEND ---
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
          throw new Error("Falha ao buscar notificações. Tente novamente.");
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

  // Excluir notificação (Rejeitar)
  const handleExcluir = async (id) => {
    // ATENÇÃO: Seu backend NÃO TEM um endpoint para
    // "rejeitar" uma solicitação de ADIÇÃO (apenas de EDIÇÃO).
    // Esta função irá apenas remover da tela, mas não do banco.
    console.warn(`Ação de Rejeitar (ID: ${id}) não implementada no backend.`);
    alert("Função 'Rejeitar' não conectada ao backend (endpoint 'rejeitar_adicao' faltando).");
    
    // Para o frontend (apenas remove da tela):
    setNotificacoes(notificacoes.filter((n) => n.id !== id));
  };

  // Visualizar especificações
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

        <div className="listaNotificacoes">
          {error && <p className="semNotificacoes">{error}</p>}

          {!error && notificacoes.length === 0 ? (
            <p className="semNotificacoes">Nenhuma notificação no momento.</p>
          ) : (
            // Usa os dados reais vindos do backend
            notificacoes.map((notificacao) => (
              <div key={notificacao.id} className="cardNotificacao">
                <p>
                  {/* Seu backend não retorna o nome, 
                      apenas o ID do usuário. 
                      Para mostrar o nome, o backend precisaria de um JOIN. */}
                  Usuário (ID: {notificacao.solicitado_por_id}) solicitou a adição do filme “
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
                    aria-label="Excluir notificação"
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