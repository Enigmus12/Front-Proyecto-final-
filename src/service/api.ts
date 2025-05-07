import axios from 'axios';

/**
 * API service for handling authentication and booking operations.
 * Utilizes axios for HTTP requests and includes interceptors for token management.
 * @module api
 */
// Configuración base para axios
const API_BASE_URL = 'http://localhost:8080'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


    /*
    // Interceptor para añadir el token a las solicitudes autenticadas
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Make sure headers exists before trying to set a property on it
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    */

//servicio para el seguimiento del usuario (tracking)
export const userTrackingService = {
  // Crear un nuevo registro físico para el usuario
  createPhysicalRecord: async (physicalRecordDTO: {
    userName: string;
    weight: number; 
    bodyMeasurements: Record<string, number>;
    physicalGoal: string;
  }) => {
    const response = await api.post('/tracking-service/records', physicalRecordDTO);
    return response.data;
  },
  
  // Obtener todos los registros físicos de un usuario
  getUserRecords: async (userName: string) => {
    const response = await api.get(`/tracking-service/records/user/${userName}`);
    return response.data;
  },
  
  // Obtener un registro físico específico por ID
  getRecord: async (recordId: string) => {
    const response = await api.get(`/tracking-service/records/${recordId}`);
    return response.data;
  },
  
  // Actualizar un registro físico existente
  updateRecord: async (recordId: string, physicalRecordDTO: {
    userName?: string;
    weight?: number;
    bodyMeasurements?: Record<string, number>;
    physicalGoal?: string;
  }) => {
    const response = await api.put(`/tracking-service/records/${recordId}`, physicalRecordDTO);
    return response.data;
  },
  
  // Eliminar un registro físico
  deleteRecord: async (recordId: string) => {
    const response = await api.delete(`/tracking-service/records/${recordId}`);
    return response.data;
  }
};

export default api;