import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import {alterarUsuario, criarConta, obterUsuario} from "../../infra/usuario";
import { regexEmail } from "../../util/regex";
import { useNavigate } from "react-router-dom";
import { cepIsValido } from "../../infra/cep";
import {useContext} from "react";
import {UserContext} from "../../App.jsx";

export default function CriarContaADM(props) {
  const navigate = useNavigate();
  const {usuario, setUsuario} = useContext(UserContext);

  if(!usuario.id){
    navigate("/login");
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
  } = useForm();

  async function handleClick(data) {
    console.log(data);
    const email = data.email;
    const senha = data.senha;
    const confirma = data.confirma;
    const cep = data.cep;
    const cepValido = await cepIsValido(cep);
    if(!cepValido){
      alert(`CEP inválido!`)
    }
    else if (senha === confirma) {
      let usuario = await criarConta(email, senha);
      if (usuario.id) {
        usuario = await obterUsuario(usuario.id);
        usuario.isADM = true;
        await alterarUsuario(usuario);
        alert(`SUCESSO, conta ${usuario.email} criada`);
        navigate("/");
      } else {
        alert(`ERRO: ${usuario.erro}`);
      }
    }else{
      alert(`ERRO: senhas incompativeis`);

    }
  }

  const telaCriarConta = (
    <div
      style={{
        marginTop: "20vh",
      }}
    >
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          width: "25vw",
          minWidth: "320px",
          padding: "20px",
          boxShadow: "7px 7px 21px",
          borderRadius: "7px",
        }}
      >
        <form onSubmit={handleSubmit(handleClick)}>
          <h2
            style={{
              textAlign: "left",
              fontWeight: "bold",
              fontSize: "200%",
            }}
          >
            Criar Conta ADM
          </h2>
          <br />
          <TextField
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
          <br />
          <TextField
            id="cep"
            label="CEP"
            variant="outlined"
            {...register("cep", {
              required: "CEP é obrigatório",
            })}
            error={!!errors.cep}
            helperText={errors.cep ? errors.cep.message : ""}
          />
          <br />
          <br />
          <TextField
            id="senha"
            label="senha"
            type="password"
            autoComplete="current-password"
            {...register("senha", {
              required: "Senha é obrigatório",
            })}
            error={!!errors.senha}
            helperText={errors.senha ? errors.senha.message : ""}
          />
          <br />
          <br />
          <TextField
            id="confirma"
            label="confirma senha"
            type="password"
            autoComplete="current-password"
            {...register("confirma", {
              required: "Senha é obrigatório",
            })}
            error={!!errors.senha}
            helperText={errors.senha ? errors.senha.message : ""}
          />
          <br />
          <br />
          <Button variant="contained" size="medium" type="submit">
            Criar Conta
          </Button>
        </form>
      </Container>
    </div>
  );

  return telaCriarConta;
}
