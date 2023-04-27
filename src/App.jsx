import { Route, Routes } from "react-router-dom";

import { Home, SignIn } from "./pages/Pages";

const App = () => {
  

  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path={"/signin"} element={<SignIn />} />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
