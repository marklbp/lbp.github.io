/* 支付 */
<template>
  <div class="pay-box">
    <loading-countdown v-if="showCountDown" :start="5" :orderId="this.bizOrderId"></loading-countdown>
    <div class="f-28 c-31 bg-f m-t36">
      <div class="pay-header linear-bg"></div>
      <div class="pay-item line-item center-flex-v">
        <div class="flex-full">订单金额</div>
        <div>{{usePoint}}积分</div>
      </div>
      <div class="pay-item center-flex-v">
        <div class="flex-full center-flex-v">
          <div>积分抵扣&ensp;</div>
          <!-- <div class="f-24 c-86">(可用积分500)</div> -->
        </div>
        <div class="c-f0">-{{usePoint}}积分</div>
      </div>
    </div>
    <div class="bot-wrapper center-flex-v">
      <div class="flex-full"></div>
      <div class="pay-wrapper f-32 c-f center-flex full-height linear-bg" :class="{'btn-disable': !btnAble}" @click="pay">
        确定支付
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/services/request.js'
import { isApp } from '@/utils/common.js'
import { Dialog, Toast } from 'mand-mobile'
import LoadingCountdown from 'quiz/components/loading-countdown.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'PAY',
  components: {
    //  倒计时
    LoadingCountdown
  },
  props: {
    //  订单编码
    bizOrderId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      usePoint: 0,
      btnAble: false,
      //  防止重复支付
      paying: false,
      //  是否显示倒计时
      showCountDown: false
    }
  },
  computed: {
    //  验证信息
    ...mapState(['verMatchIsOver'])
  },
  created () {
    this.$trace('jcpay_homepage ')
    //  获取订单信息
    this.queryBizOrderForBuyer()
  },
  methods: {
    //  设置赛事已结束
    ...mapMutations('FBBetting', ['setMatchsOver']),
    ...mapMutations('WorldCupBetting', ['setFtChampionOver', 'setFtChampionSecOver']),
    //  付款
    pay () {
      if (this.btnAble && !this.paying) {
        let { matchIdList = [] } = this.verMatchIsOver || {}
        if (matchIdList.length < 1) {
          Toast.failed('订单校验失败')
          return false
        }
        //  验证数据
        post('lotterycenter.bookValidate', { bookValidate: this.verMatchIsOver })
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
              let instance = Dialog.confirm({
                title: '温馨提示',
                content: '赛事发生变化，是否重新选择赛事',
                confirmText: '确定',
                onConfirm: () => {
                  this.$router.back()
                }
              })
              //  存放实例，以便在切换路由的时候销毁
              window.mdDialogInstances && window.mdDialogInstances.push && window.mdDialogInstances.push(instance)
              //  设置某些赛事已结束
              let matchType = `${this.verMatchIsOver.matchType}`
              let setMatchsOver = matchType === '1' ? this.setMatchsOver : (matchType === '2' ? this.setFtChampionOver : this.setFtChampionSecOver)
              setMatchsOver(overMatchs)
            } else {
              this.toPay()
            }
          })
          .catch(e => {
            console.error(e)
            Toast.failed('订单校验失败')
          })
      }
    },
    //  去支付
    toPay () {
      this.paying = true
      post('trademanager.batchPay', {
        orderPayParam: {
          bizOrderIds: [this.bizOrderId],
          requestPayInfo: {
            payChannel: 'PAY_POINT',
            paySourceType: isApp() ? 'APP' : 'WAP'
          }
        }
      })
        .then(res => {
          let { content = [] } = res
          let { success } = (content && content.length > 0 && content[0]) || {}
          if (success) {
            //  显示倒计时
            this.showCountDown = true
          } else {
            this.paying = false
            Toast.failed('支付失败')
          }
        })
        .catch(e => {
          console.error(e)
          this.paying = false
        })
    },
    //  获取指定订单信息
    queryBizOrderForBuyer () {
      let bizOrderId = this.bizOrderId
      get('trademanager.queryBizOrderForBuyer', { bizOrderId })
        .then(res => {
          console.log(JSON.stringify(res))
          let { content = [] } = res
          let { mainOrder } = (content && content.length > 0 && content[0]) || {}
          this.btnAble = mainOrder && mainOrder.bizOrder
          this.usePoint = (mainOrder && mainOrder.usePoint) || 0
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
/* 底部高度 */
bot-hight = 102px
.bot-wrapper
  position fixed
  bottom 0
  left 0
  right 0
  background-color #FFF
  height bot-hight
.pay-wrapper
  width 240px
.pay-item
  height 102px
  padding 0 32px
.pay-header
  height 8px
  border-top-left-radius 8px
  border-top-right-radius 8px
.m-t36
  margin-top 36px
  border-radius 8px
.pay-box
  padding 0 24px
.btn-disable
  background #DDD
</style>

<style lang="scss" scoped>
.line-item {
  position: relative;
  @include hairline-bottom(#E0E0E0);
}
</style>
