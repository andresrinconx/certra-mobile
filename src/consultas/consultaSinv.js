const express = require('express');
const mysql = require('mysql');

const app = express();

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datasis'
});

app.get('/sinv', (req, res) => {
  // Consulta para obtener los registros de la tabla 'sinv'
  const query = 'SELECT descrip, precio1 FROM sinv WHERE precio1 > 0 LIMIT 1000 ';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta: ' + error.stack);
      return;
    }

    // Crear un objeto y asignar el arreglo a una propiedad
    const data = { results };

    // Enviar el objeto como JSON en la respuesta
    res.json(data);
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
