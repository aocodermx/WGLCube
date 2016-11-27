# WGLCube

WGLCube is a 3D representation for the magic cube you can use to demonstrate and execute algorithms natively just in the browser without need jvm or flash.

This plug-in is written in Javascript using the great library threejs to access browser WebGL context.

## Simple Usage

To use this plug-in you just need to copy the wglcube javascript and it's dependencies and include it into your project website.

``` html
<!-- Dependencies for WGLCube -->
<script src="js/lib/three.min.js"></script>
<script src="js/lib/OrbitControls.min.js"></script>
<script src="js/lib/Tween.min.js"></script>

<!-- WGLCube javascript -->
<script src="js/wglcube_V1.0.2.min.js"></script>
```

With this you are ready to show and execute an algorithm in your website, just write a div with the desired parameters. For example, the next script will render a 3x3x3 cube (data-size) with an initialization algorithm specified in *data-init* and a algorithm to play specified in *data-steps*.

``` html
<div class="wglcube_player"
    data-size="3"
    data-init="L U D"
    data-steps="D U L D R2"
    style='width:200px;height:300px'></div>
```

For more examples and demos visit project's [home]("http://aocodermx.me/projects/coming/WGLCube/") or see USAGE.html file.
