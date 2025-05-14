import express, { Request, Response } from 'express';
import db from '../db/db';

const router = express.Router();

//insrt/nombre/apellidos/curso/foto/horario Profesores"
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
//insrt/id_profesor/horario/justificante(opcional) Guardias"
router.post('/notis/guardias', async (req: Request, res: Response) => {
  let fileData: Buffer | null = null;

  if (req.files && req.files['file']) {
    const file = req.files['file'];

    if (Array.isArray(file)) {
      return res.status(400).send('Solo se permite subir un archivo a la vez.');
    } else {
      fileData = file.data;
    }
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

    return res.status(201).json({ message: 'Guardia insertada correctamente' });
  } catch (err) {
    console.error('Error en el servidor: ', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});
//obti/id/nombre/apellidos/horario Profesores"
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
//obti/*Datos Guardias"
router.get('/datos/ausencias', async (req: Request, res: Response) => {
  try {
    const results = await queryDb('SELECT * FROM guardias', []);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ausencias' });
    }

    return res.json(results);

  } catch (err) {
    console.error('Error al obtener los horarios:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});
//obti/*Datos Profesores"
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
      roll: Datos.roll
    });
  } catch (err) {
    console.error('Error en el servidor:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});
//obti/*Datos Guardias"
router.post('/notis/up'), async (res: Response) => {
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
}};
//actu/justificante/comentario/tareas (opcionales) Guardias"
router.put('/notis/ac', async (req: Request, res: Response) => {
  const { id, comentario } = req.body;
  let justificanteData: Buffer | null = null;
  let tareasData: Buffer | null = null;

  if (req.files && req.files['justificante']) {
      const file = req.files['justificante'];

      if (Array.isArray(file)) {
          return res.status(400).send('Solo se permite subir un archivo de justificante a la vez.');
      } else {
          justificanteData = (file as any).data; 
      }
  }

  if (req.files && req.files['tareas']) {
      const file = req.files['tareas'];

      if (Array.isArray(file)) {
          return res.status(400).send('Solo se permite subir un archivo de tareas a la vez.');
      } else {
          tareasData = (file as any).data; 
      }
  }

  let updateQuery = 'UPDATE guardias SET ';
  const values: any[] = [];
  const fieldsToUpdate: string[] = [];

  if (justificanteData !== null) {
      fieldsToUpdate.push('justificante = ?');
      values.push(justificanteData);
  }
  
  if (comentario !== undefined) {
      fieldsToUpdate.push('comentario = ?');
      values.push(comentario);
  }

  if (tareasData !== null) {
      fieldsToUpdate.push('tareas = ?');
      values.push(tareasData);
  }

  if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  updateQuery += fieldsToUpdate.join(', ') + ' WHERE id_horario = ?';
  values.push(id);

  try {
      await queryDb(updateQuery, values);
      return res.status(200).json({ message: 'Datos actualizados correctamente' });
  } catch (error) {
      console.error('Error en la actualización:', error);
      return res.status(500).json({ error: 'Error al actualizar los datos' });
  }
});
//actu/nombre/apellidos/curso/foto/horario (opcionales) Profesores"
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
