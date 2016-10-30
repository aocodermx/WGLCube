// Variable to store the HTML for the player controls.


/*
<div class='steps-container'>                             \
</div>                                                    \
<div class='controls'>                                    \
  <button class='icon-previous' id='prev'></button>       \
  <button class='icon-play'     id='playpause'></button>  \
  <button class='icon-stop'     id='stop'></button>       \
  <button class='icon-next'     id='next'></button>       \
  <button class='icon-next'     id='screenshot'></button> \
</div>                                                    \
";
*/

// The size for the cube
var wglcube_size = 2;

// Time for animating cube animations

var cubeSize  = 2;
var aCube     = [];
var toShow    = [];
var scene     = new THREE.Scene();
var stepsList   = [];
var currentStep = 0;

var isInstantMove = false;

var stopPressed = false;
var playPressed = false;
var nextPressed = false;
var prevPressed = false;

var attachFace = false;
var detachFace = false;

var cubeCore = null;
var tween = null;

params.render = function (  ) {

  var
    wglcube_player_init        = container.getAttribute( 'data-init'  ),
    wglcube_player_steps       = container.getAttribute( 'data-steps' ),
    layout_steps               = container.getElementsByClassName( 'steps-container' )[0],
    wglcube_player_steps_split = wglcube_player_steps.split ( ' ' );

    for ( var i = 0; i < wglcube_player_steps_split.length; i++ ) {
      var span_step       = document.createElement ( 'span' );
      span_step.innerHTML = wglcube_player_steps_split[i];
      span_step.className = 'step_' + i;

      layout_steps.appendChild ( span_step );
    }

  var container = document.getElementById( "rubik-cube" );
  var renderer  = window.WebGLRenderingContext ? new THREE.WebGLRenderer( { antialias:true, preserveDrawingBuffer: true } ) : new THREE.CanvasRenderer();
  var camera    = new THREE.PerspectiveCamera( 45, container.offsetWidth / ( container.offsetHeight ), 0.1, 1000 );
  var controls  = new THREE.OrbitControls( camera, renderer.domElement );

  controls.noPan = true;
  renderer.setClearColor( 0xD8D8D8, 1 );
  renderer.setSize( container.offsetWidth, container.offsetHeight );
  container.appendChild( renderer.domElement );

  // console.log(window);

  var size = wglcube_player_root.getAttribute( "data-size" );
  var rubikSteps = document.getElementById( "rubik-steps" );
  var stepString = wglcube_player_root.getAttribute( "data-steps" );
  cubeSize = size ? size : 3;
  rubikSteps.innerHTML = stepString;

  var toShowString = wglcube_player_root.getAttribute( "data-show" );
  if( toShowString !== null) {
    toShow = toShowString.split( "," );
  }

  renderCube();
  parseStepString( wglcube_player_root.getAttribute( "data-steps" ) );
  resizeControls();

  // Event listeners
  document.getElementById ( "rubik-cube" ).addEventListener( "resize", function ( ) {
    console.log ( "resized " );
    var container = document.getElementById( "rubik-cube" );
    var WIDTH  = container.offsetWidth, HEIGHT = container.offsetHeight;
    renderer.setSize( WIDTH, HEIGHT );
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    resizeControls();
  } );

  document.getElementById( "prev"      ).addEventListener ( "click", onPrevClick );
  document.getElementById( "playpause" ).addEventListener ( "click", onPlayClick );
  document.getElementById( "stop"      ).addEventListener ( "click", onStopClick );
  document.getElementById( "next"      ).addEventListener ( "click", onNextClick );

  camera.position.addScalar( cubeSize * 1.4 );
  runGL( renderer, camera, controls );
}

function onPrevClick ( ) {
  console.log ( "onPrevClick pressed" );
  prevPressed = true;
}

function onPlayClick (  ) {
  console.log ( "onPlayClick pressed" );
  var playButton = document.getElementById( "playpause" );
  if( playPressed ) {
    playButton.className = "icon-play";
    playPressed = !playPressed;
  } else {
    playPressed = true;
    playButton.className = "icon-pause";
    attachFace = true;
  }
}

function onStopClick ( ) {
  console.log ( "onStopClick pressed" );
  detachFace = true;
  stopPressed = true;
}

function onNextClick ( ) {
  console.log ( "onNextClick pressed" );
  if( !nextPressed ){
    nextPressed = true;
    attachFace = true;
    playPressed = true;
  }
}

function renderCube() {
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

  for ( var z = -cubeSize / 2 + 0.5; z < cubeSize / 2; z++ ) {
    for ( var x = -cubeSize / 2 + 0.5; x < cubeSize / 2; x++ ) {
      for ( var y = -cubeSize / 2 + 0.5; y < cubeSize / 2; y++ ) {
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

  var initString = document.getElementById ( 'wglcube_player' ).getAttribute( "data-init" );
  if( initString !== null){
    isInstantMove = true;
    parseStepString( initString );
  }
}

function resetCube() {
  console.log ( "Reseting cube" );
  for ( var i = 0, len = aCube.length; i < len; i++ )
    scene.remove( aCube[i] );
  aCube = [];
  renderCube( scene );
  parseStepString( document.getElementById ( 'wglcube_player' ).getAttribute( "data-steps" ) );
}

function attachFaceToCore( cubeCore, axis, layer ) {
  var level = layer - cubeSize / 2 + 0.5 - 1;

  scene.add( cubeCore );

  for ( var b = 0, len = aCube.length; b < len; b++ )
    if ( aCube[b].getWorldPosition()[axis] === level )
      THREE.SceneUtils.attach( aCube[b], scene, cubeCore );
}

function detachFaceFromCore( cubeCore, axis, layer ) {
  var level = layer - cubeSize / 2 + 0.5 - 1;

  for ( var b = 0, len = aCube.length; b < len; b++ )
    if ( aCube[b].getWorldPosition()[axis] === level )
      THREE.SceneUtils.detach( aCube[b], cubeCore, scene );

  scene.remove( cubeCore );
}

function parseStepString( steps ) {
  if ( steps === null )
    return -1;

  if ( steps.length === 0 )
    return -1;

  if ( steps === "*" ) // Randomize from WCA scrambler
    steps = "FUR";  // Steps from internet or algorithm

  stepsList = [];
  currentStep = 0;

  steps += " ";
  var pos = 0;
  var char = '';
  var tok = '';

  var STATE_START = 0;
  var STATE_LAYER = 1;
  var STATE_AXIS  = 2;
  var STATE_TIMES = 3;
  var STATE_DIRECTION = 4;
  var STATE_END = 5;

  while ( typeof char !== "undefined" ) {
    var step_axis = "";
    var step_layer = 1;
    var step_direction = 1;
    var step_times = 1;
    var STATE = STATE_START;

    while ( STATE !== STATE_END ) {
      char = steps[pos];
      //console.log("CHAR:",char, " STATE:", STATE);
      switch ( STATE ) {
        case STATE_START:
          if ( !/\s/g.test( char ) ) {
            STATE = STATE_LAYER;
            pos--;
          }
          if ( typeof char === "undefined" ) {
            STATE = STATE_END;
          }
          break;
        case STATE_LAYER:
          var result = parseInt( char );
          if ( isNaN ( result ) ) {
            STATE = STATE_AXIS;
            pos--;
            if ( tok !== "" ) {
              step_layer = parseInt( tok );
              tok = "";
            }
          } else {
            tok += char;
          }
          break;
        case STATE_AXIS:
          switch ( char ) {
            case "R":
              step_layer = cubeSize - step_layer + 1;
              step_direction *= -1;
            case "L":
              step_axis = "x";
              break;
            case "U":
              step_layer = cubeSize - step_layer + 1;
              step_direction *= -1;
            case "D":
              step_axis = "y";
              break;
            case "F":
              step_layer = cubeSize - step_layer + 1;
              step_direction *= -1;
            case "B":
              step_axis = "z";
              break;
            default:
              console.log( "FACE to move is incorrect" );
              console.log("Saliendo");
              return -1;
          }
          STATE = STATE_TIMES;
          break;
        case STATE_TIMES:
          var result2 = parseInt( char );
          if ( isNaN( result2 ) ) {
            STATE = STATE_DIRECTION;
            pos--;
            if ( tok !== "" ) {
              step_times = parseInt( tok );
              tok = "";
            }
          } else {
            tok += char;
          }
          break;
        case STATE_DIRECTION:
          if ( char === "\'" )
            step_direction *= -1;
          else
            pos--;
          if ( isInstantMove )
            applyInstantSteps ( step_axis, step_layer, step_times * step_direction * 90 * ( Math.PI / 180 ) );
          else
            stepsList.push( { layer: step_layer , axis: step_axis, times: step_times, radians: step_times * step_direction * 90 * ( Math.PI / 180 ) } );
          STATE = STATE_END;
          break;
        default:
          console.log( "Fatal error, state unknown." );
          return -1;
      }
      pos++;
    }
  }

  if(isInstantMove)
    isInstantMove = false;
  //else
  //  attachFace = true;
}

function applyInstantSteps(axis, layer, radians) {
  cubeCore = new THREE.Object3D();
  attachFaceToCore( cubeCore, axis, layer );
  switch ( axis ) {
    case "x":
      cubeCore.rotation.x += radians;
      break;
    case "y":
      cubeCore.rotation.y += radians;
      break;
    case "z":
      cubeCore.rotation.z += radians;
      break;
    }
  cubeCore.updateMatrixWorld();
  detachFaceFromCore( cubeCore, axis, layer );
}


function applySteps() {
  TWEEN.update();
  if ( attachFace && playPressed ) {
    cubeCore = new THREE.Object3D();
    attachFaceToCore( cubeCore, stepsList[currentStep].axis, stepsList[currentStep].layer );
    tween = new TWEEN.Tween( cubeCore.rotation );
    switch ( stepsList[currentStep].axis ) {
      case "x":
        tween.to( { x: stepsList[currentStep].radians }, STEP_TIME * stepsList[currentStep].times );
        break;
      case "y":
        tween.to( { y: stepsList[currentStep].radians }, STEP_TIME * stepsList[currentStep].times );
        break;
      case "z":
        tween.to( { z: stepsList[currentStep].radians }, STEP_TIME * stepsList[currentStep].times );
        break;
    }
    tween.onComplete(
      function() {
        cubeCore.updateMatrixWorld();
        detachFace = true;
      }
    );
    attachFace = false;
    tween.start();
  }
  if ( detachFace ) {
    detachFaceFromCore( cubeCore, stepsList[currentStep].axis, stepsList[currentStep].layer );
    detachFace = false;
    currentStep++;
    if ( currentStep < stepsList.length )
      attachFace = true;
    else {
      playPressed = false;
      resetCube();
      currentStep = 0;
      var playButton = document.getElementById( "playpause" );
      playButton.className = "icon-play";
    }

    if( nextPressed ) {
      nextPressed = false;
      attachFace = false;
    }

    if( stopPressed ) {
      stopPressed = false;
      resetCube();
      currentStep = 0;
      attachFace = false;
      playPressed = false;
      var playButton2 = document.getElementById( "playpause" );
      playButton2.className = "icon-play";
    }
  }
}

function runGL( renderer, camera, controls ) {
  requestAnimationFrame( function() { runGL( renderer, camera, controls ); } );
  renderer.render( scene, camera );
  applySteps();
  controls.update();
}

function resizeControls() {
  var rubikControl = document.getElementById( "rubik-controls" );
  var controlButtons = rubikControl.getElementsByTagName( "button" );
  var height = ( controlButtons[0].offsetHeight * 0.6 ) + "px";
  for ( var i = 0, len = controlButtons.length; i < len; i++ ) {
    controlButtons[i].style.fontSize = height;
  }
}
