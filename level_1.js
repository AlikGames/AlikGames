let strongSt = 0;
let healthSt = 0;
let speedSt = 0;
var mks;
var heart3, heart2, heart1;
var health = 3;

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function GameScene() {
        Phaser.Scene.call(this, {key: 'gameScene', active: false});
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
        this.strongStats = null;
    },

    preload: function () {
        this.load.image('heart', 'heart.png');
        this.load.image('stats700', 'stats700.png');
        this.load.image('nl', 'nl.png');
        this.load.image('ryba1', 'character/ryba1.png');
        this.load.image('vr', 'vr.png');
        this.load.image('forrest', 'background/forrest.png');
        this.load.image('ground', 'platform.png');
        this.load.image('star', 'v-bucks.png');
        this.load.image('bomb', 'bomb.png');
        this.load.spritesheet('bombx', 'bombx.png', {frameWidth: 90, frameHeight: 90});
        this.load.spritesheet('dude', 'character/dude1.png', {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('fullscreen', 'fullscreen.png', {frameWidth: 64, frameHeight: 64});
        this.load.audio('mks', ['mks.mp3', 'mks.mp3']);
        this.load.audio('r1', ['sounds/r1.mp3']);
        this.load.audio('collectCoin', ['sounds/collectCoin.mp3']);
    },

    putHearts: function () {
        heart3 = this.add.image(680, 46, 'heart').setScale(0.5);
        heart2 = this.add.image(630, 46, 'heart').setScale(0.5);
        heart1 = this.add.image(580, 46, 'heart').setScale(0.5);
    },

    create: function () {
        this.score = 0;
        var r1 = this.sound.add('r1');
        r1.play();
        this.add.image(400, 300, 'forrest');

        mks = this.sound.add('mks');
        setTimeout(function () {
            mks.play();
        }, 2000);
        var platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        var player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        var stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70}
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000',
            fontFamily: 'Burbank Big Cd Bk'
        });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(player, stars, this.collectStar, null, this);

        this.player = player;

        this.putHearts();
        var button = this.add.image(800 - 16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();

        button.on('pointerup', function () {

            if (this.scale.isFullscreen) {
                button.setFrame(0);

                this.scale.stopFullscreen();
            }
            else {
                button.setFrame(1);

                this.scale.startFullscreen();
            }

        }, this);

        this.scoreText.setText('Score: 0 / 48');

        var FKey = this.input.keyboard.addKey('F');

        FKey.on('down', function () {

            if (this.scale.isFullscreen) {
                button.setFrame(0);
                this.scale.stopFullscreen();
            }
            else {
                button.setFrame(1);
                this.scale.startFullscreen();
            }

        }, this);
        this.input.on('gameobjectup', function (pointer, gameObject) {
            gameObject.emit('clicked', gameObject);
        }, this);
    },

    update: function () {
        var cursors = this.cursors;
        var player = this.player;

        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    },

    collectStar: function (player, star) {
        var musicCoin = this.sound.add('collectCoin');
        musicCoin.play();
        star.disableBody(true, true);

        this.score += 1;
        this.scoreText.setText('Score: ' + this.score + ' / 48');
        if (this.score == 12) {
            strongSt += 25;
            healthSt += 25;
            speedSt += 25;
            this.add.image(400, 250, 'ryba1');
            this.add.image(400, 300, 'stats700').setScale(0.6);
            var nl = this.add.image(800, 675, 'nl').setScale(0.6);
            nl.setInteractive();
            nl.on('clicked',
                function (button) {
                    mks.stop();
                    button.setVisible(false);
                    this.scene.start('gameScene2')
                }, this);
            this.strongStats = this.add.text(300, 270, strongSt + ' / 100',
                {
                    fontSize: '25px',
                    fill: '#000',
                    fontFamily: 'Burbank Big Cd Bk'
                });
            this.healthStats = this.add.text(300, 300, healthSt + ' / 100',
                {
                    fontSize: '25px',
                    fill: '#000',
                    fontFamily: 'Burbank Big Cd Bk'
                });
            this.speedStats = this.add.text(300, 330, speedSt + ' / 100',
                {
                    fontSize: '25px',
                    fill: '#000',
                    fontFamily: 'Burbank Big Cd Bk'
                });
        }
    }


});
