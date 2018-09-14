/* 选择过关方式 */
/* 筛选 */
<template>
  <div class="wrapper" v-show="showChoosePassFav" @touchmove.prevent>
    <div class="mask" @click="clickMask"></div>
    <div class="choose-wrapper" :class="{'show-choose-wrapper': showContnet}">
      <!-- 头部 -->
      <div class="game-fav-box center-flex-v">
        <div class="game-fav-item center-flex-v fav-box box-plr" @click="clickCancel">
          <div class="flex-full center-flex-v">
            <div class="f-28 c-86">过关方式</div>
            <div class="f-28 c-31">
              <div v-if="temPassFav.length < 1">(必选)</div>
              <div v-if="temPassFav.length === 1">
                {{temPassFav[0]}}
              </div>
              <div v-if="temPassFav.length === 2">
                {{temPassFav[0]}};{{temPassFav[1]}}
              </div>
              <div v-if="temPassFav.length > 2">
                {{temPassFav[0]}}...{{temPassFav[temPassFav.length - 1]}}
              </div>
            </div>
          </div>
          <div class="top-icon c-86"></div>
        </div>
        <div class="game-fav-item center-flex-v" @click="chooseMultiple">
          <div class="f-28 c-86 box-plr">投</div>
          <div class="f-28 c-31 double-val flex-full center-flex">{{multiple}}</div>
          <div class="c-31 f-28 box-plr">倍</div>
        </div>
      </div>

      <div class="f-26 c-86 box-plr m-t24">自由过关</div>
      <!-- 内容 -->
      <template v-for="i in matchRows">
        <div class="center-flex-v m-t24 f-26 c-31 box-plr" :key="i">
          <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(passFav[(i - 1) * 4])" :class="{choosed: temPassFav.indexOf(passFav[(i - 1) * 4]) > -1}">
            {{passFav[(i - 1) * 4]}}
            <RBChoosed v-if="temPassFav.indexOf(passFav[(i - 1) * 4]) > -1"></RBChoosed>
          </div>
          <div class="place-w24"></div>
          <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(passFav[(i - 1) * 4  + 1])" :class="{choosed: temPassFav.indexOf(passFav[(i - 1) * 4  + 1]) > -1, 'black-item': passFav.length < (i - 1) * 4  + 2}">
            {{passFav[(i - 1) * 4  + 1]}}
            <RBChoosed v-if="temPassFav.indexOf(passFav[(i - 1) * 4  + 1]) > -1"></RBChoosed>
          </div>
          <div class="place-w24"></div>
          <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(passFav[(i - 1) * 4  + 2])" :class="{choosed: temPassFav.indexOf(passFav[(i - 1) * 4  + 2]) > -1, 'black-item': passFav.length < (i - 1) * 4  + 3}">
            {{passFav[(i - 1) * 4  + 2]}}
            <RBChoosed v-if="temPassFav.indexOf(passFav[(i - 1) * 4  + 2]) > -1"></RBChoosed>
          </div>
          <div class="place-w24"></div>
          <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(passFav[(i - 1) * 4  + 3])" :class="{choosed: temPassFav.indexOf(passFav[(i - 1) * 4  + 3]) > -1, 'black-item': passFav.length < (i - 1) * 4  + 4}">
            {{passFav[(i - 1) * 4  + 3]}}
            <RBChoosed v-if="temPassFav.indexOf(passFav[(i - 1) * 4  + 3]) > -1"></RBChoosed>
          </div>
        </div>
      </template>
      <!-- 底部button -->
      <div class="center-flex-v box-plr">
        <div class="center-flex flex-full f-26 c-ad choose-bor btn-item" @click="clickCancel">取&ensp;消</div>
        <div class="place-w24"></div>
        <div class="center-flex flex-full f-26 c-ad choose-ok-bor btn-item" @click="clickConfirm">确&ensp;认</div>
      </div>
    </div>
  </div>
</template>

<script>
import RBChoosed from 'quiz/components/footballlGame/rb-choosed.vue'
import { showTip } from 'quiz/tools/utils/index.js'
import { mapState } from 'vuex'
console.log(showTip)
export default {
  name: 'PopupPassFav',
  components: {
    RBChoosed
  },
  props: {
    //  是否显示
    showChoosePassFav: {
      type: Boolean
    },
    //  已确定选择的过关方式
    selectedPassFav: {
      type: Array,
      default () {
        return []
      }
    },
    //  倍数
    multiple: {
      default: 1
    }
  },
  data () {
    return {
      //  临时存放过关方式
      temPassFav: [],
      //  是否显示内容部分，用于产生动画
      showContnet: false
    }
  },
  computed: {
    //  过关方式
    ...mapState('FBBetting', ['passFav']),
    //  计算要显示几行过关方式
    matchRows () {
      let count1 = parseInt(this.passFav.length / 4)
      let count2 = this.passFav.length % 4 > 0 ? 1 : 0
      console.log('几行过关方式===================>', count1 + count2)
      return count1 + count2
    }
  },
  watch: {
    //  监听过滤弹窗显示与否
    showChoosePassFav: {
      immediate: true,
      handler: function (val) {
        //  控制动画
        let timer = requestAnimationFrame(() => {
          this.showContnet = val
          cancelAnimationFrame(timer)
        })
        // 初始化数据
        if (val) this.temPassFav = [...this.selectedPassFav]
      }
    }
  },
  methods: {
    //  点击具体某一项
    selectItem (matchName) {
      let index = this.temPassFav.indexOf(matchName)
      if (index > -1) {
        this.temPassFav.splice(index, 1)
      } else {
        this.temPassFav.push(matchName)
      }
      //  排序
      this.temPassFav.sort((item1, item2) => {
        let [numer1] = item1
        let [numer2] = item2
        return numer1 > numer2
      })
    },
    //  取消
    clickCancel () {
      this.$emit('choosedPassFav', this.selectedPassFav)
    },
    //  确定
    clickConfirm () {
      this.$emit('choosedPassFav', this.temPassFav)
    },
    //  点击遮罩层
    clickMask () {
      this.$emit('setShowChoosePassFav', false)
    },
    //  选择倍数
    chooseMultiple () {
      this.$emit('chooseMultiple')
    }
  }
}
</script>

<style lang="stylus" scoped>
/* 底部过关方式高度 */
bottom1-height = 102px
/* 底部付款按钮容器高度 */
bottom2-height = 102px
/* 容器左右边距 */
box-plr = 24px
.wrapper
  position fixed
  left 0
  right 0
  top 0
  bottom 0
.mask
  position absolute
  left 0
  top 0
  bottom bottom2-height + 1
  right 0
  background-color rgba(0, 0, 0, .6)
  z-index 1
.choose-wrapper
  padding 22px 0
  background-color #FFF
  position absolute
  left 0
  right 0
  bottom bottom2-height + 1
  z-index 2
  transform scaleY(0)
  transition transform .2s linear
  transform-origin center bottom
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
.game-fav-box
  height bottom1-height
.fav-box
  height 60px
.top-icon
  position relative
  top 5px
.double-val
  background-color #F6F6F6
  border-radius 4px
  height 60px
.game-fav-item
  width 50%
.box-plr
  padding 0 box-plr
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
.fav-box {
  position: relative;
  @include hairline-right(#D7D7D7);
}
.game-fav-box {
  position: relative;
  @include hairline-bottom(#D7D7D7);
}
</style>
