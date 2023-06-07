import { v4 as uuid } from "uuid"

export const Blocks = {}

const DaysList = {
  1: 'L',
  2: 'M',
  3: 'X',
  4: 'J',
  5: 'V',
}

// TEMP
for (let day = 1; day < 6; day++) {
  Array(14).fill([day, 'block']).forEach((v, i) => {
    let day = DaysList[v[0]]
    // let item = v[1]
    let number = i + 1
    let sheltered = DaysList[v[0]] === 'J' && [9, 10].includes(number);
    Blocks[uuid()] = {
      day: day,
      duration: 45,
      items: [/* { [uuid()]: { id: number, name: item + number, time: 270 } } */],
      number: number,
      sheltered: sheltered
    }
  })
}

export function BlocksDuration({ date, block }) {
  let nowHours = date.getHours();
  let nowMinutes = date.getMinutes();
  nowMinutes = nowMinutes < 10 ? `0${nowMinutes}` : nowMinutes

  date.setMinutes(date.getMinutes() + 45);

  let newHours = date.getHours();
  let newMinutes = date.getMinutes();
  newMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes

  if ([2, 4].includes(block)) date.setMinutes(date.getMinutes() + 10)
  if ([6].includes(block)) date.setMinutes(date.getMinutes() + 115)
  if ([8, 10, 12].includes(block)) date.setMinutes(date.getMinutes() + 5)


  return { nowHours, nowMinutes, newHours, newMinutes };
}

export const Asignatures = {
  [uuid()]: {
    items: [
      { [uuid()]: { id: 'CC218', name: 'INGENIERÍA DE SOFTWARE I', time: 270, type: 'asi' } },
      { [uuid()]: { id: 'CC219', name: 'TALLER DE APLICACIONES WEB', time: 270, type: 'asi' } },
      { [uuid()]: { id: 'CC093', name: 'COMUNICACIÓN DE DATOS Y REDES', time: 270, type: 'asi' } },
      { [uuid()]: { id: 'CC223', name: 'SISTEMAS DE INFORMACIÓN', time: 270, type: 'asi' } },
      { [uuid()]: { id: 'CC094', name: 'TEORÍA DE LA COMPUNTACIÓN', time: 270, type: 'asi' } },
      { [uuid()]: { id: 'DI166', name: 'INGLÉS II', time: 270, type: 'asi' } },
    ]
  }
}

export const Courses = {
  ICCI: {
    malla: [
      [
        { code: 'MA067', course: 'INTRODUCCION AL CALCULO' },
        { code: 'MA069', course: 'INTRODUCCION AL ALGEBRA' },
        { code: 'CC198', course: 'INTRODUCCION A INGENIERIA INFORMATICA' },
        { code: 'CC210', course: 'TALLER DE DESARROLLO PERSONAL' },
        { code: 'CC199', course: 'TALLER DE PROGRAMACION I' }
      ],
      [
        { code: 'MA601', course: 'CALCULO I' },
        { code: 'MA611', course: 'ALGEBRA I' },
        { code: 'FI035', course: 'INTRODUCCION A LA FISICA' },
        { code: 'CC206', course: 'INTRODUCCION AL TRABAJO EN PROYECTOS' },
        { code: 'CC208', course: 'TALLER DE PROGRAMACION II' }
      ],
      [
        { code: 'MA602', course: 'CALCULO II' },
        { code: 'MA612', course: 'ALGEBRA II' },
        { code: 'FI601', course: 'MECANICA CLASICA' },
        { code: 'CC209', course: 'PROGRAMACION ORIENTADA A OBJETOS' },
        { code: 'CC211', course: 'FUNDAMENTOS DE LENGUAJES DE PROGRAMACION' }
      ],
      [
        { code: 'MA603', course: 'CALCULO III' },
        { code: 'MA220', course: 'ECUACIONES DIFERENCIALES' },
        { code: 'IE078', course: 'ELECTRICIDAD Y SISTEMAS DIGITALES' },
        { code: 'CC222', course: 'ALGORITMOS Y ESTRUCTURAS DE DATOS' },
        { code: 'CC091', course: 'PROYECTO I' },
        { code: 'DE181', course: 'TALLER DE COMUNICACION ORAL Y ESCRITA' }
      ],
      [
        { code: 'FI604', course: 'ELECTROMAGNETISMO' },
        { code: 'MA424', course: 'ESTADISTICA Y PROBABILIDAD' },
        { code: 'CC082', course: 'ARQUITECTURA DE COMPUTADORES' },
        { code: 'CC212', course: 'TECNOLOGIA DE OBJETOS' },
        { code: 'CC083', course: 'TALLER DE TECNICAS DE PROGRAMACION' },
        { code: 'CC214', course: 'TALLER DE ETICA PROF. Y RESPONS. SC. DEL INFORMAT' }
      ],
      [
        { code: 'CC052', course: 'TECNOLOGIA WEB' },
        { code: 'IN056', course: 'GESTION DE EMPRESA' },
        { code: 'CC359', course: 'SISTEMAS OPERATIVOS' },
        { code: 'CC415', course: 'BASES DE DATOS' },
        { code: 'CC216', course: 'PROYECTO II' },
        { code: 'DI165', course: 'INGLES I' }
      ],
      [
        { code: 'CC218', course: 'INGENIERIA DE SOFTWARE I' },
        { code: 'CC219', course: 'TALLER DE APLICACIONES WEB' },
        { code: 'CC093', course: 'COMUNICACION DE DATOS Y REDES' },
        { code: 'CC223', course: 'SISTEMAS DE INFORMACION' },
        { code: 'CC094', course: 'TEORIA DE LA COMPUTACION' },
        { code: 'DI166', course: 'INGLES II' }
      ],
      [
        { code: 'CC224', course: 'INGENIERIA DE SOFTWARE II' },
        { code: 'CC225', course: 'ANALISIS Y DISEÑO DE ALGORITMOS' },
        { code: 'CC106', course: 'SISTEMAS DISTRIBUIDOS' },
        { code: 'CC132', course: 'LABORATORIO DE REDES' },
        { code: 'CC226', course: 'PROYECTO III' },
        { code: 'YY128', course: 'ELECTIVO DE FORMACION PROFESIONAL I' },
        { code: 'CC506', course: 'PRÁCTICA PROFESIONAL I' }
      ]
    ]
  },
  ICI: {
    malla: [
      [
        { code: 'MA067', course: 'INTRODUCCION AL CALCULO' },
        { code: 'MA069', course: 'INTRODUCCION AL ALGEBRA' },
        { code: 'CC198', course: 'INTRODUCCION A INGENIERIA INFORMATICA' },
        { code: 'CC210', course: 'TALLER DE DESARROLLO PERSONAL' },
        { code: 'CC199', course: 'TALLER DE PROGRAMACION I' }
      ],
    ]
  }
};

export const Careers = {
  ICCI: { name: 'Ing. Civil en Computación e Informatica', numSemestersWithoutSchedule: 1 },
  ICI: { name: 'Ing. Civil Industrial', numSemestersWithoutSchedule: 2 }
};

export const Laboratories = {
  [uuid()]: {
    items: [
      { [uuid()]: { id: 'LAB-PAR', department_fk: 'DICI', name: 'PARINACOTA', type: 'lab' } },
      { [uuid()]: { id: 'LAB-POM', department_fk: 'DICI', name: 'POMERAPE', type: 'lab' } },
      { [uuid()]: { id: 'LAB-GUA', department_fk: 'DICI', name: 'GUALLATIRE', type: 'lab' } },
      { [uuid()]: { id: 'LAB-AZU', department_fk: 'DICI', name: 'AZUFRE', type: 'lab' } },
      { [uuid()]: { id: 'LAB-LIC', department_fk: 'DICI', name: 'LICANCABUR', type: 'lab' } },
      { [uuid()]: { id: 'LAB-SOC', department_fk: 'DICI', name: 'SOCOMPA', type: 'lab' } },
      { [uuid()]: { id: 'LAB-AUD', department_fk: 'DICI', name: 'AUDITORIO', type: 'lab' } },
    ]
  }
}

export const Teachers = {
  [uuid()]: {
    items: [
      { [uuid()]: { id: 'DOC-DAP', firstName: 'DIEGO', lastName: 'ARACENA PIZARRO', email: 'DARACENA@ACADEMICOS.UTA.CL', type: 'doc' } },
      { [uuid()]: { id: 'DOC-MAB', firstName: 'MAURICIO', lastName: 'ARRIAGADA BENÍTEZ', email: 'MARRIAGADA@ACADEMICOS.UTA.CL', type: 'doc' } },
      { [uuid()]: { id: 'DOC-REO', firstName: 'ROBERTO', lastName: 'ESPINOSA OLIVA', email: 'RESPINOSA@ACADEMICOS.UTA.CL', type: 'doc' } },
      { [uuid()]: { id: 'DOC-RHA', firstName: 'RAÚL', lastName: 'HERRERA ACUÑA', email: 'RHERRERA@ACADEMICOS.UTA.CL', type: 'doc' } },
      { [uuid()]: { id: 'DOC-HOD', firstName: 'HÉCTOR', lastName: 'OSSANDÓN DÍAZ', email: 'HOSSANDO@UTA.CL', type: 'doc' } },
      { [uuid()]: { id: 'DOC-IRV', firstName: 'IBAR', lastName: 'RAMÍREZ VARAS', email: 'IRAMIREZ@UTA.CL', type: 'doc' } },
      { [uuid()]: { id: 'DOC-RVP', firstName: 'RICARDO', lastName: 'VALDIVIA PINTO', email: 'RVALDIVI@ACADEMICOS.UTA.CL', type: 'doc' } },
    ]
  }
}

export const Assignments = {
  ' ICCI-1-2022': {
    items: [
      { asi: 'CC219', block: 11, day: 'M', lab: 'LAB-PAR', doc: 'DOC-REO' },
      { asi: 'CC219', block: 12, day: 'M', lab: 'LAB-PAR', doc: 'DOC-REO' },
      { asi: 'CC219', block: 11, day: 'J', lab: 'LAB-PAR', doc: 'DOC-REO' },
      { asi: 'CC219', block: 12, day: 'J', lab: 'LAB-PAR', doc: 'DOC-REO' },
      { asi: 'DI116', block: 3, day: 'L', lab: 'LAB-SOC', doc: 'DOC-HOD' },
      { asi: 'DI116', block: 4, day: 'L', lab: 'LAB-SOC', doc: 'DOC-HOD' },
      { asi: 'CC223', block: 11, day: 'V', lab: 'LAB-PAR', doc: 'DOC-RHA' },
      { asi: 'CC223', block: 12, day: 'V', lab: 'LAB-PAR', doc: 'DOC-RHA' },
    ]
  },
  'A/2-2022' : {
    items: [
      { asi: 'CC219', block: 11, day: 'M', lab: 'LAB-PAR', doc: 'DOC-REO' },
      { asi: 'CC219', block: 12, day: 'M', lab: 'LAB-PAR', doc: 'DOC-REO' },
      { asi: 'CC219', block: 11, day: 'J', lab: 'LAB-PAR', doc: 'DOC-REO' },
    ]
  }
};
