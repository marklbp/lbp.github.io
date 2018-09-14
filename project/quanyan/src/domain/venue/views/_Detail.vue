<template lang="html">
    <div class="detail" :class="{'hide':hidden}">
        <div class="img-one" v-if="detail.placeDetail.placeImageList.length < 3">
            <img :src="detail.oneImgUrl" @click="imgMore(detail.oneImgName)">
        </div>
        <div class="venue-information">
            <div class="venue-name">
                <div class="name">{{detail.placeDetail.name}}</div>
                <div class="icon">
                    <span :class="{'tag':tag,'untag':!tag}" @click="tagChange()"></span>
                    <span class="error-correction" @click="correct()"></span>
                </div>
            </div>
            <div class="venue-type">{{detail.placeDetail.districtName}} {{detail.placeDetail.categoryName}}<span v-if="detail.placeDetail.price > 0"><span class="price">¥{{detail.placeDetail.price}}</span>起</span></div>
            <div class="img" v-if="detail.placeDetail.placeImageList.length >= 3">
                <span class="img-no"><span class="show-img"></span>{{imgNo}}</span>
                <div v-for="(item, index) in detail.placeDetail.placeImageList" :key="index" @click="imgMore(detail.placeDetail.name)">
                    <img :src="item.url">
                </div>
            </div>
            <div class="" v-if="detail.placeDetail.businessTime">
                <div class="business-hours" v-if="openFlag">
                    <span class="time"></span>
                    <span>营业中，营业至{{detail.placeDetail.endHour}}</span>
                </div>
                <div class="business-hours" v-if="!openFlag">
                    <span class="close-time"></span>
                    <span>已打烊</span>
                </div>
            </div>
            <div class="address-phone">
                <div class="address" @click="showMap()">
                    <span class="address-icon"></span>
                    <span class="address-name">
                        <div class="name">{{detail.placeDetail.address}}</div>
                        <!--<div class="subway">距南京西路地铁站7号口步行490米</div>-->
                    </span>
                </div>
                <div class="phone" @click="phoneShow()"></div>
            </div>
        </div>
        <div class="venue-base">
            <div class="base">
                <div class="base-text">场馆信息</div>
                <div class="base-img">
                    <div v-if="detail.placeDetail.isContainBath == 1"><img src="../assets/facilities/xiyu.png"></div>
                    <div v-if="detail.placeDetail.isContainWifi == 1"><img src="../assets/facilities/wifi.png"></div>
                    <div v-if="detail.placeDetail.isLockerRoom == 1"><img src="../assets/facilities/gys.png"></div>
                    <div v-if="detail.placeDetail.isContainWater == 1"><img src="../assets/facilities/reshui.png"></div>
                    <div v-if="detail.placeDetail.isParkFree == 1"><img src="../assets/facilities/p.png"></div>
                    <div v-if="detail.placeDetail.isContainAc == 1"><img src="../assets/facilities/kongtiao.png"></div>
                    <div v-if="detail.placeDetail.isContainStorage == 1"><img src="../assets/facilities/chuwu.png"></div>
                    <div v-if="detail.placeDetail.isContainHeating == 1"><img src="../assets/facilities/nuanqi.png"></div>
                    <div v-if="detail.placeDetail.isContainSlippers == 1"><img src="../assets/facilities/tuoxie.png"></div>
                </div>
            </div>
            <div class="base-time" v-if="detail.placeDetail.businessTime">
                <div class="time">
                    <span class="time-img"></span><span class="time-text">营业时间：</span>
                </div>
                <div class="open-time">
                    <div v-for="(item, index) in detail.placeDetail.businessTime" :key="index">
                        {{item.week}}&nbsp;{{item.time}}
                    </div>
                </div>
            </div>
        </div>
        <router-link :to="{path: `/introduce`}" class="cooperation">
            <div>
                <span class="cooperation-icon"></span>
                <span class="cooperation-text">我是商家，免费入驻</span>
            </div>
            <div>
                <span class="text">收入翻翻</span>
                <span class="right"></span>
            </div>
        </router-link>
        <div class="near-venue">
            <div class="near-text">附近场馆</div>
            <div class="list">
                <div class="list-box" v-for="(item,index) in detail.placeNearResults" :key="index">
                    <div @click="linkOther(item.placeId)" class="link">
                        <div class="collect" v-if="item.collectFlg"></div>
                        <div class="img"><img :src="item.mainIconUrl"></div>
                        <div class="information">
                            <div class="name">{{item.placeName}}</div>
                            <div v-if="item.price">
                                <div class="type"><span>{{item.districtName}} {{item.categoryName}}</span><span>{{item.distanceString}}</span></div>
                                <div class="price"><span>￥{{item.price}}</span>起</div>
                            </div>
                            <div v-else>
                                <div class="space"></div>
                                <div class="type"><span>{{item.districtName}} {{item.categoryName}}</span><span>{{item.distanceString}}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="model" v-if="errorFlag">
            <div class="body">
                <div class="errorBody">
                    <div class="title">场馆纠错</div>
                    <div class="choose">
                        <div><input type="radio" v-model="check" value="0"/><span>基础信息报错</span></div>
                        <div><input type="radio" v-model="check" value="1"/><span>场馆电话报错</span></div>
                        <div><input type="radio" v-model="check" value="2"/><span>地理位置报错</span></div>
                        <div><input type="radio" v-model="check" value="3"/><span>服务设施报错</span></div>
                    </div>
                    <div class="notice">提供的信息被采纳后，您会得到<span>100积</span>分奖励（未登录时提交无法获得奖励)</div>
                    <div class="textarea">
                        <textarea v-model="errorBody" maxlength="300" :keyup="calculateNo()"></textarea>
                        <div class="text-no">{{textNo}}/300</div>
                    </div>
                    <div class="error-submit" @click="errorSubmit()">提交</div>
                </div>
                <div class="cancel" @click="init()"></div>
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
            <div class="phone-model" @click="init()" v-if="phoneFlag">
                <div class="body" @click="show($event)">
                    <div v-for="(item,index) in detail.placeDetail.phones" :key="index" @click="playPhone(item)" class="phone-no" v-if="detail.placeDetail.phones.length>0">
                        <span class="phone"></span>
                        <span>{{item}}</span>
                    </div>
                    <div class="cancel" @click="init()">取消</div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import { get } from '@/services/request.js'
import {Toast} from 'mand-mobile'
import {getUserId} from '../../../utils/common'
import { login } from '@/services/native.js'
import { IMAGE_ROOT } from '@/constants'
export default {
  name: 'detail',
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
      placeId: '',
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
      lat: null,
      lng: null,
      orgId: null,
      errotFlag: '0'
    }
  },
  components: {},
  created () {
    this.placeId = this.$route.params.id
    if (location.search.match(/lat=([^&]+)/)) {
      this.lat = decodeURIComponent(location.search.match(/lat=([^&]+)/)[1])
      this.lng = decodeURIComponent(location.search.match(/lng=([^&]+)/)[1])
      this.arrayList()
    } else {
      this.jsBirdge()
    }
  },
  mounted () {
    this.title('场馆详情')
    this.back('2')
  },
  methods: {
    playPhone (phone) {
      window.yhyBridge.ready().then(sdk => {
        sdk.callHandler('dial', {
          'data': phone
        }).then(data => {
          // success
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    showMap () {
      window.yhyBridge.ready().then(sdk => {
        sdk.callHandler('showmap', {
          'lat': this.detail.placeDetail.lat.toString(),
          'lng': this.detail.placeDetail.lng.toString(),
          'title': this.detail.placeDetail.name,
          'address': this.detail.placeDetail.cityName + this.detail.placeDetail.districtName + this.detail.placeDetail.address
        }).then(data => {
          // success
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
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
    back (index) {
      window.yhyBridge.ready().then(back => {
        back.register('common.h5goBack', (data, callback) => {
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
            this.title('场馆详情')
            this.back('2')
          } else {
            history.go(-1)
          }
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
    jsBirdge () {
      window.yhyBridge.ready().then(sdk => {
        sdk.callHandler('getClientInfo').then(data => {
          var json = JSON.parse(data)
          this.lat = json.lat // 纬度
          this.lng = json.lng // 经度
          this.arrayList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    arrayList () {
      var detail = get('outplace.placeDetailById', {
        'placeListQuery': {
          'placeId': this.placeId,
          'lat': this.lat,
          'lng': this.lng
        }
      })
      detail.then((response) => {
        response.content[0].placeNearResults.map((item) => {
          item.mainIconUrl = IMAGE_ROOT + '/' + item.mainIconUrl
          if (parseInt(item.distance) < 1000) {
            item.distanceString = item.distance.toString() + 'm'
          } else {
            item.distanceString = (parseInt(item.distance) / 1000).toString() + 'km'
          }
        })
        response.content[0].placeDetail.placeImageList.map((item) => {
          if (item.url.indexOf('http') === -1) {
            item.url = IMAGE_ROOT + '/' + item.url
          }
        })
        this.detail = response.content[0]
        if (this.detail.placeDetail.placeImageList.length < 3) {
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
        console.log(day)
        this.detail.placeDetail.businessTime.forEach(item => {
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
        // setShare(
        //   window.location.href + this.placeId + '?lat=' + this.lat + '&lng' + this.lng,
        //   this.detail.placeDetail.name,
        //   this.detail.placeDetail.address,
        //   '')
      })
    },
    changHour (index) {
      if (index.length === 1) {
        return '0' + index
      } else {
        return index
      }
    },
    tagChange () { // 是否收集
      var status = ''
      if (this.tag) {
        status = '2'
      } else {
        status = '1'
      }
      var collect = get('outplace.collect', {
        Collect: {
          'placeId': this.placeId,
          'uid': getUserId(),
          'orgId': this.orgId,
          'status': status
        }
      })
      collect.then(response => {
        if (response.content[0].value === 1) {
          if (status === '1') {
            Toast.succeed('收藏成功')
          } else {
            Toast.succeed('取消收藏')
          }
          this.tag = !this.tag
        }
      })
    },
    correct () { // 纠错
      if (getUserId()) {
        this.errorFlag = true
        this.hidden = true
      } else {
        login()
      }
    },
    phoneShow () { // 拨打电话号码
      if (this.detail.placeDetail.phones.length > 0) {
        this.phoneFlag = true
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
      this.title('场馆详情')
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
      this.title(name)
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
    },
    linkOther (id) {
      this.$router.push(
        {
          path: '/detail/' + id
        })
      location.reload()
    }
  }
}
</script>

<style lang="scss">
@import "../common/common";
    .hide{
        position: fixed;
        overflow: hidden;
    }
    img{
        width: 100%;
        height: 100%;
    }
    %relative5{
        position: relative;
        top: 5px;
    }
    %relative2{
        position: relative;
        top: 3px;
    }
    %fontSize{
        font-family:PingFangSC-Semibold;
        font-size: 28px;
    }
    %fixed{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 110;
    }
    .img-no{
        display: block;
        background: rgba(0,0,0,0.8);
        position: absolute;
        bottom: 8px;
        right: 38px;
        font-size:18px;
        font-family:PingFangSC-Regular;
        color:#FFFFFF;
        height: 26px;
        padding: 0 6px;
        line-height: 26px;
        .show-img{
            display: inline-block;
            width: 20px;
            height: 17px;
            background: url("../assets/show-img.png")no-repeat 100% 100%;
            background-size: 100% 100%;
            margin-right:3px;
            top: 2px;
            position: relative;
        }
    }
    .phone{
        background: url("../assets/phone.png")no-repeat 100% 100%;
        width: 60px;
        height: 60px;
        background-size: 100% 100%;
    }
    .detail {
        box-sizing: border-box;
        background: #f0f0f0;
        width: 100%;
        overflow: scroll;
        padding: 0;
        -webkit-overflow-scrolling: touch;
        .img-one{
            width: 100%;
            height: auto;
        }
        .venue-information{
            background: #FFFFFF;
            padding: 17px 0 34px 28px;
            .venue-name{
                font-size:36px;
                font-family:PingFangSC-Semibold;
                color: #4a4a4a;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 36px;
                .name{
                    font-weight: bold;
                    line-height: 50px;
                    width: 520px;
                }
                .icon{
                    .tag{
                        background: url("../assets/tag.png")no-repeat 100% 100%;
                        display: inline-block;
                        height: 48px;
                        width: 48px;
                        background-size: 100% 100%;
                        margin-right: 20px;
                        @extend %relative5;
                    }
                    .untag{
                        background: url("../assets/untag.png")no-repeat 100% 100%;
                        display: inline-block;
                        height: 48px;
                        width: 48px;
                        background-size: 100% 100%;
                        margin-right: 20px;
                        @extend %relative5;
                    }
                    .error-correction{
                        background: url("../assets/error.png")no-repeat 100% 100%;
                        display: inline-block;
                        height: 48px;
                        width: 48px;
                        background-size: 100% 100%;
                        @extend %relative2;
                    }
                }
            }
            .venue-type{
                font-size:26px;
                font-family:PingFangSC-Regular;
                color:#999999;
                margin-bottom: 26px;
                .price{
                    color: #EE4418;
                    margin-left: 12px;
                }
            }
            .img{
                overflow-x: scroll;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
                margin: 0 20px 20px 0;
                width: 100%;
                display: flex;
                flex-wrap: nowrap;
                position: relative;
                div{
                    flex:0 0 220px;
                    height: 166px;
                    padding-right: 18px;
                    overflow: hidden;
                }
            }
            .business-hours{
                font-family: PingFangSC-Regular;
                font-size: 26px;
                color: #4A4A4A;
                padding-bottom: 20px;
                border-bottom: 1px solid #f0f0f0;
                .time{
                    display: inline-block;
                    background: url("../assets/time.png")no-repeat 100% 100%;
                    width: 28px;
                    height: 28px;
                    background-size: 100% 100%;
                    @extend %relative2;
                }
                .close-time{
                    display: inline-block;
                    background: url("../assets/close-venue.png")no-repeat 100% 100%;
                    width: 28px;
                    height: 28px;
                    background-size: 100% 100%;
                    @extend %relative2;
                }
            }
            .address-phone{
                padding: 18px 16px 0px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .address{
                    box-sizing: border-box;
                    border-right: 1px solid #DDDDDD;
                    .address-icon{
                        background: url("../assets/address-icon.png")no-repeat 100% 100%;
                        display: inline-block;
                        width: 28px;
                        height: 28px;
                        background-size: 100% 100%;
                        vertical-align: top;
                        position: relative;
                        top: 8px;
                    }
                    .address-name{
                        width: 580px;
                        display: inline-block;
                        .name{
                            font-weight: bold;
                            @extend %fontSize;
                            color: #4a4a4a;
                            margin-bottom: 4px;
                        }
                        .subway{
                            font-size:24px;
                            font-family:PingFangSC-Regular;
                            color: #999999;
                        }
                    }
                }
            }
        }
        .venue-base{
            background: #FFFFFF;
            margin-top: 16px;
            font-family:PingFangSC-Regular;
            .base{
                margin: 0px 29px 0 29px;
                padding-top: 22px;
                .base-text{
                    font-weight: bold;
                    font-size:28px;
                    font-family:PingFangSC-Semibold;
                    color: #4a4a4a;
                    padding-bottom: 22px;
                }
                .base-img{
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    div{
                        width: 88px;
                        height: 88px;
                        margin:0 50px 38px 0;
                        box-sizing: border-box;
                    }
                }
            }
            .base-time{
                margin: 0px 29px;
                padding: 25px 0;
                border-top: 1px solid #f5f5f5;
                display: flex;
                font-size: 24px;
                color: #666666;
                .time{
                    width: 200px;
                    .time-img{
                        display: inline-block;
                        width: 28px;
                        height: 28px;
                        background: url("../assets/close-time.png")no-repeat 100% 100%;
                        background-size: 100% 100%;
                        @extend %relative2;
                        margin-right: 8px;
                    }
                }
            }
        }
        .cooperation{
            text-decoration: none;
            margin: 16px 0;
            background: #FFFFFF;
            padding: 0 16px 0 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 80px;
            line-height: 80px;
            >div{
                .cooperation-icon{
                    display: inline-block;
                    background: url("../assets/cooperation-icon.png")no-repeat 100% 100%;
                    width: 34px;
                    height: 30px;
                    background-size: 100% 100%;
                    @extend %relative5;
                }
                .cooperation-text{
                    font-weight: bold;
                    margin-left: 7px;
                    @extend %fontSize;
                    color: #4a4a4a;
                }
                .text{
                    font-size:26px;
                    font-family:PingFangSC-Regular;
                    color: #666666;
                    margin-right: 9px;
                }
                .right{
                    @extend %relative5;
                }
            }
        }
        .near-venue{
            background: #FFFFFF;
            margin-bottom: 20px;
            .near-text{
                @extend %fontSize;
                color: #666666;
                padding: 26px 16px 10px 28px;
            }
            .list{
                margin-top: 0px;
            }
        }
        .model{
            background: rgba(0,0,0,0.5);
            @extend %fixed;
            .body{
                position: absolute;
                left: 50%;
                top: 50%;
                width: 576px;
                transform: translate(-50%,-50%);
                .errorBody{
                    padding: 37px 28px;
                    background: #FFFFFF;
                    border-radius:12px;
                    .title{
                        text-align: center;
                        font-size:36px;
                        font-family:PingFangSC-Semibold;
                        color: #000000;
                        margin-bottom: 56px;
                    }
                    .choose{
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        div{
                            box-sizing: border-box;
                            width: 50%;
                            font-size:28px;
                            font-family:PingFangSC-Semibold;
                            font-weight: bold;
                            color: #4a4a4a;
                            margin-bottom: 52px;
                            span{
                                margin-left: 16px;
                                position: relative;
                                bottom: 6px;
                            }
                        }
                    }
                    .notice{
                        font-size: 26px;
                        color: #999999;
                        line-height: 30px;
                        margin-bottom: 10px;
                        span{
                            color: #ED4D4D;
                        }
                    }
                    .textarea{
                        position: relative;
                        margin-bottom: 30px;
                        textarea{
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            border: 1px solid #DDDDDD;
                            resize: none;
                            width: 100%;
                            height: 280px;
                            outline: none;
                            border-radius: 0px;
                        }
                        .text-no{
                            font-size:24px;
                            font-family:PingFangSC-Regular;
                            color:#999999;
                            position: absolute;
                            bottom: 18px;
                            right: 26px;
                        }
                    }
                    .error-submit{
                        font-size:32px;
                        font-family:PingFangSC-Regular;
                        color: #ED4D4D;
                        text-align: center;
                    }
                }
                .cancel{
                    width: 84px;
                    height: 84px;
                    margin: 56px auto 0 auto;
                    background: url("../assets/cancel.png")no-repeat 100% 100%;
                    background-size: 100% 100%;
                    z-index: 155;
                }
            }
        }
        .img-moel{
            background: rgba(0,0,0,1);
            @extend %fixed;
            .body{
                padding: 80px 5px 80px 25px;
                height: 100%;
                overflow: scroll;
                -webkit-overflow-scrolling: touch;
                .back{
                    width: 26px;
                    height: 26px;
                    border-top: 3px solid #FFFFFF;
                    border-left: 3px solid #FFFFFF;
                    transform: rotate(-45deg);
                    position: absolute;
                    top: 31px;
                    left: 40px;
                    z-index: 200;
                }
                .img-show {
                    display: inline-block;
                    width: 50%;
                    height: 255px;
                    box-sizing: border-box;
                    margin-bottom: 20px;
                    padding-right: 20px;
                }

            }
            .img-body{
                position: absolute;
                width: 100%;
                height: 100%;
                .swiper-container {
                    .box {
                        width: 100%;
                        height: 800px;
                        margin: 266px auto;
                    }
                    .swiper-pagination-bullet {
                        width: 12px;
                        height: 12px;
                        background: #fff;
                        opacity: 1;
                    }
                    .swiper-pagination-bullet-active {
                        background: #ED4D4D;
                    }
                    .swiper-container-horizontal > .swiper-pagination-bullets {
                        bottom: 50px;
                    }
                }
            }
        }
        .phone-model{
            background: rgba(0,0,0,0.6);
            @extend %fixed;
            z-index: 200;
            .body{
                position: absolute;
                bottom: 0;
                width: 100%;
                background: #FFFFFF;
                z-index: 220;
                box-shadow: 0 0 12px #f0f0f0;
                .phone-no{
                    display: block;
                    font-size:44px;
                    font-family:PingFangSC-Semibold;
                    color: #4A4A4A;
                    line-height: 154px;
                    height: 154px;
                    text-align: center;
                    text-decoration: none;
                    border-bottom: 1px solid #e0e0e0;
                    .phone{
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        @extend %relative2;
                    }
                }
                .cancel{
                    height: 98px;
                    line-height: 98px;
                    text-align: center;
                    font-size:36px;
                    font-family:PingFangSC-Regular;
                    color: #000000;
                }
            }
        }
    }
</style>
