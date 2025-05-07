import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import iconEscuelaIng from '../assets/icons/iconEscuelaIng.png';


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('estudiante');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role);

        if (role === 'entrenador') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        setLoading(false);
      }, 800); 
      
    } catch (err: any) {
      setError('Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={iconEscuelaIng} alt="Logo ECI" className="auth-logo" />
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="role">Seleccione su Rol</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="role-select"
            >
              <option value="estudiante">Estudiante</option>
              <option value="entrenador">Entrenador</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;