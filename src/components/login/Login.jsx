import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { logarUsuario, deslogarUsuario } from "../../infra/usuario";
import { regexEmail } from "../../util/regex";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();

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
    let usuario = await logarUsuario(email, senha);
    if (usuario.id) {
      props.setUsuario(usuario);
      console.log(usuario);
      console.log(props.usuario);
      console.log(props.setUsuario);
      navigate("/")
    } else {
      alert(usuario.erro);
    }
  }

  async function handleClickLogout() {
    let retorno = await deslogarUsuario();
    props.setUsuario(retorno);
  }

  const telaLogin = (
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
            Login
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
          <Button variant="contained" size="medium" type="submit">
            Login
          </Button>
        </form>
      </Container>
    </div>
  );

  //   const TelaLogado = (
  //     <div>
  //       <CssBaseline />
  //       <Container
  //         maxWidth="sm"
  //         sx={{
  //           width: "25vw",
  //           minWidth: "320px",
  //           padding: "20px",
  //           boxShadow: "7px 7px 21px",
  //           borderRadius: "7px",
  //         }}
  //       >
  //         <form >
  //           <h2
  //             style={{
  //               textAlign: "left",
  //               fontWeight: "bold",
  //               fontSize: "200%",
  //             }}
  //           >
  //             Logado
  //           </h2>
  //           <Stack sx={{ width: "100%" }} spacing={2}>
  //             <Alert severity="success">
  //               Logado com sucesso como {props.usuario.email}.
  //             </Alert>
  //           </Stack>
  //           <br />

  //           <Button variant="contained" size="medium" onClick={handleClickLogout}>
  //             LogOut
  //           </Button>
  //         </form>
  //       </Container>
  //     </div>
  //   );
  //   return props.usuario.id ? TelaLogado : telaLogin;
  return telaLogin;
}
