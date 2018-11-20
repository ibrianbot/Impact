import DebugMenu from "./menu"
import IG from "../impact"
import DebuggableEntity from "./entities-panel"
import {DebugPanel, DebugOption} from "./panel"


const createDebugger = instance => {
  const d = new DebugMenu(instance)

  // add entity panel
  const panel = new DebugPanel("entities", "Entities")
  panel.addOption(new DebugOption("Checks & Collisions", DebuggableEntity, "_debugEnableChecks"))
  panel.addOption(new DebugOption('Show Collision Boxes', DebuggableEntity, '_debugShowBoxes'))
  panel.addOption(new DebugOption('Show Velocities', DebuggableEntity, '_debugShowVelocities'))
  panel.addOption(new DebugOption('Show Names & Targets', DebuggableEntity, '_debugShowNames'))

  d.addPanel(panel)


}

function debuggable(clazz, classname){
  
  // TODO: IG is undefined
  if( IG.debugActive ){
    switch(classname){
      case "Entity":
        break;
      default: 
        console.warn("tried to return debuggable class, nothing found for", classname)
        return entitiyClass
    }
  } 
	return entitiyClass
}

export {
  createDebugger,
  debuggable,
}