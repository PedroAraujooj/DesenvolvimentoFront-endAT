import {useContext, useEffect, useState} from 'react';
import FormProdutos from './FormProdutos';
import ListaProdutos from './ListaProdutos';
import {listarProdutos} from './produtos';
import {useNavigate} from 'react-router-dom';
import {UserContext} from "../../App.jsx";

export default function TelaProdutos(props) {
    const {usuario} = useContext(UserContext);
    const navigate = useNavigate();

    if (!usuario.isADM) {
        navigate("/");
    }
    const [produtos, setProdutos] = useState([]);
    const [idEmEdicao, setIdEmEdicao] = useState("");

    useEffect(() => {
        async function fetchData() {
            const novaListaProdutos = await listarProdutos();
            setProdutos(novaListaProdutos);
            console.log("listarProdutos");
        }

        fetchData();
    }, [idEmEdicao]);

    return (
        <>
            <h3>Cadastro de Produtos</h3>
            <FormProdutos idEmEdicao={idEmEdicao} setIdEmEdicao={setIdEmEdicao}/>
            <ListaProdutos produtos={produtos} setIdEmEdicao={setIdEmEdicao}/>
        </>
    )
}