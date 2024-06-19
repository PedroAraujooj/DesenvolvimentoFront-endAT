import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Login from './components/login/Login'
import Layout from './pages/Layout';

function App() {
  const [usuario, setUsuario] = useState({});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
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
