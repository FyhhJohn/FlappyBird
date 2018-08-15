
var BirdDir_UP = 1;
var BirdDir_none = 0;
var BirdDir_Down = -1;

var GameScene = require("GameScene");

cc.Class({
    extends: cc.Component,

    properties: {
        gameScene: GameScene,

        curSpeed: 0,
        upSpeed: 200,
        gravity: 100,
        birdDir: BirdDir_Down,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.birdDir = BirdDir_Down;
        cc.log("bird");
        this.addTouchListener();
    },

    start () {

    },

    addTouchListener: function(){
        this.node.parent.on("touchstart",this.onTouchBegin,this);
    },

    onTouchBegin: function(target){
        this.curSpeed += this.upSpeed;
    },

    onCollisionEnter: function(other,self){
        cc.log('onCollisionEnter');
        if (other.node.group == "wipe" || other.node.group == "ground"){
            cc.log('结束游戏');
            this.gameScene.gameOver();
        }
    },

    update: function(dt) {
        var speed = this.curSpeed + this.gravity * dt;
        this.curSpeed = speed;

        var delta = speed * dt;

        var posY = this.node.y + delta;
        this.node.setPositionY(posY);

        if ( this.curSpeed > 10 ){
            this.birdDir = BirdDir_UP;
        }else if( this.curSpeed > -10 && this.curSpeed <= 10){
            this.birdDir = BirdDir_none;
        }else{
            this.birdDir = BirdDir_Down;        
        }

        var angle = -45*this.birdDir;
        this.node.setRotation(angle);
    },
});
