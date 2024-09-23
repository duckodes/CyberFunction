export class AudioEffect {
    constructor() {
        this.backgroundMusic = [];
        this.currentTrackIndex = 0;
        this.soundEffects = {};
    }

    async loadBackgroundMusic(urls) {
        this.backgroundMusic = await Promise.all(urls.map(async (url) => {
            const audio = new Audio(url);
            audio.loop = false;
            await audio.load();  // Preload the audio
            audio.addEventListener('ended', () => this.playNextTrack());
            return audio;
        }));
    }

    playBackgroundMusic() {
        if (this.backgroundMusic.length > 0) {
            this.backgroundMusic[this.currentTrackIndex].play().catch(error => {
                console.error("Playback failed:", error);
            });
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic.length > 0) {
            this.backgroundMusic[this.currentTrackIndex].pause();
        }
    }

    playNextTrack() {
        if (this.backgroundMusic.length > 0) {
            this.backgroundMusic[this.currentTrackIndex].pause();
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.backgroundMusic.length;
            this.backgroundMusic[this.currentTrackIndex].currentTime = 0;
            this.backgroundMusic[this.currentTrackIndex].play().catch(error => {
                console.error("Playback failed:", error);
            });
        }
    }

    loadSoundEffect(name, url) {
        const audio = new Audio(url);
        audio.preload = 'auto';  // Preload sound effects
        this.soundEffects[name] = audio;
    }

    playSoundEffect(name) {
        if (this.soundEffects[name]) {
            this.soundEffects[name].currentTime = 0;
            this.soundEffects[name].play().catch(error => {
                console.error("Sound effect playback failed:", error);
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