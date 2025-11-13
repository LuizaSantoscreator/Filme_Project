import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import diretor from "../assets/imagem_diretor.png";
import "../style/style_pages/TelaAdm.css";

export default function TelaAdm() {
  const navigate = useNavigate();

  return (
    <div className="tela-adm">
      <Header />

      {/* SEÇÃO PRINCIPAL */}
      <main className="adm-main">
        <section className="adm-hero">
          <div className="adm-texto">
            <h1>
              Seja bem-vindo, <br />
              Administrador(a)!
            </h1>
          </div>

          <div className="adm-ilustracao">
            <img src={diretor} alt="Ilustração de diretor com megafone" />
          </div>
        </section>

        {/* SEÇÃO DE BOTÕES */}
        <section className="adm-botoes" aria-label="Ações do administrador">
          <button
            className="adm-btn"
            // Este caminho está diferente no seu App.jsx, verifique se /admin/adicionar-filme não é o correto.
            onClick={() => navigate("/adicionar-filmes")}
          >
            Adicionar Filmes
          </button>

          {/* --- BOTÃO CORRIGIDO --- */}
          {/* O caminho foi atualizado para '/admin/notificacoes' */}
          <button
            className="adm-btn"
            onClick={() => navigate("/admin/notificacoes")}
          >
            Solicitações de Filmes
          </button>

          <button
            className="adm-btn"
            // Este caminho também está no seu App.jsx
            onClick={() => navigate("/admin/visualizar-filmes")}
          >
            Visualizar Filmes
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}