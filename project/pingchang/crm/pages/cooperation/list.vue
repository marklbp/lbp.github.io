<template>
    <div>
        <el-form :inline="true" class="patb">
            <el-form-item label="机构类型">
                <el-select @change="changeSelect" clearable v-model="params.type" placeholder="请选择">
                    <el-option key="Lender" label="资方" value="Lender">资方</el-option>
                    <el-option key="Guarantor" label="担保方" value="Guarantor">担保方</el-option>
                    <el-option key="ServiceProvider" label="SP" value="ServiceProvider">SP</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="机构名称">
                <el-input v-model="params.orgName" placeholder="机构名称"></el-input>
            </el-form-item>
            <el-form-item label="机构ID">
                <el-input v-model="params.orgId" placeholder="机构ID"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="params.mobilePhone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getTableData">查询</el-button>
            </el-form-item>
        </el-form>
        <!--<elTablePage :params="params" url="/lender/getInfoList" ref="tablePagination">-->
        <elTablePage :params="params" url="/lgs/relation/getInfoListAndSystemAdmin" ref="tablePagination">
            <el-table-column prop="name" width="250" label="合作机构"></el-table-column>
            <el-table-column prop="id" width="250" label="ID"></el-table-column>
            <el-table-column prop="shortName" width="250" label="简称"></el-table-column>
            <el-table-column prop="type" width="250" label="类型"></el-table-column>
            <el-table-column prop="userRealName" width="250" label="管理员"></el-table-column>
            <el-table-column prop="userMobilePhone" width="250" label="手机号"></el-table-column>
            <el-table-column prop="cooperativeStartDate" width="250" label="合作开始日"></el-table-column>
            <el-table-column prop="cooperativeEndDate" width="250" label="合作到期日"></el-table-column>
            <el-table-column prop="address" width="250" label="备注"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <router-link tag="a" v-for="(item,index) in menuBtnsList.tabButtonList" :key="index" class="el-button el-button--text el-button--small" :to="scope.row|parsePath($route.query, item)" size="small" target="_blank">{{item.name}}</router-link>
                    <!--<router-link tag="a" v-for="(item,index) in menuBtnsList.tabButtonList" :key="index" class="el-button el-button&#45;&#45;text el-button&#45;&#45;small" :to="scope.row|parsePath($route.query, item)" target="_blank" size="small">{{item.name}}</router-link>-->
                </template>
            </el-table-column>
        </elTablePage>
    </div>
</template>
<style lang="scss">
    // @import "./lender.scss"

</style>
<script>
    import elTablePage from '@/components/common/table-pagination/table-pagination'
    import {mapState} from 'vuex';
    import api from '@/api'
    import Storage from '@/plugins/storage'
    export default {
        components: {
            elTablePage
        },
        data() {
            return {
                name:'',
                ownerId: this.$route.query && this.$route.query.buttonId || 0,
                params: {
                    orgName: '',
                    id: '',
                    type: 'Lender',
                    mobilePhone: '',
                    ownerId: this.$route.query && this.$route.query.buttonId || 0
                }
            }
        },
        filters: {
            parsePath: function(row, query, button){
                let v = button.value;
                let path;
                switch(v){
                    case 'configure':
                    path = '/cooperation/default?ownerId=' + row.id + '&parentId=' + query.buttonId
                    break
                    case 'query':
                    path = '/cooperation/detail/' + row.id
                    break;
                    default :
                    path = ''
                    break;
                }
                return path;
            }
        },
        created() {
            this.$store.dispatch('getMenuButtonList', this.$route.query&&this.$route.query.buttonId)
        },
        computed: mapState({
            //ownerId: state => state.global.ownerId,
            lists: state => state.guarantor.lists,
            parentId: state => state.global.parentId,
            menuBtnsList: state => state.global.menuBtnsList,
        }),
        methods: {
            getTableData() {
                this.$refs.tablePagination.getTableData()
            },
            changeSelect(val){
                this.$refs.tablePagination.getTableData()
            }
        },
        watch: {
            'bindVal': function (news, old) {
                // console.log(news, old)
            }
        }
    }

</script>
