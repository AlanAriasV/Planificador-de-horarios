import { Courses, Careers } from "../firebase/Data";
import { createContext, useState } from 'react';
import { Carreras } from "../firebase/controller";
import { useEffect } from "react";

export const CarreraContext = createContext();

export const CarreraProvider = ({ children }) => {

  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [selectedCarreraCursos, setSelectedCarreraCursos] = useState('');
  const [selectedCarreraID, setSelectedCarreraID] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  const [user, setUser] = useState({ id: 11111111 });

  const { listCarrerasJC, loadingCarreras, errorCarreras } = Carreras(user.id);


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
        listCarrerasJC,
        loadingCarreras
      }}
    >
      {children}
    </CarreraContext.Provider>
  );
};
