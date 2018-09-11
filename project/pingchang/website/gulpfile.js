require('./string-color')();
process.env.DISABLE_NOTIFIER = true;

switch(process.argv.slice(2)[0]){
	case 'dev':
	process.env.NODE_ENV = 'development';
	break;
	case 'pre':
	process.env.NODE_ENV = 'prerelease';
	break;
	case 'pro':
	process.env.NODE_ENV = 'production';
	break;
	default:
	process.env.NODE_ENV = 'development';
}

var config = {
	env 	: process.env.NODE_ENV || 'development',
	outDir	: 'dist',
	devDir 	: 'src',
	port	: 8000,
	sass 	: {
		precision : 8,
		indentType : 'tab',
		outputStyle: process.env.NODE_ENV != 'production' ? 'compact' : 'compressed'
	},
	proxy   : {
		host: '127.0.0.1',
		port: 8002,
		path: '/',
		dir: './data'
	},
	webpack : false, //是否使用webpack 不使用为false 使用为 webpack config路径
	mdlDir  : 'node_modules',
	fileinclude: {
		prefix: "<!--",
		suffix: "-->"
	},
	babel: {
		presets: ['es2015']
	},
	htmlmin    : {
		removeComments: false,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
	},
	config : false //表示项目配置
};

console.log(('--------------------------\n当前构建环境：'+(config.env)+'\n--------------------------').greenc)

var gulp        = require('gulp');
var path        = require('path');
var glob        = require('glob');
var fs          = require('fs');
var webpack     = require('webpack');
var $           = require('gulp-load-plugins')();
var minCss      = require('gulp-clean-css');
var browserSync = require('browser-sync');
var mockServer  = require('gulp-mock-server');
var del         = require('del');
var webpack     = require('webpack-stream');
var htmlmin     = require('gulp-htmlmin');
var reload      = browserSync.reload;


//启动服务 本地开发调试

gulp.task('dev', ['clean'], ()=>{
	gulp.start('local')
});
gulp.task('local', ['fonts', 'css', 'img', 'js', 'html'], () => {
	browserSync({
		port: config.port,
		open: false,
		notify: false,
		cors: true,
		online: true,
		server: {
			baseDir: config.outDir,
			directory: true,
			middleware: [
				require('http-proxy-middleware')('/api', {
					target: 'http://127.0.0.1:9000',
					changeOrigin: true,
					logLevel: 'debug',
					onError: function (err, req, res) {
						gulp.start('proxyserve');
					}
				})
			]
		}
	});
	gulp.start('proxyserve');
	gulp.watch([config.devDir + '/**/*.@(ejs|tpl|eot|svg|ttf|woff|woff2|png|jpg|jpeg|gif|vue|scss|js)'], (event) => {
		config.nowFilePath = event.path.replace(path.join(__dirname, config.devDir, '/'), '');//当前变动的文件
		config.nowFileSep = path.dirname(config.nowFilePath).split(path.sep);
		config.nowFileName = path.basename(config.nowFilePath);
		var configDir = path.join(__dirname, config.devDir, config.nowFileSep[0], 'config.js'), webpackDir = path.join(__dirname, config.devDir, config.nowFileSep[0], 'webpack.config.js');

		config.webpack = fs.existsSync(webpackDir) ? webpackDir : false;
		if (fs.existsSync(configDir)) {
			if (event.path == configDir)
				delete require.cache[require.resolve(configDir)];
			config.config = require(configDir);
		} else {
			config.config = false;
		}
		switch (event.type) {
			case 'changed':
			case 'added':
			case 'deleted':
				fs.exists(path.join(__dirname, config.outDir, config.nowFilePath), (exists) => {
					if (exists) fs.unlinkSync(path.join(__dirname, config.outDir, config.nowFilePath));
				});
		}
	});
	gulp.watch([config.devDir + '/**/*.@(css|scss|less|styl)', '!' + config.devDir + '/hi/**'], ['css']);
	gulp.watch([config.devDir + '/**/*.js', '!' + config.devDir + '/hi/**'], ['js']);
	gulp.watch([config.devDir + '/**/*.@(eot|svg|ttf|woff|woff2)', '!' + config.devDir + '/hi/**'], ['fonts']);
	gulp.watch([config.devDir + '/**/*.@(png|jpg|jpeg|gif)', '!' + config.devDir + '/hi/**'], ['img']);
	gulp.watch([config.devDir + '/**/*.html', '!' + config.devDir + '/hi/**'], ['html']);
});

gulp.task('build', ['clean'], function () {
	gulp.start('fonts', 'css', 'img', 'js', 'html')
});

gulp.task('pre',['build']);

gulp.task('pro',['build']);

process.on("SIGINT", function(){
	gulp.start('clean', ()=>{
		process.exit(0);
	})
})

//清空图片、样式、js
gulp.task('clean', function () {
	var clearDirs = config.outDir + '/';
	return del(clearDirs)
});

//启动proxy服务
gulp.task('proxyserve', () => {
	gulp.src('.')
		.pipe(mockServer({
			...config.proxy,
			directoryListing: true,
			allowCrossOrigin: true,
			livereload: true
		}));
});

//引用字体文件
gulp.task("fonts", function () {
	return gulp.src([config.devDir + '/**/*.@(eot|svg|ttf|woff|woff2)', '!' + config.devDir + '/hi/**'])
		.pipe(gulp.dest(config.outDir))
		.pipe(reload({ stream: true }));
});

//sass
gulp.task('css', function () {
	if (config.webpack) {//webpack
		var shouldMinCss = file=>config.env !== 'development' && isMinFile(file.path);
		var bundle = function (err, stats) {
			if (err) throw new $.util.PluginError("webpack", err);
			$.util.log("[webpack]", stats.toString({
				chunks: false,
				colors: true
			}));
			cb();
			reload();
		};
		webpack(require(config.wpkDir), bundle);
	} else {
		return gulp.src([config.devDir + '/**/*.@(css|scss|less|styl)', '!' + config.devDir + '/hi/**'])
			.pipe($.changed(config.outDir, { extension: '.css' }))
			.pipe($.plumber())
			// .pipe($.sourcemaps.init())
			.pipe($.sass(config.sass).on('error', $.sass.logError))
			.pipe($.autoprefixer('last 10 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 7', 'android >= 3.0'))
			// .pipe($.sourcemaps.write('.'))//把source写在外部
			.pipe($.if(shouldMinCss,minCss()))
			.pipe(gulp.dest(config.outDir))
			.pipe(reload({ stream: true }))
			.pipe($.notify({ message: "<%= file.relative %> css complete" }));
	}
});

// 图片处理
gulp.task('img', function () {
	return gulp.src([config.devDir + '/**/*.@(png|jpg|jpeg|gif|cur)', '!' + config.devDir + '/hi/**'])
		// .pipe($.watch([config.devDir + '/'+ config.item +'/img/**/*',config.devDir + '/'+ config.item +'/img/*']))
		.pipe($.newer(config.outDir))
		.pipe($.if(/production|prerelease/.test(config.env), $.cached($.imagemin({
			progressive: true,//类型：Boolean 默认：false 无损压缩jpg图片
			optimizationLevel: 3,//类型：Number  默认：3  取值范围：0-7（优化等级）
			interlaced: true,//类型：Boolean 默认：false 隔行扫描gif进行渲染
			// multipass : true //类型：Boolean 默认：false 多次优化svg直到完全优化
		}))))
		.pipe(gulp.dest(config.outDir))
		.pipe(reload({ stream: true }))
		.pipe($.notify({ message: "<%= file.relative %> img complete" }));
});

//js
gulp.task('js', ['concatjs'], function (cb) {
	if (config.webpack) {//webpack
		var bundle = function (err, stats) {
			if (err) throw new $.util.PluginError("webpack", err);
			$.util.log("[webpack]", stats.toString({
				chunks: false,
				colors: true
			}));
			cb();
			reload();
		};
		webpack(require(config.wpkDir), bundle);
	} else {
		var concat = {};
		var babelIF = file => {
			return /production|prerelease|development/.test(config.env) && !isMinFile(file.path)
		}
		var uglifyIF = file => {
			return /production|prerelease/.test(config.env) && !isMinFile(file.path)
		}
		return gulp.src([
				config.devDir + '/**/*.js',
				'!' + config.devDir + '/**/*config.js',
				'!' + config.devDir + '/hi/**'
			])
			.pipe($.changed(config.outDir, { extension: '.js' }))
			.pipe($.plumber())
			// .pipe($.sourcemaps.init())
			// .pipe($.sourcemaps.write('.'))//把source写在外部
			.pipe($.if(babelIF, $.babel(config.babel)))
			.pipe($.if(uglifyIF, $.uglify()))
			.pipe(gulp.dest(config.outDir))
			.pipe(reload({ stream: true }))
			.pipe($.notify({ message: "js task complete <%= file.relative %>" }));
	}
});

//concat
gulp.task('concatjs', function () {
	if (config.config && config.config.js && config.config.js.concat && path.join(config.nowFileSep[0], 'config.js') == config.nowFilePath) {
		glob(path.join(config.outDir, config.nowFileSep[0]) + '/js/concat-*.js', { nodir: true }, function (err, files) {
			if (!err && files.length) {
				files.forEach(function (path) {
					fs.unlinkSync(path);
				});
			}
			for (var item in config.config.js.concat) {
				gulp.src(config.config.js.concat[item].map(function (url) {
					return path.join(config.devDir, /\.js/.test(url) ? url : url + '.js');
				}))
					.pipe($.concat(/\.js/.test(item) ? ('concat-' + item) : ('concat-' + item + '.js')))
					.pipe($.if(/production|prerelease/.test(config.env), $.uglify()))
					.pipe(gulp.dest(path.join(config.outDir, config.nowFileSep[0], 'js')));
			}
		});
	}
});

//html
gulp.task('html', _=>{
	var shouldMinHtml = file=>config.env !== 'development';
	return gulp.src(config.devDir + '/**/*.html')
	.pipe($.plumber())
	.pipe($.fileInclude(config.fileinclude))
	.pipe($.if(shouldMinHtml,htmlmin(config.htmlmin)))
	.pipe(gulp.dest(config.outDir))
})

function isMinFile(p){
	var lastDotOfIndex = p.lastIndexOf(".");
	var isMIN = p[lastDotOfIndex - 4] === '.' && p.substring(lastDotOfIndex - 3, lastDotOfIndex) === 'min';
	return isMIN;
}
