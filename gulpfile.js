const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const imageMin = require('gulp-imagemin');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourceMaps = require('gulp-sourcemaps');

/**
 * @function sassToCssDist
 * @param gulp Build tool - for handle the file system, powered by Node.js
 * @param sourceMaps Creates map file
 * @param sass Transpile SCSS to CSS
 * @param autoPrefixer Adds browser support through prefixes in CSS
 * @param cleanCSS Minifies the given css
 * ___
 * @description Transpiles SCSS to CSS files and minifies the CSS for distribution
 * 1. Make a source map file with "sourceMaps.init()"
 * 2. Takes all SCSS files through the given "gulp.src()"
 * 3. Transpiles SCSS to CSS with "sass()"
 * 4. Adds browser support through "autoPrefixer()"
 * 5. Minifies CSS using "cleanCSS()"
 * 6. Finalizes the sourceMap file with "sourceMaps.write()"
 * 7. Places the CSS files to the "./dist/css/" dir
 * 
 */
const sassToCssDist = () => {	
  return gulp.src('./src/sass/*.scss')
  .pipe(sourceMaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer({browsers: ['last 2 versions']}))
    .pipe(cleanCSS())
  .pipe(sourceMaps.write('./'))
  .pipe(gulp.dest('./dist/css/'));
}

/**
 * @function imgToDist
 * @param gulp Build tool - for handle the file system, powered by Node.js
 * @param imageMin Compresses the images within the given file(s)
 * ___
 * @description Compresses given images and outputs them to distribution
 * 1. Takes the images within the "gulp.src()"
 * 2. Images get compressed with "imageMin()"
 * 3. Places all compressed images within "./dist/img/"
 * 
 */
const imgToDist = () => {
  return gulp.src('src/img/*')
    .pipe(imageMin({verbose: true}))
    .pipe(gulp.dest('./dist/img/'));
}

/**
 * @function jsToDist
 * @param gulp Build tool - for handle the file system, powered by Node.js
 * @param sourceMaps Creates map file
 * @param concat Combines files using the gulp.src path
 * @param uglify Takes the js input then outputs the minified version (needs es5 JavaScript, no support for es6 JavaScript)
 * ___
 * @description Will make one js file that is minified and transpiled.
 * 1. Will make a source map file using "sourceMaps.init()"
 * 2. Concat all js files in src dir into one file called all.js using "concat()"
 * 3. Now gulp-babel will transpile the all.js to given preset with "babel()"
 * 4. Then all.js will get minified using "uglify()"
 * 5. Finally the map file gets finalized "sourceMaps.write()"
 * 6. Lastly, the all.js file is now ready and placed in the "./dist/js/" dir
 * 
 */
const jsToDist = () => {
  return gulp.src('./src/js/*.js')
    .pipe(sourceMaps.init())
      .pipe(babel({presets:['@babel/env']}))// Babel isn't set properly (limited)
      .pipe(concat('all.js'))
      .pipe(uglify())// Needs to have es5 js to work
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
}

gulp.task('sassToDist', () => {	
  sassToCssDist();
});

gulp.task('default', function () {
  sassToCssDist();
  imgToDist();
  jsToDist();
  gulp.src('./index.html')
  .pipe(gulp.dest('./dist/'));
  gulp.watch('./src/sass/*.scss', ['sassToDist']);
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/*.scss', ['sassToDist']);
});