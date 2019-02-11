const gulp = require('gulp')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const pug = require('gulp-pug')
const livereload = require('gulp-livereload')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')

gulp.task('pug', () => {
  return gulp.src('src/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public/'))
    .pipe(livereload({ start: true }))
})

gulp.task('js', () => {
	return gulp.src('src/js/*.js')
    .pipe(babel({ presets: ['env']}))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'))
})


gulp.task('css', () => {
  const processors = [autoprefixer({browsers: ['last 5 version']})]
  return gulp.src('src/sass/*.sass')
    .pipe(sass(({outputStyle: 'compressed'})))
    .pipe(postcss(processors))
    .on('error', swallowError)
    .pipe(gulp.dest('public/css'))
    .pipe(livereload({ start: true }))
})

gulp.task('img', () => {
  return gulp.src('src/**/*.png')
    .pipe(gulp.dest('public/'))
  gulp.src('src/**/*.jpg')
    .pipe(gulp.dest('public/'))
  gulp.src('src/**/*.svg')
    .pipe(gulp.dest('public/'))
})

gulp.task('watch', () => {
  gulp.watch('src/js/*.js').on('all', gulp.series('js'))
  gulp.watch('src/**/*.pug').on('all', gulp.series('pug'))
  gulp.watch('src/sass/*.sass').on('all', gulp.series('css'))
  gulp.watch('src/img/*.*').on('all', gulp.series('img'))
})

gulp.task('default', gulp.series(gulp.series('js', 'css', 'pug', 'img'), 'watch'))

const swallowError = (error) => {
  console.error(error.toString())
  this.emit('end')
}
