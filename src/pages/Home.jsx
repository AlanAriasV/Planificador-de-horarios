import Header from "../components/Header";
import CourseBlock from '../components/CourseBlock';

import '../css/Home.css'
import { courses } from "../firebase/Data";
import { Container } from "react-bootstrap";

const careers = [
  { id: 1, name: 'Ing. Civil en Computación e Informatica', numSemestersWithoutSchedule: 1},
  { id: 2, name: 'Ing. Civil Industrial', numSemestersWithoutSchedule: 2 }
];

const numSemesters = 11;


export function CareerSelector({careers}) {
  return (
    <div className="careers-container overflow-auto blue-border p-3">
      <div className="input-group rounded gap-2">
          <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
          <span className="input-group-text border-0" id="search-addon">
              <i className="fa-solid fa-magnifying-glass"></i>
          </span>
      </div>
      <div className="results-container mt-2 d-flex flex-column justify-content-around gap-2">
        {careers.map((career, index) => (
          <div key={index} className="border border-2 border-secondary rounded p-2 ">
            <div className="m-3">
              <p className="text-uppercase">{career.name}</p>
              <strong>Semestres sin horario: </strong> <span id="cant-sin-horario">{career.numSemestersWithoutSchedule}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ViewMalla({courses}) {
  return (
    <div className="prev-malla blue-border rounded">
      <div className="pt-2 pb-2">
          <h2 className="text-center m-0">Malla curricular</h2>
      </div>
      <div className="d-flex overflow-auto p-2 gap-1">
        {courses.map((semester, index) => (
          <div key={index} className="column d-flex flex-column gap-1">
            <p className="text-center">Semestre {index+1}</p>
            {semester.map((courses, index) => (
              <CourseBlock
                key = {index}
                code = {courses.code}
                title = {courses.course}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SemestersButtons({numSemesters}) {
  const semesters = [];

  // Generar un array con el número de semestres
  for (let i = 1; i <= numSemesters; i++) {
    semesters.push(i);
  }

  return (
    <>
    {semesters.map((semester) => (
      <button type="button" class="btn text-nowrap border border-2 border-secondary rounded">Semestre {semester}</button>
    ))}
    </>
  )
}

export function Home() {
  return (
    <>
      <Header 
        title={'Home'} 
      />
      <main className="container">
        <div className="content justify-content-center gap-5">
          <div className="career-selector-container">
            <CareerSelector
              careers={careers}
            />
          </div>
          <div className="gap-3">
            <div className="d-flex gap-3 flex-column justify-content-between">
              <ViewMalla
                courses={courses}
              />
              <div class="semester-selector blue-border rounded p-3 gap-1">
                <SemestersButtons
                  numSemesters = {numSemesters}  
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
