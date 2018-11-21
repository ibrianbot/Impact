import IG from "../lib/impact"
import Game from "../lib/game"
import Font from "../lib/font"
import Input from "../lib/input"


const data = require("./levels/aaa.json")
import Player from "./player"

class MyGame extends Game {
	
	// Load a font
	font = new Font( '/media/04b03.font.png' )
	
	constructor() {
		super()
		// Initialize your game here; bind keys etc.

		IG.instance.input.bind(Input.KEY.RIGHT_ARROW, "right")
		IG.instance.input.bind(Input.KEY.LEFT_ARROW, "left")
		IG.instance.input.bind(Input.KEY.UP_ARROW, "jump")
		
		this.loadLevel(data)
		this.player = this.spawnEntity(Player, 20, 30)

		this.gravity = 10

	}
	
	update() {
		// Update all entities and backgroundMaps
		super.update()
		
		// Add your own, additional update code here
	}
	
	draw() {
		// Draw all entities and backgroundMaps
		super.draw()
		
		// Add your own drawing code here
		var x = IG.instance.system.width/2,
			y = IG.instance.system.height/2;
		
		this.font.draw( 'It Works!', x, y, Font.ALIGN.CENTER );
	}
}

export default MyGame

