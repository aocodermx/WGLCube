var fs     = require ( 'fs' );
var gulp   = require ( 'gulp' );
var jshint = require ( 'gulp-jshint' );
var concat = require ( 'gulp-concat' );
var rename = require ( 'gulp-rename' );
var uglify = require ( 'gulp-uglify' );

var browserSync = require ( 'browser-sync' ).create ( );


var json = JSON.parse ( fs.readFileSync ( './package.json' ) );


gulp.task ( 'js', function ( ) {
    return gulp.src ( 'js/src/*.js' )
        .pipe ( jshint ( ) )
        .pipe ( jshint.reporter ( 'default' ) )
        // .pipe ( uglify ( ) ) // Comment to debug.
        .pipe ( concat ('wglcube.js' ) )
        .pipe ( rename ( 'wglcube_'+ json.version +'.min.js' ) )
        .pipe ( gulp.dest ( 'js' ) );
} );

gulp.task ( 'js-watch', [ 'js' ], function ( done ) {
    browserSync.reload ( );
    done ( );
} );

gulp.task ( 'serve', function ( ) {

    var files = [
        'usage.html',
        'css/*.css',
    ];

    browserSync.init ( files, {
        server: {
        baseDir: './'
        }
    } );

    gulp.watch ( "js/src/*.js", [ 'js-watch' ] );
});


// TODO: Add a CSS gulp.task to minify CSS files.
// TODO: Add a wglcube gulp.task with js and css task as dependencies..
