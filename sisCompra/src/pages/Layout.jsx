import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import BarraLogin from "../components/login/BarraLogin";

export default function Layout() {
  //const [usuario, setUsuario] = useState("");
    const [usuario, setUsuario] = useState({id:"", email:"", senha:""});

    const liStyle = {
      color: "white",
      textDecoration: 'none',
      marginRight: "35px"
    }
  return (
    // <div style={{ position: "absolute", left: "10px", top: "10px" }}>
    //     <BarraLogin usuario={usuario} setUsuario = {setUsuario} />
    // {usuario.id &&  
      <div style={{
        height: "100%",
        margin: " auto auto"
      }}>
        <nav style={{
            width: "100vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#455cf5",
            height: "70px",
        }}>
          <h1 style={{
              color: "white",
              fontSize: "42px",
              margin: "auto 0 auto 0"
            }}>
                SisCompra
          </h1>
          <ul style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            listStyle: "none",
            backgroundColor: "#455cf5",
            textDecoration: 'none'
        }}>
            <li>
              <Link to={"/"} style = {liStyle}>Início</Link>
            </li>
            <li>
              <Link to={"/fornecedores"} style = {liStyle}>Fornecedores</Link>
            </li>
            <li>
              <Link to={"/contatos"} style = {liStyle}>Contatos</Link>
            </li>
            <li>
              <Link to={"/produtos"} style = {liStyle}>Produtos</Link>
            </li>
            <li>
              <Link to={"/cotacoes"} style = {liStyle}>Cotações</Link>
            </li> 
          </ul>
        </nav>
        <Outlet />
      </div>
    // }
    //</div>
  );
}
