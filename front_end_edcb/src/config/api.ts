// Configuración de la API
export const API_CONFIG = {
  // URL del backend Flask
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  
  // Endpoints disponibles
  ENDPOINTS: {
    // Endpoints de predicción
    ADICCION: '/api/grafica-adiccion',
    RENDIMIENTO: '/api/prediccion-rendimiento',
    SALUD_MENTAL: '/api/grafica-salud-mental',
    
    // Endpoint del formulario
    FORM_DATA: '/api/form-data',
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string, ...params: string[]) => {
  const baseUrl = API_CONFIG.BACKEND_URL;
  const path = params.length > 0 ? `${endpoint}/${params.join('/')}` : endpoint;
  return `${baseUrl}${path}`;
}; 