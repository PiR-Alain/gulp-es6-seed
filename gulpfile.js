const gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    replace = require('gulp-replace'),
    gulpCopy = require('gulp-copy'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    uglifycss = require('gulp-uglifycss');

const srcFolder = './src/index.js',
    distFolder = './dist',
    publicFolder = './public/*',
    jsWatchPath = './src/**/*.js',
    htmlWatchPath = ['./src/**/*.html', './public/**/*.html'],
    sassWatchPath = './src/**/*.scss',
    browserDir = distFolder;

const requiredEnvVar = ['NODE_ENV'];


gulp.task('default', (callback) => runSequence('clean', ['config', 'copy-public', 'js', 'sass'], 'watch', 'browser-sync', callback));
gulp.task('build', (callback) => runSequence('clean', ['config', 'sass', 'copy-public', 'js'], callback));

gulp.task('js', () => {
    let browMe = browserify(srcFolder, {debug: (process.env.NODE_ENV === 'development'), extensions: ['es6']})
        .transform('babelify', {presets: ['env']})
        .bundle()
        .on('error', function (err) {
            console.log('[JS Error]');
            console.log(err.filename + (err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '));
            console.log('error Babel: ' + err.message + '\n');
            console.log(err.codeFrame);
            browserSync.notify('<span style="color:#F6DD3B">[JS Error]</span> ' + err.filename + (err.loc ? `( ${err.loc.line}, ${err.loc.column} )` : ''), 10000)
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write());

    if (process.env.NODE_ENV !== 'development') {
        browMe.pipe(uglify({ie8: true}))
            .pipe(gulp.dest(`${distFolder}/js`));
    } else {
        browMe
            .pipe(gulp.dest(`${distFolder}/js`))
            .pipe(browserSync.reload({stream: true}));
    }
    return browMe;
});

gulp.task('watch', () => {
    gulp.watch(jsWatchPath, ['js']);
    gulp.watch(sassWatchPath, ['sass']);
    gulp.watch(htmlWatchPath, ['copy-public', 'reload']);
});

gulp.task('reload', () => {
    return gulp.src('')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', () => {
    return gulp.src(distFolder, {read: false})
        .pipe(clean());
});

gulp.task('browser-sync', () => {
    const config = {
        server: {baseDir: browserDir}
    };
    return browserSync(config);
});

gulp.task('copy-public', () => {
    gulp.src(publicFolder)
        .pipe(gulpCopy(distFolder, {prefix: 1}))
});

gulp.task('sass', function () {
    let sassMe = gulp.src(sassWatchPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .on('error', function (err) {
            console.log('[SASS Error]');
            console.log(err.file + `( ${err.line}, ${err.column} )`);
            console.log('error Sass: ' + err.message + '\n');
            browserSync.notify('<span style="color:#CD669A">[SASS Error]</span> ' + err.file + `( ${err.line}, ${err.column} )`, 10000)
            this.emit('end');
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'));

    if (process.env.NODE_ENV !== 'development') {
        sassMe.pipe(uglifycss());
    }

    sassMe.pipe(gulp.dest(`${distFolder}/css`))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('config', () => {
    let env = {};
    if (requiredEnvVar.length) {
        for (let [key, value] of Object.entries(process.env)) {
            if (requiredEnvVar.includes(key)) {
                env[key] = value;
            }
        }
    } else {
        env = process.env;
    }
    gulp.src('config/node.env.js')
        .pipe(replace('NODE_ENV', JSON.stringify(env)))
        .pipe(gulp.dest('src/config/'));
});