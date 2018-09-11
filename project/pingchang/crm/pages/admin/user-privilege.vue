<template>
    <div class="organization">
        <titleField>
            <h1 slot='title' class="leg-text">联系人信息</h1>
            <div slot='con'>
                <div class="pch-assembly-table">
                    <aside class="pch-assembly-left">
                        <!-- pch-left-search -->
                        <el-form :inline="true" class=" pch-left-search">
                            <h3 class="pch-assembly-title">组织机构</h3>
                            <el-form-item label="登录名">
                                <el-input v-model="params.userName" placeholder="登录名"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="params.realName" placeholder="姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="机构">
                                <el-input v-model="params.organizationName" placeholder="机构"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button class='blue-sm-btn' type="primary" size="small" @click="getTableData">查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <div class="pch-left-result">
                            <h3 class="pch-assembly-title">查询结果</h3>
                            <ul class='pch-left-list'>
                                <li :class="{'pch-core-color': userId == item.id}" @click="searchData(item)"
                                    v-for="(item,index) in employeeList" :key="index">{{item.id}}-{{item.realName}}
                                </li>
                            </ul>
                        </div>
                    </aside>
                    <article class="pch-assembly-right">
                        <div class="pch-assembly-con" v-if="FLAG">
                            <div class="patb">
                                <el-button v-for="(item,index) in menuBtnsList.wrapButtonList" :key="index"
                                           @click="eventBus(item.value)" class='default-sm-btn' type="primary" size="small" >{{item.name}}</el-button>
                            </div>
                            <div class="urp-wrap">
                                <div class="urp-box">
                                    <div class="urp-header">
                                        <h5 class="urp-title">拥有角色</h5></div>
                                    <div class="urp-body">
                                        <ul class="urp-list">
                                            <li class="urp-item" v-for="(item,index) in roleList" :key="index">
                                                {{item.name}}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="urp-box">
                                    <div class="urp-header">
                                        <h5 class="urp-title">拥有权限</h5></div>
                                    <div class="urp-body">
                                        <el-tree @check-change="selectChange" :default-checked-keys="defaultKeys"
                                                 :data="privilege" show-checkbox node-key="id" ref="tree"
                                                 highlight-current :props="defaultProps">
                                        </el-tree>
                                    </div>
                                </div>
                            </div>
                            <div class="patb">
                                <el-button class='default-sm-btn' type="primary" size="small" @click="subSet">确认
                                </el-button>
                                <!-- <el-button class='blue-sm-btn ' type="primary" size="small" @click="resetPage">刷新</el-button> -->
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </titleField>
        <!-- 添加角色 -->
        <no-ssr>
            <modal name="addUser" width="800px" height="auto" class='pch-form-modal' :clickToClose="false">
                <h3 class="pch-modal-title">添加角色</h3>
                <el-form class='pch-form' ref="form" :inline="true" label-position="right" label-width='130px'>
                    <el-row :gutter="24">
                        <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
                            <el-form-item label="查询角色" for="searchname">
                                <el-input placeholder="输入角色名称" v-model="searchname" class="input-with-select"
                                          name='searchname'>
                                    <el-button slot="append" icon="el-icon-search" @click='searchName'>查询</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <template>
                        <div class="select-roles">
                            <span class='select-roles-title'>选择角色 </span>
                            <template>
                                <el-row :gutter="24" class="select-wrapers">
                                    <el-checkbox-group v-model="selectRoleList">
                                        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8"
                                                v-for='(item,index) in allRoleList' :key='index'>
                                            <el-checkbox @click="handleUserList(item)" :label="item.id">{{item.name}}
                                            </el-checkbox>
                                        </el-col>
                                    </el-checkbox-group>
                                </el-row>
                            </template>
                        </div>
                    </template>
                    <el-row :gutter="24">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <div class="pch-modal-btns">
                                <el-button class='default-sm-btn ' type="text" size="small" @click="qr">完成</el-button>
                                <el-button class='blue-sm-btn ' type="text" size="small" @click="hideModal('addUser')">
                                    取消
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </modal>
        </no-ssr>
        <!-- 复制员工权限 -->
        <no-ssr>
            <modal name="copyUser" width="800px" height="auto" class='pch-form-modal' :clickToClose="false">
                <h3 class="pch-modal-title">复制员工角色和权限</h3>
                <el-form class='pch-form' ref="form" :inline="true" label-position="right" label-width='130px'>
                    <el-row :gutter="24">
                        <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
                            <el-form-item label="用户名称" for="searchUsername">
                                <el-input placeholder="输入用户名" v-model="searchUsername" class="input-with-select"
                                          name='searchUsername'>
                                    <el-button slot="append" icon="el-icon-search" @click='handleSearchUsername'>查询
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <template>
                        <div class="select-roles">
                            <span class='select-roles-title'>选择用户 </span>
                            <template>
                                <el-row :gutter="24" class="select-wrapers">
                                    <el-checkbox-group v-model="selectUserList">
                                        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8"
                                                v-for='(item,index) in allUserList' :key='index'>
                                            <el-checkbox @click="handleUserList(item)" :label="item.id">
                                                {{item.realName}}
                                            </el-checkbox>
                                        </el-col>
                                    </el-checkbox-group>
                                </el-row>
                            </template>
                        </div>
                    </template>
                    <el-row :gutter="24">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <div class="pch-modal-btns">
                                <el-button class='default-sm-btn ' type="text" size="small" @click="copySut">完成
                                </el-button>
                                <el-button class='blue-sm-btn ' type="text" size="small" @click="hideModal('copyUser')">
                                    取消
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </modal>
        </no-ssr>
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
                params: {},
                employeeList: [],
                roleList: [],
                allRoleList: [],
                allUserList: [],
                privilege: [],
                defaultKeys: [],
                selectRoleList: [],
                selectUserList: [],
                selectUserFlag: false,
                userId: '',
                organizationId: '',
                defaultProps: {
                    id: 'id',
                    children: 'leaf',
                    label: 'name'
                },
                FLAG: false,
                searchname: '',
                searchUsername: ''
            }
        },
        created() {
            this.$store.dispatch('getMenuButtonList', this.$route.query&&this.$route.query.buttonId)
            this.getEmployeeList()
        },
        methods: {
            eventBus(event, item) {
                this[event](item)
            },
            initData() {

            },
            getTableData() {
                api.getUserList(this.params).then((res) => {
                    if(res.data){
                        this.employeeList = res.data.list
                    }
                })
            },
            getEmployeeList() {
                api.getUserList().then((res) => {
                    this.employeeList = res.data.list
                })
            },
            searchData(data) {
                this.userId = data.id
                this.organizationId = data.organizationId
                let obj = {
                    userId: data.id
                }
                api.getAllRoles(obj).then((res) => {
                    let {data} = res
                    if (!data) {
                        this.FLAG = false;
                        return false
                    }
                    this.FLAG = true
                    this.roleList = data
                    let resultParames = {
                        roleIds: [],
                        userId: this.userId
                        // roleIds: [],
                    }
                    for (let i in data) {
                        if (data[i].id) {
                            resultParames.roleIds.push(data[i].id)
                        }
                    }
                    // resultParames.roleIds = 325
                    api.getRolePrivilege(resultParames).then((res) => {
                        this.privilege = [];
                        this.defaultKeys = [];
                        if(!res||!res.data||!res.data.leaf){return false}
                        let data = res.data.leaf
                        let result = [],
                            self = this;
                        function getNode(data) {
                            for (let i in data) {
                                if (data[i].value) {
                                    data[i].disabled = true
                                    data[i].id = data[i].value.id
                                    data[i].name = data[i].value.name
                                    if (data[i].value.checked) {
                                        if (data[i].leaf) {
                                            if (checkNode(data[i].leaf)) {
                                                self.defaultKeys.push(data[i].id)
                                            }
                                        }
                                    }
                                }
                                if (data[i].leaf) {
                                    getNode(data[i].leaf)
                                }
                            }
                            return data
                        }

                        function checkNode(source) {
                            let zcFlag = true;
                            for (let j in source) {
                                if (source[j].value) {
                                    if (!source[j].checked) {
                                        zcFlag = false
                                    }
                                }
                                if (source[j].leaf) {
                                    checkNode(source[j].leaf)
                                }
                            }
                            return zcFlag
                        }

                        this.privilege = getNode(data)
                    })
                })
            },
            add() {
                api.getRoleList().then((res) => {
                    if (!res.data) return false;
                    let {data} = res
                    this.allRoleList = data.list;
                    this.$modal.show('addUser')
                })
            },
            copy() {
                // copyUserPrivilege
                this.$modal.show('copyUser')

            },
            selectChange() {

            },
            subSet() {

            },
            copySut() {
                let obj = {
                    sourceUserId: this.userId,
                    targetUserId: this.selectUserList[this.selectUserList.length - 1],
                    organizationId: this.organizationId
                }
                api.copyUserPrivilege(obj).then((res) => {
                    if (res.code === 200) {
                        this.$message({
                            message: '复制员工权限成功！',
                            type: 'success'
                        });
                        this.$modal.hide('copyUser')
                        setTimeout(function () {
                            location.href = location.href
                        }, 2000)
                    }
                })
            },
            handleSearchUsername() {
                if (!this.searchUsername) return false;
                api.getInfoByUserName(this.searchUsername).then((res) => {
                    if (res.data) {
                        this.allUserList = [res.data]

                    }
                })

            },
            searchName() {
                if (!this.searchName) return false;
                api.getRoleList({name: this.searchname}).then((res) => {
                    if (res.data) {
                        this.allRoleList = res.data.list
                    }
                })
            },
            qr() {
                if (!this.selectRoleList.length) return false;
                let objp = {
                    userId: this.userId,
                    organizationId: this.organizationId,
                    roleIds: this.selectRoleList.toString()
                }
                api.addUserRoles(objp).then((res) => {
                    if (res.code === 200) {
                        this.$message({
                            message: '添加角色成功！',
                            type: 'success'
                        });
                        this.$modal.hide('addUser')
                        setTimeout(function () {
                            location.href = location.href
                        }, 2000)
                    }
                })
            },
            handleUserList(data) {
                // this.organizationId = data.organizationId
            },
            hideModal(name) {
                this.$modal.hide(name)
            }
        },
        computed: mapState({
            menuBtnsList: state => state.global.menuBtnsList,
        }),
        components: {
            titleField,
        },
    }

</script>
