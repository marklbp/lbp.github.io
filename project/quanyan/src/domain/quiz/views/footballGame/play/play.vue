<template>
  <div class="bg-gray">
    <!-- 筛选和帮助 -->
    <div class="center-flex-v help-header-box bg-f f-30 c-31 index-101">
      <div class="flex-full games full-height center-flex-v">混合过关</div>
      <div class="header-item full-height center-flex-v" @click="viewFilter">筛选</div>
      <div class="pd-r24 header-item full-height center-flex-v">
        <div class="relative-view full-height center-flex-v" @click="viewHelp">
          帮助
          <popup-help v-model="showHelp"></popup-help>
        </div>
      </div>
    </div>
    <!-- 筛选弹窗 -->
    <popup-filter class="index-101" @filterMatch="filterMatch" @hidePopup="hidePopup" v-model="showFilter" :filterMatchNames="filterMatchNames" :matchNames="matchNames" :matchs="matchs"></popup-filter>
    <!-- 赛事 -->
    <div class="content-wrapper" v-if="filtedMatchs && filtedMatchs.length > 0">
      <template v-for="(item, index) in filtedMatchs">
        <mixed-clearance-game @changeOpenContent="changeOpenContent" class="m-t24" :key="index" :item="formateItem(item)" v-if="item.ftMatchItemList && item.ftMatchItemList.length > 0"></mixed-clearance-game>
      </template>
    </div>
    <!-- 没有赛事 -->
    <div class="center-nodata-tip center-flex f-28 c-86" v-if="ajaxLoaded && filtedMatchs.length < 1">
      亲，暂无可投注赛事
    </div>
    <!-- 底部内容区域 -->
    <div class="footer-wrapper center-flex-v">
      <!-- 删除区域 -->
      <div class="delete-wrppaer center-flex" @click="clears">
        <div class="text-center">
          <img class="del-icon" src="@/domain/quiz/assets/delete.svg" alt="" srcset="">
          <div class="f-24 c-ad">清空</div>
        </div>
      </div>
      <!-- 内容提示区域 -->
      <div class="flex-full center-flex-v content-tip-wrapper p-l30">
        <div>
          <div class="flex f-30 c-31">已选择<div class="c-bright">{{selectedMatchs.length}}</div>场</div>
          <div class="tip f-24 c-86">请至少选择两场比赛</div>
        </div>
      </div>
      <!-- 确定 -->
      <div class="ok-wrapper f-32 c-f center-flex full-height linear-bg" @click="toBetting">
        确&ensp;定
      </div>
    </div>
  </div>
</template>

<script>
import { RaceGames } from 'quiz/tools/contants/index.js'
import MixedClearanceGame from 'quiz/components/footballlGame/mixed-clearance-game.vue'
import { get } from '@/services/request.js'
import { getWeek, showTip } from 'quiz/tools/utils/index.js'
import { Dialog } from 'mand-mobile'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { setShare } from '@/services/native.js'
export default {
  name: 'Play',
  components: {
    //  混合过关
    MixedClearanceGame,
    [Dialog.name]: Dialog,
    //  帮助
    PopupHelp: () => import('quiz/components/footballlGame/play/popup-help.vue'),
    //  筛选
    PopupFilter: () => import('quiz/components/footballlGame/play/popup-filter.vue')
  },
  data () {
    return {
      RaceGames,
      //  是否显示帮助
      showHelp: false,
      //  是否显示筛选
      showFilter: false,
      //  赛事整理成同级
      matchs: [],
      //  赛事类型matchName
      matchNames: [],
      //  筛选的赛事类型
      filterMatchNames: [],
      //  接口是否请求完成
      ajaxLoaded: false
    }
  },
  computed: {
    ...mapState('FBBetting', {
      //  赛事列表
      ftMatchSummaryItemList: state => state.ftMatchSummaryItemList
    }),
    //  已经选中的赛事
    ...mapGetters('FBBetting', ['selectedMatchs']),
    //  过滤过后的赛事数据
    filtedMatchs () {
      return this.ftMatchSummaryItemList.map(item => {
        let arr = []
        let currentItem = {...item}
        item.ftMatchItemList.forEach(content => {
          let { matchName } = content
          if (this.filterMatchNames.includes(matchName) && !content._is_over) arr.push(content)
        })
        currentItem.ftMatchItemList = arr
        return currentItem
      })
    }
  },
  created () {
    //  获取赛事列表数据
    this.getFtMatchInfoList()
    //  获取系统参数
    let timer = setTimeout(() => {
      this.getLotterySetting()
      clearTimeout(timer)
    }, 500)
    //  设置分享
    this.setShare()
    this.$trace('jczqhhgg_homepage')
  },
  activated () {
    //  设置分享
    this.setShare()
  },
  //  离开的时候还原数据
  beforeRouteLeave (...args) {
    this.showHelp = false
    this.showFilter = false
    let next = args[2] || function () {}
    next()
  },
  methods: {
    //  修改整个赛事列表数据
    //  清空所有选中赛事
    ...mapMutations('FBBetting', ['setftMatchSummaryInfoList', 'clearSelectedMatch', 'setFt_model']),
    //  获取系统参数
    ...mapActions(['getLotterySetting']),
    //  查看帮助
    viewHelp () {
      this.$trace('jczqhhgg_help')
      this.showFilter = false
      this.showHelp = !this.showHelp
    },
    //  查看筛选
    viewFilter () {
      this.$trace('jczqhhgg_shaixuan')
      this.showHelp = false
      this.showFilter = !this.showFilter
    },
    hidePopup () {
      this.showFilter = false
    },
    //  点击确定去投注
    toBetting () {
      //  至少选中两场赛事
      if (this.selectedMatchs.length < 2) {
        showTip('请至少选择两场赛事')
        return false
      } else if (this.selectedMatchs.length > 8) {
        showTip('最多可以选择八场赛事')
        return false
      }
      this.$router.push({ path: '/footballgame/betting' })
    },
    //  获取赛事列表
    getFtMatchInfoList () {
      let traceId = Math.random().toString(16).slice(2)
      get('lotterycenter.getFtMatchInfoList', { matchQuery: { traceId, matchType: 1 } })
        .then(res => {
          this.ajaxLoaded = true
          console.info(JSON.stringify(res))
          let { content = [] } = res || {}
          let [ { ftMatchSummaryItemList = [] } = {} ] = content
          this.setFt_model((content && content.length > 0 && content[0]) || {})
          console.info('赛事列表========================》', JSON.stringify(ftMatchSummaryItemList))
          //  赛事类型
          let matchNames = []
          //  所有的比赛(同级)
          let matchs = []
          let list = ftMatchSummaryItemList.map(item => {
            //  同一天的赛事是否展开
            item._open = true
            //  同一天的赛事给一个标识符
            item._autoId = Math.random().toString(16).slice(2)
            item.ftMatchItemList.forEach(content => {
              matchs.push(content)
              let { matchName = '' } = content
              //  格式化数据标注是否选中
              //  主胜
              content._victory_selected = false
              //  平
              content._flat_selected = false
              //  负
              content._defeat_selected = false
              //  让主胜
              content._givevictory_selected = false
              //  让平
              content._giveflat_selected = false
              //  让负
              content._givedefeat_selected = false
              //  是否已结束
              content._is_over = false
              //  同一场赛事给一个标识符
              content._autoId = Math.random().toString(16).slice(2)
              if (matchName !== '' && !matchNames.includes(matchName)) matchNames.push(matchName)
            })
            return item
          })
          this.setftMatchSummaryInfoList(list)
          this.matchs = matchs
          this.matchNames = matchNames
          //  默认筛选的赛事类型过滤条件是所有的赛事
          this.filterMatchNames = matchNames
        })
        .catch(() => {
          this.ajaxLoaded = true
        })
    },
    //  格式化赛事数据
    formateItem (item = {}) {
      let model = {
        _week: getWeek(new Date(item.matchDate)),
        _time: new Date(item.matchDate)._Format('yyyy-MM-dd')
      }
      return {
        ...item,
        ...model
      }
    },
    //  捕捉子组件提交的改变赛事列表展开收起
    changeOpenContent (_autoId) {
      this.ftMatchSummaryItemList.forEach(item => {
        if (item._autoId === _autoId && _autoId && _autoId !== '') item._open = !item._open
      })
    },
    //  捕捉子组件提交的过滤赛事条件
    filterMatch (filters) {
      this.filterMatchNames = filters
      this.showFilter = false
    },
    //  清空选中的赛事
    clears () {
      if (this.selectedMatchs && this.selectedMatchs.length > 0) {
        let instance = Dialog.confirm({
          title: '温馨提示',
          content: '是否要清空选择的赛事？',
          confirmText: '确定',
          'prevent-scroll': true,
          onConfirm: this.clearSelectedMatch
        })
        //  存放实例，以便在切换路由的时候销毁
        window.mdDialogInstances && window.mdDialogInstances.push && window.mdDialogInstances.push(instance)
      }
    },
    setShare () {
      //  设置分享
      setShare(window.location.href, '真球迷假球迷一猜便知', '免费参与Nike /adidas大牌潮品等你来拿！', 'https://shadow.yingheying.com/crayfish/d734da1d079b7ca700c032f0e31dcd56.jpg')
    }
  }
}
</script>

<style lang="stylus" scoped>
/* 顶部高度 */
top-height = 92px
/* 底部高度 */
bottom-height = 100px
.center-nodata-tip
  position fixed
  left 0
  right 0
  top top-height
  bottom bottom-height
.help-header-box
  height top-height
  position fixed
  left 0
  top 0
  right 0
  z-index 100
.header-item
  padding 0 13px
.pd-r24
  padding-right 24px
.games
  padding 0 40px
.full-height
  height 100%
.m-t24
  margin-top 24px
.content-wrapper
  padding top-height 0 bottom-height + 20
.footer-wrapper
  height bottom-height
  position fixed
  left 0
  right 0
  bottom 0
  background-color #FFF
  z-index 100
.delete-wrppaer
  width 106px
  line-height 1.2
.del-icon
  width 40px
  height 40px
  font-size 0
.c-bright
  color #F66637
.p-l30
  padding-left 30px
.ok-wrapper
  width 240px
.index-101
  z-index 101
</style>

<style lang="scss" scoped>
.delete-wrppaer {
  position: relative;
  @include hairline-right(#D7D7D7);
}
</style>
