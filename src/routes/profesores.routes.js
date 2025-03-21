const express = require('express');
const router = express.Router();
const connection = require('../db/connection');


router.get('profesores', (req, res) => {
  connection.query('SELECT * FROM profesores', (err, results) => {
    if (err) {
      console.error('Error al obtener profesores:', err);
      res.status(500).json({ message: 'Error al obtener profesores' });
      return;
    }else(console.log('Conexión con profesores correcta'));
    res.json(results);
  });
});


router.get('horarios', (req, res) => {
  connection.query('SELECT * FROM horarios', (err, results) => {
    if (err) {
      console.error('Error al obtener horarios:', err);
      res.status(500).json({ message: 'Error al obtener horarios' });
      return;
    }else(console.log('Conexión con horarios correcta'));
    res.json(results);
  });
});


router.get('seguridad', (req, res) => {
  connection.query('SELECT * FROM seguridad', (err, results) => {
    if (err) {
      console.error('Error al obtener seguridad:', err);
      res.status(500).json({ message: 'Error al obtener seguridad' });
      return;
    }else(console.log('Conexión con seguridad correcta'));
    res.json(results);
  });
});

module.exports = router;
