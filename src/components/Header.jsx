import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import { BiLogOut } from 'react-icons/bi';
import { FaSave, FaUserCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { BsArrowLeft } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi';

import '../css/Header.css';

import { CarreraContext } from '../contexts/CarreraContext';
import auth from '../firebase/authentication';

const Header = ({ title, handlerSave, handlerExit }) => {
  const { userData } = useContext(CarreraContext);

  const [activeDropdownUser, setActiveDropdownUser] = useState(false);
  const [activeDropdownMenu, setActiveDropdownMenu] = useState(false);

  return (
    <>
      <header>
        {title === 'EDICIÓN DE HORARIO' && (
          // <div className="back-menu">
          <div
            className={`dropdown-menu ${
              activeDropdownMenu ? 'deploy' : ''
            } row-3`}
            onClick={_ => {
              setActiveDropdownMenu(!activeDropdownMenu);
            }}>
            <div className="icons">
              <FiMenu className="menu-icon" size={25} />
              <p>Menú</p>
              <IoIosArrowDown className="arrow-icon" size={25} />
            </div>
            <div className="divider"></div>
            <div onClick={handlerSave}>
              <FaSave size={25} />
              <p> Guardar</p>
            </div>
            <div className="divider"></div>
            <div onClick={handlerExit}>
              <BsArrowLeft size={25} />
              <p> Volver </p>
            </div>
          </div>
          // </div>
        )}
        <h1>{title}</h1>
        <div
          className={`dropdown-menu ${
            activeDropdownUser ? 'deploy' : ''
          } row-2`}
          onClick={_ => {
            setActiveDropdownUser(!activeDropdownUser);
          }}>
          <div className="user">
            <FaUserCircle size={25}></FaUserCircle>
            <p>
              {`${userData.user.val().nombre} ${userData.user.val().apellido}`}
            </p>
            <IoIosArrowDown className="arrow-icon" size={25}></IoIosArrowDown>
          </div>
          <div className="divider"></div>
          <Link
            className="logout-btn"
            to={'/signin'}
            replace={true}
            onClick={() => {
              auth.logout();
            }}>
            <p>Cerrar Sesión</p>
            <BiLogOut size={25}></BiLogOut>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
