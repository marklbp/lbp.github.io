1. nuxt dev


2. 解析参数


3. 读取配置nuxt.config.js文件，合并默认配置


4. 监控nuxt.config.js文件的修改，实时编译


5. 启动编译 startDev()

	a. 创建Nuxt实例 
	nuxt = new Nuxt(options) = {
		options,
		initialized = true,
		onError = e=>e,
		_hooks = {},
		hook = e=>e,
		moduleContainer = new ModuleContainer(this),[#b]
		renderer = new Renderer(this),[#c]
		errorHandler = onError,
		render = renderer.app
		renderRoute = renderer.renderRoute.bind(this,renderer),
		renderAndGetWindow = renderer.renderAndGetWindow.bind(this.renderer)
	}

	
		b. 创建模块容器
		moduleContainer = new ModuleContainer(nuxt) = {
			nuxt = nuxt,
			options = nuxt.options,
			requiredModules = {}
	  }

	  c. 创建renderer实例
	  renderer = new Renderer(nuxt) = {
			nuxt = nuxt,
			options = nuxt.options,
			bundleRenderer = null,
			metaRenderer = null,
			webpackDevMiddleware = null,
			webpackHotMiddleware = null,
			app = connect() = {
				contructor = (req, res, next)=>{app.handle(req, res, next)},
				use = (route, fn)=>use,
				handle = (req, res, out)=>{next()},
				listen = (...rest)=>http.createServer(this)(...rest),
				addListener,
				emit,
				eventNames,
				getMaxListeners,
				listenerCount,
				listeners,
				on,
				once,
				prependListener,
				prependOnceListener,
				rawListeners,
				removeAllListeners,
				removeListener,
				setMaxListeners,
				_events = undefined,
				_eventsCount = 0,
				_maxListeners = undefined,
				route = "/",
				stack = []
			}
			resources = {
				clientManifest: null,
				serveBundle: null,
				ssrTemplate: null,
				spaTemplate: null,
				errorTemplate: parseTemplate("Nuxt.js Internal Server Error")
			}
	  }

	d. nuxt._ready = nuxt.ready().catch(e=>nuxt.onError(e))

		e. await nuxt.moduleContainer.ready()

		f. await nuxt.renderer.ready()

		g. nuxt.initialized = true

		h. nuxt.callHook('ready', nuxt)

	i. 创建builder实例
	builder = new Builder(nuxt) = {
		nuxt,
		isStatic = false,
		options = nuxt.options,
		compilers = [],
		compilersWatching = [],
		webpackDevMiddleware = null,
		webpackHotMiddleware = null,
		filesWatcher = null,
		customFilesWatcher = null,
		webpackStats = false,
		relativeToBuild = (...args)=>reativeTo(options.buildDir, ...args),
		_buildStatus = STATUS.INITIAL
	}

	j. builder.nuxt.hook('close', ()=>builder.unwatch())

	k. builder.build()
		
		i. nuxt.ready()

		ii. 移除旧目录.nuxt

		iii. 创建新目录.nuxt

		iv. 遍历options.dir.layouts所指定的目录，存取布局模版templateVars.layouts

		v. 遍历options.dir.pages所指定的目录，存取路由tempalteVars.router.routes

		vi. 将node_modules/nuxt/lib/app/*.*模版文件编译生成到.nuxt目录

	l. builder.generateRoutesAndFiles()

	m. builder.webpackBuild()webpack构建

		i. clientWebpackConfig.call(builder)

		ii. serverWebpackConfig.call(builder)

		iii. webpackDev()
