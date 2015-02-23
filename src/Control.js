var WGLCUBE = WGLCUBE || {};

WGLCUBE.Control = function( DOMControl ) {
  console.log( "Init Cube" );
  this.DOMControl = DOMControl;

  var canvas  = document.createElement( "canvas" );
  var splash  = document.createElement( "img");
  var display = document.createElement( "div" );
  var steps   = document.createElement( "p" );
  var buttons = document.createElement( "div" );

  this.canvas = canvas;
  this.splash = splash;

  splash.className = "wglcube-splash";
  splash.src = "/img/ajax-loader.gif";

  canvas.className    = "wglcube";
  DOMControl.style.width  = DOMControl.getAttribute( "width" );
  DOMControl.style.height = DOMControl.getAttribute( "height" );

  display.className = "wglcube-display";
  display.appendChild( steps );

  steps.className = "wglcube-steps";
  steps.innerHTML = DOMControl.getAttribute( "data-steps" );

  buttons.className = "wglcube-buttons";
  var btnPrev = document.createElement( "button" );
  var btnPlay = document.createElement( "button" );
  var btnStop = document.createElement( "button" );
  var btnNext = document.createElement( "button" );
  btnPrev.className = "icon-previous"; // Change for icon-prev
  btnPlay.className = "icon-play";
  btnStop.className = "icon-stop";
  btnNext.className = "icon-next";
  buttons.appendChild( btnPrev );
  buttons.appendChild( btnPlay );
  buttons.appendChild( btnStop );
  buttons.appendChild( btnNext );

  DOMControl.appendChild( canvas );
  DOMControl.appendChild( splash );
  DOMControl.appendChild( display );
  DOMControl.appendChild( buttons );


  // Behaivor initialization
  this.scene    = new THREE.Scene();
  this.camera   = new THREE.PerspectiveCamera( 45, this.canvas.offsetWidth / ( this.canvas.offsetHeight ), 0.1, 1000 );

  this.ctrlContext = this.canvas.getContext( "2d" );
  var cubeSize = DOMControl.getAttribute( "data-size" );

  this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
  this.camera.updateProjectionMatrix();
  this.camera.position.addScalar( cubeSize * 1.4 );
  this.cube = new WGLCUBE.Cube( cubeSize, this.scene );

  this.toogleSplash();
};

WGLCUBE.Control.prototype.toogleSplash = function() {
  this.splash.style.display = this.splash.style.display === "none" ? "inline" : "none";
};

WGLCUBE.Control.prototype.update = function( renderer, camera ) {
  renderer.render( this.scene, this.camera );
  this.ctrlContext.drawImage( renderer.domElement, 0, 0 );
  //ctrlContext.drawImage( renderer.domElement.toDataURL(), 0, 0 );
};

/*
requestAnimationFrame( function() { runGL( renderer, camera, controls ); } );
renderer.render( scene, camera );
applySteps();
controls.update();
*/
