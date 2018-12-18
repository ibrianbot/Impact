import {IG, Debug} from 'impact'
import MyGame from './game/main'
import './entities.generated'


const instance = IG.createInstance('#canvas', MyGame, 60, 320, 240, 2)
Debug.createDebugger(instance)
