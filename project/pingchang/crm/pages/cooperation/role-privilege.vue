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
                            <el-form-item label="角色名称">
                                <el-input v-model="searchName" placeholder="角色名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getTableData">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="pch-left-result">
                            <h3 class="pch-assembly-title">查询结果</h3>
                            <ul class='pch-left-list'>
                                <li :class="{'pch-core-color': subSetParams.roleId == item.id}"
                                    @click="searchData(item)" v-for="(item,index) in roleList" :key="index">
                                    {{item.id}}-{{item.name}}
                                </li>
                            </ul>
                        </div>
                    </aside>
                    <article class="pch-assembly-right">
                        <div v-if="FLAG">
                            <!-- <el-tree @check-change="selectChange"  :data="privilege" show-checkbox  node-key="id" ref="tree" highlight-current :props="defaultProps">
                          </el-tree> -->
                            <el-tree @check-change="selectChange" :default-checked-keys="subSetParams.roleResourceIdList" :data="privilege"
                                     show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
                                     :props="defaultProps">
                            </el-tree>
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
                searchName: '',
                params: {
                    roleIds: ''
                },
                roleList: [],
                privilege: [],
                resultPrivilege: [],
                defaultCheckList: [],
                defaultKeys: [],
                subSetParams: {
                    roleId: '',
                    roleResourceIdList: []
                },
                FLAG: false,
                // w: [],
                defaultProps: {
                    id: 'id',
                    children: 'leaf',
                    label: 'name'
                },
                ownerId: this.$route.query.ownerId
            }
        },
        created() {
            // this.initData()
            this.getRoleList()
        },
        methods: {
            // ...mapActions(['getRoleList']),
            initData() {
                this.params.ownerId = this.$route.query.ownerId
                api.getRolePrivilege_ext(this.params).then((res) => {
                    let data = res.data.leaf
                    let result = [],
                        self = this;

                    function getNode(data) {
                        for (let i in data) {
                            if (data[i].value) {
                                data[i].id = data[i].value.id
                                data[i].name = data[i].value.name
                                if (data[i].value.checked) {
                                    if (data[i].leaf) {
                                        if (checkNode(data[i].leaf)) {
                                            self.subSetParams.roleResourceIdList.push(data[i].id)
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
                    //遍历赋值pid父级
                    function traversing(obj, ...pids) {
                        return obj.map(function (item) {
                            item.pids = pids
                            if (item.leaf) {
                                item.leaf = traversing.apply(null, [item.leaf, item.value.id, ...pids])
                            }
                            return item
                        })
                    }

                    let a = traversing(this.privilege)
                    //console.log(a)
                    // this.defaultKeys = result
                })
            },
            getTableData() {
                api.getRoleList_ext({name: this.searchName,ownerId:this.$route.query.ownerId}).then((res) => {
                    if (res.data) {
                        this.roleList = res.data.list;
                    }
                })
            },
            getRoleList() {
                let obj = {ownerId: this.$route.query.ownerId};
                api.getRoleList_ext(obj).then((res) => {
                    if (!res.data) return false;
                    this.roleList = res.data.list
                })
            },
            searchData(data) {
                this.subSetParams.roleResourceIdList = []
                this.params.roleIds = data.id
                this.FLAG = true
                this.subSetParams.roleId = data.id
                this.initData();
            },
            selectChange(data, checked, indeterminate) {
                checked ? this.subSetParams.roleResourceIdList.push(data.id) : this.subSetParams.roleResourceIdList.remove(data.id);
                this.subSetParams.roleResourceIdList = this.subSetParams.roleResourceIdList.unique()
            },
            selectChek(data, checked, indeterminate) {
                //console.log(data, checked, indeterminate)
            },
            subSet() {
                let obj = this.privilege,
                    arr = this.subSetParams.roleResourceIdList,
                    resultList = [];
                function getNode(data){
                    for(let i in data){
                        if (data[i].value) {
                            if(arr.some((j)=>{return j == data[i]['id']})){
                                resultList.push(...data[i].pids)
                            }
                        }
                        if (data[i].leaf) {
                            getNode(data[i].leaf)
                        }
                    }
                }
                getNode(obj)
                this.subSetParams.roleResourceIdList.push(...resultList)
                this.subSetParams.roleResourceIdList = Array.from(new Set(this.subSetParams.roleResourceIdList));
                this.subSetParams.ownerId = this.$route.query.ownerId
                api.putRolePrivilege_ext(this.subSetParams).then((res) => {
                    if (res && res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        setTimeout(function () {
                            location.href = location.href
                        }, 2000)
                    }
                })
            }
        },
        components: {
            titleField,
        },
        layout: 'org_layouts'
    }

</script>
