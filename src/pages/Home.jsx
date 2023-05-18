import Header from "../components/Header";
import CourseBlock from "../components/CourseBlock";
// import CareerContext from "../context/CareerContext"
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

import "../css/Home.css";
import { Courses, Careers } from "../firebase/Data";

export function CareerSelector({ setSelectedCareerID }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleCareerClick = (event) => {
    setSelectedCareerID(event.currentTarget.id);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchResults = Object.entries(Careers).filter((item) =>
    item[1].name.toLowerCase().includes(searchTerm.toLowerCase())
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
        {searchResults.map((career) => {
          return (
            <div
              key={career[0]}
              className="career-btn grey-border"
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

export function ViewMalla({ courses }) {
  return (
    <div className="prev-malla blue-border">
      <h2 className="prev-malla-title">Malla curricular</h2>
      <div className="semesters-container">
        <table>
          <thead>
            <tr>
              {courses.map((semester, index) => (
                <th key={index}>
                  <p className="semester-title">Semestre {index + 1}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="semesters-container overflow">
            {courses.map((semester, index) => (
              <tr key={index} style={{display: "table-column"}}>
                {courses.map((course, index) => (
                  <td key={index}>
                    <CourseBlock code={course.code} title={course.course} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SemestersButtons({ numSemesters }) {
  const semesters = [...Array(numSemesters).keys()];

  return (
    <div className="semester-selector">
      {semesters.map((semester) => {
        semester++;
        return (
          <button key={semester} type="button" className="semester-btn">
            Semestre {semester}
          </button>
        );
      })}
    </div>
  );
}

export function Home() {
  const [defaultCareer, setSelectedCareerID] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState({});
  const [careerCourses, setCareerCourses] = useState([]);

  useEffect(() => {
    if (defaultCareer === null) return;
    setSelectedCareer(Careers[defaultCareer]);
    setCareerCourses(Courses[defaultCareer].malla);
  }, [defaultCareer]);

  return (
    <>
      <Header title={"Home"} />
      <main className="main-home">
        <div className="career-selector-container">
          <CareerSelector setSelectedCareerID={setSelectedCareerID} />
        </div>
        {defaultCareer !== null && (
          <>
            <h2 className="career-title">{selectedCareer.name}</h2>
            <ViewMalla courses={careerCourses} />
            <h2 className="semesters-title">Semestres</h2>
            <div className="semester-selector-container">
              <SemestersButtons numSemesters={careerCourses.length} />
            </div>
          </>
        )}
        {defaultCareer === null && (
          <div className="empty">
            <h2>Seleccione una Carrera</h2>
          </div>
        )}
      </main>
    </>
  );
}
