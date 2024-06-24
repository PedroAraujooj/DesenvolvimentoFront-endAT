import { useNavigate } from "react-router-dom";

export default function Home(props) {
    const navigate = useNavigate();

    if(!props.usuario.id){
        navigate("/login");
    }

  return (
    <div style={{
        margin: "15vh auto",
    }}>
      <h2
        style={{
          fontFamily: "arial",
          fontSize: "49px",
        }}
      >
        Bem vindo ao SisCompra da empresa ACME!
      </h2>
      <h2 style={{
          fontFamily: "arial",
        }}> Aqui nós os auxiliamos a achar a melhor cotação para o produto desejado! </h2>
      <h3 style={{
          fontFamily: "arial",
        }}>Use nossa barra de navegação para encontrar o que você procura</h3>
    </div>
  );
}
