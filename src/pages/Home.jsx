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
    setSelectedCareer(event.target);
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
      <div className="results-container mt-2 d-flex flex-column justify-content-around gap-2">
        {searchResults.map((career, index) => (
          <div
            key={index}
            className="career-btn grey-border"
            id={career.id}
            onClick={handleCareerClick}
          >
            <p className="text-uppercase">{career.name}</p>
            <strong>Semestres sin horario: </strong>{" "}
            <span id="cant-sin-horario">
              {career.numSemestersWithoutSchedule}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ViewMalla({ courses }) {
  return (
    <div className="prev-malla blue-border">
      <h2 className="prev-malla-title">Malla curricular</h2>
      <div className="semesters-container">
        {courses.map((semester, index) => (
          <div key={index} className="semester-column">
            <p className="semester-title">Semestre {index + 1}</p>
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
    <div className="semester-selector">
      {semesters.map((semester) => (
        <button
          key={semester}
          type="button"
          className="semester-btn"
        >
          Semestre {semester}
        </button>
      ))}
    </div>
  );
}

export function Home() {
  const defaultCareer = Careers[0];
  const [selectedCareer, setSelectedCareer] = useState(defaultCareer.id);
  const [careerCourses, setCareerCourses] = useState(
    Courses.find((item) => item.id == selectedCareer).malla
  );
  

  return (
    <>
    {/* TODO: Mejorar todo */}
      <Header title={"Home"} />
      <main className="main-home">
        <div className="career-selector-container">
          <CareerSelector
            careers={Careers}
            setSelectedCareer={setSelectedCareer}
          />
        </div>
        <h2 className="career-title">{defaultCareer.name}</h2>
        <ViewMalla courses={careerCourses} />
        <h2 className="semesters-title">Semestres</h2>
        <div className="semester-selector-container">
          <SemestersButtons numSemesters={numSemesters} />
        </div>
      </main>
    </>
  );
}
