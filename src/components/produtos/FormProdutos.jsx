import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button, Container, CssBaseline, TextField } from "@mui/material";
import {  alterarProduto, excluirProduto, inserirProduto, obterProduto } from "./produtos";


export default function FormProdutos({ idEmEdicao, setIdEmEdicao }) {
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
      if (idEmEdicao && !isSubmitted) {
        const produto = await obterProduto(idEmEdicao);
        setValue("nome", produto.nome);
        setValue("descricao", produto.descricao);
      } else {
        reset();
      }
    }

    fetchData();
  }, [idEmEdicao]);

  async function submeterDados(dados) {
    if (idEmEdicao) {
      await alterarProduto({ ...dados, id: idEmEdicao });
      setIdEmEdicao("");
    } else {
      let id = await inserirProduto(dados);
      setIdEmEdicao(id);
    }
  }

  async function handleExcluir() {
    console.log(idEmEdicao);
    await excluirProduto(idEmEdicao);
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
          boxShadow: "7px 7px 21px",
          borderRadius: "7px",
          marginBottom: "14px",
        }}
      >
        <form onSubmit={handleSubmit(submeterDados)}>
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              marginBottom: "7px",
            }}
            id="nome"
            label="Nome"
            {...register("nome", {
              required: "Nome é obrigatório",
            })}
            error={!!errors.nome}
            helperText={errors.nome ? errors.nome.message : ""}
          />
          <br />
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              marginBottom: "7px",
            }}
            id="descricao"
            label="descricao"
            variant="outlined"
            {...register("descricao", {
              required: "Descricao é obrigatória",
            })}
            error={!!errors.descricao}
            helperText={errors.descricao ? errors.descricao.message : ""}
          />
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
