  var cubeSize  = 3;
  var cubeArray = Array();
  var container = document.getElementById("rubik-cube");
  var scene     = new THREE.Scene();
  var renderer  = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
  var camera    = new THREE.PerspectiveCamera( 45, container.offsetWidth / (container.offsetHeight), 0.1, 1000 );
  var controls  = new THREE.OrbitControls(camera, renderer.domElement);

  function setupWebGL(){
    camera.position.addScalar(cubeSize * 1.4);
    renderer.setClearColor(0xDDDDDD, 1);
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', function() {
      var WIDTH  = container.offsetWidth;
      var HEIGHT = container.offsetHeight
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });

    renderCube(scene);
    runGL();
  }

  function renderCube(scene){
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
    var level = level - cubeSize/2 + 0.5;
    var core = new THREE.Object3D();

    scene.add(core);

    if(axis != "x" && axis != "y" && axis != "z")
      return -1;

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

    //console.log("Scene objects:", scene.children.length);
    //console.log("Core  objects:", core.children.length);
    scene.remove(core);
  }

  function moveString(steps){
    for (var step in steps){
      switch(steps[step]){
        case "L":
          moveOnAxis("x", 0, 1);
          break;
        case "l":
          moveOnAxis("x", 0,-1);
          break;
        case "R":
          moveOnAxis("x", 2,-1);
          break;
        case "r":
          moveOnAxis("x", 2, 1);
          break;
        case "U":
          moveOnAxis("y", 2,-1);
          break;
        case "u":
          moveOnAxis("y", 2, 1);
          break;
        case "D":
          moveOnAxis("y", 0, 1);
          break;
        case "d":
          moveOnAxis("y", 0,-1);
          break;
        case "F":
          moveOnAxis("z", 2,-1);
          break;
        case "f":
          moveOnAxis("z", 2, 1);
          break;
        case "B":
          moveOnAxis("z", 0, 1);
          break;
        case "b":
          moveOnAxis("z", 0,-1);
          break;
        default:
          console.log("Invalid character", steps[step]);
          return -1;
      }
    }
  }

  function runGL() {
    requestAnimationFrame( runGL );
    renderer.render( scene, camera );
    controls.update();
  }
