export async function obterEndereco(cep){
    let retorno = {};
    const  url = `https://viacep.com.br/ws/${cep}/json/`;
    await fetch(url)
    .then((resposta) => resposta.json())
    .then((endereco) => {
        retorno = endereco;
        console.log(retorno);
    })
    .catch((erro) => {
        retorno.erro = erro;
        console.log(erro)
    });
    return retorno;
}

export async function cepIsValido(cep){
    let cepJson = await obterEndereco(cep);
    console.log(cepJson)
    if(cepJson.erro){
        return false;
    }
    return true;
}