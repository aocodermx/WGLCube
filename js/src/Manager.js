var WGLCube = ( function ( params ) {

    /*
    *   Manager to find and load all cubes, and change it's mode to preview if
    *   they are not shown in screen.
    *
    */
    params.Manager = function ( dom_container ) {
        var self = this;   // To avoid this confusion in callback functions.
        var players        = [];
        var dom_players    = [];
        var active_players = [];
        var max_active_players = 6;

        function init ( max_players ) {
            dom_players = document.getElementsByClassName ( 'wglcube_player' );

            max_active_players = max_players < 12 ? max_players : 12;

            for ( var i = 0; i< dom_players.length; i++ ) {
                players.push ( new WGLCube.Player ( dom_players[i] ) );
                dom_players[i].addEventListener ( 'click', on_player_click );
                dom_players[i].setAttribute ( 'data-index', i );
            }

        }

        this.setMaxPlayers = function ( max_players ) {
            max_active_players = max_players < 12 ? max_players : 12;
        };

        function on_player_click ( e ) {
            // Activate clicked player
            var index = parseInt ( this.getAttribute ( 'data-index' ) );
            players [ index ].to_interactive_mode ( );
            dom_players [ index ].removeEventListener ( 'click', on_player_click );
            active_players.push ( index );

            // Check if there are many players activated. If true, deactivate the oldest not visible player.
            if ( active_players.length > max_active_players ) {
                var removed = null;

                active_players.forEach ( function ( item, index, array ) {
                    if ( !players [ index ].isVisible ( ) ) {
                        players [ index ].to_preview_mode ( );
                        dom_players [ index ].addEventListener ( 'click', on_player_click );
                        removed = array.splice ( index, 1 );
                    }
                } );

                // If failed to found a not visible player, just deactivate the oldest one.
                if ( removed === null ) {
                    var deactivate = active_players.shift ( );
                    players [ deactivate ].to_preview_mode ( );
                    dom_players [ deactivate ].addEventListener ( 'click', on_player_click );
                }
            }
        }

        init ( dom_container );     // Initialization for variables and layout
    };

    return params;
} ( WGLCube || { } ) );

// Code for a smallest ready implementation from http://dustindiaz.com/smallest-domready-ever
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f();}

r ( function ( ) {
    var wglManager = new WGLCube.Manager ( 6 );
} );
