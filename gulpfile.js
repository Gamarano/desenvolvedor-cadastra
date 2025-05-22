const path = require("path");

const { series, src, dest, parallel, watch } = require("gulp");
const webpack = require("webpack");
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

const webpackConfig = require("./webpack.config.js");

const paths = {
  scripts: {
    src: "src/ts/index.ts",
    watch: "src/ts/**/*.ts",
  },
  styles: {
    src: "src/scss/main.scss",
  },
  img: {
    src: "src/img/**/*",
  },
  html: {
    src: "src/index.html",
  },
  dest: "dist",
  temp: ".tmp",
};

function clean() {
  return del([paths.dest, paths.temp]);
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}

function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(paths.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return new Promise((resolve, reject) =>
    webpack(webpackConfig(paths), (err, stats) => {
      if (err) {
        console.log("Webpack", err);
        return reject(err);
      }

      console.log(
        stats.toString({
          all: false,
          modules: true,
          maxModules: 0,
          errors: true,
          warnings: true,
          moduleTrace: true,
          errorDetails: true,
          colors: true,
          chunks: true,
        })
      );

      resolve();
    })
  );
}

function html() {
  return src(paths.html.src)
    .pipe(dest(paths.dest))
    .pipe(browserSync.stream());
}

function img() {
  return src(paths.img.src, { encoding: false }) 
    .pipe(dest(paths.dest + "/img"));
}

const build = series(clean, parallel(styles, scripts, html), img); 

const dev = series(build, () => {
  watch(paths.scripts.watch, { ignoreInitial: true, delay: 500 }, series(scripts))
    .on("change", browserSync.reload);
  
  watch(paths.styles.src, { ignoreInitial: true, delay: 300 }, styles);
  
  watch(paths.img.src, { ignoreInitial: true, delay: 500 }, series(img))
    .on("change", browserSync.reload);
  
  watch(paths.html.src, { ignoreInitial: true, delay: 300 }, series(html))
    .on("change", browserSync.reload);
  
  server();
});

exports.build = build;
exports.server = server;
exports.styles = styles;
exports.scripts = scripts;
exports.img = img;
exports.html = html;
exports.default = dev;