"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import axios from 'axios';

type FormData = {
  edad: number;
  nivelEstudios: string;
  genero: string;
  pais: string;
  horasRedesSociales: number;
  redSocialFavorita: string;
  horasSueno: number;
  relacionActual: string;
  conflictosRedes: boolean;
};

export default function EncuestaRedesSociales() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('formSubmitted');
    if (hasSubmitted) {
      setSubmitted(true);
    }
    setLoading(false);
  }, []);

  const onSubmit = (data: FormData) => {
    data.conflictosRedes = data.conflictosRedes ? true : false;
    axios.post('/api/form-data', data)
      .then(response => {
        console.log(response.data);
        localStorage.setItem('formSubmitted', 'true');
        setSubmitted(true);
      })
      .catch(error => {
        console.error('Hubo un error al enviar el formulario:', error.response?.data || error.message);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Encuesta sobre Redes Sociales</title>
      </Head>
      
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        {submitted ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Gracias por participar!</h2>
            <p className="text-gray-600">Tus respuestas han sido registradas correctamente.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Encuesta sobre Redes Sociales</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. Edad */}
              <div>
                <label htmlFor="edad" className="block text-sm font-medium text-gray-700">
                  1. Ingresa tu edad
                </label>
                <input
                  id="edad"
                  type="number"
                  {...register('edad', {
                    required: 'Este campo es obligatorio',
                    min: { value: 17, message: 'Debes tener al menos 17 años' },
                    setValueAs: v => parseInt(v, 10),
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo se permiten números'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
                />
                {errors.edad && <p className="mt-1 text-sm text-red-600">{errors.edad.message}</p>}
              </div>

              {/* 2. Nivel de estudios */}
              <div>
                <label htmlFor="nivelEstudios" className="block text-sm font-medium text-gray-700">
                  2. Indica tu nivel de estudios actual
                </label>
                <select
                  id="nivelEstudios"
                  {...register('nivelEstudios', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="TSU">TSU</option>
                  <option value="Licenciatura">Licenciatura</option>
                  <option value="Maestría">Maestría</option>
                </select>
                {errors.nivelEstudios && <p className="mt-1 text-sm text-red-600">{errors.nivelEstudios.message}</p>}
              </div>

              {/* 3. Género */}
              <div>
                <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
                  3. Selecciona tu género
                </label>
                <select
                  id="genero"
                  {...register('genero', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                {errors.genero && <p className="mt-1 text-sm text-red-600">{errors.genero.message}</p>}
              </div>

              {/* 4. País */}
              <div>
                <label htmlFor="pais" className="block text-sm font-medium text-gray-700">
                  4. ¿De qué país eres?
                </label>
                <select
                  id="pais"
                  {...register('pais', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="México">México</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Canadá">Canadá</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Honduras">Honduras</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Brasil">Brasil</option>
                  <option value="España">España</option>
                </select>
                {errors.pais && <p className="mt-1 text-sm text-red-600">{errors.pais.message}</p>}
              </div>

              {/* 5. Horas en redes sociales */}
              <div>
                <label htmlFor="horasRedesSociales" className="block text-sm font-medium text-gray-700">
                  5. Selecciona el número de horas diarias que dedicas al uso de redes sociales
                </label>
                <input
                  id="horasRedesSociales"
                  type="number"
                  {...register('horasRedesSociales', {
                    required: 'Este campo es obligatorio',
                    min: { value: 0, message: 'El valor no puede ser negativo' },
                    max: { value: 24, message: 'No puede ser mayor a 24 horas' },
                    setValueAs: v => parseInt(v, 10),
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo se permiten números'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
                />
                {errors.horasRedesSociales && <p className="mt-1 text-sm text-red-600">{errors.horasRedesSociales.message}</p>}
              </div>

              {/* 6. Red social favorita */}
              <div>
                <label htmlFor="redSocialFavorita" className="block text-sm font-medium text-gray-700">
                  6. Selecciona la red social que más uses
                </label>
                <select
                  id="redSocialFavorita"
                  {...register('redSocialFavorita', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
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
                {errors.redSocialFavorita && <p className="mt-1 text-sm text-red-600">{errors.redSocialFavorita.message}</p>}
              </div>

              {/* 7. Horas de sueño */}
              <div>
                <label htmlFor="horasSueno" className="block text-sm font-medium text-gray-700">
                  7. Por favor, selecciona el número de horas que duermes al día
                </label>
                <input
                  id="horasSueno"
                  type="number"
                  {...register('horasSueno', {
                    required: 'Este campo es obligatorio',
                    min: { value: 1, message: 'Debe ser al menos 1 hora' },
                    max: { value: 14, message: 'No puede ser más de 14 horas' },
                    setValueAs: v => parseInt(v, 10),
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo se permiten números'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
                />
                {errors.horasSueno && <p className="mt-1 text-sm text-red-600">{errors.horasSueno.message}</p>}
              </div>

              {/* 8. Relación actual */}
              <div>
                <label htmlFor="relacionActual" className="block text-sm font-medium text-gray-700">
                  8. Indica qué tipo de relación tienes actualmente
                </label>
                <select
                  id="relacionActual"
                  {...register('relacionActual', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Soltero">Soltero/a</option>
                  <option value="En una relación">En una relación</option>
                  <option value="Es complicado">Es complicado</option>
                </select>
                {errors.relacionActual && <p className="mt-1 text-sm text-red-600">{errors.relacionActual.message}</p>}
              </div>

              {/* 9. Conflictos por redes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  9. ¿Has tenido conflictos con desconocidos, amigos o familiares debido a las redes sociales?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('conflictosRedes', {
                        required: 'Este campo es obligatorio',
                        setValueAs: v => v === 'true'
                      })}
                      value="true"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('conflictosRedes', { setValueAs: v => v === 'true' })}
                      value="false"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
                {errors.conflictosRedes && <p className="mt-1 text-sm text-red-600">{errors.conflictosRedes.message}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Enviar encuesta
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
