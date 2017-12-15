var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var merge = require('merge-stream');
var pump = require('pump');
var download = require('gulp-download');
var runSequence = require('run-sequence');

const paths = {
    vendor: [
        'https://raw.githubusercontent.com/UCLALibrary/OpenSeadragonScalebar/macro/openseadragon-scalebar.js'
    ]
}

gulp.task('clean', function() {
    return del('dist');
});

gulp.task('scripts', function() {
    return pump([
        merge(
            download(paths.vendor).pipe(uglify()),
            gulp.src('src/*.js').pipe(uglify())
        ),
        concat('MiradorRuler.min.js'),
        gulp.dest('dist')
    ]);
});

gulp.task('stylesheets', function() {
    return gulp.src('src/*.css')
        .pipe(cleanCSS())
        .pipe(concat('MiradorRuler.min.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
    runSequence('clean', ['scripts', 'stylesheets']);
});
