import Entity from "../entity"
import IG from "../impact"

class DebuggableEntity extends Entity {

	colors = {
		names: '#fff',
		velocities: '#0f0',
		boxes: '#f00'
	}

	static _debugEnableChecks = true
	static _debugShowBoxes = false
	static _debugShowVelocities = false
	static _debugShowNames = false

	static checkPair( a, b ) {
		if( !DebuggableEntity._debugEnableChecks ) {
			return;
		}
		Entity.checkPair( a, b );
	}
	
	draw() {
		super.draw()
		
		// Collision Boxes
		if( DebuggableEntity._debugShowBoxes ) {
			IG.instance.system.context.strokeStyle = this.colors.boxes;
			IG.instance.system.context.lineWidth = 1.0;
			IG.instance.system.context.strokeRect(	
				IG.instance.system.getDrawPos(this.pos.x.round() - IG.instance.game.screen.x) - 0.5,
				IG.instance.system.getDrawPos(this.pos.y.round() - IG.instance.game.screen.y) - 0.5,
				this.size.x * IG.instance.system.scale,
				this.size.y * IG.instance.system.scale
			);
		}
		
		// Velocities
		if( DebuggableEntity._debugShowVelocities ) {
			var x = this.pos.x + this.size.x/2;
			var y = this.pos.y + this.size.y/2;
			
			this._debugDrawLine( this.colors.velocities, x, y, x + this.vel.x, y + this.vel.y );
		}
		
		// Names & Targets
		if( DebuggableEntity._debugShowNames ) {
			if( this.name ) {
				IG.instance.system.context.fillStyle = this.colors.names;
				IG.instance.system.context.fillText(
					this.name,
					IG.instance.system.getDrawPos(this.pos.x - IG.instance.game.screen.x), 
					IG.instance.system.getDrawPos(this.pos.y - IG.instance.game.screen.y)
				);
			}
			
			if( typeof(this.target) == 'object' ) {
				for( var t in this.target ) {
					var ent = IG.instance.game.getEntityByName( this.target[t] );
					if( ent ) {
						this._debugDrawLine( this.colors.names,
							this.pos.x + this.size.x/2, this.pos.y + this.size.y/2,
							ent.pos.x + ent.size.x/2, ent.pos.y + ent.size.y/2
						);
					}
				}
			}
		}
	}
	
	
	_debugDrawLine( color, sx, sy, dx, dy ) {
		IG.instance.system.context.strokeStyle = color;
		IG.instance.system.context.lineWidth = 1.0;

		IG.instance.system.context.beginPath();
		IG.instance.system.context.moveTo( 
			IG.instance.system.getDrawPos(sx - IG.instance.game.screen.x),
			IG.instance.system.getDrawPos(sy - IG.instance.game.screen.y)
		);
		IG.instance.system.context.lineTo( 
			IG.instance.system.getDrawPos(dx - IG.instance.game.screen.x),
			IG.instance.system.getDrawPos(dy - IG.instance.game.screen.y)
		);
		IG.instance.system.context.stroke();
		IG.instance.system.context.closePath();
	}
}


export default DebuggableEntity