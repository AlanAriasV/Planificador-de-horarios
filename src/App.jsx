import { Navigate, Route, Routes } from 'react-router-dom';

import { EditSchedule, Home, Loading, SignIn } from './pages/Pages';
import { CarreraContext, CarreraProvider } from './contexts/CarreraContext';
import { useContext } from 'react';

function App() {
  const ProtectedRoute = ({ children, onlyAdmin }) => {
    const { loadingUser, user, userData } = useContext(CarreraContext);
    if (loadingUser) return <></>;
    if (!user) return <Navigate to="/signin" replace={true} />;
    if (onlyAdmin && userData && userData.type !== 'jefe de carrera')
      return <Navigate to="/" replace={true} />;

    return (
      <>
        {!userData && <Loading />}
        {/* {!onlyAdmin && userData && children} */}
        {userData && children}
      </>
    );
  };
  return (
    <>
      <CarreraProvider>
        <Routes>
          <Route path={'/signin'} element={<SignIn />} />
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/edit-schedule/:idCarrera/:plan/:semestre'}
            element={
              <ProtectedRoute onlyAdmin={true}>
                <EditSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path={'*'}
            element={
              <ProtectedRoute>
                <Navigate to="/" replace={true} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CarreraProvider>
    </>
  );
}

export default App;
