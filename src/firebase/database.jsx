import firebase from './firebase.jsx';
import { getDatabase, ref, set, update, get, child } from 'firebase/database';

class Database {
  #database;
  constructor() {
    this.#database = getDatabase(firebase.app);
  }

  get database() {
    return this.#database;
  }

  setHorarioCarrera({ idCarrera, plan, año, mitad, semestre, horario }) {
    const path = `Carreras/${idCarrera}/plan de estudio/${plan}/horarios/${año}/${mitad}/semestres/${semestre}`;
    // console.log(path, horario);
    return set(ref(this.#database, path), horario);
  }

  updateHorarioLaboratorio({
    idDepartamento,
    idLaboratorio,
    año,
    mitad,
    días,
  }) {
    // if (idLaboratorio !== 'LAB-LIC') return;
    for (const día in días) {
      const path = `Departamentos/${idDepartamento}/laboratorios/${idLaboratorio}/horarios/${año}/${mitad}/días/${día}`;
      update(ref(this.#database, path), días[día]);
    }
  }

  updateHorarioDocente({ rutDocente, año, mitad, días }) {
    for (const día in días) {
      const path = `Docentes/${rutDocente}/horarios/${año}/${mitad}/días/${día}`;
      update(ref(this.#database, path), días[día]);
    }
  }
}

const database = new Database();

// database.write({ path: 'users', data: null });

// database.updateDocentes({
//   path: 'pruebas/b',
//   data: {
//     J: {
//       2: { protegido: true },
//       9: { protegido: true },
//     },
//   },
// });

export default database;
export { ref } from 'firebase/database';
