var WGL = ( function ( params ) {

    /*
    *  Object to represent an algorithm player to play, pause move forward or
    *  backward step by step and stop the algorithm execution, the player can
    *  be in one of the folowing two modes:
    *
    *  * Preview mode:
    *       In this mode a simple preview is presented until the user interact
    *       with the control, at this point the player change it's mode to
    *       interactive.
    *
    *  * Interactive mode:
    *       In this mode the 3D code is executed to render the cube and to display
    *       the controls to manipulate the player, so the user can interact with
    *       the player.
    *
    */
    params.Player = function ( dom_container ) {
        var self = this;   // To avoid this confusion in callback functions.

        var core           = null;
        var RootContainer  = null;

        var player_preview = true;
        var player_step    = 0;
        var player_init    = null;
        var player_steps   = null;
        var player_forward = true;
        var player_playing = false;


        function init ( dom_container ) {
            RootContainer = dom_container;

            core         = new WGL.Core ( RootContainer );
            player_init  =   RootContainer.getAttribute ( 'data-init' );
            player_steps = ( RootContainer.getAttribute ( 'data-steps' ) ).split( ' ' );
            if ( player_steps === null ) {
                console.log ( 'data-steps needed in order to display an algorithm execution.' );
            }

            // core.STEP_TIME = 2500; // For test pruporses.

            var div_step_list = document.createElement ( 'div'    );
            var div_controls  = document.createElement ( 'div'    );
            var div_hint      = document.createElement ( 'div'    );

            var button_prev   = document.createElement ( 'button' );
            var button_stop   = document.createElement ( 'button' );
            var button_play   = document.createElement ( 'button' );
            var button_next   = document.createElement ( 'button' );
            var button_close  = document.createElement ( 'button');

            div_step_list.className = "steps-container";
            div_controls.className  = "controls";
            div_hint.className      = "hint";

            button_prev.className   = 'icon-previous';
            button_stop.className   = 'icon-stop';
            button_play.className   = 'icon-play play-pause';
            button_next.className   = 'icon-next';
            button_close.className  = 'icon-close';

            for ( var i = 0; i < player_steps.length; i++ ) {
              var span_step       = document.createElement ( 'span' );
              span_step.innerHTML = player_steps[i];
              span_step.className = 'step_' + i;

              div_step_list.appendChild ( span_step );
            }
            div_hint.innerHTML = "Click to load 3D";

            button_prev.addEventListener   ( 'click', on_button_prev );
            button_stop.addEventListener   ( 'click', on_button_stop );
            button_play.addEventListener   ( 'click', on_button_play );
            button_next.addEventListener   ( 'click', on_button_next );
            button_close.addEventListener  ( 'click', self.to_preview_mode );
            RootContainer.addEventListener ( 'click', self.to_interactive_mode );

            div_controls.appendChild  ( button_prev  );
            div_controls.appendChild  ( button_stop  );
            div_controls.appendChild  ( button_play  );
            div_controls.appendChild  ( button_next  );
            div_controls.appendChild  ( button_close );

            RootContainer.appendChild ( div_step_list );
            RootContainer.appendChild ( div_hint );
            RootContainer.appendChild ( div_controls );

            var font_size = 1;
            while ( div_step_list.scrollHeight != div_step_list.offsetHeight ) {
                font_size -= 0.01;
                div_step_list.style.fontSize = font_size + "em";
                if ( font_size < 0.2 )
                    break;
            }
        }

        this.to_interactive_mode = function ( e ) {
            player_preview = false;

            var div_controls = RootContainer.getElementsByClassName ( 'controls' )[0];
            div_controls.classList.remove ( 'util-hide' );
            div_controls.classList.add    ( 'util-show' );
            // div_controls.style = 'display:block;';

            var div_hint  = RootContainer.getElementsByClassName ( 'hint' )[0];
            div_hint.classList.remove ( 'util-show' );
            div_hint.classList.add    ( 'util-hide' );
            // div_hint.style = 'display:none;';

            // RootContainer.style = 'cursor:inherit;';
            RootContainer.classList.remove ( 'util-cursor-hand' );
            RootContainer.classList.add    ( 'util-cursor-none' );

            core.to_interactive_mode ( );
            core.Move ( player_init, false, null );
            on_button_stop ( );
            RootContainer.removeEventListener ( 'click', self.to_interactive_mode );
        };

        this.to_preview_mode = function ( e ) {
            player_preview = true;

            var div_controls = RootContainer.getElementsByClassName ( 'controls' )[0];
            div_controls.classList.remove ( 'util-show' );
            div_controls.classList.add    ( 'util-hide' );
            // div_controls.style = 'display:none;';

            var div_hint  = RootContainer.getElementsByClassName ( 'hint' )[0];
            div_hint.classList.remove ( 'util-hide' );
            div_hint.classList.add    ( 'util-show' );
            // div_hint.style = 'display:block;';

            // RootContainer.style = 'cursor:block;cursor:hand;';
            RootContainer.classList.remove ( 'util-cursor-none' );
            RootContainer.classList.add    ( 'util-cursor-hand' );

            core.to_preview_mode ( );
            RootContainer.addEventListener ( 'click', self.to_interactive_mode );

            if ( typeof e !== 'undefined')
                e.cancelBubble = true;
        };

        this.isPreview = function ( ) {
            return player_preview;
        };

        this.isScrolledIntoView = function ( ) {
            var elemTop    = RootContainer.getBoundingClientRect().top;
            var elemBottom = RootContainer.getBoundingClientRect().bottom;

            var isVisible = (elemBottom >= 0) && (elemTop <= window.innerHeight);

            if ( !isVisible ) {
                self.to_preview_mode ( );
            }
            return isVisible;
        };

        function on_button_prev ( ) {

            if ( player_forward ) {
                player_step--;
                player_forward = false;
            }

            var inverted_step = player_steps [ player_step ].trim ( );
            if ( inverted_step.indexOf ( "'" ) !== -1 ) {
                inverted_step.replace ( "'", "" );
            } else {
                inverted_step += "'";
            }

            var span_step = RootContainer.getElementsByClassName ( 'step_' + player_step )[0];
            core.Move ( inverted_step, true, function ( ) {
                if ( typeof span_step !== 'undefined' ) {
                    span_step.classList.add ( 'current-step' );
                }
            }, function ( ) {
                player_step--;

                if ( typeof span_step !== 'undefined' )
                    span_step.classList.remove ( 'current-step' );
            } );
        }

        function on_button_stop ( ) {

            var span_step = RootContainer.getElementsByClassName ( 'step_' + player_step )[0];
            if ( typeof span_step !== 'undefined' )
                span_step.classList.remove ( 'current-step' );

            player_step    = 0;
            player_forward = true;
            player_playing = false;

            core.Reset ( );
            core.Move ( player_init, false );

            var button_play = RootContainer.getElementsByClassName ( 'play-pause' )[0];
            button_play.classList.remove ( 'icon-pause' );
            button_play.classList.add    ( 'icon-play' );
        }

        // TODO: Check the controls behaviour.
        function on_button_play ( e ) {

            if ( typeof e !== 'undefined' ) {
                player_playing = !player_playing;

                var button_play = RootContainer.getElementsByClassName ( 'play-pause' )[0];
                if ( player_playing ) {
                    button_play.classList.remove ( 'icon-play' );
                    button_play.classList.add    ( 'icon-pause' );
                } else {
                    button_play.classList.remove ( 'icon-pause' );
                    button_play.classList.add    ( 'icon-play' );
                }
            }

            if ( player_playing ) {
                if ( player_step >= player_steps.length ) {
                    on_button_stop ( );
                    return;
                }

                var span_step = RootContainer.getElementsByClassName ( 'step_' + player_step )[0];

                core.Move ( player_steps [ player_step ], true, function ( ) {
                    if ( typeof span_step !== 'undefined' ) {
                        span_step.classList.add ( 'current-step' );
                    }
                }, function ( ) {
                    player_step++;

                    if ( typeof span_step !== 'undefined' )
                        span_step.classList.remove ( 'current-step' );

                    on_button_play ( );
                } );
            }

        }

        function on_button_next ( ) {
            if ( player_step >= player_steps.length ) {
                on_button_stop ( );
                return;
            }

            if ( !player_forward ) {
                player_step++;
                player_forward = true;
            }

            var span_step = RootContainer.getElementsByClassName ( 'step_' + player_step )[0];

            core.Move ( player_steps [ player_step ], true, function ( ) {
                if ( typeof span_step !== 'undefined' ) {
                    span_step.classList.add ( 'current-step' );
                }

            }, function ( ) {
                player_step++;
                if ( typeof span_step !== 'undefined' )
                    span_step.classList.remove ( 'current-step' );
            } );
        }

        init ( dom_container );
    };

    return params;
} ( WGL || { } ) );
