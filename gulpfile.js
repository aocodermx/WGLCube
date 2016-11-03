var fs     = require ( 'fs' );
var gulp   = require ( 'gulp' );
var jshint = require ( 'gulp-jshint' );
var concat = require ( 'gulp-concat' );
var rename = require ( 'gulp-rename' );
var uglify = require ( 'gulp-uglify' );


var json = JSON.parse ( fs.readFileSync ( './package.json' ) );


gulp.task ( 'js', function ( ) {
    return gulp.src ( 'js/src/*.js' )
        .pipe ( jshint ( ) )
        .pipe ( jshint.reporter ( 'default' ) )
        .pipe ( uglify ( ) )
        .pipe ( concat ('wglcube.js' ) )
        .pipe ( rename ( 'wglcube_'+ json.version +'.min.js' ) )
        .pipe ( gulp.dest ( 'js' ) );
} );

// TODO: Add a CSS gulp.task to minify CSS files.
// TODO: Add a wglcube gulp.task with js and css task.
