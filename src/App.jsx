import { Route, Routes } from "react-router-dom";

import "./css/App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { Home } from "./pages/Home";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path={"/"} element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
