import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import { auth } from "./firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase"


export async function logarUsuario(email, senha) {
    let retorno = {};
    await signInWithEmailAndPassword(auth, email, senha)
      .then((credenciais) => {
        retorno.id = credenciais.user.uid;
        retorno.email = email;
        retorno.senha = senha;
      })
      .catch((erro) => {
        retorno.erro = "Login invalido";
      });
    if(!retorno.erro){
        let usuarioModel = await obterUsuario(retorno.id);
        if(!usuarioModel?.id){
            await inserirUsuarios({...retorno, isADM: false}, retorno.id);
        }
        retorno = await obterUsuario(retorno.id);
    }
    if(!retorno.isAtivo){
        return {erro: "Usuario bloqueado"};
    }
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
              retorno.id = credenciais.user.uid;
              retorno.email = email;
              retorno.senha = senha;
          })
          .catch((error) => {
              retorno.erro = "Erro ao criar conta";
          });
      await inserirUsuarios({...retorno, isADM: false, isAtivo: true}, retorno.id)

      return retorno;
  }

  /////db///////

export async function inserirUsuarios(novoUsuario,id) {
    const docRef = doc(db, "usuarios", id);
    await setDoc(docRef, novoUsuario)
    //const docRef = await addDoc(collection(db, "usuarios"), novoUsuario);
    return docRef.id;
}

export async function listarUsuarios() {
    let retorno;
    await getDocs(collection(db, "usuarios"))
        .then((querySnapshot) => {
            retorno = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        });
    return retorno;
}

export async function obterUsuario(id) {
    const docRef = doc(db, "usuarios", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export async function excluirUsuario(id) {
    await deleteDoc(doc(db, "usuarios", id));
}

export async function alterarUsuario(usuario) {
    await setDoc(doc(db, "usuarios", usuario.id), usuario);

}
  