import Header from "../components/Header";
import CourseBlock from "../components/CourseBlock";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "../css/Home.css";
import { Courses, Careers } from "../firebase/Data";

const numSemesters = 11;

export function CareerSelector({ careers, setSelectedCareer }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleCareerClick = (event) => {
    setSelectedCareer(event.target.id);
    console.log(setSelectedCareer);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchResults = careers.filter((career) =>
    career.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="careers-container overflow-auto blue-border p-3">
      <div className="input-icon rounded gap-2">
        <span className="icon">
          <FaSearch style={{ paddingBlock: 0, marginBlock: "auto" }} />
        </span>
        <input
          type="text"
          className="form-control rounded"
          placeholder="Buscar"
          aria-label="Buscar"
          aria-describedby="search-addon"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className="results-container mt-2 d-flex flex-column justify-content-around gap-2">
        {searchResults.map((career, index) => (
          <div
            key={index}
            className="career grey-border"
            id={career.id}
            onClick={(event) => setSelectedCareer(event.target.id)}
          >
            <div className="m-3">
              <p className="text-uppercase">{career.name}</p>
              <strong>Semestres sin horario: </strong>{" "}
              <span id="cant-sin-horario">
                {career.numSemestersWithoutSchedule}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ViewMalla({ courses }) {
  return (
    <div className="prev-malla blue-border rounded">
      <div className="pt-2 pb-2">
        <h2 className="text-center m-0">Malla curricular</h2>
      </div>
      <div className="d-flex overflow-auto p-2 gap-1">
        {courses.map((semester, index) => (
          <div key={index} className="column d-flex flex-column gap-1">
            <p className="text-center">Semestre {index + 1}</p>
            {semester.map((courses, index) => (
              <CourseBlock
                key={index}
                code={courses.code}
                title={courses.course}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SemestersButtons({ numSemesters }) {
  const semesters = [];

  // Generar un array con el número de semestres
  for (let i = 1; i <= numSemesters; i++) {
    semesters.push(i);
  }

  return (
    <div className="semester-selector gap-1">
      {semesters.map((semester) => (
        <button
          key={semester}
          type="button"
          className="btn text-nowrap border border-2 border-secondary rounded btn-blue"
        >
          Semestre {semester}
        </button>
      ))}
    </div>
  );
}

export function Home() {
  const [selectedCareer, setSelectedCareer] = useState(Careers[0].id);
  const [careerCourses, setCareerCourses] = useState(
    Courses.find((item) => item.id == selectedCareer).malla
  );
  

  return (
    <>
    {/* TODO: Mejorar todo */}
      <Header title={"Home"} />
      <main className="main-home">
        {/* <div> */}
        <div className="career-selector-container">
          <CareerSelector
            careers={Careers}
            setSelectedCareer={setSelectedCareer}
          />
        </div>
        {/* <div className="gap-3"> */}
        {/* <div className="d-flex gap-3 flex-column justify-content-between"> */}
        <ViewMalla courses={careerCourses} />
        <div className="semester-selector-container blue-border rounded p-3 gap-1">
          <h2 className="text-center m-0 mb-2">Seleccionar Semestre</h2>
          <SemestersButtons numSemesters={numSemesters} />
        </div>
      </main>
    </>
  );
}
