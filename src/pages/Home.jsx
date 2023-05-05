import { Container } from "postcss";
import Header from "../components/Header";
import CourseBlock from '../components/CourseBlock';
import { func } from "prop-types";

import '../css/Home.css'

const careers = [
  { id: 1, name: 'Ing. Civil en Computación e Informatica', numSemestersWithoutSchedule: 1},
  { id: 2, name: 'Ing. Civil Industrial', numSemestersWithoutSchedule: 2 }
];

const numSemesters = 11;

const courses = [
  [
    {code: 'MA067', course: 'INTRODUCCION AL CALCULO' },
    {code: 'MA069', course: 'INTRODUCCION AL ALGEBRA' },
    {code: 'CC198', course: 'INTRODUCCION A INGENIERIA INFORMATICA' },
    {code: 'CC210', course: 'TALLER DE DESARROLLO PERSONAL' },
    {code: 'CC199', course: 'TALLER DE PROGRAMACION I' },
  ],
  [
    {code: 'MA601', course: 'CALCULO I'},
    {code: 'MA611', course: 'ALGEBRA I'},
    {code: 'FI035', course: 'INTRODUCCION A LA FISICA'},
    {code: 'CC206', course: 'INTRODUCCION AL TRABAJO EN PROYECTOS'},
    {code: 'CC208', course: 'TALLER DE PROGRAMACION II'},
  ],
  [
    {code: 'MA602', course: 'CALCULO II'},
    {code: 'MA612', course: 'ALGEBRA II'},
    {code: 'FI601', course: 'MECANICA CLASICA'},
    {code: 'CC209', course: 'PROGRAMACION ORIENTADA A OBJETOS'},
    {code: 'CC211', course: 'FUNDAMENTOS DE LENGUAJES DE PROGRAMACION'},
  ],
  [
    {code: 'MA603', course: 'CALCULO III'},
    {code: 'MA220', course: 'ECUACIONES DIFERENCIALES'},
    {code: 'IE078', course: 'ELECTRICIDAD Y SISTEMAS DIGITALES'},
    {code: 'CC222', course: 'ALGORITMOS Y ESTRUCTURAS DE DATOS'},
    {code: 'CC091', course: 'PROYECTO I'},
    {code: 'DE181', course: 'TALLER DE COMUNICACION ORAL Y ESCRITA'},
  ],
  [
    {code: 'FI604', course: 'ELECTROMAGNETISMO'},
    {code: 'MA424', course: 'ESTADISTICA Y PROBABILIDAD'},
    {code: 'CC082', course: 'ARQUITECTURA DE COMPUTADORES'},
    {code: 'CC212', course: 'TECNOLOGIA DE OBJETOS'},
    {code: 'CC083', course: 'TALLER DE TECNICAS DE PROGRAMACION'},
    {code: 'CC214', course: 'TALLER DE ETICA PROF. Y RESPONS. SC. DEL INFORMAT'}
  ],
  [
    {code: 'CC052', course: 'TECNOLOGIA WEB'},
    {code: 'IN056', course: 'GESTION DE EMPRESA'},
    {code: 'CC359', course: 'SISTEMAS OPERATIVOS'},
    {code: 'CC415', course: 'BASES DE DATOS'},
    {code: 'CC216', course: 'PROYECTO II'},
    {code: 'DI165', course: 'INGLES I'}
  ],
  [
    {code: 'CC052', course: 'TECNOLOGIA WEB'},
    {code: 'IN056', course: 'GESTION DE EMPRESA'},
    {code: 'CC359', course: 'SISTEMAS OPERATIVOS'},
    {code: 'CC415', course: 'BASES DE DATOS'},
    {code: 'CC216', course: 'PROYECTO II'},
    {code: 'DI165', course: 'INGLES I'}
  ],
  [
    {code: 'CC052', course: 'TECNOLOGIA WEB'},
    {code: 'IN056', course: 'GESTION DE EMPRESA'},
    {code: 'CC359', course: 'SISTEMAS OPERATIVOS'},
    {code: 'CC415', course: 'BASES DE DATOS'},
    {code: 'CC216', course: 'PROYECTO II'},
    {code: 'DI165', course: 'INGLES I'}
  ]
];

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
    <div className="prev-malla overflow-auto blue-border rounded">
      <div className="pt-2 pb-2">
          <h2 className="text-center m-0">Malla curricular</h2>
      </div>
      <div className="d-flex p-2 gap-1">
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
