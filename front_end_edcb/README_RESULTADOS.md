# Sistema de Análisis de Redes Sociales

Este proyecto incluye un formulario de encuesta y un sistema de análisis que utiliza machine learning para predecir diferentes aspectos relacionados con el uso de redes sociales.

## Características

### Formulario de Encuesta (`/`)
- Recopila datos demográficos y de uso de redes sociales
- Validación de formularios con React Hook Form
- Almacenamiento en base de datos MySQL
- Redirección automática a resultados

### Página de Resultados (`/resultados`)
- **Predicción de Adicción**: Analiza el nivel de adicción basado en horas de uso y sueño
- **Rendimiento Académico**: Predice si el uso afecta el rendimiento académico
- **Salud Mental**: Evalúa el impacto en la salud mental según sueño y estado de relación
- **Recomendaciones Personalizadas**: Sugerencias basadas en los resultados

## Endpoints del Backend

El sistema consume los siguientes endpoints del servidor Flask:

### 1. Predicción de Adicción
```
GET /api/grafica-adiccion/{horas_uso}/{horas_sueno}
```
**Parámetros:**
- `horas_uso`: Horas diarias de uso de redes sociales
- `horas_sueno`: Horas de sueño nocturno

**Respuesta:**
```json
{
  "prediccion_porcentual": 75.5,
  "nivel_adiccion": "Alto",
  "mensaje": "Tu uso de redes sociales indica un nivel alto de adicción...",
  "valores_ingresados": {
    "horas_diarias_uso": 6,
    "horas_sueño_nocturno": 5
  }
}
```

### 2. Predicción de Rendimiento Académico
```
GET /api/prediccion-rendimiento/{horas_uso}/{horas_sueno}
```
**Respuesta:**
```json
{
  "prediccion_booleana": true,
  "probabilidad_afectacion": 85.2,
  "mensaje": "El uso de redes sociales está afectando tu rendimiento académico...",
  "valores_ingresados": {
    "horas_diarias_uso": 6,
    "horas_sueño_nocturno": 5
  }
}
```

### 3. Predicción de Salud Mental
```
GET /api/grafica-salud-mental/{horas_sueno}/{estatus_relacion}
```
**Parámetros:**
- `horas_sueno`: Horas de sueño nocturno
- `estatus_relacion`: 1=Soltero, 2=En relación, 3=Complicado

**Respuesta:**
```json
{
  "salud_mental_score": 6.8,
  "mensaje": "😊 Salud mental positiva.",
  "grafica_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "valores_ingresados": {
    "horas_sueno": 7,
    "estatus_relacion": 2
  }
}
```

## Configuración

### Variables de Entorno
Crear un archivo `.env.local` en el directorio raíz:

```env
# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Base de datos (para el formulario)
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=tu_base_de_datos
```

### Instalación y Ejecución

1. **Instalar dependencias del frontend:**
```bash
cd frontend_ecbd/front_end_edcb
npm install
```

2. **Instalar dependencias del backend:**
```bash
cd dataset
pip install -r requirements.txt
```

3. **Ejecutar el backend Flask:**
```bash
cd dataset
python app.py
```

4. **Ejecutar el frontend Next.js:**
```bash
cd frontend_ecbd/front_end_edcb
npm run dev
```

## Flujo de Uso

1. El usuario accede al formulario en `http://localhost:3000`
2. Completa la encuesta con sus datos
3. Al enviar, los datos se guardan en la base de datos
4. Se redirige automáticamente a `/resultados` con los parámetros necesarios
5. La página de resultados consume los endpoints del backend para obtener predicciones
6. Se muestran los resultados con gráficas y recomendaciones

## Estructura de Archivos

```
frontend_ecbd/front_end_edcb/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Formulario principal
│   │   ├── resultados/
│   │   │   └── page.tsx          # Página de resultados
│   │   └── api/
│   │       └── form-data/
│   │           └── route.ts      # API para guardar formulario
│   └── config/
│       └── api.ts               # Configuración de endpoints
└── README_RESULTADOS.md         # Este archivo

dataset/
├── app.py                       # Servidor Flask principal
├── routes/
│   └── graficas_routes.py       # Endpoints de predicción
└── requirements.txt             # Dependencias Python
```

## Solución de Problemas

### Error de Conexión al Backend
- Verificar que el servidor Flask esté ejecutándose en `http://localhost:5000`
- Revisar la consola del navegador para errores específicos
- Verificar que CORS esté configurado correctamente en el backend

### Errores de Predicción
- Verificar que los parámetros enviados sean números válidos
- Revisar los logs del servidor Flask para errores específicos
- Asegurar que los modelos de machine learning estén disponibles

### Problemas de Base de Datos
- Verificar la conexión a MySQL
- Asegurar que la tabla `form_data` exista con la estructura correcta
- Revisar las credenciales de la base de datos

## Tecnologías Utilizadas

### Frontend
- **Next.js 15**: Framework de React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **React Hook Form**: Manejo de formularios
- **Axios**: Cliente HTTP

### Backend
- **Flask**: Framework web de Python
- **scikit-learn**: Machine learning
- **matplotlib**: Generación de gráficas
- **MySQL**: Base de datos
- **CORS**: Cross-origin resource sharing

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza los cambios
4. Ejecuta las pruebas
5. Envía un pull request

## Licencia

Este proyecto está bajo la licencia MIT. 