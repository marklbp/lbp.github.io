<template>
    <div id="sidebar">
        <router-link class="logo-con" tag="div" to="/">
            <img src="~assets/img/common/admin-logo.png" alt="">
        </router-link>
        <el-aside width="200px">
            <el-menu v-if="menu && menu.length > 0" :default-openeds="defaultIndex" :default-active="activeIndex">
                <el-menu-item v-for="(item, index) in menu" v-if="(!item.menu || item.menu.length <= 0) && !showSaasSidebar" :index="item.path||item.value" :key="index">
                    <router-link  :to="(item.path||item.value)|addQueryStr(item.id, $route.query)">{{item.name}}</router-link>
                </el-menu-item>
                <submenu v-else :menu="item" :isPrivate="isPrivate" :index="item.path||item.value" :key="index" />
            </el-menu>
        </el-aside>
    </div>
</template>
<style lang="scss">
    @import "./Sidebar.scss";
</style>
<script>
    import {mapGetters} from 'vuex'
    import submenu from './submenu'
    import api from '@/api'
    import Storage from '@/plugins/storage'
    import privateMenus from '~/config/sidebar_private.config'
    import Menus from '~/config/sidebar.config'
    import mixMenuFilter from './menu-filters'
    export default {
        props: {
            isPrivate: Boolean,
            showSaasSidebar: Boolean,
        },
        components: {
            submenu
        },
        data() {
            return {
                activeIndex: this.$route.path,
                defaultIndex: [],
                isSAAS2CRM: this.$route.path.indexOf('/saas') == 0/* && this.$route.query.userId && this.$route.query.type == 'saas'*/
            }
        }
        ,computed: {
            ...mapGetters(['menu', 'admin'])
        }
        ,mixins: [mixMenuFilter]
        ,beforeMount() {
            this.fixedActivedMenuWhenRefresh()
            this.updateMenu()
        }
        ,methods: {
            // 固定展开的菜单项
            fixedActivedMenuWhenRefresh(){
                // 基于当前路由约定处理侧边栏菜单的定位
                // /xx/update => /xx/list
                // /xx/detail => /xx/list
                // /xx/detail/xx => /xx/list
                let currname = this.$route.path;
                if (currname.indexOf('update') != -1) {
                    currname = currname.replace(/update\/\w+/, 'add');
                    this.activeIndex = currname;
                }
                if (currname.indexOf('detail') != -1) {
                    let pathArr = currname.split('/');
                    if (pathArr[pathArr.length - 1] != 'detail') {
                        pathArr.pop();
                        currname = pathArr.join('/');
                    }
                    currname = currname.replace('detail', 'list');
                    if(/reviewEnter|approvalEnter/.test(currname)){
                        currname = currname.replace('list','over')
                    }
                    this.activeIndex = currname;
                }
                let regAccount = /(saas|agency)\/account\/add\/\w+/;
                let account = 'agency';
                if(regAccount.test(currname)){

                    this.activeIndex = currname.replace(regAccount,'$1/account/list')
                }
                let regAdmission = /(saas|agency)\/admission\/\w+/;
                let admission = "agency"
                if(regAdmission.test(currname)){
                    this.activeIndex = currname.replace(regAdmission,'$1/admission/') + (this.$route.query.agencyType || this.$route.params.open);
                }
                //console.log(this.defaultIndex)

                let arr = this.activeIndex.match(/^((\/\w+)\/\w+)/);
                this.defaultIndex = []
                //console.log(this.activeIndex)
                // 显示展开菜单的索引
                if(arr)arr.forEach(a=>this.defaultIndex.push(a))
                //console.log(this.defaultIndex)
                //this.defaultIndex = ['/sp']

            },
            getPrivateVal(path){
                //return path ? /\/saas\/(?!\blist\b)/.test(path) : this.isPrivate;
                return path ? (/\/cooperation\/(?!\blist\b)/.test(path) || path.indexOf('/saas') == 0 ) : this.isPrivate;
            },
            getMenusByAPI(method,action,param, isPrivate){
                if(!api[method])return
                return api[method](param).then(res => {
                    let menu = res.data.leaf || res.data;
                    if (res && res.data && menu instanceof Array) {
                        // 更新左侧菜单
                        this.$store.dispatch(action, menu)

                        // 非私有菜单页面store里不存在登录信息时需要获取登录用户信息
                        if(!isPrivate && !this.adimin || !this.admin.realName) this.$store.dispatch("getAdminInfo")
                    }
                })
            },
            updateMenu(path){
                let isPrivate = this.getPrivateVal(path);
                let menu = Storage.get(isPrivate ? 'PRIVATE_MENUS' : 'MENUS');
                let admin = Storage.get("ADMIN");
                let getMenuMethod = isPrivate ? 'getListByparentId' : 'getResource';
                let getMenuMethodParam = isPrivate ? {parentId: this.$route.query.parentId} : {};
                let actionName = isPrivate ? 'updatePrivateMenus' : 'updateMenus';

                if(this.isSAAS2CRM){
                   // 联调经销商saas登录跳转crm
                   getMenuMethod = 'getListByparentIdResourceTree';
                   actionName = 'updatePrivateMenus';
                   getMenuMethodParam = {parentId: this.$route.query.parentId}
                } 

                // 取不到store里的菜单
                if(this.menu.length <= 0){
                    //console.log(menu)
                    if(menu && menu.length > 0){
                        // 取缓存菜单
                        // 当前登录用户与缓存登录用户信息不一致，请求接口刷新菜单
                        if(this.$route.query.userId && this.$route.query.userId != admin.id){
                            this.getMenusByAPI(getMenuMethod, actionName, getMenuMethodParam, isPrivate)
                        }else{
                            if(isPrivate){
                                // 私有菜单每次都请求接口加载
                                return this.getMenusByAPI(getMenuMethod, actionName, getMenuMethodParam, isPrivate)
                            }
                            // 当前登录用户与缓存登录用户信息一致
                            this.$store.dispatch(actionName, menu);
                        }
                    }else{
                        // 缓存里没有，通过接口请求菜单
                        this.getMenusByAPI(getMenuMethod, actionName, getMenuMethodParam, isPrivate)
                    }
                }else{
                    // 取到了store里的菜单了
                    if(isPrivate){
                        if(menu && menu.length > 0){
                            // 更新缓存的菜单
                            this.$store.dispatch(actionName, menu)
                        }else{
                            // 通过接口更新缓存的菜单
                            this.getMenusByAPI(getMenuMethod, actionName, getMenuMethodParam, isPrivate)
                        }
                    }else{
                        // 私有菜单页面跳转到普通页面
                        this.$store.dispatch(actionName, menu)
                    }
                }

                //处理非私有菜单页面登录信息
                if(!isPrivate){
                    //非私有菜单页面需要显示登录用户信息默认取不到store里的登录信息
                    if(!this.admin || !this.admin.realName){
                        if(admin && admin.realName){
                            //取缓存登录用户信息，并存store里
                            this.$store.dispatch("getAdminInfo", admin)
                        }else{
                            // 缓存取不到，refresh browser后，在非私有菜单下需要请求登录用户信息
                            this.$store.dispatch("getAdminInfo")
                        }
                    }else{
                        // 取到store里的登录信息不予处理
                    }
                }
            }
        }
        ,watch: {
            '$route.path': function(n, o){
                this.activeIndex = n;
                this.fixedActivedMenuWhenRefresh()
                this.updateMenu(n);
            }
        }
    }
</script>
