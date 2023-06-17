import Header from "../components/Header";
import { useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import "../css/Home.css";
import "../css/Modal.css";
import { Courses, Careers, Assignments, BlocksDuration } from "../firebase/Data";
import { CarreraProvider, CarreraContext } from "../contexts/CarreraContext";
import { useEffect } from "react";
import CourseBlock from "../components/CourseBlock"

function CareerSelector() {
  const { listCarrerasJC, setSelectedCarreraID, selectedCarreraID, loadingCarreras } = useContext(CarreraContext);

  const [searchTerm, setSearchTerm] = useState("");

  const handleCareerClick = (event) => {
    setSelectedCarreraID(event.currentTarget.id); //CONTEXTO
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchResults = Object.entries(listCarrerasJC).filter((item) =>
    item[1].val().nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="careers-container blue-border">
      <div className="input-search">
        <span className="icon">
          <FaSearch style={{ paddingBlock: 0, marginBlock: "auto" }} />
        </span>
        <input
          type="text"
          placeholder="Buscar"
          aria-label="Buscar"
          aria-describedby="search-addon"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className="results-container">
        {loadingCarreras &&
          <>
            {Array(5).fill(null).map((_, i) => (
            <div key={i} className="career-btn-loading grey-border">
              <div className="loading-animation"></div>
            </div>
            ))}
          </>
        }
        {!loadingCarreras && searchResults.map((career) => (
          <div
            key={career[1].key}
            className={`career-btn grey-border ${selectedCarreraID === career[1].key ? "active" : ""}`}
            id={career[1].key}
            onClick={handleCareerClick}
          >
            <p className="text-uppercase">{career[1].val().nombre}</p>
            {/* <strong>Semestres sin horario: </strong>
            <span id="cant-sin-horario">
              {career[1].numSemestersWithoutSchedule}
            </span> */}
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewMalla() {
  const { setSelectedPlan, selectedPlan, selectedCarrera } = useContext(CarreraContext); //CONTEXTO
  
  if (!selectedCarrera) {
    return (
      <div className="empty">
        <h2>Seleccione una Carrera</h2>
      </div>
    );
  }

  const planes = selectedCarrera.child('plan de estudio')
  const planesKeys = Object.keys(planes.val());
  
  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value)
  };

  return (
    <>
      <div className="career-header"> 
        <h2 className="career-title">{selectedCarrera.val().nombre}</h2>
        <select name="plan" id="plan" defaultValue={'DEFAULT'} onChange={handlePlanChange}>
          <option value="DEFAULT" disabled> Seleccione un plan </option>
          {planesKeys.map(plan => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>
      </div>
      {selectedPlan && 
      <div className="prev-malla blue-border">
        <h2 className="prev-malla-title">Malla curricular</h2>
        <div className="semesters-container">
          {Object.keys(planes.child(selectedPlan).child('semestres').val()).map((semester, index1) => (
            <div key={semester}>
              <p className="semester-title">Semestre {semester}</p>
              <div className="semester-courses">
                {Object.keys(planes.child(selectedPlan).child('semestres').child(semester).val()).map((course, index2) => (
                  <CourseBlock
                    key={course}
                    code={course}
                    // title={course.course} NOMBRE
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      }
    </>
  );
}

function Modal({ closeModal }) {
  const carreraContext = useContext(CarreraContext); //CONTEXTO
  const { selectedCarreraID, selectedSemestre } = carreraContext; //CONTEXTO

  const year = "2022";
  const scheduleId = `${selectedCarreraID}-${selectedSemestre}-${year}`;
  const schedule = Assignments[scheduleId];

  const scheduleMatrix = [];
  for (let i = 0; i < 14; i++) {
    scheduleMatrix[i] = ["", "", "", "", ""];
  }

  const getDayIndex = (dia) => {
    switch (dia) {
      case "L":
        return 0;
      case "M":
        return 1;
      case "J":
        return 2;
      case "V":
        return 3;
      default:
        return -1;
    }
  };

  schedule.items.forEach((item) => {
    const { block, day, asi, lab, doc } = item;
    const blockIndex = block - 1;
    const dayIndex = getDayIndex(day);
    scheduleMatrix[blockIndex][dayIndex] = { asi, lab, doc };
  });

  const date = new Date();
  date.setHours(8);
  date.setMinutes(0);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={() => closeModal(false)}>
          <AiOutlineClose />
        </span>
        <div className="modal-title">
          <h2>Previsualización de horario para semestre {selectedSemestre}</h2>
        </div>
        <div className="modal-body">
          {schedule ? (
            <div className="preview-schedule-container">
              <table className="preview-schedule">
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
                  {scheduleMatrix.map((scheduleBlock, blockIndex) => {
                    const { nowHours, nowMinutes, newHours, newMinutes } =
                      BlocksDuration({
                        date: date,
                        block: blockIndex++,
                      });

                    return (
                      <tr key={blockIndex}>
                        <td>
                          <p>{blockIndex}</p>
                          <p>{`${nowHours}:${nowMinutes} - ${newHours}:${newMinutes}`}</p>
                        </td>
                        {scheduleBlock.map((schedule, dayIndex) => (
                          <td key={dayIndex}>
                            {schedule.asi && (
                              <div>
                                <p>{schedule.asi}</p>
                                <hr />
                                <p>{schedule.lab}</p>
                                <hr />
                                <p>{schedule.doc}</p>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-schedule">No hay horario definido</div>
          )}
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => closeModal(false)}>
            Cancelar
          </button>
          <button className="edit-btn">Ir a editar</button>
        </div>
      </div>
    </div>
  );
}

function SemestersButtons() {
  const carreraContext = useContext(CarreraContext); //CONTEXTO
  const { setSelectedSemestre, selectedCarreraCursos } = carreraContext; //CONTEXTO

  const [openModal, setOpenModal] = useState(false);

  const semesters = [...Array(selectedCarreraCursos.length).keys()];

  const handleSemesterClick = (semester) => {
    setSelectedSemestre(semester); //CONTEXTO
    setOpenModal(true);
  };

  if (!selectedCarreraCursos) {
    return null;
  }
  return (
    <>
      <h2 className="semesters-title">Semestres</h2>
      <div className="semester-selector-container">
        <div className="semester-selector">
          {semesters.map((semester) => {
            semester++;
            return (
              <button
                key={semester}
                type="button"
                className="semester-btn"
                onClick={() => handleSemesterClick(semester)}
              >
                Semestre {semester}
              </button>
            );
          })}
          {openModal && <Modal closeModal={setOpenModal} />}
        </div>
      </div>
    </>
  );
}

export function Home() {
  const tipo = "jefe";
  return (
    <>
      {tipo === "jefe" && (
        <>
          <Header title={"Home"} />
          <main className="main-home">
            <div className='career-selector-container'>
              <CareerSelector />
            </div>
            <ViewMalla />
            <SemestersButtons />
          </main>
        </>
      )}
      {tipo === "estudiante" && null}
    </>
  );
}
