import { useList } from 'react-firebase-hooks/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import database, { ref } from './database';
import auth from './authentication';

export const Horario = () => {
}

export const Asignaturas = () => {
    // database.refDatabase = 'Asignaturas';
    // const refAsignaturas = database.refDatabase;
    const [asignaturas, loadingAsignaturas, error] = useList(ref(database.database, 'Asignaturas'));
    // console.log(loadingAsignaturas)
    return { asignaturas, loadingAsignaturas, error }
}

// Asignaturas()

export const Laboratorios = () => {
}

export const Docentes = () => {
    const [docentes, loadingDocentes, error] = useList(ref(database.database, 'Docentes'));

    return { docentes, loadingDocentes, error }
}

export const Carreras = () => {
    const [carreras, loadingCarreras, errorCarreras] = useList(ref(database.database, 'Carreras'));

    return { carreras, loadingCarreras, errorCarreras };
}

export const User = () => {

    const [user, loadingUser, error] = useAuthState(auth.auth);

    return { user, loadingUser, error }

}