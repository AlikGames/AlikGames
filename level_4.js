var heartZoom = 1;
var heartZoomC = 0.5;
var heartZoomFlag = 0;
var heartCounter = 0;
var superBomba, superBomba2;
var gameBlock = false;
var skullGameOver;
var skullFlag = 0;
var skullC = 0.1;
var hahaFlag = 0;
var youLose;
var platforms;
let gKey;
let gate;
let hiddenGate;
let gateDoor;
let gateOpen;
var gKeyMover = 1;
var gKeyRotation = 0;
var gKeyCounter = 0;
var isKeyInThePocket = false;

var bombFlags = [0, 0, 0];

var thinkTime = 0;

function heartProcessingSkull() {
    heart1.visible = false;
    heart2.visible = false;
    heart3.visible = false;
}

var GameScene4 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function GameScene4() {
        Phaser.Scene.call(this, {key: 'gameScene4', active: true});

        this.player = null;
        this.cursors = null;
        this.score = 36;
        this.scoreText = null;
        this.strongStats = null;
    },

    preload: function () {
        this.load.image('heart', 'heart.png');
        this.load.image('stats700', 'stats700.png');
        this.load.image('nl', 'nl.png');
        this.load.image('ryba1', 'character/ryba1.png');
        this.load.image('vr', 'vr.png');
        this.load.image('snow', 'background/snow.jpg');
        this.load.image('ground', 'platformL4-1.png');
        this.load.image('flame', 'flame.png');
        this.load.image('platform2', 'platformL4-2.png');
        this.load.image('platform3', 'platformL4-3.png');
        this.load.image('gate', 'img/gate.png');
        this.load.image('gateDoor', 'img/gateDoor.png');
        this.load.image('star', 'v-bucks.png');
        this.load.image('youLose', 'youLose.png');
        this.load.image('skullOver', 'skullOver.png');
        this.load.image('restartGame', 'restartGame.png');
        this.load.image('cuteSkull', 'cuteSkull.png');
        this.load.image('Gkey', 'img/Gkey.png');
        this.load.spritesheet('bombx', 'bombx.png', {frameWidth: 90, frameHeight: 90});
        this.load.spritesheet('dude', 'character/dude1.png', {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('fullscreen', 'fullscreen.png', {frameWidth: 64, frameHeight: 64});
        this.load.audio('musicL4', ['musicL4.mp3', 'musicL4.mp3']);
        this.load.audio('r4', ['sounds/r4.mp3']);
        this.load.audio('keySound', ['sounds/keySound.mp3']);
        this.load.audio('collectCoin', ['sounds/collectCoin.mp3']);
        this.load.audio('bombEx', ['sounds/bombEx.mp3']);
        this.load.audio('hahaha', ['sounds/hahaha.mp3']);
        this.load.audio('gateOpen', ['sounds/gateOpen.mp3']);

        var url;

        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmovetoplugin.min.js';
        this.load.plugin('rexmovetoplugin', url, true);
    },

    putHearts: function () {
        if (health > 0) {
            heart1 = this.add.image(680, 46, 'heart').setScale(0.5);
        }
        if (health > 1) {
            heart2 = this.add.image(630, 46, 'heart').setScale(0.5);
        }
        if (health > 2) {
            heart3 = this.add.image(580, 46, 'heart').setScale(0.5);
        }
    },

    create: function () { // run only once
        skullFlag = 0;

        this.score = 36;

        var r4 = this.sound.add('r4');
        r4.play();
        this.add.image(400, 300, 'snow');

        gateOpen = this.sound.add('gateOpen');

        musicL4 = this.sound.add('musicL4');
        setTimeout(function () {
            musicL4.play();
        }, 2000);
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // ground
        platforms.create(400, 362, 'platform3'); // center
        platforms.create(700, 150, 'platform3'); // platform for gate
        platforms.create(-25, 370, 'platform2'); // left

        hiddenGate = this.add.image(645, 102, 'gate');
        gateDoor = this.physics.add.image(644, 118, 'gateDoor').setScale(0.13);
        gateDoor.body.setAllowGravity(false);
        gateDoor.moveTo = this.plugins.get('rexmovetoplugin').add(gateDoor, {
            speed: 10,
            rotateToTarget: false
        }).on('complete', function(){
            //gateDoor.setVisible(false);
            gateDoor.alpha = 0.2;
            //game.add.tween(gateDoor).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        });

        st = this.physics.add.staticGroup(); // static objects

        st.create(645, 102, 'gate');

        var player = this.physics.add.sprite(100, 450, 'dude');
        superBomba = this.physics.add.sprite(0, 285, 'bombx');
        superBomba.setScale(0.6);
        superBomba.x = 280;
        superBomba.y = 200;
        superBomba.body.setAllowGravity(false);
        superBomba2 = this.physics.add.sprite(0, 285, 'bombx');
        superBomba2.setScale(0.6);
        superBomba2.x = 99;
        superBomba2.y = 69;
        superBomba2.body.setAllowGravity(false);

        superBomba.setBounce(0.2);
        superBomba.setCollideWorldBounds(true);
        superBomba2.setBounce(0.2);
        superBomba2.setCollideWorldBounds(true);

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('bombx', {start: 0, end: 9}),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true
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

        var cuteSkulls = this.physics.add.group({
            key: 'cuteSkull',
            repeat: 0,
            setXY: {x: 20, y: 20, stepX: 5}
        });

        gKey = this.physics.add.image(400, -150, 'Gkey').setScale(0.5);
        gKey.body.setAllowGravity(false);

        var coin = 0;
        stars.children.iterate(function (child) {
                coin++;
                if (coin == 1) {
                    child.setBounceY(0);
                    child.y = 270;
                    child.x = 585;
                    child.body.setAllowGravity(false);
                } else if (coin == 2) {
                    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
                    child.y = 0;
                    child.x = 780;
                } else if (coin == 5) {
                    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
                    child.y = 0;
                    child.x = 750;
                } else if (coin == 6) {
                    child.setBounceY(0);
                    child.y = 201;
                    child.x = 310;
                    child.body.setAllowGravity(false);
                } else if (coin == 7) {
                    child.setBounceY(0);
                    child.y = 200;
                    child.x = 615;
                    child.body.setAllowGravity(false);
                } else if (coin == 3) {
                    child.setBounceY(0);
                    child.y = 200;
                    child.x = 70;
                    child.body.setAllowGravity(false);
                } else if (coin == 4) {
                    child.setBounceY(0);
                    child.y = 95;
                    child.x = 280;
                    child.body.setAllowGravity(false);
                } else if (coin == 8) {
                    child.setBounceY(0);
                    child.y = 255;
                    child.x = 35;
                    child.body.setAllowGravity(false);
                } else if (coin == 9) {
                    child.setBounceY(0);
                    child.y = 150;
                    child.x = 100;
                    child.body.setAllowGravity(false);
                } else if (coin == 10) {
                    child.setBounceY(0);
                    child.y = 65;
                    child.x = 280;
                    child.body.setAllowGravity(false);
                } else if (coin == 11) {
                    child.setBounceY(0);
                    child.y = 180;
                    child.x = 680;
                    child.body.setAllowGravity(false);
                } else if (coin == 12) {
                    child.setBounceY(0);
                    child.y = 180;
                    child.x = 550;
                    child.body.setAllowGravity(false);
                }
                else {
                    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
                }

            }
        );

        var cute = 0;
        cuteSkulls.children.iterate(function (child) {
                cute++;
                child.setScale(0.15);
                if (cute == 1) {
                    child.setBounceY(0);
                    child.y = 20;
                    child.x = 280;
                    child.body.setAllowGravity(false);
                }
                else {
                    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
                }

            }
        );

        this.scoreText = this.add.text(16, 16, 'score: 36', {
            fontSize: '32px',
            fill: '#000',
            fontFamily: 'Burbank Big Cd Bk'
        });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(cuteSkulls, platforms);
        this.physics.add.collider(superBomba, platforms);
        this.physics.add.collider(superBomba2, platforms);
        this.physics.add.collider(player, st);
        this.physics.add.overlap(player, stars, this.collectStar, null, this);
        this.physics.add.overlap(player, gKey, this.collectKey, null, this);
        this.physics.add.overlap(player, cuteSkulls, this.collectSkull, null, this);
        this.physics.add.overlap(player, superBomba, function () {
            // toDO check distance between player & superBomba
            var x1 = player.x,
                y1 = player.y,
                x2 = superBomba.x,
                y2 = superBomba.y;
            var dis = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (dis > 40) {
                return;
            }

            superBomba.anims.play('boom', true);
            var bombEx = this.sound.add('bombEx');
            if (health == 3) {
                bombEx.play();
            }
            else if (health == 2 && (thinkTime - Math.floor(new Date().getTime() / 1000) < -1)) {
                bombEx.play();
            }
            else if (health == 1 && (thinkTime - Math.floor(new Date().getTime() / 1000) < -1)) {
                bombEx.play();
            }
            heartProcessing();
            heartZoomFlag = 1;
            heartCounter = 0;
            // game over checking
            if (health == 0) {
                skullGameOver = this.add.image(400, 350, 'skullOver').setScale(0.1);
                skullFlag = 1;
            }
            setTimeout(function () {
                superBomba.disableBody(true, true);
            }, 1000);
        }, null, this);
        this.physics.add.overlap(player, superBomba2, function () {
            // toDO check distance between player & superBomba2
            var x1 = player.x,
                y1 = player.y,
                x2 = superBomba2.x,
                y2 = superBomba2.y;
            var dis = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (dis > 40) {
                return;
            }

            superBomba2.anims.play('boom', true);
            var bombEx = this.sound.add('bombEx');

            if (health == 3) {
                bombEx.play();
            }
            else if (health == 2 && (thinkTime - Math.floor(new Date().getTime() / 1000) < -1)) {
                bombEx.play();
            }
            else if (health == 1 && (thinkTime - Math.floor(new Date().getTime() / 1000) < -1)) {
                bombEx.play();
            }
            heartProcessing();
            heartZoomFlag = 1;
            heartCounter = 0;
            // game over checking
            if (health == 0) {
                skullGameOver = this.add.image(400, 350, 'skullOver').setScale(0.1);
                skullFlag = 1;
            }
            setTimeout(function () {
                superBomba2.disableBody(true, true);
            }, 1000);
        }, null, this);

        this.player = player;

        var button = this.add.image(800 - 16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();
        this.putHearts();

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

        this.scoreText.setText('Score: 36 / 48');

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

        youLose = this.add.image(400, 100, 'youLose');
        youLose.setVisible(false);

    },

    update: function () {

        var cursors = this.cursors;
        var player = this.player;

        if (cursors.left.isDown && skullFlag == 0 && gameBlock == false) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown && skullFlag == 0 && gameBlock == false) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down && skullFlag == 0 && gameBlock == false) {
            player.setVelocityY(-330);
        }

        // key movement
        if (gKeyMover == 0 && gKey.y > -150) {
            gKey.setY(gKey.y - 1);
            if (gKey.y == -150) {
                gKeyMover = 1;
                gKey.rotation = 0;
            }
        }
        else if (gKeyMover == 1 && gKey.y <= 115) {
            gKey.setY(gKey.y + 1);
            if (gKey.y == 115) gKeyMover = 2;
        }
        else if (gKeyMover == 2) {
            gKey.rotation += 0.05;
            gKeyCounter++;
            if (gKeyCounter == 130) {
                gKeyMover = 0;
                gKeyCounter = 0;
            }
        }

        // game over animation
        if (skullFlag == 1 && skullC < 1.0) {
            hahaFlag++;
            skullC += 0.006;
            skullGameOver = this.add.image(400, 350, 'skullOver').setScale(0.1);
            skullGameOver.setScale(skullC);
        } else if (skullFlag == 1 && skullC >= 1.0) {
            youLose.setVisible(true);
        }

        if (hahaFlag == 1) {
            musicL4.stop();
            var hahaha = this.sound.add('hahaha');
            hahaha.play();
            var rg = this.add.image(680, 565, 'restartGame').setScale(0.6);
            rg.setInteractive();
            rg.on('clicked',
                function (button) {
                    window.location.reload();
                }, this);
        }

        // hearts animation
        if (heartZoomFlag == 1 && heartCounter < 120) {
            if (heartZoom == 1 && heartZoomC <= 0.6) {
                heartZoomC += 0.005;
                heart1.setScale(heartZoomC);
                heart2.setScale(heartZoomC);
                heart3.setScale(heartZoomC)
            } else if (heartZoom == 2 && heartZoomC >= 0.5) {
                heartZoomC -= 0.005;
                heart1.setScale(heartZoomC);
                heart2.setScale(heartZoomC);
                heart3.setScale(heartZoomC)
            }

            if (heartZoomC > 0.6) {
                heartZoom = 2;
            } else if (heartZoomC < 0.5) {
                heartZoom = 1;
            }
            heartCounter++;
        }
    },

    collectKey: function (player, key) {
        key.visible = false;
        key.destroy();
        isKeyInThePocket = true;
        var keySound = this.sound.add('keySound');
        keySound.play();
        gateDoor.moveTo.moveTo(645, 78);
        gateOpen.play();
        st.children.iterate(function(item) {
            let asdasdfasf=1;
            item.destroy();
            //this.physics.world.removeCollider(item);
        });
    },

    collectStar: function (player, star) {
        var musicCoin = this.sound.add('collectCoin');
        musicCoin.play();
        star.disableBody(true, true);

        this.score += 1;
        this.scoreText.setText('Score: ' + this.score + ' / 48');
        if (this.score == 42) {
            strongSt += 25;
            healthSt += 25;
            speedSt += 25;
            this.add.image(400, 250, 'ryba1');
            this.add.image(400, 300, 'stats700').setScale(0.6);
            gameBlock = true;
            var nl = this.add.image(800, 675, 'nl').setScale(0.6);
            nl.setInteractive();
            nl.on('clicked',
                function (button) {
                    musicL4.stop();
                    button.setVisible(false);
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
    },

    // small bomb
    collectBombas: function (player, bomb) {
        bomb.disableBody(true, true);
        var bombEx = this.sound.add('bombEx');
        bombEx.play();
        heartProcessing();
    },
    collectSkull: function (player, cuteSkull) {
        cuteSkull.disableBody(true, true);
        skullFlag = 1;
        heartProcessingSkull();
    }
});
