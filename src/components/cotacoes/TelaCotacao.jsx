import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarCotacoes } from './cotacoes';
import FormCotacao from './FormCotacao';
import ListaCotacoes from './ListaCotacao';

export default function TelaCotacao(props){

  const navigate = useNavigate();

    if(!props.usuario.id){
        navigate("/login");
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