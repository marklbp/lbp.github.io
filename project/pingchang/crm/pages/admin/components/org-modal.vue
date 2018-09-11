<template>
    <div class='org-modal' v-loading.fullscreen.lock="fullscreenLoading">
        <no-ssr>
            <modal name="orgModal" width="800px" height="auto" class='pch-form-modal' :clickToClose="false">
                <h3 class="pch-modal-title">{{FLAG?"修改组织机构":"添加组织机构"}}</h3>
                <el-form :inline="true" label-position="right" label-width='130px' data-vv-scope="form-1">
                    <el-row :gutter="24">
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="名称" :class="{ 'vee-control': true }">
                                <el-input v-model='orglist.name' placeholder="请输入内容" class="input-with-select"
                                          :disabled="FLAG"
                                          :class="{'input': true,'is-danger': errors.has('orglist.name') }"
                                          name='orglist.name' v-validate="'required'">
                                </el-input>
                                <span v-show="errors.has('orglist.name')" class="help is-danger">{{ errors.first('orglist.name') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-if="FLAG">
                            <el-form-item label="ID" :class="{ 'vee-control': true }">
                                <el-input v-model.number='orglist.id' type="number" placeholder="请输入内容"
                                          class="input-with-select" :disabled="FLAG"
                                          :class="{'input': true,'is-danger': errors.has('orglist.id') }"
                                          name='orglist.id' v-validate="'required'">
                                </el-input>
                                <span v-show="errors.has('orglist.id')" class="help is-danger">{{ errors.first('orglist.id') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="简称" :class="{ 'vee-control': true }">
                                <el-input v-model='orglist.shortName' placeholder="请输入内容" class="input-with-select"
                                          :disabled="FLAG"
                                          :class="{'input': true,'is-danger': errors.has('orglist.shortName') }"
                                          name='orglist.shortName' v-validate="'required'">
                                </el-input>
                                <span v-show="errors.has('orglist.shortName')" class="help is-danger">{{ errors.first('orglist.shortName') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="上级机构" :class="{ 'vee-control': true }">
                                <el-cascader expand-trigger="hover" change-on-select :options="orgData" :show-all-levels="false"
                                             v-model="parentId" @change="selectParentId" :props="props"></el-cascader>
                                <span v-show="errors.has('orglist.parentId')" class="help is-danger">{{ errors.first('orglist.parentId') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="分类" :class="{ 'vee-control': true }">
                                <el-select clearable v-model='orglist.type' placeholder="请选择" v-validate="'required'"
                                           :class="{'input': true, 'is-danger': errors.has('orglist.type') }"
                                           name='orglist.type'>
                                    <el-option v-for="list in orgType" :key="list.value" :label="list.label"
                                               :value="list.value"></el-option>
                                </el-select>
                                <span v-show="errors.has('orglist.type')" class="help is-danger">{{ errors.first('orglist.type') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="主负责人">
                                <el-input v-model='orglist.director' placeholder="请输入内容" class="input-with-select">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="手机号码">
                                <el-input v-model='orglist.mobilePhone' placeholder="请输入内容" class="input-with-select">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="描述" class="gen-textarea">
                                <el-input v-model='orglist.remark' placeholder="请输入内容" class="input-with-select"
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

    const dictionary = {
        zh_CN: {
            custom: {
                name: {
                    // required: () => '请选择注册地址'
                }
            },
            messages: {
                lender: {
                    test: () => '请选择类型',
                }
            },
            attributes: {
                orglist: {
                    id: "ID",
                    parentId: "上级部门",
                    name: "名称",
                    shortName: "简称",
                    type: "分类",
                    mobilePhone: "手机号码",
                    remark: "描述",
                    director: '负责人',
                }
            }
        }
    };
    Validator.localize(dictionary);


    export default {
        props: {
            orglist: Object,
            currTreeId: Number
        },
        data() {
            return {
                orgType: defaultOption.orgType,
                disabled: false,
                FLAG: true,
                fullscreenLoading: false,
                props: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                parentId: [],
                params: {
                    level: 1,
                    ownerId: ''
                },
                ownerId: this.$route.query.buttonId || this.$route.query.ownerId
            }
        },
        computed: mapState({
            orgData: state => state.org.orgList
        }),
        methods: {
            ...mapActions(['getAllOrgList']),
            showModal(params, row) {
                // true 为 修改模式
                this.FLAG = params === 'add' ? false : true
                this.getAllOrgList({
                    id: this.currTreeId,
                    tree: 1
                })
                if (row) {
                    let path = row.path, result;
                    result = path.substring(1, path.length - 1).split('/')
                    result = result.map((item) => {
                        return parseInt(item)
                    })
                    this.parentId = result
                }

                this.$modal.show('orgModal');
            },
            hideModal() {
                this.$modal.hide('orgModal');
                this.clearForm()
            },
            submit() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        if(!this.parentId.length){
                            this.$message.error('上级机构不能为空');
                            return false;
                        }
                        this.orglist.id = parseInt(this.orglist.id)
                        if (this.FLAG) {
                            // 修改
                            api.putOrgModify(this.orglist).then((res) => {
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
                            delete this.orglist.id
                            api.addOrgModify(this.orglist).then((res) => {
                                //console.log(res)
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
                for (let i in this.orglist) {
                    this.orglist[i] = ''
                }
                this.parentId = ''
            },
            selectParentId(value) {
                this.orglist.parentId = value[value.length - 1]
            }
        }
    }

</script>
