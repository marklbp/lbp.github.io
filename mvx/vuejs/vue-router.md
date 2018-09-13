# 初始化VueRouter实例
1. options = {
      routes: [
        {
          path: '/a',
          name: 'a',
          component: {
            template: '<div>a</div>'
          },
          children: [
            {
              path: 'a1',
              name: 'a1',
              component: {template: '<div>a1</div>'}
            }
          ]
        }
      ]
    }

2. new VueRouter(options)

3. router = {
      options,
      app,
      apps = [],
      matcher = createMatcher(options.routes, router) = {match, addRoutes},
      beforeHooks = [],
      resolveHooks = [],
      afterHooks = [],
      mode = options.mode || 'hash',
      history = new HashHistory(router, options.base, router.fallback)
   }

4. createMatcher(options.routes, router) =>
   createRouteMap(routes) =>
    {
      pathList: [],
      pathMap: {},
      nameMap: {}
    }
    =>
    {
      match,
      addRoutes: function(routes){
        createRouteMap(routes, pathList, pathMap, nameMap)
      }
    }

5. createRouteMap(routes, pathList, pathMap, nameMap) =>
   routes.forEach(route => addRouteRecord(pathList, pathMap, nameMap, route))

6. addRouteRecord(pathList, pathMap, nameMap, route) =>
   pathList = ['/a', '/a/a1', ...]
   /**
      record = {
        path: '/a',
        regex: compileRouteRegex('/a', pathToRegexpOptions),
        components: route.components || { default: route.component },
        instances: {},
        name: route.name,
        parent: undefined,
        matchAs: undefined,
        redirect: route.redirect,
        beforeEnter: route.beforeEnter,
        meta: route.meta || {},
        props: route.props == null ? {} : route.components ? route.props : { default: route.props }
      }
    */
   pathMap = {
     '/a': record,
      '/a/a1': {
        path: '/a/a1',
        regex: compileRouteRegex('/a/a1', pathToRegexpOptions),
        components: route.components || { default: route.component },
        instances: {},
        name: route.name,
        parent: pathMap['/a'],
        matchAs: undefined,
        redirect: route.redirect,
        beforeEnter: route.beforeEnter,
        meta: route.meta || {},
        props: route.props == null ? {} : route.components ? route.props : { default: route.props }
      }
   }

   nameMap = {
     'a': pathMap['/a'],
     'a1': pathMap['/a/a1']
   }

7. new HashHistory(router, options.base, router.fallback) =>
   继承History
   ensureSlash()确保hash值以‘/’开始
   history = {
     router,
     base,
     current = START,
     pending = null,
     ready = false,
     readyCbs = [],
     readyErrorCbs = [],
     errorCbs = []
   }

# Vue安装VueRouter（Vue.use(VueRouter)）
1. VueRouter.install(Vue)

2. mixin beforeCreate和destroyed钩子函数

3. VueInstance._routerRoot = {_router, _route, ...} = VueInstance
   Vue.prototype.$router = router
   Vue.prototype.$route = router.history.current = history.current
   Vue.component('router-view', View);
   Vue.component('router-link', Link);
   Vue.config.optionMergeStrategies = strats
   strats.beforeRouteEnter =
   strats.beforeRouteLeave =
    strats.beforeRouteUpdate =
     strats.created;

# 传值给Vue实例
1. new Vue({
     router
   }) => VueInstance._init({router})

2. 执行beforeCreate钩子函数 =>
   VueInstance = {
     _routerRoot = VueInstance,
     _router = router,
     _route = history.current,
     ...
   }

3. VueRouter.prototype.init(VueInstance) =>
   router.apps = [VueInstance]
   router.app = VueInstance
   history.transitionTo(history.getCurrentLocation() = getHash(),
                        ()=>history.setupListeners(),
                        ()=>history.setupListeners())
   history.listen(route=>router.apps.forEach(app=>app._route = route)) =>
    history.cb = route=>router.apps.forEach(app=>app._route = route)

4. history.transitionTo(getHash() = hash,
                        onComplete = () => history.setupListeners(),
                        onAbort = () => history.setupListeners()) =>

   route = router.match(hash, history.current)
   history.confirmTransition(route, () => {
     history.updateRoute(route);
     onComplete && onComplete(route);
     history.ensureURL();
     if (!history.ready) {
       history.ready = true;
       history.readyCbs.forEach(cb=>cb(route))
     }
   }, err => {
     if (onAbort) onAbort(err)
     if (err && !history.ready) {
       history.ready = true;
       history.readyErrorCbs.forEach(cb => cb(err))
     }
   })

5. router.match(hash, history.current) => route
     normalizeLocation(hash, current = history.current, false, router) => location = {_normalized: true, path = hash, query = {}, hash = ''}
   => route = {
     name: location.name || (record && record.name),
     meta: (record && record.meta) || {},
     path: location.path || '/',
     hash: location.hash || '',
     query: location.query || {},
     params: location.params || {},
     fullPath: getFullPath(location, stringifyQuery$$1),
     matched: record ? [..., parentRecord, record] : []
   }

6. history.confirmTransition(route, () => {

     history.updateRoute(route); // 更新 history.current = route, this.cb(route), 执行全局的 afterEach 钩子
     onComplete && onComplete(route); // 执行history.transitionTo传入的onComplete
     history.ensureURL();
     if (!history.ready) {
       history.ready = true;
       history.readyCbs.forEach(cb=>cb(route))
     }
   }, err => {
     if (onAbort) onAbort(err)
     if (err && !history.ready) {
       history.ready = true;
       history.readyErrorCbs.forEach(cb => cb(err))
     }
   })
   a. 当跳转同一路由时执行 ensureURL() 和 abort()
      ensureURL() => getHash() !== history.current.fullPath => replaceHash(current)
      abort(err = undefined) => (err && history.errorCbs.forEach(cb=>cb(err))) || history.setupListeners()
       history.setupListeners() => supportPushState && router.options.scrollBehavior && setupScroll() && 监听 popState或者hashchange事件

   b. resolveQueue(this.current.matched, route.matched = [..., parentRecord, record]) = {
        updated: [], //找出route.matched中与current相同祖父级路由record
        activated: route.matched, //找出route.matched中与current不同的路由record
        deactivated: current.matched //current中与route不同的路由record
      }
      queue = [].concat(
        extractLeaveGuards(deactivated), // 待销毁组件内部的 beforeRouteLeave 钩子

        this.router.beforeHooks, // 通过router.beforeEach(hookFn)添加的全局 beforeEach 钩子

        extractUpdateHooks(updated), // 重渲染组件内部的 beforeRouteUpdate 钩子

        activated.map(function (m) { return m.beforeEnter; }), // 激活路由里的 beforeEnter 钩子

        resolveAsyncComponents(activated) // (to, from, next) => ...
      )

   c. extractLeaveGuards(deactivated) => extractGuards(deactivated, name = 'beforeRouteLeave', bindGuard = bind, reverse = true) =>
      /**
        record = {
          path: '/a',
          regex: compileRouteRegex('/a', pathToRegexpOptions),
          components: route.components || { default: route.component },
          instances: {},
          name: route.name,
          parent: undefined,
          matchAs: undefined,
          redirect: route.redirect,
          beforeEnter: route.beforeEnter,
          meta: route.meta || {},
          props: route.props == null ? {} : route.components ? route.props : { default: route.props }
        }
      */

      deactivated.map(record => {
        return Object.keys(record.components).map(key => {
            return ((component, instance = undefined, record, key = 'default') => {
              // 组件内部的 beforeRouteLeave 钩子
              var guard = (typeof component !== 'function' && Vue.extend(component) || component)['beforeRouteLeave']

              return !guard ?
               undefined : guard is not Array ?
                bind(guard, instance = undefined, record, key = 'default')
                 : guard.map(g => bind(g, instance = 'undefined', record, key = 'default'))
            })(record.components[key] = route.component, record.instances[key] = undefined, record, key = 'default')

            // beforeRouteLeave || [beforeRouteLeave1, beforeRouteLeave2, ...]
        })

        // [beforeRouteLeave] || [beforeRouteLeave1, beforeRouteLeave2, ...]
      })
      => [beforeRouteLeave, ...] || [beforeRouteLeave1, beforeRouteLeave2, ...] = deactivatedArr
      => Array.prototype.reverse.call(deactivatedArr)

      extractUpdateHooks(updated) => extractGuards(updated, 'beforeRouteUpdate', bindGuard) =>
      [beforeRouteUpdate] || [beforeRouteUpdate1, beforeRouteUpdate2, ...]

    d. queue = [beforeRouteLeave, ..., beforeEach, ..., beforeRouteUpdate, ..., route.beforeEnter, ..., ...]

       runQueue(queue, iterator, cb) => step = iterator( hook = queue[i], next = ()=>step(i+1) ) =>

       iterator(hook = beforeRouteLeave,  cb = step) =>

       beforeRouteLeave(to = route, from = current, $next = to => ...) // 待销毁组件内部的 beforeRouteLeave 钩子

       beforeEach(to = route, from = current, $next = to => ...) // 通过router.beforeEach(hookFn)添加的全局 beforeEach 钩子

       beforeRouteUpdate(to = route, from = current, $next = to => ...) // 重渲染组件内部的 beforeRouteUpdate 钩子

       beforeEnter(to = route, from = current, $next = to => ...) // 激活路由里的 beforeEnter 钩子

       // 当queue队列执行完执行 runQueue函数第三个参数 cb 函数，进入下次runQueue递归，开启跳转路由钩子执行周期

       extractEnterGuards(activated, postEnterCbs = [], isValid = () => history.current === route)
       extractGuards(activated, 'beforeRouteEnter', bind = (component, instance, record, key) => {
         return bindEnterGuard(component, record, key, postEnterCbs = [], isValid)
       })
       queue = [
          routeEnterGuard = (to, from, $next) => beforeRouteEnter(to, from, cb => $next(cb)),
          ...,
          ...history.router.resoveHooks, ...
        ]

       runQueue(queue, iterator, cb) =>

       iterator(hook = beforeRouteEnter,  cb = step) =>
       // bindEnterGuard(to, from, $next)
       beforeRouteEnter(to = route, from = current, $next = to => ...) // 激活路由组件内部的 beforeRouteEnter 钩子

       beforeResolve(to = route, from = current, $next = to => ...) // 全局路由实例 beforeResolve 钩子

       // 当queue队列执行完执行 runQueue函数第三个参数 cb 函数
       if(history.pending !== route) abort() // 放弃 -> 执行history.transitionTo传入的onAbort(), history.readyErrorCbs(route)
       history.pending = null
       // 执行 history.confirmTransition()的第二个参数onComplete参数
       history.updateRoute(route);
         history.current = route,
         history.cb(route)
         afterEach(to, from) // 通过router.afterEach(hookFn)添加的 afterEach 钩子
       onComplete && onComplete(route); // 执行history.transitionTo传入的onComplete // (route) => history.setupListeners()
       history.ensureURL();
       if (!history.ready) {
         history.ready = true;
         history.readyCbs.forEach(cb=>cb(route))
       }
       //回到runQueue第三个cb的执行栈 postEnterCbs = [() => poll(cb, record.instances, key, isValid), ...]
       if (history.router.app) history.router.app.$nextTick(() => postEnterCbs())

