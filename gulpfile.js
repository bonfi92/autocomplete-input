const gulp = require('gulp');
const browserSync = require('browser-sync');
const rimraf = require('rimraf');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');

// Create an instance of browser sync
const server = browserSync.create();

// Paths configuration
const PATHS = {
	dist: 'dist',
	scss: 'src/scss',
	js: 'src/js'
};

const PORT = 3000;

// Remove folder dist
function clean(done) {
	rimraf(PATHS.dist, done);
}

// Compile scss into css with sourcemaps
function scss() {
	return gulp
		.src(PATHS.scss + "/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(PATHS.dist + "/css"))
}

// Start a web development server
function serve(done) {
	server.init({
		server: PATHS.dist,
		port: PORT
	});
	done();
}

// Reload the resources
function reload(done) {
	server.reload();
	done();
}

// Copy files into dist folder
function copy() {
	return gulp
		.src(['src/*.html', PATHS.js + '/**/*.js', 'db.json'])
		.pipe(gulp.dest(PATHS.dist));
}

// Listen for file changes and call reload function
function watch() {
	gulp.watch("src/*.html", gulp.series(copy, reload));
	gulp.watch(PATHS.scss + '/**/*.scss', gulp.series(scss, reload));
	gulp.watch(PATHS.js + "/**/*.js", gulp.series(copy, reload));
}

gulp.task('scss', scss);
gulp.task('build', gulp.series(clean, copy, scss));
gulp.task('default', gulp.series('build', serve, watch));
