import DataTable from "react-data-table-component";
import { obterFornecedor } from "../fornecedores/fornecedores";
import {useContext, useEffect, useState} from "react";
import { listarProdutos, obterProduto } from "../produtos/produtos";
import {
  CardContent, DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import {obterUsuario} from "../../infra/usuario.jsx";
import {UserContext} from "../../App.jsx";
import {excluirRequisicao} from "./requisicoes.jsx";
import Button from "@mui/material/Button";
import {listarCotacoes} from "../cotacoes/cotacoes.jsx";
import {listarContatos} from "../contatos/contatos.jsx";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {CSVLink} from "react-csv";

export default function ListaRequisicoes({ requisicoes = [], setIdEmEdicao }) {
  const [novasRequisicoes, setNovasRequisicoes] = useState([]);
  const {usuario} = useContext(UserContext);
  const [openCotacoes, setOpenCotacoes] = useState(false);
  const [cotacoes, setCotacoes] = useState([]);
  const [requisicao, setRequisicao] = useState({});




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
      sortable: true,
    },
    {
      name: "Descrição",
      selector: (row) => row.descricao,
    },
    {
      name: "Estado",
      selector: (row) => row.status,
    }, {
      name: "Cotações",
      selector: (row) => (`${row.cotacoes}/3`),
    },
    {
      name: "",
      minWidth: "320px",
      selector: (row) => (
          <div>
            {row.cotacoes > 0 ?
                <Button variant={"contained"} color={"success"} onClick={() => handleClickOpenCotacoes(row)}>Mostrar
                  cotações</Button> : ""}
            <Button
                variant="contained"
                size="medium"
                type="submit"
                color="error"
                onClick={() => handleExcluir(row.id)}
            >
              Excluir
            </Button>
          </div>
      )
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

  async function handleExcluir(id) {
    setIdEmEdicao(id);
    await excluirRequisicao(id);
    setIdEmEdicao("");
  }

  const handleClickOpenCotacoes = async (req) => {
    setRequisicao(req);
    let listaCotacao = await listarCotacoes();
    listaCotacao = listaCotacao.filter(c => c.requisicao == req.id);
    const cotacoesAtualizadas = await Promise.all(
        listaCotacao.map(async (cotacao) => {
          let cotacaoNova = {...cotacao};
          if (cotacao.fornecedor) {
            const fornecedorObtido = await obterFornecedor(cotacao.fornecedor);
            console.log(fornecedorObtido);
            cotacaoNova = {
              ...cotacaoNova,
              nomeFornecedor: fornecedorObtido.nome,
              localFornecedor: fornecedorObtido.local,
            };
            let listaContatos = await listarContatos();

            listaContatos = listaContatos.filter(c => {
              console.log(c.fornecedor);
              console.log(fornecedorObtido.id);
              return c.fornecedor == fornecedorObtido.id
            });
            cotacaoNova = {
              ...cotacaoNova,
              contatos: listaContatos,
            };
          }
          console.log(cotacaoNova);
          return cotacaoNova;
        })
    );
    setCotacoes(cotacoesAtualizadas);
    setOpenCotacoes(true);
  };

  const handleCloseCotacoes = () => {
    setRequisicao("");
    setCotacoes([]);
    setOpenCotacoes(false);
  };

  const requisicoesParaCsv =() =>{
    let arr= [];
    const cabecalho = ["Colaborador","Produto","Horario","Descrição","Estado","Cotações"]
    arr.push(cabecalho);
    let linhas = [];
    novasRequisicoes.forEach(req =>{
      let arrReq = [req.nomeColaborador, req.nomeProduto, req.dataHora, req.descricao, req.status, `${req.cotacoes}/3`];
      linhas.push(arrReq);
    })
    linhas.forEach(li => arr.push(li));
    console.log(arr);
    return arr;
  }

  return (
    <>
      <Button variant={"contained"} color={"warning"}>
        <CSVLink data={requisicoesParaCsv()} >Download CSV</CSVLink>
      </Button>

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
        defaultSortFieldId={3}
        defaultSortAsc={false}
      />

      <Dialog
          open={openCotacoes}
          onClose={handleCloseCotacoes}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Cotações"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Requisiçao do produto ${requisicao.nomeProduto} `}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            {`descrição: ${requisicao.descricao}`}
          </DialogContentText>
          <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
            {cotacoes.map(c => (
                <CardContent key={c.id}
                             sx={{
                               boxShadow: "0px 1px 1px",
                               borderRadius: "7px",
                             }}>
                  <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14}}>
                    Fornecedor:
                  </Typography>
                  <Typography variant="h5" component="div">
                    {`${c.nomeFornecedor}`}
                  </Typography>
                  <Typography variant="body2">
                    {`Local: ${c.localFornecedor}`}
                  </Typography>
                  <Typography variant="body2">
                    {`Preço: R$ ${c.preco}`}
                  </Typography><Typography variant="body2">
                  {c.contatos.length > 0? "Contatos:" : ""}
                </Typography>
                  <ul>
                    {c.contatos.map(cont => (
                        <li key={cont.id}>
                          <Typography variant="body2">
                            {`Nome: ${cont.nome}`}
                          </Typography>
                          <Typography variant="body2">
                            {`Email: ${cont.email}`}
                          </Typography>
                          <Typography variant="body2">
                            {`Telefone: ${cont.fone}`}
                          </Typography>
                        </li>
                    ))}
                  </ul>
                </CardContent>
            ))}
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCotacoes} autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
