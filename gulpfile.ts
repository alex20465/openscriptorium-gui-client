const gulp = require('gulp');
const electron = require('electron-connect').server.create();
const exec = require('child_process').exec;
const async = require('async');
const q = require('q');

gulp.task('start', () => {
    electron.start('electron.js');

    gulp.watch('electron.js', electron.restart);
    gulp.watch(['dist/**/*'], electron.reload);
});
