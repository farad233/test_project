var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var server = require("browser-sync").create();
var purgecss = require('gulp-purgecss')

gulp.task('purgecss', () => {
  return gulp.src('build/css/*.css')
      .pipe(purgecss({
          content: ['build/*.html']
      }))
      .pipe(gulp.dest('build/css'))
})

gulp.task("css", function () {
    return gulp.src("dev/sass/style.scss")
      .pipe(plumber())
      .pipe(sass())
      .pipe(csso())
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest("build/css"))
      .pipe(server.stream());
  });

gulp.task("clean", function() {
    return del("build");
  });

gulp.task("js", function () {
    return gulp.src("dev/js/main.js")
    .pipe(plumber())
    .pipe(rename("main.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());
  });

gulp.task("html", function () {
  return gulp.src("dev/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function() {
  return gulp.src("dev/images/**/*.*")
    .pipe(gulp.dest("build/images"));
})

gulp.task("refresh", function (done) {
    server.reload();
    done();
  });

gulp.task("server", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("dev/*.html", gulp.series("html", "refresh"));
    gulp.watch("dev/sass/**/*.{scss,sass}", gulp.series("css"));
    gulp.watch("dev/js/*.js", gulp.series("js", "refresh"));
});


gulp.task("dev", gulp.series("clean", "html", "js", "css", "copy","purgecss", "server"))

