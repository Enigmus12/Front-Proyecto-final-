import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import iconEscuelaIng from '../assets/icons/iconEscuelaIng.png';
import '../styles/Global.css';

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };
  
  return (
    <div>
      <Header title="Manito Usuario" />
      <button className="btn-logout" onClick={handleLogout}>
        Cerrar Sesión
      </button>
      <div className="button-container">
        <button className="btn" onClick={() => navigate('/Formulario')}>
          Formulario
        </button>
        <button className="btn" onClick={() => navigate('/Estadisticas')}>
          Estadisticas
        </button>
      </div>
      <img src={iconEscuelaIng} alt="Icono Escuela Ing" className="img-decorativa" />
    </div>
  );
}

export default HomePage;
