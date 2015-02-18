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
    bowerComps: './bower_components/',
    npmDeps: './node_modules/',
    build: './build/',
    jsxBuild: './build/jsx/',
    fakeServerData: './fakeServer/'
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
  return gulp.src(path.bowerDeps + '**/*.js')
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(path.build))
});

gulp.task('cssLibs', ['bowerMain'], function() {
  return gulp.src(path.bowerDeps + "**/*.css")
    .pipe(concat('libs.css'))
    .pipe(gulp.dest(path.build))
});

gulp.task('jsApp', ['jsxTransform'], function() {
  return gulp.src(path.jsxBuild + "*.js")
    //.pipe(concat('UserContributions.js'))
    .pipe(gulp.dest(path.build))
});

gulp.task('clean' ,function(cb) {
  del([
        path.jsxBuild + "**",
        path.build + "**",
        path.bowerDeps + "**",
        path.bowerComps + "**",
        path.npmDeps + "**"
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
  gulp.src([path.build, path.fakeServerData])
    .pipe(webserver(
              {livereload: false, port: 8888}
            ));
});

gulp.task('build', ['jsApp', 'jsLibs', 'cssLibs', 'copyIndex']);

gulp.task('copyDist', ['build'], function() {
  gulp.src(path.build + 'UserContributions.js')
    .pipe(gulp.dest('/home/pahuang/work/root/server/zanata-war/src/main/webapp/resources/script/'));
  gulp.src(path.build + 'UserContributions.js')
    .pipe(gulp.dest('/NotBackedUp/tools/jboss-eap/standalone/deployments/zanata.war/resources/script/'))

});

gulp.task('default', ['webserver', 'watch'], function() {

});
