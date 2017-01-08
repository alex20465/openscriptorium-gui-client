import {setTimeout} from 'timers';
const gulp = require('gulp');
const path = require('path');
const url = require('url');
const electron = require('electron-connect').server.create();
const q = require('q');

gulp.task('start', () => {
    electron.start('electron.js');
    gulp.watch('electron.js', electron.restart);
    gulp.watch(['dist/**/*'], () => {
        electron.broadcast('changeLocation', url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
        setTimeout(electron.reload, 100);
    });
});
