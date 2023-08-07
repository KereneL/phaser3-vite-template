// @ts-nocheck
import Phaser from 'phaser'
import Ball from './Ball';

export default class gameScene extends Phaser.Scene {
	constructor() {
		super('game-scene')
		this.blocks = 1;

		this.ballRad = 25;
		this.sourcePosition;
		this.ball;
		this.aim;
		this.state = 'aim'
		this.newTurn = true;
		this.forceScale = 4000;
	}

	preload() {
		let {
			width,
			height
		} = this.sys.game.canvas;

		this.sourcePosition = {
			x: width / 2,
			y: height - this.ballRad,
		};
	}
	create() {


		this.ball = new Ball(this, this.sourcePosition.x, this.sourcePosition.y, 25)

		this.aim = this.add.line(0, 0, this.sourcePosition.x, this.sourcePosition.y, 0, 0);
		this.aim.setOrigin(0);
		this.aim.setStrokeStyle(10, 0xffffff);
		this.add.existing(this.aim);

		this.input.on('pointerdown', () => {
			if (this.state == 'aim') {
				let sX = this.sourcePosition.x;
				let sY = this.sourcePosition.y;
				let eX = this.input.mousePointer.x;
				let eY = this.input.mousePointer.y;

				let angle = Phaser.Math.Angle.Between(sX, sY, eX, eY)
				this.setAngleAndShoot(angle)
				return;
			} else if (this.state == 'wait-for-ball') {

				return;
			}
		});
		this.physics.world.on('worldbounds', (body, up, down) => {
			if (down) {
				this.setSourcePositionX(this.ball.graphic.body.x);
				this.setStateAim();
				this.ball.hitBottom();
			}
		});
	}
	update() {
		switch (this.state) {
			case 'aim': {
				let sX = this.sourcePosition.x;
				let sY = this.sourcePosition.y;
				let eX = this.input.mousePointer.x;
				let eY = this.input.mousePointer.y;

				this.aim.setTo(sX, sY, eX, eY);
				// let angle = Phaser.Math.Angle.Between(sX,sY, eX, eY);
				return;
			}
			case 'wait-for-ball': {
				return;
			}
		}
	}
	setSourcePositionX(x) {
		this.sourcePosition.x = x + this.ballRad;
		console.log(this.sourcePosition)
	}
	setStateAim() {
		this.state = 'aim';
		this.aim.setVisible(true);
	}
	setStateWaitForBall() {
		this.state = 'wait-for-ball'
		this.aim.setVisible(false);
	}
	setAngleAndShoot(angle) {
		this.shootAngle = angle;
		this.ball.active = true;
		this.shootBall();
	}
	shootBall() {
		let velocityX = this.forceScale * Math.cos(this.shootAngle);
		let velocityY = this.forceScale * Math.sin(this.shootAngle);

		this.ball.graphic.body.setVelocity(velocityX, velocityY);
		this.setStateWaitForBall();
	}

	waitForEndOfTurn() {
		if (this.blocks == 0) {
			console.log("WIN")
			return;
		}
	}
}