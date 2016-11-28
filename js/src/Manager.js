var WGLCube = ( function ( params ) {

    /*
    *   Manager to find and load all cubes, and change it's mode to preview if
    *   they are not shown in screen.
    *
    */
    params.Manager = function ( dom_container ) {

        function init ( ) {
            var
                players = [],
                dom_players = document.getElementsByClassName ( 'wglcube_player' );

            for ( var i = 0; i< dom_players.length; i++ ) {
                players.push ( new WGLCube.Player ( dom_players[i] ) );
            }

            window.addEventListener('scroll', function ( e ) {
                for ( var i = 0; i< dom_players.length; i++ ) {
                    if ( !players[i].isPreview ( ) ) {
                        players[i].isScrolledIntoView ( );
                    }
                }
            } );

        }

        init ( dom_container );     // Initialization for variables and layout
    };

    return params;
} ( WGLCube || { } ) );

// Code for a smallest ready implementation from http://dustindiaz.com/smallest-domready-ever
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f();}

r ( function ( ) {
    var wglManager = new WGLCube.Manager ( );
} );
