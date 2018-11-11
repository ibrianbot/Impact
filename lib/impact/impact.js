import "./igUtils"
import System from "./system"
import Input from "./input"
import SoundManager, {Music} from "./sound"
import Loader from "./loader"

class IG {

	static game = null
	debug = null
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
		
		var loader = new Loader( this.system, gameClass, this.resources );
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


class MyGame {}

const igInstance = new IG('#canvas', MyGame, 60, 320, 240, 2)
