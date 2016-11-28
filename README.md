# WGLCube

WGLCube is a 3D representation for the magic cube you can use to demonstrate and execute algorithms natively just in the browser without need jvm or flash.

This plug-in is written in Javascript using the great library threejs to access browser WebGL context.

## Simple Installation

The simplest usage is to copy the Zero Dependency bundle into your project files and include it into your HTML.

The *nodeps* script contains all the dependencies minified in one single file and it's recommended only if there are no other THREE.js content in your website.

``` html
<!-- WGLCube single file with all dependencies already included -->
<script src="js/wglcube_V1.0.1.nodeps.min.js"></script>
```

## Installation with dependencies

If you have other THREE.js content in your website it's recommended to include WGLCube dependencies as separated files, this will allow THREE.js files to be cached resulting in faster loading times.

You just need to copy the WGLCube JavaScrip dependencies and the plug-in itself into your project files and include the scripts into your HTML files.

``` html
<!-- Dependencies for WGLCube -->
<script src="js/lib/three.min.js"></script>
<script src="js/lib/Projector.js"></script>
<script src="js/lib/CanvasRenderer.min.js"></script>
<script src="js/lib/OrbitControls.min.js"></script>
<script src="js/lib/Tween.min.js"></script>

<!-- WGLCube without dependencies -->
<script src="js/wglcube_V1.0.1.min.js"></script>
```

## Usage Example
Once WGLCube was installed in your website you are ready to show and execute an algorithms in 3D, just write a div with the desired parameters. For example, the next script will render a 3x3x3 cube (data-size) with an initialization algorithm specified in *data-init* and a algorithm to play specified in *data-steps*.

``` html
<div class="wglcube_player"
    data-size="3"
    data-init="L U D"
    data-steps="D U L D R2"
    style='width:200px;height:300px'>
</div>
```

For more examples and demos visit project's [home]("http://aocodermx.me/projects/coming/WGLCube/") or see USAGE.html file.
