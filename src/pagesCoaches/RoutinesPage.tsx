import React, { useState, useEffect } from 'react';
import { routineService, Routine } from 'service/api'; // Asumiendo que el archivo de api está en un directorio superior
import { useNavigate } from 'react-router-dom';
import '../styles/RoutinesPage.css'; // Vamos a crear este archivo CSS después

const RoutinesPage: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        setLoading(true);
        const data = await routineService.getAllRoutines();
        setRoutines(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching routines:", err);
        setError("No se pudieron cargar las rutinas. Por favor, intente de nuevo más tarde.");
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  const handleRoutineClick = (routine: Routine) => {
    setSelectedRoutine(routine);
  };

  const closeRoutineDetails = () => {
    setSelectedRoutine(null);
  };

  if (loading) {
    return <div className="routines-container loading">Cargando rutinas...</div>;
  }

  if (error) {
    return <div className="routines-container error">{error}</div>;
  }

  return (
    <div className="routines-page">
      <h1 className="routines-title">Rutinas de Entrenamiento</h1>
      
      <div className="routines-container">
        {routines.length === 0 ? (
          <div className="no-routines">No hay rutinas disponibles.</div>
        ) : (
          <div className="routines-grid">
            {routines.map((routine) => (
              <div 
                key={routine.id} 
                className="routine-card"
                onClick={() => handleRoutineClick(routine)}
              >
                <h3>{routine.name}</h3>
                <p className="routine-objective">{routine.objective}</p>
                <div className="routine-info">
                  <span>Duración: {routine.duration}</span>
                  <span>Frecuencia: {routine.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default RoutinesPage;