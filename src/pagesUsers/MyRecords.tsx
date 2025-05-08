import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userTrackingService, PhysicalRecord } from '../service/api';
import '../styles/MyRecords.css'; 

const MyRecords: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<PhysicalRecord[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchUserRecords = async () => {
      try {
        // Obtener el ID de usuario del localStorage
        const storedUserId = localStorage.getItem('userId');
        
        if (!storedUserId) {
          throw new Error('No se encontró el ID de usuario');
        }
        
        setUserId(storedUserId);
        
        // Obtener los registros físicos del usuario
        const userRecords = await userTrackingService.getUserPhysicalHistory(storedUserId);
        setRecords(userRecords);
      } catch (err: any) {
        console.error('Error al obtener los registros:', err);
        setError(err.message || 'Error al cargar los registros de usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecords();
  }, []);

  const handleBackToMenu = () => {
    navigate('/'); 
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="stats-container">
        <div className="stats-card">
          <h2>Cargando registros...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-container">
        <div className="stats-card">
          <h2>Error</h2>
          <p className="error-message">{error}</p>
          <button className="btn-back" onClick={handleBackToMenu}>
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stats-card">
        <h2>Historial de Seguimiento Físico</h2>
        
        <button className="btn-back" onClick={handleBackToMenu}>
          Volver al menú
        </button>

        {records.length === 0 ? (
          <div className="no-records">
            <p>No se encontraron registros para este usuario.</p>
          </div>
        ) : (
          <div className="records-list">
            {records.map((record, index) => (
              <div key={record.id || index} className="record-item">
                <div className="record-header">
                  <h3>Registro del {formatDate(record.registrationDate)}</h3>
                </div>
                
                <div className="record-details">
                  <div className="detail-item">
                    <span className="detail-label">Peso:</span>
                    <span className="detail-value">{record.weight} kg</span>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Medidas Corporales:</h4>
                    <div className="measurements-grid">
                      {Object.entries(record.bodyMeasurements).map(([key, value]) => (
                        <div key={key} className="measurement-item">
                          <span className="measurement-label">
                            {key === 'chest' ? 'Pecho' : 
                             key === 'waist' ? 'Cintura' : 
                             key === 'hips' ? 'Cadera' : 
                             key === 'arms' ? 'Brazos' : 
                             key === 'legs' ? 'Piernas' : key}:
                          </span>
                          <span className="measurement-value">{value} cm</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Meta física:</span>
                    <p className="goal-text">{record.physicalGoal}</p>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Observaciones del entrenador:</span>
                    <span className="detail-value">{record.observations}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Rutina activa:</span>
                    <span className="detail-value">{record.activeRoutine}</span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecords;