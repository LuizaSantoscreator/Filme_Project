import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaAdicionarFilmesADM.css";
import { useNavigate } from "react-router-dom";

export default function TelaAdicionarFilmesADM() {
  // Estado para o formulário
  const [formData, setFormData] = useState({
    titulo: "", diretor: "", atores: "", ano: "", genero: "", sinopse: "", poster_url: "", 
  });
  
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para enviar o filme diretamente (sem precisar de aprovação)
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

      // Uso a rota especial '/admin/filmes' que cria direto
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
      
      // Limpo o formulário e volto para o painel
      setFormData({ titulo: "", diretor: "", atores: "", ano: "", genero: "", sinopse: "", poster_url: "" });
      setTimeout(() => navigate("/admin"), 2000);

    } catch (err) {
      setError(` Não foi possível adicionar o filme: ${err.message}`);
      setMensagem(""); 
    }
  };

  return (
    <div className="tela-adicionar-filme-adm">
      <Header />
      {/* ... (Formulário de adição) ... */}
      <Footer />
    </div>
  );
}