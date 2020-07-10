const gulp = require("gulp");
const sync = require("browser-sync");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const replace = require("gulp-replace")
const ts = require("gulp-typescript");
const crypto = require('crypto');
let revision = crypto.randomBytes(8).toString('hex');


//----------------------------------------------------------------------------------------------------
/// config
const config = {
  useSync: true,
  paths: {
		docroot: "./src/",
		build: "./dist/"
	},
  scss: {
    src: "./src/scss/**/*.scss",
    dist: "./dist/css/",
    css: "./src/css/"
  },
  js: {
    src: "./src/js/**/*.js",
    dist: "./dist/js/"
  },
  ts: {
    src: "./src/ts/**/*.ts",
    dist: "./src/js/"
  },
  images: {
    src: [
      "./src/**/*.png",
      "./src/**/*.jpg"
    ],
		dist: "./dist/"
  },
  scripts: [{
		dist: "./dist/js/",
    concat: "./src/js/libs.js",
    src: [
			"./src/js/app.js",
			"./src/js/rellax.min.js"
		]
  }]
};


//----------------------------------------------------------------------------------------------------
/// tasks
gulp.task("build-scripts",	    function() { return funcs.scripts(); });
gulp.task("build-scss",		      function() { return funcs.scss(); });
gulp.task("build-ts",		        function() { return funcs.ts(); });
gulp.task("build-html",		      function() { return funcs.html(); });
gulp.task("build-copy",		      function() { return funcs.copy(); });
gulp.task("build-images",	      function() { return funcs.images(); });
gulp.task("sync",               function() { return funcs.startSync(); });

gulp.task("sync", (done) => {
  sync({server: {baseDir: config.paths.docroot}});
  done();
});

gulp.task("scss", (done) => {
  gulp.src(config.scss.src)
  .pipe(plumber())
  .pipe(sass({outputStyle: "expanded", errLogToConsole: true}))
  .pipe(gulp.dest(config.scss.css));
  done();
});

gulp.task("html", (done) => {
  gulp.src(config.paths.docroot + "**/*.html")
  .pipe(replace(/\.(js|css|gif|jpg|jpeg|png|svg)\?rev/g, '.$1?rev=' + revision))
  .pipe(gulp.dest(config.paths.docroot))
  done();
});

gulp.task("revision", (done) => {
  revision = crypto.randomBytes(8).toString('hex')
  console.log(revision)
  done();
});

gulp.task("reload", (done) => {
  sync.reload();
  done();
});

gulp.task("watch", (done) => {
  gulp.watch(config.scss.src, gulp.series("scss"));
  // gulp.watch(config.scss.src, gulp.series("scss", "revision", "html"));
  gulp.watch(config.paths.docroot + "**/*", gulp.series("reload"));
  done();
});

// scssをgulpでコンパイルする開発モード
gulp.task("dev", gulp.series("sync", "watch"));

// 納品ファイル一式の書き出し
gulp.task("build", gulp.parallel("build-scripts", "build-scss", "build-html", "build-images"));


//----------------------------------------------------------------------------------------------------
/// functions
const funcs = {
	scripts: () => {
    return gulp.src(config.js.src)
    .pipe(plumber())
    // .pipe(changed(config.js.dist))
    .pipe(concat("app.js"))
    // .pipe(gulp.dest(config.js.dist))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min",
    }))
    .pipe(gulp.dest(config.js.dist));
	},
	scss: () => {
    return gulp.src(config.scss.src)
    .pipe(plumber())
    // .pipe(changed(config.dist.css))
    .pipe(sourcemaps.init())
    .pipe(sass({
//			outputStyle: "expanded",
      outputStyle: "compressed",
      errLogToConsole: true
    }))
    .pipe(postcss([
      autoprefixer({
        // ☆IEは11以上、Androidは4.4以上
        // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
        // package.jsonに記述
        cascade: false
      })
    ]))
    .pipe(sourcemaps.write())
    // .pipe(gulp.dest(config.scss.dist))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: ".min",
    }))
    .pipe(gulp.dest(config.scss.dist));
  },
  ts: () => {
    return gulp.src(config.ts.src)
    .pipe(plumber())
    .pipe(ts({
      noImplicitAny: true,
      outFile: "app.js" //変更したファイル名
    }))
    .pipe(gulp.dest(config.ts.dist));
  },
  html: () => {
    return gulp.src(config.paths.docroot + "index.html")
    .pipe(replace("./css/app.css", "./css/app.min.css"))
    .pipe(replace("./js/app.js", "./js/app.min.js"))
    .pipe(replace(/\.(js|css|gif|jpg|jpeg|png|svg)\?rev/g, '.$1?rev=' + revision))
    .pipe(replace(/\<script src="\.\/js\/rellax\.min\.js"><\/script>[^\n]*$\t?/gm, ""))
    .pipe(replace(/^[ \t]*\n/gm, ""))
    .pipe(gulp.dest(config.paths.build));
  },
	copy: () => {
    return gulp.src(config.paths.docroot + "**/*")
    .pipe(plumber())
    .pipe(gulp.dest(config.paths.build));
	},
	images: () => {
    return gulp.src(config.images.src)
    .pipe(plumber())
    .pipe(changed(config.images.dist))
    .pipe(imagemin([
      imagemin.mozjpeg({
        quality: 30,
        progressive: true
      }),
      imagemin.svgo(),
      imagemin.gifsicle()
    ]))
    .pipe(gulp.dest(config.images.dist));
  }
};