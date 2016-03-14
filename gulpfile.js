var gulp = require('gulp');

gulp.task('watch', ['browserSync'], function(){
    gulp.watch('src/css/*.css', browserSync.reload);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/*.js', browserSync.reload);

});

var browserSync = require('browser-sync').create();

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'src'
        },
    })
})