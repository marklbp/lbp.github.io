# 平常金服后台管理系统

### 发布库分支说明
* ft1 测试环境1
* ft2 测试环境2
* ft3 测试环境3
* master 对应线上版本（应该可以直接从开发库的主分支打包生成）

### 提测步骤
1. 发送提测邮件给测试人员
* 将主干合并至待发布分支
* 在根目录执行./upload.sh 测试环境名称[ft1|ft2|ft3]

### 上线步骤
1. 合并发布库指定分支到master
* 合并后通知运维同事，更新ucloud
* 上线验证完成后，合并开发库并删除此开发分支

### 仓库说明
* web（后端文件及前端html）
* pingchang-web-admin（前端js/css/img等）
* pingchang-web-lib (pingchang-web-admin的静态资源目录..)
* release 项目预发布仓库，存储有admin和lib内容

### 基本情况解析
* 测试-预发布-生产
* 基本针对于mac环境，win环境自行处理
* 执行upload.sh在根目录下，如没权限请执行 chmod +x upload.sh,此为zsh，自己看着改
* 字体库文件用iconfont联系ui加权限
* 新同事下载pingchang-admin-web后需要进入public中clone下pingchang-web-lib文件并改名为lib
* git常用工具sourcetree ，命令行iterm2
* 1.0项目基于layui框架


## 常用校验
* 非空验证：common.tools.notEmpty
* 日期不能大于当前天：common.tools.birthDate
* 日期必须大于当前天：common.tools.certificatesDate
* 请输入至少六位密码：common.tools.password
* 仅字母数字@.-：common.tools.strNum
* 仅字母数字中文和：common.tools.zhStrNum
* 仅字母数字中文和-和.：common.tools.zhStrNumSp
* 最少100字符：common.tools.textareaLen
* 最大最小长度：common.tools.minMaxNum
* 日期限制：common.tools.rangeDate
* 正整数限制：common.tools.integer
* 金额限制：common.tools.priceRange
* 邮政编码：common.tools.postalCode
* 小数位验证：common.tools.maxPoint
* 数字验证：common.tools.number

``` javascript
layui自带验证无需引入
phone（手机号）
email（邮箱）
url（网址）
number（数字）
date（日期）
identity（身份证）

特殊自引，需js引入
* 非空验证：notEmpty
* 出生日期：birthDate
* 日期必须大于当前天：certificatesDate
* 请输入至少六位密码：password
* 最大最小长度：minMaxNum （可设置最大最小长度data-max和data-min）
* 仅字母数字中文和@：zhStrNum
* 仅字母数字中文和-和.：zhStrNumSp
* 仅字母数字@.-：strNum
* 最少100字符：textareaLen
* 日期限制：rangeDate （可设置data-minDate和data-maxDate）格式必须位2010-01-01
* 正整数限制：integer (最高9999999)
* 金额限制：priceRange (最高999999999)
* 邮政编码：postalCode (数字5位)
* 小数位验证：maxPoint (默认最多两位，最小0，可设置data-pointmax，data-pointmin)
* 数字验证：number 正实数校验
```

##### 结束日期不能小于开始日期
* 调用方式：common.tools.notDateExceeded
* 规则：根据相同的data-validata来做判断，在结束的日期加上lay-verify="notDateExceeded"

## 常用方法

#### 地区三级联动
* 地址位于/js/components/pub_address.js
``` javascript
    //html元素规则 [.pub_province、.pub_city、.pub_area]根据元素包围[.layui-inline]定位

    layui.config({
        version: "1508153708698"
    }).extend({
        'pubAddress': '../js/components/pub_address',
    }).use('pubAddress');

    //对应js中
    layui.define(['pubAddress']

    // 设置默认省市区 eg:
    data-id="710000"
    data-id="710100"
    data-id="710101"
```
#### 模糊搜索
* 地址位于/js/components/pub_search.js
``` javascript
    //html元素规则

    layui.config({
        version: "1508153708698"
    }).extend({
        'pubSearch': '../js/components/pub_search',
    }).use('pubSearch');

    //对应js中
    layui.define(['pubSearch']

    /*
     * pubSearch.DATA:{url,name(表单前缀)，key:(字段名:name,cardNo),elemName:'class用来区分'}
    */
    pubSearch.init({
       url:common.config.defaultApi+'/enter/search',
       name:'enterBaseInfo',
       key:'name',
       elemName:'.searhCode'
    });
```





#### 全局方法
* 禁止特殊符号输入 _checkSpecificKey

## 基本约定

* 表单验证模块基本使用msg方式，notEmpty是依据title来捕获提示

###### 分支命名规则

分支 | 命名 | 规则
---  | --- |---
主分支 | master | 主分支，所有提供给用户使用的正式版本，都在这个主分支上发布
开发分支 | develop | 开发分支，永远是功能最新最全的分支(目前定义为第一版测试分支，经过此分支初步测试后才可以发布至每周上线分支)
功能分支 | feature/name/branch | 新功能分支，某个功能点正在开发阶段
发布版本 | release/name/branch | 发布定期要上线的功能
修复分支 | bugfix/name/branch | 修复线上代码的 bug
紧急修复分支 | hotfix/name/branch | 紧急修复线上代码的 bug
