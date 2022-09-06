<template>
  <div class="iframe-block" :style="comStyle">
    <slot v-if="enableDrag" name="drag" />
    <div class="iframeDrogTop">
      {{ title }}
    </div>
    <div class="iframeBox">
      <iframe
        ref="iframe"
        v-if="src"
        style="width: 100% !important; height:100% !important;"
        :src="src"
        frameborder="0"
        height="100%"
        scrolling="auto"
        seamless
        width="100%"
      >
      </iframe>
      <div class="placeholder" v-else>
        <img src="~/assets/img/404.svg" /><span>暂无数据</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'iframe-block',
  components: {},
  data() {
    return {
      timmer: null,
      bool: false,
      currentHeight: this.height
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({
        width: 12,
        height: '',
        title: '',
        src: '',
        enableDrag: false
      })
    }
  },
  computed: {
    width() {
      const width = this.params.width
      return width || 12
    },
    height() {
      const height = this.params.height
      return (height || '400') + 'px'
    },
    title() {
      const title = this.params.title
      return title || ''
    },
    src() {
      const src = this.params.src
      let result = ''
      if (src.replace(/(^\s*)|(\s*$)/g, '')) {
        result = src
        if (
          result.indexOf('http://') !== 0 &&
          result.indexOf('https://') !== 0
        ) {
          result = `${window.location.protocol}//${result}`
        }
      }
      return result
    },
    enableDrag() {
      return this.params.enableDrag
    },
    comStyle() {
      return {
        width: this.width,
        height: this.height
      }
    },
    showScroll() {
      return this.list.length > 1
    }
  },
  mounted() {
    if (this.src) {
      // this.$refs.iframe.addEventListener('load', this.listenHeight.bind(this))
    }
  },
  methods: {
    /* listenHeight() {
      this.timmer = setTimeout(() => {
        try {
          const newHeight =
            this.$el
              .querySelector('iframe')
              .contentWindow.document.body.querySelector('div').clientHeight +
            'px'
          if (this.currentHeight !== newHeight) {
            this.currentHeight = newHeight
            this.comStyle.height = newHeight
          }
        } catch (error) {
          console.log(error)
          clearTimeout(this.timmer)
          this.timmer = null
        }
        this.listenHeight()
      }, 500)
    }
  },
  beforeDestroy() {
    clearTimeout(this.timmer)
    this.timmer = null
    if (this.$refs.iframe) {
      this.$refs.iframe.removeEventListener(
        'load',
        this.listenHeight.bind(this)
      )
    }
  } */
  }
}
</script>
<style lang="scss" scoped>
@mixin flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
@mixin border-box {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.iframe-block {
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  .placeholder {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    margin: auto;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    color: #b7b7b7;
    font-size: 14px;
    img {
      width: 40%;
      vertical-align: middle;
      object-fit: scale-down;
    }
    span {
      width: 20%;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.iframeDrogTop {
  background-color: white;
  height: 58px;
  font-size: 16px;
  font-weight: 700;
  line-height: 30px;
  padding: 16px 32px;
  border: 1px solid #e8e8e8;
  border-style: none none solid none;
}
.iframeBox {
  height: -moz-calc(100% - 58px);
  height: -webkit-calc(100% - 58px);
  height: calc(100% - 58px);
}
.showMoreData {
  position: absolute;
  z-index: 1000;
  left: 104px;
  top: 22px;
  font-size: 12px;
  color: #3366ff;
}
</style>
