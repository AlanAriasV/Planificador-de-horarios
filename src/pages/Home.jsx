import Header from "../components/Header";
import CourseBlock from "../components/CourseBlock";
import { useState, useEffect, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import "../css/Home.css";
import "../css/Modal.css";
import { Courses, Careers, Assignments } from "../firebase/Data";
import { CarreraProvider, CarreraContext  } from '../contexts/CarreraContext';


export function CareerSelector() {
  const carreraContext = useContext(CarreraContext); //CONTEXTO
  const { setCarreraById, selectedCarreraID } = carreraContext; //CONTEXTO

  const [searchTerm, setSearchTerm] = useState("");

  const handleCareerClick = (event) => {
    setCarreraById(event.currentTarget.id) //CONTEXTO
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchResults = Object.entries(Careers).filter((item) =>
    item[1].name.toLowerCase().includes(searchTerm.toLowerCase())
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
        {searchResults.map((career) => {
          return (
            <div
              key={career[0]}
              className={`career-btn grey-border ${selectedCarreraID === career[0] ? 'active':''}`}
              id={career[0]}
              onClick={handleCareerClick}
            >
              <p className="text-uppercase">{career[1].name}</p>
              <strong>Semestres sin horario: </strong>{" "}
              <span id="cant-sin-horario">
                {career[1].numSemestersWithoutSchedule}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function title() {
  const title = document.createElement("div");
  title.appendChild;
}

export function ViewMalla() {
  const carreraContext = useContext(CarreraContext); //CONTEXTO
  const { selectedCarreraCursos, selectedCarrera } = carreraContext; //CONTEXTO

  if (!selectedCarreraCursos) {
    return (
      <div className="empty">
        <h2>Seleccione una Carrera</h2>
      </div>);
  }
  return (
    <>
    <h2 className="career-title">{selectedCarrera.name}</h2>
    <div className="prev-malla blue-border">
      <h2 className="prev-malla-title">Malla curricular</h2>
      <div className="semesters-container">
          {selectedCarreraCursos.map((semester, index1) => (
            <div key={index1}>
              <p className="semester-title">Semestre {index1 + 1}</p>
              <div className="semester-courses">
                {semester.map((course, index2) => (
                  <CourseBlock key={index2} code={course.code} title={course.course}/>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
    </>
  );
}

export function Modal({ closeModal }) {
  const carreraContext = useContext(CarreraContext); //CONTEXTO
  const { selectedCarreraID, selectedSemestre } = carreraContext; //CONTEXTO

  const year = '2022'
  const scheduleId = `${selectedCarreraID}-${selectedSemestre}-${year}`;
  const schedule = Assignments[scheduleId]

  const scheduleMatrix = [];
  for (let i = 0; i < 14; i++) {
    scheduleMatrix[i] = ['', '', '', '', ''];
  }

  const getDayIntex = (dia) => {
    switch (dia) {
      case 'L':
        return 0;
      case 'M':
        return 1;
      case 'J':
        return 2;
      case 'V':
        return 3;
      default:
        return -1;
    }
  };

  schedule.items.forEach(item => {
    const { block, day, asi, lab, doc } = item;
    const blockIndex = block - 1; 
    const dayIndex = getDayIntex(day); 
    scheduleMatrix[blockIndex][dayIndex] = { asi, lab, doc };
  });

  return (
    <div className='modal'>
        <div className='modal-content'>
            <span className='modal-close' onClick={() => closeModal(false)}>
                <AiOutlineClose/>
            </span>
            <div className='modal-title'>
                <h2>Previsualización de horario para semestre {selectedSemestre}</h2>
            </div>
            <div className='modal-body'>
            {schedule ? (
              <div className='schedule'>
                <div>
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
                    {scheduleMatrix.map((scheduleBlock, blockIndex) => (
                      <tr key={blockIndex}>
                        <td>{blockIndex + 1}</td>
                        {scheduleBlock.map((schedule, dayIndex) => (
                          <td key={dayIndex}>
                            {schedule.asi && (
                              <div>
                                <p>Asignatura: {schedule.asi}</p>
                                <p>Laboratorio: {schedule.lab}</p>
                                <p>Docente: {schedule.doc}</p>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            </div >
            ) : (
              <div className="no-schedule">No hay horario definido</div>
            )}
            </div>
            <div className='modal-footer'>
                <button className='cancel-btn' onClick={() => closeModal(false)}>Cancelar</button>
                <button className='edit-btn'>Ir a editar</button>
            </div>
        </div>
    </div>
  )
}

export function SemestersButtons() {
  const carreraContext = useContext(CarreraContext); //CONTEXTO
  const { setSelectedSemestre, selectedCarreraCursos } = carreraContext; //CONTEXTO
  
  const [openModal, setOpenModal] = useState(false);

  const semesters = [...Array(selectedCarreraCursos.length).keys()];

  const handleSemesterClick = (semester) => {
    setSelectedSemestre(semester); //CONTEXTO
    setOpenModal(true);
  };

  if (!selectedCarreraCursos) {
    return (null)
  }
  return (
    <>
    <h2 className="semesters-title">Semestres</h2>
    <div className="semester-selector-container">
      <div className="semester-selector">
        {semesters.map((semester) => {
          semester++;
          return (
              <button key={semester} type="button" className="semester-btn" onClick={() => handleSemesterClick(semester)}>
                Semestre {semester}
              </button>
          );
        })}
        {openModal && <Modal closeModal={setOpenModal}/>}
      </div>
    </div>
    </>
  );
}

export function Home() {
  return (
    <CarreraProvider>
      <Header title={"Home"} />
      <main className="main-home">
        <div className="career-selector-container">
          <CareerSelector />
        </div>
          <ViewMalla/>
          <SemestersButtons/>
      </main>
    </CarreraProvider>
  );
}
