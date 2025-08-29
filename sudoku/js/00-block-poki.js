// This file must be loaded first to block Poki functionality
(function() {
    'use strict';
    
    console.log('Poki blocker initialized');
    
    // Block all Poki SDK functionality
    if (typeof window.PokiSDK === 'undefined') {
        window.PokiSDK = {};
    }
    
    // Override any existing PokiSDK
    window.PokiSDK = {
        init: function() { 
            console.log('PokiSDK.init() called - blocked');
            return Promise.resolve(); 
        },
        gameLoadingStart: function() { 
            console.log('PokiSDK.gameLoadingStart() called - blocked');
            return Promise.resolve(); 
        },
        gameLoadingFinished: function() { 
            console.log('PokiSDK.gameLoadingFinished() called - blocked');
            return Promise.resolve(); 
        },
        gameplayStart: function() { 
            console.log('PokiSDK.gameplayStart() called - blocked');
            return Promise.resolve(); 
        },
        gameplayStop: function() { 
            console.log('PokiSDK.gameplayStop() called - blocked');
            return Promise.resolve(); 
        },
        commercialBreak: function() { 
            console.log('PokiSDK.commercialBreak() called - blocked');
            return Promise.resolve(); 
        },
        rewardedBreak: function() { 
            console.log('PokiSDK.rewardedBreak() called - blocked');
            return Promise.resolve(); 
        },
        happyTime: function() { 
            console.log('PokiSDK.happyTime() called - blocked');
            return Promise.resolve(); 
        },
        destroy: function() { 
            console.log('PokiSDK.destroy() called - blocked');
            return Promise.resolve(); 
        }
    };

    // Block window.open
    const originalWindowOpen = window.open;
    window.open = function(url, target, features) {
        console.log('window.open() called - blocked:', url);
        if (url && (url.includes('poki.com') || url.includes('po.ki'))) {
            console.log('Blocked Poki redirect:', url);
            return {
                closed: true,
                focus: function() {},
                close: function() {}
            };
        }
        return originalWindowOpen.apply(window, arguments);
    };

    // Block location changes
    if (window.location.replace) {
        const originalReplace = window.location.replace;
        window.location.replace = function(url) {
            console.log('location.replace() called - blocked:', url);
            if (url && (url.includes('poki.com') || url.includes('po.ki'))) {
                console.log('Blocked Poki location.replace:', url);
                return false;
            }
            return originalReplace.apply(window.location, arguments);
        };
    }

    // Block location.href changes
    try {
        const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href');
        Object.defineProperty(window.location, 'href', {
            set: function(url) {
                console.log('location.href setter called - blocked:', url);
                if (url && (url.includes('poki.com') || url.includes('po.ki'))) {
                    console.log('Blocked Poki location.href change:', url);
                    return false;
                }
                return originalHref.set.call(window.location, url);
            },
            get: function() {
                return originalHref.get.call(window.location);
            }
        });
    } catch(e) {
        console.error('Could not override location.href', e);
    }
})();
