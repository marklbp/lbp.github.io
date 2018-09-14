<template lang="html">
  <div class="home" :class="{'hide':hidden}">
      <search :searchContent="searchContent" :catchData="catchData" :paramCategoryId="categoryId" :hide="hide"></search>
      <div v-infinite-scroll="loadMore" class="list" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
          <div class="list-box" v-for="(item,index) in list" :key="index">
              <router-link :to="{path: `/detail/${item.placeId}`}" class="link">
                  <div class="collect" v-if="item.collectFlg"></div>
                  <div class="img"><img :src="item.mainIconUrl"></div>
                  <div class="information">
                      <div class="name">{{item.place.name}}</div>
                      <div v-if="item.price && item.price>0">
                          <div class="type"><span>{{item.districtName}} {{item.categoryName}}</span><span>{{item.distanceString}}</span></div>
                          <div class="price"><span>￥{{item.price}}</span>起</div>
                      </div>
                      <div v-else>
                          <div class="space"></div>
                          <div class="type"><span>{{item.districtName}} {{item.categoryName}}</span><span>{{item.distanceString}}</span></div>
                      </div>
                  </div>
              </router-link>
          </div>
          <div v-if="moreFlag" class="no-more">加载更多...</div>
          <div v-if="allLoaded" class="no-more">我也是有底线的~</div>
          <div class="no-data" v-if="nullFlag">
              <span>暂无数据</span>
          </div>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { get, post } from '@/services/request.js'
import Search from '../components/Search.vue'
import {getUserId} from '../../../utils/common'
import infiniteScroll from 'vue-infinite-scroll'
import { IMAGE_ROOT } from '@/constants'
import {closeWebview} from '../../../services/native'
Vue.use(infiniteScroll)
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
      cityCode: '',
      districtCode: '',
      lat: '',
      lng: '',
      pageNo: 1,
      pageSize: 10,
      categoryId: '',
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
    this.title('场馆列表')
    this.uid = getUserId()
    if (this.$route.params.categoryId === '0') {
      this.categoryId = -1
    } else {
      this.categoryId = this.$route.params.categoryId
    }
    this.cityCode = this.$route.params.cityCode
    this.back()
    this.searchList()
    this.jsBirdge()
    this.arrayList()
  },
  methods: {
    title (title) {
      window.yhyBridge.ready().then(sdk => {
        sdk.callHandler('setNativeTitle', {
          title: title
        }).then(data => {

        }).catch(err => {
          console.log(err)
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    searchList () {
      var searchList = post('outplace.DistinctCategoryListResult', {
        'cityCode': this.cityCode
      })
      searchList.then((response) => {
        response.content[0].districtList[0].name = '全部市区'
        response.content[0].categoryList.map((item) => {
          item.categoryId = item.categoryId.toString()
        })
        this.searchContent = {
          districtList: response.content[0].districtList,
          categoryList: response.content[0].categoryList
        }
      })
    },
    jsBirdge () {
      window.yhyBridge.ready().then(sdk => {
        sdk.callHandler('getClientInfo').then(data => {
          var request = JSON.parse(data)
          this.lat = request.lat // 纬度
          this.lng = request.lng // 经度
          this.arrayList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    back () {
      window.yhyBridge.ready().then(back => {
        back.register('common.h5goBack', (data, callback) => {
          closeWebview()
        })
        back.callHandler('hookBack', {
          eventName: 'common.h5goBack'
        }).then(data => {
          // success
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    arrayList (item) {
      var a = get('outplace.searchPlace', {
        'placeListQuery': {
          'cityCode': this.cityCode,
          'uid': this.uid,
          'districtCode': this.districtCode || -1,
          'categoryId': this.categoryId || -1,
          'key': this.searchName,
          'name': this.searchName,
          // 'currentLat': this.lat,
          // 'currentLng': this.lng,
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'sortType': this.sortType,
          'isSign': '1',
          'isShelves': '1'
        }
      })
      a.then((response) => {
        response.content[0].placeResults.map((item) => {
          item.mainIconUrl = IMAGE_ROOT + '/' + item.mainIconUrl
          if (parseInt(item.distance) < 1000) {
            item.distanceString = item.distance.toString() + 'm'
          } else {
            item.distanceString = (parseInt(item.distance) / 1000).toString() + 'km'
          }
        })
        if (item === '2') {
          if (response.content[0].placeResults.length < 10) {
            setTimeout(() => {
              this.allLoaded = true
              this.moreFlag = false
              this.loading = true
            }, 1000)
          } else {
            this.list = this.list.concat(response.content[0].placeResults)
            this.loading = false
          }
        } else {
          this.hidden = false
          if (response.content[0].placeResults.length === 0) {
            this.allLoaded = false
            this.moreFlag = false
            this.loading = true
            this.nullFlag = true
          } else if (response.content[0].placeResults.length < 10 && response.content[0].placeResults.length > 0) {
            this.moreFlag = false
            this.loading = true
            this.allLoaded = false
            this.nullFlag = false
          } else {
            this.moreFlag = false
            this.allLoaded = false
            this.loading = false
            this.nullFlag = false
          }
          this.list = response.content[0].placeResults
        }
      })
    },
    catchData (value, condition) {
      if (condition === 'searchTitle') {
        this.title(value)
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
}
.hide{
    position: fixed;
    overflow: hidden;
}
</style>
