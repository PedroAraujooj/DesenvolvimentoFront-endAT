import DataTable from "react-data-table-component";
import { obterFornecedor } from "../fornecedores/fornecedores";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function ListaCotacoes({ cotacoes = [], setIdEmEdicao }) {
  const [novasCotacoes, setNovasCotacoes] = useState([]);

  useEffect(() => {
    trataCotacoes();
  }, [cotacoes]);

  useEffect(() => {
    console.log(novasCotacoes);
  }, [novasCotacoes]);

  const colunas = [
    {
      name: "Requisição",
      selector: (row) => row.requisicao,
    },
    {
      name: "Preço",
      selector: (row) => `R$ ${row.preco}`,
      sortable: true,
    },
    {
      name: "Fornecedor",
      selector: (row) => row.nomeFornecedor,
    },
  ];

  const opcoes = {
    rowsPerPageText: "Linhas por página:",
    rangeSeparatorText: "de",
  };

  async function trataCotacoes() {
    const cotacoesAtualizadas = await Promise.all(
      cotacoes.map(async (cotacao) => {
        let cotacaoNova = { ...cotacao };
        if (cotacao.fornecedor) {
          const nomeFornecedor = await obterFornecedor(cotacao.fornecedor);
          cotacaoNova = {
            ...cotacaoNova,
            nomeFornecedor: nomeFornecedor.nome,
          };
        }
        return cotacaoNova;
      })
    );
    setNovasCotacoes(cotacoesAtualizadas);
    return cotacoesAtualizadas;
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
        data={novasCotacoes}
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
