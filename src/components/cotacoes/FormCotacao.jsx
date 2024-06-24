import { useForm } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { regexEmail, regexNumerico } from "../../util/regex";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { listarFornecedores } from "../fornecedores/fornecedores";
import { listarProdutos } from "../produtos/produtos";
import { alterarCotacao, excluirCotacao, inserirCotacao, obterCotacao } from "./cotacoes";

export default function FormCotacao({ idEmEdicao, setIdEmEdicao }) {
  const [fornecedores, setFornecedores] = useState([]);
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
      carregarFornecedores();
      carregarProdutos();
      if (idEmEdicao && !isSubmitted) {
        const cotacao = await obterCotacao(idEmEdicao);
        setValue("preco", cotacao.preco);
        setValue("fornecedor", cotacao.fornecedor);
        setValue("produto", cotacao.fornecedor);
      } else {
        reset();
      }
    }

    fetchData();
  }, [idEmEdicao]);

  async function carregarFornecedores() {
    const listaRetornoObj = await listarFornecedores();
    const listaRetorno = listaRetornoObj;
    setFornecedores(listaRetorno);
  }
  async function carregarProdutos() {
    const listaRetornoObj = await listarProdutos();
    const listaRetorno = listaRetornoObj;
    setProdutos(listaRetorno);
  }

  async function submeterDados(dados) {
    if (idEmEdicao) {
      await alterarCotacao({ ...dados, id: idEmEdicao });
      setIdEmEdicao("");
    } else {
      let id = await inserirCotacao(dados);
      setIdEmEdicao(id);
    }
  }

  async function handleExcluir() {
    await excluirCotacao(idEmEdicao);
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
                  value>=0 || "Preço não pode ser negativo",
              },
            })}
            error={!!errors.preco}
            helperText={errors.preco ? errors.preco.message : ""}
          />
          <br />
          <FormControl sx={{ width: "223px", marginBottom: "14px", paddingTop: "4px" }}>
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
          <br />
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
