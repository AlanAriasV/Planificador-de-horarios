import { useList } from 'react-firebase-hooks/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import database, { ref } from './database';
import auth from './authentication';

export const Asignaturas = () => {
  const [asignaturas, loadingAsignaturas, errorAsignaturas] = useList(
    ref(database.database, 'Asignaturas')
  );

  return { asignaturas, loadingAsignaturas, errorAsignaturas };
};

export const Departamentos = () => {
  const [departamentos, loadingDepartamentos, errorDepartamentos] = useList(
    ref(database.database, 'Departamentos')
  );

  return { departamentos, loadingDepartamentos, errorDepartamentos };
};

export const Docentes = () => {
  const [docentes, loadingDocentes, errorDocentes] = useList(
    ref(database.database, 'Docentes')
  );

  return { docentes, loadingDocentes, errorDocentes };
};
export const Estudiantes = () => {
  const [estudiantes, loadingEstudiantes, errorEstudiantes] = useList(
    ref(database.database, 'Estudiantes')
  );

  return { estudiantes, loadingEstudiantes, errorEstudiantes };
};

export const Carreras = () => {
  const [carreras, loadingCarreras, errorCarreras] = useList(
    ref(database.database, 'Carreras')
  );

  return { carreras, loadingCarreras, errorCarreras };
};

export const User = () => {
  const [user, loadingUser, errorUser] = useAuthState(auth.auth);

  return { user, loadingUser, errorUser };
};
