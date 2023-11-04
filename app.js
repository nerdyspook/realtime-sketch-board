const express = require('express');
const socket = require('socket.io');

const app = express();

app.use(express.static('public'));

let port = 8000;

let server = app.listen(port, () => {
  console.log('Listening to port ' + port);
});

let io = socket(server);

io.on('connection', (socket) => {
  console.log('Socket connected');

  // Received data
  socket.on('beginPath', (data) => {
    // data -> data from frontend
    // Transfer data to all connected computers
    io.sockets.emit('beginPath', data);
  });

  socket.on('drawStroke', (data) => {
    // Transfer data to all connected computers
    io.sockets.emit('drawStroke', data);
  });

  socket.on('redoUndo', (data) => {
    // Transfer data to all connected computers
    io.sockets.emit('redoUndo', data);
  });
});
