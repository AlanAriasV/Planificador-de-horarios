import { Link, Outlet, useParams } from "react-router-dom";
import "../css/Header.css";
import { useEffect, useState } from "react";

const Header = ({title}) => {

  return (
    <>
      <header>
        <div>{title}</div>
        <Link to={"/"}>
          Home
        </Link>
        <Link to={"/signin"}>
          Sign In
        </Link>
      </header>
      {/* <Outlet/> */}
    </>
  );
};

export default Header;
