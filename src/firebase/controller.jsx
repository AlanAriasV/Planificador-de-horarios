// import { useState } from 'react'
// import database, { child, get } from './database.jsx'

import { useList, useListVals } from 'react-firebase-hooks/database';
import database, { ref } from './database';


// export const Asignaturas = () => {

//     // database.refDatabase = 'Asignaturas';
//     // database.refDatabase = undefined;
//     // var asignaturas;
//     const [asignaturas, setAsignaturas] = useState();
//     const [error, setError] = useState()

//     get(child(database.refDatabase, 'Asignaturas')).then(
//         (snapshot) => {
//             if (snapshot.exists()) {
//                 // asignaturas = snapshot.val()
//                 setAsignaturas(snapshot.val());
//             }
//         }
//     ).catch((error) => {
//         console.error(error);
//         // setError()
//     });

//     // onValue(database.refDatabase, (snapshot) => {
//     // setAsignaturas(snapshot.val());
//     // console.log(asignaturas)
//     // }, { onlyOnce: true });
//     console.log(asignaturas)
//     return { asignaturas }
//     // return (<></>);
// }

export const Horario = () => {
}

export const Asignaturas = () => {
    // database.refDatabase = 'Asignaturas';
    // const refAsignaturas = database.refDatabase;
    const [listAsignaturas, loadingAsignaturas, errorAsignaturas] = useList(ref(database.database, 'Asignaturas'));
    return { listAsignaturas, loadingAsignaturas, errorAsignaturas }
}

export const Laboratorios = () => {
}

export const Docentes = () => {

}

export const Carreras = (jefe) => {

    const [listCarreras, loadingCarreras, errorCarreras] = useList(ref(database.database, 'Carreras'));

    var listCarrerasJC = []

    if (!loadingCarreras) {
        listCarreras.map((carrera) => {
            const val = carrera.val();
            if (val['jefe de carrera'] === jefe) {
                listCarrerasJC.push(carrera);
            }
        }
        );
    }

    return { listCarrerasJC, loadingCarreras, errorCarreras };
}

export const Login = () => {

}

// Carreras();