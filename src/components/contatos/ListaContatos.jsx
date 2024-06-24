import DataTable from 'react-data-table-component';
import { obterFornecedor } from '../fornecedores/fornecedores';
import { useEffect, useState } from 'react';

export default function ListaContatos({ contatos = [], setIdEmEdicao }) {
    const [novosContatos, setNovosContatos] = useState([]);

    useEffect(() => {
        async function trataContatos() {
            const contatosAtualizados = await Promise.all(
                contatos.map(async (contato) => {
                    if(contato.fornecedor){
                        const nomeFornecedor = await obterFornecedor(contato.fornecedor);
                        return { ...contato, nomeFornecedor: nomeFornecedor.nome };  
                    }
                    else{
                        return { ...contato, nomeFornecedor: "" };
                    }
                    
                })
            );
            setNovosContatos(contatosAtualizados);
        }
        trataContatos();
    }, [contatos]);

    useEffect(() => {
        console.log(novosContatos);
    }, [novosContatos]);

    const colunas = [
        {
            name: 'Nome',
            selector: row => row.nome,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Telefone',
            selector: row => row.fone,
        },
        {
            name: 'Fornecedor',
            selector: row => row.nomeFornecedor,
        },
    ];

    const opcoes = { rowsPerPageText: 'Linhas por página:', rangeSeparatorText: 'de' };

    function handleChange({ selectedRows }) {
        const id = selectedRows[0]?.id;
        console.log(id);
        if(id) {
            setIdEmEdicao(id);
        } else {
            setIdEmEdicao("");
        }
    }

    return (
        <DataTable
            columns={colunas}
            data={novosContatos}
            pagination
            paginationPerPage={5}
            dense
            responsive
            striped
            paginationComponentOptions={opcoes}
            noDataComponent="Cadastro Vazio"
            defaultSortFieldId={1}
            selectableRows
            selectableRowsHighlight
            selectableRowsSingle
            onSelectedRowsChange={handleChange}
        />
    );
}
