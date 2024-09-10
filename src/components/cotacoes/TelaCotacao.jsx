import {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { listarCotacoes } from './cotacoes';
import FormCotacao from './FormCotacao';
import ListaCotacoes from './ListaCotacao';
import {UserContext} from "../../App.jsx";

export default function TelaCotacao(props){
    const {usuario} = useContext(UserContext);

  const navigate = useNavigate();

    if (!usuario.isADM) {
        navigate("/");
    }
    const [cotacoes, setCotacoes] = useState([]);
    const [idEmEdicao, setIdEmEdicao] = useState("");

    useEffect(() => {
        async function fetchData() {
        const novaListaCotacoes = await listarCotacoes();
        setCotacoes(novaListaCotacoes);
        console.log("listarContatos");
        }

        fetchData();
    }, [idEmEdicao]);

  return (
    <>
      <h3>Cadastro de Cotações</h3>
      <FormCotacao idEmEdicao={idEmEdicao} setIdEmEdicao={setIdEmEdicao} />
      <ListaCotacoes cotacoes={cotacoes} setIdEmEdicao={setIdEmEdicao} />
    </>
  )
}