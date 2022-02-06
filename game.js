var config = {
	type: Phaser.AUTO,
	width: 1600,
	height: 900,
	input: {
		gamepad: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 500
			},
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};
new Phaser.Game(config);

function preload() {
	this.load.image('star', 'assets/star.png');
	this.load.image('ground', 'assets/platform.png');
	this.load.image('level', 'assets/level.png');
	this.load.image('bomb', 'assets/bomb.png');
	this.load.image('heart', 'assets/heart.png');
	this.load.image('powerUp', 'assets/powerUp.png');
	this.load.image('enemy', 'assets/enemy.png');
	this.load.spritesheet('perso', 'assets/perso.png', {
		frameWidth: 32,
		frameHeight: 48
	});
}
var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;
var gameOver = false;
var saut = 0;

var gamepad;
var camera;
var goLeft = false;
var goRight = false;
var goDown = false;
var goUp = false;
var special = true;

function create() {
	this.add.image(400, 300, 'level');

	heartBar = this.physics.add.staticGroup({
		key: 'heart',
		repeat: 2,
		setXY: {
			x: 16,
			y: 16,
			stepX: 32,
		}
	});
	platforms = this.physics.add.staticGroup();
	platforms.create(400, 568, 'ground').setScale(2).refreshBody();
	platforms.create(600, 400, 'ground');
	platforms.create(50, 260, 'ground');
	platforms.create(750, 220, 'ground');
	platforms.create(900, 900, 'ground')
	platforms.create(1200, 900, 'ground')


	enemy = this.physics.add.sprite(400, 400, 'enemy');
	enemy.setBounce(0.2);
	enemy.setCollideWorldBounds(true);
	this.physics.add.collider(enemy, platforms);

	powerUp = this.physics.add.sprite(600, 200, 'powerUp');
	powerUp.setBounce(0.2);
	powerUp.setCollideWorldBounds(true);
	this.physics.add.collider(powerUp, platforms);

	powerUpHealth = this.physics.add.sprite(1100, 500, 'heart');
	powerUpHealth.setBounce(0.2);
	powerUpHealth.setCollideWorldBounds(true);
	this.physics.add.collider(powerUpHealth, platforms);


	player = this.physics.add.sprite(100, 450, 'perso');
	player.setBounce(0.2);
	player.setCollideWorldBounds(true);
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(player, enemy, hitEnemy, null, this);
	this.physics.add.collider(player, powerUp, hitPowerUpKill, null, this);
	this.physics.add.collider(player, powerUpHealth, hitPowerUpHealth, null, this);
	/* this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('perso', {
			start: 0,
			end: 3
		}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'turn',
		frames: [{
			key: 'perso',
			frame: 4
		}],
		frameRate: 20
	});
	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('perso', {
			start: 5,
			end: 8
		}),
		frameRate: 10,
		repeat: -1
	}); */


	cursors = this.input.keyboard.createCursorKeys();


	this.cameras.main.setBounds(0, 0, 6000, 500);
	this.cameras.main.setSize(1600, 900);
	this.cameras.main.startFollow(player);



}

function collectStar(player, star) {
	star.disableBody(true, true); // l’étoile disparaît
	score += 10; //augmente le score de 10
	scoreText.setText('Score: ' + score); //met à jour l’affichage du score


	if (stars.countActive(true) === 0) { // si toutes les étoiles sont prises
		stars.children.iterate(function (child) {
			child.enableBody(true, child.x, 0, true, true);
		}); // on les affiche toutes de nouveau
		var x = (player.x < 400) ? Phaser.Math.Between(400, 800) :
			Phaser.Math.Between(0, 400);
		// si le perso est à gauche de l’écran, on met une bombe à droite
		// si non, on la met à gauche de l’écran
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		bomb.allowGravity = false; //elle n’est pas soumise à la gravité
	}
}

function removeLife() {
	a = heartBar.getChildren()
	if (a.length > 0)
		a[a.length - 1].destroy()
}

var nextDamage = true
var enemyActive = false
var powerUpActive = false

function hitPowerUpHealth(player, powerUp) {
	this.physics.pause();
	
	console.log(powerUp.y + powerUp.width/2)
	console.log(player.y)
	
	a = heartBar.getChildren()
	heartBar.create(a.length * 32 + 16, 16, 'heart')

	powerUp.destroy()
	this.physics.resume();
}

function hitPowerUpKill(player, powerUp) {
	this.physics.pause();

	player.setTint(0x00FF00);
	powerUpActive = true
	this.time.addEvent({
		delay: 5000,
		callback: () => {
			player.setTint(0xFFFFFF);
			powerUpActive = false
		},
		loop: false
	})

	powerUp.destroy()
	this.physics.resume();
}


function hitEnemy(player, enemy) {
	this.physics.pause();

	if (powerUpActive) {
		enemy.isDead = true
		this.physics.resume();
		return
	}

	if (player.x > enemy.x - enemy.width/2 && player.x < enemy.x + enemy.width/2 && enemy.y > player.y) {
		enemy.isDead = true
	} else {
		if (nextDamage) {
			nextDamage = false
			a = heartBar.getChildren()
			if (a.length > 1)
				a[a.length - 1].destroy()
			else {
				player.setTint(0xff0000);
				gameOver = true;
				return
			}
			console.log("Yes")
			player.setTint(0x222244);
			this.time.addEvent({
				delay: 1000,
				callback: () => {
					player.setTint(0xFFFFFF);
					nextDamage = true;
				},
				loop: false
			})
		}
	}
	this.physics.resume();
}