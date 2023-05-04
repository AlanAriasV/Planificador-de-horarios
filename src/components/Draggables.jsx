import { Draggable, Droppable } from "react-beautiful-dnd";

import { BlocksDuration } from "../firebase/Data";

export function ScheduleBlocksDraggable({ blocks, onClick, shelteredBlocks }) {

    const date = new Date();
    date.setHours(8);
    date.setMinutes(0);
    return (
        <>
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

                            var blockSheltered = false;

                            for (const shelteredBlock of shelteredBlocks) {
                                if (shelteredBlock.block === block.number && shelteredBlock.day === block.day) {
                                    blockSheltered = true;
                                }
                            }

                            return (
                                <Droppable
                                    droppableId={id}
                                    key={id}
                                    isDropDisabled={blockSheltered || block.sheltered}
                                >
                                    {(provided, snapshot) => {
                                        var backgroundColor = 'white';
                                        if (blockSheltered) backgroundColor = 'red'
                                        else if (block.sheltered) backgroundColor = 'var(--yellow-color)'
                                        else if (snapshot.isDraggingOver) backgroundColor = 'lightblue';
                                        return (
                                            <td
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{ backgroundColor }}
                                            >
                                                {block.items.map((items, index) => Object.entries(items).map(
                                                    ([itemId, item]) => (
                                                        <Draggable
                                                            key={itemId}
                                                            draggableId={itemId}
                                                            index={index}
                                                            isDragDisabled={block.sheltered}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    className="block"
                                                                    item={item.name ?? `${item.firstName} ${item.lastName}`}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onClick={() => onClick({ id: id, index, index })}
                                                                >
                                                                    <p>{item.id ?? ''}</p>
                                                                    {/* <p>{item.name ?? `${item.firstName} ${item.lastName}`}</p> */}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    )
                                                )
                                                )}
                                                {provided.placeholder}
                                            </td>
                                        );
                                    }
                                    }
                                </Droppable>
                            );
                        })}
                    </tr>
                );
            })}
        </>
    )
}

export function AsignaturesDraggable({ asignatures }) {
    return (
        <>
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
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                className={`item ${asignature.time === 0 ? 'disabled' : ''}`}
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
        </>
    );
}

export function LaboratoriesDraggable({ laboratories }) {
    return (
        <>
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
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                className={`item ${laboratorie.time === 0 ? 'disabled' : ''}`}
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
        </>
    )
}

export function TeachersDraggable({ teachers }) {
    return (
        <>
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
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                className={`item ${teacher.time === 0 ? 'disabled' : ''}`}
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
        </>
    )
}