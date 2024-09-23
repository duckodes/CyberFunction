export class AudioEffect {
    constructor() {
        this.backgroundMusic = [];
        this.currentTrackIndex = 0;
        this.soundEffects = {};
        this.masterVolume = 1.0;
        this.musicVolume = 0.25;
        this.effectVolume = 0.5;
    }

    loadBackgroundMusic(urls) {
        this.backgroundMusic = urls.map(url => {
            const audio = new Audio(url);
            audio.loop = false;
            audio.addEventListener('ended', () => this.playNextTrack());
            audio.volume = this.musicVolume;
            return audio;
        });
    }

    playBackgroundMusic() {
        if (this.backgroundMusic.length > 0) {
            this.backgroundMusic[this.currentTrackIndex].play();
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
        this.backgroundMusic[this.currentTrackIndex].play();
    }

    loadSoundEffect(name, url) {
        this.soundEffects[name] = new Audio(url);
        this.soundEffects[name].load();
        this.soundEffects[name].volume = this.effectVolume;
    }

    playSoundEffect(name) {
        if (this.soundEffects[name]) {
            this.soundEffects[name].currentTime = 0;
            this.soundEffects[name].play();
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = volume;
        this.backgroundMusic.forEach(audio => {
            audio.volume = this.musicVolume * this.masterVolume;
        });
        Object.values(this.soundEffects).forEach(audio => {
            audio.volume = this.effectVolume * this.masterVolume;
        });
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        this.backgroundMusic.forEach(audio => {
            audio.volume = this.musicVolume * this.masterVolume;
        });
    }

    setEffectVolume(volume) {
        this.effectVolume = volume;
        Object.values(this.soundEffects).forEach(audio => {
            audio.volume = this.effectVolume * this.masterVolume;
        });
    }
}