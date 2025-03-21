const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); 

router.get('/', (req, res) => {
  connection.query('SELECT * FROM profesores', (err, results) => {
    if (err) {
      console.error('Error al obtener profesores:', err);
      res.status(500).json({ message: 'Error al obtener profesores' });
      return;
    }
    res.json(results);
  });
});

module.exports = router;
