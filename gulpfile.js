var fs        = require ( 'fs' );
var gulp      = require ( 'gulp' );
var jshint    = require ( 'gulp-jshint' );
var csslint   = require ( 'gulp-csslint');
var concat    = require ( 'gulp-concat' );
var rename    = require ( 'gulp-rename' );
var base64    = require ( 'gulp-base64' );

var uglifycss = require ( 'gulp-uglifycss' );
var css2js    = require ( 'gulp-css2js' );
var uglify    = require ( 'gulp-uglify' );
var imagemin  = require ( 'gulp-imagemin' );

var browserSync = require ( 'browser-sync' ).create ( );
var json = JSON.parse ( fs.readFileSync ( './package.json' ) );


gulp.task ( 'debug-css', function ( ) {
    return gulp.src ( 'css/src/*.css' )
        .pipe ( csslint ( ) )
        .pipe ( csslint.formatter ( ) )
        .pipe ( concat ( 'styles.css' ) )
        .pipe ( css2js ( ) )
        .pipe ( gulp.dest ( 'css' ) );
} );


gulp.task ( 'css', function ( ) {
    return gulp.src ( 'css/src/*.css' )
        .pipe ( base64 ( ) )
        .pipe ( uglifycss ( ) )
        .pipe ( concat ( 'styles.css' ) )
        .pipe ( css2js ( ) )
        .pipe ( gulp.dest ( 'css' ) );
} );


gulp.task ( 'debug-js', function ( ) {
    return gulp.src ( ['js/src/*.js', 'css/styles.js'] )
        .pipe ( jshint ( ) )
        .pipe ( jshint.reporter ( 'default' ) )
        .pipe ( concat ('wglcube.js' ) )
        .pipe ( rename ( 'wglcube_V'+ json.version +'.min.js' ) )
        .pipe ( gulp.dest ( 'js' ) );
} );


gulp.task ( 'js', function ( ) {
    return gulp.src ( ['js/src/*.js', 'css/styles.js'] )
        .pipe ( jshint ( ) )
        .pipe ( jshint.reporter ( 'default' ) )
        .pipe ( uglify ( ) ) // Comment to debug.
        .pipe ( concat ('wglcube.js' ) )
        .pipe ( rename ( 'wglcube_V'+ json.version +'.min.js' ) )
        .pipe ( gulp.dest ( 'js' ) );
} );


gulp.task ( 'img', function ( ) {
    gulp.src ( 'img/src/*' )
        .pipe ( imagemin ( ) )
        .pipe ( gulp.dest ( 'img' ) )
} );


gulp.task ( 'js-watch', ['debug-js'], function ( done ) {
    browserSync.reload ( );
    done ( );
} );


gulp.task ( 'css-watch', ['debug-css'], function ( done) {
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

    gulp.watch ( ['js/src/*.js', 'css/styles.js'],    [ 'js-watch' ] );
    gulp.watch ( "css/src/*.css",  [ 'css-watch' ] );
});

gulp.task ( 'build', ['img', 'css', 'js'], function ( ) {
    return gulp.src ( ['js/lib/three.min.js', 'js/lib/Projector.min.js', 'js/lib/CanvasRenderer.min.js', 'js/lib/OrbitControls.min.js', 'js/lib/Tween.min.js', 'css/styles.js', 'js/src/*.js'] )
        // .pipe ( uglify ( ) ) // Comment to debug.
        .pipe ( concat ('wglcube.js' ) )
        .pipe ( rename ( 'wglcube_V'+ json.version +'.nodeps.min.js' ) )
        .pipe ( gulp.dest ( 'js' ) );
} );
