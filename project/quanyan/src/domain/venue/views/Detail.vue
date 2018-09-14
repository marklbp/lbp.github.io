<template lang="html">
    <div class="detail" :class="{'hide':hidden}">
        <div class="place-imgs">
          <div class="img" v-for="(img, i) in placeImages" :key="i">
            <img :src="img.url">
          </div>
          <div class="num"><span>1</span>/{{placeImages.length}}</div>
        </div>
        <div class="venue-information">
          <div class="training-name">
            <div class="name-focus">
              <div class="name">{{detail.placeDetail.name}}</div>
              <div class="focus">
                  <span class="btn-focus" :class="{'focused': collectFlg}" @click="toggleCollect()"></span>
                  <span class="btn-report" @click="correct()"></span>
              </div>
            </div>
            <div class="venue-type">
              {{detail.placeDetail.districtName}} {{detail.placeDetail.categoryName}} {{detail.placeDetail.businessTime ? (openFlag ? '营业中' : '已打烊') : ''}}
            </div>
          </div>
          <div class="business-time" v-if="detail.placeDetail.businessTime">
              <div class="time">
                  <i class="icon"></i>营业时间：
              </div>
              <div class="open-time">
                  <div v-for="(item, index) in detail.placeDetail.businessTime" :key="index">
                      {{item.week}}&nbsp;{{item.time}}
                  </div>
              </div>
          </div>
          <div class="address-phone">
              <div class="address" @click="showMap()">
                  <span class="icon"></span>
                  <span class="text">{{detail.placeDetail.address}}</span>
              </div>
              <div class="phone" @click="phoneShow()"></div>
          </div>
        </div>
        <div class="mod stadium">
          <div class="title">场馆信息</div>
          <div class="content">
              <div class="icon" v-if="detail.placeDetail.isContainBath == 1"><img src="../assets/facilities/xiyu.png"></div>
              <div class="icon" v-if="detail.placeDetail.isContainWifi == 1"><img src="../assets/facilities/wifi.png"></div>
              <div class="icon" v-if="detail.placeDetail.isLockerRoom == 1"><img src="../assets/facilities/gys.png"></div>
              <div class="icon" v-if="detail.placeDetail.isContainWater == 1"><img src="../assets/facilities/reshui.png"></div>
              <div class="icon" v-if="detail.placeDetail.isParkFree == 1"><img src="../assets/facilities/p.png"></div>
              <div class="icon" v-if="detail.placeDetail.isContainAc == 1"><img src="../assets/facilities/kongtiao.png"></div>
              <div class="icon" v-if="detail.placeDetail.isContainStorage == 1"><img src="../assets/facilities/chuwu.png"></div>
              <div class="icon" v-if="detail.placeDetail.isContainHeating == 1"><img src="../assets/facilities/nuanqi.png"></div>
              <div class="icon" v-if="detail.placeDetail.isContainSlippers == 1"><img src="../assets/facilities/tuoxie.png"></div>
          </div>
        </div>
        <div class="courses mod">
          <div class="title">本店课程</div>
          <div class="content">
            <ul class="course-list">
              <li v-for="(c, i) in courses.slice(0,2)" :key="i">
                <router-link :to="'/course/' + c.id">
                  <div class="img">
                    <img :src="c.url">
                  </div>
                  <div class="title">{{c.courseName}}</div>
                  <div>
                    <span class="discount-price">￥{{c.discountPrice}}</span>
                    <span class="price">￥{{c.price}}</span>
                  </div>
                </router-link>
              </li>
              <li v-for="(c, i) in courses.slice(2)" :key="i + 2" v-show="hiddenCourses">
                <router-link :to="'/course/' + c.id">
                  <div class="img">
                    <img :src="c.url">
                  </div>
                  <div class="title">{{c.courseName}}</div>
                  <div>
                    <span class="discount-price">￥{{c.discountPrice}}</span>
                    <span class="price">￥{{c.price}}</span>
                  </div>
                </router-link>
              </li>
              <li v-if="courses.length > 2" class="last" @click="toggleHiddenCoursesFn($event)"><span class="text">查看其他个{{courses.length - 2}}课程</span><i class="btn-icon"></i></li>
            </ul>
          </div>
        </div>
        <div class="coaches mod">
          <div class="title">名师风采</div>
          <div class="content">
            <ul class="coach-list">
              <li v-for="(c, i) in coaches" :key="i">
                <div class="img">
                  <img :src="c.url">
                </div>
                <div class="name">{{c.name}}</div>
                <div class="mark">
                  <span v-for="(m , y) in c.mark" :key="y">{{m}}</span>
                </div>
                <div class="age">{{c.age}}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="store mod">
          <div class="title">其他分店 <router-link class="btn-icon" :to="'/stores/' + $route.params.id"></router-link></div>
        </div>
        <div class="mod near-venue">
            <div class="title">附近培训机构</div>
            <div class="content">
              <div class="list">
                <router-link v-for="(item,index) in nearTrainPlaces" :key="index" :to="{path: `/detail/${item.placeTrainingId}`}" class="link">
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
              </div>
            </div>
        </div>
        <div class="img-moel" v-if="imgFlag">
            <div class="body" v-if="!amplificationFlag">
                <!--<div class="back" @click="init()"></div>-->
                <div class="img-show" v-for="(item, index) in detail.placeDetail.placeImageList" :key="index" @click="amplification(index)">
                    <img :src="item.url">
                </div>
            </div>
            <div class="img-body" v-if="amplificationFlag">
                <swiper :options="swiperOption" v-if="detail.placeDetail.placeImageList.length">
                    <swiper-slide v-for="(item, index) in detail.placeDetail.placeImageList" :key="index">
                        <div class="box" @click="imgHide()">
                            <img :src="item.url"/>
                        </div>
                    </swiper-slide>
                    <!--<div class="swiper-pagination" slot="pagination"></div>-->
                </swiper>
            </div>
        </div>
        <transition name="slide">
          <PhoneCom ref="phoneCom" :phones="detail.placeDetail.phones"  @cancelevent="hidden = false" />
        </transition>
    </div>
</template>
<script>
import { get } from '@/services/request.js'
import {Toast} from 'mand-mobile'
import {getUserId} from '../../../utils/common'
import { login } from '@/services/native.js'
import { IMAGE_ROOT } from '@/constants'
import Utils from '../utils'
import API from '../api'
import PhoneCom from '../components/phones'
Utils.setTitle('培训机构详情')
export default {
  name: 'detail',
  components: {
    PhoneCom
  },
  data () {
    return {
      detail: {
        placeDetail: {
          oneImgUrl: '',
          oneImgName: '',
          placeImageList: [
            {
              url: ''
            }
          ],
          businessTime: [],
          name: '',
          address: '',
          cityName: '',
          districtName: '',
          categoryName: '',
          price: '',
          endHour: '',
          isContainBath: '',
          isContainWifi: '',
          isLockerRoom: '',
          isContainWater: '',
          isParkFree: '',
          isContainAc: '',
          isContainStorage: '',
          isContainHeating: '',
          isContainSlippers: '',
          phones: [],
          lat: null,
          lng: null
        }
      },
      swiperOption: {
        initialSlide: 0,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      placeId: this.$route.params.id,
      orgId: this.$route.params.id,
      tag: false,
      check: '',
      errorBody: '',
      textNo: 0,
      errorFlag: false,
      openFlag: true,
      imgFlag: false,
      amplificationFlag: false,
      hidden: false,
      phoneFlag: false,
      imgNo: 0,
      lat: '',
      lng: '',
      errotFlag: '0',
      placeImages: [],
      courses: [],
      hiddenCourses: false,
      coaches: [],
      nearTrainPlaces: [],
      collectFlg: false // 是否关注
    }
  },
  created () {
    if (location.href.indexOf('localhost') > -1) {
      return this.initPage()
    }
    if (location.search.match(/lat=([^&]+)/)) {
      // url包含经纬度
      let lat = decodeURIComponent(location.search.match(/lat=([^&]+)/)[1])
      let lng = decodeURIComponent(location.search.match(/lng=([^&]+)/)[1])
      this.initPage(lat, lng)
    } else {
      // 通过app授权获取经纬度
      Utils.getClientInfo((sdk, data) => {
        let {lat, lng} = JSON.parse(data)
        this.initPage(lat, lng)
      })
    }
  },
  mounted () {
    this.back('2')
  },
  methods: {
    initPage (lat, lng) {
      this.lat = lat || this.lat // 纬度
      this.lng = lng || this.lng // 经度
      this.getNearTrainPlace()
      this.arrayList()
    },
    toggleHiddenCoursesFn (e) {
      // 显示或隐藏其余课程
      this.hiddenCourses = !this.hiddenCourses
      let btn = e.target
      if (btn.tagName.toLowerCase() !== 'li') btn = btn.parentNode
      btn.classList.toggle('up')
      let span = btn.getElementsByTagName('span')[0]
      let text = span.innerHTML
      span.innerHTML = btn.text ? btn.text : '收起'
      btn.text = text
    },
    toggleCollect () {
      // 收藏 或 取消收藏
      if (this.toggleCollecting) return
      this.toggleCollecting = true
      API.toggleCollect({
        Collect: {
          uid: this.uid,
          placeId: this.$route.params.id,
          status: this.collectFlg ? 2 : 1
        }
      }).then(r => {
        this.collectFlg = !this.collectFlg
        this.toggleCollecting = false
      }).catch(e => {
        this.toggleCollecting = false
      })
    },
    getNearTrainPlace () {
      // 获取附近培训机构
      API.getNearTrainPlace({
        trainingListQuery: {
          lat: this.lat,
          lng: this.lng
        }
      }).then(r => {
        let {content = []} = r
        let [{placeTrainingResults: nearTrainPlaces} = {}] = content
        nearTrainPlaces = nearTrainPlaces instanceof Array ? nearTrainPlaces : []
        nearTrainPlaces.forEach(item => {
          let [course = {}] = item.placeTrainingCourseList || []
          item.mainIconUrl = IMAGE_ROOT + '/' + item.mainIconUrl
          if (parseInt(item.distance) < 1000) {
            item.distanceString = parseInt(item.distance) + 'm'
          } else {
            item.distanceString = (parseInt(item.distance) / 1000).toFixed(1) + 'km'
          }
          // item.rank = 4.3
          item.price = course.price
          item.discountPrice = course.discountPrice
          item.courseName = course.courseName
          item.coursePeriod = course.coursePeriod
        })
        this.nearTrainPlaces = nearTrainPlaces
      })
    },
    showMap () {
      // 查看地图
      Utils.showMap({
        'lat': this.detail.placeDetail.lat.toString(),
        'lng': this.detail.placeDetail.lng.toString(),
        'title': this.detail.placeDetail.name,
        'address': this.detail.placeDetail.cityName + this.detail.placeDetail.districtName + this.detail.placeDetail.address
      }, null, Toast.failed('地图功能不可用'))
    },
    back (index) {
      Utils.back(_ => {
        if (index === '1') {
          this.textNo = 0
          this.errorBody = ''
          this.check = ''
          this.errorFlag = false
          this.errotFlag = '0'
          this.hidden = false
          this.imgFlag = false
          this.amplificationFlag = false
          this.phoneFlag = false
          Utils.setTitle('场馆详情')
          this.back('2')
        } else {
          history.go(-1)
        }
      })
    },
    arrayList () {
      API.getTrainingDetailByOrgId({orgId: this.orgId})
        .then((response) => {
          console.log(response)
          let {content = []} = response
          let [{
            // collectFlg,
            placeNearResults = [],
            place: placeDetail,
            placeImageList = [],
            placeCategoryList = [],
            placeTrainingCourse: courses,
            coaches = []
          } = {}] = content
          placeNearResults.map((item) => {
            item.mainIconUrl = IMAGE_ROOT + '/' + item.mainIconUrl
            if (parseInt(item.distance) < 1000) {
              item.distanceString = item.distance.toString() + 'm'
            } else {
              item.distanceString = (parseInt(item.distance) / 1000).toString() + 'km'
            }
          })
          placeImageList.map((item) => {
            if (item.url.indexOf('http') === -1) {
              item.url = IMAGE_ROOT + '/' + item.url
            }
          })
          this.detail.placeDetail = placeDetail
          this.detail.placeDetail.placeImageList = placeImageList
          this.collectFlg = true
          // 主图
          this.placeImages = placeImageList
          this.$nextTick(_ => {
            // dd
          })
          // 类型
          this.detail.placeDetail.categoryName = placeCategoryList[0].categoryName
          // 本店课程
          this.courses = courses.map(c => {
            c.url = c.courseImg instanceof Array && c.courseImg[0]
            c.id = c.trainingCourseId
            return c
          })
          // 名师风采
          this.coaches = coaches.map(c => {
            c.url = c.url || c.headUrl
            c.name = c.name || c.coachName
            c.mark = c.mark || c.skill.split(',')
            c.age = c.age || c.coachAge
            return c
          })
          if (placeImageList.length && placeImageList.length < 3) {
            this.detail.oneImgUrl = this.detail.placeDetail.placeImageList[0].url
            this.detail.oneImgName = this.detail.placeDetail.placeImageList[0].title
          }
          this.imgNo = this.detail.placeDetail.placeImageList.length
          this.placeId = this.detail.placeDetail.placeId
          this.orgId = this.detail.placeDetail.orgId
          this.tag = this.detail.placeDetail.collectFlg
          var curTime = new Date()
          var hours = curTime.getHours()
          var minute = curTime.getMinutes()
          var myddy = curTime.getDay() // 获取存储当前日期
          var weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
          var day = weekday[myddy]
          this.detail.placeDetail.businessTime && this.detail.placeDetail.businessTime.forEach(item => {
            if (item.week.indexOf(day) > -1) {
              var time = item.time.split(',')
              if (!this.detail.placeDetail.endHour) {
                time.forEach(value => {
                  if (!this.detail.placeDetail.endHour) {
                    var startHour = parseInt(value.substring(0, 2))
                    var startMinute = parseInt(value.substring(3, 5))
                    var endHour = parseInt(value.substring(6, 8))
                    var endMinute = parseInt(value.substring(9, item.length))
                    if (hours > startHour && hours < endHour) {
                      this.openFlag = true
                      this.detail.placeDetail.endHour = this.changHour(endHour.toString()) + ':' + this.changHour(endMinute.toString())
                    } else if (hours === startHour) {
                      if (minute >= startMinute) {
                        this.openFlag = true
                        this.detail.placeDetail.endHour = this.changHour(endHour.toString()) + ':' + this.changHour(endMinute.toString())
                      } else {
                        this.openFlag = false
                      }
                    } else if (hours === endHour) {
                      if (minute <= endMinute) {
                        this.openFlag = true
                        this.detail.placeDetail.endHour = this.changHour(endHour.toString()) + ':' + this.changHour(endMinute.toString())
                      } else {
                        this.openFlag = false
                      }
                    } else {
                      this.openFlag = false
                    }
                  }
                })
              }
            }
          })
          /*
          setShare(window.location.href + this.placeId + '?lat=' + this.lat + '&lng' + this.lng,
            this.detail.placeDetail.name,
            this.detail.placeDetail.address, '') */
        })
    },
    changHour (index) {
      if (index.length === 1) {
        return '0' + index
      } else {
        return index
      }
    },
    correct () {
      // 纠错
      if (getUserId()) {
        this.errorFlag = true
        this.hidden = true
      } else {
        login()
      }
    },
    phoneShow () {
      // 显示拨号列表
      if (this.detail.placeDetail.phones.length > 0) {
        this.$refs.phoneCom.showPage = !this.$refs.phoneCom.showPage
        this.hidden = true
      } else {
        Toast.failed('该场馆暂无联系方式')
      }
    },
    calculateNo () {
      this.textNo = this.errorBody.length
    },
    init () {
      this.textNo = 0
      this.errorBody = ''
      this.check = ''
      this.errorFlag = false
      this.errotFlag = '0'
      this.hidden = false
      this.imgFlag = false
      this.amplificationFlag = false
      this.phoneFlag = false
    },
    show (event) {
      event.cancelBubble = true
    },
    errorSubmit () {
      if (this.errotFlag === '0') {
        this.errotFlag = '1'
        var errorType = parseInt(this.check)
        console.log(errorType)
        if (!errorType && errorType !== 0) {
          Toast.failed('请选择纠错原因')
          this.errotFlag = '0'
          return false
        }
        var error = get('outplace.addPlaceErrorRecovery', {
          PlaceErrorRecoveryRequest: {
            'placeId': this.placeId,
            'uid': getUserId(),
            'errorType': errorType,
            'description': this.errorBody
          }
        })
        error.then(response => {
          if (response.content[0].value) {
            Toast.succeed('纠错成功')
            this.init()
          } else {
            this.errotFlag = '0'
          }
        })
      }
    },
    imgMore (name) {
      Utils.setTitle(name)
      this.back('1')
      this.imgFlag = true
      this.hidden = true
    },
    amplification (index) {
      this.swiperOption.initialSlide = index
      this.amplificationFlag = true
    },
    imgHide () {
      this.amplificationFlag = false
    }
  }
}
</script>

<style lang="scss">
@import "../common/common";
@import "../common/detail";
</style>
