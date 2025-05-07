import express, { Request, Response } from 'express';
import db from '../db/db';

const router = express.Router();

//actualizas datos de prrofesores
router.put('/datos/:id/ac', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, curso, foto, horario } = req.body;

  let updateQuery = 'UPDATE profesores SET ';
  const values = [];
  const fieldsToUpdate = [];

  if (nombre !== undefined) {
    fieldsToUpdate.push('nombre = ?');
    values.push(nombre);
  }
  if (apellidos !== undefined) {
    fieldsToUpdate.push('apellidos = ?');
    values.push(apellidos);
  }
  if (curso !== undefined) {
    fieldsToUpdate.push('curso = ?');
    values.push(curso);
  }
  if (foto !== undefined) {
    fieldsToUpdate.push('foto = ?');
    values.push(foto);
  }
  if (horario !== undefined) {
    fieldsToUpdate.push('horario = ?');
    values.push(JSON.stringify(horario));
  }

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updateQuery += fieldsToUpdate.join(', ') + ' WHERE id = ?';
  values.push(id);

  try {
    await queryDb(updateQuery, values);
    return res
      .status(200)
      .json({ message: 'Datos actualizados correctamente' });
  } catch (error) {
    console.error('Error en la actualización:', error);
    return res.status(500).json({ error: 'Error al actualizar los datos' });
  }
});

router.get('/datos/horarios', async (req: Request, res: Response) => {
  try {
    const results = await queryDb('SELECT id, nombre, apellidos, horario FROM profesores', []);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron horarios' });
    }

    const horarios = results.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      apellidos: row.apellidos,
      horario: typeof row.horario === 'string' ? JSON.parse(row.horario) : row.horario, // Parsear solo si es una cadena
    }));

    return res.status(200).json(horarios);
  } catch (err) {
    console.error('Error al obtener los horarios:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//profesores/datos:id obtienes datos de profesores
router.get('/datos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results = await queryDb('SELECT * FROM profesores WHERE id = ?', [
      id,
    ]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Datos no encontrados' });
    }
    const Datos = results[0];

    return res.json({
      id: Datos.id,
      nombre: Datos.nombre,
      apellidos: Datos.apellidos,
      curso: Datos.curso,
      foto: Datos.foto,
      horario: Datos.horario,
    });
  } catch (err) {
    console.error('Error en el servidor:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});


//profesores/datos
router.post('/datos', async (req: Request, res: Response) => {
  const { nombre, apellidos, curso, foto, horario } = req.body;

  try {
    const result = await queryDb(
      'INSERT INTO profesores (nombre, apellidos, curso, foto, horario) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellidos, curso, foto, JSON.stringify(horario)]
    );

    return res
      .status(201)
      .json({ message: 'Profesor insertado correctamente', id: result });
  } catch (err) {
    console.error('Error en el servidor:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/notis/guardias', async (req: Request, res: Response) => {
  if (!req.files || !req.files['file']) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  const file = req.files['file']; 
  let fileData: Buffer;

  if (Array.isArray(file)) {
    return res.status(400).send('Solo se permite subir un archivo a la vez.');
  } else {
    fileData = file.data; 
  }

  const { id_profesor, horario } = req.body;

  if (!id_profesor || !horario) {
    return res.status(400).json({ message: 'Faltan parámetros necesarios' });
  }

  try {
    const result = await queryDb(
      'INSERT INTO guardias (id_profesor, horario, justificante) VALUES (?, ?, ?)',
      [id_profesor, JSON.stringify(horario), fileData]
    );

    return res.status(201).json({ message: 'Profesor insertado correctamente' });
  } catch (err) {
    console.error('Error en el servidor: ', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/notis/up'),
  async (res: Response) => {
    try {
      const results = await queryDb('SELECT * FROM guardias', [   
      ]);

      if (results.length === 0) {
        return res.status(404).json({ message: 'Datos no encontrados' });
      }
      const Datos = results[0];

      return res.json({
        id_horario : Datos.id_horario,
        id_profesor : Datos.id_profesor,
        horario : Datos.horario,
        fechaHorario : Datos.fechaHorario,
        notificaciones : Datos.notis
      });
    } catch (err) {
      console.error('Error en el servidor:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

const queryDb = (query: string, values: any[]) => {
  return new Promise<any[]>((resolve, reject) => {
    db.query(query, values, (err, results: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

export default router;
