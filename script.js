'use strict';

const toolsContainer = document.querySelector('.tools-container');
const optionsContainer = document.querySelector('.options-container');
const pencilToolsContainer = document.querySelector('.pencil-tool-container');
const eraserToolsContainer = document.querySelector('.eraser-tool-container');
const pencil = document.querySelector('.pencil');
const eraser = document.querySelector('.eraser');
const sticky = document.querySelector('.sticky');
const upload = document.querySelector('.upload');

let optionsFlag = true;
let pencilFlag = false;
let eraserFlag = false;

const openTools = () => {
  let iconElement = optionsContainer.children[0];
  iconElement.classList.remove('fa-times');
  iconElement.classList.add('fa-bars');
  toolsContainer.style.display = 'flex';
};

const closeTools = () => {
  let iconElement = optionsContainer.children[0];
  iconElement.classList.remove('fa-bars');
  iconElement.classList.add('fa-times');
  toolsContainer.style.display = 'none';
  pencilToolsContainer.style.display = 'none';
  eraserToolsContainer.style.display = 'none';
};

const dragAndDrop = (element, event) => {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = 'absolute';
  element.style.zIndex = 1000;
  // document.body.append(ball);

  moveAt(event.pageX, event.pageY);

  // moves the element at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + 'px';
    element.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the element on mousemove
  document.addEventListener('mousemove', onMouseMove);

  // drop the element, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener('mousemove', onMouseMove);
    element.onmouseup = null;
  };
};

const noteActions = (minimize, remove, stickyContainer) => {
  remove.addEventListener('click', () => {
    stickyContainer.remove();
  });

  minimize.addEventListener('click', () => {
    const noteContainer = stickyContainer.querySelector('.note-container');
    const display = getComputedStyle(noteContainer).getPropertyValue('display');

    if (display === 'none') noteContainer.style.display = 'block';
    else noteContainer.style.display = 'none';
  });
};

const createSticky = (stickyTemplateHTML) => {
  const stickyContainer = document.createElement('div');
  stickyContainer.setAttribute('class', 'sticky-container');
  stickyContainer.innerHTML = stickyTemplateHTML;

  document.body.append(stickyContainer);

  const minimize = stickyContainer.querySelector('.minimize');
  const remove = stickyContainer.querySelector('.remove');

  noteActions(minimize, remove, stickyContainer);

  stickyContainer.onmousedown = function (event) {
    dragAndDrop(stickyContainer, event);
  };

  stickyContainer.ondragstart = function () {
    return false;
  };
};

optionsContainer.addEventListener('click', (e) => {
  optionsFlag = !optionsFlag;

  if (optionsFlag) openTools();
  else closeTools();
});

pencil.addEventListener('click', () => {
  pencilFlag = !pencilFlag;

  if (pencilFlag) {
    eraserFlag = false;
    eraserToolsContainer.style.display = 'none';
    pencilToolsContainer.style.display = 'block';
  } else pencilToolsContainer.style.display = 'none';
});

eraser.addEventListener('click', () => {
  eraserFlag = !eraserFlag;

  if (eraserFlag) {
    pencilFlag = false;
    pencilToolsContainer.style.display = 'none';
    eraserToolsContainer.style.display = 'flex';
  } else eraserToolsContainer.style.display = 'none';
});

sticky.addEventListener('click', () => {
  const stickyTemplateHTML = `
      <div class="header-container">
        <div class="minimize"></div>
        <div class="remove"></div>
      </div>
      <div class="note-container">
        <textarea spellcheck='false'></textarea>
      </div>
  `;

  createSticky(stickyTemplateHTML);
});

upload.addEventListener('click', () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.click();

  input.addEventListener('change', () => {
    const file = input.files[0];
    const url = URL.createObjectURL(file);

    const stickyTemplateHTML = `
      <div class="header-container">
          <div class="minimize"></div>
          <div class="remove"></div>
      </div>
      <div class="note-container">
        <img src='${url}' />
      </div>
   `;

    createSticky(stickyTemplateHTML);
  });
});
