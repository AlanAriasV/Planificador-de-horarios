import { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';

import Header from '../components/Header';
import {
  formatLaboratorios,
  formatAsignaturas,
  formatDocentes,
  formatHorario,
  formatAsignaciones,
  year,
  half,
} from '../firebase/formattedData';
import {
  AssignaturesDraggable,
  LaboratoriesDraggable,
  ScheduleBlocksDraggable,
  TeachersDraggable,
} from '../components/Draggables';
import { CarreraContext } from '../contexts/CarreraContext';
import { Departamentos } from '../firebase/controller';

import '../css/EditSchedule.css';
import database from '../firebase/database';

function OnDragEnd({
  result,
  droppables,
  setDroppables,
  setModalAsignaturaData,
  setNewAssignment,
}) {
  setDroppables[4]([]);
  if (!result.destination) return;
  const { source, destination } = result;

  const srcDropId = source.droppableId;
  const srcIndex = source.index;

  const destDropId = destination.droppableId;
  const destIndex = destination.index;

  first: for (const srcDroppable of droppables) {
    if (!srcDroppable[srcDropId]) continue;

    for (const destDroppable of droppables) {
      if (!destDroppable[destDropId]) continue;

      const setSrcDroppable = setDroppables[droppables.indexOf(srcDroppable)];
      const setDestDroppable = setDroppables[droppables.indexOf(destDroppable)];
      UpdateDroppable({
        source: [srcDropId, srcIndex, srcDroppable, setSrcDroppable],
        destination: [destDropId, destIndex, destDroppable, setDestDroppable],
        setModalAsignaturaData: setModalAsignaturaData,
        setNewAssignment: setNewAssignment,
      });

      break first;
    }
  }
}

function OnDragStart({ start, assignments, droppables, setShelteredBlocks }) {
  const source = start.source;
  const draggableId = start.draggableId;
  const droppableId = source.droppableId;
  const index = source.index;
  var item;

  for (const droppable of droppables) {
    if (droppable[droppableId]) {
      item = droppable[droppableId].items[index][draggableId];
      break;
    }
  }
  if (
    !item ||
    item.type === 'ASIGNATURA' ||
    !assignments[`${item.type}S`][`${item.id}`]
  )
    return;

  setShelteredBlocks(assignments[`${item.type}S`][`${item.id}`]);
}

function RemoveItem({
  source,
  setSource,
  id,
  index,
  setNewAssignment,
  assignatures,
}) {
  const sourceItem = source[id];
  const sourceItems = [...sourceItem.items];
  const key = Object.keys(sourceItems[index]);

  if (sourceItems[index][key].type === 'ASIGNATURA') {
    const to = sourceItems[index][key].a.toLowerCase();

    searchAssignature: for (const newKey in assignatures) {
      const items = assignatures[newKey].items;

      for (const item of items) {
        for (const assignatureKey in item) {
          const assignature = item[assignatureKey];
          // console.log(sourceItems[index][key]);
          if (assignature.id === sourceItems[index][key].id) {
            // console.log(assignature.minutes[to]);
            assignature.minutes[to] += 45;
            break searchAssignature;
          }
        }
      }
    }

    // sourceItems[index][key].minutes[where.toLowerCase()] += 45;
    // console.log(where);
    // console.log(sourceItems[index][key].minutes);
  } else {
    setNewAssignment({
      type: `${sourceItem.items[index][key].type}S`,
      id: sourceItem.items[index][key].id,
      fromDay: sourceItem.day,
      fromBlock: `${sourceItem.number}`,
      action: 'remove',
    });
  }

  sourceItems.splice(index, 1);

  setSource({
    ...source,
    [id]: {
      ...sourceItem,
      items: sourceItems,
    },
  });
}

function UpdateDroppable({
  source,
  destination,
  setModalAsignaturaData,
  setNewAssignment,
}) {
  if (source[0] !== destination[0]) {
    const sourceItem = source[2][source[0]];
    const destinationItem = destination[2][destination[0]];
    const sourceItems = [...sourceItem.items];
    const destinationItems = [...destinationItem.items];

    const key = Object.keys(sourceItems[source[1]]);

    if (source[2] === destination[2]) {
      const data = {
        type: `${sourceItems[source[1]][key].type}S`,
        id: sourceItems[source[1]][key].id,
        fromDay: sourceItem.day,
        fromBlock: `${sourceItem.number}`,
      };

      for (const destItem of destinationItems) {
        const keyItem = Object.keys(destItem);
        if (destItem[keyItem].type === sourceItems[source[1]][key].type) return;
      }

      const [removed] = sourceItems.splice(source[1], 1);
      destinationItems.splice(destination[1], 0, removed);

      if (data.type !== 'ASIGNATURAS') {
        data.toDay = destinationItem.day;
        data.toBlock = `${destinationItem.number}`;
        data.action = 'update';
        setNewAssignment(data);
      }

      source[3]({
        ...source[2],
        [source[0]]: {
          ...sourceItem,
          items: sourceItems,
        },
        [destination[0]]: {
          ...destinationItem,
          items: destinationItems,
        },
      });
    } else {
      for (const destItem of destinationItems) {
        const keyItem = Object.keys(destItem);
        if (destItem[keyItem].type === sourceItems[source[1]][key].type) return;
      }
      if (sourceItems[source[1]][key[0]].type === 'ASIGNATURA') {
        setModalAsignaturaData({
          sourceItems,
          destinationItems,
          destinationItem,
          destination,
          source,
          key,
        });
      } else {
        destinationItems.push({
          [uuid()]: sourceItems[source[1]][key],
        });
        setNewAssignment({
          type: `${sourceItems[source[1]][key].type}S`,
          id: sourceItems[source[1]][key].id,
          toDay: destination[2][destination[0]].day,
          toBlock: `${destination[2][destination[0]].number}`,
          action: 'add',
        });

        destination[3]({
          ...destination[2],
          [destination[0]]: {
            ...destinationItem,
            items: destinationItems,
          },
        });
      }
    }
  } else {
    const items = source[2][source[0]];
    const copiedItems = [...items.items];
    const [removed] = copiedItems.splice(source[1], 1);
    copiedItems.splice(destination[1], 0, removed);

    source[3]({
      ...source[2],
      [source[0]]: {
        ...items,
        items: copiedItems,
      },
    });
  }
}

export function EditSchedule() {
  const {
    loadingAsignaturas,
    listCarreras,
    loadingDocentes,
    asignaturas,
    docentes,
  } = useContext(CarreraContext);

  const { idCarrera, plan, semestre } = useParams();

  const { departamentos, loadingDepartamentos } = Departamentos();

  const [assignatures, setAssignatures] = useState();
  const [laboratories, setLaboratories] = useState();
  const [teachers, setTeachers] = useState();
  const [blocks, setBlocks] = useState();
  const [assignments, setAssignments] = useState();
  const [shelteredBlocks, setShelteredBlocks] = useState([]);

  const [newAssignment, setNewAssignment] = useState();

  const [modalAsignaturaData, setModalAsignaturaData] = useState();
  const [deployBackPageModal, setDeployBackPageModal] = useState(false);

  useEffect(() => {
    if (!loadingDepartamentos) {
      searchLaboratorio: for (const carrera of listCarreras) {
        if (carrera.key === idCarrera) {
          const departamentoID = carrera.val().departamento;
          for (const departamento of departamentos) {
            if (departamento.key === departamentoID) {
              const laboratorios = departamento.child('laboratorios');
              setLaboratories(
                formatLaboratorios({
                  laboratorios: laboratorios,
                })
              );
            }
          }
        }
      }
    }

    if (listCarreras && !loadingAsignaturas) {
      searchCarrera: for (const carrera of listCarreras) {
        if (carrera.key === idCarrera) {
          const semestreData = carrera.child(
            `plan de estudio/${plan}/semestres/${semestre}`
          );

          const horarioData = carrera.child(
            `plan de estudio/${plan}/horarios/${year}/${half}/semestres/${semestre}/días`
          );

          const listAsignaturas = {};
          for (const asignaturaID in semestreData.val()) {
            searchDataAsignatura: for (const asignatura of asignaturas) {
              if (asignatura.key === asignaturaID) {
                listAsignaturas[asignaturaID] = asignatura;
                break searchDataAsignatura;
              }
            }
          }
          setAssignatures(
            formatAsignaturas({
              asignaturas: listAsignaturas,
              horarioData: horarioData,
            })
          );
          break searchCarrera;
        }
      }
    }

    if (!loadingDocentes) {
      setTeachers(
        formatDocentes({
          docentes: docentes,
        })
      );
    }

    if (
      listCarreras &&
      !loadingAsignaturas &&
      !loadingDocentes &&
      !loadingDepartamentos
    ) {
      for (const carrera of listCarreras) {
        if (carrera.key === idCarrera) {
          const horario = carrera.child(
            `plan de estudio/${plan}/horarios/${year}/${half}/semestres/${semestre}`
          );

          searchLaboratorio: for (const departamento of departamentos) {
            if (departamento.key === carrera.val().departamento) {
              const laboratorios = departamento.child('laboratorios');
              setAssignments(
                formatAsignaciones({
                  docentes: docentes,
                  laboratorios: laboratorios,
                })
              );
              setBlocks(
                formatHorario({
                  asignaturas: assignatures,
                  docentes: docentes,
                  horario: horario,
                  laboratorios: laboratorios,
                })
              );
              break searchLaboratorio;
            }
          }
        }
      }
    }
  }, [loadingDepartamentos, loadingAsignaturas, listCarreras, loadingDocentes]);

  useEffect(() => {
    if (newAssignment) {
      const { type, id, fromDay, fromBlock, toDay, toBlock, action } =
        newAssignment;
      const entity = assignments[type][id];

      if (action === 'add' || action === 'update') {
        if (entity) {
          var exists = false;
          searchAssignment: for (const assignment of entity) {
            if (assignment.day === toDay && assignment.block === toBlock) {
              assignment.sheltered = true;
              exists = true;
              break searchAssignment;
            }
          }
          if (!exists)
            entity.push({ day: toDay, block: toBlock, sheltered: true });
        } else {
          assignments[type][id] = [
            { day: toDay, block: toBlock, sheltered: true },
          ];
        }
      }
      if (action === 'remove' || action === 'update') {
        searchAssignment: for (const assignment of entity) {
          if (assignment.day === fromDay && assignment.block === fromBlock) {
            assignment.sheltered = false;
            break searchAssignment;
          }
        }
      }
    }
  }, [newAssignment]);

  const setDroppables = ({ a }) => {
    const {
      source,
      destination,
      sourceItems,
      destinationItems,
      destinationItem,
      key,
    } = modalAsignaturaData;

    destinationItems.push({
      [uuid()]: {
        ...sourceItems[source[1]][key[0]],
        a: a,
      },
    });

    sourceItems[source[1]][key[0]].minutes[a.toLowerCase()] -= 45;

    destination[3]({
      ...destination[2],
      [destination[0]]: {
        ...destinationItem,
        items: destinationItems,
      },
    });

    setModalAsignaturaData();
  };

  const getTime = ({ a }) => {
    const { source, sourceItems } = modalAsignaturaData;
    for (const key in sourceItems[source[1]]) {
      return sourceItems[source[1]][key].minutes[a];
    }
  };

  const handlerSave = _ => {
    const horarioCarrera = {
      días: {
        L: {},
        M: {},
        X: {},
        J: {},
        V: {},
      },
      estado: 'COMPLETO',
    };
    var minutos = 0;
    const bloques = [];

    setEstado: for (const key in assignatures) {
      const assignaturesItems = assignatures[key].items;
      for (const assignatureItem of assignaturesItems) {
        for (const assignatureItemKey in assignatureItem) {
          const assignature = assignatureItem[assignatureItemKey];
          const catedra = assignature.minutes.cátedra;
          const laboratorio = assignature.minutes.laboratorio;
          const taller = assignature.minutes.taller;

          minutos += catedra + laboratorio + taller;

          // if (catedra + laboratorio + taller > 0) {

          // horarioCarrera.estado = 'INCOMPLETO';
          // break setEstado;
          // }
        }
      }
    }

    for (const key in blocks) {
      if (blocks[key].items.length !== 0 || blocks[key].sheltered) {
        bloques.push(blocks[key]);
      }
    }

    if (minutos > 0) {
      if (bloques.length > 2) {
        horarioCarrera.estado = 'PENDIENTE';
      } else {
        horarioCarrera.estado = 'INCOMPLETO';
      }
    }

    console.log(horarioCarrera);

    const rutDocentes = {};

    for (const key in teachers) {
      for (const item of teachers[key].items) {
        for (const docenteKey in item) {
          const { id, rut } = item[docenteKey];
          rutDocentes[id] = rut;
        }
      }
    }

    var idDepartamento;

    for (const carrera of listCarreras) {
      if (carrera.key === idCarrera) {
        idDepartamento = carrera.val().departamento;
        break;
      }
    }

    // Set horario de la carrera

    for (const bloque of bloques) {
      var idAsignatura = null;
      var idDocente = null;
      var idLaboratorio = null;
      var tipo = null;

      for (const itemsKey in bloque.items) {
        for (const asignacionKey in bloque.items[itemsKey]) {
          const item = bloque.items[itemsKey][asignacionKey];
          if (item.type === 'ASIGNATURA') {
            idAsignatura = item.id;
            tipo = item.a;
          } else if (item.type === 'DOCENTE') {
            idDocente = item.rut;
          } else {
            idLaboratorio = item.id;
          }
        }
      }

      horarioCarrera.días[bloque.day][bloque.number] = {
        asignaciones: {
          asignatura: idAsignatura,
          docente: idDocente,
          laboratorio: idLaboratorio,
        },
        tipo: tipo,
        protegido: bloque.sheltered,
      };
    }

    database.setHorarioCarrera({
      idCarrera: idCarrera,
      plan: plan,
      año: year,
      mitad: half,
      semestre: semestre,
      horario: horarioCarrera,
    });

    // console.log(horarioCarrera);

    for (const type in assignments) {
      const asignacionesItems = assignments[type];
      if (type === 'DOCENTES') {
        for (const id in asignacionesItems) {
          const horarioDocente = {};
          for (const asignacion of asignacionesItems[id]) {
            const { day, block, sheltered } = asignacion;
            if (sheltered) {
              for (const bloque of bloques) {
                if (bloque.day === day && bloque.number === parseInt(block)) {
                  var asignatura = null;
                  var laboratorio = null;

                  for (const key in bloque.items) {
                    for (const asignacionKey in bloque.items[key]) {
                      const item = bloque.items[key][asignacionKey];
                      if (item.type === 'ASIGNATURA') {
                        asignatura = item.id;
                      } else if (item.type === 'LABORATORIO') {
                        laboratorio = item.id;
                      }
                    }
                  }

                  if (!horarioDocente[day]) {
                    horarioDocente[day] = {};
                  }
                  horarioDocente[day][block] = {
                    asignaciones: {
                      asignatura: asignatura,
                      laboratorio: laboratorio,
                    },
                    protegido: sheltered,
                  };
                }
              }
            } else {
              if (!horarioDocente[day]) {
                horarioDocente[day] = {};
              }
              horarioDocente[day][block] = {
                asignaciones: {
                  asignatura: null,
                  laboratorio: null,
                },
                protegido: sheltered,
              };
            }
          }
          database.updateHorarioDocente({
            rutDocente: rutDocentes[id],
            año: year,
            mitad: half,
            días: horarioDocente,
          });
        }
      } else {
        for (const id in asignacionesItems) {
          const horarioLaboratorio = {};
          for (const asignacion of asignacionesItems[id]) {
            const { day, block, sheltered } = asignacion;
            if (sheltered) {
              for (const bloque of bloques) {
                if (bloque.day === day && bloque.number === parseInt(block)) {
                  var asignatura = null;
                  var docente = null;

                  for (const key in bloque.items) {
                    for (const asignacionKey in bloque.items[key]) {
                      const item = bloque.items[key][asignacionKey];
                      if (item.type === 'ASIGNATURA') {
                        asignatura = item.id;
                      } else if (item.type === 'DOCENTE') {
                        docente = item.rut;
                      }
                    }
                  }

                  if (!horarioLaboratorio[day]) {
                    horarioLaboratorio[day] = {};
                  }
                  horarioLaboratorio[day][block] = {
                    asignaciones: {
                      asignatura: asignatura,
                      docente: docente,
                    },
                    protegido: sheltered,
                  };
                }
              }
            } else {
              if (!horarioLaboratorio[day]) {
                horarioLaboratorio[day] = {};
              }
              horarioLaboratorio[day][block] = {
                asignaciones: {
                  asignatura: null,
                  docente: null,
                },
                protegido: sheltered,
              };
            }
          }
          // console.log(id, horarioLaboratorio);
          database.updateHorarioLaboratorio({
            idDepartamento: idDepartamento,
            idLaboratorio: id,
            año: year,
            mitad: half,
            días: horarioLaboratorio,
          });
        }
      }
    }
  };

  const handlerExit = _ => {
    setDeployBackPageModal(true);
    // console.log('salir');
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Header
        title={'EDICIÓN DE HORARIO'}
        handlerSave={handlerSave}
        handlerExit={handlerExit}
      />
      <main className="main-edit">
        <DragDropContext
          onDragStart={start => {
            const droppables = [blocks, laboratories, teachers];
            return OnDragStart({
              start: start,
              assignments: assignments,
              droppables: droppables,
              setShelteredBlocks: setShelteredBlocks,
            });
          }}
          onDragEnd={result => {
            const droppables = [blocks, assignatures, laboratories, teachers];
            const setDroppables = [
              setBlocks,
              setAssignatures,
              setLaboratories,
              setTeachers,
              setShelteredBlocks,
            ];
            return OnDragEnd({
              result: result,
              droppables: droppables,
              setDroppables: setDroppables,
              setModalAsignaturaData: setModalAsignaturaData,
              setNewAssignment: setNewAssignment,
            });
          }}>
          {!blocks && (
            <>
              {/* <div className="placeholder" style={{ gridArea: 'ta' }}></div> */}
              <div className="placeholder schedule"></div>
            </>
          )}
          {blocks && (
            <>
              <section className="schedule">
                <div
                  style={{
                    overflowY: 'scroll',
                    height: '100%',
                    width: '100%',
                  }}>
                  <table className="edit-schedule">
                    <thead>
                      <tr>
                        <th colSpan={6}>
                          <h2>Horario</h2>
                        </th>
                      </tr>
                      <tr>
                        <td></td>
                        <td>Lunes</td>
                        <td>Martes</td>
                        <td>Miércoles</td>
                        <td>Jueves</td>
                        <td>Viernes</td>
                      </tr>
                    </thead>
                    <tbody>
                      <ScheduleBlocksDraggable
                        blocks={blocks}
                        onClick={data =>
                          RemoveItem({
                            source: blocks,
                            setSource: setBlocks,
                            setNewAssignment: setNewAssignment,
                            assignatures: assignatures,
                            ...data,
                          })
                        }
                        shelteredBlocks={shelteredBlocks}
                      />
                    </tbody>
                  </table>
                </div>
                <div
                  className={`background-modal ${
                    modalAsignaturaData ? 'deploy-modal' : ''
                  }`}
                  onClick={e => {
                    setModalAsignaturaData();
                  }}>
                  <div
                    className={`modal-type ${
                      modalAsignaturaData ? 'deploy-selector' : ''
                    }`}>
                    <div
                      className={`${
                        modalAsignaturaData &&
                        getTime({
                          a: 'cátedra',
                        }) === 0
                          ? 'option-disabled'
                          : ''
                      }`}
                      onClick={_ =>
                        getTime({
                          a: 'cátedra',
                        }) !== 0
                          ? setDroppables({
                              a: 'CÁTEDRA',
                            })
                          : null
                      }>
                      <p>Cátedra</p>
                      <p>:</p>
                      {modalAsignaturaData && (
                        <p>
                          {getTime({
                            a: 'cátedra',
                          })}
                        </p>
                      )}
                    </div>
                    <div className="divider"></div>
                    <div
                      className={`${
                        modalAsignaturaData &&
                        getTime({
                          a: 'laboratorio',
                        }) === 0
                          ? 'option-disabled'
                          : ''
                      }`}
                      onClick={_ =>
                        getTime({
                          a: 'laboratorio',
                        }) !== 0
                          ? setDroppables({
                              a: 'LABORATORIO',
                            })
                          : null
                      }>
                      <p>Laboratorio</p>
                      <p>:</p>
                      {modalAsignaturaData && (
                        <p>
                          {getTime({
                            a: 'laboratorio',
                          })}
                        </p>
                      )}
                    </div>
                    <div className="divider"></div>
                    <div
                      className={`${
                        modalAsignaturaData && getTime({ a: 'taller' }) === 0
                          ? 'option-disabled'
                          : ''
                      }`}
                      onClick={_ =>
                        getTime({ a: 'taller' }) !== 0
                          ? setDroppables({
                              a: 'TALLER',
                            })
                          : null
                      }>
                      <p>Taller</p>
                      <p>:</p>
                      {modalAsignaturaData && (
                        <p>
                          {getTime({
                            a: 'taller',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          {!assignatures && (
            <>
              <div className="placeholder" style={{ gridArea: 'ta' }}></div>
              <div className="placeholder assignatures"></div>
            </>
          )}
          {assignatures && (
            <>
              <h2 style={{ gridArea: 'ta' }}> Asignaturas </h2>
              <AssignaturesDraggable assignatures={assignatures} />
            </>
          )}
          {!laboratories && (
            <>
              <div className="placeholder" style={{ gridArea: 'tl' }}></div>
              <div className="placeholder laboratories"></div>
            </>
          )}
          {laboratories && (
            <>
              <h2 style={{ gridArea: 'tl' }}> Laboratorios </h2>
              <LaboratoriesDraggable laboratories={laboratories} />
            </>
          )}
          {!teachers && (
            <>
              <div className="placeholder x2" style={{ gridArea: 'tt' }}></div>
              <div className="placeholder x2 teachers"></div>
            </>
          )}
          {teachers && (
            <>
              <h2 style={{ gridArea: 'tt' }}> Docentes </h2>
              <TeachersDraggable teachers={teachers} />
            </>
          )}
        </DragDropContext>
      </main>
      <div
        className={`background-modal ${
          deployBackPageModal ? 'deploy-modal' : ''
        }`}
        onClick={() => {
          setDeployBackPageModal(false);
        }}>
        <div className="modal-content-back-page">
          <div className="modal-title-back-page">
            <p>Advertencia</p>
          </div>
          <div className="modal-body-back-page">
            <p>Aún pueden existir cambios sin guardar en el horario.</p>
            <p>¿Qué desea hacer con los cambios?</p>
          </div>
          <div className="modal-actions-back-page">
            <a href={'/'} className="action-save" onClick={handlerSave}>
              Guardar
            </a>
            <a href={'/'} className="action-discard">
              Descartar
            </a>
            <div className="space"></div>
            <a
              className="action-cancel"
              onClick={() => {
                setDeployBackPageModal(false);
              }}>
              Cancelar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
