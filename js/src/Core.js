var WGL = ( function ( params ) {

    /*
    *  Object to represent the 3D Cube, exposing an API to manipulate the cube.
    *  The cube can be in either two modes for better performance:
    *
    *  * Preview mode:
    *       In this mode a simple preview is presented until the user interact
    *       with the control, at this point the cube change it's mode to
    *       interactive.
    *
    *  * Interactive mode:
    *       In this mode the 3D code is executed to render the cube, so the user
    *       can now interact with the cube.
    */
    params.Core = function ( dom_container ) {
        var self = this;   // To avoid this confusion in callback functions.

        // Public properties.
        self.size      = null; // Size for the cube
        self.STEP_TIME = 500;  // Time for each single move

        var RootContainer = null;   // Root DOM Container
        var CubeArray     = [];     // Array to hold 3d cubes
        var CubesToShow   = [];     // Array to store the index for the pieces to highlight
        var CubeCore      = null;   // Core object, needed to perform movements
        var CubeContainer = null;   // Container for the 3d cube

        var tween            = null;  // For animating the cube
        var animationFrameId = null;  // Animation frame id to stop animation.
        var animationStart   = false; // start animation.
        var animationAxis    = null;  // axis to move when an animation is performed.
        var animationLayer   = null;  // layer to move when an animation is performed.
        var animationRadians = null;  // radians to move when an animation is performed.
        var animationCount   = null;  // time factor when an animation is performed.
        var animationRunning = null;  // Flag when animation is running, to avoid cube malformation.

        var animationFinishCallback = null; // Executed when the animation finishes.

        var scene    = null;   // WebGL Scene
        var renderer = null;   // WebGL Renderer
        var camera   = null;   // WebGL Camera
        var controls = null;   // WebGL Controls


        /*
         *  Function to draw the default HTML layout to display before load the WebGL
         *  Cube, other initialization code goes here.
         */
        function init ( dom_container ) {
            RootContainer = dom_container;
            self.size     = RootContainer.getAttribute ( 'data-size'  );

            var CubesToShowString = RootContainer.getAttribute ( "data-show" );
            if ( CubesToShowString !== null) {
                CubesToShow = CubesToShowString.split( "," );
            }

            var div_preview       = document.createElement ( 'div' );
            div_preview.className = 'preview';
            div_preview.innerHTML =
                "<div class='square s1'></div>" +
                "<div class='square s2'></div>" +
                "<div class='square s3'></div>" +
                "<div class='square s4'></div>";

            var div_cube       = document.createElement ( 'div' );
            div_cube.className = 'cube';

            RootContainer.appendChild ( div_preview );
            RootContainer.appendChild ( div_cube );
        }


        /*
         *  Function to change from preview mode to interactive mode.
         */
        this.to_interactive_mode = function ( ) {
            var div_preview   = RootContainer.getElementsByClassName ( 'preview' )[0];
            div_preview.classList.remove ( 'util-show' );
            div_preview.classList.add    ( 'util-hide' );
            // div_preview.style = 'display:none; ';

            var div_cube = RootContainer.getElementsByClassName ( 'cube' )[0];
            div_cube.classList.remove ( 'util-hide' );
            div_cube.classList.add    ( 'util-show' );
            // div_cube.style = 'display:block;';

            // Load WGL
            init3d ( );
        };


        /*
        *  Function to change from interactive mode to preview mode.
        */
        this.to_preview_mode = function ( ) {
            var div_preview   = RootContainer.getElementsByClassName ( 'preview' )[0];
            div_preview.classList.remove ( 'util-hide' );
            div_preview.classList.add    ( 'util-show' );
            // div_preview.style = 'display:block;';

            var div_cube = RootContainer.getElementsByClassName ( 'cube' )[0];
            div_cube.classList.remove ( 'util-show' );
            div_cube.classList.add    ( 'util-hide' );
            // div_cube.style = 'display:none;';

            cancelAnimationFrame ( animationFrameId );
            // TODO: Update threejs version used.
            // renderer.context.canvas.loseContext ( );
            renderer.forceContextLoss ( );
            renderer = null;
            camera   = null;
            controls = null;

            while ( CubeContainer.lastChild ) CubeContainer.removeChild( CubeContainer.lastChild );
        };


        /*
        *    Function to reset the cube to the original position.
        */
        this.Reset = function (  ) {
            if ( tween != null && animationRunning )
                tween.stop ( );
            else
                renderCube ( scene );
        };


        /*
        *   Function to parse a move string based in the form:
        *
        *       [Layer]Face[Times][Direction]
        *
        *   Where:
        *
        *       stepString    : the steps string to apply.
        *       animated      : true if animation will be executed, false otherwise.
        *       callback_start: a function to be executed when animation start.
        *       callback_end  : a function to be executed when animation finishes,
        *                       if animated is false, this will be ignored.
        *
        *       TODO: Implement Face X Y Z to rotate the entire cube.
        */
        this.Move = function ( stepString, animated, callback_start, callback_end ) {

            if ( animationRunning ) {
                console.log ( "Animation not finished, try again later.");
                return;
            }

            if ( animated ) {
                callback_start ( );
            }

            stepString  += " ";

            var position = 0;
            var char     = '';
            var token    = '';

            var STATE_START     = 0;
            var STATE_LAYER     = 1;
            var STATE_AXIS      = 2;
            var STATE_TIMES     = 3;
            var STATE_DIRECTION = 4;
            var STATE_END       = 5;

            while ( typeof char !== "undefined" ) {

                var step_axis      = "";
                var step_layer     = 1;
                var step_direction = 1;
                var step_times     = 1;

                var STATE = STATE_START;

                while ( STATE !== STATE_END ) {
                    char = stepString[position];
                    switch ( STATE ) {
                        case STATE_START:
                            if ( !/\s/g.test( char ) ) {
                                STATE = STATE_LAYER;
                                position--;
                            }
                            if ( typeof char === "undefined" ) {
                                STATE = STATE_END;
                            }
                            break;
                        case STATE_LAYER:
                            var result = parseInt( char );
                            if ( isNaN ( result ) ) {
                                STATE = STATE_AXIS;
                                position--;
                                if ( token !== "" ) {
                                    step_layer = parseInt( token );
                                    token = "";
                                }
                            } else {
                                token += char;
                            }
                            break;
                        case STATE_AXIS:
                            switch ( char ) {
                                case "R":
                                    step_layer = self.size - step_layer + 1;
                                    step_direction *= -1;
                                case "L":
                                    step_axis = "x";
                                    break;
                                case "U":
                                    step_layer = self.size - step_layer + 1;
                                    step_direction *= -1;
                                case "D":
                                    step_axis = "y";
                                    break;
                                case "F":
                                    step_layer = self.size - step_layer + 1;
                                    step_direction *= -1;
                                case "B":
                                    step_axis = "z";
                                    break;
                                default:
                                    console.log( "FACE to move is incorrect" );
                                    return -1;
                            }
                            STATE = STATE_TIMES;
                            break;
                        case STATE_TIMES:
                            var result2 = parseInt( char );
                            if ( isNaN( result2 ) ) {
                                STATE = STATE_DIRECTION;
                                position--;
                                if ( token !== "" ) {
                                    step_times = parseInt( token );
                                    token = "";
                                }
                            } else {
                                token += char;
                            }
                            break;
                        case STATE_DIRECTION:
                            if ( char === "\'" )
                                step_direction *= -1;
                            else
                                position--;

                            // Check for animation
                            if ( animated === true ) {
                                animationAxis    = step_axis;
                                animationLayer   = step_layer;
                                animationRadians = step_times * step_direction * 90 * ( Math.PI / 180 );
                                animationCount   = step_times;
                                animationStart   = true;
                                animationFinishCallback = callback_end;
                            } else {
                                moveFaceInstantly ( step_axis, step_layer, step_times * step_direction * 90 * ( Math.PI / 180 ) );
                            }

                            STATE = STATE_END;
                            break;
                        default:
                            console.log( "Fatal error, state unknown." );
                            return -1;
                    }
                    position++;
                }
            }
        };




        /*
        *  Function to initialize WebGL variables and environment.
        */
        function init3d ( ) {
            CubeContainer = RootContainer.getElementsByClassName ( "cube" )[0];

            scene     = new THREE.Scene();
            renderer  = window.WebGLRenderingContext ? new THREE.WebGLRenderer ( { antialias:true, preserveDrawingBuffer: true } ) : new THREE.CanvasRenderer ( );
            camera    = new THREE.PerspectiveCamera ( 45, CubeContainer.offsetWidth / ( CubeContainer.offsetHeight ), 0.1, 1000 );
            controls  = new THREE.OrbitControls ( camera, renderer.domElement );

            controls.enablePan = false;
            renderer.setClearColor    ( 0xD8D8D8, 1 );
            renderer.setSize          ( CubeContainer.offsetWidth, CubeContainer.offsetHeight );
            CubeContainer.appendChild ( renderer.domElement );

            renderCube ( );

            // Event listeners for cube container
            CubeContainer.addEventListener( "resize", onResize );

            camera.position.addScalar ( self.size * 1.4 );
            wglLoop ( renderer, camera, controls );
        }


        /*
        *  Function to draw the cube in the WebGL environment.
        */
        function renderCube ( ) {
            for ( var i = 0, len = CubeArray.length; i < len; i++ )
                scene.remove ( CubeArray[i] );

            CubeArray = [];

            var
                geometry = new THREE.BoxGeometry ( 0.98, 0.98, 0.98 ),
                material = new THREE.MeshFaceMaterial ( [
                    new THREE.MeshBasicMaterial ( { color:0xFF6600 } ), // Right  -> Orange
                    new THREE.MeshBasicMaterial ( { color:0xFF0000 } ), // Left   -> Red
                    new THREE.MeshBasicMaterial ( { color:0x00FF00 } ), // Top    -> Green
                    new THREE.MeshBasicMaterial ( { color:0x0000FF } ), // Bottom -> Blue
                    new THREE.MeshBasicMaterial ( { color:0xFFFFFF } ), // Front  -> White
                    new THREE.MeshBasicMaterial ( { color:0xFFFF00 } )  // Back   -> Yellow
                ] ),
                blackMaterial = new THREE.MeshFaceMaterial ( [
                    new THREE.MeshBasicMaterial ( { color:0x848484 } ), // Right  -> Orange
                    new THREE.MeshBasicMaterial ( { color:0x848484 } ), // Left   -> Red
                    new THREE.MeshBasicMaterial ( { color:0x848484 } ), // Top    -> Green
                    new THREE.MeshBasicMaterial ( { color:0x848484 } ), // Bottom -> Blue
                    new THREE.MeshBasicMaterial ( { color:0x848484 } ), // Front  -> White
                    new THREE.MeshBasicMaterial ( { color:0x848484 } )  // Back   -> Yellow
                ] );

            for ( var z = -self.size / 2 + 0.5; z < self.size / 2; z++ ) {
                for ( var x = -self.size / 2 + 0.5; x < self.size / 2; x++ ) {
                    for ( var y = -self.size / 2 + 0.5; y < self.size / 2; y++ ) {
                        var piece = null;
                        if( CubesToShow.length !== 0 && CubesToShow.indexOf( CubeArray.length.toString() ) < 0 ){
                            piece = new THREE.Mesh( geometry, blackMaterial );
                        } else {
                            piece = new THREE.Mesh( geometry, material );
                        }
                        piece.position.set( x, y, z );
                        CubeArray.push( piece );
                        scene.add( piece );
                    }
                }
            }
        }


        /*
        *  Utility function attach all the cubes from a face to a core object.
        */
        function attachFaceToCore( CubeCore, axis, layer ) {
            var level = layer - self.size / 2 + 0.5 - 1;

            scene.add ( CubeCore );

            for ( var b = 0, len = CubeArray.length; b < len; b++ ) {
                if ( ( CubeArray[b].getWorldPosition ( )[axis] | 0 ) === level ) {
                    THREE.SceneUtils.attach ( CubeArray[b], scene, CubeCore );
                }
            }
        }


        /*
        *  Utility function to move cube faces detaching it from a core object
        */
        function detachFaceFromCore ( CubeCore, axis, layer ) {
            var level = layer - self.size / 2 + 0.5 - 1;

            for ( var b = 0, len = CubeArray.length; b < len; b++ ) {
                if ( ( CubeArray[b].getWorldPosition ( )[axis] | 0 ) === level ) {
                    THREE.SceneUtils.detach ( CubeArray[b], CubeCore, scene );
                }
            }

            scene.remove ( CubeCore );
        }


        /*
        *  Runs an animation if it exists.
        */
        function runAnimation ( ) {
            TWEEN.update ( );

            if ( animationStart ) {
                CubeCore = new THREE.Object3D ( );
                attachFaceToCore ( CubeCore, animationAxis, animationLayer );
                tween = new TWEEN.Tween ( CubeCore.rotation );
                switch ( animationAxis ) {
                    case "x":
                        tween.to ( { x: animationRadians }, self.STEP_TIME * animationCount );
                        break;
                    case "y":
                        tween.to ( { y: animationRadians }, self.STEP_TIME * animationCount );
                        break;
                    case "z":
                        tween.to ( { z: animationRadians }, self.STEP_TIME * animationCount );
                        break;
                }
                tween.onStop (
                    function ( ) {
                        CubeCore.updateMatrixWorld ( );
                        detachFaceFromCore ( CubeCore, animationAxis, animationLayer );
                        animationRunning = false;
                        renderCube( scene );

                        console.log ( "Tween onStop called" );
                    }
                );
                tween.onComplete (
                    function ( ) {
                        CubeCore.updateMatrixWorld ( );
                        detachFaceFromCore ( CubeCore, animationAxis, animationLayer );
                        animationRunning = false;
                        animationFinishCallback ( );

                        console.log ( "Tween onComplete called" );
                    }
                );
                animationStart   = false;
                animationRunning = true;
                tween.start();
            }
        }


        /*
        *  Function to move a face for the cube.
        */
        function moveFaceInstantly ( axis, layer, radians ) {
            CubeCore = new THREE.Object3D ( );
            attachFaceToCore ( CubeCore, axis, layer );
            switch ( axis ) {
                case "x":
                    CubeCore.rotation.x += radians;
                    break;
                case "y":
                    CubeCore.rotation.y += radians;
                    break;
                case "z":
                    CubeCore.rotation.z += radians;
                    break;
            }
            CubeCore.updateMatrixWorld ( );
            detachFaceFromCore ( CubeCore, axis, layer );
        }


        /*
        *  Render loop
        */
        function wglLoop ( renderer, camera, controls ) {
            animationFrameId = requestAnimationFrame ( function ( ) { wglLoop ( renderer, camera, controls ); } );
            renderer.render ( scene, camera );
            runAnimation ( );
            controls.update ( );
        }



        // Event Listeners declaration.




        /*
        *  Function to resize the WebGL environment.
        */
        function onResize ( ) {
            var WIDTH  = self.CubeContainer.offsetWidth;
            var HEIGHT = self.CubeContainer.offsetHeight;

            renderer.setSize ( WIDTH, HEIGHT );
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix ( );
            // this.resizeControls ( );
        }


        init ( dom_container );     // Initialization for variables and layout
    };

    return params;
} ( WGL || { } ) );
