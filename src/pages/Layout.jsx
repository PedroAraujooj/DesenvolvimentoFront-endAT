import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { deslogarUsuario } from "../infra/usuario";
import { makeStyles } from "@mui/styles";
import { useMediaQuery } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const useStyles = makeStyles({
  liStyle: {
    color: "white",
    textDecoration: "none",
    marginRight: "35px",
    transition: "all 0.4s ease-in-out",
    "&:hover": {
      color: "#c8cfe0",
    },
  },
  MenuItemStyle:{
    color: "Black",
    textDecoration: "none",
  }
});

export default function Layout(props) {
  //const [usuario, setUsuario] = useState("");
  const { usuario, setUsuario } = props;
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width:600px)");

  const navigate = useNavigate();

  async function logout() {
    let retorno = await deslogarUsuario();
    setUsuario(retorno);
    navigate("/");
  }

  const telaLogado = (
    <div
      style={{
        height: "100%",
      }}
    >
      <nav
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#455cf5",
          height: "70px",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "42px",
            margin: "auto 0 auto 14px",
          }}
        >
          SisCompra
        </h1>
        {isMobile ? (
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  Navegação
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem >
                    {" "}
                    <Link to={"/"} onClick={popupState.close} className={classes.MenuItemStyle}>
                      Início
                    </Link>
                  </MenuItem>
                  <MenuItem >
                    <Link to={"/fornecedores"} onClick={popupState.close} className={classes.MenuItemStyle}>
                      Fornecedores
                    </Link>
                  </MenuItem>
                  <MenuItem >
                    <Link to={"/contatos"}  onClick={popupState.close} className={classes.MenuItemStyle}>
                      Contatos
                    </Link>
                  </MenuItem>
                  <MenuItem >
                    <li>
                      <Link to={"/produtos"}  onClick={popupState.close}className={classes.MenuItemStyle}>
                        Produtos
                      </Link>
                    </li>
                  </MenuItem>
                  <MenuItem >
                    <Link  to={"/cotacoes"} onClick={popupState.close} className={classes.MenuItemStyle}>
                      Cotações
                    </Link>
                  </MenuItem>
                  <MenuItem >
                    <p 
                      style={{ textDecoration: "underline" }}
                      className={classes.MenuItemStyle}
                      onClick={logout}
                    >
                      LOGOUT
                    </p>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        ) : (
          <ul
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              listStyle: "none",
              backgroundColor: "#455cf5",
              textDecoration: "none",
            }}
          >
            <li>
              <Link to={"/"} className={classes.liStyle}>
                Início
              </Link>
            </li>
            <li>
              <Link to={"/fornecedores"} className={classes.liStyle}>
                Fornecedores
              </Link>
            </li>
            <li>
              <Link to={"/contatos"} className={classes.liStyle}>
                Contatos
              </Link>
            </li>
            <li>
              <Link to={"/produtos"} className={classes.liStyle}>
                Produtos
              </Link>
            </li>
            <li>
              <Link to={"/cotacoes"} className={classes.liStyle}>
                Cotações
              </Link>
            </li>
            <li>
              <p
                style={{ textDecoration: "underline" }}
                className={classes.liStyle}
                onClick={logout}
              >
                LOGOUT
              </p>
            </li>
          </ul>
        )}
      </nav>
      <Outlet />
    </div>
  );

  const telaLogin = (
    <div
      style={{
        height: "100%",
      }}
    >
      <nav
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#455cf5",
          height: "70px",
        }}
      >
        {!isMobile ?(<h1
          style={{
            color: "white",
            fontSize: "42px",
            margin: "auto 0 auto 14px",
          }}
        >
          SisCompra
        </h1>):(<h1
          style={{
            color: "white",
            fontSize: "35px",
            margin: "auto 0 auto 14px",
          }}
        >
          SisCompra
        </h1>)}
        <ul
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            listStyle: "none",
            backgroundColor: "#455cf5",
            textDecoration: "none",
          }}
        >
          <li>
            <Link to={"/login"} className={classes.liStyle}>
              Login
            </Link>
          </li>
          <li>
            <Link to={"/criarConta"} className={classes.liStyle}>
              Criar Conta
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
  return usuario.id ? telaLogado : telaLogin;
}
