import {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { listarRequisicoes } from './requisicoes';
import FormRequisicao from './FormRequisicao';
import {UserContext} from "../../App.jsx";
import ListaRequisicoes from "./ListaRequisicoes.jsx";

export default function TelaRequisicao(props){
    const {usuario} = useContext(UserContext);

  const navigate = useNavigate();

    if (usuario.isADM || !usuario.id) {
        navigate("/");
    }
    const [requisicoes, setRequisicoes] = useState([]);
    const [idEmEdicao, setIdEmEdicao] = useState("");

    useEffect(() => {
        async function fetchData() {
        const novaListaRequisicoes = await listarRequisicoes();
        setRequisicoes(novaListaRequisicoes);
        console.log("listarContatos");
        }

        fetchData();
    }, [idEmEdicao]);

  return (
    <>
      <h3>Fazer Requisição</h3>
      <FormRequisicao idEmEdicao={idEmEdicao} setIdEmEdicao={setIdEmEdicao} />
      <ListaRequisicoes requisicoes={requisicoes} setIdEmEdicao={setIdEmEdicao} />
    </>
  )
}