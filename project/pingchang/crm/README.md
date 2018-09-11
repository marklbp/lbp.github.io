# pingchang-v2（贷中erp）

## Build Setup

> Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).


# 相关技术/组件
### webpack
* https://webpack.github.io/
* https://webpack.js.org/
* https://doc.webpack-china.org/
* http://zhaoda.net/webpack-handbook/configuration.html

### sass
* https://www.w3cplus.com/sassguide/
* http://sass.bootcss.com/
* https://www.sass.hk/

### 其他部分插件
* [vee-validate,验证组件](http://vee-validate.logaretm.com/index.html#about)
* [vue-i18n,全球化](https://github.com/kazupon/vue-i18n)

## Directory

```
│  .babelrc           babel配置
│  .editorconfig
│  .eslintignore  
│  .eslintrc.js       eslintrc配置
│  .gitignore
│  package.json
│  README.md
│  nuxt.config.js  nuxt项目总配置
│
├─.nuxt                打包生成文件，用以线上部署   │  
├─dist                 打包生成文件，用以线上静态部署
│
│
├─api          公用请求存放 
│ 
├─assets       sass\js\css引用方式为～/assets 
│ 
├─components   
   ├─ common 公用组件模块 
   ├─ layout 公用布局组件模块
│
│
├─config       公用配置模块 
│
│
└─components   
   ├─ common 公用组件模块 
   ├─ layout 公用布局组件模块
│
│
├─layouts    nuxt项目布局目录 │
│
├─middles    nuxt中间件目录 
│
│
├─pages      nuxt页面目录 
│
│
├─plugins    nuxt插件目录 
│
│
├─static     nuxt静态文件目录 引用方式为/logo.png 项目启动会自动static映射为‘/’下 
│
│
└─store   
   ├─ common  公用vuex部分 
   ├─ modules 模块化vuex
│
│
├─test     自己建立用来写测试文件
│
│
└─utils  工具目录
```
## 代码规范

### css部分
* 所有sass文件引入@import "base/main";
* 定义通用字体大小、颜色、按钮尺寸等_variables
* 定义所有继承_mixin
* 超过三次引用尽量公用
* [css代码规范](http://zhibimo.com/read/Ashu/front-end-style-guide/css/structure.html)

### vue/js部分
#### /components
* /common/table-pagination表格分页
```
<elTablePage :params="params" url="/lender/search">
      <el-table-column prop="code" width="250" label="资金方编码"></el-table-column>
</elTablePage>    
/pages/lender/list.vue

```
* /common/title-field标题栏目公用
```
<titleField>
    <h1 slot='title' class="leg-text">标题</h1>
    <div slot='con'>内容</div>
</titleField> 
一个模块一个标题形式
```

### axios
```
// /api/index.js
import request from '@/plugins/axios'
const api = {
  // 资方列表
  async fetchLenderList(params) {
    let { data } = await request.get('/lender/search',params)
    return data
  },
  // 出账列表
  async  fetchList(params) {
    let { data } = await request.get('/outaccount/apply/detail',params)
    return data
  }
}
export default api
```
```
// /store/modules/xxx.js
import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'
export default {
  state: {
     lists: []
  },
  mutations: {
    LENDER_LIST(state, data) {
      state.lists = data
    }
  },
  actions: {
    getLenderList({ commit },parames) {
      api.fetchLenderList().then((res) => {
        commit(types.LENDER_LIST, res.list)
      })
    }
  }
}

// /store/index.js引入并命名/modules/下面的文件
```
### vee-validate
```
//页面内
const dictionary = {
  zh_CN: {
    custom:{
      lender:{
        type:{
          required: () => '类型不能为空'
        }
      }
    },
    messages: {
      lender: {
        code: () => 'ssss',
      }
    },
    attributes: {
      lender: {
        code: '资方编码'
      }
    }
  }
};

Validator.localize(dictionary);

//vue
<p>
	<input v-validate="'required|sss'" name="sss" type="text" placeholder="sss">
	<span v-show="errors.has('sss')">{{ errors.first('sss') }}</span>
</p>

//公用
Validator.extend('sss', {
  getMessage: field =>  field + '必须是一个手机号.',
  validate: value =>  {return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)}
});

//按钮触发
onSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          console.log('ok?')
          return;
        }
        console.log('咋啦');
      });
}      
```

##### 常规上线步骤
* npm run build编译后将文件传至服务器ssh ubuntu@118.25.10.254
* 服务器目录为/home/nuxt （需要上传的未见为package.json和.nuxt文件）(如果要代理必须要传nuxt.config.js配置文件)
* 安装好node（推荐nvm）和 yarn，npm i --production 或者yarn --production 安装好后运行npm run start启动服务
* 需要配置好nginx(ubuntu下的配置为：/etc/nginx/nginx.conf查看内容可以看到底部引入
include/etc/nginx/conf.d/*.conf;
include/etc/nginx/sites-enabled/*;
进入sites-enabled目录下配置nginx的sercer代理即可
)
* 后面尽量改为docker一键部署或者ci方式

###### 分支命名规则

分支 | 命名 | 规则
---|---|---
主分支 | master | 主分支，所有提供给用户使用的正式版本，都在这个主分支上发布
开发分支 | develop | 开发分支，永远是功能最新最全的分支(目前定义为第一版测试分支，经过此分支初步测试后才可以发布至每周上线分支)
功能分支 | feature/name/branch | 新功能分支，某个功能点正在开发阶段
发布版本 | release/name/branch | 发布定期要上线的功能
修复分支 | bugfix/name/branch | 修复线上代码的 bug
紧急修复分支 | hotfix/name/branch | 紧急修复线上代码的 bug

###### git命令||souretree步骤
* 首先拉取本分支代码，再将master合并至本分支，避免上线冲突
* 解决冲突后合并至develop分支解决冲突，更新服务器代码./pull.sh操作
* 在[jira]中关闭相关任务且分配至测试，且添加相关备注描述
* 经过测试测试无误后合并至每周上线分支常规为：release/年-月-日


## 使用docker快速开始
- 首先，需要访问[docker官网](https://www.docker.com/)根据不同操作系统获取docker
- docker官方文档：https://docs.docker.com/
- mongo dockerhub文档：https://hub.docker.com/_/mongo/ （关于auth/volumes一些问题）

``` bash
# development mode（use volumes for test-edit-reload cycle）
# 开发模式(使用挂载同步容器和用户主机上的文件以便于开发)
# Build or rebuild services
docker-compose build
# Create and start containers
docker-compose up

# production mode
# 生产模式
# Build or rebuild services
docker-compose -f docker-compose.prod.yml build
# Create and start containers
docker-compose -f docker-compose.prod.yml up

# 进入容器开启交互式终端
# (xxx指代容器名或者容器ID，可由`docker ps`查看)
docker exec -it xxx bash
```
https://github.com/BUPT-HJM/vue-blog


> 注：为了防止生产环境数据库被改写，生产模式数据库与开发环境数据库的链接不同，开发环境使用vue-blog，生产环境使用vue-blog-prod,具体可以看docker-compose配置文件

```
阿里云ECS服务器 centos7

0、安装配置 nvm（node） mysql nginx（Tengine）

1、下载xftp 连接自己服务器，把自己的项目丢进去。

2、cd myproject

3、yarn install（npm install）

4、配置数据库配置文件

5、配置nginx 文件 进行代理 代理所有80端口

6、npm run dev

7、npm run build

8、上面忘记安装pm2， yarn add pm2 （开启 node server 使用）

9、pm2 start build/mian.js

10、查看 pm2 list 列表，查看启动状态

11、pm2 monit 监视所有进程

12、开启 ./nginx

13、如果一切正常，但是访问不通，可以pm2 logs 查看是否报错？
```

https://github.com/github1586/nuxt-bnhcp

```
//去除不必要的js加载
render: {
    resourceHints: false
}
//自定义路由写法借鉴
module.exports = {
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  }
}
[来自](http://notes.jimliang.com/2017/%E6%88%91%E5%9C%A8%E4%BD%BF%E7%94%A8nuxtjs%E7%9A%84%E8%BF%87%E7%A8%8B%E4%B8%AD%E9%81%87%E5%88%B0%E7%9A%84%E5%9D%91/)
```

