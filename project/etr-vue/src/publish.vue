<template>
  <form class="page-publish" @submit.prevent="publish">
    <md-field class="project-name">
      <md-field-item
        name="item0"
        title="项目名称："
        customized
        align="center">
        <md-input-item
          ref="input1"
          placeholder="请输入项目名称"
          class="project-name-input"
          v-validate="'required'"
          name="projectName"
          v-model="projectName"
        ></md-input-item>
      </md-field-item>
    </md-field>
    <div class="input-field input-block">
      <div class="label">项目描述：</div>
      <div class="input">
        <textarea v-validate="'required'" v-model="projectDesc" name="projectDesc" placeholder="请详细描述你的项目内容，提高项目合作成功率"></textarea> 
      </div>
    </div>
    <div class="input-field input-block">
      <div class="label">所需资源：</div>
      <div class="input">
        <textarea v-validate="'required'" v-model="projectResource" name="projectResource" placeholder="请输入你所需要的资源"></textarea> 
      </div>
    </div>
    <div class="input-field input-block">
      <div class="label">可以提供：</div>
      <div class="input">
        <textarea v-validate="'required'" v-model="projectAvailable" name="projectAvailable" placeholder="请输入你能提供的资源"></textarea> 
      </div>
    </div>
    <div class="input-group">
      <md-field>
        <md-field-item
          name="item1"
          title="项目类型"
          arrow="arrow-right"
          :value="projectType"
          solid
          align="right"
          @click="showPopUp({type: 0, show: true, title: '项目类型'})">
        </md-field-item>
      </md-field>
      <md-field>
        <md-field-item
          name="item2"
          title="合作形式"
          arrow="arrow-right"
          :value="cooperateType"
          solid
          align="right"
          @click="showPopUp({type: 1, show: true, title: '合作形式'})">
        </md-field-item>
      </md-field>
      <md-field>
        <md-field-item
          name="item3"
          title="截止日期"
          arrow="arrow-right"
          :value="date"
          solid
          align="right"
          @click.native="showDateDialog = true">
        </md-field-item>
      </md-field>
      <input v-validate="'required'" v-model="projectType" type="hidden" name="projectType">
      <input v-validate="'required'" v-model="cooperateType" type="hidden" name="cooperateType">
      <input v-validate="'required'" v-model="date" type="hidden" name="date">
    </div>
    <button class="input-submit" type="submit">发&nbsp;&nbsp;&nbsp;&nbsp;布</button>
    <div class="fixed-errors" :class="{'show': errorsText ? true : false}">
      <span style="position: relative;bottom: -.06rem;"><md-icon name="circle-alert"></md-icon></span>
      <span>{{errorsText}}</span>
    </div>
    <md-date-picker
      ref="datePicker"
      v-model="showDateDialog"
      type="custom"
      today-text="&(今天)"
      title="选择截止日期"
      :text-render="textRender"
      :custom-types="['yyyy', 'MM','dd']"
      :default-date="currentDate"
      @change="dateChange"
      @confirm="dateConfirm"
    ></md-date-picker>
    <md-popup
      v-model="isPopupShow.show"
      position="bottom"
    >
      <md-popup-title-bar
        :title="isPopupShow.title"
        ok-text="确定"
        cancel-text="取消"
        @confirm="hidePopUp(1)"
        @cancel="hidePopUp"
      ></md-popup-title-bar>
      <div class="popup-content" @click="setProjectCooperateTypes">
        <div class="popup-content-project" v-show="isPopupShow.type === 0">
          <span v-for="(r, i) in projectTypes" :class="r.class" :key="i">{{r.text}}</span>
        </div>
        <div class="popup-content-cooperate" v-show="isPopupShow.type === 1">
          <span v-for="(r, i) in cooperateTypes" :class="r.class" :key="i">{{r.text}}</span>
        </div>
      </div>
    </md-popup>
    <md-dialog
      :title="publishDialog.title"
      :closable="false"
      v-model="publishDialog.show"
      :btns="publishDialog.btns"
      class="publish-dialog"
    >
      {{publishDialog.value}}
    </md-dialog>
  </form>
</template>

<script>
  import {Icon, Popup, PopupTitleBar, DatePicker, Field, FieldItem, InputItem, Dialog} from 'mand-mobile'
  import {tipOK} from './plugins/utils'
  import './plugins/validate'
  import {post} from './plugins/http'
  export default {
    name: 'publish',
    components: {
      [DatePicker.name]: DatePicker,
      [Field.name]: Field,
      [FieldItem.name]: FieldItem,
      [InputItem.name]: InputItem,
      [Popup.name]: Popup,
      [PopupTitleBar.name]: PopupTitleBar,
      [Icon.name]: Icon,
      [Dialog.name]: Dialog
    },
    data () {
      return {
        currentDate: new Date(),
        projectName: '',
        projectDesc: '',
        projectResource: '',
        projectAvailable: '',
        projectType: '',
        cooperateType: '',
        date: '',
        showDateDialog: false,
        showProjectDialog: false,
        showCooperateDialog: false,
        isPopupShow: {
          title: '',
          type: '',
          show: false,
          value: ''
        },
        publishDialog: {
          title: '',
          type: '',
          show: false,
          value: '',
          btns: [
            {text: '取消', handler: this.closePublishDialog.bind(this)},
            {text: '去完成', handler: this.closePublishDialog.bind(this, 1)}
          ]
        },
        projectTypes: [
          {text: '媒体', class: ''}, 
          {text: '场地', class: ''}, 
          {text: '礼品', class: ''}, 
          {text: '广告', class: ''}, 
          {text: '流量', class: ''}
        ],
        cooperateTypes: [
          {text: '媒体', class: ''}, 
          {text: '场地', class: ''}, 
          {text: '礼品', class: ''}, 
          {text: '广告', class: ''}, 
          {text: '流量', class: ''}
        ]
      }
    },
    computed: {
      errorsText () {
        return (this.errors.first('projectName') 
                || this.errors.first('projectDesc') 
                || this.errors.first('projectResource') 
                || this.errors.first('projectAvailable') 
                || this.errors.first('projectType') 
                || this.errors.first('cooperateType') 
                || this.errors.first('date') || '').replace(/(\w+)/, (s, a)=>{
                  switch (a) {
                    case 'projectName':
                    return '项目名称'
                    case 'projectDesc':
                    return '项目描述'
                    case 'projectResource':
                    return '项目资源'
                    case 'projectAvailable':
                    return '可用资源'
                    case 'projectType':
                    return '项目类型'
                    case 'cooperateType':
                    return '合作形式'
                    case 'date':
                    return '截止日期'
                  }
                })
      }
    },
    methods: {
      publish () {
        this.$validator.validateAll().then(res=>{
          if (!res) return
          // tipOK('发布成功')
          this.showPublishDialog()
        })
      },
      showPublishDialog () {
        this.publishDialog = Object.assign(this.publishDialog, {
          show: true,
          title: '未认证',
          value: '您还未认证身份，暂时无法发布信息'
        })
      },
      closePublishDialog (open) {
        this.publishDialog.show = false
        if (open) {
          this.$router.push('/me')
        }
      },
      textRender () {
        const args = Array.prototype.slice.call(arguments)
        const typeFormat = args[0] // 类型
        const column0Value = args[1] // 第1列选中值
        const column1Value = args[2] // 第2列选中值
        const column2Value = args[3] // 第3列选中值

        if (typeFormat === 'dd') {
          return `${column0Value}/${column1Value}/${column2Value}`
        }
      },
      dateChange (columnIndex, itemIndex, value) {},
      dateConfirm (columnsValue) {
        console.log(`[Mand Mobile] DatePicker Confirm\nvalue: ${JSON.stringify(columnsValue)}`)
        this.date = this.$refs.datePicker.getFormatDate('yyyy-MM-dd')
      },
      showPopUp (obj) {
        this.isPopupShow = Object.assign(this.isPopupShow, obj)
      },
      hidePopUp (b) {
        this.isPopupShow.show = false
        if (!b) return
        this[this.isPopupShow.type ? 'cooperateType' : 'projectType'] = this.isPopupShow.value
      },
      setProjectCooperateTypes (e) {
        let target = e.target
        let types = this[this.isPopupShow.type ? 'cooperateTypes' : 'projectTypes']
        if (target.nodeName.toLowerCase() != 'span') return
        let text = target.innerHTML
        types.forEach(t=> {
          t.class = t.text === text ? 'focus' : ''
        })
        this.isPopupShow.value = text
      }
    },
    watch: {
      'isPopupShow.show': function (n) {
        if(!n) this.$validator.validate(this.isPopupShow.type ? 'cooperateType' : 'projectType')
      },
      'showDateDialog': function (n) {
        if(!n) this.$validator.validate('date')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-popup-title-bar {
    background-color: transparent;
    &:before {
      display: none;
    }
    :global(.title-bar-left) {
      color: #999;
    }
    :global(.title-bar-right) {
      color: #4B9EEA;
    }
    :global(.title-bar-title){
      font-size: 32px;
    }
  }
  .fixed-errors {
    position: fixed;
    z-index: 2;
    bottom: -9996px;
    width: 100%;
    height: 96px;
    line-height: 96px;
    font-size: 28px;
    background-color: #f23030;
    text-indent: 40px;
    color: #fff;
    transition: .5s;
    &.show {
      bottom: 0
    }
  }
  .page-publish {
    padding-bottom: 1.12rem;
    background-color: #eee;
  }
  .input-field {
    display: flex;
    margin-bottom: .16rem;
    padding: .3rem .4rem;
    font-size: .28rem;
    background-color: #fff;
    .label {
      display: inline-block;
      font-size: .32rem;
      color: #333;
      white-space: nowrap;
    }
    .input{
      flex: 1
    }
    textarea, input {
      margin: 0;
      padding: 0;
      border: 0 none;
      width: 100%;
      font-size: .28rem;
      outline: none;  
    }
    textarea {
      min-height: .8rem;
      resize: vertical;
    }
    &.input-block {
      display: block;
      padding: 0 0 .3rem 0;
      .label {
        display: block;
        padding: .3rem 0 .27rem .4rem;
        border-bottom: .01rem solid #E5E5E5;
      }
      .input {
        margin: .27rem .4rem 0 .4rem;
      }
    }
    &.input-select {
      padding: 0;
      border-bottom: .01rem solid #E5E5E5;
      .label {
        padding: .3rem 0 .3rem .4rem;
      }
      .input {
        position: relative;
        select {
          -webkit-appearance: none;
          border: 0;
          outline: 0;
          background-color: transparent;
          width: 100%;
          font-size: inherit;
          height: .96rem;
          line-height: .96rem;
          position: relative;
          z-index: 1;
          padding-left: .4rem;
          padding-right: .8rem;
          color: #F07979;
        }
        &:after {
          content: " ";
          height: .2rem;
          width: .2rem;
          border-width: .02rem .02rem 0 0;
          border-color: #8C8C8C;
          border-style: solid;
          -webkit-transform: translateY(-50%) rotate(45deg);
          transform: translateY(-50%) rotate(45deg);
          position: relative;
          top: -.02rem;
          position: absolute;
          top: 50%;
          right: .4rem;
        }
      }
    }
  }
  .input-group {
    margin-bottom: .16rem;
    .input-field {
      margin-bottom: 0;
    }
  }
  .input-submit {
    position: fixed;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    padding: 0;
    border: 0 none;
    height: .96rem;
    background-color: #4B9EEA;
    font-size: .36rem;
    text-align: center;
    color: #fff;
    outline: none;
  }
  .md-field {
    border-bottom: 2px solid #eee;
    :global(.md-field-content) {
      :global(.md-field-item) {
        padding-left: 40px;
        padding-right: 40px;
        :global(.md-field-item-content) {
          font-size: 32px;
        }
        :global(.md-field-item-inner){
          padding-top: 30px;
          padding-bottom: 30px;
          :global(.md-field-item-label) {
            :global(.md-field-item-title) {
              height: 36px;
              line-height: 1;
              font-size: 32px;
            }
          }
        }
      }
      :global(.md-input-item-container) {
        &:before {
          display: none;
        }
      }
    }
  }
  .project-name-input {
    min-height: 0;
    :global(.md-input-item-control) {
      min-height: 0;
      :global(.md-input-item-input) {
        height: 36px;
        font-size: 32px;
      }
    }
  }
  .project-name {
    border-bottom: 0 none;
    margin-bottom: 16px;
  }
  .md-popup.bottom{
    :global(.md-popup-box) {
      background-color: #eee;
    }
  }
  .popup-content {
    &-project,
    &-cooperate {
      padding: 0 27px 22px 11px;
      font-size: 24px;
      color: #999;
      span {
        position: relative;
        background-color: #F8F8FA;
        text-align: center;
        width: 162px;
        height: 70px;
        line-height: 70px;
        float: left;
        margin-left: 16px;
        margin-top: 22px;
        overflow: hidden;
        &.focus{
          background:rgba(235,241,255,1);
          color: #436DF3;
          &:before {
            content: ' ';
            width: .52rem;
            height: .52rem;
            background-color: #436DF3;
            border-radius: .52rem;
            position: absolute;
            right: -.26rem;
            top: -.26rem;
          }
          &:after {
            content: ' ';
            width: .08rem;
            height: .16rem;
            position: absolute;
            right: .07rem;
            top: 0;
            border: .01rem solid #fff;
            transform: rotate(45deg);
            border-left: 0;
            border-top: 0;
          }
        }
      }
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    }
  }
</style>