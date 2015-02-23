var WGLCUBE = WGLCUBE || {};

WGLCUBE.setup = function() {
  console.log( "Init render context, For each wglcube element create canvas element, render start position" );
  controls     = []; // Do var declaration for local scope
  var cubeControls = document.getElementsByClassName( "wglcube-control" );

  // this.renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer( { antialias:true, preserveDrawingBuffer: true } ) : new THREE.CanvasRenderercamera();
  var canvas = document.getElementById("canvas");
  this.renderer = new THREE.WebGLRenderer( { antialias:true, preserveDrawingBuffer: true, canvas: canvas } );
  this.renderer.setClearColor( 0x424242, 1 );

  var scene = new THREE.Scene();
  var cbe = new WGLCUBE.Cube(3, scene);
  var camera  = new THREE.PerspectiveCamera( 45, canvas.offsetWidth / ( canvas.offsetHeight ), 0.1, 1000 );
  var camControls  = new THREE.OrbitControls( camera, canvas );
  camera.position.addScalar( 3 * 1.4 );

  for ( var counter = 0, len = cubeControls.length; counter < len; counter++ ) {
    controls.push( new WGLCUBE.Control( cubeControls[counter] ) );
  }
  //for ( var counter2 = 0, len2 = controls.length; counter2 < len2; counter2++ ) {
  //  controls[counter2].initCube( this.renderer, camera );
  //}
  runGL( this.renderer, camera, camControls, scene );
};

id = 0;

function runGL( renderer, camera, camControls, scene ) {
  requestAnimationFrame( function() { runGL( renderer, camera, camControls, scene ); } );
  //renderer.render( scene, camera );
  camControls.update();
  //if ( id < 2 ) {
    for ( var counter2 = 0, len2 = controls.length; counter2 < len2; counter2++ ) {
      controls[counter2].update( renderer, camera );
    }
  //  id++;
  //}
}

// Add JQUERY Ready Function
window.onload = WGLCUBE.setup();
