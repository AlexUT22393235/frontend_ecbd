"use client"
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { buildApiUrl, API_CONFIG } from '../../config/api';

interface PredictionResult {
  prediccion_porcentaje?: number;
  nivel_adiccion?: string;
  mensaje?: string;
  prediccion_booleana?: boolean;
  probabilidad_afectacion?: number;
  salud_mental_score?: number;
  grafica_base64?: string;
  grafica?: string; // Campo alternativo para gráficas
  valores_ingresados?: {
    horas_diarias_uso?: number;
    horas_sueño_nocturno?: number;
    estatus_relacion?: number;
  };
}

export default function ResultadosPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    adiccion: PredictionResult | null;
    rendimiento: PredictionResult | null;
    saludMental: PredictionResult | null;
  }>({
    adiccion: null,
    rendimiento: null,
    saludMental: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const horasUso = searchParams.get('horasUso');
        const horasSueno = searchParams.get('horasSueno');
        const relacionActual = searchParams.get('relacionActual');

        if (!horasUso || !horasSueno) {
          setError('Faltan parámetros requeridos');
          setLoading(false);
          return;
        }

        // Mapear relación actual a número
        const relacionMap: { [key: string]: number } = {
          'Soltero/a': 1,
          'En una relación': 2,
          'Es complicado': 3,
        };

        const relacionNum = relacionMap[relacionActual || 'Soltero/a'] || 1;

        console.log('Iniciando llamadas a la API...');
        console.log('Parámetros:', { horasUso, horasSueno, relacionNum });

        // Llamar a los endpoints de predicción usando la configuración
        const [adiccionRes, rendimientoRes, saludMentalRes] = await Promise.allSettled([
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.ADICCION, horasUso, horasSueno)),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.RENDIMIENTO, horasUso, horasSueno)),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.SALUD_MENTAL, horasSueno, relacionNum.toString()))
        ]);

        console.log('Respuestas de la API:');
        console.log('Adicción:', adiccionRes);
        console.log('Rendimiento:', rendimientoRes);
        console.log('Salud Mental:', saludMentalRes);

        const newResults = {
          adiccion: adiccionRes.status === 'fulfilled' ? adiccionRes.value.data : null,
          rendimiento: rendimientoRes.status === 'fulfilled' ? rendimientoRes.value.data : null,
          saludMental: saludMentalRes.status === 'fulfilled' ? saludMentalRes.value.data : null,
        };

        console.log('Resultados procesados:', newResults);
        setResults(newResults);
      } catch (err) {
        console.error('Error en fetchResults:', err);
        setError('Error al obtener los resultados. Asegúrate de que el servidor backend esté ejecutándose.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  // Función helper para obtener la gráfica base64
  const getGraphBase64 = (result: PredictionResult | null): string | null => {
    if (!result) return null;
    const graphData = result.grafica_base64 || result.grafica || null;
    
    if (!graphData) return null;
    
    // Si ya incluye el prefijo data:image/png;base64, devolverlo tal como está
    if (graphData.startsWith('data:image/png;base64,')) {
      return graphData;
    }
    
    // Si no incluye el prefijo, agregarlo
    return `data:image/png;base64,${graphData}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Analizando tus datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Error de Conexión</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-8 tracking-tight">
          Resultados del Análisis
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Predicción de Adicción */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <span className="text-2xl mr-2"></span>
              Predicción de Adicción
            </h2>
            {results.adiccion ? (
              <div>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {results.adiccion.prediccion_porcentaje?.toFixed(1)}%
                  </div>
                  <div className="text-lg font-medium text-gray-300">
                    {results.adiccion.nivel_adiccion}
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{results.adiccion.mensaje}</p>
                {results.adiccion.valores_ingresados && (
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-500">
                      Horas de uso: {results.adiccion.valores_ingresados.horas_diarias_uso}h
                    </p>
                    <p className="text-xs text-gray-500">
                      Horas de sueño: {results.adiccion.valores_ingresados.horas_sueño_nocturno}h
                    </p>
                  </div>
                )}
                {/* Mostrar gráfica si existe */}
                {getGraphBase64(results.adiccion) && (
                  <div className="mt-4">
                    <img 
                      src={getGraphBase64(results.adiccion)!}
                      alt="Gráfica de adicción"
                      className="w-full h-auto rounded-lg border border-gray-700"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-600 text-4xl mb-2"></div>
                <p className="text-gray-500">Servicio no disponible</p>
              </div>
            )}
          </div>

          {/* Predicción de Rendimiento Académico */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <span className="text-2xl mr-2"></span>
              Rendimiento Académico
            </h2>
            {results.rendimiento ? (
              <div>
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${
                    results.rendimiento.prediccion_booleana ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {results.rendimiento.prediccion_booleana ? '⚠️' : '✅'}
                  </div>
                  <div className="text-lg font-medium text-gray-300">
                    {results.rendimiento.prediccion_booleana ? 'Afectado' : 'No Afectado'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {results.rendimiento.probabilidad_afectacion ? (results.rendimiento.probabilidad_afectacion * 100).toFixed(1) : '0.0'}% probabilidad
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{results.rendimiento.mensaje}</p>
                {/* Mostrar gráfica si existe */}
                {getGraphBase64(results.rendimiento) && (
                  <div className="mt-4">
                    <img 
                      src={getGraphBase64(results.rendimiento)!}
                      alt="Gráfica de rendimiento académico"
                      className="w-full h-auto rounded-lg border border-gray-700"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-600 text-4xl mb-2"></div>
                <p className="text-gray-500">Servicio no disponible</p>
              </div>
            )}
          </div>

          {/* Predicción de Salud Mental */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <span className="text-2xl mr-2"></span>
              Salud Mental
            </h2>
            {results.saludMental ? (
              <div>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {results.saludMental.salud_mental_score}/10
                  </div>
                  <div className="text-lg font-medium text-gray-300">
                    {results.saludMental.salud_mental_score && results.saludMental.salud_mental_score < 4 ? 'Baja' :
                     results.saludMental.salud_mental_score && results.saludMental.salud_mental_score < 7 ? 'Promedio' : 'Positiva'}
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{results.saludMental.mensaje}</p>
                {/* Mostrar gráfica si existe */}
                {getGraphBase64(results.saludMental) && (
                  <div className="mt-4">
                    <img 
                      src={getGraphBase64(results.saludMental)!}
                      alt="Gráfica de salud mental"
                      className="w-full h-auto rounded-lg border border-gray-700"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-600 text-4xl mb-2"></div>
                <p className="text-gray-500">Servicio no disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="mt-12 bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center">
            <span className="text-2xl mr-2"></span>
            Recomendaciones Personalizadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">Para Reducir el Uso de Redes Sociales:</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Establece límites de tiempo diario</li>
                <li>• Desactiva las notificaciones</li>
                <li>• Usa aplicaciones de control parental</li>
                <li>• Busca actividades alternativas</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">Para Mejorar el Sueño:</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Evita pantallas 1 hora antes de dormir</li>
                <li>• Mantén un horario regular</li>
                <li>• Crea una rutina relajante</li>
                <li>• Asegura un ambiente cómodo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botón para volver */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors duration-200"
          >
            Volver al formulario
          </button>
        </div>
      </div>
    </div>
  );
} 