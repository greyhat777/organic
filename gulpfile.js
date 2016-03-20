
/////////////////////////////////// /
//Project: Wells Fargo Landing Page /
//Developer: Jesus Tellez			/
//Email Support: jtellez@organic.com/
////////////////////////////////////


//Calling Gulp and all of its plugins
var gulp = require('gulp');

var sass 		= require('gulp-sass'); // Calling the gulp-sass plugin
var browserSync = require('browser-sync').create(); // Requiring a browser server with livereload
var useref 		= require('gulp-useref'); // Allows concatenation to a single place (Useful for Distribution folder)
var uglify 		= require('gulp-uglify');  // Minify the JavaScript files
var gulpIf 		= require('gulp-if'); // Used in conjunction with uglify to only minify JavaScript files
var cssnano		= require('gulp-cssnano'); // Used to minify the concatenated css files
var imagemin 	= require('gulp-imagemin'); // Used to optimized our images
var cache 		= require('gulp-cache'); // Being used in conjunction to imagemin
var del 		= require('del'); // Used to clean up files
var runSequence = require('run-sequence'); // Allows you to run task in a certain sequence


//Gulp Browswer Server Running
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'  // Tell the server which directory to start in. The Index file is located in the app directory.
    },
  })
});



//Our Gulp Task Running
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))  // places a css file in this directory
    .pipe(browserSync.reload({
      stream: true
    }))
});



gulp.task('useref', function(){ // task to optimize our html, js, and css
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});



gulp.task('images', function(){ // task to help optimize images
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images'],
    callback
  )
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})



gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});


gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})



