import {createContext, useState} from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css'
import Login from './components/login/Login'
import Layout from './pages/Layout';
import Home from './pages/Home';
import CriarConta from './components/login/CriarConta';
import TelaContato from './components/contatos/TelaContato';
import TelaFornecedores from './components/fornecedores/TelaFornecedores';
import TelaProdutos from './components/produtos/TelaProdutos';
import TelaCotacao from './components/cotacoes/TelaCotacao';
import CriarContaADM from "./components/login/CriarContaADM.jsx";
import Colaboradores from "./components/colaboradores/Colaboradores.jsx";
import TelaRequisicao from "./components/requisicoes/TelaRequisicao.jsx";
import TelaRequisicaoADM from "./components/requisicoes/TelaRequisicaoADM.jsx";

export     const UserContext = createContext();
function App() {
    const [usuario, setUsuario] = useState({id: "", email: "", senha: ""});

    return (
        <UserContext.Provider value={{usuario: usuario, setUsuario: setUsuario}}>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="criarConta" element={<CriarConta/>}/>
                        <Route path="contatos" element={<TelaContato/>}/>
                        <Route path="fornecedores" element={<TelaFornecedores/>}/>
                        <Route path="produtos" element={<TelaProdutos/>}/>
                        <Route path="cotacoes" element={<TelaCotacao/>}/>
                        <Route path="adm" element={<CriarContaADM/>}/>
                        <Route path="colaboradores" element={<Colaboradores/>}/>
                        <Route path="requisicoes" element={<TelaRequisicao/>}/>
                        <Route path="requisicoesAdm" element={<TelaRequisicaoADM/>}/>
                        {/* <Route path="fornecedores" element={<Fornecedores />} />
          <Route path="contatos" element={<Contatos />} />            
          <Route path="produtos" element={<Produtos />} />
          <Route path="cotacoes" element={<Cotacoes />} />
          <Route path="*" element={<NaoEncontrado />} /> */}
                    </Route>
                </Routes>
            </Router>
        </UserContext.Provider>

    )
}

export default App
