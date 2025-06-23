"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';

type FormData = {
  edad: number;
  nivelEstudios: string;
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
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log(data);
    setSubmitted(true);
  };

  const afectacionDesempeno = watch('afectacionDesempeno');
  const conflictosRedes = watch('conflictosRedes');
  const estadoEmocional = watch('estadoEmocional');
  const usoRedesSociales = watch('usoRedesSociales');

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
                    max: { value: 16, message: 'Debes tener menos de 17 años' },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo se permiten números'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                {errors.genero && <p className="mt-1 text-sm text-red-600">{errors.genero.message}</p>}
              </div>

              {/* 4. Horas en redes sociales */}
              <div>
                <label htmlFor="horasRedesSociales" className="block text-sm font-medium text-gray-700">
                  4. Selecciona el número de horas diarias que dedicas al uso de redes sociales
                </label>
                <input
                  id="horasRedesSociales"
                  type="number"
                  {...register('horasRedesSociales', {
                    required: 'Este campo es obligatorio',
                    min: { value: 0, message: 'El valor no puede ser negativo' },
                    max: { value: 11, message: 'No puede ser mayor a 11 horas' },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo se permiten números'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                {errors.horasRedesSociales && <p className="mt-1 text-sm text-red-600">{errors.horasRedesSociales.message}</p>}
              </div>

              {/* 5. Red social favorita */}
              <div>
                <label htmlFor="redSocialFavorita" className="block text-sm font-medium text-gray-700">
                  5. Selecciona la red social que más uses
                </label>
                <select
                  id="redSocialFavorita"
                  {...register('redSocialFavorita', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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

              {/* 6. Afectación desempeño académico */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  6. ¿Consideras que las redes sociales han afectado tu desempeño académico?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('afectacionDesempeno', { required: 'Este campo es obligatorio' })}
                      value="true"
                      checked={afectacionDesempeno === true}
                      onChange={() => setValue('afectacionDesempeno', true)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('afectacionDesempeno')}
                      value="false"
                      checked={afectacionDesempeno === false}
                      onChange={() => setValue('afectacionDesempeno', false)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
                {errors.afectacionDesempeno && <p className="mt-1 text-sm text-red-600">{errors.afectacionDesempeno.message}</p>}
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
                    max: { value: 8, message: 'No puede ser más de 8 horas' },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo se permiten números'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                {errors.horasSueno && <p className="mt-1 text-sm text-red-600">{errors.horasSueno.message}</p>}
              </div>

              {/* 8. Estado emocional */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  8. Actualmente, ¿cómo te encuentras emocionalmente? (1 = Mal, 10 = Excelente)
                </label>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <label key={num} className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register('estadoEmocional', { required: 'Este campo es obligatorio' })}
                        value={num}
                        checked={estadoEmocional === num}
                        onChange={() => setValue('estadoEmocional', num)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-1 text-sm text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mal</span>
                  <span>Excelente</span>
                </div>
                {errors.estadoEmocional && <p className="mt-1 text-sm text-red-600">{errors.estadoEmocional.message}</p>}
              </div>

              {/* 9. Relación actual */}
              <div>
                <label htmlFor="relacionActual" className="block text-sm font-medium text-gray-700">
                  9. Indica qué tipo de relación tienes actualmente
                </label>
                <select
                  id="relacionActual"
                  {...register('relacionActual', { required: 'Este campo es obligatorio' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Soltero">Soltero/a</option>
                  <option value="En una relación">En una relación</option>
                  <option value="Es complicado">Es complicado</option>
                </select>
                {errors.relacionActual && <p className="mt-1 text-sm text-red-600">{errors.relacionActual.message}</p>}
              </div>

              {/* 10. Conflictos por redes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  10. ¿Has tenido conflictos con desconocidos, amigos o familiares debido a las redes sociales?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('conflictosRedes', { required: 'Este campo es obligatorio' })}
                      value="true"
                      checked={conflictosRedes === true}
                      onChange={() => setValue('conflictosRedes', true)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sí</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('conflictosRedes')}
                      value="false"
                      checked={conflictosRedes === false}
                      onChange={() => setValue('conflictosRedes', false)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
                {errors.conflictosRedes && <p className="mt-1 text-sm text-red-600">{errors.conflictosRedes.message}</p>}
              </div>

              {/* 11. Uso de redes sociales */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  11. En tu consideración, ¿qué tanto usas redes sociales? (1 = Poco, 10 = Demasiado)
                </label>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <label key={num} className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register('usoRedesSociales', { required: 'Este campo es obligatorio' })}
                        value={num}
                        checked={usoRedesSociales === num}
                        onChange={() => setValue('usoRedesSociales', num)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-1 text-sm text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poco</span>
                  <span>Demasiado</span>
                </div>
                {errors.usoRedesSociales && <p className="mt-1 text-sm text-red-600">{errors.usoRedesSociales.message}</p>}
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