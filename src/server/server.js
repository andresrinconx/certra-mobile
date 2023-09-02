const express = require('express');
const app = express();
const port = 3000; // Puedes cambiar el puerto si es necesario

app.use(express.json());

const pedidos = []; // Almacenará el historial de pedidos

app.post('/enviar-pedido', (req, res) => {
  const nuevoPedido = req.body;
  pedidos.push(nuevoPedido);
  res.status(201).json({ message: 'Pedido recibido con éxito' });
});

app.get('/historial-pedidos', (req, res) => {
  res.json(pedidos);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://192.168.88.240:${port}`);
});