import { AudioEffect } from "./AudioEffect.js";
const audioEffect = new AudioEffect();

// BG
audioEffect.loadBackgroundMusic([
    '../audio/background/Audio1.mp3',
    '../audio/background/Audio2.mp3'
]);
window.addEventListener('focus', () => {
    audioEffect.playBackgroundMusic();
});
window.addEventListener('blur', () => {
    audioEffect.pauseBackgroundMusic();
});
window.addEventListener('click', () => {
    audioEffect.playBackgroundMusic();
});

// FX
audioEffect.loadSoundEffect('click1', '../audio/click/click1.mp3');
audioEffect.loadSoundEffect('click2', '../audio/click/click2.mp3');
audioEffect.loadSoundEffect('click3', '../audio/click/click3.mp3');

document.querySelector('.sign-action').addEventListener('click', () => {
    audioEffect.playSoundEffect('click2');
});
document.querySelector('.username-update').addEventListener('click', () => {
    audioEffect.playSoundEffect('click1');
});
document.querySelectorAll('.menu-btn').forEach(e => {
    e.addEventListener('click', () => {
        audioEffect.playSoundEffect('click3');
    });
});
document.querySelectorAll('.item-all-btn').forEach(e => {
    e.addEventListener('click', () => {
        audioEffect.playSoundEffect('click2');
    });
});