/* 支付成功倒计时 */
<template>
  <div class="down-wrapper center-flex">
    <div class="mask-box index-1"></div>
    <div class="text-center index-2">
      <div class="relative-view in-block">
        <div class="down-box"></div>
        <div class="down-content f-40 c-f0 center-flex">{{time}}</div>
      </div>
      <div class="text-center f-16 c-f m-t10">正在生成竞猜记录...</div>
    </div>
  </div>
</template>

<script>
import { get } from '@/services/request.js'
import { Dialog } from 'mand-mobile'
export default {
  name: 'LoadingCountdown',
  components: {
    [Dialog.name]: Dialog
  },
  props: {
    //  开始时间
    start: {
      type: Number,
      default: 5
    },
    //  订单编码
    orderId: {
      require: true
    }
  },
  data () {
    return {
      time: this.start || 5,
      isOver: false,
      timer: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.timer = setInterval(() => {
        this.time -= 1
        //  调用接口
        this.time === 3 && this.getUserBuyRecordIdByOrderId()
        if (this.time <= 0) {
          this.timer && clearInterval(this.timer)
          if (this.isOver) return false
          this.isOver = true
          this.errors()
        }
      }, 1000)
    })
  },
  methods: {
    //  获取竞猜记录id
    getUserBuyRecordIdByOrderId () {
      get('lotterycenter.getUserBuyRecordIdByOrderId', { orderId: this.orderId })
        .then(res => {
          //  倒计时执行完毕
          if (this.isOver) return false
          let { content = [] } = res
          let { value = 0 } = (content && content.length > 0 && content[0]) || {}
          this.isOver = true
          this.timer && clearInterval(this.timer)
          if (`${value}` === '0') {
            this.errors()
          } else {
            //  跳转到竞猜详情
            let path = `/footballgame/order/detail/${value}`
            this.$router.replace({ path })
          }
        })
        .catch(e => {
          console.error(e)
          this.isOver = true
          this.timer && clearInterval(this.timer)
          this.errors()
        })
    },
    //  生成竞猜记录失败
    errors () {
      let instance = Dialog.alert({
        content: '去竞猜管理查看记录',
        cancelText: '取消',
        confirmText: '去查看',
        onConfirm: this.viewLotManager
      })
      //  存放实例，以便在切换路由的时候销毁
      window.mdDialogInstances && window.mdDialogInstances.push && window.mdDialogInstances.push(instance)
    },
    //  去竞猜管理
    viewLotManager () {
      this.$router.replace({ path: '/accout/quizmanager' })
    }
  }
}
</script>

<style lang="stylus" scoped>
.down-box
  width 100px
  height 100px
  border 5px solid #DDD
  border-left 5px solid #f04a1e
  border-radius 999px
  animation rotateLoading 1s linear infinite
.in-block
  display inline-block
.down-content
  position absolute
  left 0
  right 0
  top 0
  bottom 0
.down-wrapper
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 999
.m-t10
  margin-top 10px
.mask-box
  position fixed
  left 0
  right 0
  bottom 0
  top 0
  background-color rgba(0, 0, 0, .7)
.index-1
  z-index 1
.index-2
  z-index 2
</style>
