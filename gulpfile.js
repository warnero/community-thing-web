var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    gulpif = require('gulp-if'),
    order = require('gulp-order'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    foreach = require('gulp-foreach'),
    debug = require('gulp-debug'),
    path =require('path'),
    merge = require('merge-stream'),
    del = require('del');

gulp.task('default', ['clean'], function() {
    gulp.start('fonts', 'styles', 'js');
});

gulp.task('clean', function(cb) {
    del(['public/assets/css', 'public/assets/js', 'public/assets/fonts'], cb)
});

gulp.task('fonts', function() {
    
    var fileList = [
        'bower_components/bootstrap/dist/fonts/*', 
        'bower_components/fontawesome/fonts/*'
    ];
    
    return gulp.src(fileList)
        .pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('styles', function() {
    
    var isBootswatchFile = function(file) {
        var suffix = 'bootswatch.less';
        return file.path.indexOf(suffix, file.path.length - suffix.length) !== -1;
    }
    
    var isBootstrapFile = function(file) {
        var suffix = 'bootstrap-',
            fileName = path.basename(file.path);
        
        return fileName.indexOf(suffix) == 0;
    }
    
    var fileList = [
        'bower_components/bootswatch/paper/bootswatch.less', 
        'bower_components/fontawesome/css/font-awesome.css'
    ];

    var newList = [
        'bootstrap_overrides/paper.less'
    ];
    
    gulp.src(newList)
        .pipe(less({
            paths: [ path.join(__dirname, './bower_components/bootswatch/paper') ]
        }))
        .pipe(gulp.dest('public/assets/css'));
        
});

gulp.task('js', function() {
    
    var fileList = [
        'bower_components/bootstrap/dist/js/bootstrap.*.js'
    ];
    
    return gulp.src(fileList)
        .pipe(gulp.dest('public/assets/js'));
});

// http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}