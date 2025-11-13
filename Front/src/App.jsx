// src/App.jsx (COMPLETO E CORRIGIDO)

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importa todas as suas páginas
import TelaLogin from './pages/TelaLogin';
import TelaCadastro from './pages/TelaCadastro';
import TelaLoginADM from './pages/TelaLoginADM';
import TelaInicial from './pages/TelaInicial';
import TelaFilmes from './pages/TelaFilmes';
import TelaDetalhes from './pages/TelaDetalhes'; // <-- Detalhes do Usuário
import TelaAdm from './pages/TelaAdm';
import TelaNotificacoes from './pages/TelaNotificacoes';
import TelaEspecificacoesSolicitacao from './pages/TelaEspecificacoesSolicitacao';
import TelaAdicionarFilmes from './pages/TelaAdicionarFilmes'; // <-- Formulário do Usuário
import TelaEdicaoFilmes from './pages/TelaEdicaoFilmes';
import TelaAdicionarFilmesADM from './pages/TelaAdicionarFilmesADM'; // <-- Formulário do Admin
import TelaVisualizacaoFilmesADM from './pages/TelaVisualizacaoFilmesADM'; // <-- Tabela do Admin
import TelaDetalhesADM from './pages/TelaDetalhesADM'; // <-- Detalhes do Admin

// Importa o seu CSS global
import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      {/* O Header/Footer é renderizado dentro de cada página individual,
        o que está correto para as suas telas de login/cadastro.
      */}
      <Routes>
        {/* === CORREÇÃO: Rotas de Autenticação e Principal === */}
        {/* A Rota '/' (raiz) agora é a TelaCadastro */}
        <Route path="/" element={<TelaCadastro />} />
        <Route path="/login" element={<TelaLogin />} />
        <Route path="/login-adm" element={<TelaLoginADM />} />
        
        {/* === CORREÇÃO: Rotas de Utilizador Comum === */}
        {/* A TelaInicial agora está em '/home' */}
        <Route path="/home" element={<TelaInicial />} />
        <Route path="/filmes" element={<TelaFilmes />} />
        <Route path="/filmes/:id" element={<TelaDetalhes />} /> 
        {/* Rota para o formulário do usuário (sugestão) */}
        <Route path="/adicionar-filme" element={<TelaAdicionarFilmes />} />
        
        {/* === CORREÇÃO: Rotas de Admin (Limpas e Corrigidas) === */}
        <Route path="/admin" element={<TelaAdm />} />
        <Route path="/admin/notificacoes" element={<TelaNotificacoes />} />
        <Route path="/admin/solicitacao/:id" element={<TelaEspecificacoesSolicitacao />} />
        {/* Rota aponta para a tabela de Admin (correto) */}
        <Route path="/admin/visualizar-filmes" element={<TelaVisualizacaoFilmesADM />} />
        {/* Rota aponta para o formulário de Admin (correto) */}
        <Route path="/admin/adicionar-filme" element={<TelaAdicionarFilmesADM />} />
        <Route path="/admin/editar-filme/:id" element={<TelaEdicaoFilmes />} />
        {/* Rota para a tela de detalhes do Admin (da Etapa 3) */}
        <Route path="/admin/filme/:id" element={<TelaDetalhesADM />} />

        {/* Rota "fallback" para URLs não encontradas */}
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;