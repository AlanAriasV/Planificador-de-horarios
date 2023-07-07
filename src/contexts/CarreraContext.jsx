import { createContext, useState } from 'react';
import {
  Asignaturas,
  Carreras,
  Docentes,
  Estudiantes,
  User,
} from '../firebase/controller';
import { useEffect } from 'react';

export const CarreraContext = createContext();

export const CarreraProvider = ({ children }) => {
  const [selectedCarreraID, setSelectedCarreraID] = useState('');
  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedCarreraCursos, setSelectedCarreraCursos] = useState('');
  const [selectedCarreraYear, setSelectedCarreraYear] = useState();
  const [selectedPeriodo, setSelectedPeriodo] = useState();
  const [selectedJornada, setSelectedJornada] = useState(undefined);
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  const [userData, setUserData] = useState();

  const { user, loadingUser } = User();

  const { docentes, loadingDocentes } = Docentes();
  const { estudiantes, loadingEstudiantes } = Estudiantes();

  const { carreras, loadingCarreras } = Carreras();

  const { asignaturas, loadingAsignaturas } = Asignaturas();

  const [listCarreras, setListCarreras] = useState([]);

  useEffect(() => {
    try {
      document.getElementById('year').value = 'default';
      document.getElementById('jornada').value = 'default';
      setSelectedCarreraYear(undefined);
      setSelectedJornada(undefined);
    } catch (error) {}
    return;
  }, [selectedPlan]);

  useEffect(() => {
    const tempListCarreras = [];

    if (userData && userData.type === 'jefe de carrera') {
      for (const carrera of carreras) {
        const val = carrera.val();
        if (val['jefe de carrera'] === userData.user.key) {
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
            setUserData({ user: docente, type: docente.val().cargos['0'] });
            return;
          }
        }
        for (const estudiante of estudiantes) {
          const val = estudiante.val();
          if (val['correo'] === email) {
            setUserData({ user: estudiante, type: 'estudiante' });
            return;
          }
        }
      }
    }
  }, [user, docentes, estudiantes]);

  useEffect(() => {
    listCarreras.forEach(carrera => {
      if (carrera.key == selectedCarreraID) {
        setSelectedCarrera(carrera);
        return null;
      }
    });
  }, [selectedCarreraID]);

  return (
    <CarreraContext.Provider
      value={{
        selectedCarrera,
        selectedCarreraCursos,
        selectedCarreraID,
        selectedPlan,
        selectedSemestre,
        selectedPeriodo,
        setSelectedCarrera,
        setSelectedCarreraCursos,
        setSelectedCarreraID,
        setSelectedPlan,
        setSelectedSemestre,
        setSelectedPeriodo,
        selectedCarreraYear,
        setSelectedCarreraYear,
        selectedJornada,
        setSelectedJornada,
        asignaturas,
        loadingAsignaturas,
        carreras,
        listCarreras,
        loadingCarreras,
        docentes,
        loadingDocentes,
        estudiantes,
        loadingEstudiantes,
        // laboratorios,
        // loadingLaboratorios,
        user,
        loadingUser,
        userData,
        setUserData,
      }}>
      {children}
    </CarreraContext.Provider>
  );
};
