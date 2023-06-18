import { Courses, Careers } from "../firebase/Data";
import { createContext, useState } from 'react';
import { Carreras, Docentes, User } from "../firebase/controller";
import { useEffect } from "react";

export const CarreraContext = createContext();

export const CarreraProvider = ({ children }) => {

  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [selectedCarreraCursos, setSelectedCarreraCursos] = useState('');
  const [selectedCarreraID, setSelectedCarreraID] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  const [idJC, setIdJC] = useState(0);
  const { docentes, loadingDocentes, errorDocentes } = Docentes();
  const { user, loadingUser, errorUser } = User();
  const { carreras, loadingCarreras, errorCarreras } = Carreras();

<<<<<<< Updated upstream
  const { listCarrerasJC, loadingCarreras, errorCarreras } = Carreras(user.id);
=======
  const [listCarreras, setListCarreras] = useState([])

  useEffect(() => {

    var tempListCarreras = []

    for (const carrera of carreras) {
      const val = carrera.val();
      if (val['jefe de carrera'] === idJC) {
        tempListCarreras.push(carrera);
        return
      }

    }

    setListCarreras(tempListCarreras);

  }, [idJC, carreras]);

  useEffect(() => {

    if (!loadingUser && !loadingDocentes) {
      if (user) {
        const email = user.email;
        for (const docente of docentes) {
          const val = docente.val();
          if (val['correo'] === email) {
            setIdJC(parseInt(docente.key));
            return
          }
        }
      }
    }

  }, [user, docentes]);
>>>>>>> Stashed changes


  useEffect(() => {
    listCarrerasJC.forEach(carrera => {
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
<<<<<<< Updated upstream
        listCarrerasJC,
        loadingCarreras
=======
        setCarreraById,
        listCarreras,
        loadingCarreras,
        docentes,
        loadingDocentes,
        user,
        loadingUser,
        idJC,
        setIdJC
>>>>>>> Stashed changes
      }}
    >
      {children}
    </CarreraContext.Provider>
  );
};
