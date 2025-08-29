// Audio Handler for Minesweeper Game
class AudioHandler {
    constructor() {
        this.sounds = {};
        this.audioContext = null;
        this.initialized = false;
    }

    // Initialize audio context
    init() {
        if (this.initialized) return;
        
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
                this.initialized = true;
                console.log('Audio context initialized');
            }
        } catch (e) {
            console.warn('Web Audio API not supported in this browser', e);
        }
    }

    // Load a sound
    loadSound(name, path) {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                console.warn('Audio not initialized, skipping sound:', name);
                resolve(null);
                return;
            }

            fetch(path)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    this.sounds[name] = audioBuffer;
                    console.log('Loaded sound:', name);
                    resolve(audioBuffer);
                })
                .catch(error => {
                    console.error('Error loading sound:', name, error);
                    resolve(null);
                });
        });
    }

    // Play a loaded sound
    playSound(name, volume = 1.0) {
        if (!this.initialized || !this.sounds[name]) return;

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.sounds[name];
            gainNode.gain.value = volume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start(0);
            return source;
        } catch (e) {
            console.error('Error playing sound:', name, e);
            return null;
        }
    }
}

// Create global audio handler
window.audioHandler = new AudioHandler();

// Initialize audio on user interaction
document.addEventListener('click', function initAudio() {
    if (!window.audioHandler.initialized) {
        window.audioHandler.init();
        
        // Load all game sounds
        const sounds = {
            'bomb': 'media/audio/game/bomb.ogg',
            'button': 'media/audio/game/button.ogg',
            'flag': 'media/audio/game/flag.ogg',
            'move': 'media/audio/game/move.ogg',
            'move2': 'media/audio/game/move2.ogg',
            'open': 'media/audio/game/open.ogg',
            'open2': 'media/audio/game/open2.ogg',
            'open3': 'media/audio/game/open3.ogg',
            'reset': 'media/audio/game/reset.ogg',
            'test': 'media/audio/game/test.ogg',
            'unflag': 'media/audio/game/unflag.ogg',
            'win': 'media/audio/game/win.ogg',
            'kittyopening': 'media/audio/opening/kittyopening.ogg',
            'opening': 'media/audio/opening/opening.ogg',
            'static': 'media/audio/play/static.ogg'
        };

        // Load all sounds
        Object.entries(sounds).forEach(([name, path]) => {
            window.audioHandler.loadSound(name, path);
        });
        
        // Remove the event listener after first interaction
        document.removeEventListener('click', initAudio);
    }
}, { once: true });
