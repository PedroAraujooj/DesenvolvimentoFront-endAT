import {useContext, useEffect, useState} from "react";
import {alterarUsuario, listarUsuarios} from "../../infra/usuario.jsx";
import {Button, CssBaseline, List, ListItem, ListItemText} from "@mui/material";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import {UserContext} from "../../App.jsx";
import {useNavigate} from "react-router-dom";

export default function Colaboradores() {
    const {usuario} = useContext(UserContext);

    const navigate = useNavigate();

    if (!usuario.isADM) {
        navigate("/");
    }
    const [colaboradores, setColaboradores] = useState([]);
    useEffect(() => {
        async function fetchColaboradores() {
            let lista = await listarUsuarios();
            setColaboradores(lista);
        }

        fetchColaboradores();
    }, [colaboradores]);

    async function ativar(colaborador) {
        await alterarUsuario({...colaborador, isAtivo: true});
        let lista = await listarUsuarios();
        setColaboradores(lista);
    }

    async function bloquear(colaborador) {
        console.log(colaborador);
        await alterarUsuario({...colaborador, isAtivo: false});
        let lista = await listarUsuarios();
        setColaboradores(lista);
    }

    return (
        <div>
            <h3>Relação de Colaboradores</h3>
            <CssBaseline/>
            <Container
                maxWidth="md"
                sx={{
                    width: "63vw",
                    minWidth: "320px",
                    padding: "20px",
                    boxShadow: "7px 7px 21px",
                    borderRadius: "7px",
                    marginBottom: "14px",
                }}
            >

                <List>
                    {
                        colaboradores.map((colaborador) => {
                            return (
                                <ListItem key={colaborador.id}>
                                    <ListItemText>{colaborador.email}</ListItemText>
                                    {colaborador?.isAtivo == false ? (
                                            <Button variant="contained" size="medium" onClick={() => ativar(colaborador)}>
                                                Ativar
                                            </Button>) :
                                        (<Button
                                            variant="contained"
                                            size="medium"
                                            color="error"
                                            onClick={() => bloquear(colaborador)}
                                        >
                                            Bloquear
                                        </Button>)
                                    }
                                </ListItem>
                            );
                        })
                    }
                </List>
            </Container>
        </div>
    );
}