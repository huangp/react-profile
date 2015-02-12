var gulp = require('gulp'),
  mainBowerFiles = require('main-bower-files'),
  bowerNormalizer = require('gulp-bower-normalize'),
  concat = require('gulp-concat'),
  react = require('gulp-react'),
  del = require('del'),
  plumber = require('gulp-plumber'),
  watch = require('gulp-watch'),
  batch = require('gulp-batch'),
  webserver = require('gulp-webserver'),
  notify = require('gulp-notify'),
  path = {
    bowerDeps: './bower_dependencies/',
    build: './build/',
    jsxBuild: './build/jsx/'
  }
;

function notifyError(err) {
  notify.onError({
                   title:    'Gulp',
                   subtitle: 'Failure!',
                   message:  '<%= error.name %>: [<%= error.plugin %>] <%= error.message %>'
                 })(err);

  this.emit('end');

}

gulp.task('bowerMain', function() {
    return gulp.src(mainBowerFiles(), {base: './bower_components'})
        .pipe(bowerNormalizer({bowerJson: './bower.json'}))
        .pipe(gulp.dest(path.bowerDeps))
});

gulp.task('jsxTransform', function() {
    return gulp.src('app/jsx/*')
        .pipe(react())
        .pipe(gulp.dest(path.jsxBuild))
});

gulp.task('jsLibs', ['bowerMain'], function() {
  return gulp.src(path.bowerDeps + '**/*')
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(path.build))
});

gulp.task('jsApp', ['jsxTransform'], function() {
  return gulp.src(path.jsxBuild + "*.js")
    .pipe(concat('app.js'))
    .pipe(gulp.dest(path.build))
});

gulp.task('clean' ,function(cb) {
  del([
        path.jsxBuild + "**",
        path.build + "**"
        // we don't want to clean this file though so we negate the pattern
        //'!dist/mobile/deploy.json'
      ], cb);

});

gulp.task('watch', function () {

  watch(['app/*.js', 'index.html'], batch(function () {
    gulp.start('build');
  }));
});

gulp.task('copyIndex', function() {
  gulp.src('index.html')
    .pipe(gulp.dest(path.build))
});

gulp.task('webserver', ['build'], function() {
  gulp.src(path.build)
    .pipe(webserver(
              {livereload: false, port: 8888}
            ));
});

gulp.task('build', ['jsApp', 'jsLibs', 'copyIndex']);

gulp.task('default', ['webserver', 'watch'], function() {

});
