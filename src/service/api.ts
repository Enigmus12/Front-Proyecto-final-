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


// Interceptor para añadir el token a las solicitudes autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Definir interfaces para los tipos
export interface PhysicalRecord {
  id: string;
  userName: string;
  userId?: number;
  role?: string;
  registrationDate: Date;
  weight: number;
  bodyMeasurements: Record<string, number>;
  physicalGoal: string;
  observations?: string;
  activeRoutine?: string;
}

export interface PhysicalRecordDTO {
  weight: number; 
  bodyMeasurements: Record<string, number>;
  physicalGoal: string;
}

//servicio para el seguimiento del usuario (tracking)
export const userTrackingService = {

  // Crear un nuevo registro físico para el usuario (método original)
  createPhysicalRecord: async (physicalRecordDTO: PhysicalRecordDTO) => {
    const response = await api.post('/tracking-service/records', physicalRecordDTO);
    return response.data as PhysicalRecord;
  },
  
  // Nuevo método que utiliza el endpoint automático
  createAutoPhysicalRecord: async (physicalRecordDTO: PhysicalRecordDTO) => {
    const response = await api.post('/tracking-service/records/auto', physicalRecordDTO);
    return response.data as PhysicalRecord;
  },
  
  // Obtener el historial de registros físicos de un usuario
  getUserPhysicalHistory: async (username: string): Promise<PhysicalRecord[]> => {
    const response = await api.get(`/tracking-service/records/user/${username}`);
    return response.data as PhysicalRecord[];
  },

  // Obtener el historial de todos
  getALLrecords: async (): Promise<PhysicalRecord[]> => {
    const response = await api.get('/tracking-service/records');
    return response.data as PhysicalRecord[];
  },

};


// Servicios para autenticación y usuarios
export const authService = {

  login: async (credentials: { userId: string; password: string }) => {
    const response = await api.post('/user-service/login', credentials);
    return response.data;
  },

};

export default api;