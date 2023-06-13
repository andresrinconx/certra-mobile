const express = require('express');
const fs = require('fs');

const app = express();

app.get('/sinv', (req, res) => {
  // Leer el archivo JSON
  fs.readFile('sinv.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo JSON: ' + err);
      return;
    }

    // Parsear el archivo JSON
    const jsonData = JSON.parse(data);

    // Crear un objeto con la propiedad "result"
    const resultObj = {
      result: jsonData
    };

    // Enviar el objeto como respuesta en formato JSON
    res.json(resultObj);
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
