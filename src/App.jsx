import { Navigate, Route, Routes } from 'react-router-dom';

import { EditSchedule, Home, SignIn } from './pages/Pages';
import { CarreraContext, CarreraProvider } from './contexts/CarreraContext';
import { useContext } from 'react';

function App() {

  const ProtectedRoute = ({ children }) => {
    const { loadingUser, user } = useContext(CarreraContext);
    // console.log(loadingUser);
    if (loadingUser) return (<></>);
    if (!user) return <Navigate to="/signin" replace={true} />;
    return children
  }

  return (
    <>
      <CarreraProvider>
        <Routes>
          <Route path={'/signin'} element={<SignIn />} />
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
          />
          <Route path={'/edit-schedule'} element={
            <ProtectedRoute>
              <EditSchedule />
            </ProtectedRoute>
          } />
          <Route path={'/edit-schedule/:idCarrera'} element={
            <ProtectedRoute>
              <EditSchedule />
            </ProtectedRoute>
          } />
          <Route path={'/edit-schedule/:idCarrera/:semestre'} element={
            <ProtectedRoute>
              <EditSchedule />
            </ProtectedRoute>
          } />
        </Routes>
      </CarreraProvider>
    </>
  );
}

export default App;
