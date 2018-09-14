<template>
  <div class="page-store-list">
    <div class="list">
      <router-link :to="{path: `/detail/${item.placeTrainingId}`}" class="link" v-for="(item,index) in list" :key="index">
        <div class="link-inner">
          <div class="img"><img :src="item.mainIconUrl"></div>
          <div class="information">
          <div class="name">{{item.placeTrainingName}}</div>
            <div v-if="item.rank" class="star" :class="{['star-' + parseInt(item.rank)]: true}">
              <i v-for="(i,r) in 5" :key="r"></i>
              <span>{{item.rank}}分</span>
            </div>
            <div class="type" :class="{'has-rank-margin-top': item.rank ? false : true}">
              <span>{{item.districtName}} {{item.categoryName}}</span>
              <span>
                <strong class='has-collect' v-if="item.collectFlg">常去</strong>{{item.distanceString}}</span>
            </div>
          </div>
        </div>
        <div v-if="item.price !== undefined || item.courseName" class="price">
          <div><div  v-if="item.courseName && item.coursePeriod"><strong>优惠</strong>{{item.courseName}} {{item.coursePeriod}}</div></div>
          <div v-if="item.price !== undefined">
            <span class="zhe kou jia">￥{{item.discountPrice || item.price}}</span>
            <span v-if="item.discountPrice" class='yuan jia'>￥{{item.price}}</span>
          </div>
        </div>
      </router-link>
      <div class="no-more" v-show="moreFlag" ref="moreEle">加载更多...</div>
      <div class="no-more" v-if="allLoaded">我也是有底线的~</div>
      <div class="no-data" v-if="nullFlag">
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>
<script>
import Utils from '../utils'
import API from '../api'
import { IMAGE_ROOT, defaultLocation } from '@/constants'
import * as token2uid from '../token2uid.json'
Utils.setTitle('适合商铺')
export default {
  name: 'store_list',
  data () {
    return {
      list: [],
      lat: defaultLocation.lat,
      lng: defaultLocation.lng,
      pageNo: 1,
      pageSize: 10,
      loading: false,
      allLoaded: false,
      moreFlag: true,
      nullFlag: false
    }
  },
  created () {
    this.getProperShops()
  },
  mounted () {
    window.onscroll = e => {
      let scrollToBottom = this.$refs.moreEle.offsetTop - (document.body.scrollTop || document.documentElement.scrollTop) - (document.body.clientHeight || document.documentElement.clientHeight) <= -20
      if (scrollToBottom && !this.isloading && !this.allLoaded) {
        // 滚动至底部 上次加载完 还有下一页
        this.pageNo += 1
        this.getProperShops(this.resetScroll)
      }
    }
  },
  destroyed () {
    window.onscroll = null
  },
  methods: {
    getProperShops (cb) {
      API.getProperShops({
        ...token2uid,
        trainingCourseId: this.$route.params.id
      }).then(r => {
        let {content = [{}]} = r
        if (!(content instanceof Array)) return
        let [{placeTraingResults = []}] = content
        if (!(placeTraingResults instanceof Array)) return
        placeTraingResults.map((item) => {
          let [course = {}] = item.placeTrainingCourseList || []
          item.mainIconUrl = IMAGE_ROOT + '/' + item.mainIconUrl
          if (parseInt(item.distance) < 1000) {
            item.distanceString = parseInt(item.distance) + 'm'
          } else {
            item.distanceString = (parseInt(item.distance) / 1000).toFixed(1) + 'km'
          }
          item.rank = 4.3
          item.price = course.price
          item.discountPrice = course.discountPrice
          item.courseName = course.courseName
          item.coursePeriod = course.coursePeriod
        })
        this.list = this.list.concat(placeTraingResults)
        typeof cb === 'function' && cb.call(this)
      }).catch(e => {
        this.nullFlag = true
      })
    },
    resetScroll () {
      this.loading = false
      this.allLoaded = (this.pageSize * this.pageNo) <= this.list.length
      this.moreFlag = !this.allLoaded
    }
  }
}
</script>
<style lang="scss">
@import "../common/common";
html,body{
  height: 100%
}
.list{
  margin-top: 0;
  margin-bottom: 0;
}
</style>
