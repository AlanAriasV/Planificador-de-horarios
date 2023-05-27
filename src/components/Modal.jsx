import React from 'react'
import { AiOutlineClose } from "react-icons/ai";

function Modal({ closeModal, scheduleId }) {
    const selectedSemester = 1;
  return (
    <div className='modal'>
        <div className='modal-content'>
            <span className='modal-close' onClick={() => closeModal(false)}>
                <AiOutlineClose/>
            </span>
            <div className='modal-title'>
                <h2>Previsualización de horario para semestre {selectedSemester}</h2>
            </div>
            <div className='modal-body'>
                Bloques horarios
            </div>
            <div className='modal-footer'>
                <button className='cancel-btn' onClick={() => closeModal(false)}>Cancelar</button>
                <button className='edit-btn'>Ir a editar</button>
            </div>
        </div>
    </div>
  )
}

export default Modal