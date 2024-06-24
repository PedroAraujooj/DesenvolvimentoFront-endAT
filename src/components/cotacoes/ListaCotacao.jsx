import DataTable from "react-data-table-component";
import { obterFornecedor } from "../fornecedores/fornecedores";
import { useEffect, useState } from "react";
import { listarProdutos, obterProduto } from "../produtos/produtos";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function ListaCotacoes({ cotacoes = [], setIdEmEdicao }) {
  const [novasCotacoes, setNovasCotacoes] = useState([]);
  const[produtos, setProdutos] = useState([]);

  useEffect(() => {
    carregarProdutos()
    trataCotacoes();
  }, [cotacoes]);

  useEffect(() => {
    console.log(novasCotacoes);
  }, [novasCotacoes]);

  const colunas = [
    {
      name: "Produto",
      selector: (row) => row.nomeProduto,
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

  async function carregarProdutos(){
    const listaProdutos = await listarProdutos();
    setProdutos(listaProdutos);
  }

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
        if (cotacao.produto) {
          const nomeProduto = await obterProduto(cotacao.produto);
          cotacaoNova = { ...cotacaoNova, nomeProduto: nomeProduto.nome };
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
  
  async function filtrarPorProduto(e) {
    const todasCotacoes = await trataCotacoes();
    setNovasCotacoes(todasCotacoes.filter((cotacoes) => e.target.value == cotacoes.produto))
    console.log(novasCotacoes);
  }

  return (
    <>
      <FormControl
        sx={{ width: "223px", marginBottom: "14px", paddingTop: "4px" }}
      >
        <InputLabel id="produto-label" shrink={true}>
           Filtrar por Produto
        </InputLabel>
        <Select 
          labelId="produto-label"
          id="produto"
          label="Filtrar por Produto"
          onChange={async(e) => await filtrarPorProduto(e)}
        >
          {produtos.map((produto) => (
            <MenuItem key={produto.id} value={produto.id}>
              {produto.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
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
