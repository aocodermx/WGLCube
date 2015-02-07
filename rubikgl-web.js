/*
var WGLCUBE = WGLCUBE || (function(){
  return {
    REVISION: 1
  };
})();

WGLCUBE.Cube = function(){
  var size = 3;
  var array = new Array();
};
*/
var STEP_TIME = 400;
var cubeSize  = 3;
var cubeArray = [];
var scene     = new THREE.Scene();
var movList   = [];
var movPos = 0;

var attachFace = false;
var detachFace = false;
var inMov = false;

var core = "";
var tween = "";

function setupWebGL() {
  var renderer  = window.WebGLRenderingContext ? new THREE.WebGLRenderer( { antialias:true } ) : new THREE.CanvasRenderercamera();
  var container = document.getElementById( "rubik-cube" );
  var camera    = new THREE.PerspectiveCamera( 45, container.offsetWidth / ( container.offsetHeight ), 0.1, 1000 );
  var controls  = new THREE.OrbitControls( camera, renderer.domElement );

  window.addEventListener( "resize", function() {
    var WIDTH  = container.offsetWidth;
    var HEIGHT = container.offsetHeight;
    renderer.setSize( WIDTH, HEIGHT );
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    adjustControls();
  } );

  camera.position.addScalar( cubeSize * 1.4 );
  renderer.setClearColor( 0xDDDDDD, 1 );
  renderer.setSize( container.offsetWidth, container.offsetHeight );
  container.appendChild( renderer.domElement );
  controls.noPan = true;

  makeCube( scene );
  adjustControls();

  if ( window.self != window.top && window.frameElement.tagName == "IFRAME" ) {
    var initString = window.frameElement.getAttribute( "data-start" );
    var stepString = window.frameElement.getAttribute( "data-steps" );
    var rubikSteps = document.getElementById( "rubik-steps" );
    rubikSteps.innerHTML = stepString;
    parseSteps( initString );
  } else {
    // On Top
  }

  runGL( renderer, camera, controls );
}

var buttonPlay = document.getElementById( "playpause" );
buttonPlay.onclick = function() {
  if ( movList.length !== 0 ) {
    animate = true;
  } else {
    console.log( "No movs added" );
  }
};

function adjustControls() {
  var rubikControl = document.getElementById( "rubik-control" );
  var controlButtons = rubikControl.getElementsByTagName( "button" );
  var height = ( controlButtons[0].offsetHeight * 0.6 ) + "px";
  for ( var i = 0; i < controlButtons.length; i++ ) {
    controlButtons[i].style.fontSize = height;
  }
}

function makeCube( scene ) {
  var geometry = new THREE.BoxGeometry( 0.98, 0.98, 0.98 );
  var material = new THREE.MeshFaceMaterial( [
    new THREE.MeshBasicMaterial( { color:0xFF6600 } ), // Right  -> Orange
    new THREE.MeshBasicMaterial( { color:0xFF0000 } ), // Left   -> Red
    new THREE.MeshBasicMaterial( { color:0x00FF00 } ), // Top    -> Green
    new THREE.MeshBasicMaterial( { color:0x0000FF } ), // Bottom -> Blue
    new THREE.MeshBasicMaterial( { color:0xFFFFFF } ), // Front  -> White
    new THREE.MeshBasicMaterial( { color:0xFFFF00 } )  // Back   -> Yellow
    ] );

  for ( var z = -cubeSize / 2 + 0.5; z < cubeSize / 2; z++ ) {
    for ( var x = -cubeSize / 2 + 0.5; x < cubeSize / 2; x++ ) {
      for ( var y = -cubeSize / 2 + 0.5; y < cubeSize / 2; y++ ) {
        var piece = new THREE.Mesh( geometry, material );
        piece.position.set( x, y, z );
        cubeArray.push( piece );
        scene.add( piece );
      }
    }
  }
}

function holdFace( core, axis, layer ) {
  var level = layer - cubeSize / 2 + 0.5 - 1;

  scene.add( core );

  for ( var b = 0; b < cubeArray.length; b++ )
    if ( Math.round( cubeArray[b].getWorldPosition()[axis] ) === level )
      THREE.SceneUtils.attach( cubeArray[b], scene, core );
}

function releaseFace( core, axis, layer ) {
  var level = layer - cubeSize / 2 + 0.5 - 1;

  for ( var b = 0; b < cubeArray.length; b++ )
    if ( Math.round( cubeArray[b].getWorldPosition()[axis] ) === level )
      THREE.SceneUtils.detach( cubeArray[b], core, scene );

  scene.remove( core );
}

function parseSteps( steps ) {
  if ( steps === null )
    return -1;

  if ( steps.length === 0 )
    return -1;

  if ( steps === "*" ) // Randomize from WCA scrambler
    steps = "FUR";  // Steps from internet or algorithm

  movList = [];
  movPos = 0;

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

          movList.push( { layer: step_layer , axis: step_axis, times: step_times, radians: step_times * step_direction * 90 * ( Math.PI / 180 ) } );
          // console.log( "AddMov", { layer: step_layer - 1, axis: step_axis, degrees: step_times * step_direction * 90 * ( Math.PI / 180 ) } );
          STATE = STATE_END;
          break;
        default:
          console.log( "Fatal error, state unknown." );
          return -1;
      }
      pos++;
    }
  }
  attachFace = true;
  console.log( "Trigger animation" );
}

function applySteps() {
  if ( attachFace ) {
    console.log( "Movimiento a realizar: ", movList[movPos] );
    core = new THREE.Object3D();
    holdFace( core, movList[movPos].axis, movList[movPos].layer );
    tween = new TWEEN.Tween( core.rotation );
    switch ( movList[movPos].axis ) {
      case "x":
        tween.to( { x: movList[movPos].radians }, STEP_TIME * movList[movPos].times );
        break;
      case "y":
        tween.to( { y: movList[movPos].radians }, STEP_TIME * movList[movPos].times );
        break;
      case "z":
        tween.to( { z: movList[movPos].radians }, STEP_TIME * movList[movPos].times );
        break;
    }
    tween.onComplete(
      function() {
        inMov      = false;
        detachFace = true;
      }
    );
    inMov = true;
    attachFace = false;
    tween.start();
  }
  if ( inMov ) {
    TWEEN.update();
    core.updateMatrixWorld();
  }
  if ( detachFace ) {
    releaseFace( core, movList[movPos].axis, movList[movPos].layer );
    console.log( "Movimiento realizado: ", movList[movPos] );
    detachFace = false;
    movPos++;
    if ( movPos < movList.length )
      attachFace = true;
  }
}

function runGL( renderer, camera, controls ) {
  requestAnimationFrame( function() { runGL( renderer, camera, controls ); } );
  renderer.render( scene, camera );
  applySteps();
  controls.update();
}

/*  NOT USED YET
if ( typeof module !== "undefined" && module.exports ) {
  module.exports = WGLCUBE;
}
*/
