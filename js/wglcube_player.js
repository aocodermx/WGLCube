var WGL = ( function ( params ) {



  /*
   *  Object to represent the 3D Cube, exposing an API to manipulate the cube.
   *  The cube can be in either two modes for better performance:
   *
   *  * Preview mode:
   *        In this mode a simple preview is presented until the user interact
   *        with the control, at this point the cube change it's mode to
   *        interactive.
   *
   *  * Interactive mode:
   *        In this mode the 3D code is executed to render the cube, so the user
   *        can now interact with the cube.
   */
  params.Cube = function ( container ) {
    var self = this; // To avoid this confusion in callback functions.

    this.container = container;

    // TODO: Change to init function
    this.size      = this.container.getAttribute ( 'data-size'  );

    var STEP_TIME = 500;
    var aCube     = [];
    var toShow    = [];
    var scene     = new THREE.Scene();
    var isInstantMove = false;
    var attachFace = false;
    var detachFace = false;
    var animationFrameId = null;

    var renderer = null;
    var camera   = null;
    var controls = null;
    var cube = null

    var cubeCore = null;
    var tween = null;


    /*
     *  Function to draw the default HTML layout to display before load the WebGL
     *  Cube, other initialization code goes here.
     */
    this.init = function ( ) {
      this.container.addEventListener ( 'click', this.to_interactive_mode );
      this.container.innerHTML = "        \
        <div class='preview'>             \
          <div class='square s1'></div>   \
          <div class='square s2'></div>   \
          <div class='square s3'></div>   \
          <div class='square s4'></div>   \
        </div>                            \
      <div class='cube'>                  \
      </div>                              \
      ";
    };


    /*
     *  Function to change from preview mode to interactive mode.
     */
    this.to_interactive_mode = function ( ) {
      console.log ( "Changing to interactive mode." );
      var preview   = self.container.getElementsByClassName ( 'preview' )[0];
      preview.style = 'display:none;';

      // Load WGL
      init3d ( );

      self.container.removeEventListener ( 'click', self.to_interactive_mode );
    };


    /*
     *  Function to change from interactive mode to preview mode.
     */
    this.to_preview_mode = function ( ) {
      console.log ( "Changing to preview mode." );
      var preview  = self.container.getElementsByClassName ( 'preview' )[0];
      preview.style  = 'display:block;';

      cancelAnimationFrame ( animationFrameId );
      // TODO: Update threejs version used.
      // renderer.context.canvas.loseContext ( );
      // renderer.forceContextLoss ( );
      renderer = null;
      camera   = null;
      controls = null;
      while ( cube.lastChild ) cube.removeChild( cube.lastChild );

      self.container.addEventListener ( 'click', self.to_interactive_mode );
    };


    /*
     *  Function to initialize WebGL variables and environment.
     */
    function init3d ( ) {
      console.log ( 'Rendering cube with THREEJS' );

      cube      = self.container.getElementsByClassName ( "cube" )[0];
      renderer  = window.WebGLRenderingContext ? new THREE.WebGLRenderer ( { antialias:true, preserveDrawingBuffer: true } ) : new THREE.CanvasRenderer ( );
      camera    = new THREE.PerspectiveCamera ( 45, cube.offsetWidth / ( cube.offsetHeight ), 0.1, 1000 );
      controls  = new THREE.OrbitControls ( camera, renderer.domElement );

      controls.noPan = true;
      renderer.setClearColor ( 0xD8D8D8, 1 );
      renderer.setSize       ( cube.offsetWidth, cube.offsetHeight );
      cube.appendChild       ( renderer.domElement );

      /*  Move to init function
      var toShowString = self.container.getAttribute ( "data-show" );
      if ( toShowString !== null) {
        toShow = toShowString.split( "," );
      }
      */

      renderCube ( );

      // Move this functin to WGL.Player.
      // parseStepString( this.container.getAttribute( "data-steps" ) );
      // this.resizeControls ( );

      // Event listeners
      cube.addEventListener( "resize", function ( ) {
        console.log ( "resized " );
        var WIDTH  = this.offsetWidth, HEIGHT = this.offsetHeight;
        renderer.setSize( WIDTH, HEIGHT );
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix ( );
        // this.resizeControls ( );
      } );

      /* Move this to WGL.Player.
      document.getElementById( "prev"      ).addEventListener ( "click", onPrevClick );
      document.getElementById( "playpause" ).addEventListener ( "click", onPlayClick );
      document.getElementById( "stop"      ).addEventListener ( "click", onStopClick );
      document.getElementById( "next"      ).addEventListener ( "click", onNextClick );
      */

      camera.position.addScalar ( self.size * 1.4 );
      wglLoop ( renderer, camera, controls );
    };


    /*
     *  Function to draw the cube in the WebGL environment.
     */
    function renderCube ( ) {
      var geometry = new THREE.BoxGeometry( 0.98, 0.98, 0.98 );
      var material = new THREE.MeshFaceMaterial( [
        new THREE.MeshBasicMaterial( { color:0xFF6600 } ), // Right  -> Orange
        new THREE.MeshBasicMaterial( { color:0xFF0000 } ), // Left   -> Red
        new THREE.MeshBasicMaterial( { color:0x00FF00 } ), // Top    -> Green
        new THREE.MeshBasicMaterial( { color:0x0000FF } ), // Bottom -> Blue
        new THREE.MeshBasicMaterial( { color:0xFFFFFF } ), // Front  -> White
        new THREE.MeshBasicMaterial( { color:0xFFFF00 } )  // Back   -> Yellow
        ] );
      var blackMaterial = new THREE.MeshFaceMaterial( [
        new THREE.MeshBasicMaterial( { color:0x848484 } ), // Right  -> Orange
        new THREE.MeshBasicMaterial( { color:0x848484 } ), // Left   -> Red
        new THREE.MeshBasicMaterial( { color:0x848484 } ), // Top    -> Green
        new THREE.MeshBasicMaterial( { color:0x848484 } ), // Bottom -> Blue
        new THREE.MeshBasicMaterial( { color:0x848484 } ), // Front  -> White
        new THREE.MeshBasicMaterial( { color:0x848484 } )  // Back   -> Yellow
        ] );

      for ( var z = -self.size / 2 + 0.5; z < self.size / 2; z++ ) {
        for ( var x = -self.size / 2 + 0.5; x < self.size / 2; x++ ) {
          for ( var y = -self.size / 2 + 0.5; y < self.size / 2; y++ ) {
            var piece = null;
            if( toShow.length !== 0 && toShow.indexOf( aCube.length.toString() ) < 0 ){
              piece = new THREE.Mesh( geometry, blackMaterial );
            } else {
              piece = new THREE.Mesh( geometry, material );
            }
            piece.position.set( x, y, z );
            aCube.push( piece );
            scene.add( piece );
          }
        }
      }

      /* Move to WGL.Player
      var initString = document.getElementById ( 'wglcube_player' ).getAttribute( "data-init" );
      if( initString !== null){
        isInstantMove = true;
        parseStepString( initString );
      }
      */
    };

    /*
     *  Render loop
     */
    function wglLoop ( renderer, camera, controls ) {
      animationFrameId = requestAnimationFrame( function() { wglLoop( renderer, camera, controls ); } );
      renderer.render( scene, camera );
      // applySteps();
      controls.update();
    };



  };

  return params;
}( WGL || {} ) );

var cube1 = new WGL.Cube ( document.getElementsByClassName( 'wglcube' )[0] );
cube1.init();
