import {Outlet, Link, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {deslogarUsuario, obterUsuario} from "../infra/usuario";
import {makeStyles} from "@mui/styles";
import {useMediaQuery} from "@mui/material";
import PopupState, {bindTrigger, bindMenu} from "material-ui-popup-state";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {UserContext} from "../App.jsx";

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
    MenuItemStyle: {
        color: "Black",
        textDecoration: "none",
    }
});

export default function Layout(props) {
    //const [usuario, setUsuario] = useState("");
    const {usuario, setUsuario} = useContext(UserContext);
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
                                    <MenuItem>
                                        <Link to={"/"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                            Início
                                        </Link>
                                    </MenuItem>
                                    {usuario.isADM && (
                                        <MenuItem>
                                            <Link to={"/fornecedores"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                                Fornecedores
                                            </Link>
                                        </MenuItem>
                                    )}
                                    {usuario.isADM && (
                                        <MenuItem>
                                            <Link to={"/contatos"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                                Contatos
                                            </Link>
                                        </MenuItem>
                                    )}
                                    {usuario.isADM && (
                                        <MenuItem>
                                            <Link to={"/produtos"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                                Produtos
                                            </Link>
                                        </MenuItem>
                                    )}
                                    {usuario.isADM && (
                                        <MenuItem>
                                            <Link to={"/cotacoes"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                                Cotações
                                            </Link>
                                        </MenuItem>
                                    )}
                                    {usuario.isADM && (
                                        <MenuItem>
                                            <Link to={"/colaboradores"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                                Colaboradores
                                            </Link>
                                        </MenuItem>
                                    )}
                                    {!usuario.isADM && (
                                        <MenuItem>
                                            <Link to={"/requisicoes"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                                Suas Requisições
                                            </Link>
                                        </MenuItem>
                                    )}
                                    {usuario.isADM && (
                                        <MenuItem>
                                            <Link to={"/requisicoesAdm"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                                Requisições
                                            </Link>
                                        </MenuItem>
                                    )}
                                    {usuario.isADM && (
                                        <MenuItem>
                                            <Link to={"/adm"} onClick={popupState.close} className={classes.MenuItemStyle}>
                                                Criar conta de ADM
                                            </Link>
                                        </MenuItem>
                                    )}
                                    <MenuItem>
                                        <p
                                            style={{textDecoration: "underline"}}
                                            className={classes.MenuItemStyle}
                                            onClick={() => {
                                                popupState.close();
                                                logout();
                                            }}
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
                        {usuario.isADM?(
                            <li>
                                <Link to={"/fornecedores"} className={classes.liStyle}>
                                    Fornecedores
                                </Link>
                            </li>) : ""}
                        {usuario.isADM?(
                            <li>
                                <Link to={"/contatos"} className={classes.liStyle}>
                                    Contatos
                                </Link>
                            </li>) : ""}
                        {usuario.isADM?(
                            <li>
                                <Link to={"/produtos"} className={classes.liStyle}>
                                    Produtos
                                </Link>
                            </li>) : ""}
                        {usuario.isADM?(
                            <li>
                                <Link to={"/cotacoes"} className={classes.liStyle}>
                                    Cotações
                                </Link>
                            </li>) : ""}
                        {usuario.isADM?(
                        <li>
                            <Link to={"/colaboradores"} className={classes.liStyle}>
                                Colaboradores
                            </Link>
                        </li>) : ""}
                        {!usuario.isADM?(
                            <li>
                                <Link to={"/requisicoes"} className={classes.liStyle}>
                                    Suas Requisições
                                </Link>
                            </li>) : ""}
                        {usuario.isADM?(
                            <li>
                                <Link to={"/requisicoesAdm"} className={classes.liStyle}>
                                    Requisições
                                </Link>
                            </li>) : ""}
                        {usuario.isADM?(
                        <li>
                            <Link to={"/adm"} className={classes.liStyle}>
                                Criar conta de ADM
                            </Link>
                        </li>) : ""}
                        <li>
                            <p
                                style={{textDecoration: "underline"}}
                                className={classes.liStyle}
                                onClick={logout}
                            >
                                LOGOUT
                            </p>
                        </li>
                    </ul>
                )}
            </nav>
            <Outlet/>
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
                {!isMobile ? (<h1
                    style={{
                        color: "white",
                        fontSize: "42px",
                        margin: "auto 0 auto 14px",
                    }}
                >
                    SisCompra
                </h1>) : (<h1
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
            <Outlet/>
        </div>
    );
    return usuario.id ? telaLogado : telaLogin;
}
