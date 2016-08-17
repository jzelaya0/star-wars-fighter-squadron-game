var gulp             = require('gulp');
var stylus           = require('gulp-stylus');
var annotate         = require('gulp-ng-annotate');
var uglify           = require('gulp-uglify');
var concat           = require('gulp-concat');
var jshint           = require('gulp-jshint');
var nano             = require('gulp-cssnano');
var rename           = require('gulp-rename');
var gulpIf           = require('gulp-if');
var notify           = require('gulp-notify');
var plubmer          = require('gulp-plumber');
var filter           = require('gulp-filter');
var sourcemaps       = require('gulp-sourcemaps');
var mainBowerFiles   = require('gulp-main-bower-files');
var imageMin         = require('gulp-imagemin');
var cache            = require('gulp-cache');
var nodemon          = require('gulp-nodemon');
var flatten          = require('gulp-flatten');
var pug              = require('gulp-pug');
var bs               = require('browser-sync');

// ==================================================
// PATHS
// ==================================================

// Source paths
// ***************
var src = {
  cssMain: 'source/assets/css/main.styl',
  cssAll: 'source/assets/css/**/*.styl',
  js: 'source/assets/js/**/*.js',
  images: 'source/assets/images/**/*.+(png|jpg|jpeg|gif|svg)',
  audio:  'source/assets/audio/**/*.+(mp3|ogg|wav)',
  templates: 'source/templates/**/*.pug',
  homePage: 'source/index.html'
};

// build
// ***************
var build = {
  css: 'public/assets/css/',
  js: 'public/assets/js/',
  libsJS: 'public/assets/libs/js/',
  libsCSS: 'public/assets/libs/css/',
  images: 'public/assets/images/',
  audio: 'public/assets/audio/',
  pages: 'public/pages/',
  homePage: 'public/',
  libsfonts: 'public/assets/libs/fonts/'
};

// ==================================================
// DEFAULT TASK
// ==================================================
gulp.task('default', ['assetsBuild','browser-sync','nodemon','watch']);

// ==================================================
// NODEMON & BROWSER SYNC TASKS
// ==================================================

// Browser Sync
// ************************
gulp.task('browser-sync', function(){
  bs.init(null, {
    files: 'public/**/*.*',
    proxy: 'http://localhost:3000',
    port: 4000
  });
});

// Start Nodemon server
// ************************
gulp.task('nodemon', function(){
  return nodemon({
    script: 'server.js'
  })
    .on('restart', function(){
      console.log('*******************\nRESTARTED NODEMON\n*******************');
    });
});


// ==================================================
// GULP TASKS
// ==================================================

// TASK: BUILD INDEX HTML
// ************************
gulp.task('homepageBuild', function(){
  return gulp.src(src.homePage)
    .pipe(gulp.dest(build.homePage))
    .pipe(bs.reload({
      stream: true
    }));
});

// TASK: BUILD PAGES
// ************************
gulp.task('pagesBuild', function(){
  return gulp.src(src.templates)
    .pipe(pug())
    .pipe(gulp.dest(build.pages))
    .pipe(bs.reload({
      stream: true
    }));
});

// TASK: BUILD CSS
// ************************
gulp.task('cssBuild', function(){
  return gulp.src(src.cssMain)
    .pipe(plubmer({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sourcemaps.init())
    .pipe(stylus({
      compress: true
    }))
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(build.css))
    .pipe(bs.reload({
      stream: true
    }));
});

// TASK: BUILD JS
// ************************
gulp.task('jsBuild', function(){
  return gulp.src(src.js)
    .pipe(jshint())
    .pipe(notify(function(file){
      if (file.jshint.success) {
        // Report nothing if it's all good
        return false;
      }
      var errors = file.jshint.results.map(function(data){
      if (data.error) {
        return "(" + data.error.line + data.error.character + ")" + data.error.reason;
      }}).join("\n");

      return file.relative + "(" + file.jshint.results.length + " errors)\n" + errors;
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(annotate())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(build.js))
    .pipe(bs.reload({
      stream: true
    }));
});


// TASK: BUILD BOWER COMPONENTS
// ************************
gulp.task('bowerBuild', function(){
  var jsFilter = filter('**/*.js', {restore: true});
  var cssFilter = filter('**/*.css', {restore: true});
  var fontFilter = filter('**/*.{eot,svg,ttf,woff,woff2}', {restore: true});

  return gulp.src('./bower.json')

    .pipe(mainBowerFiles())

    // Find vendor js from bower, minify and build in public
    .pipe(jsFilter)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(build.libsJS))
    .pipe(jsFilter.restore)

    // Find vendor css from bower, minify and build in public
    .pipe(cssFilter)
    .pipe(concat('libs.css'))
    .pipe(nano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(build.libsCSS))
    .pipe(cssFilter.restore)

    // Find vendor fonts from bower and copy to public
    .pipe(fontFilter)
    .pipe(flatten())
    .pipe(gulp.dest(build.libsfonts));
});

// TASK: BUILD IMAGES
// ************************
gulp.task('imagesBuild', function(){
  return gulp.src(src.images)
    .pipe(cache(imageMin()))
    .pipe(gulp.dest(build.images));
});

// TASK: BUILD AUDIO
// ************************
gulp.task('audioBuild', function(){
  return gulp.src(src.audio)
    .pipe(gulp.dest(build.audio));
});


// TASK: ALL ASSET BUILDS
// ************************
gulp.task('assetsBuild', ['imagesBuild', 'audioBuild', 'bowerBuild']);

// ==================================================
// WATCH FOR CHANGES
// ==================================================
gulp.task('watch', function(){
  gulp.watch(src.cssAll, ['cssBuild']);
  gulp.watch(src.homePage, ['homepageBuild']);
  gulp.watch(src.js, ['jsBuild']);
  gulp.watch(src.templates, ['pagesBuild']);
});
