// import CriarConta from "./CriarConta";
import Login from "./Login";
// import Logout from "./Logout";

export default function BarraLogin({usuario, setUsuario}) {

    if (usuario) {
        return <Login usuario={usuario}  setUsuario={setUsuario}/>
    } else {
        return ( 
            <div>
                <Login usuario={usuario}  setUsuario={setUsuario}/>
                {/* <CriarConta setUsuario={setUsuario}/> */}
            </div>
);
    }
}