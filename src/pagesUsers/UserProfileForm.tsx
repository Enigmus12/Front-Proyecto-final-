import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userTrackingService } from '../service/api';
import '../styles/UserForm.css'; 

const UserProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    weight: '',
    bodyMeasurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      legs: ''
    },
    personalGoals: ''
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Usuario';
    setFormData(prev => ({
      ...prev,
      username: storedUsername
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bodyMeasurements: {
        ...prev.bodyMeasurements,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar las medidas según el formato esperado por el backend
      const bodyMeasurements: Record<string, number> = {};
      
      // Solo incluir las medidas que tienen valores
      if (formData.bodyMeasurements.chest) bodyMeasurements.chest = parseFloat(formData.bodyMeasurements.chest);
      if (formData.bodyMeasurements.waist) bodyMeasurements.waist = parseFloat(formData.bodyMeasurements.waist);
      if (formData.bodyMeasurements.hips) bodyMeasurements.hips = parseFloat(formData.bodyMeasurements.hips);
      if (formData.bodyMeasurements.arms) bodyMeasurements.arms = parseFloat(formData.bodyMeasurements.arms);
      if (formData.bodyMeasurements.legs) bodyMeasurements.legs = parseFloat(formData.bodyMeasurements.legs);
      
      // Crear el objeto DTO para enviar al backend
      const physicalRecordDTO = {
        userName: formData.username,
        weight: parseFloat(formData.weight),
        bodyMeasurements,
        physicalGoal: formData.personalGoals,
      };

      console.log('Enviando datos al servidor:', physicalRecordDTO);

      // Usar el servicio API en lugar de fetch directo
      const savedRecord = await userTrackingService.createPhysicalRecord(physicalRecordDTO);
      
      console.log('Registro guardado exitosamente:', savedRecord);
      
      // Redirigir a la página de estadísticas
      navigate('/Estadisticas');
      
    } catch (err: any) {
      console.error('Error al enviar datos:', err);
      setError(err.message || 'Error al enviar los datos al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutmenu = () => {
    navigate('/');
  };

  return (
    <div className="user-form-container">
      <div className="user-form-card">
        <h2>Perfil de Usuario</h2>
        <p className="form-subtitle">Complete la información para personalizar su experiencia</p>
        <button className="btn-logmenu" onClick={handleLogoutmenu}>
          Volver al menu
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre de usuario (no editable) */}
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              readOnly
              className="readonly-input"
            />
          </div>

          {/* Peso */}
          <div className="form-group">
            <label htmlFor="weight">Peso (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Ingrese su peso en kilogramos"
              required
              min="1"
              max="500"
              step="0.1"
            />
          </div>

          {/* Medidas corporales */}
          <div className="form-section">
            <h3>Medidas Corporales (cm)</h3>
            <div className="measurements-grid">
              <div className="measurement-item">
                <label htmlFor="chest">Pecho</label>
                <input
                  type="number"
                  id="chest"
                  name="chest"
                  value={formData.bodyMeasurements.chest}
                  onChange={handleMeasurementChange}
                  placeholder="cm"
                  min="1"
                  step="0.1"
                />
              </div>
              
              <div className="measurement-item">
                <label htmlFor="waist">Cintura</label>
                <input
                  type="number"
                  id="waist"
                  name="waist"
                  value={formData.bodyMeasurements.waist}
                  onChange={handleMeasurementChange}
                  placeholder="cm"
                  min="1"
                  step="0.1"
                />
              </div>
              
              <div className="measurement-item">
                <label htmlFor="hips">Cadera</label>
                <input
                  type="number"
                  id="hips"
                  name="hips"
                  value={formData.bodyMeasurements.hips}
                  onChange={handleMeasurementChange}
                  placeholder="cm"
                  min="1"
                  step="0.1"
                />
              </div>
              
              <div className="measurement-item">
                <label htmlFor="arms">Brazos</label>
                <input
                  type="number"
                  id="arms"
                  name="arms"
                  value={formData.bodyMeasurements.arms}
                  onChange={handleMeasurementChange}
                  placeholder="cm"
                  min="1"
                  step="0.1"
                />
              </div>
              
              <div className="measurement-item">
                <label htmlFor="legs">Piernas</label>
                <input
                  type="number"
                  id="legs"
                  name="legs"
                  value={formData.bodyMeasurements.legs}
                  onChange={handleMeasurementChange}
                  placeholder="cm"
                  min="1"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Metas personales */}
          <div className="form-group">
            <label htmlFor="personalGoals">Metas Personales</label>
            <textarea
              id="personalGoals"
              name="personalGoals"
              value={formData.personalGoals}
              onChange={handleChange}
              placeholder="Describe tus objetivos de entrenamiento y metas personales"
              rows={4}
              required
            />
          </div>

          {/* Botón de envío en la esquina inferior derecha */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary submit-btn" 
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;