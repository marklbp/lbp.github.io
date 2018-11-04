<template>
  <form class="page-identify" ref="uploadForm" @submit.prevent="submit">
    <div class="card">
      <div class="title">
        <img src="./assets/img/rd-rect.png" >
        名片认证
      </div>
      <div class="upload-box">
        <div class="inner">
          <md-image-reader
            name="card"
            @select="selectFile"
            @complete="uploadComplete"
            @error="uploadError" v-validate="'required'"></md-image-reader>
            <img src="./assets/img/plus.png">
            <p>请上传您本人的名片<br>确保姓名、职位、公司等信息清晰</p>
            <md-activity-indicator
              v-show="uploading.card"
              type="spinner"
              :size="24"
              :text-size="14"
            >读取中...</md-activity-indicator>
            <img class="preview" v-if="card" :src="card" />
        </div>
      </div>
    </div>
    <div class="work">
      <div class="title">
        <img src="./assets/img/rd-rect.png" >
        工牌认证
      </div>
      <div class="upload-box">
        <div class="inner">
          <md-image-reader
            name="work"
            @select="selectFile"
            @complete="uploadComplete"
            @error="uploadError" v-validate="'required'"></md-image-reader>
            <img src="./assets/img/plus.png">
            <p>请上传您本人的工牌<br>确保姓名、职位、公司等信息清晰</p>
            <md-activity-indicator
              v-show="uploading.work"
              type="spinner"
              :size="24"
              :text-size="14"
            >读取中...</md-activity-indicator>
            <img class="preview" v-if="work" :src="work" />
        </div>
      </div>
    </div>
    <md-button class="fixed-bottom" @click="submit">提&nbsp;&nbsp;&nbsp;&nbsp;交</md-button>
    <div class="fixed-errors" :class="{'show': errorsText ? true : false}">
      <span style="position: relative;bottom: -.06rem;"><md-icon name="circle-alert"></md-icon></span>
      <span>{{errorsText}}</span>
    </div>
  </form>
</template>

<script>
  import {ImageReader, Button, ActivityIndicator, Icon} from 'mand-mobile'
  import {tipErr} from './plugins/utils'
  import './plugins/validate'
  import {post} from './plugins/http'
  export default {
    name: 'identify',
    components: {
      [ImageReader.name]: ImageReader,
      [Button.name]: Button,
      [ActivityIndicator.name]: ActivityIndicator,
      [Icon.name]: Icon
    },
    data () {
      return {
        uploading: {
          work: false,
          card: false
        },
        card: '',
        work: ''
      }
    },
    computed: {
      errorsText () {
        return (this.errors.first('card') || this.errors.first('work') || '').replace(/(\w+)/, (s, a)=>{
          if (a === 'card') return '名片'
          if (a === 'work') return '工牌'
        })
      }
    },
    methods: {
      selectFile (name, { files } = {}) {
        // console.log('select', name, files)
        this.uploading[name] = true
      },
      uploadComplete (name, { dataUrl, blob, file } = {}) {
        // console.log('complete', name, dataUrl, blob, file)
        this[name] = dataUrl
        this.uploading[name] = false
      },
      uploadError (name, { code, msg } = {}) {
        // console.log('error', name, code, msg)
        this.uploading[name] = false
        let nameText = name === 'card' ? '名片' : '工牌'
        tipErr(msg)
      },
      submit () {
        this.$validator.validateAll({
          card: this.card,
          work: this.work
        }).then(res=>{
          if (!res) return
          // 提交审核
          this.wait()
        })
      },
      wait () {
        this.$router.replace('/verify')
      }
    },
    watch: {
      card (n) {
        return this.$validator.validate('card', n)
      },
      work (n) {
        return this.$validator.validate('work', n)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-identify {
    padding-top: 20px;
  }
  .fixed-errors {
    position: fixed;
    z-index: 2;
    bottom: -9996px;
    width: 100%;
    height: 98px;
    line-height: 98px;
    font-size: 28px;
    background-color: #f23030;
    text-indent: 40px;
    color: #fff;
    transition: .5s;
    &.show {
      bottom: 0
    }
  }
  .fixed-bottom.md-button {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 98px;
    line-height: 98px;
    background-color: #4B9EEA;
  }
  .card {
    margin-bottom: 20px;
  }
  .card, .work {
    background-color: #fff;
    .upload-box {
      margin: 0 36px;
      padding: 32px 0;
      .inner {
        position: relative;
        height: 318px;
        border:2px solid rgba(191,191,191,1);
        box-shadow:0px -2px 4px 0px rgba(0, 0, 0, 0.14), 0px 2px 4px 0px rgba(0, 0, 0, 0.14);
        overflow: hidden;
        text-align: center;
        img {
          margin-top: 70px;
          width: 76px;
          &.preview {
            position: absolute;
            left: 0;
            top: 0;
            margin-top: 0;
            z-index: 101;
            width: 100%;
          }
        }
        p {
          margin-top: 45px;
          color: #666;
          font-size: 24px;
        }
        .md-image-reader {
          left: 0;
          :global(.md-image-reader-file) {
            left: 0;
          } 
        }
        .md-activity-indicator {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 101;
          height: 100%;
          width: 100%;
          background-color: rgba(255, 255, 255, .75);
          :global(.indicator-container) {
            height: 100%;
            justify-content: center;
          }
        }
      }
    }
  }
  .title {
    padding: .225rem .28rem;
    border-bottom: .01rem solid #E5E5E5;
    font-size: .28rem;
    color: #333;
    img {
      width: .04rem;
      margin-right: .18rem;
      vertical-align: top;
    }
  }
</style>