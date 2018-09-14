/* 竞猜管理 */
<template>
  <div class="mana-box">
    <div @click="viewPage(item.path)" class="mana-item center-flex-v bg-f" v-for="(item, index) in list" :key="index">
      <img class="manager-icon" :src="item.icon" alt="" srcset="">
      <div class="flex-full">{{item.title}}</div>
      <div class="right-icon c-ad"></div>
    </div>
  </div>
</template>

<script>
import orderRecordIcon from 'quiz/assets/lottery_order_record.svg'
export default {
  name: 'QUIZMANAGER',
  data () {
    return {
      list: [
        {
          title: '竞猜记录',
          icon: orderRecordIcon,
          path: '/footballgame/order/record'
        }
      ]
    }
  },
  methods: {
    viewPage (path) {
      // if (path === '/footballgame/order/record') {
      //   this.$trace('jcjl_homepage')
      // }
      path && this.$router.push({ path })
    }
  }
}
</script>

<style lang="stylus" scoped>
.manager-icon
  width 40px
  height 40px
  margin-right 40px
.mana-item
  height 92px
  padding 0 48px
</style>

<style lang="scss" scoped>
.mana-box {
  .mana-item:not(:last-child) {
    position: relative;
    @include hairline-bottom(#D7D7D7)
  }
}
</style>
