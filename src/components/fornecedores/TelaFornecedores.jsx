import {useContext, useEffect, useState} from 'react';
import {  listarFornecedores } from './fornecedores';
import FormFornecedores from './FormFornecedores';
import ListaFornecedores from './ListaFornecedores';
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../../App.jsx";

export default function TelaFornecedores(props){
    const {usuario} = useContext(UserContext);

    const navigate = useNavigate();

    if (!usuario.isADM) {
        navigate("/");
    }
    const [fornecedores, setFornecedores] = useState([]);
    const [idEmEdicao, setIdEmEdicao] = useState("");

    useEffect(() => {
        async function fetchData() {
        const novaListaFornecedores = await listarFornecedores();
        setFornecedores(novaListaFornecedores);
        console.log("listarFornecedores");
        }

        fetchData();
    }, [idEmEdicao]);

  return (
    <>
      <h3>Cadastro de Fornecedores</h3>
      <FormFornecedores idEmEdicao={idEmEdicao} setIdEmEdicao={setIdEmEdicao} />
      <ListaFornecedores fornecedores={fornecedores} setIdEmEdicao={setIdEmEdicao} />
    </>
  )
}