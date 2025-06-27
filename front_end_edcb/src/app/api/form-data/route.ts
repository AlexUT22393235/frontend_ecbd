import { NextResponse } from 'next/server';
import { z } from 'zod';
import mysql from 'mysql2/promise';

// Esquema de validación con Zod actualizado para el nuevo formulario
const formDataSchema = z.object({
  edad: z.number().min(17),
  nivelEstudios: z.string().nonempty('Este campo es obligatorio'),
  genero: z.string().nonempty('Este campo es obligatorio'),
  pais: z.string().nonempty('Este campo es obligatorio'),
  horasRedesSociales: z.number().min(0),
  redSocialFavorita: z.string().nonempty('Este campo es obligatorio'),
  horasSueno: z.number().min(1),
  relacionActual: z.string().nonempty('Este campo es obligatorio'),
  conflictosRedes: z.boolean(),
});

// Mapeo de valores de texto a números para la base de datos
const genderMap: { [key: string]: number } = {
  'Masculino': 1,
  'Femenino': 2,
};

const relationshipMap: { [key: string]: number } = {
  'Soltero/a': 1,
  'En una relación': 2,
  'Es complicado': 3,
};

async function getConnection() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
    return connection;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Validar los datos con Zod
    const validatedData = formDataSchema.parse(data);

    // 2. Transformar los datos para la base de datos
    const transformedData = {
      ...validatedData,
      genero: genderMap[validatedData.genero],
      relacionActual: relationshipMap[validatedData.relacionActual],
      conflictosRedes: validatedData.conflictosRedes ? 1 : 0,
    };

    // 3. Insertar en la base de datos
    const connection = await getConnection();
    const sql = `
      INSERT INTO form_data (
        Age, academic_level, Gender, Country, avg_daily_usage_hours,
        most_used_platform, sleep_hours_per_night,
        relationship_status, conflicts_over_social_media
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [
      transformedData.edad,
      transformedData.nivelEstudios,
      transformedData.genero,
      transformedData.pais,
      transformedData.horasRedesSociales,
      transformedData.redSocialFavorita,
      transformedData.horasSueno,
      transformedData.relacionActual,
      transformedData.conflictosRedes,
    ];

    await connection.execute(sql, values);
    await connection.end();

    return NextResponse.json({ message: 'Datos guardados correctamente' }, { status: 201 });

  } catch (error) {
    // Manejo de errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    // Manejo de otros errores
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 