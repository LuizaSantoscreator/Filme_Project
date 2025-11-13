import React, { useState, useEffect } from "react";
import { Link,} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
// O CSS correto para esta tela
import "../style/style_pages/TelaVisualizacaoFilmesADM.css";

export default function TelaVisualizacaoFilmes() {
    // Sem espaços estranhos aqui
    const [filmes, setFilmes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- BUSCAR OS FILMES ---
    useEffect(() => {
        const fetchFilmes = async () => {
            try {
                setLoading(true);
                // 1. Busca todos os filmes aprovados
                const response = await fetch("http://localhost:8000/filmes");
                if (!response.ok) {
                    throw new Error("Falha ao carregar a lista de filmes.");
                }
                const data = await response.json();
                setFilmes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFilmes();
    }, []);

    // --- FUNÇÃO DE EXCLUIR ---
    const handleExcluirFilme = async (filmeId) => {
        // Confirmação
        if (!window.confirm("Tem certeza que deseja excluir este filme? Esta ação não pode ser desfeita.")) {
            return;
        }

        // 1. Pega o token do Admin
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Você precisa estar logado como ADM para excluir.");
            return;
        }

        try {
            // 2. Chama o endpoint de DELETE do backend
            const response = await fetch(`http://localhost:8000/filmes/${filmeId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Falha ao excluir o filme.");
            }

            // 3. Sucesso: Remove o filme da lista na tela
            setFilmes(filmes.filter((filme) => filme.id !== filmeId));
            alert(data.mensagem); // "Filme deletado com sucesso."

        } catch (err) {
            setError(err.message);
            alert(`Erro: ${err.message}`);
        }
    };

    // --- RENDERIZAÇÃO ---
    const renderConteudo = () => {
        if (loading) {
            return <p className="mensagem-feedback">Carregando filmes...</p>;
        }
        if (error) {
            return <p className="mensagem-feedback erro">{error}</p>;
        }
        if (filmes.length === 0) {
            return <p className="mensagem-feedback">Nenhum filme encontrado no banco.</p>;
        }

        // Tabela com os filmes
        return (
            <table className="tabela-filmes">
                <thead>
                    <tr>
                        <th>Pôster</th>
                        <th>Título</th>
                        <th>Ano</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filmes.map((filme) => (
                        <tr key={filme.id}>
                            <td>
                                <img
                                    src={filme.poster_url}
                                    alt={filme.titulo}
                                    className="tabela-poster"
                                />
                            </td>
                            <td data-label="Título">{filme.titulo}</td>
                            <td data-label="Ano">{filme.ano}</td>
                            <td data-label="Ações">
                                <div className="tabela-acoes">
                                    {/* Botão Editar: Leva para a TelaEdicaoFilmes */}
                                    <Link
                                        to={`/admin/editar-filme/${filme.id}`}
                                        className="btn-tabela btn-editar"
                                    >
                                        Editar
                                    </Link>
                                    {/* Botão Excluir: Chama a função handleExcluirFilme */}
                                    <button
                                        onClick={() => handleExcluirFilme(filme.id)}
                                        className="btn-tabela btn-excluir"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="tela-visualizacao-filmes">
            <Header />
            <main className="main-visualizacao">
                <h1>Gerenciador de Filmes</h1>
                <p>Visualize, edite ou exclua os filmes que já estão na plataforma.</p>

                <div className="container-tabela">
                    {renderConteudo()}
                </div>

            </main>
            <Footer />
        </div>
    );
}