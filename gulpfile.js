'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Build jekyll project
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  require('child_process').spawn('jekyll', ['build', '--drafts', '--incremental'], { stdio: 'inherit' })
    .on('close', done);
});

// Rebuild and refresh jekyll project
gulp.task('jekyll-reload', ['jekyll-build'], function() {
  browserSync.reload();
});

// Start BrowserSync Server and serve _site directory
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    ui: false,
    ghostMode: {
      clicks: true,
      forms: false,
      scroll: true
    },
    logPrefix: 'studiorgb.uk',
    notify: false,
    server: {
      baseDir: '_site'
    }
  });
});

// Compile sass, minify css, autoprefix
gulp.task('sass', function() {
  gulp.src('src/sass/main.scss')
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(nano())
    .pipe(gulp.dest('_includes'));
});

// Minify js files
gulp.task('uglify', function() {
  gulp.src('_js/scripts.js')
    .pipe(uglify())
    .pipe(gulp.dest('_includes'));
});

// Watch sass and all html posts
gulp.task('watch', function() {
  gulp.watch('src/sass/**/*.scss', ['sass', 'jekyll-reload']);
  gulp.watch('src/js/*.js', ['uglify', 'jekyll-reload']);
  gulp.watch(['index.html', '_layouts/*.html', '_includes/*.html', '_posts/*', '_drafts/*'], ['jekyll-reload']);
});

// default task
gulp.task('default', ['browser-sync', 'watch']);
