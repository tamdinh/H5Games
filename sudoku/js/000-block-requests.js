// This must be the very first script loaded to block all Poki-related requests
(function() {
    'use strict';
    
    console.log('Poki request blocker initialized');
    
    // Block fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(resource, init) {
        const url = typeof resource === 'string' ? resource : (resource?.url || '');
        if (url && (url.includes('poki.') || url.includes('po.ki'))) {
            console.log('Blocked fetch request to:', url);
            return Promise.reject(new Error('Blocked Poki request'));
        }
        return originalFetch.apply(this, arguments);
    };
    
    // Block XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && (url.includes('poki.') || url.includes('po.ki'))) {
            console.log('Blocked XHR request to:', url);
            this._pokiBlocked = true;
            return;
        }
        return originalXHROpen.apply(this, arguments);
    };
    
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this._pokiBlocked) {
            console.log('Blocked XHR send to Poki');
            return;
        }
        return originalXHRSend.apply(this, arguments);
    };
    
    // Block dynamic script loading
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.apply(document, arguments);
        if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && value && (value.includes('poki.') || value.includes('po.ki'))) {
                    console.log('Blocked script load from:', value);
                    return;
                }
                return originalSetAttribute.apply(this, arguments);
            };
            
            const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;
            Object.defineProperty(element, 'src', {
                set: function(value) {
                    if (value && (value.includes('poki.') || value.includes('po.ki'))) {
                        console.log('Blocked script src set to:', value);
                        return;
                    }
                    return originalSrcSetter.call(this, value);
                },
                get: function() {
                    return originalSrcGetter.call(this);
                }
            });
        }
        return element;
    };
    
    // Block WebSocket connections
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url) {
        if (url && (url.includes('poki.') || url.includes('po.ki'))) {
            console.log('Blocked WebSocket connection to:', url);
            throw new Error('Blocked Poki WebSocket');
        }
        return new originalWebSocket(url);
    };
    
    console.log('Poki request blocker fully initialized');
})();
