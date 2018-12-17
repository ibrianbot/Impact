import Weltmeister, {WMLoader} from './weltmeister/weltmeister'
import {IG, IGConfig, System, SoundManager} from 'impact'
import EventedInput from './weltmeister/evented-input'
import Config from './weltmeister/config'


const wmSystem = new System(
  '#canvas', 1,
  Math.floor(Weltmeister.getMaxWidth() / Config.view.zoom),
  Math.floor(Weltmeister.getMaxHeight() / Config.view.zoom),
  Config.view.zoom
)

const igConfig = new IGConfig()
igConfig.system = wmSystem
igConfig.input = new EventedInput(wmSystem)
igConfig.soundManager = new SoundManager()

fetch(Config.api.glob)
  .then(r => r.json())
  .then(modules => {
    Weltmeister.entityModules = modules 
    IG.instance = new IG(igConfig, Weltmeister, WMLoader)
  })

