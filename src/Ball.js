import Phaser from "phaser";

export default class Ball extends Phaser.GameObjects.Container {
	static #allBalls = [];
	static getAllBalls() {
		return Ball.#allBalls;
	}
	constructor(scene, x, y, radius) {
		super(scene, x, y)
		this.radius = radius || 25;
		this.graphic = {};
		this.active = false;

		this.graphic = scene.add.circle(x, y, this.radius, 0xAAAAAA);
		this.graphic.setOrigin(0);

		scene.physics.add.existing(this.graphic, false);

		this.graphic.body.setBounce(1);
		this.graphic.body.setCollideWorldBounds(true, 1, 1)
		this.graphic.body.collideWorldBounds = true;
		this.graphic.body.onWorldBounds = true;

		return this;
	}
	create() {

	}
	hitBottom(sourcePosition) {
		this.resetVelocity();
		this.graphic.setPosition(sourcePosition.x-this.radius,sourcePosition.y)
		this.active = false;
	}
	resetVelocity() {
		this.graphic.body.setVelocity(0, 0);
	}
	kill() {
		this.graphic.destroy();
		let indx = Ball.#allBalls.indexOf(this);
		Ball.#allBalls.splice(indx, 1);
	}
}