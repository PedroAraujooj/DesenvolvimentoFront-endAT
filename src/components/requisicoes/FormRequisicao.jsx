import { useForm } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useContext, useEffect, useState} from "react";
import {
  Button,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { listarProdutos } from "../produtos/produtos";
import { alterarRequisicao, excluirRequisicao, inserirRequisicao, obterRequisicao } from "./requisicoes";
import {UserContext} from "../../App.jsx";

export default function FormRequisicao({ idEmEdicao, setIdEmEdicao }) {
  const {usuario} = useContext(UserContext);
  const [produtos, setProdutos] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    async function fetchData() {
      //Testa se o idEmEdicao está preenchido e veio da lista de contatos
      //Não foi pelo inserir
      carregarProdutos();
      if (idEmEdicao && !isSubmitted) {
        const requisicao = await obterRequisicao(idEmEdicao);
        setValue("produto", requisicao.fornecedor);
      } else {
        reset();
      }
    }
    console.log(usuario);
    fetchData();
  }, [idEmEdicao]);

  async function carregarProdutos() {
    const listaRetornoObj = await listarProdutos();
    const listaRetorno = listaRetornoObj;
    setProdutos(listaRetorno);
  }

  async function submeterDados(dados) {
    //if (idEmEdicao) {
    //  await alterarRequisicao({ ...dados, id: idEmEdicao});
    //  setIdEmEdicao("");
   // } else {
      let id = await inserirRequisicao({ ...dados, colaborador: usuario.id, dataHora: new Date().toLocaleString(),
      status: "aberta", cotacoes: "0/3"});
      setIdEmEdicao(id);
    //}
  }

  async function handleExcluir() {
    await excluirRequisicao(idEmEdicao);
    setIdEmEdicao("");
  }

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          width: "35vw",
          minWidth: "320px",
          padding: "20px",
          boxShadow: "7px 2px 14px",
          borderRadius: "7px",
          marginBottom: "14px",
        }}
      >
        <form onSubmit={handleSubmit(submeterDados)}>
          <FormControl sx={{ width: "223px", marginBottom: "14px", paddingTop: "4px" }}>
            <InputLabel id="produto-label" shrink={true}>
              Produto
            </InputLabel>
            <Select
              labelId="produto-label"
              id="produto"
              label="Produto"
              {...register("produto", {
                required: "Produto é obrigatório",
              })}
            >
              {produtos.map((produto) => (
                <MenuItem key={produto.id} value={produto.id}>
                  {produto.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <Button variant="contained" size="medium" type="submit">
            Salvar
          </Button>
          <Button
            variant="contained"
            size="medium"
            type="submit"
            color="error"
            onClick={handleExcluir}
          >
            Excluir
          </Button>
        </form>
      </Container>
      {/* <div className="errorsContainer">
        {errors.nome?.message && <div>{errors.nome.message}</div>}
        {errors.email?.message && <div>{errors.email.message}</div>}
        {errors.fone?.message && <div>{errors.fone.message}</div>}
      </div> */}
    </>
  );
}
