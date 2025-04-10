import express, { Request, Response } from 'express';
import db from '../db/db';  


const router = express.Router();

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
      values.push(JSON.stringify(horario)); // Asegúrate de convertir a JSON si es necesario
  }

  if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
  }

  updateQuery += fieldsToUpdate.join(', ') + ' WHERE id = ?';
  values.push(id);  

  console.log('Consulta SQL:', updateQuery);
  console.log('Valores:', values);

  try {
       await queryDb(updateQuery, values);
      return res.status(200).json({ message: 'Datos actualizados correctamente' });  
  } catch (error) {
      console.error('Error en la actualización:', error);
      return res.status(500).json({ error: 'Error al actualizar los datos' });  
  }
});


router.get('/datos/:id', async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const results = await queryDb('SELECT * FROM profesores WHERE id = ?', [id]);
    
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
        horario: Datos.horario
      });


} catch (err) {
    console.error('Error en el servidor:', err);
    return res.status(500).json({ message: 'Error interno del servidor' }); 
  }
});

router.post('/datos', async (req: Request, res: Response) => {
    const { nombre, apellidos, curso, foto, horario } = req.body;
  
    try {
      const result = await queryDb(
        'INSERT INTO profesores (nombre, apellidos, curso, foto, horario) VALUES (?, ?, ?, ?, ?)', 
        [nombre, apellidos, curso, foto, JSON.stringify(horario)]
      );
      
      return res.status(201).json({ message: 'Profesor insertado correctamente', id: result });
    } catch (err) {
      console.error('Error en el servidor:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
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
    })};
    
    export default router;