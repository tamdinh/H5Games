/**
 * Audio Compatibility Layer
 * 
 * This file provides backward compatibility for the old audio system by intercepting
 * the old audio loading and playing mechanisms and routing them to the new audio handler.
 */

// Map of old MP3 file names to new OGG sound names
const soundMap = {
    'bomb.mp3': 'bomb',
    'button.mp3': 'button',
    'flag.mp3': 'flag',
    'kittyopening.mp3': 'kittyopening',
    'move.mp3': 'move',
    'move2.mp3': 'move2',
    'open.mp3': 'open',
    'open2.mp3': 'open2',
    'open3.mp3': 'open3',
    'opening.mp3': 'opening',
    'reset.mp3': 'reset',
    'static.mp3': 'static',
    'test.mp3': 'test',
    'unflag.mp3': 'unflag',
    'win.mp3': 'win'
};

// Override the Audio constructor to handle OGG files
const OriginalAudio = window.Audio;
window.Audio = function(src) {
    if (src) {
        // Extract the filename from the path
        const filename = src.split('/').pop();
        const soundName = soundMap[filename];
        
        if (soundName) {
            // Return a proxy object that will work with the old code
            return new Proxy({}, {
                get: function(target, prop) {
                    // Handle play method
                    if (prop === 'play') {
                        return function() {
                            if (window.audioHandler) {
                                window.audioHandler.playSound(soundName);
                            }
                            return Promise.resolve();
                        };
                    }
                    // Handle volume
                    if (prop === 'volume') {
                        return 1.0; // Default volume
                    }
                    // Handle other properties/methods
                    return target[prop];
                },
                set: function(target, prop, value) {
                    // Handle volume setting
                    if (prop === 'volume' && window.audioHandler) {
                        // We can store volume per sound if needed
                        return true;
                    }
                    target[prop] = value;
                    return true;
                }
            });
        }
    }
    
    // Fall back to the original Audio constructor for non-game sounds
    return new OriginalAudio(src);
};

// Handle any direct audio element creation
const originalCreateElement = document.createElement;
document.createElement = function(tagName, options) {
    if (tagName.toLowerCase() === 'audio') {
        // Return a proxy that will handle audio playback
        return new Proxy(originalCreateElement.call(document, tagName, options), {
            get: function(target, prop) {
                if (prop === 'play') {
                    return function() {
                        const src = target.getAttribute('src');
                        if (src) {
                            const filename = src.split('/').pop();
                            const soundName = soundMap[filename];
                            if (soundName && window.audioHandler) {
                                window.audioHandler.playSound(soundName);
                                return Promise.resolve();
                            }
                        }
                        return target[prop].call(target);
                    };
                }
                return target[prop];
            },
            set: function(target, prop, value) {
                if (prop === 'src') {
                    target.setAttribute('src', value);
                    return true;
                }
                target[prop] = value;
                return true;
            }
        });
    }
    return originalCreateElement.call(document, tagName, options);
};

console.log('Audio compatibility layer loaded');
