import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userTrackingService, PhysicalRecord, routineService, Routine } from '../service/api';
import '../styles/MyRecords.css'; 

const GetRecords: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<PhysicalRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<PhysicalRecord | null>(null);
  const [observations, setObservations] = useState<string>('');
  const [activeRoutine, setActiveRoutine] = useState<string>('');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar registros y rutinas disponibles
        const [userRecords, availableRoutines] = await Promise.all([
          userTrackingService.getALLrecords(),
          routineService.getAllRoutines()
        ]);
        
        setRecords(userRecords);
        setRoutines(availableRoutines);
      } catch (err: any) {
        console.error('Error al obtener los datos:', err);
        setError(err.message || 'Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBackToMenu = () => {
    navigate('/admin'); 
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

  const handleEditRecord = (record: PhysicalRecord) => {
    setEditingRecord(record);
    setObservations(record.observations || '');
    setActiveRoutine(record.activeRoutine || '');
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
    setUpdateMessage(null);
  };

  const handleSaveChanges = async () => {
    if (!editingRecord) return;

    try {
      // Preparar los datos para enviar al backend (solo los campos que se pueden modificar)
      const updateData = {
        observations: observations,
        activeRoutine: activeRoutine
      };

      // Llamar al endpoint de actualización
      await userTrackingService.updatePhysicalRecord(editingRecord.id, updateData);
      
      // Actualizar el registro en el estado local
      const updatedRecords = records.map(rec => 
        rec.id === editingRecord.id ? 
        { ...rec, observations: observations, activeRoutine: activeRoutine } : 
        rec
      );
      
      setRecords(updatedRecords);
      setUpdateMessage({ type: 'success', text: 'Registro actualizado correctamente' });
      
      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        handleCloseEditModal();
      }, 2000);
      
    } catch (err: any) {
      console.error('Error al actualizar el registro:', err);
      setUpdateMessage({ type: 'error', text: 'Error al actualizar el registro' });
    }
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
                  <button 
                    className="btn-edit-record"
                    onClick={() => handleEditRecord(record)}
                  >
                    Modificar Registro
                  </button>
                </div>
                
                <div className="record-details">
                  <div className="detail-item">
                    <span className="detail-label">Id Registro:</span>
                    <span className="detail-value">{record.id}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Nombre del Usuario:</span>
                    <span className="detail-value">{record.userName}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Numero de Identificacion:</span>
                    <span className="detail-value">{record.userId}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Rol:</span>
                    <span className="detail-value">{record.role}</span>
                  </div>

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
                    <span className="detail-value">{record.activeRoutine || 'Sin rutina asignada'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para editar el registro */}
      {isEditModalOpen && editingRecord && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Modificar Registro</h3>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="observations">Observaciones:</label>
                <textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ingrese las observaciones del entrenador"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="routine">Rutina Activa:</label>
                <select
                  id="routine"
                  value={activeRoutine}
                  onChange={(e) => setActiveRoutine(e.target.value)}
                >
                  <option value="">Sin rutina asignada</option>
                  {routines.map((routine) => (
                    <option key={routine.id} value={routine.name}>
                      {routine.name}
                    </option>
                  ))}
                </select>
              </div>

              {updateMessage && (
                <div className={`message ${updateMessage.type}`}>
                  {updateMessage.text}
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-cancel" onClick={handleCloseEditModal}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleSaveChanges}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetRecords;