import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button, Container, CssBaseline, TextField } from "@mui/material";
import {
  alterarFornecedor,
  excluirFornecedor,
  inserirFornecedores,
  obterFornecedor,
} from "./fornecedores";

export default function FormFornecedores({ idEmEdicao, setIdEmEdicao }) {
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
        const fornecedor = await obterFornecedor(idEmEdicao);
        setValue("nome", fornecedor.nome);
        setValue("local", fornecedor.local);
      } else {
        reset();
      }
    }

    fetchData();
  }, [idEmEdicao]);

  async function submeterDados(dados) {
    if (idEmEdicao) {
      await alterarFornecedor({ ...dados, id: idEmEdicao });
      setIdEmEdicao("");
    } else {
      let id = await inserirFornecedores(dados);
      setIdEmEdicao(id);
    }
  }

  async function handleExcluir() {
    console.log(idEmEdicao);
    await excluirFornecedor(idEmEdicao);
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
              validate: {
                minLength: (value) =>
                  value.length >= 5 ||
                  "Nome tem que ter pelo menos 5 caracteres",
                maxLength: (value) =>
                  value.length <= 50 || "Nome só pode ter até 50 caracteres",
              },
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
            id="local"
            label="Local"
            variant="outlined"
            {...register("local", {
              required: "Local é obrigatório",
            })}
            error={!!errors.local}
            helperText={errors.local ? errors.local.message : ""}
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
