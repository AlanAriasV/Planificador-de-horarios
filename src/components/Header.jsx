import { render } from "react-dom";
import "../css/Header.css";
import auth from "../firebase/authentication";
import { Navigate } from "react-router-dom";

const Header = ({ title }) => {

  return (
    <>
      <header>
        <h1>{title}</h1>
        <button onClick={() => {
          auth.logout().then((_) => (<Navigate to="/signin" replace={true} />));
        }}>salir</button>
      </header>
      {/* <Outlet/> */}
    </>
  );
};

export default Header;
