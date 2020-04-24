var zoom = 1;
var zoomC = 0.9;
var gameName;

var GameScene0 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function GameScene0() {
        Phaser.Scene.call(this, {key: 'gameScene0', active: false});
        this.player = null;
        this.cursors = null;
        this.score = 12;
        this.scoreText = null;
        this.strongStats = null;
    },

    preload: function () {

        this.load.image('bgf', 'background/bgf.jpg');
        this.load.spritesheet('fullscreen', 'fullscreen.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('settings', 'settings.png');
        this.load.image('startGame', 'startGame.png');
        this.load.image('gameName', 'gameName.png');
        this.load.image('fishStick', 'fishStick.png');
        this.load.audio('bgMusic', ['bgMusic.mp3', 'bgMusic.mp3']);

    },


    next: function () {
        this.scene.start('gameScene')
    },

    create: function () {
        this.add.image(400, 300, 'bgf');
        this.add.image(400, 350, 'fishStick');
        this.add.image(400, 470, 'settings');
        var bgMusic = this.sound.add('bgMusic');
        bgMusic.play();
        gameName = this.add.image(400, 100, 'gameName');
        gameName.setScale(0.9);
        this.startGame = this.add.image(400, 370, 'startGame');
        this.startGame.setInteractive();
        this.input.on('gameobjectdown', function (p, g) {
            bgMusic.stop();
            this.scene.start('gameScene')
        }, this);
    },


    update: function () {
        if (zoom == 1 && zoomC <= 1.0) {
            zoomC += 0.003;
            gameName.setScale(zoomC)
        } else if (zoom == 2 && zoomC >= 0.9) {
            zoomC -= 0.003;
            gameName.setScale(zoomC)
        }
        if (zoomC > 1.0) {
            zoom = 2;
        } else if (zoomC < 0.9) {
            zoom = 1;
        }
    }

});