

cc.Class({
    extends: cc.Component,

    properties: {
        BackSp: [cc.Sprite], 
        WipeNode: cc.Node,
        wipePre: cc.Prefab,
        BgSp: [cc.SpriteFrame],
        endNode: cc.Node,
        startNode: cc.Node,
        scoreLab: cc.Label,
        endScoreLab: cc.Label,
        bestScoreLab: cc.Label,
        bird: cc.Node,

        bgMoveSpeed: 100,
        time: 3,

        _score: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;

        this.tmCount = 0;
        this.dayTM = 0.0;
        this.isNight = false;

        this.endNode.active = false;
        this.startNode.active = true;
        this.bird.active = false;
        cc.director.pause();
    },

    start () {

    },

    update: function(dt) {
        this.moveBackground(dt);
        this.newTwoWipe(dt);

        this.dayTM += dt;
        if ( this.dayTM > 100 ){
            this.isNight = !this.isNight;
            this.dayTM = 0;
        }
        // cc.log("dayTM = "+ this.dayTM+ " isNight = "+this.isNight);
    },
    
    //生成一对管道;
    newTwoWipe: function(dt){
        if ( this.tmCount >= this.time ){
            this.tmCount = 0;

            //上管道
            var wipe_up = cc.instantiate(this.wipePre);
            wipe_up.getComponent("wipe").setWipeDirAndType(-1,this.isNight ? 1:-1);
            wipe_up.getComponent("wipe").initGameScene(this);
            var pos = cc.p(cc.visibleRect.width,cc.visibleRect.height/2 - this.getRandom(wipe_up.height/2,0));
            wipe_up.setPosition(pos);
            this.WipeNode.addChild(wipe_up);

            //下管道
            var wipe_down = cc.instantiate(this.wipePre);
            wipe_down.getComponent("wipe").setWipeDirAndType(1,this.isNight ? 1:-1);
            wipe_down.getComponent("wipe").initGameScene(this);
            var pos2 = cc.p(cc.visibleRect.width,-(cc.visibleRect.height/2- this.getRandom(wipe_down.height/2,0)));
            wipe_down.setPosition(pos2);
            this.WipeNode.addChild(wipe_down);
        }else{
            this.tmCount += dt;
        }
    },

    getRandom: function(max, min){
        var value = Math.random()*(max-min);
        return value;
    },

    //背景移动
    moveBackground: function(dt){
        for ( var i=0; i<this.BackSp.length; i++ ){
            var posX = this.BackSp[i].node.x;
            if ( posX < -this.BackSp[i].node.width ){
                posX -= this.bgMoveSpeed*dt; 
                posX += 2*this.BackSp[i].node.width;
                if (this.isNight == true){
                    this.BackSp[i].spriteFrame = this.BgSp[1];
                }else{
                    this.BackSp[i].spriteFrame = this.BgSp[0];
                }
            }else{
                posX -= this.bgMoveSpeed*dt; 
            }
            this.BackSp[i].node.setPositionX(posX);
        }
    },

    gameOver: function(){
        cc.director.pause();
        this.endNode.active = true;
        // this.manager.enabled = false;
        this.endScoreLab.string = this._score;
        var bestScore = cc.sys.localStorage.getItem("BestScore",0);
        this.bestScoreLab.string = bestScore;
        if (this._score > bestScore){
            cc.sys.localStorage.setItem("BestScore",this._score);
        }

    },

    onRestartClicked: function(){
        cc.director.loadScene("GameScene");
        cc.director.resume();
    },

    refreshScore: function(score){
        this._score += score;
        this.scoreLab.string = "分数："+this._score;
    },

    startGame: function(){
        cc.director.resume();
        this.bird.active = true;
        this.startNode.active = false;
        cc.log("start Game");
    },

    pauseGame: function(){
        cc.director.pause();
    }
});
