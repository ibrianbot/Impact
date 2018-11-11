import "./igUtils"
import System from "./system"
import Input from "./input"
import SoundManager, {Music} from "./sound"

class IG {

	game = null
	debug= null
	version = '1.24'
	global = window
	resources = []
	ready = false
	baked = false
	nocache = ''
	ua = {}
	prefix = (window.ImpactPrefix || '')
	lib = 'lib/'
	anims = {}
	
	_current = null
	_loadQueue = []
	_waitForOnload = 0

	constructor(canvasId, gameClass, fps, width, height, scale, loaderClass){
		this.system = new System( canvasId, fps, width, height, scale || 1 );
		this.input = new Input(this.system);
		this.soundManager = new SoundManager();
		this.music = new Music();
		this.ready = true;
		
		var loader = new (loaderClass || this.Loader)( gameClass, this.resources );
		loader.load();
	}
	
	
	copy( object ) {
		if(
		   !object || typeof(object) != 'object' ||
		   object instanceof HTMLElement 
		) {
			return object;
		}
		else if( object instanceof Array ) {
			var c = [];
			for( var i = 0, l = object.length; i < l; i++) {
				c[i] = this.copy(object[i]);
			}
			return c;
		}
		else {
			var c = {};
			for( var i in object ) {
				c[i] = this.copy(object[i]);
			}
			return c;
		}
	}
	
	
	merge( original, extended ) {
		for( var key in extended ) {
			var ext = extended[key];
			if(
				typeof(ext) != 'object' ||
				ext instanceof HTMLElement ||
				ext === null
			) {
				original[key] = ext;
			}
			else {
				if( !original[key] || typeof(original[key]) != 'object' ) {
					original[key] = (ext instanceof Array) ? [] : {};
				}
				this.merge( original[key], ext );
			}
		}
		return original;
	}
	
	
	ksort( obj ) {
		if( !obj || typeof(obj) != 'object' ) {
			return [];
		}
		
		var keys = [], values = [];
		for( var i in obj ) {
			keys.push(i);
		}
		
		keys.sort();
		for( var i = 0; i < keys.length; i++ ) {
			values.push( obj[keys[i]] );
		}
		
		return values;
	}

	// This function normalizes getImageData to extract the real, actual
	// pixels from an image. The naive method recently failed on retina
	// devices with a backgingStoreRatio != 1
	getImagePixels( image, x, y, width, height ) {
		var canvas = this.$new('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		var ctx = canvas.getContext('2d');
		
		// Try to draw pixels as accurately as possible
		this.System.SCALE.CRISP(canvas, ctx);

		var ratio = this.getVendorAttribute( ctx, 'backingStorePixelRatio' ) || 1;
		this.normalizeVendorAttribute( ctx, 'getImageDataHD' );

		var realWidth = image.width / ratio,
			realHeight = image.height / ratio;

		canvas.width = Math.ceil( realWidth );
		canvas.height = Math.ceil( realHeight );

		ctx.drawImage( image, 0, 0, realWidth, realHeight );
		
		return (ratio === 1)
			? ctx.getImageData( x, y, width, height )
			: ctx.getImageDataHD( x, y, width, height );
	}

	
	// module: function( name ) {
	// 	if( this._current ) {
	// 		throw( "Module '"+this._current.name+"' defines nothing" );
	// 	}
	// 	if( this.modules[name] && this.modules[name].body ) {
	// 		throw( "Module '"+name+"' is already defined" );
	// 	}
		
	// 	this._current = {name: name, requires: [], loaded: false, body: null};
	// 	this.modules[name] = this._current;
	// 	this._loadQueue.push(this._current);
	// 	return ig;
	// },
	
	
	// requires: function() {
	// 	this._current.requires = Array.prototype.slice.call(arguments);
	// 	return ig;
	// },
	
	
	// defines: function( body ) {
	// 	this._current.body = body;
	// 	this._current = null;
	// 	this._initDOMReady();
	// },
	
	
	addResource( resource ) {
		this.resources.push( resource );
	}
	
	
	setNocache( set ) {
		this.nocache = set
			? '?' + Date.now()
			: '';
	}
	
	
	// Stubs for this.Debug
	log() {}
	assert( condition, msg ) {}
	show( name, number ) {}
	mark( msg, color ) {}
	
	
	// _loadScript: function( name, requiredFrom ) {
	// 	this.modules[name] = {name: name, requires:[], loaded: false, body: null};
	// 	this._waitForOnload++;
		
	// 	var path = this.prefix + this.lib + name.replace(/\./g, '/') + '.js' + this.nocache;
	// 	var script = this.$new('script');
	// 	script.type = 'text/javascript';
	// 	script.src = path;
	// 	script.onload = function() {
	// 		this._waitForOnload--;
	// 		this._execModules();
	// 	};
	// 	script.onerror = function() {
	// 		throw(
	// 			'Failed to load module '+name+' at ' + path + ' ' +
	// 			'required from ' + requiredFrom
	// 		);
	// 	};
	// 	this.$('head')[0].appendChild(script);
	// },

	
	// _execModules: function() {
	// 	var modulesLoaded = false;
	// 	for( var i = 0; i < this._loadQueue.length; i++ ) {
	// 		var m = this._loadQueue[i];
	// 		var dependenciesLoaded = true;
			
	// 		for( var j = 0; j < m.requires.length; j++ ) {
	// 			var name = m.requires[j];
	// 			if( !this.modules[name] ) {
	// 				dependenciesLoaded = false;
	// 				this._loadScript( name, m.name );
	// 			}
	// 			else if( !this.modules[name].loaded ) {
	// 				dependenciesLoaded = false;
	// 			}
	// 		}
			
	// 		if( dependenciesLoaded && m.body ) {
	// 			this._loadQueue.splice(i, 1);
	// 			m.loaded = true;
	// 			m.body();
	// 			modulesLoaded = true;
	// 			i--;
	// 		}
	// 	}
		
	// 	if( modulesLoaded ) {
	// 		this._execModules();
	// 	}
		
		// No modules executed, no more files to load but loadQueue not empty?
		// Must be some unresolved dependencies!
	// 	else if( !this.baked && this._waitForOnload == 0 && this._loadQueue.length != 0 ) {
	// 		var unresolved = [];
	// 		for( var i = 0; i < this._loadQueue.length; i++ ) {
				
	// 			// Which dependencies aren't loaded?
	// 			var unloaded = [];
	// 			var requires = this._loadQueue[i].requires;
	// 			for( var j = 0; j < requires.length; j++ ) {
	// 				var m = this.modules[ requires[j] ];
	// 				if( !m || !m.loaded ) {
	// 					unloaded.push( requires[j] );
	// 				}
	// 			}
	// 			unresolved.push( this._loadQueue[i].name + ' (requires: ' + unloaded.join(', ') + ')');
	// 		}
			
	// 		throw( 
	// 			"Unresolved (or circular?) dependencies. " +
	// 			"Most likely there's a name/path mismatch for one of the listed modules " +
	// 			"or a previous syntax error prevents a module from loading:\n" +
	// 			unresolved.join('\n')				
	// 		);
	// 	}
	// },
	
	
	// _DOMReady: function() {
	// 	if( !this.modules['dom.ready'].loaded ) {
	// 		if ( !document.body ) {
	// 			return setTimeout( this._DOMReady, 13 );
	// 		}
	// 		this.modules['dom.ready'].loaded = true;
	// 		this._waitForOnload--;
	// 		this._execModules();
	// 	}
	// 	return 0;
	// },
	
	
	_boot() {
		if( document.location.href.match(/\?nocache/) ) {
			this.setNocache( true );
		}
		
		// Probe user agent string
		this.ua.pixelRatio = window.devicePixelRatio || 1;
		this.ua.viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		this.ua.screen = {
			width: window.screen.availWidth * this.ua.pixelRatio,
			height: window.screen.availHeight * this.ua.pixelRatio
		};
		
		this.ua.iPhone = /iPhone|iPod/i.test(navigator.userAgent);
		this.ua.iPhone4 = (this.ua.iPhone && this.ua.pixelRatio == 2);
		this.ua.iPad = /iPad/i.test(navigator.userAgent);
		this.ua.android = /android/i.test(navigator.userAgent);
		this.ua.winPhone = /Windows Phone/i.test(navigator.userAgent);
		this.ua.iOS = this.ua.iPhone || this.ua.iPad;
		this.ua.mobile = this.ua.iOS || this.ua.android || this.ua.winPhone || /mobile/i.test(navigator.userAgent);
		this.ua.touchDevice = (('ontouchstart' in window) || (window.navigator.msMaxTouchPoints));
	}
	
	
	// _initDOMReady: function() {
	// 	if( this.modules['dom.ready'] ) {
	// 		this._execModules();
	// 		return;
	// 	}
		
	// 	this._boot();
		
		
	// 	this.modules['dom.ready'] = { requires: [], loaded: false, body: null };
	// 	this._waitForOnload++;
	// 	if ( document.readyState === 'complete' ) {
	// 		this._DOMReady();
	// 	}
	// 	else {
	// 		document.addEventListener( 'DOMContentLoaded', this._DOMReady, false );
	// 		window.addEventListener( 'load', this._DOMReady, false );
	// 	}
	// }

	setAnimation( callback, element ) {
		var current = next++;
		this.anims[current] = true;

		var animate = function() {
			if( !anims[current] ) { return; } // deleted?
			window.requestAnimationFrame( animate, element );
			callback();
		};
		window.requestAnimationFrame( animate, element );
		return current;
	}

	clearAnimation( id ) {
		delete anims[id];
	}
}


// -----------------------------------------------------------------------------
// Provide this.setAnimation and this.clearAnimation as a compatible way to use
// requestAnimationFrame if available or setInterval otherwise


// Merge the ImpactMixin - if present - into the 'ig' namespace. This gives other
// code the chance to modify 'ig' before it's doing any work.
if( window.ImpactMixin ) {
	this.merge(ig, window.ImpactMixin);
}


const MyGame =  {}

const igInstance = new IG('#canvas', MyGame, 60, 320, 240, 2)
