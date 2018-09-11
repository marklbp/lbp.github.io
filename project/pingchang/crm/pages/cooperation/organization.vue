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
                            <el-button class='blue-sm-btn ' type="primary" size="small" @click="resetPage">刷新
                            </el-button>
                        </div>
                        <el-table :fit=true :data="sourceData" style="width: 100%" class='pch-table' stripe>
                            <el-table-column prop="id" label="ID">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.id || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="shortName" label="简称">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.shortName || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="director" label="主负责人">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.director || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="mobilePhone" label="电话">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.mobilePhone || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="remark" label="备注">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.remark || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="100">
                                <template slot-scope="scope" v-if='scope.row.level!==1'>
                                    <el-button v-for="(item,index) in menuBtnsList.tabButtonList" :key="index" @click="eventBus(item.value,scope.row)"  type="text" size="small">{{item.name}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </article>
                </div>
            </div>
        </titleField>
        <org-modal ref="orgModal" :orglist="orglist" :currTreeId="currTreeId"></org-modal>
    </div>
</template>
<style lang="scss">
    @import "./cooperation.scss"
</style>
<script>
    import Vue from 'vue'
    import titleField from '~/components/common/title-field/title-field'
    import orgModal from './components/org-modal'
    import api from '@/api'
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                lists: [],
                orgId: '',
                params: {
                    level: 1,
                    ownerId: ''
                },
                childrenparams: {
                    ownerId: '',
                    tree: '1'
                },
                currTreeId: 0,
                sourceData: [],
                orglist: {
                    id: "",
                    parentId: '',
                    name: "",
                    shortName: "",
                    director: '',
                    type: "",
                    mobilePhone: "",
                    remark: "",
                },
                ownerId: this.$route.query.ownerId
            }
        },
        created() {
            this.$store.dispatch('getMenuButtonList', this.$route.query&&this.$route.query.buttonId)
            this.initData()
        },
        methods: {
            ...mapActions(['getAllOrgList_ext']),
            eventBus(event, item) {
                this[event](item)
            },
            initData() {
                this.params.ownerId = this.$route.query.ownerId
                api.getOrgList_ext(this.params).then((res) => {
                    let data = res.data.list
                    this.lists = data
                    this.orgId = data[0].id
                    this.currTreeId = data[0].id
                    this.sourceData = data
                })
            },
            getChildren(req) {
                if (!req.children && !req.subCount) {
                    this.sourceData = [req]
                    return false;
                }
                this.childrenparams.ownerId = this.ownerId
                api.getOrgChildren_ext(this.childrenparams).then((res) => {
                    let {data} = res
                    this.sourceData = data.children
                    if (req.level === 1) {
                        this.lists = [data]
                    }
                })
            },
            resetPage() {
                this.initData()
            },
            selectTree(data) {
                this.currTreeId = data.id || this.orgId
                this.childrenparams.id = data.id
                //console.log(data)
                this.getChildren(data)
            },
            tableList() {
                //console.log(this.lists)
            },
            modify(row) {
                for (let i in this.orglist) {
                    if (row[i]) {
                        this.orglist[i] = row[i]
                    }
                }

                // this.orglist.id = row.id
                // this.orglist.name = row.name
                // this.orglist.shortName = row.shortName
                this.$refs.orgModal.showModal('update', row)
            },
            delete(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.delOrg_ext({id: row.id, ownerId: this.ownerId}).then((res) => {
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
                this.$refs.orgModal.showModal('add')
            },
        },
        computed: mapState({
            //ownerId: state => state.global.ownerId,
            orgData: state => state.ext_org.orgList,
            menuBtnsList: state => state.global.menuBtnsList,

        }),
        components: {
            titleField,
            orgModal
        },
        layout: 'org_layouts'
    }

</script>
