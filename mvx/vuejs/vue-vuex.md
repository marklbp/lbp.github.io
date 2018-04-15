```javascript
new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
	modules
})

1.store.state = store._modules.root.state = module.state = state;

2.store.getters = store._vm.computed ~ {getterKey: () => wrappedGetter(store)}

				~ store._wrappedGetters = {getterKey: function wrappedGetter (store) {
														    return getter(
														      local.state, // local state
														      local.getters, // local getters
														      store.state, // root state
														      store.getters // root getters
														    )
														}
											}

3.store.commit(mutationKey, payload) = store._mutations[mutationKey]
								     = [
								     		function wrappedMutationHandler (payload) {
    											mutation.call(store, local.state, payload)
    										}
    									].forEach(wrappedMutationHandler=>wrappedMutationHandler(payload))

4.store.dispatch(actionKey, payload) = store._actions[actionKey]
                                     = [
	                                     	function wrappedActionHandler (payload, cb) {
											    let res = handler.call(store, {
											      dispatch: local.dispatch,
											      commit: local.commit,
											      getters: local.getters,
											      state: local.state,
											      rootGetters: store.getters,
											      rootState: store.state
											    }, payload, cb)
											    if (!isPromise(res)) {
											      res = Promise.resolve(res)
											    }
											    if (store._devtoolHook) {
											      return res.catch(err => {
											        store._devtoolHook.emit('vuex:error', err)
											        throw err
											      })
											    } else {
											      return res
											    }
											}
	                                    ][0](payload)




import Vue from 'vue'
import store from './store'
import App from './components/App.vue'

new Vue({
  store,
  el: '#app',
  render: h => h(App)
})


结合vuex实例化一个Vue对象所经历的过程分析

1.合并传入的参数

2.初始化生命周期

3.初始化事件系统

4.初始化渲染方法

5.触发钩子函数 beforeCreate, 挂载 vuex的数据仓库实例store到Vue实例上

6.初始化 injection 选项

7.初始化state，分五步
	
	a.初始化props

	b.初始化methods

	c.初始化data

	d.初始化computed

	e.初始化watch

8.初始化 provide 选项

9.触发钩子函数 created

10.调用 Vue.prototype.$mount  ->  mountComponent

11.触发钩子函数 beforeMount

12.创建Watcher渲染实例，render watch对象

	a.调用Watcher.prototype.get求渲染value值

	b.触发vm._update(vm._render(), hydrating)

	c.调用Vue.prototype._render方法创建vnode

		a.触发vm.$options.render方法，即vnode = render.call(vm._renderProxy, vm.$createElement)

		b.触发 h => h(App)，即 return vm.$createElement(App)

		c.调用createElement(vm, App, undefined, undefined, undefined, true)

		d.调用_createElement(vm, App, undefined, undefined, 2)

		e.返回 vnode = createComponent(App, undefined, vm, undefined);

		f.调用 Vue.extend(App) -> 创建Vue的继承函数Sub -> Sub.super = Vue, Sub.options = merge(Vue.options, options)
												      Sub.prototype = Object.assign(Vue.prototype,{
												      	constructor: Sub, 
												      	options.computedKey: {get: computedGetter, set: noop}
												      })
												      Sub.component = Vue.component
												      Sub.directive = Vue.directive
												      Sub.filter = Vue.filter

		g.若options.functional为真创建函数组件createFunctionalComponent()
		  若options.abstract为真创建抽象组件，例如slot

		h.执行installComponentHooks

		i.实例化 new VNode(
							'vue-component-0[?-name]', 
							{on,hooks: {init}}, 
							undef, undef, undef, 
							vm, 
							{Sub,propsData, listeners, tag, children}, 
							asyncF
						)

	d.执行Vue.prototype._update

		a.prevVnode = vm._vnode

		b.若vm._isMounted为真，触发钩子函数 beforeUpdate

		c.若prevVnode存在，vm.$el = vm.__patch__(prevVnode, vnode)

		d.若prevVnode不存在，vm.$el = vm.__patch__(vm.$el, vnode, undef, false, undef, undef)

			a.createElm(vnode, [], body, el.nextSibling)

			b.createComponent()

			c.vnode.data.init()

				a.createComponentInstanceForVnode()

					a.Sub.prototype._init() = Vue.prototype._init()

						b.initInternalComponent(vm, options);

				b.Sub的实例VueCoponent调用$mount -> Vue.prototype.$mount

13.返回Vue实例vm
```	
