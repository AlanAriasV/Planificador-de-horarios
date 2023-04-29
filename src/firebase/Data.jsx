import { v4 as uuid } from "uuid"

export const Blocks = {}

export const DaysList = {
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
        let item = v[1]
        let number = i + 1
        let sheltered = DaysList[v[0]] === 'J' && [9, 10].includes(number);
        Blocks[uuid()] = {
            day: day,
            duration: 45,
            items: [/*{ id: `${number}`, name: item + number } */],
            number: number,
            sheltered: sheltered
        }
    })
}

export const BlocksDuration = ({ date, block }) => {
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
            { [uuid()]: { id: 'CC218', name: 'INGENIERÍA DE SOFTWARE I', time: 270 } },
            { [uuid()]: { id: 'CC219', name: 'TALLER DE APLICACIONES WEB', time: 270 } },
            { [uuid()]: { id: 'CC093', name: 'COMUNICACIÓN DE DATOS Y REDES', time: 270 } },
            { [uuid()]: { id: 'CC223', name: 'SISTEMAS DE INFORMACIÓN', time: 270 } },
            { [uuid()]: { id: 'CC094', name: 'TEORÍA DE LA COMPUNTACIÓN', time: 270 } },
            { [uuid()]: { id: 'DI166', name: 'INGLÉS II', time: 270 } },
        ]
    }
}

export const Laboratories = {
    [uuid()]: {
        items: [
            { [uuid()]: { department_fk: 'DICI', name: 'PARINACOTA' } },
            { [uuid()]: { department_fk: 'DICI', name: 'POMERAPE' } },
            { [uuid()]: { department_fk: 'DICI', name: 'GUALLATIRE' } },
            { [uuid()]: { department_fk: 'DICI', name: 'AZUFRE' } },
            { [uuid()]: { department_fk: 'DICI', name: 'LICANCABUR' } },
            { [uuid()]: { department_fk: 'DICI', name: 'SOCOMPA' } },
            { [uuid()]: { department_fk: 'DICI', name: 'AUDITORIO' } },
        ]
    }
}

export const Teachers = {
    [uuid()]: {
        items: [
            { [uuid()]: { firstName: 'DIEGO', lastName: 'ARACENA PIZARRO', email: 'DARACENA@ACADEMICOS.UTA.CL', } },
            { [uuid()]: { firstName: 'MAURICIO', lastName: 'ARRIAGADA BENÍTEZ', email: 'MARRIAGADA@ACADEMICOS.UTA.CL', } },
            { [uuid()]: { firstName: 'ROBERTO', lastName: 'ESPINOSA OLIVA', email: 'RESPINOSA@ACADEMICOS.UTA.CL', } },
            { [uuid()]: { firstName: 'RAÚL', lastName: 'HERRERA ACUÑA', email: 'RHERRERA@ACADEMICOS.UTA.CL', } },
            { [uuid()]: { firstName: 'HÉCTOR', lastName: 'OSSANDÓN DÍAZ', email: 'HOSSANDO@UTA.CL', } },
            { [uuid()]: { firstName: 'IBAR', lastName: 'RAMÍREZ VARAS', email: 'IRAMIREZ@UTA.CL', } },
            { [uuid()]: { firstName: 'RICARDO', lastName: 'VALDIVIA PINTO', email: 'RVALDIVI@ACADEMICOS.UTA.CL', } },
        ]
    }
}