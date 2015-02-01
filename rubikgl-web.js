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
var cubeSize  = 3;
var cubeArray = new Array();
var scene     = new THREE.Scene();

function setupWebGL(){
  var renderer  = window.WebGLRenderingContext ? new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderercamera();
  var container = document.getElementById("rubik-cube");
  var camera    = new THREE.PerspectiveCamera( 45, container.offsetWidth / (container.offsetHeight), 0.1, 1000 );
  var controls  = new THREE.OrbitControls(camera, renderer.domElement);

  window.addEventListener('resize', function() {
    var WIDTH  = container.offsetWidth;
    var HEIGHT = container.offsetHeight
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    adjustControls();
  });

  camera.position.addScalar(cubeSize * 1.4);
  renderer.setClearColor(0xDDDDDD, 1);
  renderer.setSize( container.offsetWidth, container.offsetHeight );
  container.appendChild(renderer.domElement);
  controls.noPan = true;

  makeCube(scene);
  adjustControls();

  if(window.self != window.top && window.frameElement.tagName == "IFRAME"){
    var initString = window.frameElement.getAttribute("data-start");
    var stepString = window.frameElement.getAttribute("data-steps");
    var rubikSteps = document.getElementById('rubik-steps');
    rubikSteps.innerHTML = stepString;
    applySteps(initString);
  } else {
    // On Top
  }

  runGL(renderer, camera, controls);
}

function adjustControls(){
  var rubikControl = document.getElementById('rubik-control');
  var controlButtons = rubikControl.getElementsByTagName('button');
  var height = (controlButtons[0].offsetHeight * 0.6) + "px";
  for (var i=0; i<controlButtons.length;i++){
    controlButtons[i].style.fontSize = height;
  }
}

function makeCube(scene){
  var geometry = new THREE.BoxGeometry( 0.98, 0.98, 0.98 );
  var material = new THREE.MeshFaceMaterial( [
    new THREE.MeshBasicMaterial({color:0xFF6600}), // Right  -> Orange
    new THREE.MeshBasicMaterial({color:0xFF0000}), // Left   -> Red
    new THREE.MeshBasicMaterial({color:0x00FF00}), // Top    -> Green
    new THREE.MeshBasicMaterial({color:0x0000FF}), // Bottom -> Blue
    new THREE.MeshBasicMaterial({color:0xFFFFFF}), // Front  -> White
    new THREE.MeshBasicMaterial({color:0xFFFF00})  // Back   -> Yellow
    ] );

  for(var z=-cubeSize/2 + 0.5; z<cubeSize/2; z++){
    for(var x=-cubeSize/2 + 0.5; x<cubeSize/2; x++){
      for(var y=-cubeSize/2 + 0.5; y<cubeSize/2; y++){
        var piece = new THREE.Mesh(geometry, material);
        piece.position.set(x, y, z);
        cubeArray.push(piece);
        scene.add(piece);
      }
    }
  }
}

function moveOnAxis(axis, level, direction){
  var level = level - cubeSize/2 + 0.5 - 1;
  var core = new THREE.Object3D();

  if(axis != "x" && axis != "y" && axis != "z")
    return -1;

  scene.add(core);

  for (var b=0; b<cubeArray.length; b++)
    if( Math.round(cubeArray[b].getWorldPosition()[axis]) === level )
      THREE.SceneUtils.attach(cubeArray[b], scene, core);

  // For performance (90*(Math.PI/180) = 1.5707963267948966
  switch(axis){
    case "x":
      core.rotation.x += direction*1.5707963267948966;
      break;
    case "y":
      core.rotation.y += direction*1.5707963267948966;
      break;
    case "z":
      core.rotation.z += direction*1.5707963267948966;
      break;
  }

  core.updateMatrixWorld();

  for (var b=0; b<cubeArray.length; b++)
    if( Math.round(cubeArray[b].getWorldPosition()[axis]) === level )
      THREE.SceneUtils.detach(cubeArray[b], core, scene);

  scene.remove(core);
}

function applySteps(steps){
  if(steps === null)
    return -1;

  if(steps.length == 0)
    return -1;

  if(steps === "*") // Randomize
    steps = "FUR";  // Steps from internet or algorithm

  steps += ' ';
  var pos = 0;
  var char = '';
  var tok = '';

  var STATE_START = 0;
  var STATE_LAYER = 1;
  var STATE_AXIS  = 2;
  var STATE_TIMES = 3;
  var STATE_DIRECTION = 4;
  var STATE_END = 5;

  while(typeof char !== "undefined"){
    var step_axis = '';
    var step_layer = 1;
    var step_direction = 1;
    var step_times = 1;
    var STATE = STATE_START;

    while(STATE !== STATE_END){
      char = steps[pos];
      //console.log("CHAR:",char, " STATE:", STATE);
      switch(STATE){
        case STATE_START:
          if(!/\s/g.test(char)){
            STATE = STATE_LAYER;
            pos--;
          }
          if(typeof char === "undefined"){
            return;
          }
          break;
        case STATE_LAYER:
          var result = parseInt(char);
          if(isNaN(result)){
            STATE = STATE_AXIS;
            pos--;
            if(tok != ''){
              step_layer = parseInt(tok);
              tok = '';
            }
          }
          else{
            tok += char;
          }
          break;
        case STATE_AXIS:
          switch(char){
            case 'R':
              step_layer = cubeSize - step_layer + 1;
              step_direction *= -1;
            case 'L':
              step_axis = 'x';
              break;
            case 'U':
              step_layer = cubeSize - step_layer + 1;
              step_direction *= -1;
            case 'D':
              step_axis = 'y';
              break;
            case 'F':
              step_layer = cubeSize - step_layer + 1;
              step_direction *= -1;
            case 'B':
              step_axis = 'z';
              break;
            default:
              console.log("FACE to move is incorrect");
              return -1;
          }
          STATE = STATE_TIMES;
          break;
        case STATE_TIMES:
          var result = parseInt(char);
          if(isNaN(result)){
            STATE = STATE_DIRECTION;
            pos--;
            if(tok != ''){
              step_times = parseInt(tok);
              tok = '';
            }
          }
          else{
            tok += char;
          }
          break;
        case STATE_DIRECTION:
          if(char === '\'')
            step_direction *= -1;
          else
            pos --;
          STATE = STATE_END;
          break;
        default:
          console.log("Fatal error, state unknown.");
          return -1;
      }
      pos++;
    }
    for (var d=0; d<step_times; d++)
      moveOnAxis(step_axis, step_layer, step_direction);
  }
}

function runGL(renderer, camera, controls) {
  requestAnimationFrame( function(){runGL(renderer, camera, controls);} );
  renderer.render( scene, camera );
  //TWEEN.update();
  controls.update();
}

if(typeof module !== 'undefined' && module.exports) {
  module.exports = WGLCUBE;
}
