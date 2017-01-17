const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const del = require('del');
const path = require('path');
// const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const manifest = require('./package.json');
const $ = loadPlugins();
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));
const watchFiles = ['src/**/*', 'package.json', '**/.eslintrc'];

gulp.task('clean', cleanDist);
gulp.task('lint-src', lintSrc);
gulp.task('lint-gulpfile', lintGulpfile);
gulp.task('lint', ['lint-src', 'lint-gulpfile']);
gulp.task('build', ['lint', 'clean'], build);
gulp.task('watch', watch);
gulp.task('default', ['watch']);

function cleanDist(done) {
    del([destinationFolder]).then(() => done());
}

function lint(files) {
    return gulp.src(files)
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
}

function lintSrc() {
    return lint('src/**/*.js');
}

function lintGulpfile() {
    return lint('gulpfile.js');
}

function build() {
    return gulp.src(path.join('src', config.entryFileName))
        .pipe(webpackStream({
            output: {
                filename: `${exportFileName}.js`,
                libraryTarget: 'umd',
                library: config.mainVarName
            },
            module: {
                loaders: [
                    {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
                ]
            },
            devtool: 'source-map'
        }))
        .pipe(gulp.dest(destinationFolder))
        .pipe($.filter(['**', '!**/*.js.map']))
        .pipe($.rename(`${exportFileName}.min.js`))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(destinationFolder))
        .pipe(gulp.dest('demo'));

}

function watch() {
    gulp.watch(watchFiles, ['build']);
}
