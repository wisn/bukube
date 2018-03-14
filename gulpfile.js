/*!
 * Bukube Gulpfile
 */

const gulp = require('gulp');
const haml = require('gulp-haml');
const stylus = require('gulp-stylus');

gulp.task('haml', () =>
  gulp.src('./src/Haml/**/*.haml')
    .pipe(haml({ compiler: 'visionmedia' }))
    .pipe(gulp.dest('./public/'))
);

gulp.task('stylus', () =>
  gulp.src('./src/Stylus/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/css'))
);

gulp.task('default', () => {
  gulp.watch('./src/Haml/**/*.haml', ['haml']);
  gulp.watch('./src/Stylus/**/*.styl', ['stylus']);
});
