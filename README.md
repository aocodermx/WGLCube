# WGLCube

WGLCube is a 3D representation for the magic cube you can use to demonstrate and execute algorithms natively just in the browser without need jvm or flash.

Your users doesn't need to install any plug-in because WGLCube uses latest browser technology to render 3D content. So stop using images to demonstrate cube algorithms and start using the 3D world.

![alt tag](https://raw.githubusercontent.com/aocodermx/WGLCube/master/img/ScreenShoot.png)

## Installation

There are two methods available to install WGLCube in your website, the first method is the easiest way because it only need a single file (`js/wglcube_V1.0.2.nodeps.min.js`). In the second method you will need to include various scripts in your website in order to render the cube.

You only need to use one method, if you cant see the cube and in the debug console you see the message `"Uncaught TypeError: Cannot redefine property: AudioContext(...)"` check your are using only one method.

The details to implement both methods are described in the next two sections.

### Installation - Method 1

This is the simplest method to install WGLCube, you only need to copy the zero dependency JavaScrip file `js/wglcube_V1.0.2.nodeps.min.js` into your project files and include it into your HTML.

The **nodeps** script contains all the dependencies minified in one single file and it's recommended only if there are no other THREE.js content in your website.

``` html
<!-- WGLCube single file with all dependencies already included -->
<script src="js/wglcube_V1.0.2.nodeps.min.js"></script>
```

### Installation - Method 2

This method requires a few more lines of code, if you have other THREE.js content in your website it's recommended to include WGLCube dependencies as separated files, this will allow THREE.js files to be cached resulting in faster loading times.

You just need to copy the WGLCube JavaScript dependencies and the plug-in itself into your project files and include the scripts into your HTML files.

``` html
<!-- Dependencies for WGLCube -->
<script src="js/lib/three.min.js"></script>
<script src="js/lib/Projectormin.js"></script>
<script src="js/lib/CanvasRenderer.min.js"></script>
<script src="js/lib/OrbitControls.min.js"></script>
<script src="js/lib/Tween.min.js"></script>

<!-- WGLCube without dependencies -->
<script src="js/wglcube_V1.0.2.min.js"></script>
```

## Usage Example
Once WGLCube installed in your website you are ready to show and execute any algorithm in 3D, just write a div with the desired parameters. For example, the next script will render cube with size 3 as specified in *data-size*, with an initialization algorithm specified in *data-init* and a algorithm to execute specified in *data-steps*.

``` html
<div class="wglcube_player"
    data-size="3"
    data-init="L U D"
    data-steps="D U L D R2"
    style="width:200px;height:300px">
</div>
```

For more examples see USAGE.html file.

## Algorithm Notation

...
