<template>
  <div class="page-phone" @click="cancel()" v-show="showPage">
    <div class="body" @click="cancelBubble($event)">
      <div v-for="(p,i) in phones" :key="i" @click="callPhone(p)" class="phone-no" v-if="phones.length>0">
          <span class="phone"></span>
          <span>{{p}}</span>
      </div>
      <div class="cancel" @click="cancel()">取消</div>
    </div>
  </div>
</template>
<script>
import {Toast} from 'mand-mobile'
import Utils from '../utils'
export default {
  name: 'phone',
  data () {
    return {
      showPage: false
    }
  },
  props: ['phones'],
  methods: {
    callPhone (data) {
      Utils.callPhone({data}, null, _ => Toast.failed('拨号功能不可用'))
    },
    cancelBubble (e) {
      typeof e.stopPropagation === 'function' && e.stopPropagation()
      e.cancelBubble = true
    },
    cancel () {
      this.showPage = !this.showPage
      this.$emit('cancelevent', this)
    }
  }
}
</script>
