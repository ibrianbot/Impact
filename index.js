import {IG, Debug} from 'impact'
import MyGame from './game/main'


const instance = IG.createInstance('#canvas', MyGame, 60, 320, 240, 2)
Debug.createDebugger(instance)
