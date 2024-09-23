import { AudioEffect } from "./AudioEffect.js";
import { languageData } from "../main.js";
const audioEffect = new AudioEffect();

// BG
audioEffect.loadBackgroundMusic([
    '../audio/background/Audio1.mp3',
    '../audio/background/Audio2.mp3'
]);
window.addEventListener('blur', () => {
    audioEffect.pauseBackgroundMusic();
});
document.querySelector('.canvas').addEventListener('click', () => {
    audioEffect.playBackgroundMusic();
});

// FX
audioEffect.loadSoundEffect('click1', '../audio/click/click1.mp3');
audioEffect.loadSoundEffect('click2', '../audio/click/click2.mp3');
audioEffect.loadSoundEffect('click3', '../audio/click/click3.mp3');
audioEffect.loadSoundEffect('click4', '../audio/click/click4.mp3');

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
document.querySelector('.lan-now').addEventListener('click', () => {
    audioEffect.playSoundEffect('click4');
});

languageData.on('change', data => {
    const audioMS = createAudioInput('audio-ms', '1', data.audio.master);
    const audioBG = createAudioInput('audio-bg', '0.25', data.audio.background);
    const audioFX = createAudioInput('audio-fx', '0.5', data.audio.effect);
    audioMS.input.addEventListener("input", e => {
        audioEffect.setMasterVolume(e.target.value);
        audioMS.div.textContent = parseInt(e.target.value * 100);
    });
    audioBG.input.addEventListener("input", e => {
        audioEffect.setMusicVolume(e.target.value);
        audioBG.div.textContent = parseInt(e.target.value * 100);
    });
    audioFX.input.addEventListener("input", e => {
        audioEffect.setEffectVolume(e.target.value);
        audioFX.div.textContent = parseInt(e.target.value * 100);
    });
    audioFX.input.addEventListener("change", () => {
        audioEffect.playSoundEffect('click1');
    })
});
function createAudioInput(id, value, text) {
    const input = document.createElement('input');
    input.className = 'audio-slider';
    input.id = id;
    input.type = 'range';
    input.max = '1';
    input.step = 'any';
    input.value = value;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = text;
    const div = document.createElement('div');
    div.textContent = value * 100;
    label.appendChild(div);
    label.appendChild(input);
    document.querySelector('.settings').appendChild(label);
    return {
        input: input,
        div: div
    };
}