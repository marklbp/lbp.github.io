```javascript
一.new Vue(options)

二.调用Vue.prototype._init(options);
	1.缓存一份实例 vm = this;
	2.vm.isVue = true;
	3.判断options._isComponent----------yes----------->a.执行initInternalComponent(vm, options)
				|
				|
				|
			    no
			    |
			    |
			    |
	            a.设置vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm)
	            
	            b.resolveConstructorOptions(vm.constructor)
	            										   获取vm父集上的options，即Vue.options

	            c.mergeOptions(Vue.options,options,vm)

	            d.if(process.env.NODE_ENV !== 'production')checkComponents(child)
	            						                                         非生产环境检查传入options中components属性中的名字是否合法（不能为slot/component或者保留的属性名），否则警告

	            e.当传入options = typeof options=='function' ? options.options : options;

	            f.normalizeProps(options, vm)
	            							 处理options中props属性，即props = {prop: {type: string|..}}

	            g.normalizeInject(options, vm)
	            							  处理options中inject属性，即inject = {key : {from: key|val}}

	            h.normalizeDirectives(child)
	            							options.directives = {
	            								key : 'function' == typeof options.directives.key ? 
	            									  options.directives.key : 
	            									  {bind: options.directives.key, update: options.directives.key}}

	            i.if(options.extends)
	            					 递归Vue.options = mergeOptions(Vue.options, options = extends, vm)

	            j.if(options.mixins)
	            					遍历mixins并递归Vue.options = mergeOptions(Vue.options, options = mixin, vm)

	            j2.for(key in Vue.options){
	            		(strats[key] || defaultStrat)(Vue.options[key],options[key],vm,key)
	            	}
	               * options[key] = options[components|directives|filters|_base] || Object.create(Vue.options[components|directives|filters|_base])
	               
	            j3.for(key in options){
	            		if(!hasOwn(Vue.options, key)){
	            			(strats[key] || defaultStrat)(Vue.options[key],options[key],vm,key)
	            		}
	            	}
	               * options[data] = strats.data(Vue.options.data,options.data,vm) 
	               				   = mergeDataOrFn(Vue.options.data,options.data,vm) 
	               				   = function mergedInstanceDataFn (){
								      var instanceData = typeof options.data === 'function'
								        ? options.data.call(vm, vm)
								        : options.data;
								      var defaultData = typeof Vue.options.data === 'function'
								        ? Vue.options.data.call(vm, vm)
								        : Vue.options.data;
								      if (instanceData) {
								        return mergeData(instanceData, defaultData)
								      } else {
								        return defaultData
								      }
								    }
								    = mergeData(instanceData, defaultData)
								    = !defaultData ? 
                                       instanceData : 
								       for (var i = 0; i < Object.keys(defaultData).length; i++){
								       		if (!hasOwn(instanceData, key)) {
										      set(instanceData, key, defaultData.key);
										      //当to为数组则添加到key位置，to.splice(key,1,defaultData.key)
										      //当为对象且不在Object.prototype上则return to.key = defaultData.key
										    } else if (isPlainObject(instanceData.key) && isPlainObject(defaultData.key)) {
										      mergeData(instanceData.key, efaultData.key);
										    }
								       }
								    //当父集的data不存在时取child的data，否则将父集中不属于子集的属性copy过去

				   * options[computed] = if('object' != typeof options.computed)warn
				   						 if(!parent.computed)return options.computed
				   						 extend(ret = Object.create(null),parent.computed)
				   						 extend(ret, options.computed)将传入计算属性覆盖到父集上的计算属性上
				   						 ret
				   						 //当父集不存在计算属性时取子集的计算属性，否则生成一个子集计算属性对象和父集的并集

				   * options[methods] =  if('object' != typeof options.methods)warn
				   						 if(!parent.methods)return options.methods
				   						 extend(ret = Object.create(null),parent.methods)
				   						 extend(ret, options.methods)将传入methods覆盖到父集上的methods上
				   						 ret

				   * options[props] =  if('object' != typeof options.props)warn
				   						 if(!parent.props)return options.props
				   						 extend(ret = Object.create(null),parent.props)
				   						 extend(ret, options.props)将传入props覆盖到父集上的props上
				   						 ret

				   * options[inject] =  if('object' != typeof options.inject)warn
				   						 if(!parent.inject)return options.inject
				   						 extend(ret = Object.create(null),parent.inject)
				   						 extend(ret, options.inject)将传入inject覆盖到父集上的inject上
				   						 ret

				   * options[watch] = if('object' != typeof options.watch)warn
				   					  if(!parent.watch)return options.watch
				   					  return [parent.samewatch,options.samewatch]

				   * options[beforeCreate|created|beforeMount|mounted|beforeUpdate|updated|beforeDestroy|destroyed] 
				   					= minxins里的钩子数组concat(options里的钩子数组)|minxins里的钩子数组|options里的钩子数组



	            k.vm._renderProxy = vm; 
	              vm._self = vm;

	            l.initLifecycle(vm)即
						            vm.$parent = vm.$options.parent
								       $root = vm.$options.parent ? vm.$options.parent.$root : vm
								       $children = []
								       $refs = {}
								       _watcher = null
								       _inactive = null
								       _directInactive = false
								       _isMounted = false
								       _isDestroyed = false
								       _isBeingDestroyed = false

		        m.initEvents(vm)即
		        					vm._events = Object.create(null)
  									   _hasHookEvent = false
  									   _events[eventName]=[fn1,fn2,...]


  				n.initRender(vm)即
  									vm._vnode = null
  									   _staticTrees = null
  									   $vnode = vm.$options._parentVnode
  									   $slots = resolveSlots(options._renderChildren, _parentVnode.context)|{name: [vnode]}
  									   $scopedSlots = emptyObject|{}
  									   _c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); }
  									   $createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  									   $attr = {}
  									   $listener = {}

  				o.callHook(vm, 'beforeCreate')触发options上的beforeCreate方法

  				p.initInjections(vm)

  				q.initState(vm)即
  								    vm._watchers = []
  								    
								    initProps(vm, options.props)
								    							vm._props = vm.$options.props
								    
								    initMethods(vm, options.methods) 
								    								检测不能和props里的属性重复
								    								不能为null
								    								vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
								    
								    initData(vm)
								    			检测不能和methods里属性重复，不能和props里的属性重复，开发环境可能会警告
								    			vm._data = vm.$options.data;
								    			proxy(vm, "_data", key)
								    			=Object.defineProperty(vm, key, {get=>vm._data.key,set=>vm._data.key=newVal})
								    			将vm.$options.data的属性代理到vm上，即对vm.key操作作用在vm._data.key上

								    			observe(vm._data, true /* asRootData */)深层次监测data
								    			vm._data.__ob__ = new Observer = {value: data, dep: new Dep(), vmCount: 0};
								    			vm._data.__ob__.walk(vm.data)
								    			defineReactive(vm._data,key)
								    			Object.defineProperty(vm._data,key,{get,set}
								    
								    initComputed(vm, options.computed)
								    								  vm._computedWatchers = {key: new Watcher} = 
								    								   {
									    								  key: {
									    								  	deep,user,lazy=true,
									    								  	sync,cb=noop,
									    								  	id,active=true,dirty=true,
									    								  	deps=[],newDeps=[],depIds=[],newDepIds=[]
									    								  	,expression,getter,value = lazy?undefined:getter()
									    								  }
									    								}
									    							  vm.key = watch.value = options.computed.key.call(vm)
								    
								    initWatch(vm, options.watch)
								    							vm._watchers.push( {key: new Watcher} = {
									    								  	deep,user = true,lazy,
									    								  	sync,cb=noop,
									    								  	id,active=true,dirty,
									    								  	deps=[],newDeps=[],depIds=[],newDepIds=[]
									    								  	,expression,getter,value = lazy?undefined:getter()
									    								  }))
									    						/*
																	建立一个watch->watch.get()
																	->pushTarget(this)
																	->Dep.target = watch
																	->会取vm上的属性值
																	->触发defineReactive闭包的get()->value
																	->if(Dep.target存在)闭包里dep.depend()
																	->watch.addDep(闭包里dep)
																    ->if(watch.newDepIds没有这个dep的id)watch.newDepIds里新增这个dep的id，同时watch.newDeps里新增这个dep
																		if(watch.depIds里也没有这个dep的id)这个闭包的dep.addSub(watch)
																	->value里子属性child下的__ob__.dep也被关联到这个watch即Dep.target.addDep(dep)，同时child下的__ob__.dep.addSub(watch)
																	->递归child里子属性，即dependArray(value)
																	->popTarget()
																	->Dep.target = undefined
																	->watch.cleanupDeps()找出watch.deps里不属于newDeps的dep，将这些dep下的subs里这个watch移除
																	  将newDepIds交换给depIds，同时将newDepIds清空，将newDeps交换给deps，同时清空newDeps
																*/

				r.initProvide(vm)
							     vm._provided = vm.$options.provide

				s.callHook(vm, 'created')
										 触发options上的created方法

				t.if(vm.$options.el)vm.$mount(vm.$option.el)
															el = 真实的dom节点
															mountComponent(vm,el,undefined)
																						   vm.$el = el
																						   vm.$options.render = vm.$options.render|createEmptyVNode

																						   触发beforeMount，callHook(vm, 'beforeMount')

																						   vm._watcher = new Watcher(vm, 
																						   		updateComponent = function () {
																						      		vm._update(vm._render(), undefined);
																						    	}, 
																						    noop, null, true);

																						    vnode = vm._render();
																						    	  = vm.$options.render.call(vm._renderProxy, vm.$createElement);
																						          vm.$vnode = vm.$options._parentVnode 

																						    vnode.parent = _parentVnode;

																						    vm._update(vnode, undefined);

																						    vm._vnode = vnode

																						    vm.$el = vm.__patch__(
																								        vm.$el, vnode, hydrating, false
																								        vm.$options._parentElm,
																								        vm.$options._refElm
																								      )

																						    vm._isMounted = true;

																						    触发mounted，callHook(vm, 'mounted');


				u. data changes->调用set设值
				               ->dep.notify()
				               ->watch.update()
				               ->queueWatcher(watch)
				               ->nextTick(flushSchedulerQueue)
				               ->flushSchedulerQueue()
				               ->for (index = 0; index < queue.length; index++)
				                 ->watch.run()->watch.handler()
				                 ->其中一个watch.handler()触发updateComponent()
				                 ->vm._render()->vm._update()
				                 ->callHook(vm,'beforeUpdated')
				               ->callUpdatedHooks(updatedQueue) | callActivatedHooks(activatedQueue)
				               ->callHook(vm, 'updated')        | callHook(vm, 'activated')

```																					   





