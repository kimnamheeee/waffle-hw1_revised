const startScreen = document.getElementById('startScreen');
const mainFolder = document.getElementById('mainFolder');
const titleElement = document.querySelector('.title');
const folderTop = document.querySelector('.folder-top');
const folderContent = document.querySelector('.folder-content');

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

document.addEventListener('DOMContentLoaded', () => {
    mainFolder.addEventListener('click', openWindow);
});
