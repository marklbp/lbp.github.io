<template lang="html">
    <div class="claim">
        <div class="progress-bar">
            <span class="bar point-before">1</span>
            <span class="bar active point-after">2</span>
            <span class="bar">3</span>
        </div>
        <div class="bar-text">
            <span class="text">注册</span>
            <span class="text relative">认领场馆</span>
            <span class="text">提交资质</span>
        </div>
        <div class="re-election" v-if="claimFlag">
            <div class="name-address">
                <div class="venue-name">{{venueName}}</div>
                <div class="venue-address">{{venueAddress}}</div>
            </div>
            <div class="re-election-button" @click="election()">重选</div>
        </div>
        <div class="base-information" v-if="claimFlag">
            <div>
              <span>营业执照信息</span>
              <span class="text">
                  <span :class="{'upload':uploadFlag,'unUpload':!uploadFlag}" @click="businessUpload()">{{businessText}}</span>
                  <span class="right"></span>
              </span>
            </div>
            <div>
                <span>经营者信息</span>
                <span class="text">
                  <span :class="{'upload':personUploadFlag,'unUpload':!personUploadFlag}" @click="personUpload()">{{personText}}</span>
                  <span class="right"></span>
              </span>
            </div>
        </div>
        <div class="claim-venue" v-if="!claimFlag">
            <div class="text">认领场馆</div>
            <div class="search-venue">
                <div class="change-city" @click="changeCity()"><span class="city-show">{{cityName}}</span><span :class="{'drop-down':down , 'drop-up':!down}"></span></div>
                <span class="icon-flag"></span>
                <input type="text" placeholder="按场馆名搜索" v-model="searchName">
                <span @click="search()" class="button">搜索</span>
            </div>
            <div class="venue-list" v-if="!claimFlag">
                <div class="venue" v-for="(item,index) in list" :key="index">
                    <div class="name-address">
                        <div class="venue-name">{{item.placeName}}</div>
                        <div class="venue-address">{{item.place.address}}</div>
                    </div>
                    <div class="venue-button" v-if="item.place.cooperationStatus == 0" @click="claimVenue(index)">认领</div>
                    <div class="venue-cooperation" v-else-if="item.place.cooperationStatus== 1">已合作</div>
                </div>
            </div>
        </div>
        <div class="create-venue" v-if="!claimFlag">
            <div class="notice">没有找到你的场馆？点击以下按钮创建</div>
            <router-link :to="{path: `/create`}" class="create-button">创建场馆</router-link>
        </div>
        <div class="submit-audit" :class="{'allow':allowFlag}" v-if="claimFlag" @click="submitAudit()">
            <div>提交审核</div>
        </div>
        <div class="model" v-if="againFlag">
            <div class="body">
                <div class="title">确定认领以下场馆？</div>
                <div class="name">场馆名称：{{venueName}}</div>
                <div class="address">地址：{{venueAddress}}</div>
                <div class="button-area">
                    <span class="cancel" @click="cancel()">取消</span>
                    <span class="claimButton" @click="claimSubmit(venueId)">认领</span>
                </div>
            </div>
        </div>
        <div class="card-model" v-if="cardFlag">
            <div class="body" v-if="businessFlag">
                <div class="business-card">
                    <div class="img-bg">
                        <div class="default-img">
                            <img src="../assets/business-card.png" v-if="!businessImgFlag">
                            <img :src="businessSrc" v-if="businessImgFlag">
                            <input type="file"  @change="fileChange($event,'1')" class="file" accept="image/png, image/jpeg">
                        </div>
                    </div>
                    <div class="img-text">上传营业执照</div>
                </div>
                <div class="img-notice">提醒：上传营业执照需文字清晰、边框完整、露出国徽。</div>
                <div class="filed-bg">
                    <div class="filed">
                        <div class="name">公司名称</div>
                        <input type="text" class="filed-name" v-model="companyName" :keyup="allowSubmit('1')" placeholder="请输入营业执照的公司全称">
                    </div>
                </div>
                <div class="card-submit" :class="{'allow':businessSubmit}" @click="cardInformationSubmit('1')">确认提交</div>
            </div>
            <div class="body" v-if="!businessFlag">
                <div class="card">
                    <div class="card-bg">
                        <div class="img-bg">
                            <div class="default-img">
                                <img src="../assets/card-positive.png" v-if="!positiveImgFlag">
                                <img :src="positiveSrc" v-if="positiveImgFlag">
                                <input type="file"  @change="fileChange($event,'2')" class="file" accept="image/png, image/jpeg">
                            </div>
                        </div>
                        <div class="img-text">上传身份证正面</div>
                    </div>
                    <div class="card-bg">
                        <div class="img-bg">
                            <div class="default-img">
                                <img src="../assets/card-reverse.png" v-if="!reverseImgFlag">
                                <img :src="reverseSrc" v-if="reverseImgFlag">
                                <input type="file"  @change="fileChange($event,'3')" class="file" accept="image/png, image/jpeg">
                            </div>
                        </div>
                        <div class="img-text">上传身份证反面</div>
                    </div>
                </div>
                <div class="person">
                    <div class="img-bg">
                        <div class="default-img">
                            <img src="../assets/card-person.png" v-if="!personImgFlag">
                            <img :src="personSrc" v-if="personImgFlag">
                            <input type="file"  @change="fileChange($event,'4')" class="file" accept="image/png, image/jpeg">
                        </div>
                    </div>
                    <div class="img-text">上传手持身份证照片</div>
                </div>
                <div class="img-notice">提醒：上传身份证需文字清晰、边框完整。</div>
                <div class="filed-bg">
                    <div class="filed">
                        <div class="name">真实姓名</div>
                        <input type="text" class="filed-name" :keyup="allowSubmit('2')" v-model="personName" placeholder="请输入">
                    </div>
                    <div class="filed">
                        <div class="name">身份证号</div>
                        <input type="text" class="filed-name" :keyup="allowSubmit('2')" v-model="cardNo" placeholder="请输入">
                    </div>
                </div>
                <div class="card-submit" :class="{'allow':personSubmit}" @click="cardInformationSubmit('2')">确认提交</div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { get, post } from '@/services/request.js'
import {Toast} from 'mand-mobile'
import InfiniteScroll from 'vue-infinite-scroll'
import {getUserId} from '../../../utils/common'
import { login } from '@/services/native.js'
import { upload } from '../../../services/upload'
import { IMAGE_ROOT } from '@/constants'
Vue.use(InfiniteScroll)
export default {
  name: 'claim',
  data () {
    return {
      // list: {},
      list: [],
      cityName: '',
      down: true,
      searchName: '',
      cooperationFlag: false,
      claimFlag: false,
      venueId: '',
      venueName: '',
      venueAddress: '',
      againFlag: false,
      uploadFlag: false,
      personUploadFlag: false,
      allowFlag: false,
      businessFlag: false,
      cardFlag: false,
      defaultImg: '',
      companyName: '',
      personName: '',
      cardNo: '',
      businessText: '点击上传',
      personText: '点击上传',
      businessSubmit: false,
      personSubmit: false,
      cityCode: '',
      uid: '',
      districtCode: '',
      pageNo: 1,
      pageSize: 100,
      businessImgFlag: false,
      positiveImgFlag: false,
      reverseImgFlag: false,
      personImgFlag: false,
      businessLicence: '',
      identityCardA: '',
      identityCardB: '',
      handheldIdentityUrl: '',
      businessSrc: '',
      positiveSrc: '',
      reverseSrc: '',
      personSrc: '',
      categoryId: null,
      categoryName: '',
      bookingConsultPhone: '',
      venueCityName: '',
      venueCityCode: '',
      venueDistrictCode: '',
      venueDistrictName: '',
      orgCode: '',
      lat: null,
      lng: null,
      claimApiName: 'organization.applyOrgEnter',
      orgEnterId: '',
      model: null
    }
  },
  mounted () {
    this.claimTitle('认领场馆')
    this.uid = getUserId()
    if (location.href.indexOf('placeId') > -1) {
      var href = location.href
      var placeId = href.substring(href.indexOf('placeId') + 8, href.indexOf('&'))
      this.orgEnterId = href.substring(href.indexOf('orgEnterId') + 11, href.length)
      this.claimFlag = true
      this.model = 102
      this.jsBirdge('1', placeId)
      this.hookBack('2')
      this.claimApiName = 'organization.updateOrgAuditInfo'
    } else {
      this.jsBirdge()
      this.hookBack('3')
      this.model = 101
      this.claimApiName = 'organization.applyOrgEnter'
    }
  },
  methods: {
    claimTitle (title) {
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
    jsBirdge (index, placeId) {
      window.yhyBridge.ready().then(sdk => {
        sdk.callHandler('getClientInfo').then(data => {
          data = JSON.parse(data)
          this.cityCode = data.cityCode // 城市code
          this.cityName = data.city
          this.districtCode = data.districtCode // 区code
          this.lat = data.lat // 纬度
          this.lng = data.lng // 经度
          if (index === '1') {
            this.detailBase(placeId)
          } else {
            this.venueList()
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    venueList (item) {
      var a = get('outplace.searchPlace', {
        'placeListQuery': {
          'cityCode': this.cityCode,
          'uid': this.uid,
          'districtCode': this.districtCode || -1,
          'categoryId': this.categoryId || -1,
          'currentLat': this.lat,
          'currentLng': this.lng,
          'name': this.searchName,
          'key': this.searchName,
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'isSign': '1',
          'isShelves': '1'
        }
      })
      a.then((response) => {
        this.list = response.content[0].placeResults
      })
    },
    changeCity () {
      this.down = !this.down
      window.yhyBridge.ready().then(sdk => {
        sdk.callHandler('selectCity', {}).then(data => {
          var cityData = JSON.parse(data)
          if (cityData.cityCode) {
            this.cityName = cityData.cityName
            this.cityCode = cityData.cityCode
          }
          this.venueList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    search () {
      this.venueList()
    },
    claimVenue (index) {
      this.uploadFlag = false
      this.personUploadFlag = false
      this.againFlag = true
      this.detailBase(this.list[index].placeId)
    },
    detailBase (id) {
      var detail = get('outplace.placeDetailById', {
        'placeListQuery': {
          'placeId': id,
          'lat': this.lat,
          'lng': this.lng
        }
      })
      detail.then(response => {
        this.venueId = response.content[0].placeDetail.placeId
        this.venueName = response.content[0].placeDetail.name
        this.venueAddress = response.content[0].placeDetail.address
        this.categoryId = response.content[0].placeDetail.categoryId
        this.categoryName = response.content[0].placeDetail.categoryName
        this.bookingConsultPhone = response.content[0].placeDetail.bookingConsultPhone
        this.venueCityName = response.content[0].placeDetail.cityName
        this.venueCityCode = response.content[0].placeDetail.cityCode
        this.venueDistrictCode = response.content[0].placeDetail.districtCode
        this.venueDistrictName = response.content[0].placeDetail.districtName
        this.orgCode = response.content[0].placeDetail.code
      })
    },
    claimSubmit (id) {
      if (getUserId()) {
        this.againFlag = false
        this.claimFlag = true
        this.hookBack('2')
      } else {
        login()
      }
    },
    cancel () {
      this.againFlag = false
    },
    election () {
      this.claimFlag = false
      this.searchName = ''
      this.claimFlag = false
      this.identityCardA = ''
      this.identityCardB = ''
      this.handheldIdentityUrl = ''
      this.positiveImgFlag = false
      this.positiveSrc = ''
      this.reverseImgFlag = false
      this.reverseSrc = ''
      this.personImgFlag = false
      this.personSrc = ''
      this.personUploadFlag = false
      this.businessImgFlag = false
      this.businessSrc = ''
      this.uploadFlag = false
      this.businessText = '点击上传'
      this.personText = '点击上传'
      this.allowFlag = false
      this.hookBack('3')
    },
    submitAudit () {
      if (this.allowFlag) {
        this.allowFlag = false
        var submit = post(this.claimApiName, {
          'orgEnterParam': {
            'id': this.orgEnterId,
            'mobile': this.bookingConsultPhone,
            'businessLicence': this.businessLicence,
            'identityCardA': this.identityCardA,
            'identityCardB': this.identityCardB,
            'handheldIdentityUrl': this.handheldIdentityUrl,
            'model': this.model,
            'places': [
              {
                'id': this.venueId,
                'name': this.venueName
              }
            ],
            'sports': [{
              'id': this.categoryId,
              'name': this.categoryName
            }],
            'realName': this.companyName,
            'proprietorName': this.personName,
            'proprietorIdentityNo': this.cardNo,
            'outerId': this.venueId,
            'corpName': this.venueName,
            'cityBeans': [{
              'cityCode': this.venueCityCode,
              'cityName': this.venueCityName,
              'districtCode': this.venueDistrictCode,
              'districtName': this.venueDistrictName
            }],
            'parentOuterId': this.venueCityCode,
            'orgType': 14,
            'orgCode': this.orgCode,
            'applyUserId': this.uid
          }
        })
        submit.then(response => {
          if (response.content[0].success) {
            this.$router.push(
              {
                path: '/success'
              })
          } else {
            this.allowFlag = true
            if (response.stat.stateList[0].code === 34000025) {
              Toast.failed('此场馆您已认领')
            } else {
              Toast.failed(response.content[0].errorMessage)
            }
          }
        })
      }
    },
    businessUpload () {
      if (!this.uploadFlag) {
        this.companyName = ''
      } else {
        this.businessImgFlag = true
      }
      this.cardFlag = true
      this.businessFlag = true
      this.claimTitle('上传营业执照')
      this.hookBack('1')
    },
    personUpload () {
      if (!this.personUploadFlag) {
        this.personName = ''
        this.cardNo = ''
      } else {
        this.positiveImgFlag = true
        this.reverseImgFlag = true
        this.personImgFlag = true
      }
      this.cardFlag = true
      this.businessFlag = false
      this.claimTitle('上传身份证')
      this.hookBack('1')
    },
    hookBack (index) {
      window.yhyBridge.ready().then(back => {
        back.register('common.h5goBack', (data, callback) => {
          if (index === '1') {
            this.cardFlag = false
            if (!this.uploadFlag) {
              this.businessImgFlag = false
              this.businessSrc = ''
              this.uploadFlag = false
            }
            if (!this.personUploadFlag) {
              this.positiveImgFlag = false
              this.positiveSrc = ''
              this.reverseImgFlag = false
              this.reverseSrc = ''
              this.personImgFlag = false
              this.personSrc = ''
              this.personUploadFlag = false
            }
            this.claimTitle('认领场馆')
            this.hookBack('2')
          } else if (index === '2') {
            this.searchName = ''
            this.claimFlag = false
            this.identityCardA = ''
            this.identityCardB = ''
            this.handheldIdentityUrl = ''
            this.positiveImgFlag = false
            this.positiveSrc = ''
            this.reverseImgFlag = false
            this.reverseSrc = ''
            this.personImgFlag = false
            this.personSrc = ''
            this.personUploadFlag = false
            this.businessImgFlag = false
            this.businessSrc = ''
            this.uploadFlag = false
            this.businessText = '点击上传'
            this.personText = '点击上传'
            this.allowFlag = false
            this.hookBack('3')
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
      }).catch(function (err) {
        console.log(err)
      })
    },
    fileChange (e, index) {
      if (index === '1') {
        this.businessImgFlag = true
        upload(e.target.files[0]).then(res => {
          this.businessLicence = res.data
          this.businessSrc = IMAGE_ROOT + '/' + res.data
        })
        this.allowSubmit('1')
      } else if (index === '2') {
        this.positiveImgFlag = true
        upload(e.target.files[0]).then(res => {
          this.identityCardA = res.data
          this.positiveSrc = IMAGE_ROOT + '/' + res.data
        })
        this.allowSubmit('2')
      } else if (index === '3') {
        this.reverseImgFlag = true
        upload(e.target.files[0]).then(res => {
          this.identityCardB = res.data
          this.reverseSrc = IMAGE_ROOT + '/' + res.data
        })
        this.allowSubmit('2')
      } else if (index === '4') {
        this.personImgFlag = true
        upload(e.target.files[0]).then(res => {
          this.handheldIdentityUrl = res.data
          this.personSrc = IMAGE_ROOT + '/' + res.data
        })
        this.allowSubmit('2')
      }
    },
    cardInformationSubmit (index) {
      // var json = {}
      if (index === '1' && this.businessSubmit) {
        if (this.businessLicence) {
          this.cardFlag = false
          this.uploadFlag = true
          this.businessText = '已上传'
          this.claimTitle('认领场馆')
          this.allow()
        }
      } else if (index === '2' && this.personSubmit) {
        if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(this.cardNo)) {
          Toast.failed('身份证输入有误，请重新输入')
          return false
        }
        if (this.identityCardA && this.identityCardB && this.handheldIdentityUrl) {
          this.cardFlag = false
          this.personUploadFlag = true
          this.personText = '已上传'
          this.claimTitle('认领场馆')
          this.allow()
        }
      }
    },
    allow () {
      if (this.uploadFlag && this.personUploadFlag) {
        this.allowFlag = true
      }
    },
    allowSubmit (index) {
      if (index === '1') {
        if (this.companyName && this.businessLicence) {
          this.businessSubmit = true
        } else {
          this.businessSubmit = false
        }
      } else if (index === '2') {
        if (this.personName && this.cardNo && this.identityCardA && this.identityCardB && this.handheldIdentityUrl) {
          this.personSubmit = true
        } else {
          this.personSubmit = false
        }
      }
    }
  }
}
</script>

<style lang="scss">
    @import "../common/common";
    .img-bg{
        background: url("../assets/picture-background.png")no-repeat 100% 100%;
        background-size: 100% 100%;
    }
    img{
        width: 100%;
        height: 100%;
    }
    .file{
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
    .allow{
        background:linear-gradient(-126.9deg,rgba(229,0,17,1),rgba(246,55,98,1)) !important;
        box-shadow:0px 4px 10px 0px rgba(229,0,17,0.4) !important;
    }
    %point{
        width: 236px;
        display: inline-block;
        height: 40px;
        line-height: 40px;
        content: '. . . . . . . . . . . . .';
        font-size: 30px;
        color: #d8d8d8;
        margin-left: 46px;
        position: relative;
        bottom: 45px;
    }
    %drop {
        display: inline-block;
        width: 12px;
        height: 8px;
        position: relative;
        bottom: 8px;
    }
    %button{
        height: 100%;
        box-sizing: border-box;
        width: 50%;
        text-align: center;
        font-size:34px;
    }
    %venue-name{
        padding-top: 20px;
        font-size:30px;
        font-family:PingFangSC-Semibold;
        color:#4A4A4A;
        margin-bottom: 10px;
    }
    %venue-address{
        padding-bottom: 20px;
        font-size:26px;
        color:#666666;
    }
    %venue-button{
        width:120px;
        height:48px;
        border-radius:40px;
        line-height: 48px;
        text-align: center;
        font-size:28px;
    }
    .filed{
        display: flex;
        height: 130px;
        @extend %flex;
        padding-right: 32px;
        background: #FFFFFF;
        font-family:PingFangSC-Regular;
        border-bottom: 1px solid #e7e7e7;
        .name{
            width:140px;
            font-size:32px;
            color: #333333;
        }
        .filed-name{
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: none;
            font-size: 32px;
            color: #666666;
            text-align: right;
            flex: auto;
            outline: none;
        }
    }
    .filed:nth-child(2){
        border: none;
    }
    .claim{
        background: #f0f0f0;
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
        position: fixed;
        font-family:PingFangSC-Regular;
        .progress-bar{
            background: #f0f0f0;
            padding: 29px 66px 0 66px;
            @extend %flex;
            .bar{
                display: inline-block;
                width: 40px;
                height: 40px;
                line-height: 42px;
                text-align: center;
                border-radius: 100px;
                border:1px solid #333333;
                font-size:32px;
                font-family:PingFangSC-Medium;
                color: #333333;
            }
            .point-before:after{
                @extend %point;
            }
            .point-after:after{
                @extend %point;
            }
            .active{
                background: #333333;
                border:1px solid #333333;
                color: #FFFFFF;
            }
        }
        .bar-text{
            background: #f0f0f0;
            @extend %flex;
            padding: 6px 33px 16px 60px;
            font-size:26px;
            color: #333333;
            .relative{
                position: relative;
                left: 10px;
            }
        }
        .re-election{
            background:#FFFFFF;
            @extend %flex;
            margin-bottom: 16px;
            padding: 0 40px;
            .name-address{
                width: 540px;
                .venue-name{
                    @extend %venue-name;
                }
                .venue-address{
                    @extend %venue-address;
                }
            }
            .re-election-button{
                @extend %venue-button;
                border:1px solid #DDDDDD;
                color:#4A4A4A;
            }
        }
        .base-information{
            background: #FFFFFF;
            padding-left: 30px;
            margin-bottom: 40px;
            div{
                @extend %flex;
                font-size:30px;
                color:#000000;
                border-bottom: 1px solid #e7e7e7;
                padding: 41px 0;
                position: relative;
                .text{
                    padding-right: 35px;
                    .upload{
                        color: #4A4A4A;
                    }
                    .unUpload{
                        color: #999999;
                    }
                    .right{
                        position: relative;
                        top: 5px;
                    }
                }
            }
            div:nth-last-child(1){
                border: none;
            }
        }
        .claim-venue{
            background: #FFFFFF;
            padding: 18px 0 0 27px;
            .text{
                font-size:30px;
                color:#000000;
                padding-bottom: 24px;
            }
            .search-venue{
                @extend %flex;
                height: 64px;
                padding: 0 28px 28px 0;
                position: relative;
                .change-city{
                    font-size:28px;
                    font-family:PingFangSC-Semibold;
                    color: #4A4A4A;
                    flex:0 0 114px;
                    .city-show{
                        text-align: center;
                        display: inline-block;
                        width: 90px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    .drop-down{
                        background: url("../assets/drop-down.png")no-repeat 100% 100%;
                        background-size: 100% 100%;
                        @extend %drop;
                    }
                    .drop-up{
                        background: url("../assets/drop-up.png")no-repeat 100% 100%;
                        background-size: 100% 100%;
                        @extend %drop;
                    }
                }
                .icon-flag{
                    display: inline-block;
                    background: url("../assets/search.png")no-repeat 100% 100%;
                    width: 28px;
                    height: 28px;
                    background-size: 100% 100%;
                    position: absolute;
                    top: 18px;
                    left: 130px;
                }
                input[type=text]{
                    outline: none;
                    font-size: 28px;
                    color: #4A4A4A;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    border: none;
                    background: #F0F0F0;
                    border-radius: 0px;
                    height: 64px;
                    line-height: 64px;
                    flex:1 1 auto;
                    text-align: left;
                    text-indent: 60px;
                }
                .button{
                    display: inline-block;
                    height:64px;
                    line-height: 64px;
                    font-size:32px;
                    font-family:PingFangSC-Semibold;
                    color: #4A4A4A;
                    margin-left: 18px;
                }
            }
            .venue-list{
                border-top: 1px solid #e7e7e7;
                height: 620px;
                background: #FFFFFF;
                overflow: scroll;
                -webkit-overflow-scrolling: touch;
                padding-bottom: 270px;
                .venue{
                    border-bottom: 1px solid #e7e7e7;
                    @extend %flex;
                    .name-address{
                        width: 540px;
                        .venue-name{
                            font-weight: bold;
                            @extend %venue-name;
                        }
                        .venue-address{
                            @extend %venue-address;
                        }
                    }
                    .venue-button{
                        @extend %venue-button;
                        border:1px solid #F42E55;
                        color:#E50011;
                        margin-right: 40px;
                    }
                    .venue-cooperation{
                        font-size:28px;
                        color:#999999;
                        padding-right: 40px;
                    }

                }
            }
        }
        .create-venue{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #FFFFFF;
            border-top:1px solid rgba(231,231,231,1);
            .notice{
                padding: 18px 18px 0 18px;
                font-size:26px;
                color: #666666;
                text-align: center;
            }
            .create-button{
                display: block;
                text-decoration: none;
                margin: 18px;
                background:linear-gradient(-126.9deg,#E50011,#F63762);
                box-shadow:0px 4px 10px 0px #E50011;
                border-radius:4px;
                font-size:33px;
                font-family:PingFangSC-Semibold;
                color:#FFFFFF;
                text-align: center;
                height: 85px;
                line-height: 85px;
            }
        }
        .submit-audit{
            margin: 0 18px 0px 18px;
            height:85px;
            background: #b3b3b3;
            border-radius:7px;
            line-height: 85px;
            font-size:33px;
            font-family:PingFangSC-Semibold;
            color: #ffffff;
            text-align: center;
        }
        .model{
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 150;
            .body{
                background: #FFFFFF;
                position: absolute;
                top: 50%;
                left: 50%;
                width: 650px;
                transform: translate(-50%,-50%);
                border-radius:12px;
                .title{
                    font-weight: bold;
                    padding: 68px 0 58px 0;
                    text-align: center;
                    font-size:40px;
                    font-family:PingFangSC-Semibold;
                    color: #4a4a4a;
                }
                .name{
                    font-size:28px;
                    color: #4A4A4A;
                    padding: 0 62px 28px 62px;
                }
                .address{
                    font-size:28px;
                    color: #4A4A4A;
                    padding: 0 62px;
                    padding-bottom: 46px;
                }
                .button-area{
                    @extend %flex;
                    height: 100px;
                    border-top: 1px solid #E0E0E0;
                    line-height: 100px;
                    .cancel {
                        @extend %button;
                        color: #000000;
                        border-right: 1px solid #E0E0E0;
                    }
                    .claimButton{
                        @extend %button;
                        color: #E50011;
                    }
                }
            }
        }
        .card-model{
            background: #F6F6F6;
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 150;
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
            .body{
                .business-card{
                    background: #FFFFFF;
                    width: 100%;
                    height: 352px;
                    padding-top: 55px;
                    .img-bg{
                        margin: 0px auto 22px auto;
                    }
                }
                .card{
                    @extend %flex;
                    background: #FFFFFF;
                    padding: 55px 30px 0px 30px;
                    .card-bg{
                        margin-right: 50px;
                    }
                    .card-bg:nth-child(2){
                        margin-right: 0;
                    }

                }
                .person{
                    background: #FFFFFF;
                    .img-bg{
                        margin: 0 auto 22px auto;
                    }
                }
                .img-bg{
                    width: 320px;
                    height: 240px;
                    margin-bottom: 22px;
                    .default-img{
                        border: 1px dashed #e7e7e7;
                        position:relative;
                        width: 216px;
                        height: 140px;
                        margin: 0 auto;
                        top: 50px;
                    }
                }
                .img-text{
                    font-size:28px;
                    font-family:PingFangSC-Medium;
                    color: #333333;
                    padding-bottom: 62px;
                    text-align: center;
                }
                .filed-bg{
                    background: #FFFFFF;
                    padding-left: 32px;
                }
                .img-notice{
                    height:80px;
                    background: #F6F6F6;
                    line-height: 80px;
                    font-size:24px;
                    color: #999999;
                    padding-left: 32px;
                }
                .card-submit{
                    margin: 40px 15px;
                    height:90px;
                    background: #b3b3b3;
                    border-radius:7px;
                    line-height: 90px;
                    font-size:33px;
                    font-family:PingFangSC-Semibold;
                    color: #ffffff;
                    text-align: center;
                }
            }
        }
    }
</style>
