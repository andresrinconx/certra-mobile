const express = require('express');
const mysql = require('mysql');

const app = express();

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: '192.168.230.98',
  user: 'datasis',
  password: '',
  database: 'datasis'
});

// Ruta principal
app.get('/', (req, res) => {
  // Consulta la tabla de usuarios
  connection.query('SELECT us_codigo, us_clave FROM usuario', (error, results, fields) => {
    if (error) {
      console.error('Error al consultar la tabla de usuario', error);
      res.status(500).send('Error al consultar la tabla de usuario');
    } else {
      const usuarios = results;

      // Envía los datos de los usuarios como respuesta
      res.json(usuarios);
    }
  });
});

// Inicia el servidor en el puerto 3000 (puedes cambiarlo si es necesario)
app.listen(4000, () => {
  console.log('Servidor web iniciado en el puerto 3000');
});
