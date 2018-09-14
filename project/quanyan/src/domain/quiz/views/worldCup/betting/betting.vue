/* 猜冠亚军投注 */
<template>
  <div>
    <!-- 头部 -->
    <betting-header @clears="clears" class="index-101" title="球队"></betting-header>
     <!-- 比赛投注 -->
    <div class="content" v-if="selectedMatchs && selectedMatchs.length > 0">
      <div class="betting-game-box bg-f relative-view">
        <template v-for="(item, index) in selectedMatchs">
          <betting-champion :key="index" :content="item" :type="type"></betting-champion>
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
      亲，无投注球队，请添加投注球队
    </div>
     <!-- 底部 -->
    <betting-footer @pay="pay" ref="bettingFooter" class="index-101" :mutiples="multiple" @setMutiple="setMutiple">
      <!-- footer-top-left 50% -->
      <div class="center-flex-v f-24 c-31" slot="footer-top-left">
        {{calCount || 0}}注{{multiple || 1}}倍&ensp;共{{shouldPayScore}}积分
      </div>
      <!-- footer-bot-left -->
       <template slot="footer-bot-left">
        <div class="f-22 c-86">
          理论奖金
        </div>
        <div class="center-flex-v f-24 c-86">
          <div class="c-f0">{{minScore === maxScore ? maxScore : `${minScore}~${maxScore}`}}</div>
          <div>积分</div>
        </div>
      </template>
    </betting-footer>
     <!-- 无实际意义，促进监听数据变化 -->
    <div v-if="shouldGetFtCalSelectCount"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Dialog, Toast } from 'mand-mobile'
import BettingHeader from 'quiz/components/common/betting/betting-header.vue'
import BettingFooter from 'quiz/components/common/betting/betting-footer.vue'
import BettingChampion from 'quiz/components/worldCup/betting/betting-champion.vue'
import { get, post } from '@/services/request.js'
import { reload } from 'quiz/tools/utils/index.js'
import { openOwnerH5 } from '@/utils/open-web.js'
import { login } from '@/services/native.js'
import { isLogin } from '@/utils/common.js'
import ServiceAgreement from 'quiz/components/common/service-agreement.vue'
export default {
  name: 'Betting',
  components: {
    //  头部
    BettingHeader,
    //  底部
    BettingFooter,
    //  content
    BettingChampion,
    //  知情同意书
    ServiceAgreement
  },
  props: {
    //  投注类型(1:冠军，2:冠亚军)
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 倍数
      multiple: 1,
      //  最小奖金
      minScore: '0.00',
      //  最大奖金
      maxScore: '0.00',
      //  应该支付积分
      shouldPayScore: 0,
      //  注数
      calCount: 0,
      //  用户协议知情同意书
      isAgreeService: true,
      //  是否正在下单
      isAjaxIng: false
    }
  },
  computed: {
    //  商品信息
    ...mapState('WorldCupBetting', ['ftChampion_model', 'ftChampionSec_model']),
    //  已选中的数据
    ...mapGetters('WorldCupBetting', ['selectedftChampion', 'selectedftChampionSec']),
    //  系统参数
    ...mapState(['LotterySetting']),
    //  合并数据
    selectedMatchs () {
      return this.type === '1' ? this.selectedftChampion : (this.type === '2' ? this.selectedftChampionSec : [])
    },
    //  监听数据变化，促使计算注数
    shouldGetFtCalSelectCount: (function () {
      let preType = ''
      let preChampionIds = ''
      return function () {
        let ids = []
        let datas = this.type === '1' ? this.selectedftChampion : this.selectedftChampionSec
        datas.forEach(item => {
          item.matchId && ids.push(item.matchId)
        })
        let championIds = ids.join(',')
        if (championIds === preChampionIds && this.type === preType) {
          return false
        }
        preChampionIds = championIds
        preType = this.type
        this.getFtCalSelectCount()
        return championIds.length > 0
      }
    })()
  },
  mounted () {
    this.$trace('jczqcgjtz_homepage')
  },
  methods: {
    //  清空所有选中的赛事
    ...mapMutations('WorldCupBetting', ['clearFtChampionSelect', 'clearFtChampionSecSelect', 'setFtChampionOver', 'setFtChampionSecOver']),
    //  设置支付验证数据
    ...mapMutations(['_set_verMatchIsOver']),
    //  清空选中的赛事
    clears () {
      if (this.selectedMatchs && this.selectedMatchs.length > 0) {
        let instance = Dialog.confirm({
          title: '温馨提示',
          content: '是否要清空选择的球队？',
          confirmText: '确定',
          'prevent-scroll': true,
          onConfirm: this.type === '1' ? this.clearFtChampionSelect : this.clearFtChampionSecSelect
        })
        //  存放实例，以便在切换路由的时候销毁
        window.mdDialogInstances && window.mdDialogInstances.push && window.mdDialogInstances.push(instance)
      }
    },
    //  接收子组件传递过来的设置倍数
    setMutiple (number) {
      if (number < 1) {
        this.multiple = 1
      } else {
        this.multiple = number
      }
      //  获取赛事注数
      this.getFtCalSelectCount()
    },
    //  获取赛事注数
    getFtCalSelectCount () {
      //  验证数据完整性
      if (!this.verGetFtCalSelectCount()) {
        this.initCalData()
        return false
      }
      let { matchType, multiple, price, championIds } = this.getAjaxParams()
      get('lotterycenter.getFtCalSelectCount', { ftInfo: { matchType, multiple, price, championIds } })
        .then(res => {
          let { content = [] } = res
          let { calCount, shouldPayScore, minScore, maxScore } = (content && content.length > 0 && content[0]) || {}
          this.calCount = calCount
          this.shouldPayScore = shouldPayScore
          this.minScore = minScore
          this.maxScore = maxScore
        })
    },
    //  格式化接口所需参数
    getAjaxParams () {
      let ids = []
      let datas = this.type === '1' ? this.selectedftChampion : this.selectedftChampionSec
      let ftModel = this.type === '1' ? this.ftChampion_model : (this.type === '2' ? this.ftChampionSec_model : {})
      datas.forEach(item => {
        item.matchId && ids.push(item.matchId)
      })
      let championIds = ids.join(',')
      return {
        // 1竞猜足球，2世界杯冠军，3世界杯冠亚军
        matchType: this.type === '1' ? 2 : 3,
        // 所选倍数
        multiple: this.multiple || 1,
        // 每注积分单价
        price: this.type === '1' ? (this.ftChampion_model.price || 1) : (this.ftChampionSec_model.price || 1),
        // 所选世界杯冠亚军，格式 1,2,3
        championIds,
        // 使用积分数量
        usePoint: this.shouldPayScore,
        //  商品编码
        itemId: ftModel.itemId,
        // 卖家id
        sellerId: ftModel.sellerId || 0,
        // 共注数
        selectCount: this.calCount || 1,
        //  比赛场数
        matchCount: championIds.length
      }
    },
    //  验证请求数据
    verGetFtCalSelectCount () {
      //  用户选择的冠亚军数
      let matchCount = this.type === '1' ? this.selectedftChampion.length : (this.type === '2' ? this.selectedftChampionSec.length : 0)
      //  最少两场比赛
      if (matchCount < 1) {
        return false
      }
      //  倍数不能小于1,最大不能超过100000倍
      if (this.multiple < 1 || this.multiple > this.LotterySetting.singleTimeMax) {
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
    showErrorTip (tip) {
      Toast.failed(tip)
    },
    //  支付
    pay () {
      let { matchCount, multiple } = this.getAjaxParams()
      if (matchCount < 1) {
        this.showErrorTip('至少选择一支球队')
        return false
      }
      if (multiple < 1 || multiple > this.LotterySetting.singleTimeMax) {
        this.showErrorTip(`投注倍数不能小于1倍不能大于${this.LotterySetting.singleTimeMax}倍`)
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
      let { matchType, usePoint, itemId, selectCount, matchCount, championIds, price, multiple, sellerId } = this.getAjaxParams()
      console.log(post)
      if (this.isAjaxIng) return false
      this.isAjaxIng = true
      post('trademanager.createBatchOrder', {
        createBatchOrderParam: {
          // 使用积分数量
          usePoint,
          itemParamList: [{
            // 商品id
            itemId,
            // 商品购买数量 (这里给的是注数)
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
              // 如果选择的是 猜测冠亚军 对应的id
              championIds
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
            let matchType = this.type === '1' ? 2 : (this.type === '2' ? 3 : 4)
            let selectedMatchs = this.type === '1' ? this.selectedftChampion : (this.type === '2' ? this.selectedftChampionSec : [])
            let matchIdList = selectedMatchs.map(item => {
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
    //  去赚积分
    toIntegration () {
      openOwnerH5(1)
    },
    //  验证赛事是否已结束
    verMatchIsOver (callback = function () {}) {
      let traceId = Math.random().toString(16).slice(2)
      let matchType = this.type === '1' ? 2 : (this.type === '2' ? 3 : 4)
      let selectedMatchs = this.type === '1' ? this.selectedftChampion : (this.type === '2' ? this.selectedftChampionSec : [])
      let matchIdList = selectedMatchs.map(item => {
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
            Toast.info('球队发生变化，请重新选择球队')
            //  设置某些赛事已结束
            let fun = this.type === '1' ? this.setFtChampionOver : (this.type === '2' ? this.setFtChampionSecOver : function () {})
            fun(overMatchs)
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
.index-101
  z-index 101
.m-l20
  margin-left 20px
.p-l20
  padding-left 20px
.content
  padding top-height 0 bottom1-height + bottom2-height + 50
.un-betting
  position fixed
  left 0
  top top-height
  bottom bottom1-height + bottom2-height
  right 0
.moon-radius
  height 50px
  border-radius 9999px
  background-color #f4f4f4
  transform translateY(50%)
.betting-game-box
  padding 0 box-plr 60px
.moon-wrapper
  position absolute
  left 0
  right 0
  bottom 0
</style>
