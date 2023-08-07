import Phaser from 'phaser'

import gameScene from './gameScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 900,
	height: 1600,
	zoom: 0.5,
	physics: {
		default: 'arcade',
	},
	scene: [gameScene],
}

export default new Phaser.Game(config)
