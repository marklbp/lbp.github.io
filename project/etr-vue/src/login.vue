<template>
    <form class="page-login" @submit.prevent="login">
      <div class="input-field" :class="{'is-danger': errors.has('phone')}">
        <div class="input">
          <input type="text" name="phone" v-validate="'required|phone'" v-model="phone" placeholder="请输入手机号">
          <span class="msg" v-if="errors.has('phone')">{{errors.first('phone')}}</span>
        </div>
      </div>
      <div class="input-field" v-if="!loginType" :class="{'is-danger': errors.has('code')}">
        <div class="input">
          <input type="text" name="code" v-validate="'required'" v-model="code" placeholder="请输入验证码">
          <span class="msg" v-if="errors.has('code')">{{errors.first('code')}}</span>
        </div>
        <span class="btn-code" @click="getCode" :class="{'disabled': intervalTimes >= 0}">{{intervalTimes}}</span>
      </div>
      <div class="input-field" v-if="loginType" :class="{'is-danger': errors.has('password')}">
        <div class="input">
          <input type="password" name="password" v-validate="'required'"  v-model="password" placeholder="请输入密码">
          <span class="msg" v-if="errors.has('password')">{{errors.first('password')}}</span>
        </div>
      </div>
      <div class="input-field input-btns">
        <button class="btn btn-login">登录</button>
        <span>已阅读并同意<em class="protocol" @click="protocolDialog.open = !protocolDialog.open">《用户服务协议》</em></span>
        <span class="login-way" @click="toggleWay">{{!loginType ? '密码':'短信'}}登录</span>
      </div>
      <div class="login-wx">
        <div><span>OR</span></div>
        <div><img src="./assets/img/wx.png"></div>
        <div>微信登录</div>
      </div>
      <md-dialog
        title="用户服务协议"
        :closable="false"
        :mask-closable="true"
        v-model="protocolDialog.open"
        :btns="protocolDialog.btns"
      >
        人生的刺，就在这里，留恋着不肯快走的，偏是你所不留恋的东西。
      </md-dialog>
    </form>
</template>

<script>
  import { Dialog } from 'mand-mobile'
  import './plugins/validate'
  import {post} from './plugins/http'
  export default {
    name: 'login',
    components: {
      [Dialog.name]: Dialog
    },
    data () {
      return {
        loginType: 0,
        intervalTimes: '获取验证码',
        code: '',
        phone: '',
        password: '',
        protocolDialog: {
          open: false,
          btns: []
        }
      }
    },
    methods: {
      login () {
        this.$validator.validateAll().then(res=>{
          if(!res) return
          // post()
          localStorage.setItem('login', 1)
          this.$router.replace('/me')
        })
      },
      getCode () {
        if(this.intervalTimes >= 0)return
        this.intervalTimes = 60
        this.interval = setInterval(() => {
            if(this.intervalTimes === 0){
                clearInterval(this.interval)
                this.intervalTimes = '获取验证码'
                return
            }
            this.intervalTimes -= 1
        },1000)
        this.ajaxCode()
      },
      ajaxCode () {

      },
      toggleWay () {
        this.loginType = !this.loginType
        this.intervalTimes = '获取验证码'
        clearInterval(this.interval);
      }
    }
  }
</script>

<style lang="scss" scoped>
  input::-webkit-input-placeholder{
    color:#949494;
    font-weight: normal;
  }
  input::-moz-placeholder{   
    /* Mozilla Firefox 19+ */
    color:#949494;
    font-weight: normal;
  }
  input:-moz-placeholder{    
    /* Mozilla Firefox 4 to 18 */
    color:#949494;
    font-weight: normal;
  }
  input:-ms-input-placeholder{  
    /* Internet Explorer 10-11 */ 
    color:#949494;
    font-weight: normal;
  }
  .page-login {
    font-size: .24rem;
    .input-field {
      position: relative;
      border-top: .01rem solid #eee;
      &:first-child {
        border-top: 0 none;
      }
      &.is-danger {
        .msg {
          position: absolute;
          z-index: 1;
          left: .35rem;
          color: #ff3860
        }
      }
      &.input-btns {
        border-top: 0 none;
        margin-top: .73rem;
        padding-right: .55rem;
        padding-left: .55rem;
        color: #666;
        span {
          font-size: .24rem;
        }
        .protocol {
          cursor: pointer;
          font-style: normal;
          color: #4B9EEA;
        }
        .login-way {
          float: right;
        }
      }
      .btn {
        height: .88rem;
        border-radius: .1rem;
        line-height: .88rem;
        background: rgba(75,158,234,1);
        text-align: center;
        color: #fff;
        font-size: .32rem;
        &-login {
          display: block;
          width: 100%;
          margin-bottom: .33rem;
          outline: none;
          border: 0 none;
        }
      }
      .btn-code {
        position: absolute;
        right: .35rem;
        top: .25rem;
        width: 1.63rem;
        height: .47rem;
        line-height: .47rem;
        border: .01rem solid #4b9eea;        
        border-radius: .1rem;
        text-align: center;
        color: #4B9EEA;
        font-size: .25rem;
      }
      .input {
        input {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          -o-box-sizing: border-box;
          -ms-box-sizing: border-box;
          box-sizing: border-box;
          height: .98rem;
          width: 100%;
          padding: .35rem;
          border: 0 none;
          line-height: .28rem;
          font-size: .28rem;
          outline: none
        }
      }
    }
    .login-wx {
      margin-top: 1.47rem;
      padding-left: .55rem;
      padding-right: .55rem;
      text-align: center;
      img {
        width: 1.19rem;
      }
      div:first-child {
        margin-bottom: .6rem;
        color: #999;
        &:before,
        &:after {
          width: 40%;
          content: '';
          display: inline-block;
          border-top: .02rem solid #BFBFBF;
          margin-bottom: .07rem;
        }
        span {
          margin-left: 6%;
          margin-right: 6%;
        }
      }
      color: #666;
      font-size: .24rem;
    }
  }
</style>