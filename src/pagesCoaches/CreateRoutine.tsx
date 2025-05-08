import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routineService, RoutineDTO, ExerciseDTO } from 'service/api';
import '../styles/CreateRoutine.css';

const CreateRoutine: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para los datos de la rutina
  const [routineData, setRoutineData] = useState<RoutineDTO>({
    name: '',
    objective: '',
    description: '',
    exercises: [],
    duration: '',
    frequency: ''
  });

  // Estado para un nuevo ejercicio
  const [newExercise, setNewExercise] = useState<ExerciseDTO>({
    name: '',
    description: '',
    sets: 0,
    repetitions: 0,
    instructions: ''
  });

  // Manejador para los cambios en el formulario principal de rutina
  const handleRoutineChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoutineData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para los cambios en el formulario de ejercicio
  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExercise(prev => ({
      ...prev,
      [name]: name === 'sets' || name === 'repetitions' ? parseInt(value) || 0 : value
    }));
  };

  // Agregar ejercicio a la lista
  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!newExercise.name || !newExercise.description || newExercise.sets <= 0 || newExercise.repetitions <= 0) {
      setError('Por favor completa todos los campos del ejercicio correctamente.');
      return;
    }

    setRoutineData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...newExercise }]
    }));

    // Resetear el formulario de ejercicio
    setNewExercise({
      name: '',
      description: '',
      sets: 0,
      repetitions: 0,
      instructions: ''
    });

    setError(null);
  };

  // Eliminar ejercicio de la lista
  const handleRemoveExercise = (index: number) => {
    setRoutineData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  // Enviar el formulario completo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    if (!routineData.name || !routineData.objective || !routineData.description) {
      setError('Por favor completa todos los campos obligatorios de la rutina.');
      return;
    }

    if (routineData.exercises.length === 0) {
      setError('Debes agregar al menos un ejercicio a la rutina.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await routineService.createRoutine(routineData);
      
      setSuccess(true);
      setLoading(false);
      
      // Resetear el formulario después de 2 segundos y redirigir
      setTimeout(() => {
        navigate('/rutinas');
      }, 2000);
      
    } catch (err) {
      console.error('Error al crear la rutina:', err);
      setError('Ocurrió un error al crear la rutina. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  // Si la creación fue exitosa, mostrar mensaje de éxito
  if (success) {
    return (
      <div className="create-routine-page success-container">
        <div className="success-message">
          <h2>¡Rutina creada exitosamente!</h2>
          <p>Redirigiendo a la lista de rutinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-routine-page">
      <h1 className="page-title">Crear Nueva Rutina</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="routine-form">
        <div className="form-section">
          <h2>Información de la Rutina</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nombre de la Rutina *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={routineData.name}
              onChange={handleRoutineChange}
              placeholder="Ej: Entrenamiento para Fuerza"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="objective">Objetivo *</label>
            <input
              type="text"
              id="objective"
              name="objective"
              value={routineData.objective}
              onChange={handleRoutineChange}
              placeholder="Ej: Aumento de masa muscular"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={routineData.description}
              onChange={handleRoutineChange}
              placeholder="Describe brevemente esta rutina y sus beneficios..."
              rows={4}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duración</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={routineData.duration}
                onChange={handleRoutineChange}
                placeholder="Ej: 45 minutos"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="frequency">Frecuencia</label>
              <input
                type="text"
                id="frequency"
                name="frequency"
                value={routineData.frequency}
                onChange={handleRoutineChange}
                placeholder="Ej: 3 veces por semana"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Ejercicios</h2>
          
          {routineData.exercises.length > 0 ? (
            <div className="exercises-list">
              {routineData.exercises.map((exercise, index) => (
                <div key={index} className="exercise-item">
                  <div className="exercise-header">
                    <h3>{exercise.name}</h3>
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                  <p>{exercise.description}</p>
                  <div className="exercise-details">
                    <span><strong>Series:</strong> {exercise.sets}</span>
                    <span><strong>Repeticiones:</strong> {exercise.repetitions}</span>
                  </div>
                  {exercise.instructions && (
                    <p className="instructions"><strong>Instrucciones:</strong> {exercise.instructions}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-exercises">No hay ejercicios agregados. Agrega al menos uno utilizando el formulario de abajo.</p>
          )}
          
          <div className="add-exercise-form">
            <h3>Agregar nuevo ejercicio</h3>
            
            <div className="form-group">
              <label htmlFor="exerciseName">Nombre del Ejercicio *</label>
              <input
                type="text"
                id="exerciseName"
                name="name"
                value={newExercise.name}
                onChange={handleExerciseChange}
                placeholder="Ej: Press de Banca"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="exerciseDescription">Descripción *</label>
              <input
                type="text"
                id="exerciseDescription"
                name="description"
                value={newExercise.description}
                onChange={handleExerciseChange}
                placeholder="Ej: Ejercicio compuesto para pecho"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sets">Series *</label>
                <input
                  type="number"
                  id="sets"
                  name="sets"
                  value={newExercise.sets || ''}
                  onChange={handleExerciseChange}
                  min="1"
                  placeholder="Ej: 3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="repetitions">Repeticiones *</label>
                <input
                  type="number"
                  id="repetitions"
                  name="repetitions"
                  value={newExercise.repetitions || ''}
                  onChange={handleExerciseChange}
                  min="1"
                  placeholder="Ej: 12"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="instructions">Instrucciones</label>
              <textarea
                id="instructions"
                name="instructions"
                value={newExercise.instructions}
                onChange={handleExerciseChange}
                placeholder="Detalla cómo realizar el ejercicio correctamente..."
                rows={3}
              />
            </div>
            
            <button 
              type="button" 
              className="add-exercise-btn"
              onClick={handleAddExercise}
            >
              Agregar Ejercicio
            </button>
          </div>
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/admin')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Rutina'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoutine;