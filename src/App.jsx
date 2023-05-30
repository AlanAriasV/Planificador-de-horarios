import { Route, Routes } from 'react-router-dom';

import { EditSchedule, Home, SignIn } from './pages/Pages';

function App() {

  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path={'/signin'} element={<SignIn />} />
        <Route path={'/edit-schedule'} element={<EditSchedule />} />
      </Routes>
    </>
  );
}

export default App;
