import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaAdicionarFilmes.css";
import "../style/style_pages/TelaEdicaoFilmes.css";
import imagemDiretor from "../assets/imagem_diretor.png";

export default function TelaEdicaoFilmes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "", diretor: "", atores: "", ano: "", genero: "", sinopse: "", poster_url: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");

  // Primeiro, carrego os dados atuais do filme para preencher o formulário
  useEffect(() => {
    const fetchFilme = async () => {
      try {
        const response = await fetch(`http://localhost:8000/filmes/${id}`);
        if (!response.ok) throw new Error("Filme não encontrado.");

        const data = await response.json();

        // Preencho o estado com os dados que vieram do banco
        setFormData({
          titulo: data.titulo || "",
          ano: data.ano || "",
          sinopse: data.sinopse || "",
          poster_url: data.poster_url || "",
          diretor: data.diretores ? data.diretores.join(", ") : "",
          atores: data.atores ? data.atores.join(", ") : "",
          genero: data.generos ? data.generos.join(", ") : "",
        });

      } catch (err) {
        setError(`Erro ao carregar dados: ${err.message}`);
      }
    };
    fetchFilme();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Salva a edição diretamente (PUT /admin/filmes/id)
  const handleSave = async (e) => {
    e.preventDefault();
    setMensagem("");
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Acesso negado. Faça login.");

      const dadosParaEnviar = {
        titulo: formData.titulo,
        ano: formData.ano,
        sinopse: formData.sinopse,
        poster_url: formData.poster_url,
        generos_texto: formData.genero,
        diretores_texto: formData.diretor,
        atores_texto: formData.atores,
      };

      const response = await fetch(`http://localhost:8000/admin/filmes/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao salvar.");

      setMensagem(data.mensagem);
      setTimeout(() => navigate("/admin/visualizar-filmes"), 2000);

    } catch (err) {
      setError(`Não foi possível salvar: ${err.message}`);
    }
  };

  // Deleta o filme
  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este filme?")) return;
    setError("");
    setMensagem("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Acesso negado. Faça login.");

      const response = await fetch(`http://localhost:8000/filmes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao excluir.");

      alert(data.mensagem);
      navigate("/admin/visualizar-filmes");

    } catch (err) {
      setError(`Não foi possível excluir: ${err.message}`);
    }
  };


  return (
    <div className="tela-adicionar-filmes">
      <Header />
      {/* ... (Formulário preenchido com os dados) ... */}
      <Footer />
    </div>
  );
}