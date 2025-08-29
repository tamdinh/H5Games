// Minimal Poki SDK stub for offline use in BallPool
// Provides the subset of PokiSDK methods used by the game as no-ops or resolved Promises.
(function(window){
    if(window.PokiSDK) return; // don't override if already present

    const PokiSDK = {
        init: function(){
            console.log('PokiSDK.stub: init()');
            return Promise.resolve();
        },
        setDebug: function(){
            // no-op
        },
        gameLoadingStart: function(){
            console.log('PokiSDK.stub: gameLoadingStart()');
        },
        gameLoadingFinished: function(){
            console.log('PokiSDK.stub: gameLoadingFinished()');
        },
        gameplayStart: function(){
            console.log('PokiSDK.stub: gameplayStart()');
        },
        gameplayStop: function(){
            console.log('PokiSDK.stub: gameplayStop()');
        },
        happyTime: function(){
            // some games call this for small UX tweaks; ignore
        },
        commercialBreak: function(){
            console.log('PokiSDK.stub: commercialBreak() -> resolved');
            // return a promise that resolves immediately to simulate ad closed
            return Promise.resolve();
        },
        rewardedBreak: function(){
            console.log('PokiSDK.stub: rewardedBreak() -> resolved true');
            // resolve with true to simulate successful reward
            return Promise.resolve(true);
        }
    };

    window.PokiSDK = PokiSDK;
    // also expose a global Poki object if code references it (defensive)
    if(!window.Poki) window.Poki = PokiSDK;
})(window);
