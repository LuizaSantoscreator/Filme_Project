import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaVisualizacaoFilmes.css"; 
import "../style/style_pages/TelaDetalhesADM.css"; 

export default function TelaDetalhesADM() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [filme, setFilme] = useState(null);
  const [error, setError] = useState("");

  // Busco o filme para exibir (mesma lógica da tela de detalhes comum)
  useEffect(() => {
    async function fetchFilme() {
      try {
        const response = await fetch(`http://localhost:8000/filmes/${id}`);
        if (!response.ok) {
          throw new Error("Filme não encontrado.");
        }
        const data = await response.json();
        setFilme(data);
      } catch (error) {
        console.error("Erro ao carregar o filme:", error);
        setError(error.message);
      }
    }
    fetchFilme();
  }, [id]);

  // Função exclusiva do admin para deletar o filme direto
  const handleDeletar = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este filme? Esta ação não pode ser desfeita.")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Erro: Você precisa estar logado como ADM.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/filmes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.erro || "Falha ao excluir o filme.");
      }

      alert(data.mensagem); 
      // Volto para a lista de filmes depois de apagar
      navigate("/admin/visualizar-filmes"); 
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  if (!filme) return <p className="carregando">Carregando...</p>;

  return (
    <div className="telaEspecificacoes">
      <Header />
      <main className="mainEspecificacoes">
        <div className="containerFilme">
          {/* ... (Exibe imagem e textos do filme) ... */}
          <div className="detalhesFilme">
            {/* ... (Detalhes do filme) ... */}
            
            {/* Botões de ação exclusivos do admin */}
            <div className="admin-actions">
              <button onClick={handleDeletar} className="btn-admin-acao btn-admin-deletar">
                Deletar
              </button>
              
              <Link to={`/admin/editar-filme/${filme.id}`} className="btn-admin-acao btn-admin-editar">
                Editar Filme
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}