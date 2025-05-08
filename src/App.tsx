import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pagesUsers/HomePage';
import UserProfileForm from './pagesUsers/UserProfileForm';
import GraphsPage from './pagesUsers/GraphsPage';
import MyRecords from './pagesUsers/MyRecords';
import GetRecords from './pagesCoaches/GetRecords';
import RoutineList from './pagesCoaches/RoutinesPage';
import CreateRoutine from './pagesCoaches/CreateRoutine';
import Login from './Manito/Login';
import './styles/Global.css';
import HomePageAdmin from './pagesCoaches/HomePageAdmin'

/**
 * ProtectedRoute component to guard routes that require authentication.
 * Redirects to login if the user is not authenticated.
 * @param {ReactNode} children - The child components to render if authenticated.
 * @returns {JSX.Element} Protected route component or redirect to login.
 */
interface ProtectedRouteProps {
  children: ReactNode;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const hasToken = !!localStorage.getItem('authToken'); // Verificar si existe el token
  
  if (!isLoggedIn || !hasToken) { // Verificar ambas condiciones
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas para el usuario*/}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/Formulario" element={
          <ProtectedRoute>
            <UserProfileForm />
          </ProtectedRoute>
        } />
        <Route path="/Estadisticas" element={
          <ProtectedRoute>
            <GraphsPage />
          </ProtectedRoute>
        } />
        <Route path="/VerRegistros" element={
          <ProtectedRoute>
            <MyRecords />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas para el entrenador*/}
        <Route path="/admin" element={
          <ProtectedRoute>
            <HomePageAdmin />
          </ProtectedRoute>
        } />
        <Route path="/consultar-registros" element={
          <ProtectedRoute>
            <GetRecords/>
          </ProtectedRoute>
        } />
        <Route path="/consultar-rutinas" element={
          <ProtectedRoute>
            <RoutineList/>
          </ProtectedRoute>
        } />
        <Route path="/crear-rutinas" element={
          <ProtectedRoute>
            <CreateRoutine/>
          </ProtectedRoute>
        } />

        {/* Ruta para cualquier otra URL no definida */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;