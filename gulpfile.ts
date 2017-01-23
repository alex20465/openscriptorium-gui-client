const gulp = require('gulp');
const electron = require('electron-connect').server.create();
const child_process = require('child_process');

gulp.task('start', () => {
    electron.start('electron.js');

    gulp.watch(['electron.js'], electron.restart);
    gulp.watch(['dist/**/*'], electron.reload);
    const proc = child_process.spawn('ng', ['build', '--watch']);

    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
});
