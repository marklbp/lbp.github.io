<template>
    <div class='org-modal' v-loading.fullscreen.lock="fullscreenLoading">
        <no-ssr>
            <modal name="orgModal" width="800px" height="auto" class='pch-form-modal' :clickToClose="false">
                <h3 class="pch-modal-title">{{FLAG?"修改员工":"添加员工"}}</h3>
                <el-form :inline="true" label-position="right" label-width='130px' data-vv-scope="form-1">
                    <el-row :gutter="24">
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="员工编号" :class="{ 'vee-control': true }" v-if="FLAG">
                                <el-input v-model.number='userList.id' placeholder="员工编号" type="number"
                                          class="input-with-select" :disabled="FLAG"
                                          :class="{'input': true,'is-danger': errors.has('userList.id') }"
                                          name='userList.id' v-validate="'required'">
                                </el-input>
                                <span v-show="errors.has('userList.id')" class="help is-danger">{{ errors.first('userList.id') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="登录名" :class="{ 'vee-control': true }">
                                <el-input v-model='userList.userName' placeholder="登录名" class="input-with-select"
                                          :class="{'input': true,'is-danger': errors.has('userList.userName') }"
                                          name='userList.userName' v-validate="'required|mobile'">
                                </el-input>
                                <span v-show="errors.has('userList.userName')" class="help is-danger">{{ errors.first('userList.userName') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-if="!FLAG">
                            <el-form-item label="密码" :class="{ 'vee-control': true }">
                                <el-input v-model='userList.password' placeholder="密码" class="input-with-select"
                                          :class="{'input': true,'is-danger': errors.has('userList.password') }"
                                          name='userList.password' v-validate="'required'">
                                </el-input>
                                <span v-show="errors.has('userList.password')" class="help is-danger">{{ errors.first('userList.password') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="姓名" :class="{ 'vee-control': true }">
                                <el-input v-model='userList.realName' placeholder="姓名" class="input-with-select"
                                          :class="{'input': true,'is-danger': errors.has('userList.realName') }"
                                          name='userList.realName' v-validate="'required'">
                                </el-input>
                                <span v-show="errors.has('userList.realName')" class="help is-danger">{{ errors.first('userList.realName') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="性别">
                                <el-radio disabled v-model='userList.sex' label="1">男</el-radio>
                                <el-radio disabled v-model='userList.sex' label="0">女</el-radio>
                                <span v-show="errors.has('userList.sex')" class="help is-danger">{{ errors.first('userList.sex') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="身份证号" :class="{ 'vee-control': true }">
                                <el-input v-model='userList.idNumber' placeholder="身份证号" class="input-with-select"
                                          :class="{'input': true,'is-danger': errors.has('userList.idNumber') }"
                                          name='userList.idNumber' v-validate="'required|idcard'">
                                </el-input>
                                <span v-show="errors.has('userList.idNumber')" class="help is-danger">{{ errors.first('userList.idNumber') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="出生日期">
                                <el-date-picker disabled value-format="yyyy-MM-dd" :editable=false v-model="userList.birthday" type="date"
                                                placeholder="出生日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="邮箱">
                                <el-input v-model='userList.email' v-validate="'email'" :class="{'input': true,'is-danger': errors.has('email') }" placeholder="邮箱" class="input-with-select" name="email">
                                </el-input>
                                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="机构" :class="{ 'vee-control': true }">
                                <el-cascader expand-trigger="hover" change-on-select :options="orgData" :show-all-levels="false" :class="{'input': true,'is-danger': errors.has('departmentId') }"
                                             v-model="departmentId" @change="selectParentId"
                                             :props="props" name="departmentId"></el-cascader>
                                <span v-show="errors.has('departmentId')" class="help is-danger">{{ errors.first('departmentId') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="角色" :class="{ 'vee-control': true }" class="roleName">
                                <el-select  collapse-tags v-model="roleids" multiple placeholder="请选择">
                                    <el-option v-for="item in roleData" :key="item.id" :label="item.name"
                                               :value="item.id">
                                        <!--{{item.name}}-->
                                    </el-option>
                                </el-select>
                                <span v-show="errors.has('userList.roleids')" class="help is-danger">{{ errors.first('userList.roleids') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="有效">
                                <el-radio v-model='userList.status' label="0">是</el-radio>
                                <el-radio v-model='userList.status' label="1">否</el-radio>
                                <span v-show="errors.has('userList.status')" class="help is-danger">{{ errors.first('userList.status') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="职位" class="vee-control">
                                <el-input v-model='userList.post' v-validate="'required'" :class="{'input': true,'is-danger': errors.has('userList.post') }" placeholder="职位" class="input-with-select" name="userList.post">
                                </el-input>
                                <span v-show="errors.has('userList.post')" class="help is-danger">{{ errors.first('userList.post') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="描述" class="gen-textarea">
                                <el-input v-model='userList.remark' placeholder="请输入内容" class="input-with-select"
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
                    // test: () => '请选择类型',
                }
            },
            attributes: {
                userList: {
                    "userName": "用户名（手机号）",
                    "password": "密码",
                    "realName": "姓名",
                    "idNumber": "身份证号",
                    "sex": '性别',
                    "email": "邮箱",
                    "organizationId": "机构（部门id）",
                    "ownerId": "公司id",
                    "roleids": "权限id",
                    "status": '状态',
                    "remark": "备注",
                    "birthday": "出生日期",
                    "post": "职位"
                }
            }
        }
    };
    Validator.localize(dictionary);


    export default {
        props: {
            // url: String,
            userList: Object,
            currTreeId: Number,
        },
        data() {
            return {
                options5: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                departmentId: [],
                roleids: [],
                birthday: '',
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
        computed: mapState({
            //ownerId: state => state.global.ownerId,
            // orgData: state => state.org.orgList,
            roleData: state => state.role.roleList,
        }),
        methods: {
            ...mapActions(['getRoleList']),
            showModal(params, row) {
                // true 为 修改模式
                this.FLAG = params === 'add' ? false : true
                // this.getAllOrgList({
                //   id: this.currTreeId,
                //   tree: 1
                // })

                if (row && row.roleids) {
                    let array =  row.roleids.split(',')
                    for(let i in array){
                        this.roleids[i] = parseInt(array[i])
                    }
                }

                api.getOrgChildren({
                    id: this.currTreeId,
                    tree: 1
                }).then((res) => {
                    if (res.data) {
                        let data = [res.data];
                        this.orgData = data
                        if(!row)return false;
                        let path = utils.getJsonParents(data, 'id', row.departmentId, 'children', 'path')
                        if (path) {
                            let result = []
                            result = path.substring(1, path.length - 1).split('/')
                            result = result.map((item) => {
                                return parseInt(item)
                            })
                            this.departmentId = result
                        }
                    }
                })
                this.getRoleList()
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
                        if(!this.roleids.length){
                            this.$message.error('角色不能为空');
                            return false;
                        }
                        if (this.userList.departmentId instanceof Array) {
                            this.userList.departmentId = this.userList.departmentId[this.userList.departmentId.length - 1]
                        }
                        this.userList.sex = parseInt(this.userList.sex)
                        this.userList.status = parseInt(this.userList.status)
                        this.userList.roleids = this.roleids.toString()
                        if (this.FLAG) {
                            delete this.userList.password;
                            // 修改
                            api.putUser(this.userList).then((res) => {
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
                            // delete this.userList.sex;
                            this.userList.roleids = this.roleids.toString()
                            api.addUser(this.userList).then((res) => {
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
                });


            },
            clearForm() {
                for (let i in this.userList) {
                    this.userList[i] = ''
                }
                this.userList.sex = '1'
                this.departmentId = []
                this.userList.status = '0'
                this.birthday = ''
                this.roleids = []
            },
            selectParentId(value) {
                this.userList.departmentId = value[value.length - 1];
                //console.log(this.userList.departmentId)
            }
        },
        watch: {
            "userList.idNumber"(news, old) {
                let result = utils.getUserInfoCard(news)
                if (result) {
                    this.userList.sex = result.sex
                    this.userList.birthday = result.birth
                }
            }
        }
    }

</script>
