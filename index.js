const startScreen = document.getElementById('startScreen');
const mainFolder = document.getElementById('mainFolder');
const titleElement = document.querySelector('.title');
const folderTop = document.querySelector('.folder-top');
const folderContent = document.querySelector('.folder-content');
const draggableAnimal = document.getElementById('draggableAnimal');
const mainScreen = document.getElementById('mainScreen');

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
    
    mainScreen.style.display = 'flex';
    
    await delay(20);
    mainScreen.classList.add('fade-in');
    
    await delay(400);
    startScreen.style.display = 'none';
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

function autoMoveUntilDragged(element) {

  let dx = 2.5;
  let dy = 2.0;
  let intervalId = null;
  let hasBeenDragged = false;

  function move() {
    if (hasBeenDragged) return;

    const rect = element.getBoundingClientRect();
    let x = parseFloat(element.style.left || 100);
    let y = parseFloat(element.style.top || 100);

    x += dx;
    y += dy;

    if (x <= 0 || x + rect.width >= window.innerWidth) dx *= -1;
    if (y <= 0 || y + rect.height >= window.innerHeight) dy *= -1;

    if (dx > 0) {
      element.style.transform = "scaleX(-1)";
    } else {
      element.style.transform = "scaleX(1)";
    }

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  }

  intervalId = setInterval(move, 20);

  element.addEventListener("pointerdown", () => {
    hasBeenDragged = true;
    clearInterval(intervalId);
  });
}


document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:80vh;font-size:5rem;text-align:center;">
          <h1>모바일 접속은 지원하지 않습니다.</h1>
          <p>PC에서 접속해 주세요!</p>
        </div>
      `;
    }
    mainFolder.addEventListener('click', openWindow);

    if (draggableAnimal) {
        makeDraggable(draggableAnimal);
        autoMoveUntilDragged(draggableAnimal);
    }
    
    document.querySelectorAll('.content-header-nav a').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const headerHeight = document.querySelector('.content-header').offsetHeight;
    
        const container = document.querySelector('.content-container');
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - headerHeight;
    
        container.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      });
    });
});