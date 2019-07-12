const spawn = require('child_process').spawn;
const gulp = require('gulp');
const babel = require('gulp-babel');
const gulp_css = require('gulp-css');
const del = require('del');

const clean = () => {
    return del(['app/'])
}

const html = () => {
    return gulp.src('public/*.html')
    .pipe(gulp.dest('app/public/'));
}

const css = () => {
    return gulp.src('src/**/*.css')
    .pipe(gulp_css())
    .pipe(gulp.dest('app/'));
}

const src = () => gulp.src(['src/**/*.js']).pipe(babel()).pipe(gulp.dest('app/src'));
const root = () => gulp.src(['*.js']).pipe(babel()).pipe(gulp.dest('app/'))

const js = gulp.parallel(src, root);

const package_json = () => gulp.src(['package.json']).pipe(gulp.dest('app/'));

const electron = () => {
    return spawn('node_modules/.bin/electron', ['.'], { stdio: 'inherit' })
    .on('close', () => process.exit(0));
}

exports.start = gulp.series(clean, html, css, js, package_json, electron);