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
                            <el-button v-for="(item,index) in menuBtnsList.wrapButtonList" :key="index"
                                       @click="eventBus(item.value)" class='default-sm-btn' type="primary" size="small">
                                {{item.name}}
                            </el-button>
                        </div>
                        <div v-if="FLAG">
                            <el-form :inline="true" class="patb">
                                <el-form-item label="姓名">
                                    <el-input v-model.number="tabparams.realName" placeholder="姓名"
                                              type="text"></el-input>
                                </el-form-item>
                                <el-form-item label="登录名">
                                    <el-input v-model="tabparams.userName" placeholder="登录名"></el-input>
                                </el-form-item>
                                <el-form-item label="机构">
                                    <!--<el-cascader change-on-select :options="orgData" :show-all-levels="false"-->
                                    <!--v-model="tabparams.organizationName" @change="selectParentIdPar"-->
                                    <!--:props="props"></el-cascader>-->
                                    <el-input v-model="tabparams.organizationName" placeholder="机构"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="handlesearch">查询</el-button>
                                </el-form-item>
                            </el-form>
                            <elTablePage :params="tabparams" url="/user/getInfoListByDepartmentId"
                                         ref="tablePagination">
                                <el-table-column prop="realName" label="姓名">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.realName || "--" }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="userName" label="登录名">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.userName || "--" }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="sex" label="性别">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.sex === 1 ? '男' : '女'  }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="departmentName" label="机构">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.departmentName || "--" }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="是否有效">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.status === 0 ? '是' : '否' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="email" label="邮箱">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.email || "--" }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="remark" label="备注">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.remark || "--" }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="200">
                                    <template slot-scope="scope">
                                        <el-button v-for="(item,index) in menuBtnsList.tabButtonList" :key="index"
                                                   @click="eventBus(item.value,scope.row)" type="text" size="small">
                                            {{item.name}}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </elTablePage>

                            <!--<el-table :data="sourceData" style="width: 100%" class='pch-table' stripe>-->
                            <!---->
                            <!--</el-table>-->
                        </div>
                    </article>
                </div>
            </div>
        </titleField>
        <employee-modal ref="employeeModal" :userList="userList" :currTreeId="currTreeId"></employee-modal>
    </div>
</template>
<style lang="scss">
    @import "./cooperation.scss";
</style>
<script>
    import Vue from 'vue'
    import titleField from '~/components/common/title-field/title-field'
    import elTablePage from '@/components/common/table-pagination/table-pagination'
    import employeeModal from './components/employee-modal'
    import api from '@/api'
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
                FLAG: false,
                searchparams: {
                    realName: '',
                    userName: '',
                    organizationName: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                props: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                lists: [],
                orgId: '',
                tabparams: {
                    departmentId: '',
                    organizationName: '',
                    realName: '',
                    userName: '',
                },
                params: {
                    level: 1,
                    ownerId: this.$route.query.ownerId,
                },
                currTreeId: 0,
                rootTreId: 0,
                // childrenparams: {
                //     ownerId: '',
                //     tree: '1'
                // },
                sourceData: [],
                userList: {
                    birthday: '',
                    id: 1,
                    userName: '',
                    password: '',
                    realName: '',
                    idNumber: '',
                    sex: '1',
                    email: '',
                    ownerId: 0,
                    roleids: [],
                    departmentId: [],
                    status: '0',
                    post: '',
                    remark: ''
                },
            }
        },
        created() {
            this.$store.dispatch('getMenuButtonList', this.$route.query&&this.$route.query.buttonId)
            this.initData()
        },
        methods: {
            ...mapActions(['getAllOrgList']),
            eventBus(event, item) {
                if(!this[event])return this.$message.info("功能还在开发中，请拭目以待！");
                this[event](item)
            },
            initData() {
                api.getOrgList(this.params).then((res) => {
                    if (res.data) {
                        let data = res.data.list
                        this.lists = data
                        this.orgId = ""
                        this.currTreeId = data[0].id
                        this.tabparams.departmentId = -1
                        this.FLAG = true;
                      api.getOrgChildren( {
                        ownerId: '',
                        tree: '1',
                        id:data[0].id
                      }).then((res) => {
                            let {data} = res
                            this.lists = [data]
                        })
                    }

                })
            },
            getChildren(req) {
                if (!req.children && !req.subCount) {
                    return false;
                }
                // this.childrenparams.ownerId = this.ownerId
                // api.getOrgChildren(this.childrenparams).then((res) => {
                //     let {data} = res
                //     if (req.level === 1) {
                //         this.lists = [data]
                //     }
                // })

            },

            selectTree(data) {
                this.FLAG = true
                // this.currTreeId = data.id || this.orgId
                this.tabparams.departmentId = data.id || this.orgId

                // this.getAllOrgList({
                //     id: this.currTreeId,
                //     tree: 1
                // })
                // this.childrenparams.id = data.id
                // this.getChildren(data)
                Vue.nextTick(() => {
                    this.$refs.tablePagination.getTableData()
                })
                // this.getTableList()
            },
            getTableList() {
                // this.tabparams.ownerId = this.ownerId
                api.getUser({departmentId: this.currTreeId}).then((res) => {
                    let {data} = res
                    this.sourceData = data
                })
            },
            modify(row) {
                let list = this.userList;
                for (let i in list) {
                    list[i] = row[i]
                }
                list.sex = list.sex + ''
                this.userList.departmentId = [row.departmentId]
                list.status = list.status + ''
                this.$refs.employeeModal.showModal('update', row)
            },
            reset(row) {
                this.$prompt('请输入新的密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[a-zA-Z0-9]{6,18}$/,
                    inputErrorMessage: '密码格式为6-18位'
                }).then(({value}) => {
                    api.resetPassword({newPassword: value, userId: row.id}).then((res) => {
                        if (res && res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: '员工' + ((row.realName + '的') || '') + '密码已经重置成功'
                            });
                            setTimeout(() => {
                                location.href = location.href
                            }, 2000)
                        }
                    });
                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '取消输入'
                    // });
                });
            },
            delete(row) {
                this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.delUser({id: row.id}).then((res) => {
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
                this.$refs.employeeModal.showModal('add')
            },
            selectParentIdPar(value) {
                // this.userList.organizationId = value[value.length - 1]
            },
            handlesearch() {
                Vue.nextTick(() => {
                    this.$refs.tablePagination.getTableData()
                })
            }
        },
        computed: mapState({
            ownerId: state => state.global.ownerId,
            orgData: state => state.org.orgList,
            menuBtnsList: state => state.global.menuBtnsList,
        }),
        components: {
            titleField,
            employeeModal,
            elTablePage
        },
        // layout: 'org_layouts'
    }

</script>
