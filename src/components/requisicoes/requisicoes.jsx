
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../infra/firebase"

export async function inserirRequisicao(novaRequisicao) {
    const docRef = await addDoc(collection(db, "requisicoes"), novaRequisicao);
    return docRef.id;
}

export async function listarRequisicoes() {
    let retorno;
    await getDocs(collection(db, "requisicoes"))
        .then((querySnapshot) => {
            retorno = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        });
    return retorno;
}

export async function obterRequisicao(id) {
    const docRef = doc(db, "requisicoes", id);
    const docSnap = await getDoc(docRef);
    return {...docSnap.data(), id: docRef.id};
}

export async function excluirRequisicao(id) {
    await deleteDoc(doc(db, "requisicoes", id));
}

export async function alterarRequisicao(requisicao) {
    await setDoc(doc(db, "requisicoes", requisicao.id), requisicao);
}