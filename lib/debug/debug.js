import DebugMenu from "./menu"
import DebuggableEntity from "./entities-panel"
import Entity from "../entity"
import {DebugPanel, DebugOption} from "./panel"

var DEBUG_ACTIVE = false

const createDebugger = instance => {

  // problem with the delayed loader... FIXME
  setTimeout(() => {
    const d = new DebugMenu(instance)


    // construct entities
    instance.game.entities = instance.game.entities.map(e => {
      return new Proxy(e, {
        // apply: function(target, thisArg, argumentsList){
        //   console.log("apply trap", target, thisArg, argumentsList)
        //   return target(argumentsList);
        // },
        // set: function(target, property, value, receiver){
        //   target[property] = value;
        //   return true
        // },
        get: function(target, prop, receiver){
          switch(prop){
            case "draw":
              DebuggableEntity.draw(e)
              break;
          }
          // TODO: static calls not trapped?
          if(prop == "checkPair"){
            console.log("checkPair")
          }
          return target[prop]
        },
      })
    })
    // add entity panel
    const panel = new DebugPanel("entities", "Entities")
    panel.addOption(new DebugOption("Checks & Collisions", DebuggableEntity, "_debugEnableChecks"))
    panel.addOption(new DebugOption('Show Collision Boxes', DebuggableEntity, '_debugShowBoxes'))
    panel.addOption(new DebugOption('Show Velocities', DebuggableEntity, '_debugShowVelocities'))
    panel.addOption(new DebugOption('Show Names & Targets', DebuggableEntity, '_debugShowNames'))
    d.addPanel(panel)





  }, 200);
}

const debuggable = (clazz, classname) => {

  console.log("Test", DEBUG_ACTIVE)
  
  if( DEBUG_ACTIVE ){
    switch(classname){
      case "Entity":
        break;
      default: 
        console.warn("tried to return debuggable class, nothing found for", classname)
        return clazz
    }
  } 
	return clazz
}



function setDebug(flag){
	DEBUG_ACTIVE = flag
}

export {
  createDebugger,
  debuggable,
  setDebug,
}