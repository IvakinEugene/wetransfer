var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	browserSync = require('browser-sync'),
	sourcemaps	= require('gulp-sourcemaps'),
	pug 		= require('gulp-pug'),
	imagemin 	= require('gulp-imagemin'),
	run 		= require('run-sequence'),
	watch 		= require('gulp-watch'),
	clean 		= require('gulp-contrib-clean'),
	plumber 	= require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	csscomb 	= require('gulp-csscomb'),
	gcmq 		= require('gulp-group-css-media-queries'),
	src 		= './src',
	dist 		= './dist',
	pathImages	= '/images',
	pathJs		= '/js',
	pathFonts	= '/fonts';

gulp.task('sass', function(){
	gulp.src(src + '/scss/**/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dist))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('sassPretty', function(){
	gulp.src(src + '/scss/**/*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(gcmq('.csscomb.json'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(csscomb())
		.pipe(gulp.dest(dist))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: dist,
			directory: true
		},
		notify: false
	});
});

gulp.task('pug', function(){
	gulp.src(src + '/*.pug')
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(dist))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('images', function() {
	gulp.src([src + pathImages + '/**/*.*'])
		.pipe(imagemin())
		.pipe(gulp.dest(dist + pathImages))
});

gulp.task('js', function() {
	gulp.src(src + pathJs + '/*')
		.pipe(gulp.dest(dist + pathJs))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('fonts', function() {
	gulp.src([src + pathFonts + '/*'])
		.pipe(gulp.dest(dist + pathFonts))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('clean', function(){
	gulp.src(dist, {read:false})
		.pipe(clean());
});

gulp.task('build', function(){
	run(
		'clean',
		'images',
		'js',
		'fonts',
		'sass',
		'pug');
});

gulp.task('done', function(){
	run(
		'clean',
		'images',
		'js',
		'fonts',
		'sassPretty',
		'pug');
});

gulp.task('default', ['browser-sync', 'build'], function() {
	gulp.watch(src + '/scss/**/*.scss', ['sass']);
	gulp.watch(src + pathJs + '/**/*.js', ['js']);
	gulp.watch(src + pathImages + '/**/*', ['images']);
	gulp.watch(src + '/**/*.pug', ['pug']);
});