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
    sleepQuality: any | null;
    highAddiction: any | null;
    conflictRisk: any | null;
    screenTime: any | null;
    socialWellbeing: any | null;
    studyEfficiency: any | null;
  }>({
    adiccion: null,
    rendimiento: null,
    saludMental: null,
    sleepQuality: null,
    highAddiction: null,
    conflictRisk: null,
    screenTime: null,
    socialWellbeing: null,
    studyEfficiency: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const getParam = (clave: string) => searchParams.get(clave) ?? searchParams.get(clave.toLowerCase());

        const horasUso = getParam('HorasUso');
        const horasSueno = getParam('HorasSueno');
        const relacionInt = getParam('RelacionInt');
        const edad = getParam('Edad');
        const estadoEmocional = getParam('EstadoEmocional');
        const usoRedesSociales = getParam('UsoRedesSociales');
        const plataforma = getParam('Plataforma');
        const afectacion = getParam('AfectacionDesempeno');

        if (!horasUso || !horasSueno || !edad || !relacionInt || !usoRedesSociales || !plataforma || !afectacion) {
          setError('Faltan parámetros requeridos');
          setLoading(false);
          return;
        }

        // Valores ya convertidos en el formulario, solo aseguramos fallback
        const relacionNum = relacionInt || '1';


        // Formatear las horas para que siempre tengan punto decimal si son enteras


        const formatFloatString = (value: string): string => {
          const num = parseFloat(value);
          return Number.isInteger(num) ? num.toFixed(1) : num.toString();
        };

        const horasUsoFmt = formatFloatString(horasUso);
        const horasSuenoFmt = formatFloatString(horasSueno);
        
        const [adiccionRes, rendimientoRes, saludMentalRes] = await Promise.allSettled([
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.ADICCION, horasUsoFmt, horasSuenoFmt)),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.RENDIMIENTO, horasUsoFmt, horasSuenoFmt)),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.SALUD_MENTAL, horasSuenoFmt, relacionNum.toString()))
        ]);

        // Extraer datos de las respuestas para calcular las nuevas constantes
        const AdiccionData = adiccionRes.status === 'fulfilled' ? adiccionRes.value.data : null;
        const RendimientoData = rendimientoRes.status === 'fulfilled' ? rendimientoRes.value.data : null;
        const SaludMentalData = saludMentalRes.status === 'fulfilled' ? saludMentalRes.value.data : null;

        // Constantes derivadas (PascalCase)
        const UsoRedesSociales = AdiccionData
          ? Math.round((AdiccionData.prediccion_porcentaje ?? 50) / 10) // Escala 0-10
          : parseInt(usoRedesSociales || '5');

        const EstadoEmocional = SaludMentalData
          ? Math.round(SaludMentalData.salud_mental_score ?? 5)
          : parseInt(estadoEmocional || '5');

        const Afectacion = (() => {
          if (RendimientoData) {
            if (typeof RendimientoData.prediccion_booleana === 'boolean') {
              return RendimientoData.prediccion_booleana ? 1 : 0;
            }
            if (typeof RendimientoData.prediccion === 'string') {
              return RendimientoData.prediccion === 'Sí' ? 1 : 0;
            }
          }
          return parseInt(afectacion || '0');
        })();

        // Llamadas a los nuevos endpoints usando las constantes calculadas
        const [sleepRes, conflictRes, screenTimeRes, studyEffRes] = await Promise.allSettled([
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.SLEEP_QUALITY, horasSuenoFmt, EstadoEmocional.toString(), UsoRedesSociales.toString())),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.CONFLICT_RISK, UsoRedesSociales.toString(), horasUsoFmt, relacionNum, plataforma || '1')),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.RECOMMENDED_SCREEN_TIME, edad, UsoRedesSociales.toString(), EstadoEmocional.toString())),
          //axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.SOCIAL_WELLBEING, relacionNum, EstadoEmocional.toString(), plataforma || '1', UsoRedesSociales.toString())),
          axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.STUDY_EFFICIENCY, Afectacion.toString(), horasUsoFmt, horasSuenoFmt))
        ]);

        const newResults = {
          adiccion: adiccionRes.status === 'fulfilled' ? adiccionRes.value.data : null,
          rendimiento: rendimientoRes.status === 'fulfilled' ? rendimientoRes.value.data : null,
          saludMental: saludMentalRes.status === 'fulfilled' ? saludMentalRes.value.data : null,
          sleepQuality: sleepRes.status === 'fulfilled' ? sleepRes.value.data : null,
          conflictRisk: conflictRes.status === 'fulfilled' ? conflictRes.value.data : null,
          screenTime: screenTimeRes.status === 'fulfilled' ? screenTimeRes.value.data : null,
           //socialWellbeing: socialWellRes.status === 'fulfilled' ? socialWellRes.value.data : null,
          studyEfficiency: studyEffRes.status === 'fulfilled' ? studyEffRes.value.data : null,
          highAddiction: null,
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

          {/* Calidad de Sueño Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <span className="w-3 h-3 bg-teal-500 rounded-full mr-2"></span>
                Calidad de Sueño
              </h2>
              <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                Bienestar
              </span>
            </div>

            {results.sleepQuality ? (
              <div className="space-y-6 text-center">
                <div
                  className={`text-5xl font-bold ${
                    results.sleepQuality?.Categoria === 'Buena' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {results.sleepQuality?.Categoria}
                </div>
                {results.sleepQuality?.Grafica && (
                  <img
                    src={results.sleepQuality.Grafica}
                    alt="Gráfica calidad de sueño"
                    className="w-full h-80 object-contain rounded-lg"
                  />
                )}
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  {results.sleepQuality?.Categoria === 'Buena'
                    ? 'Tu calidad de sueño es adecuada. Mantén horarios regulares y un ambiente silencioso para dormir.'
                    : 'La calidad de tu sueño podría mejorar. Intenta limitar pantallas antes de dormir y establecer rutinas relajantes.'}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                Servicio no disponible
              </div>
            )}
          </div>

          {/* Riesgo de Conflictos Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                Riesgo de Conflictos
              </h2>
              <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                Social
              </span>
            </div>

            {results.conflictRisk ? (
              <div className="space-y-6 text-center">
                <div
                  className={`text-5xl font-bold ${
                    results.conflictRisk?.RiesgoAlto ? 'text-yellow-400' : 'text-green-400'
                  }`}
                >
                  {results.conflictRisk?.RiesgoAlto ? '⚠️' : '✅'}
                </div>
                <div className="text-lg font-medium text-gray-300">
                  {((results.conflictRisk?.Probabilidad || 0) * 100).toFixed(1)}% probabilidad
                                  {/* Explicación de la CDF */}
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  La curva azul muestra cómo se distribuye el riesgo en la comunidad. La línea roja indica tu probabilidad; cuanto más a la derecha esté, mayor es tu riesgo comparado con los demás.
                </p>
                </div>
                {results.conflictRisk?.Grafica && (
                  <img
                    src={results.conflictRisk.Grafica}
                    alt="Gráfica riesgo de conflictos"
                    className="w-full h-80 object-contain rounded-lg"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                Servicio no disponible
              </div>
            )}
            {/* Mensaje explicativo */}
            {results.conflictRisk?.RiesgoAlto ? (
              <div className="text-yellow-300 text-sm max-w-md mx-auto space-y-2">
                <p>Tu nivel de riesgo de conflictos es alto. Para reducirlo, prueba lo siguiente:</p>
                <ul className="list-disc list-inside text-yellow-200 text-left">
                  <li>Establece límites de tiempo al usar redes sociales.</li>
                  <li>Evita responder impulsivamente; tómate unos minutos antes de contestar.</li>
                  <li>Practica la comunicación asertiva y escucha activa.</li>
                  <li>Programa descansos regulares lejos de la pantalla.</li>
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 text-sm max-w-md mx-auto">Mantienes un riesgo bajo de conflictos. Continúa gestionando tu tiempo en redes y tu comunicación de forma saludable.</p>
            )}
          </div>

          {/* Tiempo de Pantalla Recomendado Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Tiempo de Pantalla Recomendado
              </h2>
              <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                Consejo
              </span>
            </div>

            {results.screenTime ? (
              <div className="space-y-6 text-center">
                <div className="text-5xl font-bold text-green-400">
                  {results.screenTime?.RecommendedHours} h
                </div>
                <div className="text-gray-400">Horas recomendadas al día</div>
                {results.screenTime?.Grafica && (
                  <img
                    src={results.screenTime.Grafica}
                    alt="Gráfica tiempo de pantalla"
                    className="w-full h-80 object-contain rounded-lg"
                  />
                )}
                {/* Mensaje explicativo */}
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Esta cifra indica las horas de uso diarias recomendadas para tu perfil. No es un límite máximo estricto, pero superarla con frecuencia puede aumentar el riesgo de efectos negativos.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                Servicio no disponible
              </div>
            )}
          </div>

          {/* Eficiencia de Estudio Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <span className="w-3 h-3 bg-purple-400 rounded-full mr-2"></span>
                Eficiencia de Estudio
              </h2>
              <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                Académico
              </span>
            </div>

            {results.studyEfficiency ? (
              <div className="space-y-6 text-center">
                <div className="text-5xl font-bold text-purple-400">
                  {results.studyEfficiency?.StudyEfficiencyScore}%
                </div>
                {results.studyEfficiency?.Grafica && (
                  <img
                    src={results.studyEfficiency.Grafica}
                    alt="Gráfica eficiencia de estudio"
                    className="w-full h-80 object-contain rounded-lg"
                  />
                )}
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  {results.studyEfficiency?.StudyEfficiencyScore >= 75
                    ? 'Buen nivel de eficiencia. Continúa organizando tu tiempo y descansando adecuadamente.'
                    : 'Podrías mejorar tu eficiencia de estudio. Limita distracciones digitales y planifica sesiones de estudio con pausas.'}
                </p>
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