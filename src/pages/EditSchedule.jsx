import { useState } from 'react';

import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { useList, useListVals } from "react-firebase-hooks/database"

import '../css/EditSchedule.css';

import Header from '../components/Header';
import {
  Assignatures,
  Blocks,
  Laboratories,
  Assignments,
  Teachers,
} from '../firebase/Data';
import {
  AssignaturesDraggable,
  LaboratoriesDraggable,
  ScheduleBlocksDraggable,
  TeachersDraggable,
} from '../components/Draggables';
import database from '../firebase/database';
import { Asignaturas } from '../firebase/controller';
import { useEffect } from 'react';



function OnDragEnd({ result, droppables, setDroppables }) {
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
      });

      break first;
    }
  }
}

function OnDragStart({ start, assignments, droppables, setShelteredBlocks }) {
  // console.log(start)
  const source = start.source;
  const draggableId = start.draggableId;
  const droppableId = source.droppableId;
  const index = source.index;
  var item;

  const newShelteredBlocks = [];

  for (const droppable of droppables) {
    if (droppable[droppableId]) {
      item = droppable[droppableId].items[index][draggableId];
      break;
    }
  }

  if (!item) return;
  for (const assignment of assignments['ICCI-1-2022'].items) {
    if (assignment[item.type] === item.id) {
      newShelteredBlocks.push(assignment);
    }
  }
  setShelteredBlocks(newShelteredBlocks);
}

function RemoveItem({ source, setSource, id, index }) {
  const sourceItem = source[id];
  const sourceItems = [...sourceItem.items];
  const key = Object.keys(sourceItems[index]);

  if (sourceItems[index][key].time !== undefined) {
    sourceItems[index][key].time += 45;
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

function UpdateDroppable({ source, destination }) {
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

      destinationItems.push({ [uuid()]: sourceItems[source[1]][key] });

      if (sourceItems[source[1]][key].time !== undefined) {
        sourceItems[source[1]][key].time -= 45;
      }

      destination[3]({
        ...destination[2],
        [destination[0]]: {
          ...destinationItem,
          items: destinationItems,
        },
      });
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
  const [assignatures, setAssignatures] = useState(Assignatures);
  const [assignments, setAssignments] = useState(Assignments);
  const [blocks, setBlocks] = useState(Blocks);
  const [laboratories, setLaboratories] = useState(Laboratories);
  const [shelteredBlocks, setShelteredBlocks] = useState([]);
  const [teachers, setTeachers] = useState(Teachers);

  const [loading, setLoading] = useState(true);

  const { listAsignaturas, loadingAsignaturas } = Asignaturas();


  useEffect(
    () => {
      setLoading(loadingAsignaturas)
    }, [loadingAsignaturas]
  );

  // console.log(snapshot)
  // if (!loading) listAsignaturas.map((v) => {

  //   console.log(v)
  //   // console.log(`${v.key} => ${JSON.stringify(v.val())}`);
  // });
  // const [a, sA] = useState();

  // Asignaturas();
  // console.log('algo')

  // useEffect(() => { }, [assignatures]);

  return (
    <>
      <Header title={'EDICIÓN DE HORARIO'} />
      {loading && (
        <>
          <main className='loading'>
            <h2>Cargando...</h2>
          </main>
        </>
      )}
      {!loading && (
        <>
          <main className='main-edit'>
            <DragDropContext
              onDragStart={(start) => {
                const droppables = [blocks, laboratories, teachers];
                return OnDragStart({
                  start: start,
                  assignments: assignments,
                  droppables: droppables,
                  setShelteredBlocks: setShelteredBlocks,
                });
              }}
              onDragEnd={(result) => {
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
                });
              }}
            >
              <section className='schedule'>
                <div
                  style={{ overflowY: 'scroll', height: '100%', width: '100%' }}>
                  <table className='edit-schedule'>
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
                        onClick={(data) =>
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
              </section >
              <h2 style={{ gridArea: 'ta' }}> Asignaturas </h2>
              <AssignaturesDraggable assignatures={assignatures} />
              <h2 style={{ gridArea: 'tl' }}> Laboratorios </h2>
              <LaboratoriesDraggable laboratories={laboratories} />
              <h2 style={{ gridArea: 'tt' }}> Docentes </h2>
              <TeachersDraggable teachers={teachers} />
            </DragDropContext >
          </main >
        </>
      )}
    </>
  );
}