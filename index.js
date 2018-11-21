import IG from "./lib/impact"
import MyGame from "./game/main"
import {createDebugger} from "./lib/debug/debug"


const instance = IG.createInstance('#canvas', MyGame, 60, 320, 240, 2)
createDebugger(instance)
