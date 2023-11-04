const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pencilColor = document.querySelectorAll('.pencil-color');
const pencilWidthElement = document.querySelector('.pencil-width');
const eraserWidthElement = document.querySelector('.eraser-width');
const download = document.querySelector('.download');
const redo = document.querySelector('.redo');
const undo = document.querySelector('.undo');

const blackColor = '#020617';
const blueColor = '#0369a1';
const redColor = '#b91c1c';

let penColor = blackColor;
let eraserColor = 'white';
let penWidth = pencilWidthElement.value;
let eraserWidth = eraserWidthElement.value;

let undoRedoTracker = []; // data
let track = 0; // represent which action from tracker array

let mouseDown = false;

// API
let tool = canvas.getContext('2d');

tool.strokeStyle = blackColor;
tool.lineWidth = '5';
tool.lineCap = 'round';

const beginPath = ({ x, y }) => {
  tool.beginPath();
  tool.moveTo(x, y);
};

const drawStroke = ({ x, y, color, width }) => {
  tool.strokeStyle = color;
  tool.lineWidth = width;
  tool.lineTo(x, y);
  tool.stroke();
};

const undoRedoCanvas = (trackObj) => {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;

  const url = undoRedoTracker[track];
  const img = new Image(); // new image reference element
  img.src = url;
  img.onload = () => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
};

// mousedown -> start new path
// mousemove -> path fill

canvas.addEventListener('mousedown', (e) => {
  mouseDown = true;

  let data = {
    x: Math.round(e.clientX),
    y: e.clientY,
  };

  // send data to server
  socket.emit('beginPath', data);
});
canvas.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : penColor,
      width: eraserFlag ? eraserWidth : penWidth,
    };

    socket.emit('drawStroke', data);
  }
});
canvas.addEventListener('mouseup', () => {
  mouseDown = false;

  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

pencilColor.forEach((colorElement) => {
  colorElement.addEventListener('click', () => {
    let color = colorElement.classList[0];

    if (color === 'blue') {
      penColor = blueColor;
    } else if (color === 'red') {
      penColor = redColor;
    } else {
      penColor = color;
    }
    tool.strokeStyle = penColor;
  });
});

pencilWidthElement.addEventListener('change', () => {
  penWidth = pencilWidthElement.value;
  tool.lineWidth = penWidth;
});
eraserWidthElement.addEventListener('change', () => {
  eraserWidth = eraserWidthElement.value;
  tool.lineWidth = eraserWidth;
});

eraser.addEventListener('click', () => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});
pencil.addEventListener('click', () => {
  tool.strokeStyle = penColor;
  tool.lineWidth = penWidth;
});

download.addEventListener('click', () => {
  let url = canvas.toDataURL();

  const a = document.createElement('a');
  a.href = url;
  a.download = 'board.jpg';
  a.click();
});

undo.addEventListener('click', () => {
  if (track > 0) track--;
  // track action
  let data = {
    trackValue: track,
    undoRedoTracker,
  };

  socket.emit('redoUndo', data);
});
redo.addEventListener('click', () => {
  if (track < undoRedoTracker.length - 1) track++;
  // track action
  let data = {
    trackValue: track,
    undoRedoTracker,
  };
  socket.emit('redoUndo', data);
});

socket.on('beginPath', (data) => {
  // data -> data from server
  beginPath(data);
});
socket.on('drawStroke', (data) => {
  // data -> data from server
  drawStroke(data);
});
socket.on('redoUndo', (data) => {
  // data -> data from server
  undoRedoCanvas(data);
});
