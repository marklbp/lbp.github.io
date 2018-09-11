<template>
    <div class="organization">
        <titleField>
            <h1 slot='title' class="leg-text">联系人信息</h1>
            <div slot='con'>
                <div class="pch-assembly-table">
                    <aside class="pch-assembly-left">
                        <h3 class="pch-assembly-header">组织机构</h3>
                        <el-tree :data="lists" :props="defaultProps" @node-click="selectTree" node-key="id"
                                 :default-expanded-keys="[orgId]" :default-checked-keys="[orgId]"></el-tree>
                    </aside>
                    <article class="pch-assembly-right">
                        <div class="patb">
                            <el-button  v-for="(item,index) in menuBtnsList.wrapButtonList" :key="index" @click="eventBus(item.value)" class='default-sm-btn' type="primary" size="small">{{item.name}}
                            </el-button>
                        </div>
                        <el-form :inline="true" class="patb">
                            <el-form-item label="角色名称">
                                <el-input v-model="tabparams.name" placeholder="角色名称"></el-input>
                            </el-form-item>
                            <el-form-item label="角色ID">
                                <el-input v-model.number="tabparams.id" placeholder="角色ID" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="机构">
                                <el-input v-model="tabparams.departmentName" placeholder="机构"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getTableList">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <elTablePage :params="tabparams" url="/ext/role/allList" ref="tablePagination">
                            <el-table-column prop="id"  label="角色ID">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.id || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="角色名称">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.name || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="departmentName"  label="机构">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.departmentName || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="descriptions" label="角色描述">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.descriptions || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status"  label="是否有效">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.status === 1 ? '是' : '否' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button v-for="(item,index) in menuBtnsList.tabButtonList" :key="index" @click="eventBus(item.value,scope.row)"  type="text" size="small">{{item.name}}</el-button>
                                </template>
                            </el-table-column>
                        </elTablePage>
                    </article>
                </div>
            </div>
        </titleField>
        <role-modal ref="roleModal" :roleList="roleList" :currTreeId="currTreeId"></role-modal>
    </div>
</template>
<style lang="scss">
    @import "./cooperation.scss"
</style>
<script>
    import Vue from 'vue'
    import titleField from '~/components/common/title-field/title-field'
    import elTablePage from '@/components/common/table-pagination/table-pagination'
    import roleModal from './components/role-modal'
    import api from '@/api'
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                lists: [],
                orgId: '',
                tabparams: {
                    id: '',
                    departmentName: '',
                    name: ''
                },
                params: {
                    level: 1,
                    ownerId: '',
                },
                currTreeId: 0,
                rootTreId: 0,
                childrenparams: {
                    ownerId: '',
                    tree: '1'
                },
                sourceData: [],
                roleList: {
                    id: '',
                    name: '',
                    departmentId: '',
                    descriptions: '',
                    status: '1',
                    departmentName: '',
                    organizationId: 0
                },
                ownerId: this.$route.query.ownerId
            }
        },
        created() {
            this.$store.dispatch('getMenuButtonList', this.$route.query&&this.$route.query.buttonId)
            this.initData()
        },
        methods: {
            eventBus(event, item) {
                this[event](item)
            },
            initData() {
                this.params.ownerId = this.$route.query.ownerId
                api.getOrgList_ext(this.params).then((res) => {
                    // api.getOrgList(this.params).then((res) => {
                    if (res.data) {
                        let data = res.data.list;
                        this.lists = data
                        this.orgId = data[0].id
                        this.currTreeId = data[0].id
                        this.roleList.organizationId = parseInt(data[0].id)
                    }
                })
            },
            getChildren(req) {
                if (!req.children && !req.subCount) {
                    return false;
                }
                this.childrenparams.ownerId = this.ownerId
                api.getOrgChildren_ext(this.childrenparams).then((res) => {
                    let {data} = res
                    if (req.level === 1) {
                        this.lists = [data]
                    }
                })
            },

            selectTree(data) {
                // this.currTreeId = data.id || this.orgId
                this.childrenparams.id = data.id
                this.getChildren(data)
                // this.params = {
                //   id: data.id
                // }
                // this.initData()
            },
            getTableList() {
                Vue.nextTick(()=>{
                    this.$refs.tablePagination.getTableData()
                })
            },
            modify(row) {
                for (let i in this.roleList) {
                    if (row[i]) {
                        this.roleList[i] = row[i]
                    }
                }
                this.roleList.status = row.status + ''
                this.$refs.roleModal.showModal('update', row)
            },
            delete(row) {
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.delRole_ext({id:row.id,ownerId:this.$route.query.ownerId}).then((res) => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            setTimeout(() => {
                                location.href = location.href
                            }, 2000)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            add() {
                // this.roleList.departmentName = row.departmentName
                // this.roleList.organizationId = row.organizationId
                this.$refs.roleModal.showModal('add')
            },
            getTableData() {

            }
        },
        computed: mapState({
            //ownerId: state => state.global.ownerId,
            orgData: state => state.ext_org.orgList,
            menuBtnsList: state => state.global.menuBtnsList,
        }),
        components: {
            titleField,
            roleModal,
            elTablePage
        },
        layout: 'org_layouts'
    }

</script>
