// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');

// tasks
gulp.task('clean', function() {
  gulp.src('./dist/*')
    .pipe(clean({force: true}));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare: true
  };
  return gulp.src('!./app/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./build/'));
});

gulp.task('minify-css', function() {
  var opts = {comments: true, spare: true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./build/'));
});

gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('copy-bower-components', function() {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('./build/'));
});

gulp.task('copy-html-files', function() {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});

gulp.task('connectDist', function () {
  connect.server({
    root: 'build/',
    port: 9999
  });
});

// default task
gulp.task('default',
  ['connect']
);

// build task
gulp.task('build',
  ['minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'connectDist']
);


