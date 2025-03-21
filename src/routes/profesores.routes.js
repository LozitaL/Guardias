const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); // Conexión a la base de datos


router.get('/profesores', (req, res) => {
  connection.query('SELECT * FROM profesores', (err, results) => {
    if (err) {
      console.error('Error al obtener profesores:', err);
      res.status(500).json({ message: 'Error al obtener profesores' });
      return;
    }
    res.json(results);
  });
});


router.get('/horarios', (req, res) => {
  connection.query('SELECT * FROM horarios', (err, results) => {
    if (err) {
      console.error('Error al obtener horarios:', err);
      res.status(500).json({ message: 'Error al obtener horarios' });
      return;
    }
    res.json(results);
  });
});


router.get('/seguridad', (req, res) => {
  connection.query('SELECT * FROM seguridad', (err, results) => {
    if (err) {
      console.error('Error al obtener seguridad:', err);
      res.status(500).json({ message: 'Error al obtener seguridad' });
      return;
    }
    res.json(results);
  });
});

module.exports = router;
