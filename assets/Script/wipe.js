
var Type_Up = -1;    //上面的管道
var Type_Down = 1;   //下面的管道

var Type_Day = -1;   //白天
var Type_Night = 1;  //夜晚

cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed: 100,

        dirFrame: {
            default: [],
            type: cc.SpriteFrame,
        },

        tmFrame: {
            default: [],
            type: cc.SpriteFrame,
        },

        _dir: Type_Up,
        _type: Type_Day,
        _isPass: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    initGameScene: function(gameScene){
        this.gameScene = gameScene;
    },

    setWipeDirAndType: function(dir,type){
        this._dir = dir;
        this._type = type;
        if ( dir == Type_Up ){
            if ( type == Type_Day ){
                this.getComponent(cc.Sprite).spriteFrame = this.dirFrame[0];
            }else{
                this.getComponent(cc.Sprite).spriteFrame = this.tmFrame[0];
            }
        }else{
            if ( type == Type_Day ){
                this.getComponent(cc.Sprite).spriteFrame = this.dirFrame[1];
            }else{
                this.getComponent(cc.Sprite).spriteFrame = this.tmFrame[1];
            }
        }
    },

    start () {

    },

    update (dt) {
        var posX = this.node.x ;
        if ( posX < -this.node.width/2 ){
            this.node.destroy();
        }else{
            posX = posX - dt*this.moveSpeed;
            this.node.setPositionX(posX);

            if (posX < cc.visibleRect.width / 2 - this.node.width / 2 && this._dir == Type_Up && !this._isPass){
                this.gameScene.refreshScore(1);
                this._isPass = true;
            }
        }
    },

});
