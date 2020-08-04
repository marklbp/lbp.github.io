# nuxt | nuxt dev ，查询node_modules/nuxt/bin 
		```js
		// nuxt/bin/nuxt.js
		require('@nuxt/cli').run()

		// @nuxt/cli/cli.js 
		require('@nuxt/cli/dist/cli.js').run()
		require('@nuxt/cli/dist/cli-index.js').run()

		// @nuxt/cli/cli-index.js
		argv = ['dev']
		nuxtCmd.cmd = await getCommand('dev').then(() => require('@nuxt/cli/dist/cli-dev.js'))
		nuxtCmd.cmd = {
			name = 'dev',
			options = {},
			run = async () => (),
			startDev = async () => (),
			_listenDev = async () => (),
			...
		}
		NuxtCommand.run(cmd, argv.slice(1), hooks = {})
		nuxtCmd = new NuxtCommand(cmd, argv = [], hooks = {}) = {cmd, _argv, _hooks = [], _parsedArgv}
		nuxtCmd.run()
		nuxtCmd.cmd.run(nuxtCmd)

		// @nuxt/cli/cli-dev.js
		nuxtCmd.cmd.startDev(nuxtCmd, nuxtCmd.argv)
		nuxtCmd.cmd._listenDev(nuxtCmd, nuxtCmd.argv)

		// @nuxt/cli/cli-index.js
		config = await nuxtCmd.getNuxtConfig({ dev: true, _build: true })
		nuxt = await nuxtCmd.getNuxt(config)

		// @nuxt/core/dist/core.js
		nuxt = await new require('@nuxt/core/dist/core.js').Nuxt(config) = {
			options = config,
			resolver,
			moduleContainer
		}
		nuxt.resolver = new Resolver(nuxt)
		nuxt.moduleContainer = new ModuleContainer(nuxt)
		nuxt.initServer()

		// @nuxt/server/dist/server.js
		nuxt.server = new require('@nuxt/server/dist/server.js').Server(nuxt) = {
			optiond = config,
			nuxt,
			globals,
			publicPath,
			resources = {},
			listeners = [],
			app = connect()
		}

		// @nuxt/core/dist/core.js:initServer()
		nuxt.renderer = nuxt.server
		nuxt.render = nuxt.server.app = require('connect')() = (req, res, next) => {next()}

		// @nuxt/core/dist/core.js:constructor()
		await nuxt.ready()

		// @nuxt/core/dist/core.js:ready()
		await nuxt._init()
		
		// @nuxt/core/dist/core.js:_init()
		await nuxt.moduleContainer.ready()
		await nuxt.server.ready()

		// @nuxt/server/dist/server.js:ready()
		await nuxt.server.nuxt.callHook('render:before', nuxt.server, nuxt.server.options.render)
		nuxt.server.serverContext = {nuxt, globals, config, resources}

		// @nuxt/vue-renderer/dist/vue-renderer.js:new VueRenderer()
		nuxt.server.renderer = require('@nuxt/vue-renderer').VueRenderer(nuxt.server.serverContext) = {
			serverContext: {
				nuxt, globals, config,
				resources = {
					...resources,
					clientManifest: undefined,
					modernManifest: undefined,
					serverManifest: undefined,
					ssrTemplate: undefined,
					spaTemplate: undefined,
					errorTemplate: this.parseTemplate('Nuxt.js Internal Server Error')
				}
			},
			options: config,
			renderer: {
				ssr: undefined,
				modern: undefined,
				spa: undefined
			},
			_state: 'created',
			_error: null,
			_readyPromise: undefined,
			distPath: 
		}
		await nuxt.server.renderer.ready()

		// @nuxt/vue-renderer/dist/vue-renderer.js:VueRenderer.prototype.ready()
		nuxt.server.renderer._ready()

		// @nuxt/vue-renderer/dist/vue-renderer.js:VueRenderer.prototype._ready()
		// development mode
		nuxt.hook('build:resources', mfs => nuxt.server.renderer.loadResources(mfs))
		// production mode
		// nuxt.server.renderer.loadResources(fs)
		await nuxt.server.setupMiddleware()

		// @nuxt/server/dist/server.js:setupMiddleware()
		await nuxt.callHook('render:setupMiddleware', nuxt.server.app)
		staticMiddleware = require('serve-static')('@projectSrc/static', 'static')
		nuxt.server.useMiddleware(staticMiddleware)
		nuxt.server.useMiddleware((req, res, next) => {
			if (!nuxt.server.devMiddleware) return next()
			nuxt.server.devMiddleware(req, res, next)
		})
		nuxt.server.options.debug ? nuxt.server.useMiddleware({
			path: '__open-in-editor', handler: launchMiddleware(nuxt.server.options.editor)
		}) : ''
		nuxt.server.options.serverMiddleware.forEach(severMiddleware => {
			nuxt.server.useMiddleware(severMiddleware)
		})
		nuxt.server.useMiddleware(nuxtMiddleware({
			options: nuxt.server.options,
			nuxt: nuxt,
			renderRoute: nuxt.server.renderer.renderRoute,
			resources: nuxt.server.resources
		}))
		await nuxt.callHook('render:errorMiddleware', nuxt.server.app);
		nuxt.server.useMiddleware(errorMiddleware({
			resources: nuxt.server.resources,
      options: nuxt.server.options
		}))

		// @nuxt/server/dist/server.js:useMiddleware()
		const { route, handle } = nuxt.server.resolveMiddleware(middleware) = {
			handle = () => (), route = '/xx/x'
		}
		nuxt.server.app.use(route, handle)

		// @nuxt/server/dist/server.js:ready()
		await nuxt.server.nuxt.callHook('render:done', nuxt.server)

		// @nuxt/core/dist/core.js:_init()
		await nuxt.callHook('ready', nuxt)

		// @nuxt/cli/cli-dev.js:_listenDev()
		await nuxt.server.listen()

		// @nuxt/cli/cli-server.js:Server.prototype.listen()
		listener = new Listener({
			port, host, socket, https,
			app = nuxt.server.app,
			dev = true,
			baseURL = '/'
		}) = {
			port, host, socket, https, app, dev, baseURL,
			listening,
			_server,
			server,
			address,
			url
		}
		await listener.listen()
		
		// @nuxt/cli/cli-server.js:Listener.prototype.listen()
		listener._server = http.createServer(app)
		// req
		listener.server = listener._server.listen({port, host, exclusive = false}, err => err)

		// @nuxt/cli/cli-server.js:Server.prototype.listen()
		nuxt.server.listener.push(listener)
		await nuxt.callHook('listen', listener.server, listener)
		```

# 总结调用栈如下：
	nuxt 
		-> @nuxt/cli/cli-index.js:run()
		
		-> @nuxt/cli/cli-dev.js:startDev()

		-> @nuxt/cli/cli-dev.js:_listenDev()

		-> @nuxt/core:Nuxt.prototype.ready()

		-> @nuxt/server:Server.prototype.ready()
		
		-> @nuxt/server:Server.prototype.listen()

# nuxt build 

3. 读取配置nuxt.config.js文件，合并默认配置

4. 监控nuxt.config.js文件的修改，实时编译

5. 启动编译 startDev()

	a. 创建Nuxt实例
	```js
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
  ```
	
	b. 创建模块容器
		```js
		moduleContainer = new ModuleContainer(nuxt) = {
			nuxt = nuxt,
			options = nuxt.options,
			requiredModules = {}
	  }
		```

	c. 创建renderer实例
		```js
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
    ```
	d. nuxt._ready = nuxt.ready().catch(e=>nuxt.onError(e))

	e. await nuxt.moduleContainer.ready()

	f. await nuxt.renderer.ready()

	g. nuxt.initialized = true

	h. nuxt.callHook('ready', nuxt)

	i. 创建builder实例
	```js
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
  ```
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
