import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Login from './components/login/Login'
import Layout from './pages/Layout';
import Home from './pages/Home';
import CriarConta from './components/login/CriarConta';
import TelaContato from './components/contatos/TelaContato';
import TelaFornecedores from './components/fornecedores/TelaFornecedores';
import TelaProdutos from './components/produtos/TelaProdutos';
import TelaCotacao from './components/cotacoes/TelaCotacao';

function App() {
  const [usuario, setUsuario] = useState({id:"", email:"", senha:""});


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout usuario={usuario} setUsuario={setUsuario}/>}>
          <Route index element={<Home usuario={usuario} setUsuario={setUsuario}/>} />
          <Route path="login" element={<Login usuario={usuario} setUsuario={setUsuario}/>} />
          <Route path="criarConta" element={<CriarConta usuario={usuario} setUsuario={setUsuario}/>} />
          <Route path="contatos" element={<TelaContato usuario={usuario} setUsuario={setUsuario}/>} />
          <Route path="fornecedores" element={<TelaFornecedores usuario={usuario}/>} />
          <Route path="produtos" element={<TelaProdutos usuario={usuario}/>} />
          <Route path="cotacoes" element={<TelaCotacao  usuario={usuario}/>} />
          {/* <Route path="fornecedores" element={<Fornecedores />} />
          <Route path="contatos" element={<Contatos />} />            
          <Route path="produtos" element={<Produtos />} />
          <Route path="cotacoes" element={<Cotacoes />} />
          <Route path="*" element={<NaoEncontrado />} /> */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
