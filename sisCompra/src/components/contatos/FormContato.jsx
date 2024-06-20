import { useForm } from "react-hook-form"
import { regexEmail, regexNumerico } from "../../util/regex"
import { alterarContato, excluirContato, inserirContato, listarContatos, obterContato } from "./contatos";
import { useEffect } from "react";

export default function FormContato({ idEmEdicao, setIdEmEdicao }) {

    const { register, handleSubmit, formState: { errors, isSubmitted }, reset, setValue } = useForm();

    useEffect(() => {
        async function fetchData() {
            //Testa se o idEmEdicao está preenchido e veio da lista de contatos
            //Não foi pelo inserir
            if (idEmEdicao && !isSubmitted) {
                const contato = await obterContato(idEmEdicao);
                setValue("nome", contato.nome);
                setValue("email", contato.email);
                setValue("fone", contato.fone);
            } else {
                reset();
            }
        }

        fetchData();
    }, [idEmEdicao]);

    async function submeterDados(dados) {
        if(idEmEdicao) {
            await alterarContato({...dados, id: idEmEdicao});
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
            <div className="container">
                <form onSubmit={handleSubmit(submeterDados)}>
                    <label className="formLabel" htmlFor="nome">Nome</label>&nbsp;
                    <input size={50} {...register("nome", {
                        required: "Nome é obrigatório",
                        validate: {
                            minLength: (value) => value.length >= 5 || "Nome tem que ter pelo menos 5 caracteres",
                            maxLength: (value) => value.length <= 50 || "Nome só pode ter até 50 caracteres",
                        },
                    })} />
                    <br />
                    <label className="formLabel" htmlFor="email">Email</label>&nbsp;
                    <input size={30} {...register("email", {
                        required: "Email é obrigatório",
                        validate: {
                            minLength: (value) => value.length >= 5 || "Email tem que ter pelo menos 5 caracteres",
                            maxLength: (value) => value.length <= 30 || "Email só pode ter até 30 caracteres",
                            matchPattern: (value) => regexEmail.test(value) || "Email inválido",
                        },
                    })} />
                    <br />
                    <label className="formLabel" htmlFor="fone">Telefone</label>&nbsp;
                    <input size={14} {...register("fone", {
                        required: "Telefone é obrigatório",
                        validate: {
                            minLength: (value) => value.length >= 8 || "Telefone tem que ter pelo menos 8 dígitos",
                            matchPattern: (value) => regexNumerico.test(value) || "Telefone tem que ser numérico",
                        },
                    })} />
                    <br />
                    <input style={{ margin: "5px auto", display: "inline-block" }} type="submit" value="Salvar" />
                    <input style={{ margin: "5px auto", display: "inline-block" }} type="button" value="Excluir" onClick={handleExcluir} />
                </form>
            </div>
            <div className="errorsContainer">
                {errors.nome?.message && (
                    <div>{errors.nome.message}</div>
                )}
                {errors.email?.message && (
                    <div>{errors.email.message}</div>
                )}
                {errors.fone?.message && (
                    <div>{errors.fone.message}</div>
                )}
            </div>
        </>
    );
}