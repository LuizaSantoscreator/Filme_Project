import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TelaLogin from './pages/TelaLogin';
import TelaCadastro from './pages/TelaCadastro';
import TelaLoginADM from './pages/TelaLoginADM';
import TelaInicial from './pages/TelaInicial';
import TelaFilmes from './pages/TelaFilmes';
import TelaDetalhes from './pages/TelaDetalhes'; 
import TelaAdm from './pages/TelaAdm';
import TelaNotificacoes from './pages/TelaNotificacoes';
import TelaEspecificacoesSolicitacao from './pages/TelaEspecificacoesSolicitacao';
import TelaAdicionarFilmes from './pages/TelaAdicionarFilmes';
import TelaEdicaoFilmes from './pages/TelaEdicaoFilmes';
import TelaAdicionarFilmesADM from './pages/TelaAdicionarFilmesADM'; 
import TelaVisualizacaoFilmesADM from './pages/TelaVisualizacaoFilmesADM'; 
import TelaDetalhesADM from './pages/TelaDetalhesADM'; 

import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaCadastro />} />
        <Route path="/login" element={<TelaLogin />} />
        <Route path="/login-adm" element={<TelaLoginADM />} />
        <Route path="/home" element={<TelaInicial />} />
        <Route path="/filmes" element={<TelaFilmes />} />
        <Route path="/filmes/:id" element={<TelaDetalhes />} /> 
        <Route path="/adicionar-filme" element={<TelaAdicionarFilmes />} />
        <Route path="/admin" element={<TelaAdm />} />
        <Route path="/admin/notificacoes" element={<TelaNotificacoes />} />
        <Route path="/admin/solicitacao/:id" element={<TelaEspecificacoesSolicitacao />} />
        <Route path="/admin/visualizar-filmes" element={<TelaVisualizacaoFilmesADM />} />
        <Route path="/admin/adicionar-filme" element={<TelaAdicionarFilmesADM />} />
        <Route path="/admin/editar-filme/:id" element={<TelaEdicaoFilmes />} />
        <Route path="/admin/filme/:id" element={<TelaDetalhesADM />} />
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;