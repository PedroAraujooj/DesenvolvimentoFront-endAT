import DataTable from "react-data-table-component";
import {listarFornecedores, obterFornecedor} from "../fornecedores/fornecedores";
import {useContext, useEffect, useState} from "react";
import {listarProdutos, obterProduto} from "../produtos/produtos";
import {
    CardContent,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControl,
    InputLabel,
    MenuItem,
    Select, Typography
} from "@mui/material";
import {obterUsuario} from "../../infra/usuario.jsx";
import {UserContext} from "../../App.jsx";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {inserirCotacao, listarCotacoes, obterCotacao} from "../cotacoes/cotacoes.jsx";
import {useForm} from "react-hook-form";
import {alterarRequisicao, obterRequisicao} from "./requisicoes.jsx";
import {listarContatos} from "../contatos/contatos.jsx";

export default function ListaRequisicoesADM({requisicoes = [], setIdEmEdicao}) {
    const [novasRequisicoes, setNovasRequisicoes] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [openCotacoes, setOpenCotacoes] = useState(false);
    const [requisicao, setRequisicao] = useState({});
    const [fornecedores, setFornecedores] = useState([]);
    const [cotacoes, setCotacoes] = useState([]);
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitted},
        reset,
        setValue,
    } = useForm();


    const handleClickOpenForm = (req) => {
        setRequisicao(req);
        setIdEmEdicao(req.id);
        setOpenForm(true);
    };

    const handleCloseForm = async (dados) => {
        try {
            let novaReq = await obterRequisicao(requisicao.id);
            console.log(dados);
            console.log(novaReq);
            if (novaReq.cotacoes === 3) {
                throw new Error("Já atingiu o limite maximo de cotação");
            }
            await inserirCotacao({...dados, requisicao: novaReq.id});
            await alterarRequisicao({
                ...novaReq,
                cotacoes: novaReq.cotacoes + 1,
                status: novaReq.cotacoes + 1 === 3 ? "cotada" : "em cotação"
            });
            setIdEmEdicao("");
            setRequisicao({});
            setOpenForm(false);
        } catch (errors) {
            console.log(errors);
            setOpenForm(false);
            alert("Erro na operação");
        }

    };

    const handleCancelar = () => {
        setOpenForm(false);
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

    const {usuario} = useContext(UserContext);


    useEffect(() => {
        async function recarregarLista() {
            await trataRequisicoes();
        }

        recarregarLista();
    }, [requisicoes]);

    useEffect(() => {
        console.log(novasRequisicoes);
    }, [novasRequisicoes]);

    useEffect(() => {
        async function fetchData() {
            carregarFornecedores();
        }

        fetchData();
    }, []);

    async function carregarFornecedores() {
        const listaRetornoObj = await listarFornecedores();
        setFornecedores(listaRetornoObj);
    }

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
            name: "Data Hora",
            selector: (row) => row.dataHora,
        }, {
            name: "Estado",
            selector: (row) => row.status,
        }, {
            name: "Cotações",
            selector: (row) => (`${row.cotacoes}/3`),
        },
        {
            name: "",
            minWidth: "310px",
            selector: (row) => (
                <div>
                    {row.cotacoes < 3 ?
                        <Button variant={"contained"} onClick={() => handleClickOpenForm(row)}>Cotar</Button> : ""}
                    {row.cotacoes > 0 ?
                        <Button variant={"contained"} color={"success"} onClick={() => handleClickOpenCotacoes(row)}>Mostrar
                            cotações</Button> : ""}
                </div>
            )
        },
        /*{
            name: "",
            selector:  (row) => (row.cotacoes < 3 ? <Button variant={"contained"} onClick={() => handleClickOpenForm(row)}>Cotar</Button>  : "")
        },
        {
            name: "",
            selector:  (row) => (row.cotacoes > 0 ? <Button variant={"contained"}  color={"success"}>Mostrar cotações</Button> : "")
        },*/
    ];

    const opcoes = {
        rowsPerPageText: "Linhas por página:",
        rangeSeparatorText: "de",
    };

    async function trataRequisicoes() {
        const requisicoesAtualizadas = await Promise.all(
            requisicoes.map(async (requisicao) => {
                let requisicaoNova = {...requisicao};
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
                    requisicaoNova = {...requisicaoNova, nomeProduto: nomeProduto.nome};
                }
                return requisicaoNova;
            })
        );
        setNovasRequisicoes(requisicoesAtualizadas);
        return requisicoesAtualizadas;
    }

    return (
        <>
            <DataTable
                columns={colunas}
                data={novasRequisicoes}
                pagination
                paginationPerPage={15}
                dense
                responsive
                striped
                paginationComponentOptions={opcoes}
                noDataComponent="Cadastro Vazio"
                defaultSortFieldId={3}
                defaultSortAsc={false}            />
            <Dialog
                open={openForm}
                onClose={handleCloseForm}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleCloseForm();
                    },
                }}
            >
                <DialogTitle>Cotar requisição {requisicao.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {console.log(requisicao)}
                        A requisição está {requisicao.status} com {requisicao.cotacoes} cotações
                    </DialogContentText>
                    <br/>
                    <TextField
                        sx={{
                            marginBottom: "7px",
                        }}
                        id="preco"
                        label="preco"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        {...register("preco", {
                            required: "Preço é obrigatório",
                            validate: {
                                min: (value) =>
                                    value >= 0 || "Preço não pode ser negativo",
                            },
                        })}
                        error={!!errors.preco}
                        helperText={errors.preco ? errors.preco.message : ""}
                    />
                    <br/>
                    <FormControl sx={{width: "223px", marginBottom: "14px", paddingTop: "4px"}}>
                        <InputLabel id="fornecedor-label" shrink={true}>
                            Fornecedor
                        </InputLabel>
                        <Select
                            labelId="fornecedor-label"
                            id="fornecedor"
                            label="Fornecedor"
                            {...register("fornecedor", {
                                required: "fornecedor é obrigatório",
                            })}
                        >
                            {fornecedores.map((fornecedor) => (
                                <MenuItem key={fornecedor.id} value={fornecedor.id}>
                                    {fornecedor.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br/>
                    <br/>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant={"contained"} onClick={handleSubmit(handleCloseForm)}>Cotar</Button>
                    <Button onClick={handleCancelar} variant={"contained"} color={"error"}>Cancelar</Button>
                </DialogActions>
            </Dialog>
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
