import { useState, useContext } from "react";
import { CarreraContext } from "../contexts/CarreraContext";

import { AiOutlineUser, AiOutlineLock } from "react-icons/ai"

import "../css/SignIn.css";
import auth from "../firebase/authentication";
import { Navigate } from "react-router-dom";

export function SignIn() {

  const { docentes, estudiantes, user, loadingUser, userData, setUserData } = useContext(CarreraContext)


  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('')

  const handleInputRut = (event) => {
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

  const handleInputPassword = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmitForm = (event) => {
    event.preventDefault();

    if (rut.length < 11) return console.log('rut malo')

    const id = rut.replaceAll('.', '').split('-')[0];
    var data = undefined;

    searchDocente:
    for (const docente of docentes) {
      if (docente.key === id) {
        data = docente
        // setUserData(docente)
        break searchDocente;
      }
    }
    if (!data) {
      searchEstudiante:
      for (const estudiante of estudiantes) {
        if (estudiante.key === id) {
          data = estudiante
          // setUserData(estudiante)
          break searchEstudiante;
        }
      }
    }

    // console.log(data)
    if (data) {
      const email = data.val()['correo'];
      auth.login({ email: email, password: password }).then((_) => {
        // setIdJC(parseInt(id));
        setUserData(data);
        // console.log(docente);
        // for (const docente ) {
        // 
        // }

      }).catch((error) => {
        console.log(error.code);
      });
    }
  }


  return (
    <>
      {loadingUser && (<></>)}
      {!loadingUser && (
        <>
          {!user && (
            <>
              <main className="main-signin">
                <div className="content-signin">
                  <div className="image-container">
                    <img src="src\assets\uta.jpeg" />
                  </div>
                  <form className="form-signin" >
                    <h1 className="title-signin">Iniciar Sesión</h1>
                    <div className="input-container">
                      <AiOutlineUser className="icon-rut" />
                      <input type="text" value={rut} onChange={handleInputRut} placeholder="Rut" maxLength="12" required={true} />
                    </div>
                    <div className="input-container">
                      <AiOutlineLock className="icon-pswd" />
                      <input type="password" value={password} onChange={handleInputPassword} placeholder="Contraseña" required={true} />
                    </div>
                    <button className="btn-signin" onClick={handleSubmitForm} >Entrar</button>
                  </form>
                </div>
              </main>
            </>
          )}
          {
            user && (
              <Navigate to="/" replace={true} />
            )
          }
        </>
      )}
    </>
  );
};
