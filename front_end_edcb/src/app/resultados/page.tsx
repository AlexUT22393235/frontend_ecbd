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
  grafica?: string;
  valores_ingresados?: {
    horas_diarias_uso?: number;
    horas_sueño_nocturno?: number;
    estatus_relacion?: number;
  };
  // Nuevas propiedades
  modelo_metadata?: {
    algoritmo?: string;
    variables?: string[];
    explicacion_modelo?: {
      que_es?: string;
      como_funciona?: string;
      para_que_sirve?: string;
    };
  };
  interpretacion_graficas?: {
    grafica_1?: string;
    grafica_2?: string;
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

        const relacionMap: { [key: string]: number } = {
          'Soltero/a': 1,
          'En una relación': 2,
          'Es complicado': 3,
        };

        const relacionNum = relacionMap[relacionActual || 'Soltero/a'] || 1;

        const [adiccionRes, rendimientoRes, saludMentalRes] = await Promise.allSettled([
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.ADICCION, horasUso, horasSueno)),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.RENDIMIENTO, horasUso, horasSueno)),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.SALUD_MENTAL, horasSueno, relacionNum.toString()))
        ]);

        const newResults = {
          adiccion: adiccionRes.status === 'fulfilled' ? adiccionRes.value.data : null,
          rendimiento: rendimientoRes.status === 'fulfilled' ? rendimientoRes.value.data : null,
          saludMental: saludMentalRes.status === 'fulfilled' ? saludMentalRes.value.data : null,
        };

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

  const getGraphBase64 = (result: PredictionResult | null): string | null => {
    if (!result) return null;
    const graphData = result.grafica_base64 || result.grafica || null;
    
    if (!graphData) return null;
    
    if (graphData.startsWith('data:image/png;base64,')) {
      return graphData;
    }
    
    return `data:image/png;base64,${graphData}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-gray-300 text-lg font-medium">Analizando tus datos...</p>
          <p className="text-gray-500 text-sm">Esto puede tomar unos momentos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center max-w-md mx-auto p-8 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-100 mb-3">Error de Conexión</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            Resultados del Análisis
          </h1>
          <p className="text-gray-400">
            Basado en tus hábitos de uso de redes sociales, horas de sueño y estado de relación
          </p>
        </div>

        {/* Main Results - Vertical Layout */}
        <div className="space-y-8 mb-12">
          {/* Adicción Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <span className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></span>
                Predicción de Adicción
              </h2>
              <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                Redes Sociales
              </span>
            </div>
            
            {results.adiccion ? (
  <div className="space-y-6">
    {/* Sección de Predicción (EXISTENTE - NO MODIFICAR) */}
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <div className="text-center md:text-left">
        <div className="text-5xl font-bold text-cyan-400 mb-2">
          {results.adiccion.prediccion_porcentaje?.toFixed(1)}%
        </div>
        <div className="text-lg font-medium text-gray-300 capitalize">
          {results.adiccion.nivel_adiccion?.toLowerCase()}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4 max-w-xs mx-auto md:mx-0">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full" 
            style={{ width: `${results.adiccion.prediccion_porcentaje}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex-1">
        {/* Mensaje (EXISTENTE - NO MODIFICAR) */}
        <p className="text-gray-400">{results.adiccion.mensaje}</p>
        
        {/* Valores Ingresados (EXISTENTE - NO MODIFICAR) */}
        {results.adiccion.valores_ingresados && (
          <div className="grid grid-cols-2 gap-2 text-xs mt-4">
            <div className="bg-gray-900/50 p-2 rounded-lg">
              <div className="text-gray-500">Horas de uso</div>
              <div className="text-gray-300 font-medium">
                {results.adiccion.valores_ingresados.horas_diarias_uso}h
              </div>
            </div>
            <div className="bg-gray-900/50 p-2 rounded-lg">
              <div className="text-gray-500">Horas de sueño</div>
              <div className="text-gray-300 font-medium">
                {results.adiccion.valores_ingresados.horas_sueño_nocturno}h
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    {/* Gráfica (EXISTENTE - NO MODIFICAR) */}
    {getGraphBase64(results.adiccion) && (
      <div className="mt-6">
        <h3 className="text-gray-300 font-medium mb-3">Visualización de datos</h3>
        <img 
          src={getGraphBase64(results.adiccion)!}
          alt="Gráfica de adicción"
          className="w-full h-80 object-contain rounded-lg"
        />
        
        {/* NUEVA SECCIÓN - Información del Modelo (SE AÑADE SIN MODIFICAR LO EXISTENTE) */}
        {results.adiccion.modelo_metadata && (
          <div className="mt-6 bg-gray-900/30 p-4 rounded-lg border border-gray-700/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-300 font-medium flex items-center">
                <svg className="w-5 h-5 text-cyan-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Detalles Técnicos
              </h4>
              <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-cyan-400">
                {results.adiccion.modelo_metadata.algoritmo}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-400">Cómo funciona</h5>
                <p className="text-xs text-gray-500">
                  {results.adiccion.modelo_metadata.explicacion_modelo?.que_es}
                </p>
                <p className="text-xs text-gray-500">
                  {results.adiccion.modelo_metadata.explicacion_modelo?.como_funciona}
                </p>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-400">Interpretación</h5>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-1">•</span>
                    <span>{results.adiccion.interpretacion_graficas?.grafica_1}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-1">•</span>
                    <span>{results.adiccion.interpretacion_graficas?.grafica_2}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-700/30">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Variables analizadas:</span> {results.adiccion.modelo_metadata.variables?.join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
) : (
  <div className="text-center py-8 text-gray-600">
    Servicio no disponible
  </div>
)}
          </div>

          {/* Rendimiento Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                Rendimiento Académico
              </h2>
              <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                Impacto
              </span>
            </div>
            
            {results.rendimiento ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="text-center md:text-left">
                    <div className={`text-5xl font-bold mb-2 ${
                      results.rendimiento.prediccion_booleana ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {results.rendimiento.prediccion_booleana ? '⚠️' : '✅'}
                    </div>
                    <div className="text-lg font-medium text-gray-300">
                      {results.rendimiento.prediccion_booleana ? 'Afectado' : 'No Afectado'}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      {results.rendimiento.probabilidad_afectacion ? 
                        (results.rendimiento.probabilidad_afectacion * 100).toFixed(1) : '0.0'}% probabilidad
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-400">{results.rendimiento.mensaje}</p>
                  </div>
                </div>
                
                {getGraphBase64(results.rendimiento) && (
                  <div className="mt-6">
                    <h3 className="text-gray-300 font-medium mb-3">Visualización de datos</h3>
                    <img 
                      src={getGraphBase64(results.rendimiento)!}
                      alt="Gráfica de rendimiento académico"
                      className="w-full h-80 object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                Servicio no disponible
              </div>
            )}
          </div>

          {/* Salud Mental Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Salud Mental
              </h2>
              <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                Bienestar
              </span>
            </div>
            
            {results.saludMental ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-blue-400 mb-2">
                      {results.saludMental.salud_mental_score}/10
                    </div>
                    <div className="text-lg font-medium text-gray-300">
                      {results.saludMental.salud_mental_score && results.saludMental.salud_mental_score < 4 ? 'Baja' :
                       results.saludMental.salud_mental_score && results.saludMental.salud_mental_score < 7 ? 'Promedio' : 'Positiva'}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4 max-w-xs mx-auto md:mx-0">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${(results.saludMental.salud_mental_score || 0) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-400">{results.saludMental.mensaje}</p>
                  </div>
                </div>
                
                {getGraphBase64(results.saludMental) && (
                  <div className="mt-6">
                    <h3 className="text-gray-300 font-medium mb-3">Visualización de datos</h3>
                    <img 
                      src={getGraphBase64(results.saludMental)!}
                      alt="Gráfica de salud mental"
                      className="w-full h-80 object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                Servicio no disponible
              </div>
            )}
          </div>
        </div>

        {/* Recomendaciones Section */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-700/50 mb-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
            <svg className="w-6 h-6 text-cyan-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Recomendaciones Personalizadas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900/30 p-6 rounded-lg border border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Para Reducir el Uso de Redes
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span className="text-gray-400">Establece límites de tiempo diario</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span className="text-gray-400">Desactiva notificaciones no esenciales</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span className="text-gray-400">Crea zonas libres de teléfono</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span className="text-gray-400">Reemplaza el hábito con actividades alternativas</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-900/30 p-6 rounded-lg border border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                Para Mejorar el Sueño y Bienestar
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span className="text-gray-400">Evita pantallas 1-2 horas antes de dormir</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span className="text-gray-400">Mantén un horario regular de sueño</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span className="text-gray-400">Practica técnicas de relajación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span className="text-gray-400">Considera terapia si persisten problemas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Volver al Formulario
          </button>
        </div>
      </div>
    </div>
  );
}