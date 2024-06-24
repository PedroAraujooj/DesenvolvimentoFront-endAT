import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import { auth } from "./firebase";
  
  export async function logarUsuario(email, senha) {
    let retorno = {};
    console.log(`${email}, ${senha}`);
    await signInWithEmailAndPassword(auth, email, senha)
      .then((credenciais) => {
        console.log(credenciais);
        retorno.id = credenciais.user.uid;
        retorno.email = email;
        retorno.senha = senha;
      })
      .catch((erro) => {
        console.log(erro.message);
        retorno.erro = "Login invalido";
      });
  
    return retorno;
  }
  
  export async function deslogarUsuario(){
      await signOut(auth);
      return {id:"", email:"", senha:""};
  }
  
  export async function criarConta(email, senha) {
      let retorno = {};
      await createUserWithEmailAndPassword(auth, email, senha)
          .then((credenciais) => {
              console.log(credenciais);
              retorno.id = credenciais.user.uid;
              retorno.email = email;
              retorno.senha = senha;
          })
          .catch((error) => {
              console.log(`${error.code} = ${error.message}`);
              retorno.erro = "Erro ao criar conta";
          });
      return retorno;
  }
  