// Capacitor-specific configuration for Sudoku game
(function() {
    'use strict';
    
    // Debug flag - set to true to see console logs
    const DEBUG = true;
    
    function log() {
        if (DEBUG) {
            console.log('[Sudoku]', ...arguments);
        }
    }
    
    // Wait for device ready if in Capacitor/Cordova
    function onDeviceReady() {
        log('Device is ready for Sudoku game');
        
        // Prevent default behaviors that might cause redirects
        if (window.Capacitor || window.cordova || window.phonegap) {
            log('Running in hybrid app environment');
            
            // Disable text selection to prevent context menus
            document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
            }, false);
            
            // Disable drag and drop
            document.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            }, false);
            
            // Disable right-click context menu
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            }, false);
            
            // Prevent zoom
            document.addEventListener('touchmove', function(e) {
                if (e.scale && e.scale !== 1) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Override window.open to prevent external browser opening
            const originalWindowOpen = window.open;
            window.open = function(url, target, features) {
                log('window.open blocked:', url);
                if (url && url.includes('poki.com')) {
                    log('Blocked Poki.com redirect');
                    return {
                        closed: true,
                        focus: function() {},
                        close: function() {}
                    };
                }
                return originalWindowOpen.apply(window, arguments);
            };
            
            // Prevent location changes
            if (window.location.replace) {
                const originalReplace = window.location.replace;
                window.location.replace = function(url) {
                    log('location.replace blocked:', url);
                    if (url && url.includes('poki.com')) {
                        log('Blocked Poki.com location.replace');
                        return false;
                    }
                    return originalReplace.apply(window.location, arguments);
                };
            }
            
            // Block ad-related events that might cause redirects
            if (window.jQuery || window.$) {
                var $ = window.jQuery || window.$;
                var originalTrigger = $.fn.trigger;
                $.fn.trigger = function(event) {
                    if (typeof event === 'string' && event.indexOf('ad') !== -1) {
                        console.log('Ad event blocked:', event);
                        return this;
                    }
                    return originalTrigger.apply(this, arguments);
                };
            }
            
            // Block location href changes
            try {
                const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href');
                Object.defineProperty(window.location, 'href', {
                    set: function(url) {
                        if (url && url.includes('poki.com')) {
                            log('Blocked Poki.com location.href change:', url);
                            return false;
                        }
                        log('location.href changed to:', url);
                        return originalHref.set.call(window.location, url);
                    },
                    get: function() {
                        return originalHref.get.call(window.location);
                    }
                });
            } catch(e) {
                log('Could not override location.href', e);
            }
            
            // Additional protection against iframe redirects
            const originalCreateElement = document.createElement;
            document.createElement = function(tagName) {
                const element = originalCreateElement.call(document, tagName);
                if (tagName.toLowerCase() === 'iframe') {
                    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
                    Object.defineProperty(element, 'src', {
                        set: function(value) {
                            if (value && value.includes('poki.com')) {
                                log('Blocked Poki.com iframe src:', value);
                                return '';
                            }
                            return originalSrcDescriptor.set.call(this, value);
                        },
                        get: function() {
                            return originalSrcDescriptor.get.call(this);
                        }
                    });
                }
                return element;
            };
        }
    }
    
    // Check if device is ready
    if (window.Capacitor) {
        // Capacitor is ready immediately
        onDeviceReady();
    } else if (window.cordova || window.phonegap) {
        // Wait for Cordova deviceready
        document.addEventListener('deviceready', onDeviceReady, false);
    } else {
        // Not in a hybrid app, run immediately
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDeviceReady);
        } else {
            onDeviceReady();
        }
    }
})();
