import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userTrackingService, PhysicalRecord, routineService, Routine } from '../service/api';
import '../styles/MyRecords.css'; 

const MyRecords: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<PhysicalRecord[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [routineLoading, setRoutineLoading] = useState(false);
  const [routineError, setRoutineError] = useState<string | null>(null);

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

  const handleViewRoutine = async (routineName: string) => {
    try {
      setRoutineLoading(true);
      setRoutineError(null);
      
      // Obtener todas las rutinas
      const allRoutines = await routineService.getAllRoutines();
      
      // Buscar la rutina por nombre
      const foundRoutine = allRoutines.find(routine => routine.name === routineName);
      
      if (foundRoutine) {
        // Si encuentra la rutina por nombre, la obtiene completa por su ID
        const detailedRoutine = await routineService.getRoutineById(foundRoutine.id);
        setSelectedRoutine(detailedRoutine);
      } else {
        setRoutineError('No se pudo encontrar la rutina especificada');
      }
    } catch (err: any) {
      console.error('Error al obtener la rutina:', err);
      setRoutineError('Error al cargar la rutina');
    } finally {
      setRoutineLoading(false);
    }
  };

  const closeRoutineDetails = () => {
    setSelectedRoutine(null);
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
                    <span className="detail-value">{record.observations || 'Sin observaciones'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Rutina activa:</span>
                    <div className="active-routine">
                      <span className="detail-value">{record.activeRoutine || 'Sin rutina asignada'}</span>
                      {record.activeRoutine && (
                        <button 
                          className="btn-view-routine"
                          onClick={() => record.activeRoutine && handleViewRoutine(record.activeRoutine)}
                        >
                          Ver Rutina
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal para mostrar los detalles de la rutina seleccionada */}
      {selectedRoutine && (
        <div className="routine-details-overlay">
          <div className="routine-details">
            <button className="close-button" onClick={closeRoutineDetails}>×</button>
            <h2>{selectedRoutine.name}</h2>
            <p className="routine-description">{selectedRoutine.description}</p>
            <div className="routine-metadata">
              <p><strong>Objetivo:</strong> {selectedRoutine.objective}</p>
              <p><strong>Duración:</strong> {selectedRoutine.duration}</p>
              <p><strong>Frecuencia:</strong> {selectedRoutine.frequency}</p>
            </div>
            
            <h3>Ejercicios</h3>
            <div className="exercises-list">
              {selectedRoutine.exercises.map((exercise, index) => (
                <div key={index} className="exercise-item">
                  <h4>{exercise.name}</h4>
                  <p>{exercise.description}</p>
                  <div className="exercise-details">
                    <span><strong>Series:</strong> {exercise.sets}</span>
                    <span><strong>Repeticiones:</strong> {exercise.repetitions}</span>
                  </div>
                  <p className="exercise-instructions"><strong>Instrucciones:</strong> {exercise.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga de rutina */}
      {routineLoading && (
        <div className="routine-details-overlay">
          <div className="routine-loading">
            <p>Cargando rutina...</p>
          </div>
        </div>
      )}

      {/* Mensaje de error al cargar la rutina */}
      {routineError && (
        <div className="routine-details-overlay">
          <div className="routine-error">
            <h3>Error</h3>
            <p>{routineError}</p>
            <button onClick={() => setRoutineError(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecords;