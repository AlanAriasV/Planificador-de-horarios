import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

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

function OnDragEnd({ result, droppables, setDroppables, setModalData }) {
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
        setModalData: setModalData,
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

function RemoveItem({ source, setSource, id, index }) {
  const sourceItem = source[id];
  const sourceItems = [...sourceItem.items];
  const key = Object.keys(sourceItems[index]);

  if (sourceItems[index][key].type === 'ASIGNATURA') {
    const where = sourceItems[index][key].a;
    sourceItems[index][key].minutes[where.toLowerCase()] += 45;
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

function UpdateDroppable({ source, destination, setModalData }) {
  if (source[0] !== destination[0]) {
    const sourceItem = source[2][source[0]];
    const destinationItem = destination[2][destination[0]];
    const sourceItems = [...sourceItem.items];
    const destinationItems = [...destinationItem.items];

    const key = Object.keys(sourceItems[source[1]]);

    if (source[2] === destination[2]) {
      for (const destItem of destinationItems) {
        const keyItem = Object.keys(destItem);
        if (destItem[keyItem].type === sourceItems[source[1]][key].type) return;
      }

      const [removed] = sourceItems.splice(source[1], 1);
      destinationItems.splice(destination[1], 0, removed);

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
        setModalData({
          sourceItems,
          destinationItems,
          destinationItem,
          destination,
          source,
          key,
          // mousePosition,
        });
      } else {
        destinationItems.push({ [uuid()]: sourceItems[source[1]][key] });

        // if (sourceItems[source[1]][key].time !== undefined) {
        //   sourceItems[source[1]][key].time -= 45;
        // }

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

  const { departamentos, loadingDepartamentos, errorDepartamentos } =
    Departamentos();

  const [assignatures, setAssignatures] = useState();
  const [laboratories, setLaboratories] = useState();
  const [teachers, setTeachers] = useState();
  const [blocks, setBlocks] = useState();

  const [assignments, setAssignments] = useState();
  const [shelteredBlocks, setShelteredBlocks] = useState([]);

  // const [deployModal, setModalData] = useState(false);
  const [modalData, setModalData] = useState();
  useEffect(() => {
    if (!loadingDepartamentos) {
      searchLaboratorio: for (const carrera of listCarreras) {
        if (carrera.key === idCarrera) {
          const departamentoID = carrera.val().departamento;
          for (const departamento of departamentos) {
            if (departamento.key === departamentoID) {
              const laboratorios = departamento.child('laboratorios');
              setLaboratories(
                formatLaboratorios({ laboratorios: laboratorios })
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
              setBlocks(
                formatHorario({
                  asignaturas: asignaturas,
                  docentes: docentes,
                  horario: horario,
                  laboratorios: laboratorios,
                })
              );
              setAssignments(
                formatAsignaciones({
                  docentes: docentes,
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

  const setDroppables = ({ a }) => {
    const {
      source,
      destination,
      sourceItems,
      destinationItems,
      destinationItem,
      key,
    } = modalData;

    destinationItems.push({
      [uuid()]: {
        ...sourceItems[source[1]][key[0]],
        a: a,
      },
    });
    sourceItems[source[1]][key[0]].minutes[a.toLowerCase()] -= 45;

    // // if (sourceItems[source[1]][key].time !== undefined) {
    // //   sourceItems[source[1]][key].time -= 45;
    // // }

    destination[3]({
      ...destination[2],
      [destination[0]]: {
        ...destinationItem,
        items: destinationItems,
      },
    });

    setModalData();
  };

  const getTime = ({ a }) => {
    const { source, sourceItems } = modalData;
    for (const key in sourceItems[source[1]]) {
      return sourceItems[source[1]][key].minutes[a];
    }
  };

  const handlerSave = _ => {
    for (const key in blocks) {
      if (blocks[key].items.length !== 0 || blocks[key].sheltered) {
        console.log(blocks[key]);

        //TODO: guardar el horario en los docentes, laboratorios y carrera.
      }
    }
  };
  const handlerExit = _ => {
    console.log('salir');
  };

  return (
    <>
      <Header
        title={'EDICIÓN DE HORARIO'}
        handlerSave={handlerSave}
        handlerExit={handlerExit}
      />
      <>
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
                setModalData: setModalData,
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
                      modalData ? 'deploy-modal' : ''
                    }`}>
                    <div
                      className={`modal-type ${
                        modalData ? 'deploy-selector' : ''
                      }`}>
                      <div
                        className={`${
                          modalData && getTime({ a: 'cátedra' }) === 0
                            ? 'option-disabled'
                            : ''
                        }`}
                        onClick={_ =>
                          getTime({ a: 'cátedra' }) !== 0
                            ? setDroppables({ a: 'CÁTEDRA' })
                            : null
                        }>
                        <p>Cátedra</p>
                        <p>:</p>
                        {modalData && <p>{getTime({ a: 'cátedra' })}</p>}
                      </div>
                      <div className="divider"></div>
                      <div
                        className={`${
                          modalData && getTime({ a: 'laboratorio' }) === 0
                            ? 'option-disabled'
                            : ''
                        }`}
                        onClick={_ =>
                          getTime({ a: 'laboratorio' }) !== 0
                            ? setDroppables({ a: 'LABORATORIO' })
                            : null
                        }>
                        <p>Laboratorio</p>
                        <p>:</p>
                        {modalData && <p>{getTime({ a: 'laboratorio' })}</p>}
                      </div>
                      <div className="divider"></div>
                      <div
                        className={`${
                          modalData && getTime({ a: 'taller' }) === 0
                            ? 'option-disabled'
                            : ''
                        }`}
                        onClick={_ =>
                          getTime({ a: 'taller' }) !== 0
                            ? setDroppables({ a: 'TALLER' })
                            : null
                        }>
                        <p>Taller</p>
                        <p>:</p>
                        {modalData && <p>{getTime({ a: 'taller' })}</p>}
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
                <div
                  className="placeholder x2"
                  style={{ gridArea: 'tt' }}></div>
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
      </>
    </>
  );
}
