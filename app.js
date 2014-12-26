var Utils;
(function (Utils) {
    var AssetLoader = (function () {
        function AssetLoader(_lang, _aFileData, _ctx, _canvasWidth, _canvasHeight, _showBar) {
            if (typeof _showBar === "undefined") { _showBar = true; }
            this.oAssetData = {
            };
            this.assetsLoaded = 0;
            this.totalAssets = _aFileData.length;
            this.ctx = _ctx;
            this.canvasWidth = _canvasWidth;
            this.canvasHeight = _canvasHeight;
            this.showBar = _showBar;
            this.topLeftX = this.canvasWidth / 2 - _canvasWidth / 4;
            this.topLeftY = this.canvasHeight / 2;
            if(this.showBar) {
                ctx.strokeStyle = "#aaaaaa";
                ctx.lineWidth = 2;
                ctx.fillStyle = "#ffffff";
                ctx.moveTo(this.topLeftX, this.topLeftY);
                ctx.lineTo(this.topLeftX + _canvasWidth / 2, this.topLeftY + 0);
                ctx.lineTo(this.topLeftX + _canvasWidth / 2, this.topLeftY + 20);
                ctx.lineTo(this.topLeftX + 0, this.topLeftY + 20);
                ctx.lineTo(this.topLeftX + 0, this.topLeftY + 0);
                ctx.stroke();
            }
            for(var i = 0; i < _aFileData.length; i++) {
                this.loadImage(_aFileData[i]);
            }
        }
        AssetLoader.prototype.loadImage = function (_oData) {
            var _this = this;
            var img = new Image();
            img.onload = function () {
                _this.oAssetData[_oData.id] = {
                };
                _this.oAssetData[_oData.id].img = img;
                if(_oData.oData != undefined) {
                    _this.oAssetData[_oData.id].oData = _oData.oData;
                }
                ++_this.assetsLoaded;
                if(_this.showBar) {
                    ctx.fillRect(_this.topLeftX + 2, _this.topLeftY + 2, ((_this.canvasWidth / 2 - 4) / _this.totalAssets) * _this.assetsLoaded, 16);
                }
                _this.checkLoadComplete();
            };
            img.src = _oData.file;
        };
        AssetLoader.prototype.checkLoadComplete = function () {
            if(this.assetsLoaded == this.totalAssets) {
                this.loadedCallback();
            }
        };
        AssetLoader.prototype.onReady = function (_func) {
            this.loadedCallback = _func;
        };
        AssetLoader.prototype.getImg = function (_id) {
            return this.oAssetData[_id].img;
        };
        AssetLoader.prototype.getData = function (_id) {
            return this.oAssetData[_id];
        };
        return AssetLoader;
    })();
    Utils.AssetLoader = AssetLoader;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var AnimSprite = (function () {
        function AnimSprite(_oImgData, _fps, _radius, _animId) {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.frameInc = 0;
            this.animType = "loop";
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.oImgData = _oImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.fps = _fps;
            this.radius = _radius;
            this.animId = _animId;
        }
        AnimSprite.prototype.changeSpriteSheet = function (_oImgData) {
            this.oImgData = _oImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.resetAnim();
        };
        AnimSprite.prototype.updateAnimation = function (_delta) {
            this.frameInc += this.fps * _delta;
        };
        AnimSprite.prototype.resetAnim = function () {
            this.frameInc = 0;
        };
        AnimSprite.prototype.setFrame = function (_frameNum) {
            this.fixedFrame = _frameNum;
        };
        AnimSprite.prototype.setAnimType = function (_type, _animId, _reset) {
            if (typeof _reset === "undefined") { _reset = true; }
            this.animId = _animId;
            this.animType = _type;
            if(_reset) {
                this.resetAnim();
            }
            switch(_type) {
                case "loop":
                    break;
                case "once":
                    this.maxIdx = this.oAnims[this.animId].length - 1;
                    break;
            }
        };
        AnimSprite.prototype.render = function (_ctx) {
            if(this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                var frame = this.oAnims[this.animId][idx % max];
                var imgX = (frame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(frame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if(this.animType == "once") {
                    if(idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        this.animEndedFunc();
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            } else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
        };
        return AnimSprite;
    })();
    Utils.AnimSprite = AnimSprite;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var BasicSprite = (function () {
        function BasicSprite(_oImgData, _radius) {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.oImgData = _oImgData;
            this.radius = _radius;
        }
        BasicSprite.prototype.setFrame = function (_frameNum) {
            this.frameNum = _frameNum;
        };
        BasicSprite.prototype.render = function (_ctx) {
            var imgX = (this.frameNum * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
        };
        return BasicSprite;
    })();
    Utils.BasicSprite = BasicSprite;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var UserInput = (function () {
        function UserInput(_canvas, _isBugBrowser) {
            var _this = this;
            this.canvasX = 0;
            this.canvasY = 0;
            this.canvasScaleX = 1;
            this.canvasScaleY = 1;
            this.prevHitTime = 0;
            this.pauseIsOn = false;
            this.isDown = false;
            this.isDetectingKeys = false;
            this.isBugBrowser = _isBugBrowser;
            _canvas.addEventListener("touchstart", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitDown(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchend", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitUp(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchleave", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.leave(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchmove", function (e) {
                for(var i = 0; i < _this.aHitAreas.length; i++) {
                    _this.move(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier, true);
                }
            }, false);
            _canvas.addEventListener("mousedown", function (e) {
                _this.isDown = true;
                _this.hitDown(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mouseup", function (e) {
                _this.isDown = false;
                _this.hitUp(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mouseleave", function (e) {
                _this.leave(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mousemove", function (e) {
                _this.move(e, e.pageX, e.pageY, 1, _this.isDown);
            }, false);
            this.aHitAreas = new Array();
            this.aKeys = new Array();
        }
        UserInput.prototype.setCanvas = function (_canvasX, _canvasY, _canvasScaleX, _canvasScaleY) {
            this.canvasX = _canvasX;
            this.canvasY = _canvasY;
            this.canvasScaleX = _canvasScaleX;
            this.canvasScaleY = _canvasScaleY;
        };
        UserInput.prototype.hitDown = function (e, _posX, _posY, _identifer) {
            if(this.pauseIsOn) {
                return;
            }
            var curHitTime = new Date().getTime();
            if(curHitTime - this.prevHitTime < 500 && isBugBrowser) {
                return;
            }
            this.prevHitTime = curHitTime;
            e.preventDefault();
            e.stopPropagation();
            _posX = (_posX - this.canvasX) * this.canvasScaleX;
            _posY = (_posY - this.canvasY) * this.canvasScaleY;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].rect) {
                    if(_posX > this.aHitAreas[i].area[0] && _posY > this.aHitAreas[i].area[1] && _posX < this.aHitAreas[i].area[2] && _posY < this.aHitAreas[i].area[3]) {
                        this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                        if(!this.aHitAreas[i].oData.isDown) {
                            this.aHitAreas[i].oData.isDown = true;
                            this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                        }
                        break;
                    }
                } else {
                }
            }
        };
        UserInput.prototype.hitUp = function (e, _posX, _posY, _identifer) {
            if(this.pauseIsOn) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            _posX = (_posX - this.canvasX) * this.canvasScaleX;
            _posY = (_posY - this.canvasY) * this.canvasScaleY;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].rect) {
                    if(_posX > this.aHitAreas[i].area[0] && _posY > this.aHitAreas[i].area[1] && _posX < this.aHitAreas[i].area[2] && _posY < this.aHitAreas[i].area[3]) {
                        for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                            if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                j -= 1;
                            }
                        }
                        if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                            this.aHitAreas[i].oData.isDown = false;
                            if(this.aHitAreas[i].oData.multiTouch) {
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                            }
                        }
                    }
                } else {
                }
            }
        };
        UserInput.prototype.move = function (e, _posX, _posY, _identifer, _isDown) {
            if(this.pauseIsOn) {
                return;
            }
            if(_isDown) {
                _posX = (_posX - this.canvasX) * this.canvasScaleX;
                _posY = (_posY - this.canvasY) * this.canvasScaleY;
                for(var i = 0; i < this.aHitAreas.length; i++) {
                    if(this.aHitAreas[i].rect) {
                        if(_posX > this.aHitAreas[i].area[0] && _posY > this.aHitAreas[i].area[1] && _posX < this.aHitAreas[i].area[2] && _posY < this.aHitAreas[i].area[3]) {
                            if(!this.aHitAreas[i].oData.isDown) {
                                this.aHitAreas[i].oData.isDown = true;
                                this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                                if(this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                            if(this.aHitAreas[i].oData.isDraggable) {
                                this.aHitAreas[i].oData.isBeingDragged = true;
                                this.aHitAreas[i].oData.posX = _posX;
                                this.aHitAreas[i].oData.posY = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                this.aHitAreas[i].oData.isBeingDragged = false;
                            }
                        } else if(this.aHitAreas[i].oData.isDown) {
                            for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                                if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                    this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                    j -= 1;
                                }
                            }
                            if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                                this.aHitAreas[i].oData.isDown = false;
                                if(this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                        }
                    }
                }
            }
        };
        UserInput.prototype.leave = function (e, _posX, _posY, _identifer) {
            if(this.pauseIsOn) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            this.isDown = false;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].aTouchIdentifiers.length > 0) {
                    for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                        if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                            this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                            j -= 1;
                        }
                    }
                    if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                        this.aHitAreas[i].oData.isDown = false;
                        this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                    }
                    break;
                }
            }
        };
        UserInput.prototype.keyDown = function (e) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(e.keyCode == this.aKeys[i].keyCode) {
                    this.aKeys[i].oData.isDown = true;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.keyUp = function (e) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(e.keyCode == this.aKeys[i].keyCode) {
                    this.aKeys[i].oData.isDown = false;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.addKey = function (_id, _callback, _oCallbackData, _keyCode) {
            var _this = this;
            if(!this.isDetectingKeys) {
                window.addEventListener('keydown', function (e) {
                    _this.keyDown(e);
                }, false);
                window.addEventListener('keyup', function (e) {
                    _this.keyUp(e);
                }, false);
                this.isDetectingKeys = true;
            }
            if(_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            this.aKeys.push({
                id: _id,
                callback: _callback,
                oData: _oCallbackData,
                keyCode: _keyCode
            });
        };
        UserInput.prototype.removeKey = function (_id) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(this.aKeys[i].id == _id) {
                    this.aKeys.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.addHitArea = function (_id, _callback, _oCallbackData, _oAreaData, _isUnique) {
            if (typeof _isUnique === "undefined") { _isUnique = false; }
            if(_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            if(_isUnique) {
                this.removeHitArea(_id);
            }
            var aTouchIdentifiers = new Array();
            switch(_oAreaData.type) {
                case "image":
                    if(_oAreaData.oImageData.isSpriteSheet) {
                        this.aHitAreas.push({
                            id: _id,
                            aTouchIdentifiers: aTouchIdentifiers,
                            callback: _callback,
                            oData: _oCallbackData,
                            rect: true,
                            area: [
                                _oAreaData.aCentrePos[0] - _oAreaData.oImageData.oData.spriteHeight / 2, 
                                _oAreaData.aCentrePos[1] - _oAreaData.oImageData.oData.spriteHeight / 2, 
                                _oAreaData.aCentrePos[0] + _oAreaData.oImageData.oData.spriteWidth / 2, 
                                _oAreaData.aCentrePos[1] + _oAreaData.oImageData.oData.spriteHeight / 2
                            ]
                        });
                    } else {
                        this.aHitAreas.push({
                            id: _id,
                            aTouchIdentifiers: aTouchIdentifiers,
                            callback: _callback,
                            oData: _oCallbackData,
                            rect: true,
                            area: [
                                _oAreaData.aCentrePos[0] - _oAreaData.oImageData.img.width / 2, 
                                _oAreaData.aCentrePos[1] - _oAreaData.oImageData.img.height / 2, 
                                _oAreaData.aCentrePos[0] + _oAreaData.oImageData.img.width / 2, 
                                _oAreaData.aCentrePos[1] + _oAreaData.oImageData.img.height / 2
                            ]
                        });
                    }
                    break;
                case "rect":
                    this.aHitAreas.push({
                        id: _id,
                        aTouchIdentifiers: aTouchIdentifiers,
                        callback: _callback,
                        oData: _oCallbackData,
                        rect: true,
                        area: _oAreaData.aRect
                    });
                    break;
            }
        };
        UserInput.prototype.removeHitArea = function (_id) {
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].id == _id) {
                    this.aHitAreas.splice(i, 1);
                    i -= 1;
                }
            }
        };
        return UserInput;
    })();
    Utils.UserInput = UserInput;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var FpsMeter = (function () {
        function FpsMeter(_canvasHeight) {
            this.updateFreq = 10;
            this.updateInc = 0;
            this.frameAverage = 0;
            this.display = 1;
            this.log = "";
            this.render = function (_ctx) {
                this.frameAverage += this.delta / this.updateFreq;
                if(++this.updateInc >= this.updateFreq) {
                    this.updateInc = 0;
                    this.display = this.frameAverage;
                    this.frameAverage = 0;
                }
                _ctx.textAlign = "left";
                ctx.font = "10px Helvetica";
                _ctx.fillStyle = "#333333";
                _ctx.beginPath();
                _ctx.rect(0, this.canvasHeight - 15, 40, 15);
                _ctx.closePath();
                _ctx.fill();
                _ctx.fillStyle = "#ffffff";
                _ctx.fillText(Math.round(1000 / (this.display * 1000)) + " fps " + this.log, 5, this.canvasHeight - 5);
            };
            this.canvasHeight = _canvasHeight;
        }
        FpsMeter.prototype.update = function (_delta) {
            this.delta = _delta;
        };
        return FpsMeter;
    })();
    Utils.FpsMeter = FpsMeter;    
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Background = (function () {
        function Background(_oImgData, _canvasWidth, _canvasHeight) {
            this.x = 0;
            this.y = 0;
            this.targY = 0;
            this.incY = 0;
            this.oImgData = _oImgData;
            this.canvasWidth = _canvasWidth;
            this.canvasHeight = _canvasHeight;
        }
        Background.prototype.startScroll = function (_num) {
            this.targY -= _num * 5;
            TweenLite.killTweensOf(this);
            TweenLite.to(this, 4, {
                y: this.targY,
                ease: "Quad.easeOut"
            });
        };
        Background.prototype.updateScroll = function (_delta) {
            this.incY += 5 * _delta;
            this.x = (this.x - (Math.sin(this.incY / 10) * 50) * _delta);
            this.y = (this.y - 50 * _delta);
        };
        Background.prototype.render = function (_ctx) {
            this.x = this.x % this.canvasWidth;
            this.y = this.y % this.canvasHeight;
            if(this.x < 0) {
                this.x += this.canvasWidth;
            }
            if(this.y < 0) {
                this.y += this.canvasHeight;
            }
            _ctx.drawImage(this.oImgData.img, this.x, this.y, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight);
        };
        return Background;
    })();
    Elements.Background = Background;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Screens = (function () {
        function Screens(_oButs, _oBgImgData, _oTitleImgData, _canvasWidth, _canvasHeight) {
            this.incY = 0;
            this.score = 0;
            this.highestScore = 0;
            this.posY = 0;
            this.bgX = 0;
            this.bgY = 0;
            this.atmosX = 0;
            this.atmosY = 0;
            this.oButs = _oButs;
            this.oBgImgData = _oBgImgData;
            this.oTitleImgData = _oTitleImgData;
            this.canvasWidth = _canvasWidth;
            this.canvasHeight = _canvasHeight;
            this.posY = -this.canvasHeight;
        }
        Screens.prototype.setRenderFunc = function (_type) {
            this.posY = -this.canvasHeight;
            switch(_type) {
                case "start":
                    this.renderFunc = this.renderStartScreen;
                    TweenLite.to(this, .5, {
                        posY: 0
                    });
                    break;
                case "help":
                    break;
                case "end":
                    break;
            }
        };
        Screens.prototype.render = function (_ctx, _delta) {
            this.renderFunc(_ctx, _delta);
        };
        Screens.prototype.renderStartScreen = function (_ctx, _delta) {
            this.incY += 5 * _delta;
            this.bgY -= 50 * _delta;
            this.bgX -= (Math.sin(this.incY / 10) * 50) * _delta;
            var px = this.bgX % this.canvasWidth;
            var py = this.bgY % this.canvasHeight;
            if(px < 0) {
                px += this.canvasWidth;
            }
            if(py < 0) {
                py += this.canvasHeight;
            }
            _ctx.drawImage(this.oBgImgData.img, px, py, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight);
            _ctx.drawImage(this.oTitleImgData.img, 15 + this.posY, 60);
            _ctx.drawImage(this.oButs.play.imageData.img, this.oButs.play.pos[0] - this.oButs.play.imageData.img.width / 2, this.oButs.play.pos[1] - this.oButs.play.imageData.img.height / 2 - Math.sin(this.incY) * 5 - this.posY);
            _ctx.drawImage(this.oButs.moreGames.imageData.img, this.oButs.moreGames.pos[0] - this.oButs.moreGames.imageData.img.width / 2, this.oButs.moreGames.pos[1] - this.oButs.moreGames.imageData.img.height / 2 - Math.sin(this.incY) * 5 - this.posY);
        };
        return Screens;
    })();
    Elements.Screens = Screens;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Splash = (function () {
        function Splash(_oSplashScreenImgData, _canvasWidth, _canvasHeight) {
            this.inc = 0;
            this.oSplashScreenImgData = _oSplashScreenImgData;
            this.canvasWidth = _canvasWidth;
            this.canvasHeight = _canvasHeight;
            this.posY = -this.canvasHeight;
            TweenLite.to(this, .5, {
                posY: 0
            });
        }
        Splash.prototype.render = function (_ctx, _delta) {
            this.inc += 5 * _delta;
            _ctx.drawImage(this.oSplashScreenImgData.img, 0, 0 - this.posY);
        };
        return Splash;
    })();
    Elements.Splash = Splash;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Panel = (function () {
        function Panel(_oPanelsImgData, _oThinNumbersImgData, _oFatNumbersImgData, _panelType, _aButs, _canvasWidth, _canvasHeight) {
            this.timer = .3;
            this.endTime = 0;
            this.posY = 0;
            this.numberSpace = 17;
            this.incY = 0;
            this.oPanelsImgData = _oPanelsImgData;
            this.oThinNumbersImgData = _oThinNumbersImgData;
            this.oFatNumbersImgData = _oFatNumbersImgData;
            this.panelType = _panelType;
            this.aButs = _aButs;
            this.canvasWidth = _canvasWidth;
            this.canvasHeight = _canvasHeight;
        }
        Panel.prototype.update = function (_delta) {
            this.incY += 5 * _delta;
        };
        Panel.prototype.startTween = function () {
            this.posY = 550;
            TweenLite.to(this, .8, {
                posY: 0,
                ease: "Back.easeOut"
            });
        };
        Panel.prototype.render = function (_ctx) {
            switch(this.panelType) {
                case "start":
                    var id = 6;
                    var imgX = (id * this.oPanelsImgData.oData.spriteWidth) % this.oPanelsImgData.img.width;
                    var imgY = Math.floor(id / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                    _ctx.drawImage(this.oPanelsImgData.img, imgX, imgY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                    break;
                case "gameOver":
                    var id = 5;
                    var imgX = (id * this.oPanelsImgData.oData.spriteWidth) % this.oPanelsImgData.img.width;
                    var imgY = Math.floor(id / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                    _ctx.drawImage(this.oPanelsImgData.img, imgX, imgY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                    var num = this.oScoreData.gameScore;
                    for(var i = 0; i < num.toString().length; i++) {
                        id = parseFloat(num.toString().charAt(i));
                        var imgX = (id * this.oFatNumbersImgData.oData.spriteWidth) % this.oFatNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oFatNumbersImgData.img.width / this.oFatNumbersImgData.oData.spriteWidth)) * this.oFatNumbersImgData.oData.spriteHeight;
                        _ctx.drawImage(this.oFatNumbersImgData.img, imgX, imgY, this.oFatNumbersImgData.oData.spriteWidth, this.oFatNumbersImgData.oData.spriteHeight, this.canvasWidth / 2 + i * 25 - (25 * num.toString().length) / 2, 193 + this.posY, this.oFatNumbersImgData.oData.spriteWidth, this.oFatNumbersImgData.oData.spriteHeight);
                    }
//                    var num = this.oScoreData.longestChain;
                        var num = localStorage.poppoprush_longestchain;
                    for(var i = 0; i < num.toString().length; i++) {
                        id = parseFloat(num.toString().charAt(i));
                        var imgX = (id * this.oThinNumbersImgData.oData.spriteWidth) % this.oThinNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oThinNumbersImgData.img.width / this.oThinNumbersImgData.oData.spriteWidth)) * this.oThinNumbersImgData.oData.spriteHeight;
                        _ctx.drawImage(this.oThinNumbersImgData.img, imgX, imgY, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight, 224 + i * this.numberSpace, 253 + this.posY, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight);
                    }
                    var num = this.oScoreData.balloonsPopped;
                    for(var i = 0; i < num.toString().length; i++) {
                        id = parseFloat(num.toString().charAt(i));
                        var imgX = (id * this.oThinNumbersImgData.oData.spriteWidth) % this.oThinNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oThinNumbersImgData.img.width / this.oThinNumbersImgData.oData.spriteWidth)) * this.oThinNumbersImgData.oData.spriteHeight;
                        _ctx.drawImage(this.oThinNumbersImgData.img, imgX, imgY, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight, 253 + i * this.numberSpace, 286 + this.posY, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight);
                    }
//                    var num = this.oScoreData.highScore;
                        var num = localStorage.poppoprush_hiscore;
                    for(var i = 0; i < num.toString().length; i++) {
                        id = parseFloat(num.toString().charAt(i));
                        var imgX = (id * this.oThinNumbersImgData.oData.spriteWidth) % this.oThinNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oThinNumbersImgData.img.width / this.oThinNumbersImgData.oData.spriteWidth)) * this.oThinNumbersImgData.oData.spriteHeight;
                        _ctx.drawImage(this.oThinNumbersImgData.img, imgX, imgY, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight, 186 + i * this.numberSpace, 342 + this.posY, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight);
                    }
                    break;
                case "tutorial0":
                case "tutorial1":
                case "tutorial2":
                case "tutorial3":
                case "tutorial4":
                    var id = parseFloat(this.panelType.charAt(this.panelType.length - 1));
                    var imgX = (id * this.oPanelsImgData.oData.spriteWidth) % this.oPanelsImgData.img.width;
                    var imgY = Math.floor(id / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                    _ctx.drawImage(this.oPanelsImgData.img, imgX, imgY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                    break;
                case "pause":
                    var id = 7;
                    var imgX = (id * this.oPanelsImgData.oData.spriteWidth) % this.oPanelsImgData.img.width;
                    var imgY = Math.floor(id / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                    _ctx.drawImage(this.oPanelsImgData.img, imgX, imgY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                    break;
            }
            for(var i = 0; i < this.aButs.length; i++) {
                if(i % 2 == 0) {
                    _ctx.drawImage(this.aButs[i].oImgData.img, this.aButs[i].aPos[0] - this.aButs[i].oImgData.img.width / 2 + this.posY, this.aButs[i].aPos[1] - this.aButs[i].oImgData.img.height / 2 - Math.sin(this.incY + 180) * 5);
                } else {
                    _ctx.drawImage(this.aButs[i].oImgData.img, this.aButs[i].aPos[0] - this.aButs[i].oImgData.img.width / 2 - this.posY, this.aButs[i].aPos[1] - this.aButs[i].oImgData.img.height / 2 - Math.sin(this.incY) * 5);
                }
            }
        };
        return Panel;
    })();
    Elements.Panel = Panel;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Hud = (function () {
        function Hud(_oHudImgData, _oThinNumbersImgData, _oFatNumbersImgData, _canvasWidth, _canvasHeight) {
            this.score = 0;
            this.oHudImgData = _oHudImgData;
            this.oThinNumbersImgData = _oThinNumbersImgData;
            this.oFatNumbersImgData = _oFatNumbersImgData;
            this.canvasWidth = _canvasWidth;
            this.canvasHeight = _canvasHeight;
            this.score = 0;
        }
        Hud.prototype.render = function (_ctx, _time) {
            _ctx.drawImage(this.oHudImgData.img, 0, 0);
            for(var i = 0; i < this.score.toString().length; i++) {
                var id = parseFloat(this.score.toString().charAt(i));
                var imgX = (id * this.oFatNumbersImgData.oData.spriteWidth) % this.oFatNumbersImgData.img.width;
                var imgY = Math.floor(id / (this.oFatNumbersImgData.img.width / this.oFatNumbersImgData.oData.spriteWidth)) * this.oFatNumbersImgData.oData.spriteHeight;
                _ctx.drawImage(this.oFatNumbersImgData.img, imgX, imgY, this.oFatNumbersImgData.oData.spriteWidth, this.oFatNumbersImgData.oData.spriteHeight, 175 + i * 25 - (25 * this.score.toString().length) / 2, 18, this.oFatNumbersImgData.oData.spriteWidth, this.oFatNumbersImgData.oData.spriteHeight);
            }
            for(var i = 0; i < _time.toString().length; i++) {
                var id = parseFloat(_time.toString().charAt(i));
                var imgX = (id * this.oThinNumbersImgData.oData.spriteWidth) % this.oThinNumbersImgData.img.width;
                var imgY = Math.floor(id / (this.oThinNumbersImgData.img.width / this.oThinNumbersImgData.oData.spriteWidth)) * this.oThinNumbersImgData.oData.spriteHeight;
                _ctx.drawImage(this.oThinNumbersImgData.img, imgX, imgY, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight, 31 + i * 17 - (17 * _time.toString().length) / 2, 22, this.oThinNumbersImgData.oData.spriteWidth, this.oThinNumbersImgData.oData.spriteHeight);
            }
        };
        Hud.prototype.updateScore = function (_score) {
            this.score = _score;
        };
        return Hud;
    })();
    Elements.Hud = Hud;    
})(Elements || (Elements = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Elements;
(function (Elements) {
    var Dot = (function (_super) {
        __extends(Dot, _super);
        function Dot(_oDotImgData, _oPopImgData, _id, _type, _canvasWidth, _canvasHeight) {
                _super.call(this, _oDotImgData, 15, 15, "unSelected" + _type);
            this.canHit = true;
            this.selected = false;
            this.popDelay = -1;
            this.oDotImgData = _oDotImgData;
            this.oPopImgData = _oPopImgData;
            this.id = _id;
            this.type = this.colour = _type;
            this.canvasWidth = _canvasWidth;
            this.canvasHeight = _canvasHeight;
            this.offsetY = 10;
            this.frameInc = Math.ceil(Math.random() * 20);
            this.animEndedFunc = this.burst;
        }
        Dot.prototype.fall = function () {
            this.y = this.targY + 550;
            this.x = this.targX;
            TweenLite.to(this, .5, {
                y: this.targY,
                delay: this.id * .02,
                ease: "Quad.easeOut"
            });
        };
        Dot.prototype.replaceWithExistingDot = function (_dot) {
            this.y = _dot.targY;
            this.type = _dot.type;
            this.removeMe = false;
            this.canHit = true;
            this.x = this.targX;
            this.changeSpriteSheet(this.oDotImgData);
            this.frameInc = _dot.frameInc;
            this.unSelect();
            TweenLite.to(this, .5, {
                y: this.targY,
                ease: "Quad.easeInOut"
            });
        };
        Dot.prototype.replaceWithNewDot = function (_newType) {
            this.y = this.targY + 550;
            this.type = _newType;
            this.removeMe = false;
            this.canHit = true;
            this.x = this.targX;
            this.changeSpriteSheet(this.oDotImgData);
            this.frameInc = Math.ceil(Math.random() * 20);
            this.unSelect();
            TweenLite.to(this, .5, {
                y: this.targY,
                ease: "Quad.easeOut"
            });
        };
        Dot.prototype.trySelect = function (_lastSelectedDot) {
            var a = _lastSelectedDot.x - this.x;
            var b = _lastSelectedDot.targY - this.targY;
            var hyp = a * a + b * b;
            if(hyp < 8100 && (_lastSelectedDot.colour == this.colour || this.type >= 6 || _lastSelectedDot.type == 6)) {
                this.select();
                if(this.type >= 7) {
                    this.colour = _lastSelectedDot.colour;
                }
                this.prevDot = _lastSelectedDot;
                return this;
            } else {
                return _lastSelectedDot;
            }
        };
        Dot.prototype.select = function () {
            if(!this.selected) {
                this.setAnimType("loop", "selected" + this.type, false);
                this.selected = true;
            }
        };
        Dot.prototype.unSelect = function () {
            this.setAnimType("loop", "unSelected" + this.type, false);
            this.selected = false;
            this.colour = this.type;
        };
        Dot.prototype.update = function (_delta) {
            _super.prototype.updateAnimation.call(this, _delta);
            if(this.popDelay >= 0) {
                this.popDelay += _delta;
                if(this.popDelay > this.popDelayTarg) {
                    this.pop();
                }
            }
        };
        Dot.prototype.hit = function (_order) {
            this.popDelay = 0;
            this.popDelayTarg = _order * .25;
        };
        Dot.prototype.pop = function () {
            this.popDelay = -1;
            this.changeSpriteSheet(this.oPopImgData);
            this.canHit = false;
            this.setAnimType("once", "pop");
        };
        Dot.prototype.burst = function () {
            this.removeMe = true;
        };
        return Dot;
    })(Utils.AnimSprite);
    Elements.Dot = Dot;    
})(Elements || (Elements = {}));
var requestAnimFrame = (function () {
    return window.requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame || (window).oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60, new Date().getTime());
    };
})();
var previousTime;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
canvas.width = 383;
canvas.height = 550;
var canvasX;
var canvasY;
var canvasScaleX;
var canvasScaleY;
var div = document.getElementById('viewporter');
var sound;
var music;
var allowSound = false;
var muted = false;
var splash;
var splashTimer = 0;
var screens;
var assetLib;
var preAssetLib;
var rotatePause = false;
var manualPause = false;
var isMobile = false;
var gameState = "loading";
var aLangs = new Array("EN");
var curLang = "";
var isBugBrowser = false;
var deviceAgent = navigator.userAgent.toLowerCase();
if(deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/) || deviceAgent.match(/(iemobile)/) || deviceAgent.match(/iphone/i) || deviceAgent.match(/ipad/i) || deviceAgent.match(/ipod/i) || deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i)) {
    isMobile = true;
    if(deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent)) {
        isBugBrowser = true;
    }
}
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas();
window.onresize = function () {
    setTimeout(function () {
        resizeCanvas();
    }, 1);
};
document.addEventListener("visibilitychange", function () {
    if(document.hidden) {
        Howler.mute();
    } else if(!muted) {
        Howler.unmute();
    }
}, false);
window.addEventListener("load", function () {
    setTimeout(function () {
        resizeCanvas();
    }, 0);
    window.addEventListener("orientationchange", function () {
        resizeCanvas();
    }, false);
});
if(typeof (window).AudioContext !== 'undefined' || typeof (window).webkitAudioContext !== 'undefined' || navigator.userAgent.indexOf('Android') == -1) {
    allowSound = true;
    sound = new Howl({
        urls: [
            'audio/sound.ogg', 
            'audio/sound.m4a'
        ],
        sprite: {
            pop1: [
                0, 
                400
            ],
            pop2: [
                500, 
                400
            ],
            pop3: [
                1000, 
                750
            ],
            click: [
                2000, 
                300
            ],
            timesUp: [
                2500, 
                2400
            ],
            explode: [
                5000, 
                1500
            ],
            drag: [
                7000, 
                400
            ]
        }
    });
    music = new Howl({
        urls: [
            'audio/music.ogg', 
            'audio/music.m4a'
        ],
        volume: .25,
        loop: true
    });
}
var panel;
var hud;
var background;
var gameScore;
var gameNum = 0;
var aLevelUps;
var aTutorials = new Array({
    gameNum: 0,
    shown: false,
    panelType: "tutorial0"
}, {
    gameNum: 1,
    shown: false,
    panelType: "tutorial1"
}, {
    gameNum: 2,
    shown: false,
    panelType: "tutorial2"
}, {
    gameNum: 3,
    shown: false,
    panelType: "tutorial3"
}, {
    gameNum: 4,
    shown: false,
    panelType: "tutorial4"
});
var panelFrame;
var aDots;
var lastSelectedDot;
var aSelected;
var blockTap = false;
var removedDots;
var gameTime;
var longestChain;
var balloonsPopped;
var highScore = 0;
loadPreAssets();
function initSplash() {
    gameState = "splash";
    resizeCanvas();
    splash = new Elements.Splash(assetLib.getData("splash"), canvas.width, canvas.height);
    previousTime = new Date().getTime();
    updateSplashScreenEvent();
}
function initStartScreen() {
    gameState = "start";
    gameScore = 0;
    userInput.addHitArea("mute", butEventHandler, null, {
        type: "rect",
        aRect: [
            336, 
            0, 
            canvas.width, 
            48
        ]
    }, true);
    background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height);
    var oPlayBut = {
        oImgData: assetLib.getData("playBut"),
        aPos: [
            canvas.width / 2, 
            390
        ]
    };
    var oMoreGamesBut = {
        oImgData: assetLib.getData("moreGamesBut"),
        aPos: [
            canvas.width / 2, 
            500
        ]
    };
    userInput.addHitArea("startGame", butEventHandler, null, {
        type: "image",
        oImageData: oPlayBut.oImgData,
        aCentrePos: oPlayBut.aPos
    });
    userInput.addHitArea("moreGames", butEventHandler, null, {
        type: "image",
        oImageData: oMoreGamesBut.oImgData,
        aCentrePos: oMoreGamesBut.aPos
    });
    var aButs = new Array(oPlayBut, oMoreGamesBut);
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), gameState, aButs, canvas.width, canvas.height);
    panel.startTween();
    aDots = new Array();
    for(var i = 0; i < 6; i++) {
        var dot = new Elements.Dot(assetLib.getData("dot"), assetLib.getData("pop"), i, i, canvas.width, canvas.height);
        dot.x = Math.random() * canvas.width;
        dot.y = Math.random() * canvas.height;
        aDots.push(dot);
    }
    previousTime = new Date().getTime();
    updateStartScreenEvent();
}
function initPreGame() {
    
    if(!localStorage.poppoprush_longestchain){
        localStorage.poppoprush_longestchain = "0";}
    if(!localStorage.poppoprush_hiscore){
        localStorage.poppoprush_hiscore = "0";}
    
    //decamincow 记录初始值
    
    gameState = "tutorial";
    for(var i = 0; i < aTutorials.length; i++) {
        if(aTutorials[i].gameNum == gameNum && !aTutorials[i].shown) {
            background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height);
            var oPlayBut = {
                oImgData: assetLib.getData("playBut"),
                aPos: [
                    canvas.width / 2, 
                    465
                ]
            };
            userInput.addHitArea("continue", butEventHandler, null, {
                type: "image",
                oImageData: oPlayBut.oImgData,
                aCentrePos: oPlayBut.aPos
            });
            var aButs = new Array(oPlayBut);
            panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), aTutorials[i].panelType, aButs, canvas.width, canvas.height);
            panel.startTween();
            previousTime = new Date().getTime();
            updateTutorialEvent();
            return;
        }
    }
    initGame();
}
function initGame() {
    gameState = "game";
    if(allowSound) {
        music.volume(.5);
    }
    background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height);
    userInput.addHitArea("pause", butEventHandler, null, {
        type: "rect",
        aRect: [
            294, 
            0, 
            336, 
            48
        ]
    }, true);
    hud = new Elements.Hud(assetLib.getData("hud"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), canvas.width, canvas.height);
    aDots = new Array();
    aSelected = new Array();
    gameTime = 60;
    gameScore = 0;
    blockTap = false;
    longestChain = 0;
    balloonsPopped = 0;
    lastSelectedDot = null;
    for(var i = 0; i < 42; i++) {
        var dot = new Elements.Dot(assetLib.getData("dot"), assetLib.getData("pop"), i, getNewDotType(), canvas.width, canvas.height);
        dot.targX = Math.round(i % 6 * 62 + 36);
        dot.targY = Math.round(getYPosFromId(i));
        dot.fall();
        userInput.addHitArea("dotHit", butEventHandler, {
            id: i,
            isDraggable: true
        }, {
            type: "rect",
            aRect: [
                dot.x - 22, 
                dot.targY - 22, 
                dot.x + 22, 
                dot.targY + 22
            ]
        });
        aDots.push(dot);
    }
    background.startScroll(20);
    userInput.addHitArea("mouseUp", butEventHandler, {
        multiTouch: true
    }, {
        type: "rect",
        aRect: [
            0, 
            0, 
            canvas.width, 
            canvas.height
        ]
    });
    previousTime = new Date().getTime();
    updateGameEvent();
}
function butEventHandler(_id, _oData) {
    switch(_id) {
        case "langSelect":
            console.log(_oData.lang);
            curLang = _oData.lang;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            userInput.removeHitArea("langSelect");
            initLoadAssets();
            break;
        case "startGame":
            playSound("click");
            userInput.removeHitArea("startGame");
            userInput.removeHitArea("moreGames");
            initPreGame();
            break;
        case "moreGames":
            window.top.location.href = "https://itunes.apple.com/artist/appmosys/id898185915";//decamincow moregame
            break;
        case "dotHit":
            if(blockTap) {
                break;
            }
            if(!_oData.isBeingDragged) {
                if(aDots[_oData.id].type < 6) {
                    aDots[_oData.id].select();
                    lastSelectedDot = aDots[_oData.id];
                    aSelected = new Array(lastSelectedDot);
                    playSound("drag");
                }
            } else {
                if(lastSelectedDot == null) {
                    break;
                }
                lastSelectedDot = aDots[_oData.id].trySelect(lastSelectedDot);
                var foundIndex = -1;
                for(var i = 0; i < aSelected.length; i++) {
                    if(aSelected[i] == lastSelectedDot) {
                        foundIndex = i;
                    }
                }
                if(foundIndex == -1) {
                    aSelected.push(lastSelectedDot);
                    playSound("drag");
                } else {
                    for(var i = foundIndex + 1; i < aSelected.length; i++) {
                        aSelected[i].unSelect();
                        aSelected.splice(i, 1);
                        i -= 1;
                    }
                }
            }
            break;
        case "mouseUp":
            if(!_oData.isDown) {
                if(blockTap) {
                    break;
                }
                if(aSelected.length >= 3) {
                    var multipliers = 0;
                    var num = aSelected.length;
                    var isBomb = false;
                    for(var i = 0; i < num; i++) {
                        if(aSelected[i].type == 7 || aSelected[i].type == 9) {
                            isBomb = true;
                            for(var j = 0; j < 6; j++) {
                                var notIn = true;
                                for(var k = 0; k < aSelected.length; k++) {
                                    if(aSelected[k] == aDots[Math.floor(aSelected[i].id / 6) * 6 + j]) {
                                        notIn = false;
                                    }
                                }
                                if(notIn) {
                                    aSelected.push(aDots[Math.floor(aSelected[i].id / 6) * 6 + j]);
                                }
                            }
                        }
                        if(aSelected[i].type == 8 || aSelected[i].type == 9) {
                            isBomb = true;
                            for(var j = 0; j < 7; j++) {
                                var notIn = true;
                                for(var k = 0; k < aSelected.length; k++) {
                                    if(aSelected[k] == aDots[aSelected[i].id % 6 + j * 6]) {
                                        notIn = false;
                                    }
                                }
                                if(notIn) {
                                    aSelected.push(aDots[aSelected[i].id % 6 + j * 6]);
                                }
                            }
                        }
                    }
                    sortThis(aSelected);
                    for(var i = 0; i < aSelected.length; i++) {
                        if(aSelected[i].type == 10) {
                            multipliers++;
                        } else if(aSelected[i].type == 11) {
                            gameTime += 5;
                        }
                        aSelected[i].hit(i / aSelected.length);
                    }
                    localStorage.poppoprush_longestchain = Math.max(aSelected.length, localStorage.poppoprush_longestchain);
                    balloonsPopped += aSelected.length;
                    if(isBomb) {
                        playSound("explode");
                    } else if(aSelected.length == 3) {
                        playSound("pop1");
                    } else if(aSelected.length < 7) {
                        playSound("pop2");
                    } else {
                        playSound("pop3");
                    }
                    updateScore((num * num) * 10 + (aSelected.length * 100) + (multipliers * 2) * (aSelected.length * 100));
                    blockTap = true;
                    background.startScroll(aSelected.length);
                } else {
                    for(var i = 0; i < aSelected.length; i++) {
                        aSelected[i].unSelect();
                    }
                    aSelected = new Array();
                }
                removedDots = 0;
                lastSelectedDot = null;
            }
            break;
        case "continue":
            playSound("click");
            userInput.removeHitArea("continue");
            initGame();
            break;
        case "newGame":
            playSound("click");
            userInput.removeHitArea("pause");
            userInput.removeHitArea("newGame");
            userInput.removeHitArea("quitFromEnd");
            gameNum++;
            initPreGame();
            break;
        case "quitFromEnd":
            playSound("click");
            userInput.removeHitArea("pause");
            userInput.removeHitArea("newGame");
            userInput.removeHitArea("quitFromEnd");
            initStartScreen();
            break;
        case "mute":
            playSound("click");
            toggleMute();
            break;
        case "pause":
        case "resumeFromPause":
            playSound("click");
            toggleManualPause();
            break;
        case "quitFromPause":
            playSound("click");
            toggleManualPause();
            userInput.removeHitArea("pause");
            userInput.removeHitArea("dotHit");
            userInput.removeHitArea("mouseUp");
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("resumeFromPause");
            gameScore = 0;
            initStartScreen();
            break;
    }
}
function sortThis(_array) {
    _array.sort(function (a, b) {
        var aLen = a.id;
        var bLen = b.id;
        return (aLen < bLen) ? -1 : (aLen > bLen) ? 1 : 0;
    });
}
function updateScore(_inc) {
    gameScore += _inc;
    hud.updateScore(gameScore);
}
function initGameOver() {
    // window.location.href="objc://"+"gameOver:/0"; //by decamincow
    gameState = "gameOver";
    if(allowSound) {
        music.volume(.25);
    }
    userInput.removeHitArea("dotHit");
    userInput.removeHitArea("mouseUp");
    playSound("timesUp");
    background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height);
    var oPlayBut = {
        oImgData: assetLib.getData("playBut"),
        aPos: [
            263, 
            465
        ]
    };
    var oQuitBut = {
        oImgData: assetLib.getData("quitBut"),
        aPos: [
            120, 
            465
        ]
    };
    userInput.addHitArea("newGame", butEventHandler, null, {
        type: "image",
        oImageData: oPlayBut.oImgData,
        aCentrePos: oPlayBut.aPos
    });
    userInput.addHitArea("quitFromEnd", butEventHandler, null, {
        type: "image",
        oImageData: oQuitBut.oImgData,
        aCentrePos: oQuitBut.aPos
    });
    var aButs = new Array(oPlayBut, oQuitBut);
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), gameState, aButs, canvas.width, canvas.height);
    panel.startTween();
    localStorage.poppoprush_hiscore = Math.max(gameScore, localStorage.poppoprush_hiscore);//decamincow
    panel.oScoreData = {
        gameScore: gameScore,
        longestChain: localStorage.poppoprush_longestchain,
        balloonsPopped: balloonsPopped,
        highScore: localStorage.poppoprush_hiscore
    };
    previousTime = new Date().getTime();
    updateGameOver();
}
function replaceDots() {
    for(var i = 0; i < aSelected.length; i++) {
        var nextRowNum = 6;
        while(aSelected[i].id + nextRowNum < 42 && (!aDots[aSelected[i].id + nextRowNum].canHit)) {
            nextRowNum += 6;
        }
        if(aSelected[i].id > 36 || aSelected[i].id + nextRowNum >= 42) {
            aDots[aSelected[i].id].replaceWithNewDot(getNewDotType());
        } else {
            aDots[aSelected[i].id].replaceWithExistingDot(aDots[aSelected[i].id + nextRowNum]);
            renderSprite(aDots[aSelected[i].id]);
            if(aDots[aSelected[i].id + nextRowNum].canHit) {
                aDots[aSelected[i].id + nextRowNum].canHit = false;
                aSelected.push(aDots[aSelected[i].id + nextRowNum]);
                sortThis(aSelected);
            }
        }
    }
    aSelected = new Array();
    blockTap = false;
}
function getYPosFromId(_id) {
    return Math.floor(_id / 6) * 62 + 110;
}
function getNewDotType() {
    if(Math.random() * 9 < 8) {
        return Math.floor(Math.random() * 6);
    } else {
        return Math.floor(Math.random() * 6 + 6);
    }
}
function updateGameEvent() {
    if(manualPause || rotatePause || gameState != "game") {
        return;
    }
    var delta = getDelta();
    background.render(ctx);
    for(var i = 0; i < aDots.length; i++) {
        aDots[i].update(delta);
        renderSprite(aDots[i]);
        if(aDots[i].removeMe) {
            aDots[i].removeMe = false;
            if(++removedDots == aSelected.length) {
                replaceDots();
            }
        }
    }
    gameTime -= delta;
    if(gameTime <= 0) {
        initGameOver();
        return;
    }
    hud.render(ctx, Math.round(gameTime));
    renderMuteBut();
    requestAnimFrame(updateGameEvent);
}
function updateGameOver() {
    if(rotatePause || gameState != "gameOver") {
        return;
    }
    var delta = getDelta();
    background.updateScroll(delta);
    background.render(ctx);
    panel.update(delta);
    panel.render(ctx);
    renderMuteBut();
    requestAnimFrame(updateGameOver);
}
function updateSplashScreenEvent() {
    if(rotatePause || gameState != "splash") {
        return;
    }
    var delta = getDelta();
    splashTimer += delta;
    if(splashTimer > 2.5) {
        if(allowSound && !muted) {
            music.play();
        }
        initStartScreen();
        return;
    }
    splash.render(ctx, delta);
    requestAnimFrame(updateSplashScreenEvent);
}
function updateStartScreenEvent() {
    if(rotatePause || gameState != "start") {
        return;
    }
    var delta = getDelta();
    background.updateScroll(delta);
    background.render(ctx);
    for(var i = 0; i < aDots.length; i++) {
        aDots[i].y -= (30 + i * 2) * delta;
        aDots[i].x = (aDots[i].x - (Math.sin(aDots[i].y / 50) * 50) * delta);
        if(aDots[i].y < -100) {
            aDots[i].x = Math.random() * canvas.width;
            aDots[i].y = canvas.height + Math.random() * 200 + 100;
        }
        aDots[i].update(delta);
        renderSprite(aDots[i]);
    }
    panel.update(delta);
    panel.render(ctx);
    renderMuteBut();
    requestAnimFrame(updateStartScreenEvent);
}
function updateTutorialEvent() {
    if(rotatePause || gameState != "tutorial") {
        return;
    }
    var delta = getDelta();
    background.updateScroll(delta);
    background.render(ctx);
    panel.update(delta);
    panel.render(ctx);
    renderMuteBut();
    requestAnimFrame(updateTutorialEvent);
}
function getDelta() {
    var currentTime = new Date().getTime();
    var delta = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    if(delta > .5) {
        delta = 0;
    }
    return delta;
}
function renderSprite(_element) {
    ctx.save();
    ctx.translate(_element.x, _element.y);
    ctx.scale(_element.scaleX, _element.scaleY);
    ctx.rotate(_element.rotation);
    _element.render(ctx);
    ctx.restore();
}
function checkSpriteCollision(_s1, _s2, _dynamicRadius) {
    var s1XOffset = _s1.x;
    var s1YOffset = _s1.y;
    var s2XOffset = _s2.x;
    var s2YOffset = _s2.y;
    var distance_squared = (((s1XOffset - s2XOffset) * (s1XOffset - s2XOffset)) + ((s1YOffset - s2YOffset) * (s1YOffset - s2YOffset)));
    var radii_squared = (_s1.radius + _dynamicRadius) * (_s1.radius + _dynamicRadius);
    if(distance_squared < radii_squared) {
        return true;
    } else {
        return false;
    }
}
function loadPreAssets() {
    if(aLangs.length > 1) {
        preAssetLib = new Utils.AssetLoader(curLang, [
            {
                id: "langSelect",
                file: "images/langSelect.jpg"
            }, 
            {
                id: "preloadImage",
                file: "images/" + curLang + "/preloadImage.jpg"
            }
        ], ctx, canvas.width, canvas.height, false);
        preAssetLib.onReady(initLangSelect);
    } else {
        curLang = aLangs[0];
        preAssetLib = new Utils.AssetLoader(curLang, [
            {
                id: "preloadImage",
                file: "images/" + curLang + "/preloadImage.jpg"
            }
        ], ctx, canvas.width, canvas.height, false);
        preAssetLib.onReady(initLoadAssets);
    }
}
function initLangSelect() {
    var oImgData = preAssetLib.getData("langSelect");
    ctx.drawImage(oImgData.img, canvas.width / 2 - oImgData.img.width / 2, canvas.height / 2 - oImgData.img.height / 2);
    var butSize = 140;
    for(var i = 0; i < aLangs.length; i++) {
        var px = canvas.width / 2 - (butSize * aLangs.length) / 2 + i * butSize;
        var py = canvas.height / 2 - butSize / 2;
        userInput.addHitArea("langSelect", butEventHandler, {
            lang: aLangs[i]
        }, {
            type: "rect",
            aRect: [
                px, 
                py, 
                px + butSize, 
                py + 140
            ]
        });
    }
}
function initLoadAssets() {
    var oImgData = preAssetLib.getData("preloadImage");
    ctx.drawImage(oImgData.img, canvas.width / 2 - oImgData.img.width / 2, canvas.height / 2 - oImgData.img.height - 10);
    loadAssets();
}
function loadAssets() {
    assetLib = new Utils.AssetLoader(curLang, [
        {
            id: "background",
            file: "images/background.jpg"
        }, 
        {
            id: "rotateDeviceMessage",
            file: "images/rotateDeviceMessage.jpg"
        }, 
        {
            id: "splash",
            file: "images/splashScreen.jpg"
        }, 
        {
            id: "hud",
            file: "images/" + curLang + "/hud.png"
        }, 
        {
            id: "playBut",
            file: "images/playBut.png"
        }, 
        {
            id: "quitBut",
            file: "images/quitBut.png"
        }, 
        {
            id: "moreGamesBut",
            file: "images/moreGamesBut.png"
        }, 
        {
            id: "panels",
            file: "images/" + curLang + "/panels_383x550.png",
            oData: {
                columns: 2,
                spriteWidth: 383,
                spriteHeight: 550
            }
        }, 
        {
            id: "dot",
            file: "images/dots_64x86.png",
            oData: {
                oAnims: {
                    unSelected0: [
                        0, 
                        1, 
                        2, 
                        3, 
                        4, 
                        5, 
                        6, 
                        7, 
                        8, 
                        9, 
                        10, 
                        11, 
                        12, 
                        13, 
                        14, 
                        15, 
                        16, 
                        17, 
                        18, 
                        19
                    ],
                    unSelected1: [
                        20, 
                        21, 
                        22, 
                        23, 
                        24, 
                        25, 
                        26, 
                        27, 
                        28, 
                        29, 
                        30, 
                        31, 
                        32, 
                        33, 
                        34, 
                        35, 
                        36, 
                        37, 
                        38, 
                        39
                    ],
                    unSelected2: [
                        40, 
                        41, 
                        42, 
                        43, 
                        44, 
                        45, 
                        46, 
                        47, 
                        48, 
                        49, 
                        50, 
                        51, 
                        52, 
                        53, 
                        54, 
                        55, 
                        56, 
                        57, 
                        58, 
                        59
                    ],
                    unSelected3: [
                        60, 
                        61, 
                        62, 
                        63, 
                        64, 
                        65, 
                        66, 
                        67, 
                        68, 
                        69, 
                        70, 
                        71, 
                        72, 
                        73, 
                        74, 
                        75, 
                        76, 
                        77, 
                        78, 
                        79
                    ],
                    unSelected4: [
                        80, 
                        81, 
                        82, 
                        83, 
                        84, 
                        85, 
                        86, 
                        87, 
                        88, 
                        89, 
                        90, 
                        91, 
                        92, 
                        93, 
                        94, 
                        95, 
                        96, 
                        97, 
                        98, 
                        99
                    ],
                    unSelected5: [
                        100, 
                        101, 
                        102, 
                        103, 
                        104, 
                        105, 
                        106, 
                        107, 
                        108, 
                        109, 
                        110, 
                        111, 
                        112, 
                        113, 
                        114, 
                        115, 
                        116, 
                        117, 
                        118, 
                        119
                    ],
                    unSelected6: [
                        120
                    ],
                    unSelected7: [
                        121
                    ],
                    unSelected8: [
                        122
                    ],
                    unSelected9: [
                        123
                    ],
                    unSelected10: [
                        124
                    ],
                    unSelected11: [
                        125
                    ],
                    selected0: [
                        126, 
                        127, 
                        128, 
                        129
                    ],
                    selected1: [
                        130, 
                        131, 
                        132, 
                        133
                    ],
                    selected2: [
                        134, 
                        135, 
                        136, 
                        137
                    ],
                    selected3: [
                        138, 
                        139, 
                        140, 
                        141
                    ],
                    selected4: [
                        142, 
                        143, 
                        144, 
                        145
                    ],
                    selected5: [
                        146, 
                        147, 
                        148, 
                        149
                    ],
                    selected6: [
                        150, 
                        151, 
                        152, 
                        153
                    ],
                    selected7: [
                        154, 
                        155, 
                        156, 
                        157
                    ],
                    selected8: [
                        158, 
                        159, 
                        160, 
                        161
                    ],
                    selected9: [
                        162, 
                        163, 
                        164, 
                        165
                    ],
                    selected10: [
                        166, 
                        167, 
                        168, 
                        169
                    ],
                    selected11: [
                        170, 
                        171, 
                        172, 
                        173
                    ]
                },
                columns: 16,
                spriteWidth: 64,
                spriteHeight: 86
            }
        }, 
        {
            id: "pop",
            file: "images/pop_156x141.png",
            oData: {
                oAnims: {
                    pop: [
                        0, 
                        1, 
                        2, 
                        3, 
                        4, 
                        5, 
                        6, 
                        7, 
                        8, 
                        9, 
                        10
                    ]
                },
                columns: 6,
                spriteWidth: 156,
                spriteHeight: 141
            }
        }, 
        {
            id: "fatNumbers",
            file: "images/fatNumbers_33x41.png",
            oData: {
                columns: 10,
                spriteWidth: 33,
                spriteHeight: 41
            }
        }, 
        {
            id: "thinNumbers",
            file: "images/thinNumbers_25x32.png",
            oData: {
                columns: 10,
                spriteWidth: 25,
                spriteHeight: 32
            }
        }, 
        {
            id: "muteBut",
            file: "images/mute_35x35.png",
            oData: {
                columns: 2,
                spriteWidth: 35,
                spriteHeight: 35
            }
        }
    ], ctx, canvas.width, canvas.height);
    assetLib.onReady(initSplash);
}
function resizeCanvas() {
    var tempInnerWidth = window.innerWidth;
    var tempInnerHeight = window.innerHeight;
    if(tempInnerWidth > 480) {
        tempInnerWidth -= 1;
        tempInnerHeight -= 1;
    }
    if(window.innerWidth > window.innerHeight && isMobile) {
        if(gameState != "loading") {
            rotatePauseOn();
        }
        if(tempInnerWidth / canvas.width < tempInnerHeight / canvas.height) {
            canvas.style.width = tempInnerWidth + "px";
            canvas.style.height = (tempInnerWidth / canvas.width) * canvas.height + "px";
            canvasX = 0;
            canvasY = ((tempInnerHeight - (tempInnerWidth / canvas.width) * canvas.height) / 2);
            canvasScaleX = canvasScaleY = canvas.width / tempInnerWidth;
            div.style.marginTop = canvasY + "px";
            div.style.marginLeft = canvasX + "px";
        } else {
            canvas.style.width = (tempInnerHeight / canvas.height) * canvas.width + "px";
            canvas.style.height = tempInnerHeight + "px";
            canvasX = ((tempInnerWidth - (tempInnerHeight / canvas.height) * canvas.width) / 2);
            canvasY = 0;
            canvasScaleX = canvasScaleY = canvas.height / tempInnerHeight;
            div.style.marginTop = canvasY + "px";
            div.style.marginLeft = canvasX + "px";
        }
    } else if(!isMobile) {
        if(rotatePause) {
            rotatePauseOff();
        }
        if(tempInnerWidth / canvas.width < tempInnerHeight / canvas.height) {
            canvas.style.width = tempInnerWidth + "px";
            canvas.style.height = (tempInnerWidth / canvas.width) * canvas.height + "px";
            canvasX = 0;
            canvasY = ((tempInnerHeight - (tempInnerWidth / canvas.width) * canvas.height) / 2);
            canvasScaleX = canvasScaleY = canvas.width / tempInnerWidth;
            div.style.marginTop = canvasY + "px";
            div.style.marginLeft = canvasX + "px";
        } else {
            canvas.style.width = (tempInnerHeight / canvas.height) * canvas.width + "px";
            canvas.style.height = tempInnerHeight + "px";
            canvasX = ((tempInnerWidth - (tempInnerHeight / canvas.height) * canvas.width) / 2);
            canvasY = 0;
            canvasScaleX = canvasScaleY = canvas.height / tempInnerHeight;
            div.style.marginTop = canvasY + "px";
            div.style.marginLeft = canvasX + "px";
        }
    } else {
        if(rotatePause) {
            rotatePauseOff();
        }
        canvasX = canvasY = 0;
        canvasScaleX = canvas.width / tempInnerWidth;
        canvasScaleY = canvas.height / tempInnerHeight;
        canvas.style.width = tempInnerWidth + "px";
        canvas.style.height = tempInnerHeight + "px";
        div.style.marginTop = 0 + "px";
        div.style.marginLeft = 0 + "px";
    }
    userInput.setCanvas(canvasX, canvasY, canvasScaleX, canvasScaleY);
}
function playSound(_id) {
    if(allowSound) {
        sound.play(_id);
    }
}
function toggleMute() {
    muted = !muted;
    if(allowSound) {
        if(muted) {
            Howler.mute();
        } else {
            Howler.unmute();
        }
    }
    renderMuteBut();
}
function renderMuteBut() {
    if(!allowSound) {
        return;
    }
    var oImgData = assetLib.getData("muteBut");
    var id = 0;
    if(muted) {
        id = 1;
    }
    var imgX = (id * oImgData.oData.spriteWidth) % oImgData.img.width;
    var imgY = Math.floor(id / (oImgData.img.width / oImgData.oData.spriteWidth)) * oImgData.oData.spriteHeight;
    ctx.drawImage(oImgData.img, imgX, imgY, oImgData.oData.spriteWidth, oImgData.oData.spriteHeight, 340, 10, oImgData.oData.spriteWidth, oImgData.oData.spriteHeight);
}
function toggleManualPause() {
    if(!manualPause) {
        manualPause = true;
        pauseCoreOn();
        var oQuitBut = {
            oImgData: assetLib.getData("quitBut"),
            aPos: [
                120, 
                465
            ]
        };
        var oResumeBut = {
            oImgData: assetLib.getData("playBut"),
            aPos: [
                263, 
                465
            ]
        };
        var aButs = new Array(oQuitBut, oResumeBut);
        userInput.addHitArea("quitFromPause", butEventHandler, null, {
            type: "image",
            oImageData: oQuitBut.oImgData,
            aCentrePos: oQuitBut.aPos
        });
        userInput.addHitArea("resumeFromPause", butEventHandler, null, {
            type: "image",
            oImageData: oResumeBut.oImgData,
            aCentrePos: oResumeBut.aPos
        });
        panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("thinNumbers"), assetLib.getData("fatNumbers"), "pause", aButs, canvas.width, canvas.height);
        panel.render(ctx);
        userInput.addHitArea("pause", butEventHandler, null, {
            type: "rect",
            aRect: [
                294, 
                0, 
                336, 
                48
            ]
        }, true);
    } else {
        manualPause = false;
        userInput.removeHitArea("quitFromPause");
        userInput.removeHitArea("resumeFromPause");
        pauseCoreOff();
    }
}
function rotatePauseOn() {
    rotatePause = true;
    ctx.drawImage(assetLib.getImg("rotateDeviceMessage"), 0, 0);
    userInput.pauseIsOn = true;
    pauseCoreOn();
}
function rotatePauseOff() {
    rotatePause = false;
    pauseCoreOff();
}
function pauseCoreOn() {
    if(allowSound) {
        Howler.mute();
    }
    switch(gameState) {
        case "start":
            break;
        case "help":
            break;
        case "game":
            userInput.removeHitArea("dotHit");
            userInput.removeHitArea("mouseUp");
            break;
        case "end":
            break;
    }
}
function pauseCoreOff() {
    if(allowSound) {
        if(!muted) {
            Howler.unmute();
        }
    }
    previousTime = new Date().getTime();
    userInput.pauseIsOn = false;
    switch(gameState) {
        case "splash":
            updateSplashScreenEvent();
            break;
        case "start":
            initStartScreen();
            break;
        case "tutorial":
            initPreGame();
            break;
        case "game":
            manualPause = false;
            for(var i = 0; i < aDots.length; i++) {
                userInput.addHitArea("dotHit", butEventHandler, {
                    id: i,
                    isDraggable: true
                }, {
                    type: "rect",
                    aRect: [
                        aDots[i].x - 22, 
                        aDots[i].targY - 22, 
                        aDots[i].x + 22, 
                        aDots[i].targY + 22
                    ]
                });
            }
            userInput.addHitArea("mouseUp", butEventHandler, {
                multiTouch: true
            }, {
                type: "rect",
                aRect: [
                    0, 
                    0, 
                    canvas.width, 
                    canvas.height
                ]
            });
            updateGameEvent();
            break;
        case "gameOver":
            initGameOver();
            break;
    }
}
