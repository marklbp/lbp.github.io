<template>
  <div class="page-course">
    <div class="place-imgs">
      <div class="img" v-for="(img, i) in placeImages" :key="i">
        <img :src="img.url">
      </div>
      <div class="num"><span>1</span>/{{placeImages.length}}</div>
    </div>
    <div class="mod name-overview">
      <div class="title">{{courseName}}</div>
      <div class="content"><div class="overview">{{overview}}</div></div>
    </div>
    <div class="mod description">
      <div class="title">课程详情</div>
      <div class="content"><div class="text">{{description}}</div></div>
    </div>
    <div class="mod store">
      <div class="title">适合商铺（{{storeNum}}） <router-link :to="'/shops/' + $route.params.id" class="btn-icon"></router-link></div>
    </div>
    <div class="mod address">
      <div class="title">{{storeName}}</div>
      <div class="content">
        <div class="text">
          <div class="addr" @click="showMap()">
            <i class="icon"></i>
            <div class="first-addr">{{address}}</div>
            <div class="detail-addr">{{distance}}</div>
          </div>
          <span class="phone" @click="showPhoneList()"></span>
        </div>
      </div>
    </div>
    <PhoneCom ref="phoneCom" :phones="phones" @cancelevent="cancelPhoneCall($event)" />
  </div>
</template>
<script>
import {Toast} from 'mand-mobile'
import Utils from '../utils'
import API from '../api'
import PhoneCom from '../components/phones'
Utils.setTitle('课程详情')
export default {
  name: 'course',
  data () {
    return {
      placeImages: [], // 主图
      courseName: '', // 课名
      overview: '', // 简介
      description: '', // 课程详情
      storeNum: 0, // 适合商铺数
      storeName: '', // 店名
      address: '', // 地址
      distance: '', // 距离
      phones: [], // 电话
      lat: '',
      lng: ''
    }
  },
  components: {
    PhoneCom
  },
  created () {
    this.getCourseById()
  },
  methods: {
    getCourseById () {
      API.getCourseById().then(r => {
        // 获取课程详情
        let {content = []} = r
        let [{
          trainingImgList: placeImages,
          courseName,
          courseOverview: overview,
          courseDescription: description,
          merchantCount: storeNum,
          placeTraining: {
            name: storeName,
            address,
            phones,
            distance
          }
        } = {}] = content
        this.placeImages = placeImages // 主图
        this.courseName = courseName // 课名
        this.overview = overview // 简介
        this.description = description // 课程详情
        this.storeNum = storeNum // 适合商铺数
        this.storeName = storeName // 店名
        this.address = address // 地址
        this.distance = distance // 距离
        this.phones = phones // 电话
      })
    },
    showOthersStore () {
      // 查看适合商铺
    },
    showMap () {
      // 查看地图
      Utils.showMap({
        'lat': this.lat.toString(),
        'lng': this.lng.toString(),
        'title': this.title,
        'address': this.address
      }, null, e => Toast.failed('地图功能不可用'))
    },
    showPhoneList () {
      if (this.phones.length > 0) {
        this.$refs.phoneCom.showPage = !this.$refs.phoneCom.showPage
        this.hidden = true
      } else {
        Toast.failed('该场馆暂无联系方式')
      }
    },
    cancelPhoneCall (e) {
      console.log(e.data)
      this.hidden = false
    }
  }
}
</script>

<style lang="scss">
@import "../common/common";
@import "../common/course";
</style>
