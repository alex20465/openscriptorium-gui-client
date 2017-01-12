const gulp = require('gulp');
const electron = require('electron-connect').server.create();

gulp.task('start', () => {
    electron.start('electron.js');
    gulp.watch(['electron.js', 'dist/**/*'], electron.restart);
});
