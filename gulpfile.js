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
var plumber          = require('gulp-plumber');
var filter           = require('gulp-filter');
var sourcemaps       = require('gulp-sourcemaps');
var mainBowerFiles   = require('gulp-main-bower-files');
var imageMin         = require('gulp-imagemin');
var cache            = require('gulp-cache');
var nodemon          = require('gulp-nodemon');
var flatten          = require('gulp-flatten');
var pug              = require('gulp-pug');
var bs               = require('browser-sync').create();
var reload           = bs.reload;
var errorLine        = Array(30).join('*');

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
  homePage: 'source/index.html',
  fonts: 'source/assets/fonts/*.{eot,svg,ttf,woff,woff2}'
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
  libsfonts: 'public/assets/libs/fonts/',
  fonts: 'public/assets/fonts'
};

// ==================================================
// DEFAULT TASK
// ==================================================
gulp.task('default', ['serve']);

// ==================================================
// SERVE
// ==================================================
gulp.task('serve', ['browser-sync'], function(){
  gulp.watch(src.cssAll, ['cssBuild', 'browserReload']);
  gulp.watch(src.homePage, ['homepageBuild', 'browserReload']);
  gulp.watch(src.js, ['jsBuild', 'browserReload']);
  gulp.watch(src.templates, ['pagesBuild', 'browserReload']);
});

// ==================================================
// NODEMON & BROWSER SYNC TASKS
// ==================================================

// Browser Sync
// ************************
gulp.task('browser-sync', ['nodemon'], function(){
  bs.init(null, {
    open: "ui",
    proxy: 'http://localhost:3000',
    browser: "google chrome",
    port: 4000
  });
});

// Start Nodemon server
// ************************
gulp.task('nodemon', ['assetsBuild'], function(done){
  var started = false;

  return nodemon({
    script: 'server.js',
    watch: ['app/**/*.*', 'server.js']
  })
    .on('start', function(){
      // trigger browser-sync if not running
      if(!started){
        done();
      }
      started = true;
    })
    .on('restart', function(){
      // set delayed restart for browser-sync
      setTimeout(function(){
        reload();
      }, 500);
      console.log(errorLine + "\nRESTARTED NODEMON\n" + errorLine);
    });
});


// ==================================================
// GULP TASKS
// ==================================================

// TASK: BUILD INDEX HTML
// ************************
gulp.task('homepageBuild', function(){
  return gulp.src(src.homePage)
    .pipe(gulp.dest(build.homePage));
});

// TASK: BUILD PAGES
// ************************
gulp.task('pagesBuild', function(){
  return gulp.src(src.templates)
    .pipe(plumber({
      errorHandler: notify.onError({
        message: "Error: <%= error.message %>",
        title: "PUG COMPILE ERROR!",
        sound: "Ping"
      })
    }))
    .pipe(pug())
    .pipe(gulp.dest(build.pages));
});

// TASK: BUILD CSS
// ************************
gulp.task('cssBuild', function(){
  return gulp.src(src.cssMain)
    .pipe(plumber({
      errorHandler: notify.onError({
        title: "STYLUS COMPILE ERROR",
        message: "Error: <%= error.message %>",
        sound: "Hero"
      })
    }))
    .pipe(sourcemaps.init())
    .pipe(stylus({
      compress: true
    }))
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(build.css));
});

// TASK: BUILD JS
// ************************
gulp.task('jsBuild', function(){
  return gulp.src(src.js)
    .pipe(plumber(function(){
      console.log(errorLine + "\nHEY! ERROR BUILDING JS!\n" + errorLine);
      this.emit('end');
    }))
    .pipe(jshint())
    .pipe(notify({
      sound: "Blow",
      message: function(file){
        if (file.jshint.success) {
            // Report nothing if it's all good
            return false;
          }
        var errors = file.jshint.results.map(function(data){
        if (data.error) {
          return "(" + data.error.line + data.error.character + ")" + data.error.reason;
        }}).join("\n");

        return file.relative + "(" + file.jshint.results.length + " errors)\n" + errors;
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(annotate())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(build.js));
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
// TASK: BUILD FONTS
// ************************
gulp.task('fontsBuild', function(){
  return gulp.src(src.fonts)
    .pipe(gulp.dest(build.fonts));
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

// TASK: RELOAD THE BROWSER
// ************************
gulp.task('browserReload', function(done){
  bs.reload();
  done();
});

// TASK: ALL ASSET BUILDS
// ************************
gulp.task('assetsBuild', ['imagesBuild', 'audioBuild', 'bowerBuild', 'fontsBuild']);

// TASK: HEROKU POSTBUILD
// ************************
gulp.task('herokuBuild', [
  'imagesBuild',
  'audioBuild',
  'bowerBuild',
  'homepageBuild',
  'pagesBuild',
  'cssBuild',
  'jsBuild'
]);
