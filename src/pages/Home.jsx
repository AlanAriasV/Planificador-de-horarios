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
  const { listCarreras, setSelectedCarreraID, selectedCarreraID, loadingCarreras } = useContext(CarreraContext);

  const [searchTerm, setSearchTerm] = useState("");

  const handleCareerClick = (event) => {
    setSelectedCarreraID(event.currentTarget.id); //CONTEXTO
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchResults = Object.entries(listCarreras).filter((item) =>
    item[1].val().nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="careers-container blue-border">
      <div className="input-search">
        <span className="icon">
          <FaSearch style={{ paddingBlock: 0, marginBlock: "auto" }} />
        </span>
        <input
          className="search-box"
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
  const { setSelectedPlan, selectedPlan, selectedCarrera, asignaturas } = useContext(CarreraContext); //CONTEXTO

  if (!selectedCarrera) {
    return (
      <div className="empty">
        <h2>Seleccione una Carrera</h2>
      </div>
    );
  }

  const planes = selectedCarrera.child('plan de estudio');

  const tableMalla = () => {

    const columnCourses = ({ semestres, nSemestre }) => {

      const listColumn = []
      const semestreVal = semestres.child(nSemestre).val();

      for (const id in semestreVal) {
        // [DataSnapshot]
        for (const asignatura of asignaturas) {
          if (asignatura.key === id) {
            listColumn.push(
              <CourseBlock
                key={id}
                code={id}
                title={asignatura.val().nombre}
              />
            )
          }
        }
      }

      return (
        <>
          {listColumn}
        </>
      )
    }

    const listElements = [];
    const semestres = planes.child(`${selectedPlan}/semestres`);


    for (const nSemestre in semestres.val()) {
      listElements.push(
        <div key={nSemestre}>
          <p className="semester-title">Semestre {nSemestre}</p>
          <div className="semester-courses">
            {
              columnCourses({ semestres: semestres, nSemestre: nSemestre })
            }
          </div>
        </div>
      )
    }

    return (
      <>
        {listElements}
      </>
    )
  }

  return (
    <>
      <div className="career-header">
        <h2 className="career-title">{selectedCarrera.val().nombre}</h2>
        {Selector('Seleccione un plan', 'plan', planes.val(), setSelectedPlan)}
      </div>
      {selectedPlan &&
        <div className="prev-malla blue-border">
          <h2 className="prev-malla-title">Malla curricular</h2>
          <div className="semesters-container" >
            {
              tableMalla()
            }
          </div>
        </div>
      }
    </>
  );
}

function Modal({ closeModal }) {
  const { selectedSemestre } = useContext(CarreraContext); //CONTEXTO

  const schedule = selectedSemestre.child('días')

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={() => closeModal(false)}>
          <AiOutlineClose />
        </span>
        <div className="modal-title">
          <h2>Previsualización de horario para semestre {selectedSemestre.key}</h2>
        </div>
        <div className="modal-body">
          {schedule ? (
            <div className="preview-schedule-container">
              {SchedulePreview(schedule)}
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
  const { setSelectedSemestre, selectedCarrera, selectedPlan, selectedCarreraYear, setSelectedCarreraYear, selectedJornada, setSelectedJornada } = useContext(CarreraContext); //CONTEXTO

  const [openModal, setOpenModal] = useState(false);

  if (!selectedPlan) {
    return null;
  }


  const plan = selectedCarrera.child('plan de estudio/' + selectedPlan);

  const handleSemesterClick = (semestres, semestre) => {
    setSelectedSemestre(semestres.child(semestre));
    setOpenModal(true);
  };

  const semestersButtons = (year) => {

    //TODO: HACER DROPDOWN PARA MITAD DE AÑO!!!

    const sYear = new Date();

    const half = sYear.getMonth() < 6 ? 1 : 2;

    const semestres = plan.child('horarios/' + year + '/' + half + '/semestres');

    const btnsList = []
    for (const semestre in semestres.val()) {
      btnsList.push(
        <button
          key={semestre}
          type="button"
          className={`semester-btn ${semestres.val()[semestre].estado.toLowerCase()}`}
          onClick={() => handleSemesterClick(semestres, semestre)}
        >
          Semestre {semestre}
        </button>)
    }

    return (
      <div className="semester-selector-container">
        < div className="semester-selector" >
          {btnsList}
        </ div>
      </div >)
  };

  return (
    <>
      <div className="semesters-btn-header">
        <h2 className="semesters-title">Semestres</h2>
        <div className="dropdowns-container">
          {Selector('Seleccione un año', 'year', plan.val()['horarios'], setSelectedCarreraYear)}
          {Selector('Seleccione una jornada', 'jornada', plan.val()['jornadas'], setSelectedJornada, 'show_values')}
        </div>
        <div className="legend-colors">
          <div>
            <div className="square completado"></div>
            <span>Completo</span>
          </div>
          <div>
            <div className="square pendiente"></div>
            <span>Pendiente</span>
          </div>
          <div>
            <div className="square incompleto"></div>
            <span>Incompleto</span>
          </div>
        </div>
      </div >

      {selectedCarreraYear && selectedJornada &&
        semestersButtons(selectedCarreraYear)
      }
      {openModal && <Modal closeModal={setOpenModal} />}
    </>
  );
}



function SchedulePreview(daysArray) {
  const date = new Date();
  date.setHours(8);
  date.setMinutes(0);

  const schedule = daysArray;

  const scheduleMatrix = [];
  for (let i = 0; i < 14; i++) {
    scheduleMatrix[i] = ["", "", "", "", ""];
  }

  const dayIndexList = {
    "L": 0,
    "M": 1,
    "X": 2,
    "J": 3,
    "V": 4,
  };

  schedule.forEach(day => {
    const dayIndex = dayIndexList[day.key];
    day.forEach(block => {
      const blockIndex = block.key - 1;
      scheduleMatrix[blockIndex][dayIndex] = block.val();
    })
  });

  return (
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
                  {schedule && (
                    <div className={`${schedule['protegido'] ? 'protegido':''}`}>
                      {/* PENDIENTE */}
                    </div>
                  )}
                </td>
              )
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function Selector(defaultText, identifier, selectableItems, setSelectedValue, mode = 'show_keys') {
  const optionList = []
  if (mode === 'show_keys')
    for (const option in selectableItems) {
      optionList.push(<option key={option} value={option}>{option}</option>)
    }
  else
    for (const option of selectableItems) {
      optionList.push(<option key={option} value={option}>{option}</option>)
    }
  return (
    <select className="dropdown" defaultValue="default" onChange={(e) => setSelectedValue(e.target.value)} name={identifier} id={identifier}>
      <option value="default" disabled>{defaultText}</option>
      {optionList.map((option) => option)}
    </select>
  )
}

export function Home() {
  const { userData, setSelectedCarreraYear, selectedCarreraYear, setSelectedPeriodo, selectedPeriodo} = useContext(CarreraContext);
  return (
    <>
    <Header title={"Home"} />
    {userData && userData.type === "jefe de carrera" && (
      <main className="main-home jefe-layout">
        <div className='career-selector-container'>
          <CareerSelector />
        </div>
        <ViewMalla />
        <SemestersButtons />
      </main>
    )}
    {userData && userData.type === "estudiante" && (
      <main className="main-home student-layout">
        <div>
        <h2 className="">Horario de {userData.user.val()['nombre'] + ' ' + userData.user.val()['apellido']}</h2>
        {Selector('Seleccione el año', 'year', userData.user.val()['horarios'], setSelectedCarreraYear)}
        {selectedCarreraYear && 
          Selector('Seleccione el periodo', 'periodo', userData.user.val()['horarios'][selectedCarreraYear], setSelectedPeriodo)
        }
        {selectedCarreraYear && selectedPeriodo &&
         SchedulePreview(userData.user.child(`horarios/${selectedCarreraYear}/${selectedPeriodo}/días`))
        }
        </div>
      </main>
    )}
    </>
  );
}
