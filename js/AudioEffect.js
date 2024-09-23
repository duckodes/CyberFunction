export class AudioEffect {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.backgroundMusic = [];
        this.currentTrackIndex = 0;
        this.soundEffects = {};
        this.masterVolume = 1.0;
        this.musicVolume = 0.25;
        this.effectVolume = 0.5;
        this.backgroundSource = null;
        this.isPlaying = false;
        this.musicGainNode = this.context.createGain();
        this.musicGainNode.gain.value = this.musicVolume * this.masterVolume;
        this.musicGainNode.connect(this.context.destination);
    }

    async loadBackgroundMusic(urls) {
        this.backgroundMusic = await Promise.all(urls.map(url => this.loadAudio(url)));
    }

    async loadAudio(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    playBackgroundMusic() {
        if (this.backgroundMusic.length > 0 && !this.isPlaying) {
            this.playTrack(this.currentTrackIndex);
            this.isPlaying = true;
        }
    }

    playTrack(index) {
        this.stopCurrentTrack();
        this.currentTrackIndex = index;
        this.backgroundSource = this.context.createBufferSource();
        this.backgroundSource.buffer = this.backgroundMusic[this.currentTrackIndex];

        this.backgroundSource.connect(this.musicGainNode);

        this.backgroundSource.onended = () => this.playNextTrack();
        this.backgroundSource.start(0);
    }

    stopCurrentTrack() {
        if (this.backgroundSource) {
            this.backgroundSource.stop();
            this.backgroundSource.disconnect();
        }
    }

    playNextTrack() {
        this.stopCurrentTrack();
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.backgroundMusic.length;
        this.playTrack(this.currentTrackIndex);
    }

    async loadSoundEffect(name, url) {
        this.soundEffects[name] = await this.loadAudio(url);
    }

    playSoundEffect(name) {
        if (this.soundEffects[name]) {
            const soundSource = this.context.createBufferSource();
            soundSource.buffer = this.soundEffects[name];
            const gainNode = this.context.createGain();
            gainNode.gain.value = this.effectVolume * this.masterVolume;

            soundSource.connect(gainNode);
            gainNode.connect(this.context.destination);
            soundSource.start(0);
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = volume;
        this.musicGainNode.gain.value = this.musicVolume * this.masterVolume;
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.musicVolume * this.masterVolume;
        }
    }

    setEffectVolume(volume) {
        this.effectVolume = volume;
    }
}

// export class AudioEffect {
//     constructor() {
//         this.backgroundMusic = [];
//         this.currentTrackIndex = 0;
//         this.soundEffects = {};
//         this.masterVolume = 1.0;
//         this.musicVolume = 0.25;
//         this.effectVolume = 0.5;
//     }

//     loadBackgroundMusic(urls) {
//         this.backgroundMusic = urls.map(url => {
//             const audio = new Audio(url);
//             audio.loop = false;
//             audio.addEventListener('ended', () => this.playNextTrack());
//             audio.volume = this.musicVolume;
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
//         this.soundEffects[name].volume = this.effectVolume;
//     }

//     playSoundEffect(name) {
//         if (this.soundEffects[name]) {
//             this.soundEffects[name].currentTime = 0;
//             this.soundEffects[name].play();
//         }
//     }

//     setMasterVolume(volume) {
//         this.masterVolume = volume;
//         this.backgroundMusic.forEach(audio => {
//             audio.volume = this.musicVolume * this.masterVolume;
//         });
//         Object.values(this.soundEffects).forEach(audio => {
//             audio.volume = this.effectVolume * this.masterVolume;
//         });
//     }

//     setMusicVolume(volume) {
//         this.musicVolume = volume;
//         this.backgroundMusic.forEach(audio => {
//             audio.volume = this.musicVolume * this.masterVolume;
//         });
//     }

//     setEffectVolume(volume) {
//         this.effectVolume = volume;
//         Object.values(this.soundEffects).forEach(audio => {
//             audio.volume = this.effectVolume * this.masterVolume;
//         });
//     }
// }