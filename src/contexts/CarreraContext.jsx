import { createContext, useState } from 'react';
import { Carreras, Docentes, Estudiantes, User } from "../firebase/controller";
import { useEffect } from "react";

export const CarreraContext = createContext();

export const CarreraProvider = ({ children }) => {

  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [selectedCarreraCursos, setSelectedCarreraCursos] = useState('');
  const [selectedCarreraID, setSelectedCarreraID] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  const [userData, setUserData] = useState();
  const { user, loadingUser, errorUser } = User();
  const { docentes, loadingDocentes, errorDocentes } = Docentes();
  const { estudiantes, loadingEstudiantes, errorEstudiantes } = Estudiantes();
  const { carreras, loadingCarreras, errorCarreras } = Carreras();

  const [listCarreras, setListCarreras] = useState([])

  useEffect(() => {

    const tempListCarreras = [];

    if (userData) {
      for (const carrera of carreras) {
        const val = carrera.val();
        if (val['jefe de carrera'] === userData.key) {
          tempListCarreras.push(carrera);
        }

      }
    }

    setListCarreras(tempListCarreras);

  }, [userData, carreras]);

  useEffect(() => {

    if (!loadingUser && !loadingDocentes) {
      if (user) {
        const email = user.email;
        for (const docente of docentes) {
          const val = docente.val();
          if (val['correo'] === email) {
            setUserData(docente);
            // setIdJC(parseInt(docente.key));
            return
          }
        }
        for (const estudiante of estudiantes) {
          const val = estudiante.val();
          if (val['correo'] === email) {
            setUserData(estudiante);
            // setIdJC(parseInt(docente.key));
            return
          }
        }
      }
    }

  }, [user, docentes, estudiantes]);

  useEffect(() => {
    listCarreras.forEach(carrera => {
      if (carrera.key == selectedCarreraID) {
        setSelectedCarrera(carrera);
        return null
      }
    });
  }, [selectedCarreraID]);

  return (
    <CarreraContext.Provider
      value={{
        selectedCarreraID,
        setSelectedCarreraID,
        selectedCarrera,
        selectedSemestre,
        selectedPlan,
        setSelectedPlan,
        setSelectedCarrera,
        setSelectedSemestre,
        selectedCarreraCursos,
        listCarreras,
        loadingCarreras,
        docentes,
        loadingDocentes,
        estudiantes,
        loadingEstudiantes,
        user,
        loadingUser,
        userData,
        setUserData
      }}
    >
      {children}
    </CarreraContext.Provider>
  );
};
