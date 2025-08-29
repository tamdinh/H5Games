var loadModules = function (modules, urlPrefix, doneCallback) { // eslint-disable-line no-unused-vars
    if (typeof modules === "undefined" || modules.length === 0) {
        // caller may depend on callback behaviour being async
        setTimeout(doneCallback);
        return;
    }

    let remaining = modules.length;
    const moduleLoaded = (moduleName, error) => {
        if (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            // Continue with other modules even if one fails
        }
        if (--remaining === 0) {
            doneCallback();
        }
    };

    modules.forEach(function (m) {
        pc.WasmModule.setConfig(m.moduleName, {
            glueUrl: urlPrefix + m.glueUrl,
            wasmUrl: urlPrefix + m.wasmUrl,
            fallbackUrl: m.fallbackUrl ? (urlPrefix + m.fallbackUrl) : ''
        });

        if (!m.hasOwnProperty('preload') || m.preload) {
            try {
                if (m.moduleName === 'BASIS') {
                    // preload basis transcoder
                    pc.basisInitialize();
                    moduleLoaded(m.moduleName);
                } else if (m.moduleName === 'DracoDecoderModule') {
                    // preload draco decoder
                    if (pc.dracoInitialize) {
                        // 1.63 onwards
                        pc.dracoInitialize();
                        moduleLoaded(m.moduleName);
                    } else {
                        // 1.62 and earlier
                        pc.WasmModule.getInstance(m.moduleName, 
                            () => { moduleLoaded(m.moduleName); },
                            (err) => { moduleLoaded(m.moduleName, err); }
                        );
                    }
                } else {
                    // load remaining modules in global scope
                    pc.WasmModule.getInstance(m.moduleName, 
                        () => { moduleLoaded(m.moduleName); },
                        (err) => { 
                            if (m.onerror) m.onerror(err);
                            moduleLoaded(m.moduleName, err); 
                        }
                    );
                }
            } catch (err) {
                console.error(`Error loading module ${m.moduleName}:`, err);
                if (m.onerror) m.onerror(err);
                moduleLoaded(m.moduleName, err);
            }
        } else {
            moduleLoaded(m.moduleName);
        }
    });
};

window.loadModules = loadModules;
