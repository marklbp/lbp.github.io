<template>
  <div class="home" :class="{'hide':hidden}">
      <search :searchContent="searchContent" :catchData="catchData" :paramCategoryId="categoryId" :hide="hide"></search>
      <div v-infinite-scroll="loadMore" class="list" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
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
          <div class="no-more" v-show="moreFlag">加载更多...</div>
          <div class="no-more" v-if="allLoaded">我也是有底线的~</div>
          <div class="no-data" v-if="nullFlag">
              <span>暂无数据</span>
          </div>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Search from '../components/Search.vue'
import {getUserId} from '../../../utils/common'
import infiniteScroll from 'vue-infinite-scroll'
import { IMAGE_ROOT, defaultLocation } from '@/constants'
import {closeWebview} from '../../../services/native'
import Utils from '../utils'
import API from '../api'
import * as token2uid from '../token2uid.json'
Utils.setTitle('培训机构列表')
Vue.use(infiniteScroll)
let scrollToPosCalls = []
let scrollTimer
let cancelScrollTimeFn = _ => {
  clearTimeout(scrollTimer)
  scrollTimer = null
  scrollToPosCalls = []
  localStorage.removeItem('scrollY')
}
let scrollTimerFn = _ => {
  clearTimeout(scrollTimer)
  let cb = scrollToPosCalls.shift()
  if (!cb) return
  let scrollY = typeof cb === 'function' && cb()
  let minusScrollY = Math.abs(scrollY - window.scrollY)
  // console.log('minusScrollY：', minusScrollY)
  if (minusScrollY < 50 || scrollY === null) return cancelScrollTimeFn()
  scrollToPosCalls.push(cb)
  scrollTimer = setTimeout(scrollTimerFn, 0)
}

export default {
  name: 'home',
  data () {
    return {
      list: [],
      pageNumber: 0,
      searchContent: {},
      imgUrl: '/venue/static/img/1.48c0caa.png',
      hidden: false,
      searchName: '',
      uid: '',
      cityCode: 110100,
      districtCode: '',
      lat: defaultLocation.lat,
      lng: defaultLocation.lng,
      pageNo: 1,
      pageSize: 10,
      categoryId: null,
      sortType: '1',
      loading: true,
      allLoaded: false,
      moreFlag: false,
      nullFlag: false,
      loadingFlag: true
    }
  },
  components: {
    search: Search
  },
  mounted () {
    this.uid = getUserId()
    if (this.$route.params.categoryId === '0') {
      this.categoryId = -1
    } else {
      this.categoryId = this.$route.params.categoryId
    }
    this.cityCode = this.$route.params.cityCode || this.cityCode
    Utils.back(closeWebview)
    this.searchList()
    Utils.getClientInfo((sdk, data) => {
      var request = JSON.parse(data)
      this.lat = request.lat || this.lat // 纬度
      this.lng = request.lng || this.lng // 经度
      this.arrayList()
    }, _ => this.arrayList())
    this.arrayList()
  },
  methods: {
    searchList () {
      API.postTranningList({'cityCode': this.cityCode}).then(response => {
        let {content = []} = response
        let [{districtList, categoryList} = {districtList: undefined, categoryList: undefined}] = content
        if (!districtList || !categoryList) return
        districtList[0].name = '全部市区'
        categoryList.map((item) => {
          item.categoryId = item.categoryId.toString()
        })
        this.searchContent = {
          districtList,
          categoryList
        }
      })
    },
    arrayList (item) {
      API.getTranningList({
        ...token2uid,
        'trainingListQuery': {
          // 'uid': this.uid,
          'cityCode': this.cityCode,
          'districtCode': this.districtCode || -1,
          'categoryId': this.categoryId || -1,
          // 'key': this.searchName,
          // 'name': this.searchName,
          // 'currentLat': this.lat,
          // 'currentLng': this.lng,
          'pageSize': this.pageSize,
          'pageNo': this.pageNo,
          'sortType': this.sortType
        }
      }).then((response) => {
        let {content = [{}]} = response
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
        scrollTimerFn()
        if (item === '2') {
          if (placeTraingResults.length < 10) {
            setTimeout(() => {
              this.allLoaded = true
              this.moreFlag = false
              this.loading = true
            }, 1000)
          } else {
            // this.list = this.list.concat(placeTraingResults)
            this.loading = false
          }
        } else {
          this.hidden = false
          if (placeTraingResults.length === 0) {
            this.allLoaded = false
            this.moreFlag = false
            this.loading = true
            this.nullFlag = true
          } else if (placeTraingResults.length < 10 && placeTraingResults.length > 0) {
            this.loading = true
            this.moreFlag = false
            this.allLoaded = false
            this.nullFlag = false
          } else {
            this.moreFlag = false
            this.allLoaded = false
            this.loading = false
            this.nullFlag = false
          }
          this.list = placeTraingResults
        }
      }).catch(cancelScrollTimeFn)
    },
    catchData (value, condition) {
      if (condition === 'searchTitle') {
        Utils.setTitle(value)
      } else {
        if (condition === 'search') {
          this.searchName = value
        } else if (condition === 'screening') {
          this.districtCode = value.cityCode
          this.sortType = value.scopeCode
          this.categoryId = value.typeCode
        }
        this.pageNo = 1
        this.arrayList()
      }
    },
    hide (value) {
      this.hidden = value
    },
    loadMore () {
      if (!this.loading && !this.allLoaded) {
        this.loading = true
        this.moreFlag = true
        this.pageNo = this.pageNo + 1
        this.arrayList('2')
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // 组件进入之前
    scrollToPosCalls.push(_ => {
      let scrollY = localStorage.getItem('scrollY')
      scrollY !== null && window.scrollTo(0, scrollY)
      // console.log('enter:', scrollY)
      return scrollY
    })
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 组件离开前
    let scrollY = window.scrollY
    localStorage.setItem('scrollY', scrollY)
    // localStorage.setItem('pageSize', this.pageNo * this.pageSize)
    // console.log('leave:', scrollY)
    next()
  }
}
</script>

<style lang="scss">
@import "../common/common";
.home{
    background: #f0f0f0;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    .list{
      margin-top: 0;
      padding-top: 167px;
    }
}
.hide{
    position: fixed;
    overflow: hidden;
}
</style>
