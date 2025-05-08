import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../service/api';
import '../styles/Login.css';
import iconEscuelaIng from '../assets/icons/iconEscuelaIng.png';

/**
 * Login component for user authentication.
 * Allows users to log in using their user ID and password.
 * @returns {JSX.Element} Login component.
 */
interface LoginResponse {
  authenticated: boolean;
  token: string;
  user: {
    userId: string;
  };
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      setError('Por favor ingrese todos los campos');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.login({ userId, password }) as LoginResponse;
    
      if (response.authenticated) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', response.user.userId);
        
        // Redirección basada en el usuario
        if (response.user.userId === 'Coach') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(response.message || 'Credenciales inválidas');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
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
            <label htmlFor="userId">ID de Usuario</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ingrese su ID de usuario"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <p className="auth-link">
          ¿No tienes cuenta? <span onClick={() => navigate('/register')}>Regístrate</span>
        </p>
      </div>
    </div>
  );
};

export default Login;