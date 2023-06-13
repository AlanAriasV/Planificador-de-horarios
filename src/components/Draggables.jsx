import { Draggable, Droppable } from "react-beautiful-dnd";

import { BlocksDuration } from "../firebase/Data";
// import { outOfTheWayTiming } from "react-beautiful-dnd/src/animation";

export function ScheduleBlocksDraggable({ blocks, onClick, shelteredBlocks }) {
  const date = new Date();
  date.setHours(8);
  date.setMinutes(0);
  // console.log(transitions.outOfTheWay);
  return (
    <>
      {[...Array(14)].map((_, i) => {
        i++;
        const { nowHours, nowMinutes, newHours, newMinutes } = BlocksDuration({
          date: date,
          block: i,
        });
        return (
          <tr key={i}>
            <td>
              <p>{i}</p>
              <p>{`${nowHours}:${nowMinutes} - ${newHours}:${newMinutes}`}</p>
            </td>
            {Object.entries(blocks).map(([id, block]) => {
              if (block.number !== i) return;

              var blockSheltered = false;

              for (const shelteredBlock of shelteredBlocks) {
                if (
                  shelteredBlock.block === block.number &&
                  shelteredBlock.day === block.day
                ) {
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
                    var backgroundColor = "white";
                    if (blockSheltered) backgroundColor = "red";
                    else if (block.sheltered)
                      backgroundColor = "var(--yellow-color)";
                    // else if (snapshot.isDraggingOver) backgroundColor = 'lightblue';
                    return (
                      <td
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ backgroundColor }}
                      >
                        {block.items.map((items, index) =>
                          Object.entries(items).map(([itemId, item]) => (
                            <Draggable
                              key={itemId}
                              draggableId={itemId}
                              index={index}
                              isDragDisabled={block.sheltered}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className={`block ${snapshot.isDragging ? "dragging" : ""
                                    }`}
                                  item={
                                    item.name ??
                                    `${item.firstName} ${item.lastName}`
                                  }
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() =>
                                    onClick({ id: id, index, index })
                                  }
                                >
                                  <p>{item.id ?? ""}</p>
                                  {/* <p>{item.name ?? `${item.firstName} ${item.lastName}`}</p> */}
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </td>
                    );
                  }}
                </Droppable>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

export function AssignaturesDraggable({ assignatures }) {
  return (
    <>
      {Object.entries(assignatures).map(([id, assignatures]) => (
        <Droppable isDropDisabled={true} droppableId={id} key={id}>
          {(provided, snapshot) => (
            <section
              className="assignatures"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="grid grid-assignatures">
                {assignatures.items.map((assignatures, index) =>
                  Object.entries(assignatures).map(([id, assignature]) => (
                    <Draggable
                      key={id}
                      draggableId={id}
                      index={index}
                      isDragDisabled={assignature.time === 0}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`item ${assignature.time === 0 ? "disabled" : ""
                            } ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{assignature.id}</p>
                          {!snapshot.isDragging && <p>{assignature.name}</p>}
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
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
        <Droppable isDropDisabled={true} droppableId={id} key={id}>
          {(provided, _) => (
            <section
              className="laboratories"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="grid grid-laboratories">
                {laboratories.items.map((laboratories, index) =>
                  Object.entries(laboratories).map(([id, laboratory]) => (
                    <Draggable
                      key={id}
                      draggableId={id}
                      index={index}
                      isDragDisabled={laboratory.time === 0}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`item ${laboratory.time === 0 ? "disabled" : ""
                            } ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{laboratory.id}</p>
                          {!snapshot.isDragging && <p>{laboratory.name}</p>}
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            </section>
          )}
        </Droppable>
      ))}
    </>
  );
}

export function TeachersDraggable({ teachers }) {
  return (
    <>
      {Object.entries(teachers).map(([id, teachers]) => (
        <Droppable isDropDisabled={true} droppableId={id} key={id}>
          {(provided, _) => (
            <section
              className="teachers"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="grid grid-teachers">
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
                          className={`item ${teacher.time === 0 ? "disabled" : ""
                            } ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{teacher.id}</p>
                          {!snapshot.isDragging && <p>{`${teacher.firstName} ${teacher.lastName}`}</p>}
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            </section>
          )}
        </Droppable>
      ))}
    </>
  );
}
