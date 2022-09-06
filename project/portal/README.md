# 目录结构
```
├── README.md
├── package.json          // 应用依赖包配置
├── build                 // webpack构建工程目录
├── src
│   ├── apis              // api汇总
│   ├── assets            // css|img|font等静态资源放置目录 
│   ├── components        // 公用组件
│   ├── routes            // 路由汇总 
│   ├── store             // 状态管理
│   ├── utils             // 工具
│   │   ├── http.js          // 请求封装
│   │   ├── index.js         // 一些辅助函数
│   │   └── cache.js         // 缓存共享
│   ├── views
│   │   └── demo          // 子业务
│   │       ├── api.js       // 子业务api配置文件   
│   │       ├── index.js     // 子业务单个组件
│   │       ├── store.js     // 子业务状态管理
│   │       └── route.js     // 业务路由
│   └── app.js            // 应用入口   
```
# 启动
```
npm start
npm start env=sit api=http://ross-bpm-sit.baozun.com login=https://ross-auth-sit.baozun.com
npm start env=uat api=http://ross-bpm-uat.baozun.com login=https://ross-auth-uat.baozun.com
npm start env=prod api=http://ross-bpm.baozun.com login=https://ross-auth.baozun.com
npm start host=localhost //用前端界面访问域名
```

# 构建
```
npm run build //仅构建
npm run sit   //构建sit
npm run uat   //构建uat
npm run pro   //构建生产 
```
# 业务开发注意事项

1. 本地开发调试只需首次启动即可，nodemon会自动监测build目录下文件变动后发起重启

2. 如需更新根目录下的.babelrc|.eslintrc.js|.postcssrc.js|.prettierrc.js这些文件，请变更build目录下的同名文件即可，方便触发第一点的操作，自动重启及时生效

3. views目录下仅新建可路由访问的业务子目录，非业务需要配置路由的目录请放置到外层组件或其他相关目录（demo勿删，供后来者参考）
  - **newFoleder** （[参考demo](src/views/demo)）
    - **api.js**
      - 若子业务过大，保留子业务下的api.js用于汇总，另新建apis子目录用于分模块拆分孙子业务，方便降低单文件大小和冲突率
    - **route.js**，拆分规则同api
      - 若业务路由需要直接挂载到一级，需在单条路由追加(meta: {top: true})
      - 同api拆分汇总方式
    - **store.js**
      - 业务状态管理文件（视必要性创建），拆分规则同api
    - **index.vue**
      - 若子业务过大，可在其下新建views目录用于系统管理子业务页面，反之则无需views目录
      - 子业务共享的组件若不被外层业务引用，可在其下新建components目录用于系统管理本子业务的公用组件

4. [富文本编辑器组件](http://ross-portal-sit.baozun.com/rich-text)运用案例，[source](http://ross-portal-sit.baozun.com/static/editor/index.html)

5. 目录名、文件名、变量名、函数名、样式选择器名规则和项目全局常量说明如下：
  - 文件名、目录名、路由地址统一小写(**a-b**)形式
  - 代码变量名、普通函数名统一驼峰(**aB**)
  - class、构造函数统一大写开头(**AbD**)
  - 常量统一大写(**A_B_C**)
  - css样式类(**a-b-c**)，id选择器(**a_b**)
  - **Vue/VueRouter/Vuex**已做全局变量声明，可直接使用，无需脚本里单独**import/require**
  - **Vue.prototype.$constant** *存放全局的常量配置，可直接使用，[详见](src/config/index.js)*
     - **vm.$constant.RUN_ENV.env | Vue.prototype.$constant.BUILD_ENV**
     - **RUN_ENV={env: sit|uat|prod}** *运行环境*
     - **BUILD_ENV=development|production** *构建环境*
  - **Vue.prototype.$cache** 
     - 统一缓存，提供**localStorage|cookie|sessionStorage**多存储类型的统一api调用方式，[详见](src/utils/cache.js)  
  - **Vue.prototype.$api**
     - 可供第一时间查阅接口数量、请求方式、入参要求，统一接口封装对象，[详见](src/apis/index.js)
  - **Vue.prototype.$http**
    统一请求入口，[详见](src/utils/http.js)

6. 本地开发登录问题解决办法，自行新窗口访问链接可追加登录时效，userId为各自登录的真实id(http://ross-bpm-sit.baozun.com/addCookie/:userId)

7. 项目代码编写注意几点如下：

```javascript
/*
 * api.js脚本接口配置文件说明（views/moduleName/api.js）
 */
export default {
  moduleName: {
    apiName: {
      url: 'a/b/c/:id'/*对应:id将被params传入的id实际值替换*/, 
      method?/*选填，默认get*/, 
      [params|data]?/*选填, post时为data，get时为params*/, 
      response?/*选填*/
    },

    ...
  },

  apiOtherName: {
    url: 'a/b/c/:id'/*对应:id将被params传入的id实际值替换*/, 
    method?/*选填，默认get*/, 
    [params|data]?/*选填, post时为data，get时为params*/, 
    response?/*选填*/
  },

  ...
}

/*
 * apis的index.js脚本汇总所有api配置自动生成接口网络请求函数（apis/index.js）
 */
export default {
  moduleName: {
    apiName: function (params, config = {
        headers/*针对本接口的请求头追加入参*/,
        needToast: false/*关闭该接口函数的自动错误提示，改由业务脚本自行提示处理*/,
        ...
    }) {
      return promise
    },

    ...
  },

  apiOtherName: function (params, config) {
    return promise
  },

  ...
}

/*
 * 全局http入口拦截处理方式（utils/http.js）
 * 统一错误在全局catch函数里弹出提示
 * 并继续向外抛出错误供业务里catch函数处理
 * 若需关闭提示只需在各个业务接口函数传入第二个参数：{needToast: false}）
 * 统一成功返回处理，即then的第一个函数只关注成功状态
 * 统一返回格式为:
    {
      _res: Object  // 原始响应
      data: Object  // 真实数据
      msg: String   // 消息提示
      code: Number  // 返回码
    }
 */


/*
 * async.await 注意事项
 * 如需要等待await后的expression执行完毕，注意expression一定要是同步代码或者promise实例
 * await 语句统一用try {} catch (ex) {} 包裹，做好容错处理
 * 需要 await的返回值的时候，要兼容异常返回值情形
 */
async function () {
  let response
  try {
    response = await expression;
    if (/*请求成功，业务处理失败，类似返回code||success||status非成功态条件*/) {
      throw response
    }
  } catch (ex) {
    response = ex
    // 处理失败态的业务后续流程
    // 如后续依赖此结果返回，酌情向外接力抛错如 return Promise.reject(response) 
    // 避免异常情形流入后续成功的回调(then(success, fail))
    return ex
  }

  // 处理成功态的业务后续流程
  return response
}

/*
 * 全局缓存处理方式如下：设值|取值|删除值|清空|遍历 默认缓存为localStorage
 * 无论设值和取值无需手动JSON.stringify(value)和JSON.parse(value)，api已自动完成格式转换
 */
vm.cache.set(key, value)
vm.cache.get(key, optionalDefaultValue)
vm.cache.remove(key)
vm.cache.clear()
vm.cache.each(callback) => callback.call(cache, value, key)

/*提供懒加载的 cookie 缓存方式，调用方式实例*/
vm.cache.cookie.set(key, value, millisecond, path)
vm.cache.cookie.get(key, optionalDefaultValue)
vm.cache.cookie.remove(key, path)
vm.cache.cookie.clear()
vm.cache.cookie.each(callback) => callback.call(value, key)

/*提供懒加载的 sessionStorage 缓存方式，调用方式实例*/
vm.cache.sessionsession.set(key, value)
vm.cache.session.get(key)
vm.cache.session.remove(key)
vm.cache.session.clear()
vm.cache.session.each(callback) => callback.call(value, key)
```