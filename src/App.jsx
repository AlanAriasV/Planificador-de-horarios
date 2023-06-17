import { Route, Routes } from 'react-router-dom';

import { EditSchedule, Home, SignIn } from './pages/Pages';
import { CarreraProvider } from './contexts/CarreraContext';

function App() {

  return (
    <>
      <CarreraProvider>
        <Routes>
          <Route path={'/signin'} element={<SignIn />} />
          <Route index element={<Home />} />
          <Route path={'/edit-schedule'} element={<EditSchedule />} />
        </Routes>
      </CarreraProvider>
    </>
  );
}

export default App;
