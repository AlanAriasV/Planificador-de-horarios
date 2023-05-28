import { useState } from "react";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai"
import "../css/SignIn.css";

export function RutInput() {
  const [rut, setRut] = useState('');

  const handleInputChange = (event) => {
    const rawRut = event.target.value.replace(/[^0-9kK]/g, ''); // Elimina todos los caracteres no numéricos, excepto 'k' o 'K'

    let formattedRut = '';
    if (rawRut.length <= 1) {
      formattedRut = rawRut;
    } else if (rawRut.length <= 4) {
      formattedRut = `${rawRut.slice(0, 1)}.${rawRut.slice(1)}`;
    } else if (rawRut.length <= 7) {
      formattedRut = `${rawRut.slice(0, 1)}.${rawRut.slice(1, 4)}.${rawRut.slice(4)}`;
    } else if (rawRut.length <= 8) {
      formattedRut = `${rawRut.slice(0, 1)}.${rawRut.slice(1, 4)}.${rawRut.slice(4, 7)}-${rawRut.slice(7)}`;
    } else if (rawRut.length <= 9) {
      formattedRut = `${rawRut.slice(0, 2)}.${rawRut.slice(2, 5)}.${rawRut.slice(5, 8)}-${rawRut.slice(8)}`;
    }

    setRut(formattedRut);
  };

  return (
    <input type="text" value={rut} onChange={handleInputChange} placeholder="Rut" maxLength="12"/>
  );
};

export function SignIn() {
  return (
    <main className="main-signin">
      <div className="content-signin">
        <div class="image-container">
          <img src="src\assets\uta.jpeg"/>
        </div>
        <form className="form-signin">
          <h1 className="title-signin">Iniciar Sesión</h1>
          <div className="input-container">
            <AiOutlineUser className="icon-rut"/>
            <RutInput/>
          </div>
          <div className="input-container">
            <AiOutlineLock className="icon-pswd"/>
            <input type="password" name="pswd" placeholder="Contraseña" required=""/>
          </div>
          <button className="btn-signin">Entrar</button>
        </form>
      </div>
    </main>
  );
};
