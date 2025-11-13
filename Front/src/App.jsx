import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importa todas as suas páginas
import TelaLogin from './pages/TelaLogin';
import TelaCadastro from './pages/TelaCadastro';
import TelaLoginADM from './pages/TelaLoginADM';
import TelaInicial from './pages/TelaInicial';
import TelaFilmes from './pages/TelaFilmes';
import TelaDetalhes from './pages/TelaDetalhes';
import TelaAdm from './pages/TelaAdm';
import TelaNotificacoes from './pages/TelaNotificacoes';
import TelaEspecificacoesSolicitacao from './pages/TelaEspecificacoesSolicitacao';
import TelaVisualizacaoFilmes from './pages/TelaVisualizacaoFilmes';
import TelaAdicionarFilmes from './pages/TelaAdicionarFilmes';
import TelaEdicaoFilmes from './pages/TelaEdicaoFilmes';
import TelaAdicionarFilmesADM from './pages/TelaAdicionarFilmesADM';
import TelaVisualizacaoFilmesADM from './pages/TelaVisualizacaoFilmesADM';
import TelaDetalhesADM from './pages/TelaDetalhesADM';


// Importa o seu CSS global
import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      {/* Idealmente, teríamos um componente <Header /> ou <Navbar /> aqui.
        Por agora, vamos deixar o App.jsx controlar as rotas. 
      */}
      <Routes>
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<TelaLogin />} />
        <Route path="/cadastro" element={<TelaCadastro />} />
        <Route path="/login-adm" element={<TelaLoginADM />} />
        
        {/* Rotas de Utilizador Comum */}
        <Route path="/" element={<TelaInicial />} />
        <Route path="/filmes" element={<TelaFilmes />} />
        <Route path="/filmes/:id" element={<TelaDetalhes />} /> 
        
        {/* Rotas de Admin */}
        <Route path="/admin" element={<TelaAdm />} />
        <Route path="/admin/notificacoes" element={<TelaNotificacoes />} />
        <Route path="/admin/solicitacao/:id" element={<TelaEspecificacoesSolicitacao />} />
        <Route path="/admin/visualizar-filmes" element={<TelaVisualizacaoFilmes />} />
        <Route path="/admin/adicionar-filme" element={<TelaAdicionarFilmesADM />} />
        <Route path="/admin/filme/:id" element={<TelaDetalhesADM />} />
        

        
        {/* Rotas de CRUD (provavelmente acedidas a partir do /admin) */}
        <Route path="/admin/adicionar-filme" element={<TelaAdicionarFilmes />} />
        <Route path="/admin/editar-filme/:id" element={<TelaEdicaoFilmes />} />

        {/* Adicione uma rota "fallback" para URLs não encontradas */}
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;