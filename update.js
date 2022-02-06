function update() {

	if (gameOver) {
		return;
	}
	//pad connection
	this.input.gamepad.once('connected', function (pad) {
		gamepad = pad;
	}, this);

	var specialButton

	if (gamepad != null) {
		goLeft = gamepad.left
		goRight = gamepad.right
		goUp = gamepad.up
		specialButton = gamepad.X
	}

	if (gamepad == null) {
		goRight = cursors.right.isDown
		goLeft = cursors.left.isDown
		goUp = 	cursors.up.isDown
		specialButton = cursors.space.isDown
	}

	if (!(goLeft || goLeft || goRight)) {
		player.setVelocityX(0);
	/* 	player.anims.play('turn'); */
	}

	if (goLeft == true) {
		player.setVelocityX(-200); //alors vitesse négative en X
	/* 	player.anims.play('left', true); */
		if (goUp == true && player.body.touching.down) {
			player.setVelocityY(-310);
			saut = 1;
		}
		if (specialButton) {
			action(this.time);
		}
	}
	else if (goRight == true) {
		player.setVelocityX(200); //alors vitesse positive en X
		/* player.anims.play('right', true); */
		if (goUp == true && player.body.touching.down) {
			player.setVelocityY(-310);
			saut = 1;
		}
		if (specialButton) {
			action(this.time);
		}
	}
	else if (goUp == true && player.body.touching.down) {
		player.setVelocityY(-310);
		saut = 1;
	}
	else if (specialButton) {
		action(this.time);
	}
	else if (goLeft == false) {
		player.setVelocityX(0);
		/* player.anims.play('turn'); */
	}
	else if (goRight == false) {
		player.setVelocityX(0);
		/* player.anims.play('turn'); */
	}
	else if (goUp == false) {
		player.setVelocityY(0);
		/* player.anims.play('turn'); */
	}
	
	if (enemy.isDead) {
		enemy.destroy()
	} else
		this.physics.moveToObject(enemy, player, 50)

}

function moveEnemy() {
	if (enemy.x < player.x)
		enemy.setVelocityX(50)
	if (enemy.x > player.x)
		enemy.setVelocityX(-50)
	if (enemy.y < player.y)
		enemy.setVelocityY(50)
	if (enemy.y > player.y)
		enemy.setVelocityY(-50)
}

function action(time) {
	if (saut == 1 && !(player.body.touching.down)) {
		player.setVelocityY(-310);
		saut = 2;
	}
	else if (special == true && player.body.touching.down && goRight == true) {
		player.setVelocityX(1500);
		special = false
		time.addEvent({
			delay: 2000,
			callback: () => {
				special = true;
			},
			loop: false
		})
	}
	else if (special == true && player.body.touching.down && goLeft == true) {
		player.setVelocityX(-1500);
		special = false
		time.addEvent({
			delay: 2000,
			callback: () => {
				special = true;
			},
			loop: false
		})
	}
	else if (special == true && saut != 1) {
		//attaque
	}
}
