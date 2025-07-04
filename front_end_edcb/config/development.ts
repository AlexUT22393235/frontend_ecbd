// Configuración para el entorno de desarrollo
export const developmentConfig = {
  // URL del backend Flask
  backendUrl: 'http://localhost:5000',
  
  // Configuración de la base de datos
  database: {
    host: 'localhost',
    user: 'root',
    password: 'tu_password',
    database: 'encuesta_redes_sociales'
  },
  
  // Configuración de la aplicación
  app: {
    name: 'Sistema de Análisis de Redes Sociales',
    version: '1.0.0'
  },
  
  // Configuración de CORS
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
};

// Función para obtener la configuración según el entorno
export function getConfig() {
  if (process.env.NODE_ENV === 'production') {
    return {
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://tu-backend.com',
      database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
      },
      app: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'Sistema de Análisis',
        version: '1.0.0'
      },
      cors: {
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tu-frontend.com',
        credentials: true
      }
    };
  }
  
  return developmentConfig;
} 