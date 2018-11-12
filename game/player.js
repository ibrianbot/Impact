import Entiy from "../lib/entity"
import {AnimationSheet} from "../lib/animation"

class Player extends Entiy {


  constructor(x, y, settings){
    super(x, y, settings)

    this.animSheet = new AnimationSheet("media/player.png", 16, 20)

    this.addAnim( 'idle', 0.1, [1,2] );

  }

  // update(){
  //   super.update()
  // }

}

export default Player