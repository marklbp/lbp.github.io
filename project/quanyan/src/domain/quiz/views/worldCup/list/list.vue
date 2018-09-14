<template>
  <div>
    <!--头部tab -->
    <div class="header-box">
      <div class="text-right" @click="viewMainMetting">
        <img class="main_met_btn active-btn" src="@/domain/quiz/assets/worldcup/list/man_meeting_btn.png" alt="" srcset="">
      </div>
      <div class="tab-wrapper center-flex f-30 c-f flex-full">
        <div class="tab-item m-r52 center-flex flex-full" @click="changeTab(1)" :class="{'tab-item-active': currentTab === 1}">世界杯冠军</div>
        <div class="tab-item center-flex flex-full" @click="changeTab(2)" :class="{'tab-item-active': currentTab === 2}">世界杯冠亚军</div>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content-wrapper relative-view">
      <transition name="fade">
        <keep-alive>
          <champion-list class="transition-item" v-if="currentTab === 1" :key="1"></champion-list>
          <runner-up-list class="transition-item" v-if="currentTab === 2" :key="2"></runner-up-list>
        </keep-alive>
      </transition>
    </div>
    <!-- 底部内容区域 -->
    <div class="footer-wrapper center-flex-v">
      <!-- 删除区域 -->
      <div class="delete-wrppaer center-flex" @click="clears">
        <div class="text-center">
          <img class="del-icon" src="@/domain/quiz/assets/delete-f.svg" alt="" srcset="">
          <div class="f-24 c-f">清空</div>
        </div>
      </div>
      <!-- 内容提示区域 -->
      <div class="flex-full center-flex-v content-tip-wrapper p-l30 f-28 c-f">
        已选择
        <div class="c-f0">{{currentTab === 1 ? selectedftChampion.length : selectedftChampionSec.length}}</div>
        {{ currentTab === 1 ? '支' :  '组'}}球队
      </div>
      <!-- 确定 -->
      <div class="ok-wrapper f-32 c-f center-flex full-height" @click="toBetting">
        确&ensp;定
      </div>
    </div>
    <!-- 无实际意义促使加载选中的图片，避免发生闪烁 -->
    <div :class="{'content-item-active': loadBgImg}"></div>
  </div>
</template>

<script>
import ChampionList from 'quiz/components/worldCup/list/champion-list.vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Dialog, Toast } from 'mand-mobile'
import { openOwnerH5 } from '@/utils/open-web.js'
import { setShare } from '@/services/native.js'
export default {
  name: 'WorldCupList',
  components: {
    //  猜冠军列表
    ChampionList,
    //  猜冠亚军列表
    RunnerUpList: () => import('quiz/components/worldCup/list/runnerup-list.vue')
  },
  data () {
    return {
      //  当前tab
      currentTab: 1,
      //  预加载选中图片
      loadBgImg: false
    }
  },
  created () {
    this.setShare()
  },
  activated () {
    this.setShare()
  },
  mounted () {
    this.$trace('jczqcgj_homepage')
    let timer = setTimeout(() => {
      this.loadBgImg = true
      clearTimeout(timer)
    }, 1500)
    let timer1 = setTimeout(() => {
      this.getLotterySetting()
      clearTimeout(timer1)
    }, 500)
  },
  computed: {
    // 已选中的猜冠军数据，已选中的猜冠亚军的数据
    ...mapGetters('WorldCupBetting', ['selectedftChampion', 'selectedftChampionSec'])
  },
  methods: {
    //  清空猜冠军数据，清空猜冠亚军数据
    ...mapMutations('WorldCupBetting', ['clearFtChampionSelect', 'clearFtChampionSecSelect']),
    //  获取系统参数
    ...mapActions(['getLotterySetting']),
    setShare () {
      //  设置分享
      setShare(window.location.href, '真球迷假球迷一猜便知', '免费参与Nike /adidas大牌潮品等你来拿！', 'https://shadow.yingheying.com/crayfish/d734da1d079b7ca700c032f0e31dcd56.jpg')
    },
    //  清空
    clears () {
      let datas = this.currentTab === 1 ? this.selectedftChampion : this.selectedftChampionSec
      let method = this.currentTab === 1 ? this.clearFtChampionSelect : this.clearFtChampionSecSelect
      if (datas && datas.length > 0) {
        let instance = Dialog.confirm({
          title: '温馨提示',
          content: '是否要清空选择的球队？',
          confirmText: '确定',
          'prevent-scroll': true,
          onConfirm: method
        })
        //  存放实例，以便在切换路由的时候销毁
        window.mdDialogInstances && window.mdDialogInstances.push && window.mdDialogInstances.push(instance)
      }
    },
    //  点击切换tab
    changeTab (tab) {
      if (tab === this.currentTab) return false
      this.currentTab = tab
    },
    //  去投注
    toBetting () {
      let datas = this.currentTab === 1 ? this.selectedftChampion : this.selectedftChampionSec
      if (datas && datas.length > 0) {
        this.$router.push({ path: `/worldcup/betting/${this.currentTab}` })
      } else {
        Toast.failed(`至少选择一${this.currentTab === 1 ? '支' : '组'}球队`)
      }
    },
    //  去主会场
    viewMainMetting () {
      openOwnerH5(3)
    }
  }
}
</script>

<style lang="stylus" scoped>
/* 底部付款按钮容器高度 */
bottom2-height = 102px
/* 顶部header高度 */
header-height = 172px
.tab-wrapper
  padding-bottom 22px
.header-box
  background-image url('../../../assets/worldcup/list/list-header-bg2.jpg')
  background-size 100% 100%
  background-repeat no-repeat
  padding 0 30px
.tab-item-active
  background-image url('../../../assets/worldcup/list/list-tab-active-bg.jpg')
  background-size 100% 100%
  background-repeat no-repeat
.m-r52
  margin-right 52px
.tab-item
  height 72px
  background-color #052245
.content-wrapper
  padding 28px
  padding-bottom bottom2-height + 20
  min-height calc(100vh - 102px - 172px)
  background #052245
.footer-wrapper
  height bottom2-height
  position fixed
  left 0
  right 0
  bottom 0
  background-color #0F407A
  z-index 100
.delete-wrppaer
  width 106px
  line-height 1.2
.del-icon
  width 40px
  height 40px
  font-size 0
.p-l30
  padding-left 30px
.ok-wrapper
  width 240px
  background-color #3CAFFB
.transition-item
  transition opacity .2s linear
.content-item-active
  background-image url('../../../assets/worldcup/list/list-item-choosed-bg.jpg')
.text-right
  text-align right
.main_met_btn
  width 180px
</style>

<style lang="scss" scoped>
.tab-item:not(.tab-item-active){
  position: relative;
  @include hairline(#FFF);
}
.delete-wrppaer {
  position: relative;
  @include hairline-right(#FFF);
}
</style>
