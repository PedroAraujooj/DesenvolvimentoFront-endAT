import { useEffect, useState } from 'react';
import FormContato from './FormContato'
import ListaContatos from './ListaContatos'
import { listarContatos } from './contatos';

export default function Componente9(){
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