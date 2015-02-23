var WGLCUBE = WGLCUBE || {};

WGLCUBE.Cube = function( size, scene ) {
  this.size   = size;
  this.pieces = [];
  this.core   = null;
  this.tween  = null;

  console.log( "Creating Cube" );
  var geometry = new THREE.BoxGeometry( 0.98, 0.98, 0.98 );
  var material = new THREE.MeshFaceMaterial( [
    new THREE.MeshBasicMaterial( { color:0xFF6600 } ), // Right  -> Orange
    new THREE.MeshBasicMaterial( { color:0xFF0000 } ), // Left   -> Red
    new THREE.MeshBasicMaterial( { color:0x00FF00 } ), // Top    -> Green
    new THREE.MeshBasicMaterial( { color:0x0000FF } ), // Bottom -> Blue
    new THREE.MeshBasicMaterial( { color:0xFFFFFF } ), // Front  -> White
    new THREE.MeshBasicMaterial( { color:0xFFFF00 } )  // Back   -> Yellow
    ] );

  for ( var z = -this.size / 2 + 0.5; z < this.size / 2; z++ ) {
    for ( var x = -this.size / 2 + 0.5; x < this.size / 2; x++ ) {
      for ( var y = -this.size / 2 + 0.5; y < this.size / 2; y++ ) {
        var piece = new THREE.Mesh( geometry, material );
        piece.position.set( x, y, z );
        this.pieces.push( piece );
        scene.add( piece );
      }
    }
  }
};
