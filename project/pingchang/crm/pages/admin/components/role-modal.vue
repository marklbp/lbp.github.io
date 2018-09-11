<template>
    <div class='org-modal' v-loading.fullscreen.lock="fullscreenLoading">
        <no-ssr>
            <modal name="orgModal" width="800px" height="auto" class='pch-form-modal' :clickToClose="false">
                <h3 class="pch-modal-title">{{FLAG?"修改角色":"添加角色"}}</h3>
                <el-form :inline="true" label-position="right" label-width='130px' data-vv-scope="form-1">
                    <el-row :gutter="24">
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="ID" :class="{ 'vee-control': true }" v-if="FLAG">
                                <el-input v-model='roleList.id' placeholder="ID" class="input-with-select"
                                          :disabled="FLAG"
                                          :class="{'input': true,'is-danger': errors.has('roleList.id') }"
                                          name='roleList.id' v-validate="'required'">
                                </el-input>
                                <span v-show="errors.has('roleList.id')" class="help is-danger">{{ errors.first('roleList.id') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="角色名称" :class="{ 'vee-control': true }">
                                <el-input v-model='roleList.name' placeholder="角色名称" class="input-with-select"
                                          :class="{'input': true,'is-danger': errors.has('roleList.name') }"
                                          name='roleList.name' v-validate="'required'">
                                </el-input>
                                <span v-show="errors.has('roleList.name')" class="help is-danger">{{ errors.first('roleList.name') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="机构" :class="{ 'vee-control': true }">
                                <!-- <el-cascader change-on-select :options="orgData" :show-all-levels="false" v-model="departmentId" @change="selectParentId" :props="props" name='roleList.departmentId' v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('roleList.departmentId') }"></el-cascader> -->
                                <el-cascader expand-trigger="hover" change-on-select :options="orgData" :show-all-levels="false"
                                             v-model="departmentId" @change="selectParentId"
                                             :props="props"></el-cascader>
                                <span v-show="errors.has('roleList.departmentId')" class="help is-danger">{{ errors.first('roleList.departmentId') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="有效">
                                <el-radio v-model='roleList.status' label="1">是</el-radio>
                                <el-radio v-model='roleList.status' label="0">否</el-radio>
                                <span v-show="errors.has('roleList.status')" class="help is-danger">{{ errors.first('roleList.status') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="描述" class="gen-textarea">
                                <el-input v-model='roleList.descriptions' placeholder="请输入内容" class="input-with-select"
                                          type="textarea" :rows="4">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="pch-modal-btns">
                    <el-button class='default-sm-btn' type="text" size="small" @click="submit">完成</el-button>
                    <el-button class='blue-sm-btn' type="text" size="small" @click='hideModal'>关闭</el-button>
                </div>
            </modal>
        </no-ssr>
    </div>
</template>
<style lang="scss">
    // @import "./Breadcrumb.scss"

</style>
<script>
    import Vue from 'vue'
    import {Validator} from 'vee-validate'
    import {mapState, mapActions} from 'vuex'
    import defaultOption from '~/config/options'
    import api from '@/api'
    import utils from '@/utils/'

    const dictionary = {
        zh_CN: {
            custom: {
                // name: {
                // required: () => '请选择注册地址'
                // }
            },
            messages: {
                lender: {
                    test: () => '请选择类型',
                }
            },
            attributes: {
                roleList: {
                    name: '角色名称',
                    departmentId: '部门',
                }
            }
        }
    };
    Validator.localize(dictionary);


    export default {
        props: {
            // url: String,
            roleList: Object,
            currTreeId: Number
        },
        data() {
            return {
                departmentId: [],
                orgType: defaultOption.orgType,
                disabled: false,
                FLAG: true,
                fullscreenLoading: false,
                props: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                orgData: [],
                ownerId: this.$route.query.buttonId || this.$route.query.ownerId
            }
        },
        methods: {
            ...mapActions(['getAllOrgList']),
            showModal(params, row) {
                // true 为 修改模式
                this.FLAG = params === 'add' ? false : true
                api.getOrgChildren({
                    id: this.currTreeId,
                    tree: 1
                }).then((res) => {
                    if (res.data) {
                        let data = [res.data];
                        this.orgData = data
                        if(!row)return false;
                        let path = utils.getJsonParents(data, 'id', row.departmentId, 'children', 'path')
                        let result = []
                        if (path) {
                            result = path.substring(1, path.length - 1).split('/')
                            result = result.map((item) => {
                                return parseInt(item)
                            })
                        }
                        this.departmentId = result
                    }
                })
                this.$modal.show('orgModal');

            },
            hideModal() {
                this.$modal.hide('orgModal');
                this.clearForm()
            },
            submit() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        if(!this.departmentId.length){
                            this.$message.error('机构不能为空');
                            return false;
                        }
                        this.roleList.id = parseInt(this.roleList.id)
                        if (this.FLAG) {
                            // 修改
                            api.putRoleModify(this.roleList).then((res) => {
                                if (res.code === 200) {
                                    this.$message({
                                        message: '修改成功～',
                                        type: 'success'
                                    });
                                    this.hideModal()
                                    setTimeout(() => {
                                        location.href = location.href
                                    }, 2000)
                                }
                            })
                        } else {
                            delete this.roleList.id
                            api.addRoleModify(this.roleList).then((res) => {
                                if (res.code === 200) {
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.hideModal()
                                    setTimeout(() => {
                                        location.href = location.href
                                    }, 2000)
                                }

                            })
                        }

                    }
                })
            },
            clearForm() {
                for (let i in this.roleList) {
                    this.roleList[i] = ''
                }
                this.departmentId = []
                this.roleList.status = '1'
            },
            selectParentId(value) {
                this.roleList.departmentId = value[value.length - 1]
            }
        }
    }

</script>
