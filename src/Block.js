import Phaser from "phaser";

export default class Block extends Phaser.GameObjects.Container{
    static #allBlocks = [];
    static getAllBlocks(){
        return Block.#allBlocks;
    }
    constructor(scene,x,y,hp){
        super(scene,x,y)
        //x and y are the index of the row and colomn these blocks are, not world position
        this.hp = hp || 0;
        this.graphic = {};
    }
    hitBlock(){
        this.hp--;
        if (this.hp <= 0){
            this.kill();
        }
    }
    kill(){
        this.graphic.destroy();
        let indx = Block.#allBlocks.indexOf(this);
        Block.#allBlocks.splice(indx,1);
    }
}