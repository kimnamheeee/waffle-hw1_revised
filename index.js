const startScreen = document.getElementById('startScreen');
const mainFolder = document.getElementById('mainFolder');
const titleElement = document.querySelector('.title');
const folderTop = document.querySelector('.folder-top');
const folderContent = document.querySelector('.folder-content');
const draggableAnimal = document.getElementById('draggableAnimal');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ANIMATION_DELAY = {
    TITLE_SLIDE_OUT: 200,
    FOLDER_OPEN: 1500,
    CONTENT_EXPAND: 2800,
    FINISH: 4500
};
  

async function openWindow() {
    mainFolder.style.pointerEvents = 'none';
  
    titleElement.classList.add('slide-right');
    await delay(ANIMATION_DELAY.TITLE_SLIDE_OUT);
  
    titleElement.classList.remove('slide-right');
    titleElement.classList.add('slide-out');
    await delay(ANIMATION_DELAY.FOLDER_OPEN - ANIMATION_DELAY.TITLE_SLIDE_OUT);
  
    folderTop.classList.add('opening');
    folderContent.classList.add('opening');
    await delay(ANIMATION_DELAY.CONTENT_EXPAND - ANIMATION_DELAY.FOLDER_OPEN);
  
    folderContent.classList.add('expanding');

    await delay(ANIMATION_DELAY.FINISH - ANIMATION_DELAY.CONTENT_EXPAND);
    startScreen.style.display = 'none';
    mainScreen.style.display = 'flex';
}

function makeDraggable(element) {
    let isDragging = false;
    let pointerOffsetX = 0;
    let pointerOffsetY = 0;
  
    const rect = element.getBoundingClientRect();
    element.style.position = 'absolute';
    element.style.left = `${rect.left + window.scrollX}px`;
    element.style.top = `${rect.top + window.scrollY}px`;
    element.style.transform = 'none';
    element.style.touchAction = 'none';
  
    element.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  
    function onPointerDown(e) {
      if (e.button && e.button !== 0) return;
      e.preventDefault();
      isDragging = true;
      element.setPointerCapture?.(e.pointerId);
  
      const r = element.getBoundingClientRect();
      pointerOffsetX = e.clientX - r.left;
      pointerOffsetY = e.clientY - r.top;
    }
  
    function onPointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();
  
      const newLeft = e.clientX - pointerOffsetX + window.scrollX;
      const newTop = e.clientY - pointerOffsetY + window.scrollY;
  
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    }
  
    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      element.releasePointerCapture?.(e.pointerId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mainFolder.addEventListener('click', openWindow);

    if (draggableAnimal) {
        makeDraggable(draggableAnimal);
    }
});