<template>
    <div class="pch-login-form">
        <div class="login-form-header">
            <div class="login-logo">
                <img src="~/assets/img/common/admin-logo.png">
            </div>
        </div>
        <form class="layui-form layui-form-pane" v-on:submit.prevent="signIn">
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <span class="layui-input-icon lx-iconfont">&#xe63d;</span>
                    <input autocomplete="off" :class="{'layui-input': true, 'is-danger': errors.has('userName') }"
                           name="userName" placeholder="请输入账号(手机号码)" type="text" v-model="userName"
                           v-validate="'required'" autofocus="true">
                    <span style="left:0;" v-show="errors.has('userName')" class="help is-danger">{{ errors.first('username') }}</span>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <span class="layui-input-icon lx-iconfont">&#xe63c;</span>
                    <input autocomplete="off" :class="{'layui-input': true, 'is-danger': errors.has('password') }"
                           name="password" placeholder="请输入密码" type="password" v-model="password"
                           v-validate="'required'">
                    <span style="left:0;" v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
                </div>
            </div>
            <div class="layui-form-item form-clause">
            </div>
            <div class="layui-form-item">
                <button class="layui-btn layui-btn-sm" type="submit" :disabled="isLoging">
                    {{isLoging ? '登录中': '登录'}}
                </button>
            </div>
            <div class="layui-form-item auth-extend" style="display: none;">
                <div class="auth-forgot">
                    <a class="forgot-link" href="/password/find" id="login_forgot">忘记密码？</a>
                </div>
            </div>
        </form>
    </div>
</template>
<style lang="scss">
    @import "./auth.scss"

</style>
<script>
    //import api from '@/api'
    import {Validator} from 'vee-validate'

    const dictionary = {
        zh_CN: {
            custom: {
                userName: {
                    required: () => '请输入登录用户名'
                },
                password: {
                    required: () => '请输入密码'
                }
            },
            messages: {},
            attributes: {
                userName: '用户名',
                password: '密码'
            }
        }
    };

    Validator.localize(dictionary);

    function processMenus(menus) {
        let result = [];

        function s(data, res) {
            data.map((item, i) => {
                let obj = {
                    name: item.value.name,
                    unicode: item.value.icon,
                    path: item.value.value,
                    parentId: item.value.id,
                    menu: []
                };
                res.push(obj);
                if (item.leaf && item.leaf.length > 0) {
                    s(item.leaf, obj.menu);
                }
            })
        }

        s(menus, result);
        return result;
    }

    export default {
        middleware: 'anonymous',
        data() {
            return {
                userName: '',
                password: '',
                isLoging: false
            }
        },
        created(){
            //登录组件创建成功时清理缓存
            this.$store.commit('SIGN_OUT')
        },
        methods: {
            signIn() {
                this.$validator.validateAll().then((valid) => {
                    if (!valid) return;
                    return this.$store.dispatch("signIn", {
                        userName: this.userName,
                        password: this.password
                    }).then(res=>{
                        if(res.error)return
                        this.$router.push('/');
                    }).catch(err=>err)
                });
            }
        },
        layout: 'empty'
    }

</script>
