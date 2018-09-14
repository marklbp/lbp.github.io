/* 投注 */
<template>
  <div class="bg-gray">
    <!-- 头部 -->
    <betting-header @clears="clears" class="index-101"></betting-header>
    <!-- 比赛投注 -->
    <div class="content" v-if="selectedMatchs && selectedMatchs.length > 0">
      <div class="betting-game-box bg-f relative-view">
        <template v-for="(item, index) in selectedMatchs">
          <betting-game :key="index" :content="item"></betting-game>
        </template>
        <!-- 服务协议 -->
        <service-agreement v-model="isAgreeService"></service-agreement>
        <!-- 月牙 -->
        <div class="moon-wrapper flex">
          <div v-for="n in 20" :key="n" class="moon-radius flex-full"></div>
        </div>
      </div>
    </div>
    <!-- 没有投注赛事 -->
    <div class="un-betting center-flex f-28 c-86" v-else>
      亲，无投注赛事，请添加投注赛事
    </div>
    <!-- 选择过关方式 -->
    <popup-pass-fav class="index-102" @chooseMultiple="chooseMultiple" @setShowChoosePassFav="setShowChoosePassFav" @choosedPassFav="choosedPassFav" :showChoosePassFav="showChoosePassFav" :selectedPassFav="selectedPassFav" :multiple="multiple"></popup-pass-fav>
    <!-- 底部 -->
    <betting-footer @pay="pay" ref="bettingFooter" class="index-101" :mutiples="multiple" @setMutiple="setMutiple" @hideChooseMutiple="hideChooseMutiple">
      <!-- footer-top-left 50% -->
      <div class="center-flex-v flex-full" slot="footer-top-left" @click="choosePassFav">
        <div class="flex-full center-flex-v">
          <div class="f-28 c-86">过关方式</div>
          <div class="f-28 c-31">
            <div v-if="selectedPassFav.length < 1">(必选)</div>
            <div v-if="selectedPassFav.length === 1">
              {{selectedPassFav[0]}}
            </div>
            <div v-if="selectedPassFav.length === 2">
              {{selectedPassFav[0]}};{{selectedPassFav[1]}}
            </div>
            <div v-if="selectedPassFav.length > 2">
              {{selectedPassFav[0]}}...{{selectedPassFav[selectedPassFav.length - 1]}}
            </div>
          </div>
        </div>
        <div class="bottom-icon c-86"></div>
      </div>
      <!-- footer-bot-left -->
      <template slot="footer-bot-left">
        <div class="f-24 c-31">{{calCount || 0}}注{{multiple || 1}}倍&ensp;共{{shouldPayScore || 0}}积分</div>
        <div class="f-22 c-86">
          理论奖金&ensp;{{minScore === maxScore ? maxScore : `${minScore}~${maxScore}`}}积分
        </div>
      </template>
    </betting-footer>
    <!-- 无实际意义，促进监听数据变化 -->
    <div v-if="shouldGetFtCalSelectCount"></div>
  </div>
</template>

<script>
import BettingGame from 'quiz/components/footballlGame/betting/betting-game.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Dialog, Toast } from 'mand-mobile'
import { get, post } from '@/services/request.js'
import BettingHeader from 'quiz/components/common/betting/betting-header.vue'
import BettingFooter from 'quiz/components/common/betting/betting-footer.vue'
import { reload } from 'quiz/tools/utils/index.js'
import { openOwnerH5 } from '@/utils/open-web.js'
import { login } from '@/services/native.js'
import { isLogin } from '@/utils/common.js'
import ServiceAgreement from 'quiz/components/common/service-agreement.vue'
export default {
  name: 'Betting',
  components: {
    //  投注比赛
    BettingGame,
    //  投注头部
    BettingHeader,
    //  头部footer
    BettingFooter,
    //  服务协议
    ServiceAgreement,
    //  过关方式
    PopupPassFav: () => import('quiz/components/footballlGame/betting/popup-passfav.vue')
  },
  data () {
    return {
      //  是否显示选择过关方式弹窗
      showChoosePassFav: false,
      // 已选择的过关方式
      selectedPassFav: [],
      //  选择的倍数
      multiple: 1,
      //  是否显示数字键盘
      isKeyBoardShow: false,
      //  注数
      calCount: 0,
      //  应该支付的积分数
      shouldPayScore: 0,
      //  预计奖金的最低积分数
      minScore: '0.00',
      //  预计奖金的最高积分数
      maxScore: '0.00',
      //  用户协议知情同意书
      isAgreeService: true,
      //  是否正在下单
      isAjaxIng: false
    }
  },
  computed: {
    //  已选择的赛事
    ...mapGetters('FBBetting', ['selectedMatchs']),
    //  过关方式
    ...mapState('FBBetting', ['passFav', 'ft_model']),
    //  系统参数
    ...mapState(['LotterySetting']),
    //  监听必要的数据变化来加载数据
    //  监听必要的数据变化来加载数据
    shouldGetFtCalSelectCount: (function () {
      let preselectedMatchs = ''
      let preselectedPassFav = ''
      return function () {
        let selectedMatchs = this.selectedMatchs
        let selectedPassFav = this.selectedPassFav
        if (JSON.stringify(selectedMatchs) === preselectedMatchs && JSON.stringify(selectedPassFav) === preselectedPassFav) {
          return false
        }
        preselectedMatchs = JSON.stringify(selectedMatchs)
        preselectedPassFav = JSON.stringify(selectedPassFav)
        this.getFtCalSelectCount()
        return selectedMatchs && selectedPassFav
      }
    })()
  },
  watch: {
    //  监听所有的过关方式变化
    passFav (val) {
      //  过滤已经选择的过关方式
      this.selectedPassFav.forEach((item, index) => {
        if (!val.includes(item)) {
          this.selectedPassFav.splice(index, 1)
        }
      })
      //  如果没有选择任何过关方式，而且选的赛事场数大于2
      if (this.selectedPassFav.length < 1) {
        let count = this.selectedMatchs.length
        if (count >= 2) this.selectedPassFav = [`${count}串1`]
      }
    }
  },
  created () {
    // 默认进来选中的是最高的串关方式
    this.$trace('jczqhhggtz_homepage')
    this.selectedPassFav = this.passFav.length > 0 ? [this.passFav[this.passFav.length - 1]] : []
  },
  methods: {
    //  清空所有选中的赛事
    ...mapMutations('FBBetting', ['clearSelectedMatch', 'setMatchsOver']),
    //  设置支付验证数据
    ...mapMutations(['_set_verMatchIsOver']),
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
    //  显示选择过关方式
    choosePassFav () {
      this.showChoosePassFav = true
    },
    //  设置是否显示选择过关方式
    setShowChoosePassFav (val) {
      this.showChoosePassFav = val
    },
    //  选择过关方式
    choosedPassFav (passfav = []) {
      this.selectedPassFav = passfav
      this.showChoosePassFav = false
    },
    //  获取赛事注数
    getFtCalSelectCount () {
      //  验证数据完整性
      if (!this.verGetFtCalSelectCount()) {
        this.initCalData()
        return false
      }
      let { matchCount = 0, matchSelectIds = '', selectIds = '', multiple = 1, price = 1 } = this.getAjaxParams()
      get('lotterycenter.getFtCalSelectCount', { ftInfo: { matchType: 1, matchCount, selectCount: 0, matchSelectIds, selectIds, multiple, price } })
        .then(res => {
          let { content = [] } = res
          let { calCount, shouldPayScore, minScore, maxScore } = (content && content.length > 0 && content[0]) || {}
          this.calCount = calCount
          this.shouldPayScore = shouldPayScore
          this.minScore = minScore
          this.maxScore = maxScore
        })
    },
    //  验证请求数据
    verGetFtCalSelectCount () {
      //  用户选择的球赛场数
      let matchCount = (this.selectedMatchs && this.selectedMatchs.length) || 0
      //  最少两场比赛
      if (matchCount < 2) {
        return false
      }
      //  倍数不能小于1,最大不能超过100000倍
      if (this.multiple < 1 || this.multiple > this.LotterySetting.singleTimeMax) {
        return false
      }
      let sectIds = []
      let model = {
        _victory_selected: 1,
        _flat_selected: 2,
        _defeat_selected: 3,
        _givevictory_selected: 4,
        _giveflat_selected: 5,
        _givedefeat_selected: 6
      }
      this.selectedMatchs.forEach(item => {
        let { matchId = '' } = item
        for (let content in model) {
          if (item[content]) sectIds.push(`${matchId}-${model[content]}`)
        }
      })
      let matchSelectIds = sectIds.join(',')
      if (matchSelectIds.length < 2) {
        return false
      }
      let ids = []
      this.selectedPassFav.forEach(passfav => {
        if (passfav && passfav.length > 0 && parseInt(passfav[0]) <= 8 && parseInt(passfav[0]) >= 2) ids.push(parseInt(passfav[0]))
      })
      let selectIds = ids.join(',')
      if (selectIds.length < 1) {
        return false
      }
      return true
    },
    //  初始化注数数据
    initCalData () {
      //  注数
      this.calCount = 0
      //  应该支付的积分数
      this.shouldPayScore = 0
      //  预计奖金的最低积分数
      this.minScore = '0.00'
      //  预计奖金的最高积分数
      this.maxScore = '0.00'
    },
    //  选择投注倍数
    chooseMultiple () {
      this.showChoosePassFav = false
      this.$refs && this.$refs.bettingFooter && this.$refs.bettingFooter.chooseMultiple && this.$refs.bettingFooter.chooseMultiple()
    },
    //  隐藏选择倍数弹窗
    hideChooseMutiple () {
      this.isKeyBoardShow = false
    },
    //  接收子组件传递过来的设置倍数
    setMutiple (number) {
      if (number < 1) {
        this.multiple = 1
      } else {
        this.multiple = number
      }
      this.isKeyBoardShow = false
      //  获取赛事注数
      this.getFtCalSelectCount()
    },
    showErrorTip (tip) {
      Toast.failed(tip)
    },
    //  点击付款创建订单
    pay () {
      let { matchCount, multiple, selectIds } = this.getAjaxParams()
      if (matchCount < 2) {
        this.showErrorTip('至少选择两场比赛')
        return false
      }
      if (multiple < 1 || multiple > this.LotterySetting.singleTimeMax) {
        this.showErrorTip('投注倍数不能小于1倍不能大于10万倍')
        return false
      }
      if (!selectIds || selectIds === '') {
        this.showErrorTip('请选择过关方式')
        return false
      }
      if (!this.isAgreeService) {
        let instance = Dialog.alert({
          title: '警告',
          content: '请阅读并同意用户协议',
          cancelText: '取消',
          confirmText: '知道了'
        })
        //  存放实例，以便在切换路由的时候销毁
        window.mdDialogInstances && window.mdDialogInstances.push && window.mdDialogInstances.push(instance)
        return false
      }
      if (isLogin()) {
        //  验证赛事是否已结束
        this.verMatchIsOver(this.payAjax)
      } else {
        login({
          loginSuccess: () => {
            this.verMatchIsOver(this.payAjax)
          }
        })
      }
    },
    payAjax () {
      // 传递 1竞猜足球，2世界杯冠军，3世界杯冠亚军
      let matchType = 1
      let { matchCount, usePoint, selectCount, multiple, price, matchSelectIds, selectIds, itemId, sellerId } = this.getAjaxParams()
      if (this.isAjaxIng) return false
      this.isAjaxIng = true
      post('trademanager.createBatchOrder', {
        createBatchOrderParam: {
          // 使用积分数量
          usePoint,
          itemParamList: [{
            // 商品id
            itemId,
            // 商品购买数量 (这里给的是注数 * 倍数)
            buyAmount: selectCount * multiple,
            //  商品类型
            itemType: 'LOTTERY',
            // 是否是实体商品
            isEntity: false,
            // 卖家id
            sellerId,
            // 使用积分数量
            usePoint,
            lotteryVO: {
              matchType,
              // 用户选择的球赛场数
              matchCount,
              // 共注数
              selectCount,
              // 所选倍数
              multiple,
              // 单价
              price,
              // 投注信息
              matchSelectIds,
              // 所选玩法
              selectIds
            }
          }]
        }
      }, { loginSuccess: reload, ignoreCode: '6000200' })
        .then(res => {
          this.isAjaxIng = false
          let { content = [], stat: { stateList = [] } = {} } = res
          let { success, mainOrderList } = (content && content.length > 0 && content[0]) || {}
          //  积分不足的情况
          let [ { code = '' } = {} ] = stateList
          if (`${code}` === '6000200') {
            let instance = Dialog.confirm({
              title: '确认',
              content: '积分不足',
              cancelText: '继续投注',
              confirmText: '去赚积分',
              onConfirm: this.toIntegration
            })
            //  存放实例，以便在切换路由的时候销毁
            window.mdDialogInstances && window.mdDialogInstances.push && window.mdDialogInstances.push(instance)
            return false
          }
          if (success) {
            let { bizOrder: { bizOrderId } = {} } = (mainOrderList && mainOrderList.length > 0 && mainOrderList[0]) || {}
            //  设置支付验证数据
            let matchType = 1
            let matchIdList = this.selectedMatchs.map(item => {
              return item.matchId || ''
            })
            this._set_verMatchIsOver({ matchType, matchIdList })
            this.$router.push({ path: `/pay/${bizOrderId}` })
          }
        })
        .catch(() => {
          this.isAjaxIng = false
        })
    },
    //  返回接口所需参数
    getAjaxParams () {
      // 投注信息 (比赛id+选择id(主胜1，平2，客胜3，让球主胜4，让球平5，让球客胜6),如：1001-1,1002-2)
      let model = {
        _victory_selected: 1,
        _flat_selected: 2,
        _defeat_selected: 3,
        _givevictory_selected: 4,
        _giveflat_selected: 5,
        _givedefeat_selected: 6
      }
      let sectIds = []
      this.selectedMatchs.forEach(item => {
        let { matchId = '' } = item
        for (let content in model) {
          if (item[content]) sectIds.push(`${matchId}-${model[content]}`)
        }
      })
      let matchSelectIds = sectIds.join(',')
      // 所选玩法 (下注玩法2串1-8串1，分别传递2-8,如 2,3,4)
      let ids = []
      this.selectedPassFav.forEach(passfav => {
        if (passfav && passfav.length > 0 && parseInt(passfav[0]) <= 8 && parseInt(passfav[0]) >= 2) ids.push(parseInt(passfav[0]))
      })
      let selectIds = ids.join(',')
      return {
        // 传递 1竞猜足球，2世界杯冠军，3世界杯冠亚军
        matchCount: (this.selectedMatchs && this.selectedMatchs.length) || 0,
        // 共注数
        selectCount: this.calCount || 1,
        // 所选倍数
        multiple: this.multiple || 1,
        // 单价
        price: this.ft_model.price || 1,
        // 投注信息 (比赛id+选择id(主胜1，平2，客胜3，让球主胜4，让球平5，让球客胜6),如：1001-1,1002-2)
        matchSelectIds,
        // 所选玩法 (下注玩法2串1-8串1，分别传递2-8,如 2,3,4)
        selectIds,
        //  商品编码
        itemId: this.ft_model.itemId,
        // 卖家id
        sellerId: this.ft_model.sellerId || 0,
        // 使用积分数量
        usePoint: this.shouldPayScore
      }
    },
    //  去赚积分
    toIntegration () {
      openOwnerH5(1)
    },
    //  验证赛事是否已结束
    verMatchIsOver (callback = function () {}) {
      let traceId = Math.random().toString(16).slice(2)
      let matchType = 1
      let matchIdList = this.selectedMatchs.map(item => {
        return item.matchId || ''
      })
      post('lotterycenter.bookValidate', { bookValidate: { traceId, matchType, matchIdList } })
        .then(res => {
          let { content = [] } = res
          let { bookValidateItemList = [] } = (content && content.length > 0 && content[0]) || {}
          //  生成状态模型
          let overMatchsModel = {}
          let overMatchs = []
          bookValidateItemList.forEach(item => {
            let { matchId = '' } = item
            let matchStatus = `${item.matchStatus}`
            if (matchId !== '') {
              overMatchsModel[matchId] = matchStatus
            }
          })
          //  遍历提交的比赛，是否有停售(停售状态的赛事，接口有可能不会返回)
          matchIdList.forEach(item => {
            if (overMatchsModel[item] !== '2') {
              overMatchs.push(item)
            }
          })
          //  订单数据发生变化
          if (overMatchs.length > 0) {
            Toast.info('赛事发生变化，请重新选择赛事')
            //  设置某些赛事已结束
            this.setMatchsOver(overMatchs)
          } else {
            callback()
          }
        })
        .catch(e => {
          console.error(e)
          this.showVerError()
        })
    },
    //  显示校验订单失败
    showVerError () {
      let instance = Dialog.alert({
        title: '失败',
        content: '订单校验失败',
        cancelText: '取消',
        confirmText: '知道了'
      })
      //  存放实例，以便在切换路由的时候销毁
      window.mdDialogInstances && window.mdDialogInstances.push && window.mdDialogInstances.push(instance)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/var.styl';
.box-plr
  padding 0 box-plr
.m-l20
  margin-left 20px
.p-l20
  padding-left 20px
.content
  padding top-height 0 bottom1-height + bottom2-height + 50
.betting-game-box
  padding 0 box-plr 60px
.index-101
  z-index 101
.index-102
  z-index 102
.moon-wrapper
  position absolute
  left 0
  right 0
  bottom 0
.moon-radius
  height 50px
  border-radius 9999px
  background-color #f4f4f4
  transform translateY(50%)
.un-betting
  position fixed
  left 0
  top top-height
  bottom bottom1-height + bottom2-height
  right 0
.bottom-icon
  position relative
  top -5px
</style>

<style lang="scss" scoped>
.fav-box {
  position: relative;
  @include hairline-right(#D7D7D7);
}
</style>
