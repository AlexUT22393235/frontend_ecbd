"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type FormData = {
  edad: number;
  nivelEstudios: string;
  pais: string;
  genero: string;
  horasRedesSociales: number;
  redSocialFavorita: string;
  afectacionDesempeno: boolean;
  horasSueno: number;
  estadoEmocional: number;
  relacionActual: string;
  conflictosRedes: boolean;
  usoRedesSociales: number;
};

export default function EncuestaRedesSociales() {
  const router = useRouter();

  // Cargar valores guardados (si existen)
  const savedData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('formData') || '{}') : {};

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: savedData
  });

  // Sincronizar cambios con localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      try {
        localStorage.setItem('formData', JSON.stringify(value));
      } catch (e) {
        console.error('Error guardando formData', e);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Restaurar datos si el usuario vuelve y formData se actualizó externamente
  useEffect(() => {
    reset(savedData);
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('formSubmitted');
    if (hasSubmitted) {
      setSubmitted(true);
    }
    setLoading(false);
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      data.conflictosRedes = data.conflictosRedes ? true : false;
      
      // Log para verificar los tipos de datos
      console.log('Datos del formulario:', {
        horasRedesSociales: data.horasRedesSociales,
        tipo_horasRedesSociales: typeof data.horasRedesSociales,
        horasSueno: data.horasSueno,
        tipo_horasSueno: typeof data.horasSueno
      });
      
      // Enviar datos del formulario
      //await axios.post('/api/form-data', data);
      
      // Guardar en localStorage
      //localStorage.setItem('formSubmitted', 'true');
      setSubmitted(true);
      
      // Mapear relación actual a número para backend (1=Soltero, 2=En relación, 3=Otro)
      const relacionMap: { [key: string]: number } = {
        'Soltero/a': 1,
        'En una relación': 2,
        'Es complicado': 3,
      };
      const relacionCodigo = relacionMap[data.relacionActual] ?? 3;

      // Redirigir a la página de resultados con los parámetros necesarios
      const params = new URLSearchParams({
        horasUso: data.horasRedesSociales.toString(),
        horasSueno: data.horasSueno.toString(),
        relacionActual: relacionCodigo.toString(),
      });
      
      console.log('Parámetros de URL:', params.toString());
      router.push(`/resultados?${params.toString()}`);
      
    } catch (error) {
      console.error('Hubo un error al enviar el formulario:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-200">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Encuesta sobre Redes Sociales</title>
      </Head>
      
      <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:max-w-2xl p-8 border border-gray-700">
        {submitted ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-green-400 mb-4">¡Gracias por participar!</h2>
            <p className="text-gray-300">Tus respuestas han sido registradas correctamente.</p>
            <p className="text-gray-400 mt-2">Redirigiendo a tus resultados...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-100 mb-8 tracking-tight">Encuesta sobre Redes Sociales</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. Edad */}
              <div>
                <label htmlFor="edad" className="block text-sm font-medium text-gray-300">
                  1. Ingresa tu edad
                </label>
                <input
                  id="edad"
                  type="number"
                  {...register('edad', {
                    required: 'Este campo es obligatorio',
                    min: { value: 17, message: 'Debes tener al menos 17 años' },
                    setValueAs: (v: string) => parseInt(v, 10),
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo se permiten números",
                    },
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm p-2 text-gray-100 placeholder-gray-500 transition-colors duration-200"
                />
                {errors.edad && <p className="mt-1 text-sm text-red-400">{errors.edad.message}</p>}
              </div>

              {/* 2. Nivel de estudios */}
              <div>
                <label htmlFor="nivelEstudios" className="block text-sm font-medium text-gray-300">
                  2. Indica tu nivel de estudios actual
                </label>
                <select
                  id="nivelEstudios"
                  {...register('nivelEstudios', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 py-2 px-3 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm text-gray-100 placeholder-gray-500 transition-colors duration-200"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="TSU">TSU</option>
                  <option value="Licenciatura">Licenciatura</option>
                  <option value="Maestría">Maestría</option>
                </select>
                {errors.nivelEstudios && <p className="mt-1 text-sm text-red-400">{errors.nivelEstudios.message}</p>}
              </div>

              <div>
                <label htmlFor="genero" className="block text-sm font-medium text-gray-300">
                  3. Selecciona tu género
                </label>
                <select
                  id="genero"
                  {...register('genero', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 py-2 px-3 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm text-gray-100 placeholder-gray-500 transition-colors duration-200"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                {errors.genero && <p className="mt-1 text-sm text-red-400">{errors.genero.message}</p>}
              </div>

              {/* 4. País */}
              <div>
                <label htmlFor="pais" className="block text-sm font-medium text-gray-300">
                  4. ¿De qué país eres?
                </label>
                <select
                  id="pais"
                  {...register('pais', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 py-2 px-3 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm text-gray-100 placeholder-gray-500 transition-colors duration-200"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="México">México</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Canadá">Canadá</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="España">España</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.pais && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pais.message}
                  </p>
                )}
              </div>

              {/* 3. Género */}
              <div>
                <label
                  htmlFor="genero"
                  className="block text-sm font-medium text-gray-700"
                >
                  3. Selecciona tu género
                </label>
                <select
                  id="genero"
                  {...register("genero", {
                    required: "Este campo es obligatorio",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                {errors.pais && <p className="mt-1 text-sm text-red-400">{errors.pais.message}</p>}
              </div>

              {/* 4. Horas en redes sociales */}
              <div>
                <label htmlFor="horasRedesSociales" className="block text-sm font-medium text-gray-300">
                  5. Selecciona el número de horas diarias que dedicas al uso de redes sociales
                </label>
                <input
                  id="horasRedesSociales"
                  type="number"
                  {...register('horasRedesSociales', {
                    required: 'Este campo es obligatorio',
                    min: { value: 0, message: 'El valor no puede ser negativo' },
                    max: { value: 24, message: 'No puede ser mayor a 24 horas' },
                    setValueAs: (v: string) => parseFloat(v),
                    pattern: {
                      value: /^[0-9]+(\.[0-9]+)?$/,
                      message: 'Solo se permiten números (enteros o decimales)'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm p-2 text-gray-100 placeholder-gray-500 transition-colors duration-200"
                />
                {errors.horasRedesSociales && <p className="mt-1 text-sm text-red-400">{errors.horasRedesSociales.message}</p>}
              </div>

              {/* 5. Red social favorita */}
              <div>
                <label htmlFor="redSocialFavorita" className="block text-sm font-medium text-gray-300">
                  6. Selecciona la red social que más uses
                </label>
                <select
                  id="redSocialFavorita"
                  {...register('redSocialFavorita', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 py-2 px-3 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm text-gray-100 placeholder-gray-500 transition-colors duration-200"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter/X</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Snapchat">Snapchat</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Otra">Otra</option>
                </select>
                {errors.redSocialFavorita && <p className="mt-1 text-sm text-red-400">{errors.redSocialFavorita.message}</p>}
              </div>

              {/* 7. Horas de sueño */}
              <div>
                <label htmlFor="horasSueno" className="block text-sm font-medium text-gray-300">
                  7. Por favor, selecciona el número de horas que duermes al día
                </label>
                <input
                  id="horasSueno"
                  type="number"
                  {...register('horasSueno', {
                    required: 'Este campo es obligatorio',
                    min: { value: 1, message: 'Debe ser al menos 1 hora' },
                    max: { value: 14, message: 'No puede ser más de 14 horas' },
                    setValueAs: (v: string) => parseFloat(v),
                    pattern: {
                      value: /^[0-9]+(\.[0-9]+)?$/,
                      message: 'Solo se permiten números (enteros o decimales)'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm p-2 text-gray-100 placeholder-gray-500 transition-colors duration-200"
                />
                {errors.horasSueno && <p className="mt-1 text-sm text-red-400">{errors.horasSueno.message}</p>}
              </div>

              {/* 9. Relación actual */}
              <div>
                <label htmlFor="relacionActual" className="block text-sm font-medium text-gray-300">
                  8. Indica qué tipo de relación tienes actualmente
                </label>
                <select
                  id="relacionActual"
                  {...register('relacionActual', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 py-2 px-3 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm text-gray-100 placeholder-gray-500 transition-colors duration-200"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Soltero">Soltero/a</option>
                  <option value="En una relación">En una relación</option>
                  <option value="Es complicado">Es complicado</option>
                </select>
                {errors.relacionActual && <p className="mt-1 text-sm text-red-400">{errors.relacionActual.message}</p>}
              </div>

              {/* 10. Conflictos por redes */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  9. ¿Has tenido conflictos con desconocidos, amigos o familiares debido a las redes sociales?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('conflictosRedes', {
                        required: 'Este campo es obligatorio',
                        setValueAs: (v: string) => v === 'true'
                      })}
                      value="true"
                      className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 bg-gray-900 border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-200">Sí</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('conflictosRedes', { setValueAs: (v: string) => v === 'true' })}
                      value="false"
                      className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 bg-gray-900 border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-200">No</span>
                  </label>
                </div>
                {errors.conflictosRedes && <p className="mt-1 text-sm text-red-400">{errors.conflictosRedes.message}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {submitting ? 'Enviando...' : 'Enviar encuesta'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
