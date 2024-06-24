import { useForm } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { regexEmail, regexNumerico } from "../../util/regex";
import {
  alterarContato,
  excluirContato,
  inserirContato,
  listarContatos,
  obterContato,
} from "./contatos";
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

export default function FormContato({ idEmEdicao, setIdEmEdicao }) {
  const [fornecedores, setFornecedores] = useState([]);

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
      if (idEmEdicao && !isSubmitted) {
        const contato = await obterContato(idEmEdicao);
        setValue("nome", contato.nome);
        setValue("email", contato.email);
        setValue("fone", contato.fone);
        setValue("fornecedor", contato.fornecedor);
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

  async function submeterDados(dados) {
    if (idEmEdicao) {
      await alterarContato({ ...dados, id: idEmEdicao });
      setIdEmEdicao("");
    } else {
      let id = await inserirContato(dados);
      setIdEmEdicao(id);
    }
  }

  async function handleExcluir() {
    await excluirContato(idEmEdicao);
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
            sx={{
              marginBottom: "7px",
            }}
            id="nome"
            label="Nome"
            InputLabelProps={{
              shrink: true,
            }}
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
            id="email"
            label="Email"
            variant="outlined"
            {...register("email", {
              required: "Email é obrigatório",
              validate: {
                minLength: (value) =>
                  value.length >= 5 ||
                  "Email tem que ter pelo menos 5 caracteres",
                maxLength: (value) =>
                  value.length <= 30 || "Email só pode ter até 30 caracteres",
                matchPattern: (value) =>
                  regexEmail.test(value) || "Email inválido",
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />
          <br />
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              marginBottom: "7px",
            }}
            id="fone"
            label="Telefone"
            variant="outlined"
            {...register("fone", {
              required: "Telefone é obrigatório",
              validate: {
                minLength: (value) =>
                  value.length >= 8 ||
                  "Telefone tem que ter pelo menos 8 dígitos",
                matchPattern: (value) =>
                  regexNumerico.test(value) || "Telefone tem que ser numérico",
              },
            })}
            error={!!errors.fone}
            helperText={errors.fone ? errors.fone.message : ""}
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
