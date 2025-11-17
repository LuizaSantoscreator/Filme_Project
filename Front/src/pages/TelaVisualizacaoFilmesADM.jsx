import React, { useState, useEffect } from "react";
import { Link,} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style_pages/TelaVisualizacaoFilmesADM.css";

export default function TelaVisualizacaoFilmes() {

    // Estados para a lista de filmes e feedback
    const [filmes, setFilmes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Busco todos os filmes aprovados para exibir na tabela
    useEffect(() => {
        const fetchFilmes = async () => {
            try {
                setLoading(true);
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

    // Função para o admin excluir um filme permanentemente
    const handleExcluirFilme = async (filmeId) => {
    
        if (!window.confirm("Tem certeza que deseja excluir este filme? Esta ação não pode ser desfeita.")) {
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Você precisa estar logado como ADM para excluir.");
            return;
        }

        try {

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

            // Removo o filme da tabela visualmente
            setFilmes(filmes.filter((filme) => filme.id !== filmeId));
            alert(data.mensagem);

        } catch (err) {
            setError(err.message);
            alert(`Erro: ${err.message}`);
        }
    };

    // Função auxiliar para renderizar a tabela ou mensagens de erro
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
                    {/* Crio uma linha na tabela para cada filme */}
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
                                    {/* Botão de Editar (Link) */}
                                    <Link
                                        to={`/admin/editar-filme/${filme.id}`}
                                        className="btn-tabela btn-editar"
                                    >
                                        Editar
                                    </Link>
                               
                                    {/* Botão de Excluir */}
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