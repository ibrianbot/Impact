// ig.module(
// 	'impact.debug.debug'
// )
// .requires(	
// 	'impact.debug.entities-panel',
// 	'impact.debug.maps-panel',
// 	'impact.debug.graph-panel'
// )
// .defines(function(){ "use strict";
	
// /* Empty module to require all debug panels */

// });

class Debugger {


	constructor(system){

		Object.assign(system, {
			__run: system.run,
			run: () => {
				console.log("RUN")
				system.__run()
			}
		})

	}
}


export default Debugger