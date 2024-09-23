export class AudioEffect {
    constructor() {
        this.backgroundMusic = [];
        this.currentTrackIndex = 0;
        this.soundEffects = {};
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
        if (this.backgroundMusic.length > 0) {
            this.backgroundMusic[this.currentTrackIndex].play().catch(err => {
                console.warn('Error playing background music:', err);
            });
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic.length > 0) {
            this.backgroundMusic[this.currentTrackIndex].pause();
        }
    }

    playNextTrack() {
        this.backgroundMusic[this.currentTrackIndex].pause();
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.backgroundMusic.length;
        this.backgroundMusic[this.currentTrackIndex].currentTime = 0;
        this.playBackgroundMusic();
    }

    loadSoundEffect(name, url) {
        this.soundEffects[name] = new Audio(url);
        this.soundEffects[name].preload = 'auto'; // Preload sound effects
    }

    playSoundEffect(name) {
        if (this.soundEffects[name]) {
            const soundEffect = new Audio(this.soundEffects[name].src); // Create a new Audio instance
            soundEffect.play().catch(err => {
                console.warn('Error playing sound effect:', err);
            });
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
//     }

//     playSoundEffect(name) {
//         if (this.soundEffects[name]) {
//             this.soundEffects[name].currentTime = 0;
//             this.soundEffects[name].play();
//         }
//     }
// }