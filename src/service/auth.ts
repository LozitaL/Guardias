import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db';  

const router = express.Router();
//Fn Inicio Sesion
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const results = await queryDb('SELECT * FROM credenciales WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id_profesor: user.id_profesor }, 'tu_secreto', { expiresIn: '1h' });
    return res.json({
      id_profesor: user.id_profesor,
      token,
    });
  } catch (err) {
    console.error('Error en el servidor:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

//Fn Registro
//Fn Recuperar Sesion
//Fn

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
