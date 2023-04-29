import { useState } from "react"
import { Table } from "react-bootstrap"

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { v4 as uuid } from 'uuid'

import '../css/EditSchedule.css'

import Header from "../components/Header"
import { Asignatures, Blocks, BlocksDuration, Laboratories, Teachers } from "../firebase/Data"


const UpdateDroppable = ({
    source,
    destination
}) => {

    if (source[0] !== destination[0]) {
        const sourceItem = source[2][source[0]];
        const destinationItem = destination[2][destination[0]];
        const sourceItems = [...sourceItem.items];
        const destinationItems = [...destinationItem.items];
        const key = Object.keys(sourceItems[source[1]])
        destinationItems.push({ [uuid()]: sourceItems[source[1]][key] });
        if (sourceItems[source[1]][key].time !== undefined) {
            sourceItems[source[1]][key].time -= 45;
        }

        source[3](
            {
                ...source[2],
                [source[0]]: {
                    ...sourceItem,
                    items: sourceItems
                }
            }
        )

        destination[3](
            {
                ...destination[2],
                [destination[0]]: {
                    ...destinationItem,
                    items: destinationItems
                }
            }
        )
    } else {
        const items = source[2][source[0]];
        const copiedItems = [...items.items];
        const [removed] = copiedItems.splice(source[1], 1);
        copiedItems.splice(destination[1], 0, removed)
        source[3](
            {
                ...source[2],
                [source[0]]: {
                    ...items,
                    items: copiedItems
                }
            }
        );
    }

}


const OnDragEnd = (
    {
        result,
        droppables,
        setDroppables
    }
) => {
    if (!result.destination) return
    const { source, destination } = result;

    const srcDropId = source.droppableId;
    const srcIndex = source.index;

    const destDropId = destination.droppableId;
    const destIndex = destination.index;

    first:
    for (const srcDroppable of droppables) {

        if (!srcDroppable[srcDropId]) continue;

        for (const destDroppable of droppables) {

            if (!destDroppable[destDropId]) continue;

            const setSrcDroppable = setDroppables[droppables.indexOf(srcDroppable)]
            const setDestDroppable = setDroppables[droppables.indexOf(destDroppable)]

            UpdateDroppable(
                {
                    source: [srcDropId, srcIndex, srcDroppable, setSrcDroppable],
                    destination: [destDropId, destIndex, destDroppable, setDestDroppable],
                }
            )

            break first;
        }
    }
}

export const EditSchedule = () => {

    const date = new Date();
    date.setHours(8);
    date.setMinutes(0);

    const [blocks, setBlocks] = useState(Blocks);
    const [asignatures, setAsignatures] = useState(Asignatures);
    const [laboratories, setLaboratories] = useState(Laboratories);
    const [teachers, setTeachers] = useState(Teachers);

    return <>
        <Header title={'EDICIÓN DE HORARIO'} />
        <main>
            <DragDropContext
                onDragEnd={result =>
                    OnDragEnd(
                        {
                            result: result,
                            droppables: [blocks, asignatures, laboratories, teachers],
                            setDroppables: [setBlocks, setAsignatures, setLaboratories, setTeachers],
                        }
                    )
                }
            >
                <section>
                    <Table >
                        <thead>
                            <tr>
                                <th colSpan={6}>
                                    <h2>Horario</h2>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>Lunes</td>
                                <td>Martes</td>
                                <td>Miércoles</td>
                                <td>Jueves</td>
                                <td>Viernes</td>
                            </tr>

                            {[...Array(14)].map((_, i) => {
                                i++;
                                const { nowHours, nowMinutes, newHours, newMinutes } = BlocksDuration({ date: date, block: i });
                                return (
                                    <tr key={i}>
                                        <td>
                                            <p>{i}</p>
                                            <p>{`${nowHours}:${nowMinutes} - ${newHours}:${newMinutes}`}</p>
                                        </td>
                                        {Object.entries(blocks).map(([id, block]) => {
                                            if (block.number !== i) return
                                            return (
                                                <Droppable
                                                    droppableId={id}
                                                    key={id}
                                                    isDropDisabled={block.sheltered}
                                                >
                                                    {(provided, snapshot) => (
                                                        <td
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            style={{
                                                                backgroundColor:
                                                                    block.sheltered ?
                                                                        'var(--yellow-color)' :
                                                                        snapshot.isDraggingOver ?
                                                                            'lightblue' :
                                                                            'white'
                                                            }}
                                                        >
                                                            {block.items.map((items, index) =>
                                                                Object.entries(items).map(
                                                                    ([id, item]) => (
                                                                        <Draggable
                                                                            key={id}
                                                                            draggableId={id}
                                                                            index={index}
                                                                            isDragDisabled={block.sheltered}
                                                                        >
                                                                            {(provided, snapshot) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                >
                                                                                    <p>{item.id ?? ''}</p>
                                                                                    <p>{item.name ?? `${item.firstName} ${item.lastName}`}</p>
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    )
                                                                )
                                                            )}
                                                            {provided.placeholder}
                                                        </td>
                                                    )}
                                                </Droppable>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </section>
                <div className={'columns'}>
                    {Object.entries(asignatures).map(([id, asignatures]) => (
                        <Droppable
                            isDropDisabled={true}
                            droppableId={id}
                            key={id}>
                            {(provided, snapshot) => (
                                <section className="grid"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {asignatures.items.map((asignatures, index) =>
                                        Object.entries(asignatures).map(([id, asignature]) => (
                                            <Draggable
                                                key={id}
                                                draggableId={id}
                                                index={index}
                                                isDragDisabled={asignature.time === 0}
                                                className={asignature.time === 0 ? 'disabled' : ''}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={'item'}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <p>{asignature.id}</p>
                                                        <p>{asignature.name}</p>
                                                    </div>
                                                )}
                                            </Draggable>)
                                        )

                                    )}
                                    {provided.placeholder}
                                </section>
                            )}
                        </Droppable>
                    ))}
                    {Object.entries(laboratories).map(([id, laboratories]) => (
                        <Droppable
                            isDropDisabled={true}
                            droppableId={id}
                            key={id}>
                            {(provided, snapshot) => (
                                <section className="grid"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {laboratories.items.map((laboratories, index) =>
                                        Object.entries(laboratories).map(([id, laboratorie]) => (
                                            <Draggable
                                                key={id}
                                                draggableId={id}
                                                index={index}
                                                isDragDisabled={laboratorie.time === 0}
                                                className={laboratorie.time === 0 ? 'disabled' : ''}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={'item'}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {/* <p>{laboratorie.id}</p> */}
                                                        <p>{laboratorie.name}</p>
                                                    </div>
                                                )}
                                            </Draggable>)
                                        )

                                    )}
                                    {provided.placeholder}
                                </section>
                            )}
                        </Droppable>
                    ))}
                </div>
                {Object.entries(teachers).map(([id, teachers]) => (
                    <Droppable
                        isDropDisabled={true}
                        droppableId={id}
                        key={id}>
                        {(provided, snapshot) => (
                            <section className="grid"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {teachers.items.map((teachers, index) =>
                                    Object.entries(teachers).map(([id, teacher]) => (
                                        <Draggable
                                            key={id}
                                            draggableId={id}
                                            index={index}
                                            isDragDisabled={teacher.time === 0}
                                            className={teacher.time === 0 ? 'disabled' : ''}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    className={'item'}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <p>{`${teacher.firstName} ${teacher.lastName}`}</p>
                                                    <p>{teacher.email}</p>
                                                </div>
                                            )}
                                        </Draggable>)
                                    )

                                )}
                                {provided.placeholder}
                            </section>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </main >
    </>
}