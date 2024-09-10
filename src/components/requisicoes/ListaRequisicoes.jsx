import DataTable from "react-data-table-component";
import { obterFornecedor } from "../fornecedores/fornecedores";
import {useContext, useEffect, useState} from "react";
import { listarProdutos, obterProduto } from "../produtos/produtos";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {obterUsuario} from "../../infra/usuario.jsx";
import {UserContext} from "../../App.jsx";

export default function ListaRequisicoes({ requisicoes = [], setIdEmEdicao }) {
  const [novasRequisicoes, setNovasRequisicoes] = useState([]);
  const {usuario} = useContext(UserContext);


  useEffect(() => {
    trataRequisicoes();
  }, [requisicoes]);

  useEffect(() => {
    console.log(novasRequisicoes);
  }, [novasRequisicoes]);

  const colunas = [
    {
      name: "Colaborador",
      selector: (row) => row.nomeColaborador,
    },
    {
      name: "Produto",
      selector: (row) => row.nomeProduto,
      sortable: true,
    },
    {
      name: "Horario",
      selector: (row) => row.dataHora,
    },
  ];

  const opcoes = {
    rowsPerPageText: "Linhas por página:",
    rangeSeparatorText: "de",
  };

  async function trataRequisicoes() {
    const requisicoesFiltradas = requisicoes.filter(req => {
      console.log(req.colaborador);
      console.log(usuario.id);
      return usuario.id == req.colaborador;
    });
    const requisicoesAtualizadas = await Promise.all(
        requisicoesFiltradas.map(async (requisicao) => {
        let requisicaoNova = { ...requisicao };
        if (requisicao.colaborador) {
          const nomeColaborador = await obterUsuario(requisicao.colaborador);
          console.log(nomeColaborador);
          requisicaoNova = {
            ...requisicaoNova,
            nomeColaborador: nomeColaborador.email,
          };
        }
        if (requisicao.produto) {
          const nomeProduto = await obterProduto(requisicao.produto);
          requisicaoNova = { ...requisicaoNova, nomeProduto: nomeProduto.nome };
        }
        return requisicaoNova;
      })
    );
    setNovasRequisicoes(requisicoesAtualizadas);
    return requisicoesAtualizadas;
  }

  function handleChange({ selectedRows }) {
    const id = selectedRows[0]?.id;
    console.log(id);
    if (id) {
      setIdEmEdicao(id);
    } else {
      setIdEmEdicao("");
    }
  }

  return (
    <>
      <DataTable
        columns={colunas}
        data={novasRequisicoes}
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
    </>
  );
}
