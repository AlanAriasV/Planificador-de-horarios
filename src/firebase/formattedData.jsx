import { v4 as uuid } from 'uuid';

export function BlocksDuration({ date, block }) {
  let nowHours = date.getHours();
  let nowMinutes = date.getMinutes();
  nowMinutes = nowMinutes < 10 ? `0${nowMinutes}` : nowMinutes;

  date.setMinutes(date.getMinutes() + 45);

  let newHours = date.getHours();
  let newMinutes = date.getMinutes();
  newMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;

  if ([2, 4].includes(block)) date.setMinutes(date.getMinutes() + 10);
  if ([6].includes(block)) date.setMinutes(date.getMinutes() + 115);
  if ([8, 10, 12].includes(block)) date.setMinutes(date.getMinutes() + 5);

  return { nowHours, nowMinutes, newHours, newMinutes };
}

const date = new Date();
export const year = date.getFullYear();
export const half = date.getMonth() < 6 ? 1 : 2;

export function formatAsignaturas({ asignaturas }) {
  if (!asignaturas) return {};

  const items = [];

  for (const asignaturaID in asignaturas) {
    const asignatura = asignaturas[asignaturaID].val();
    const name = asignatura.nombre;
    const minutes = asignatura.minutos;

    const formattedAsignatura = {
      id: asignaturaID,
      name: name,
      minutes: minutes,
      type: 'ASIGNATURA',
    };

    items.push({
      [uuid()]: formattedAsignatura,
    });
  }

  return {
    [uuid()]: {
      items: items,
    },
  };
}

export function formatLaboratorios({ laboratorios }) {
  if (!laboratorios) return {};

  const items = [];

  for (const laboratorio in laboratorios.val()) {
    const id = laboratorio;
    const name = laboratorios.val()[laboratorio].nombre;

    const formattedLaboratorio = {
      id: id,
      name: name,
      type: 'LABORATORIO',
    };

    items.push({
      [uuid()]: formattedLaboratorio,
    });
  }

  return {
    [uuid()]: {
      items: items,
    },
  };
}

export function formatDocentes({ docentes }) {
  if (!docentes) return {};

  const items = [];

  for (const docente of docentes) {
    var id = 'DOC-';
    for (const code of `${docente.val().nombre} ${
      docente.val().apellido
    }`.split(' ')) {
      id += code.charAt(0).toUpperCase();
    }

    const rut = docente.key;
    const firstName = docente.val().nombre;
    const lastName = docente.val().apellido;
    const email = docente.val().correo;

    const formattedDocente = {
      rut: rut,
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      type: 'DOCENTE',
    };

    items.push({
      [uuid()]: formattedDocente,
    });
  }

  return {
    [uuid()]: {
      items: items,
    },
  };
}

export function formatHorario({
  asignaturas,
  docentes,
  horario,
  laboratorios,
}) {
  const days = { 1: 'L', 2: 'M', 3: 'X', 4: 'J', 5: 'V' };

  const formattedBlocks = {};

  for (const nDay in days) {
    for (const nBlock in Array(15).fill(null, 1, 15)) {
      const day = days[nDay];
      const duration = 45;
      const items = [];
      var sheltered = false;

      const block = horario.child(`días/${day}/${nBlock}`);

      if (block.val()) {
        sheltered = block.val().protegido ?? false;

        const asignaciones = block.child('asignaciones');

        if (asignaciones.val()) {
          const asignatura = asignaciones.val().asignatura;
          const docente = asignaciones.val().docente;
          const laboratorio = asignaciones.val().laboratorio;

          const formattedAsignaciones = {};

          if (asignatura) {
            searchAsignatura: for (const asignaturaData of asignaturas) {
              if (asignaturaData.key === asignatura) {
                const name = asignaturaData.val().nombre;
                const minutes = asignaturaData.val().minutos;
                formattedAsignaciones[uuid()] = {
                  id: asignatura,
                  name: name,
                  minutes: minutes,
                  type: 'ASIGNATURA',
                };
                break searchAsignatura;
              }
            }
          }
          if (docente) {
            searchDocente: for (const docenteData of docentes) {
              if (docenteData.key === docente) {
                var id = 'DOC-';
                for (const code of `${docenteData.val().nombre} ${
                  docenteData.val().apellido
                }`.split(' ')) {
                  id += code.charAt(0).toUpperCase();
                }

                const firstName = docenteData.val().nombre;
                const lastName = docenteData.val().apellido;
                const email = docenteData.val().correo;

                formattedAsignaciones[uuid()] = {
                  rut: docente,
                  id: id,
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  type: 'DOCENTE',
                };
                break searchDocente;
              }
            }
          }
          if (laboratorio) {
            searchLaboratorio: for (const laboratorioId in laboratorios.val()) {
              if (laboratorioId === laboratorio) {
                const name = laboratorios.val()[laboratorioId].nombre;
                formattedAsignaciones[uuid()] = {
                  id: laboratorio,
                  name: name,
                  type: 'LABORATORIO',
                };
                break searchLaboratorio;
              }
            }
          }

          items.push(formattedAsignaciones);
        }
      }

      const formattedBlock = {
        day: day,
        duration: duration,
        items: items,
        number: parseInt(nBlock),
        sheltered: sheltered,
      };

      formattedBlocks[uuid()] = formattedBlock;
    }
  }

  return formattedBlocks;
}

export function formatAsignaciones({ docentes, laboratorios }) {
  const docentesList = {};
  const laboratoriosList = {};

  for (const docente of docentes) {
    const dias = docente.child(`horarios/${year}/${half}/días`);

    if (dias.val()) {
      const items = [];

      var id = 'DOC-';
      for (const code of `${docente.val().nombre} ${
        docente.val().apellido
      }`.split(' ')) {
        id += code.charAt(0).toUpperCase();
      }

      for (const day in dias.val()) {
        for (const block in dias.val()[day]) {
          const formattedDocentesAsignacion = {
            day: day,
            block: block,
          };

          items.push(formattedDocentesAsignacion);
        }
      }
      docentesList[id] = items;
    }
  }
  for (const laboratorioID in laboratorios.val()) {
    const dias = laboratorios.child(
      `${laboratorioID}/horarios/${year}/${half}/días`
    );

    if (dias.val()) {
      const items = [];

      for (const day in dias.val()) {
        for (const block in dias.val()[day]) {
          const formattedLaboratoriosAsignacion = {
            day: day,
            block: block,
          };

          items.push(formattedLaboratoriosAsignacion);
        }
      }
      laboratoriosList[laboratorioID] = items;
    }
  }

  return {
    DOCENTES: docentesList,
    LABORATORIOS: laboratoriosList,
  };
}
