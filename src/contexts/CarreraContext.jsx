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

  const [user, setUser] = useState({ id: 11111111 });

  // useEffect(() => {
  const { listCarrerasJC, loadingCarreras, errorCarreras } = Carreras(user.id);
  // if (user !== undefined) {
  //   console.log(listCarrerasJC)
  // }
  // });

  const setCarreraById = (carreraId) => {
    setSelectedCarreraID(carreraId);
    setSelectedCarreraCursos(Courses[carreraId].malla);
    setSelectedCarrera(Careers[carreraId]);
    setSelectedSemestre('');
  }

  return (
    <CarreraContext.Provider
      value={{
        selectedCarreraID,
        selectedCarrera,
        selectedSemestre,
        setSelectedCarrera,
        setSelectedSemestre,
        selectedCarreraCursos,
        setCarreraById,
        listCarrerasJC,
        loadingCarreras
      }}
    >
      {children}
    </CarreraContext.Provider>
  );
};
