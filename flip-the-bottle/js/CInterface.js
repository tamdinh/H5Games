function CInterface(oParentContainer) {
    var _oContainer;
    var _oAudioToggle;
    var _iBottomLinePos;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oButExit;   
    var _oBestScoreText;
    var _oBestScoreTextBack;
    var _oScoreText;
    var _oScoreTextBack;
    var _oCreditsIcon;
    var _oCreditsTextBack;
    var _oCreditsText;
    var _oAreYouSurePanel;
    var _oParentContainer;

    this._init = function () {
        _oParentContainer = oParentContainer;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');        
        _pStartPosExit = {x: CANVAS_WIDTH - oSpriteExit.width/2 - 20, y: (oSpriteExit.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            
            _pStartPosAudio = {x: _pStartPosExit.x - oSpriteExit.width/2 - oSprite.width/4 - 10, y: _pStartPosExit.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,_oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSpriteExit.width/2 - oSprite.width/4 - 10,y:(oSprite.height / 2) + 10};
        }else{
            _pStartPosFullscreen = {x: _pStartPosExit.x - oSpriteExit.width - 10, y: _pStartPosExit.y};
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.getCreditsIconPos = function(){
        var oPos = {x: _oCreditsIcon.x, y: _oCreditsIcon.y};
        return oPos;
    };
    
    this.pulseCreditsIcon = function(){
        var iScaleVar = 1.2;
        createjs.Tween.get(_oCreditsIcon)
            .to({scaleX: iScaleVar, scaleY: iScaleVar}, 300, createjs.Ease.quadOut)
            .to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.quadIn)
            .call(function () {
                createjs.Tween.removeTweens(_oCreditsIcon);
            });
    };
    
    this.initInterfaceTexts = function(){
        var oSprite = s_oSpriteLibrary.getSprite('coin');
        _oCreditsIcon = createBitmap(oSprite);
        _oCreditsIcon.regX = oSprite.width * 0.5;
        _oCreditsIcon.regY = oSprite.height * 0.5;
        _oCreditsIcon.x = 75;
        _oCreditsIcon.y = _oButExit.getY() - 10;
        _oContainer.addChild(_oCreditsIcon);
        
        _oCreditsTextBack = new createjs.Text(/*TEXT_CREDITS + */s_iTotalCredits, FONT_SIZE_INTERFACE + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oCreditsTextBack.textAlign = "left";
        _oCreditsTextBack.textBaseline = "alphabetic";
        _oCreditsTextBack.x = _oCreditsIcon.x + 40;
        _oCreditsTextBack.y = _oButExit.getY() + 5;
        _oCreditsTextBack.outline = 5;
	_oContainer.addChild(_oCreditsTextBack);
        
        _oCreditsText = new createjs.Text(/*TEXT_CREDITS + */s_iTotalCredits, FONT_SIZE_INTERFACE + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oCreditsText.textAlign = "left";
        _oCreditsText.textBaseline = "alphabetic";
        _oCreditsText.x = _oCreditsIcon.x + 40;
        _oCreditsText.y = _oButExit.getY() + 5;
	_oContainer.addChild(_oCreditsText);
        
        _iBottomLinePos = CANVAS_HEIGHT - 250;
        
        _oScoreTextBack = new createjs.Text(TEXT_SCORE + " " + 0, FONT_SIZE_INTERFACE + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oScoreTextBack.textAlign = "left";
        _oScoreTextBack.textBaseline = "alphabetic";
        _oScoreTextBack.x = 60;
        _oScoreTextBack.y = _iBottomLinePos;
        _oScoreTextBack.outline = 5;
	_oContainer.addChild(_oScoreTextBack);
        
        _oScoreText = new createjs.Text(TEXT_SCORE + " " + 0, FONT_SIZE_INTERFACE + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oScoreText.textAlign = "left";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.x = 60;
        _oScoreText.y = _iBottomLinePos;
	_oContainer.addChild(_oScoreText);
        
        _oBestScoreTextBack = new createjs.Text(TEXT_BEST + " " + s_iBestScore, FONT_SIZE_INTERFACE + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oBestScoreTextBack.textAlign = "right";
        _oBestScoreTextBack.textBaseline = "alphabetic";
        _oBestScoreTextBack.x = CANVAS_WIDTH - 60;
        _oBestScoreTextBack.y = _iBottomLinePos;
        _oBestScoreTextBack.outline = 5;
	_oContainer.addChild(_oBestScoreTextBack);
        
        _oBestScoreText = new createjs.Text(TEXT_BEST + " " + s_iBestScore, FONT_SIZE_INTERFACE + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oBestScoreText.textAlign = "right";
        _oBestScoreText.textBaseline = "alphabetic";
        _oBestScoreText.x = CANVAS_WIDTH - 60;
        _oBestScoreText.y = _iBottomLinePos;
	_oContainer.addChild(_oBestScoreText);
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        };
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        };
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
        
        // REFRESH BOTTOM TEXTS POSITION
        _iBottomLinePos = CANVAS_HEIGHT - iNewY - 50;
        
        if (_oCreditsText !== undefined) {
            _oCreditsIcon.x = 75 + iNewX;
            _oCreditsIcon.y = _oButExit.getY() - 10;
            _oCreditsTextBack.x = _oCreditsText.x = _oCreditsIcon.x + 40;
            _oCreditsTextBack.y = _oCreditsText.y = _oButExit.getY() + 5;            
        }
        if (_oScoreText !== undefined) {
            _oScoreTextBack.x = _oScoreText.x = 60 + iNewX;
            _oScoreTextBack.y = _oScoreText.y = _iBottomLinePos; 
        }
        if (_oBestScoreText !== undefined) {
            _oBestScoreTextBack.x = _oBestScoreText.x = CANVAS_WIDTH - 60 - iNewX;
            _oBestScoreTextBack.y = _oBestScoreText.y = _iBottomLinePos; 
        }
    };
    
    this.refreshScoreText = function (iValue) {        
        _oScoreTextBack.text = _oScoreText.text = TEXT_SCORE + " " + iValue;
    };
    
    this.refreshCreditsText = function (iValue) {        
        _oCreditsTextBack.text = _oCreditsText.text = /*TEXT_CREDITS + */iValue;
    };
    
    this.refreshBestScoreText = function () {
        _oBestScoreTextBack.text = _oBestScoreText.text = TEXT_BEST + " " + s_iBestScore;
    };

    this.unload = function () {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        s_oInterface = null;
        s_oGame._bDisableEvents = false;
        s_oGame.setStartGame(true);
    };
    
    this._onExit = function () {
        _oAreYouSurePanel = new CAreYouSurePanel(_oContainer);
        s_oGame._bDisableEvents = true;
        s_oGame.setStartGame(false);
    };
    
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
	}else{
            _fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    s_oInterface = this;

    this._init();

    return this;
}

var s_oInterface = null;