import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import BarraLogin from "../components/login/BarraLogin";
import { deslogarUsuario } from "../infra/usuario";
 import { makeStyles } from '@mui/styles';

 const useStyles = makeStyles ({
   liStyle: {
     color: 'white',
     textDecoration: 'none',
    marginRight: '35px',
     transition: 'all 0.4s ease-in-out',
     '&:hover': {
       color: '#c8cfe0',
     },
   },
 });

export default function Layout(props) {
  //const [usuario, setUsuario] = useState("");
    const {usuario, setUsuario} = props;
    const classes = useStyles();
        
    const navigate = useNavigate();


    async function logout(){
      let retorno = await deslogarUsuario();
        setUsuario(retorno);
        navigate('/');
    }

    const telaLogado = (
      <div style={{
        height: "100%",
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
              margin: "auto 0 auto 14px"
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
              <Link to={"/"} className = {classes.liStyle}>Início</Link>
            </li>
            <li>
              <Link to={"/fornecedores"} className = {classes.liStyle}>Fornecedores</Link>
            </li>
            <li>
              <Link to={"/contatos"} className = {classes.liStyle}>Contatos</Link>
            </li>
            <li>
              <Link to={"/produtos"} className = {classes.liStyle}>Produtos e Cotações</Link>
            </li>
            <li>
              <p style={{textDecoration : "underline"}} className = {classes.liStyle} onClick={logout}>LOGOUT</p>
            </li> 
          </ul>
        </nav>
        <Outlet />
      </div>
    );

    const telaLogin = (
      <div style={{
        height: "100%",
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
              margin: "auto 0 auto 14px"
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
              <Link to={"/login"} className = {classes.liStyle}>Login</Link>
            </li>
            <li>
              <Link to={"/criarConta"} className = {classes.liStyle}>Criar Conta</Link>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    );
  return usuario.id? telaLogado : telaLogin;
}
