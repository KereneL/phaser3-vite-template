// @ts-nocheck
import Phaser from 'phaser'
import Ball from './Ball';

export default class gameScene extends Phaser.Scene {
	constructor() {
		super('game-scene')
		this.viewportSize;
		this.blocks = 1;			// How many blocks (not yet implemented) are on sceen, when 0 - you win

		this.ballRad = 25;			// ball radius for init
		this.sourcePosition;		// Position of ball when aiming, default is bottom-center (set in preload())
		this.ball;					// Ball object reference
		//this.aim;					// Obsolete
		this.aimLineGroup = new Phaser.GameObjects.Group(this);
		this.state = 'aim'			// Possible States: aim, wait-for-ball, lose, win;
		this.newTurn = true;
		this.forceScale = 1000;		// Shoot Speed
		this.angleHandicap = 25; 	// Degrees (not radians)
		this.aimLength = 12000;		// Pixels?
	}
	preload() {
		this.viewportSize = {
			width: this.sys.game.canvas.width,
			height: this.sys.game.canvas.height,
		};
		this.sourcePosition = {
			x: this.viewportSize.width / 2,
			y: this.viewportSize.height - 3*this.ballRad,
		};
	}
	create() {
		this.ball = new Ball(this, this.sourcePosition.x, this.sourcePosition.y, 25)
		this.physics.world.on('worldbounds', (body, up, down) => {
			if (down) {
				this.setStateAim();
			}
		});
		this.input.on('pointerup', () => {
			if (this.state == 'aim') {
				this.setAngleAndShoot(this.shootAngle)
				return;
			} else if (this.state == 'wait-for-ball') {
				this.setStateAim();
				return;
			}
		});
		this.setStateAim();
	}
	update() {
		if (this.state == 'aim') {
			this.aimLine();
			return;
		}
	}
	setStateAim() {
		this.resetBall();
		this.state = 'aim';
	}
	aimLine() {
		this.aimLineGroup.getChildren().forEach((line) => {
			line.destroy();
		});
		let sourceX = this.sourcePosition.x;
		let sourceY = this.sourcePosition.y;
		let pointerX = this.input.mousePointer.x;
		let pointerY = this.input.mousePointer.y;

		let remainingLength = this.aimLength;
		let angleRad = Phaser.Math.Angle.Between(sourceX, sourceY, pointerX, pointerY) * -1;
		let angleDeg = Phaser.Math.RadToDeg(angleRad);

		let targetX = sourceX + remainingLength * Math.cos(angleRad)
		let targetY = sourceY + remainingLength * Math.sin(angleRad);

		this.aimSegments(sourceX, sourceY, remainingLength, angleRad)

		if (angleDeg >= 0 + this.angleHandicap && angleDeg <= 180 - this.angleHandicap) {
			this.aimLineGroup.getChildren().forEach((line) => {
				line.setStrokeStyle(1, 0xffffff, 1);
			});
			this.shootAngle = Phaser.Math.Angle.Between(sourceX, sourceY, targetX, targetY) * -1;
		} else {
			this.aimLineGroup.getChildren().forEach((line) => {
				line.setStrokeStyle(1, 0xff0000, 1);
			});
		}
	}
	aimSegments(sourceX, sourceY, remLength, angleRad) {
		if (remLength <= 0) return;
		
		let targetX = sourceX + remLength * Math.cos(angleRad);
		let targetY = sourceY - remLength * Math.sin(angleRad);
		if (targetX < (this.ball.radius) || targetX > (this.viewportSize.width - this.ball.radius)) {

			if (angleRad < Math.PI / 2) {
				targetX = this.viewportSize.width - this.ball.radius;
				targetY = sourceY - Math.abs(sourceX - targetX) * Math.tan(angleRad);

			} else if (angleRad > Math.PI / 2) {
				targetX = this.ball.radius;
				targetY = sourceY - Math.abs(sourceX - targetX) * Math.tan(Math.PI - angleRad);

			}
			
			let reflectedAngle = Math.PI - angleRad;
			remLength -= Phaser.Math.Distance.Between(sourceX, sourceY, targetX, targetY);
			this.aimSegments(targetX, targetY, remLength, reflectedAngle)
		}
		let lineSegment = this.newLineSegement(sourceX, sourceY, targetX, targetY)
		this.aimLineGroup.add(lineSegment, true)
	}
	newLineSegement(sourceX, sourceY, targetX, targetY) {
		let lineSegment = this.add.line(0, 0, sourceX, sourceY, targetX, targetY);
		lineSegment.setDepth(-1);
		lineSegment.setOrigin(0);
		lineSegment.setLineWidth(1);
		return lineSegment;
	}
	resetBall(){
		let x = this.ball.graphic.body.x;
		this.setSourcePositionX(x);
		this.setSourcePositionY();
		this.ball.hitBottom(this.sourcePosition);
	}
	setSourcePositionX(x) {
		this.sourcePosition.x = x ;
	}
	setSourcePositionY() {
		this.sourcePosition.y = this.viewportSize.height - this.ball.radius;
	}
	setStateWaitForBall() {
		this.state = 'wait-for-ball'
		// eslint-disable-next-line no-unused-vars
		this.aimLineGroup.getChildren().forEach((line) => {
			line.setVisible(false)
		});
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