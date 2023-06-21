import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import { BiLogOut } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { BsArrowLeft } from 'react-icons/bs';

import '../css/Header.css';

import { CarreraContext } from '../contexts/CarreraContext';
import auth from '../firebase/authentication';

const Header = ({ title }) => {
  const { userData } = useContext(CarreraContext);

  const [active, setActive] = useState(false);

  // console.log(userData);

  return (
    <>
      <header>
        {title === 'EDICIÓN DE HORARIO' && (
          <Link className="back-page" to={'/'}>
            <BsArrowLeft size={30} />
          </Link>
        )}
        <h1>{title}</h1>
        <div
          className={`dropdown-menu ${active ? 'deploy' : ''}`}
          onClick={event => {
            setActive(!active);
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
            <BiLogOut size={30}></BiLogOut>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
