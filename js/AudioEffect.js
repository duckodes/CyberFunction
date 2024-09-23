export class AudioEffect {
    constructor() {
        this.backgroundMusic = [];
        this.currentTrackIndex = 0;
        this.soundEffects = {};
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    loadBackgroundMusic(urls) {
        this.backgroundMusic = urls.map(url => {
            const audio = new Audio(url);
            audio.loop = false;
            audio.addEventListener('ended', () => this.playNextTrack());
            return audio;
        });
    }

    playBackgroundMusic() {
        this._playAudio(this.backgroundMusic[this.currentTrackIndex]);
    }

    pauseBackgroundMusic() {
        this._pauseAudio(this.backgroundMusic[this.currentTrackIndex]);
    }

    playNextTrack() {
        this._pauseAudio(this.backgroundMusic[this.currentTrackIndex]);
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.backgroundMusic.length;
        this.backgroundMusic[this.currentTrackIndex].currentTime = 0;
        this._playAudio(this.backgroundMusic[this.currentTrackIndex]);
    }

    loadSoundEffect(name, url) {
        this.soundEffects[name] = new Audio(url);
        this.soundEffects[name].load();
    }

    playSoundEffect(name) {
        if (this.soundEffects[name]) {
            this.soundEffects[name].currentTime = 0;
            this._playAudio(this.soundEffects[name]);
        }
    }

    _playAudio(audio) {
        if (audio) {
            audio.play().catch(error => {
                console.warn('Audio playback failed:', error);
            });
        }
    }

    _pauseAudio(audio) {
        if (audio) {
            audio.pause();
        }
    }
}
// export class AudioEffect {
//     constructor() {
//         this.backgroundMusic = [];
//         this.currentTrackIndex = 0;
//         this.soundEffects = {};
//     }

//     loadBackgroundMusic(urls) {
//         this.backgroundMusic = urls.map(url => {
//             const audio = new Audio(url);
//             audio.loop = false;
//             audio.addEventListener('ended', () => this.playNextTrack());
//             return audio;
//         });
//     }

//     playBackgroundMusic() {
//         if (this.backgroundMusic.length > 0) {
//             this.backgroundMusic[this.currentTrackIndex].play();
//         }
//     }

//     pauseBackgroundMusic() {
//         if (this.backgroundMusic.length > 0) {
//             this.backgroundMusic[this.currentTrackIndex].pause();
//         }
//     }

//     playNextTrack() {
//         this.backgroundMusic[this.currentTrackIndex].pause();
//         this.currentTrackIndex = (this.currentTrackIndex + 1) % this.backgroundMusic.length;
//         this.backgroundMusic[this.currentTrackIndex].currentTime = 0;
//         this.backgroundMusic[this.currentTrackIndex].play();
//     }

//     loadSoundEffect(name, url) {
//         this.soundEffects[name] = new Audio(url);
//         this.soundEffects[name].load();
//     }

//     playSoundEffect(name) {
//         if (this.soundEffects[name]) {
//             this.soundEffects[name].currentTime = 0;
//             this.soundEffects[name].play();
//         }
//     }
// }