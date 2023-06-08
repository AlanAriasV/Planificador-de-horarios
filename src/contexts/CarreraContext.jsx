import { Courses, Careers } from "../firebase/Data";
import { createContext, useState } from 'react';

export const CarreraContext = createContext();

export const CarreraProvider = ({ children }) => {
  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [selectedCarreraCursos, setSelectedCarreraCursos] = useState('');
  const [selectedCarreraID, setSelectedCarreraID] = useState('');

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
        setCarreraById
      }}
    >
      {children}
    </CarreraContext.Provider>
  );
};
