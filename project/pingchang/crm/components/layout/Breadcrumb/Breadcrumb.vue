<template>
    <div id="Breadcrumb">
        <no-ssr>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">平常金服</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item,index) in breadcumbList" :key='index'>
                    <template><span>{{ item }}</span></template>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </no-ssr>
    </div>
</template>
<style lang="scss">
    @import "./Breadcrumb.scss";

</style>
<script>
    import utils from '~/utils/index'
    import Storage from '~/plugins/storage'
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        props: {
            SidebarData: Array
        }
        ,data() {
            return {
                breadcumbList: null,
                callName:''
            }
        }
        ,computed: {
            ...mapGetters(['menu'])
        }
        ,created() {
            this.getBreadcrumb();
        }
        ,methods: {
            getBreadcrumb() {
                let pathMap = process.browser && Storage.get('pathMap');
                if(!pathMap){
                    pathMap = {}
                    this.menu.forEach(m=>{
                        pathMap = Object.assign(pathMap, m.pathMap);
                    })
                    Storage.set('pathMap', pathMap);
                }

                let routePath = this.$route.path;
                let hasUpdate = routePath.indexOf('update') != -1;
                let hasEdit = routePath.indexOf('edit') != -1;
                let hasDetail = routePath.indexOf('detail') != -1;
                let hasAdd = routePath.indexOf('add') > -1;
                let regAdmission = /((?:saas|agency)\/admission\/)(?:add|edit|ssedit|detail)/;
                let regAccount = /((?:saas|agency)\/account\/)(?:add|edit|ssedit|detail)\/\w+/;
                let regReviewApproval = /((?:review|approval)Enter\/\w+\/)detail/;
                let breadcrumbs = pathMap[routePath] || [];
                let pathKeys = Object.keys(pathMap);
                let pk = [];

                if(breadcrumbs.length < 1){
                    if(hasUpdate || hasDetail || hasEdit || hasAdd){
                        if(regAdmission.test(routePath)){
                            routePath = routePath.replace(regAdmission, '$1' + this.$route.query.agencyType)
                        }
                        if(regAccount.test(routePath)){
                            routePath = routePath.replace(regAccount, '$1list')
                        }
                        if(regReviewApproval.test(routePath)){
                            routePath = routePath.replace(regReviewApproval, '$1over')
                        }
                        pathKeys.forEach(p=>{
                            if(routePath.indexOf(p) > -1){
                                pk.splice(0,1,p)
                            }
                        });
                        routePath = this.$route.path;
                        pk = pk[0];
                        breadcrumbs = [...(pathMap[pk] || breadcrumbs)]
                        if(hasUpdate || hasEdit)breadcrumbs.push('编辑');
                        if(hasDetail)breadcrumbs.push('详情');
                        if(hasAdd)breadcrumbs.push('新增');
                        pathMap[routePath] = breadcrumbs
                    }else{
                        let thisMenu = this.findMenu(this.menu, routePath);
                        thisMenu = thisMenu.length > 0 && thisMenu || ['欢迎您'];
                        breadcrumbs = pathMap[routePath] = thisMenu
                        Storage.set('pathMap', pathMap);
                    }
                    Storage.set('pathMap', pathMap);
                }else{
                    if(regAdmission.test(routePath)){
                        routePath = routePath.replace(regAdmission, '$1' + this.$route.query.agencyType);
                        pathKeys.forEach(p=>{
                            if(routePath.indexOf(p) > -1){
                                pk.splice(0,1,p)
                            }
                        })
                        pk = pk[0];
                        breadcrumbs = [...(pathMap[pk] || breadcrumbs)];
                        if(hasUpdate || hasEdit)breadcrumbs.push('编辑');
                        if(hasDetail)breadcrumbs.push('详情');
                        if(hasAdd)breadcrumbs.push('新增');
                    }
                }

                this.breadcumbList = breadcrumbs;
            }
            ,findMenu(menu, path, thisMenu){
                thisMenu = thisMenu || [];
                menu.forEach(m=>{
                    if(path.indexOf(m.path||m.value) > -1){
                        if(m.name)thisMenu.push(m.name);
                    }
                    if(m && m.menu instanceof Array && m.menu.length > 0){
                        this.findMenu(m.menu, path, thisMenu)
                    }
                })
                //console.log(thisMenu)
                return thisMenu;
            }
        }
        ,watch: {
            '$route.path': function() {
                this.getBreadcrumb()
            }
        }
    }

</script>
