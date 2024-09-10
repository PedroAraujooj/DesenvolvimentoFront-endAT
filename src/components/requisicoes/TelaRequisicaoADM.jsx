import {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { listarRequisicoes } from './requisicoes';
import FormRequisicao from './FormRequisicao';
import {UserContext} from "../../App.jsx";
import ListaRequisicoes from "./ListaRequisicoes.jsx";
import ListaRequisicoesADM from "./ListaRequisicoesADM.jsx";

export default function TelaRequisicaoADM(props){
    const {usuario} = useContext(UserContext);

  const navigate = useNavigate();

    if (!usuario.isADM) {
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
      <h3>Lista de requisições</h3>
      <ListaRequisicoesADM requisicoes={requisicoes} setIdEmEdicao={setIdEmEdicao} />
    </>
  )
}