import {useContext, useEffect, useState} from 'react';
import FormContato from './FormContato'
import ListaContatos from './ListaContatos'
import { listarContatos } from './contatos';
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../../App.jsx";

export default function TelaContato(props){

  const navigate = useNavigate();

    const {usuario} = useContext(UserContext);


    if (!usuario.isADM) {
        navigate("/");
    }

    const [contatos, setContatos] = useState([]);
    const [idEmEdicao, setIdEmEdicao] = useState("");

    useEffect(() => {
        async function fetchData() {
        const novaListaContatos = await listarContatos();
        setContatos(novaListaContatos);
        console.log("listarContatos");
        }

        fetchData();
    }, [idEmEdicao]);

  return (
    <>
      <h3>Cadastro de Contatos</h3>
      <FormContato idEmEdicao={idEmEdicao} setIdEmEdicao={setIdEmEdicao} />
      <ListaContatos contatos={contatos} setIdEmEdicao={setIdEmEdicao} />
    </>
  )
}