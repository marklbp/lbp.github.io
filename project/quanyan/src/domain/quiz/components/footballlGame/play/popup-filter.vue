/* 筛选 */
<template>
  <div class="wrapper" v-show="value" @touchmove.prevent>
    <div class="mask" @click="clickMask"></div>
    <div class="choose-wrapper" :class="{'show-choose-wrapper': showContnet}">
      <div class="center-flex-v">
        <div class="center-flex flex-full f-26 c-ad choose-bor choose-item" @click="selectAll">全&ensp;选</div>
        <div class="place-w24"></div>
        <div class="center-flex flex-full f-26 c-ad choose-bor choose-item" @click="reverseSelect">反&ensp;选</div>
        <div class="place-w24"></div>
        <div class="center-flex flex-full f-26 c-ad choose-bor choose-item" @click="selectFiveLeagues">五大联赛</div>
      </div>
      <template v-for="i in matchRows">
        <div class="center-flex-v m-t24 f-26 c-31" :key="i">
          <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(matchNames[(i - 1) * 3])" :class="{choosed: temFilterMatchNames.indexOf(matchNames[(i - 1) * 3]) > -1}">
            {{matchNames[(i - 1) * 3]}}
            <RBChoosed v-if="temFilterMatchNames.indexOf(matchNames[(i - 1) * 3]) > -1"></RBChoosed>
          </div>
          <div class="place-w24"></div>
          <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(matchNames[(i - 1) * 3 + 1])" :class="{choosed: temFilterMatchNames.indexOf(matchNames[(i - 1) * 3 + 1]) > -1, 'black-item': matchNames.length < (i - 1) * 3 + 2}">
            {{matchNames[(i - 1) * 3 + 1]}}
            <RBChoosed v-if="temFilterMatchNames.indexOf(matchNames[(i - 1) * 3 + 1]) > -1"></RBChoosed>
          </div>
          <div class="place-w24"></div>
          <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(matchNames[(i - 1) * 3 + 2])" :class="{choosed: temFilterMatchNames.indexOf(matchNames[(i - 1) * 3 + 2]) > -1, 'black-item': matchNames.length < (i - 1) * 3 + 3}">
            {{matchNames[(i - 1) * 3 + 2]}}
            <RBChoosed v-if="temFilterMatchNames.indexOf(matchNames[(i - 1) * 3 + 2]) > -1"></RBChoosed>
          </div>
        </div>
      </template>
      <div class="text-center f-24 c-86 m-t20">
        共<span class="f-24 c-f0">{{matchCount}}</span>场比赛
      </div>
      <!-- 底部button -->
      <div class="center-flex-v">
        <div class="center-flex flex-full f-26 c-ad choose-bor btn-item" @click="clickCancel">取&ensp;消</div>
        <div class="place-w24"></div>
        <div class="center-flex flex-full f-26 c-ad choose-ok-bor btn-item" @click="clickConfirm">确&ensp;认</div>
      </div>
    </div>
  </div>
</template>

<script>
import RBChoosed from 'quiz/components/footballlGame/rb-choosed.vue'
import { FiveLeagues } from 'quiz/tools/contants/index.js'
import { showTip } from 'quiz/tools/utils/index.js'
export default {
  name: 'PopupFilter',
  components: {
    RBChoosed
  },
  props: {
    //  是否显示
    value: {
      type: Boolean
    },
    //  筛选条件
    filterMatchNames: {
      type: Array,
      default () {
        return []
      }
    },
    //  所有的赛事名称
    matchNames: {
      type: Array,
      default () {
        return []
      }
    },
    //  同级比赛列表
    matchs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      //  临时存放赛事过滤条件
      temFilterMatchNames: [],
      //  是否显示内容部分，用于产生动画
      showContnet: false,
      //  筛选过后赛事场数
      matchCount: 0
    }
  },
  computed: {
    //  计算要显示几行赛事
    matchRows () {
      console.log(this.matchNames)
      let count1 = parseInt(this.matchNames.length / 3)
      let count2 = this.matchNames.length % 3 > 0 ? 1 : 0
      return count1 + count2
    }
  },
  watch: {
    //  监听过滤弹窗显示与否
    value: {
      immediate: true,
      handler: function (val) {
        //  控制动画
        let timer = requestAnimationFrame(() => {
          this.showContnet = val
          cancelAnimationFrame(timer)
        })
        // 初始化数据
        if (val) this.temFilterMatchNames = [...this.filterMatchNames]
      }
    },
    //  监听筛选条件来计算比赛场数
    temFilterMatchNames: {
      immediate: true,
      handler: function (val) {
        let count = 0
        this.matchs.forEach(item => {
          let { matchName } = item
          if (val.includes(matchName)) count++
        })
        this.matchCount = count
      }
    }
  },
  methods: {
    //  全选
    selectAll () {
      this.temFilterMatchNames = [...this.matchNames]
    },
    //  反选
    reverseSelect () {
      let arr = []
      this.matchNames.forEach(item => {
        if (!this.temFilterMatchNames.includes(item)) arr.push(item)
      })
      this.temFilterMatchNames = arr
    },
    //  点击具体某一项
    selectItem (matchName) {
      let index = this.temFilterMatchNames.indexOf(matchName)
      if (index > -1) {
        this.temFilterMatchNames.splice(index, 1)
      } else {
        this.temFilterMatchNames.push(matchName)
      }
    },
    //  选中五大联赛
    selectFiveLeagues () {
      let arr = []
      FiveLeagues.forEach(item => {
        if (this.matchNames.includes(item)) arr.push(item)
      })
      this.temFilterMatchNames = arr
    },
    //  取消
    clickCancel () {
      this.$emit('filterMatch', this.filterMatchNames)
    },
    //  确定
    clickConfirm () {
      if (this.matchCount < 1) {
        showTip('请至少选择一场比赛')
        return false
      }
      this.$emit('filterMatch', this.temFilterMatchNames)
    },
    //  点击遮罩层
    clickMask () {
      // this.value = false
      this.$emit('hidePopup')
    }
  }
}
</script>

<style lang="stylus" scoped>
/* 顶部高度 */
top-height = 92px
.wrapper
  position fixed
  left 0
  right 0
  top top-height
  bottom 0
.mask
  position absolute
  left 0
  top 0
  bottom 0
  right 0
  background-color rgba(0, 0, 0, .6)
  z-index 1
.choose-wrapper
  padding 22px 36px
  background-color #FFF
  position relative
  z-index 2
  transform scaleY(0)
  transition transform .2s linear
  transform-origin center top
.show-choose-wrapper
  transform scaleY(1)
.place-w24
  width 24px
.choose-item
  height 60px
.btn-item
  height 80px
  margin-top 20px
.m-t24
  margin-top 24px
.bg-f6
  background-color #F6F6F6
.m-t20
  margin-top 20px
.black-item
  background-color transparent
  border none
  color transparent
</style>

<style lang="scss" scoped>
.choose-bor:not(.black-item) {
  position: relative;
  @include hairline(#DBDBDB, 4px);
}
.choosed:not(.black-item) {
  color: #F04A1E;
  position: relative;
  @include hairline(#F04A1E, 4px);
  background-color: #FFF;
}
.choose-ok-bor {
  color: #F04A1E;
  position: relative;
  @include hairline(#F04A1E, 4px);
}
</style>
