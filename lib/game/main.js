import Game from "../impact/game"
import Font from "../impact/font"
import IG from "../impact/impact"

class MyGame extends Game {
	
	// Load a font
	font = new Font( 'media/04b03.font.png' )
	
	constructor() {
		super()
		// Initialize your game here; bind keys etc.
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



IG.createInstance('#canvas', MyGame, 60, 320, 240, 2)



