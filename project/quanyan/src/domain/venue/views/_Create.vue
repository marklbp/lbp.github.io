<template lang="html">
    <div class="create">
        <div class="information">
            <div class="file-content">
                <div class="name">场馆名称</div>
                <div class="file">
                    <input type="text" placeholder="输入场馆名称" :keyup="allowCreate()" v-model="venueName"/>
                </div>
            </div>
            <div class="file-content">
                <div class="name">订场电话</div>
                <div class="file">
                    <input type="number" maxlength="11" placeholder="输入电话" :keyup="numAllow()" v-model="venuePhone"/>
                </div>
            </div>
            <div class="file-content">
                <div class="name">场馆类型</div>
                <div class="file">
                    <input type="text" placeholder="点击选择" v-model="venueType" readonly @click="chooseType()"/>
                    <span class="right"></span>
                </div>
            </div>
            <div class="file-content">
                <div class="name">场馆地址</div>
                <div class="file">
                    <input type="text" placeholder="选择城市" v-model="venueCity" readonly @click="chooseCity()"/>
                    <span class="right"></span>
                </div>
            </div>
            <div class="file-content">
                <div class="file">
                    <input type="text" placeholder="输入详细地址：街道，楼牌号，楼层等" :keyup="allowCreate()" v-model="venueAddress"/>
                </div>
            </div>
            <div class="file-content">
                <div class="name">运营负责人</div>
                <div class="file">
                    <input type="text" placeholder="输入负责人姓名" :keyup="allowCreate()" v-model="venueHead"/>
                </div>
            </div>
        </div>
        <div class="describe">
            <div class="text">选填项目</div>
            <div class="open-time">
                <div class="name">营业时间</div>
                <div class="file">
                    <span class="file_name" :class="{'choose':activeFlag}" @click="chooseTime()">{{chooseText}}</span>
                    <span class="right"></span>
                </div>
            </div>
            <div class="venue-describe">
                <div class="describe-text">场馆描述</div>
                <textarea v-model="venueDescribe" maxlength="200" :keyup="calculateNo()" placeholder="输入场馆描述"></textarea>
                <div class="text-no">{{textNo}}/200</div>
            </div>
        </div>
        <div class="submit-create" :class="{'active':allowFlag}" @click="submit">确认创建</div>
        <div class="time-model" :class="{'display':!timeFlag}">
            <div :is="item.component" v-for="item in dayList" :venueOpenTime="venueOpenTime" :addDayValue="addDayValue" :addNo="addNo"></div>
            <div class="chooseDay">
                <div class="file-content">
                    <div class="addDay" @click="addDay('day')">+添加营业日</div>
                </div>
            </div>
            <div class="time-submit" @click="timeSubmit()">确认创建</div>
        </div>
        <md-picker
                ref="typePicker"
                v-model="typeFlag"
                :data="typeData"
                @confirm="onTyperConfirm"
                title="场馆类型"
        ></md-picker>
        <md-picker
                ref="cityPicker"
                v-model="cityFlag"
                :data="cityData"
                @confirm="onCityConfirm"
                is-cascade
                :cols="3"
                title="城市选择"
        ></md-picker>
    </div>
</template>
<script>
import { get, post } from '@/services/request.js'
import {Picker, Toast} from 'mand-mobile'
import Vue from 'vue'
import CityData from '../../../plugins/city.data'
import Day from '../components/Day.vue'
Vue.component(Picker.name, Picker)
export default {
  name: 'create',
  data () {
    return {
      venueName: '',
      venuePhone: '',
      venueType: '',
      venueTypeCode: '',
      venueCity: '',
      provinceCode: '',
      cityCode: '',
      districtCode: '',
      cityName: '',
      districtName: '',
      venueAddress: '',
      venueHead: '',
      openTime: '',
      venueDescribe: '',
      textNo: 0,
      allowFlag: false,
      typeData: [[]],
      typeFlag: false,
      cityFlag: false,
      cityData: CityData,
      timeFlag: false,
      venueDay: '',
      venueTime: '',
      dayList: [{
        'component': 'day'
      }],
      addNo: 0,
      venueChooseTime: [],
      venueIndex: 0,
      activeFlag: false,
      chooseText: '点击选择',
      submitFlag: '0'
    }
  },
  components: {
    [Picker.name]: Picker,
    day: Day
  },
  mounted () {
    this.title('创建场馆')
    this.cityList()
    var typeList = post('outplace.DistinctCategoryListResult', {})
    typeList.then(response => {
      response.content[0].categoryList.forEach(item => {
        this.typeData[0].push({text: item.categoryName, value: item.categoryId})
      })
    })
    this.hookBack('1')
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
    hookBack (index) {
      window.yhyBridge.ready().then(back => {
        back.register('common.h5goBack', (data, callback) => {
          if (index === '1') {
            history.go(-1)
          } else if (index === '2') {
            this.back()
            this.hookBack('1')
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
    cityList () {
      var list = get('outplace.cityList', {})
      list.then(response => {
      })
    },
    addDayValue (value) {
      if (this.dayList.length === 1) {
        Toast.failed('至少填写一个营业时间')
      } else {
        this.dayList.splice(parseInt(value), 1)
        this.addNo = this.addNo - 1
      }
    },
    chooseType () {
      document.activeElement.blur()
      this.typeFlag = true
    },
    chooseCity () {
      document.activeElement.blur()
      this.cityFlag = true
    },
    chooseTime () {
      this.timeFlag = true
      this.title('选择营业时间')
      this.hookBack('2')
    },
    calculateNo () {
      this.textNo = this.venueDescribe.length
    },
    back () {
      this.title('创建场馆')
      this.timeFlag = false
    },
    numAllow () {
      var num = /^[0-9]*[1-9][0-9]*$/
      if (this.venuePhone) {
        if (num.test(this.venuePhone)) {
          this.allowCreate()
        } else {
          this.venuePhone = this.venuePhone.substring(0, this.venuePhone.length - 1)
          Toast.failed('请输入数字')
        }
      }
    },
    allowCreate () {
      if (this.venueName && this.venuePhone && this.venueType && this.venueCity && this.venueAddress && this.venueHead) {
        this.allowFlag = true
      } else {
        this.allowFlag = false
      }
    },
    onTyperConfirm () {
      this.venueType = ''
      this.venueTypeCode = ''
      const values = this.$refs.typePicker.getColumnValues()
      this.venueType = values[0].text
      this.venueTypeCode = values[0].value
    },
    onCityConfirm () {
      this.venueCity = ''
      const values = this.$refs.cityPicker.getColumnValues()
      this.provinceCode = values[0].value
      if (values[1] && values[2]) {
        this.cityCode = values[1].value
        this.cityName = values[1].label
        this.districtCode = values[2].value
        this.districtName = values[2].label
        values.map(item => {
          this.venueCity = this.venueCity + item.label
        })
      } else {
        this.venueCity = values[0].label
      }
    },
    addDay (component) {
      this.dayList.push({
        'component': component
      })
      this.addNo = this.addNo + 1
    },
    submit () {
      if (this.allowFlag) {
        if (this.submitFlag === '0') {
          this.submitFlag = '1'
          const mobile = /^1[3|5|8]\d{9}$/
          const phone = /^0\d{2,3}-?\d{7,8}$/
          if (mobile.test(this.venuePhone) || phone.test(this.venuePhone)) {
          } else {
            Toast.failed('输入电话格式有误，请重新输入')
            this.submitFlag = '0'
            return false
          }
          var submit = post('outplace.savePlaceInfo', {
            'placeDetail': {
              'place': {
                'name': this.venueName,
                'bookingConsultPhone': this.venuePhone,
                'categoryId': this.venueTypeCode,
                'provinceCode': this.provinceCode,
                'cityCode': this.cityCode,
                'districtCode': this.districtCode,
                'cityName': this.cityName,
                'districtName': this.districtName,
                'address': this.venueAddress,
                'contact': this.venueHead,
                'businessTime': this.venueChooseTime,
                'comment': this.venueDescribe,
                'businessMode': 102
              }
            }
          })
          submit.then(response => {
            if (response.stat.stateList[0].code === 0) {
              Toast.succeed('创建成功')
              setTimeout(() => {
                this.$router.push(
                  {
                    path: '/claim?placeId=' + response.content[0].placeId + '&orgEnterId=' + response.content[0].placeDetail.place.orgEnterId
                  })
              }, 2000)
            } else {
              if (response.stat.stateList[0].code === 3350009) {
                Toast.failed('场馆名称已存在')
              }
              this.submitFlag = '0'
            }
          })
        }
      }
    },
    venueOpenTime (day, time, index) {
      if (this.venueIndex !== index) {
        this.venueChooseTime.push({
          'week': day,
          'time': time
        })
      } else {
        var json = {
          'week': day,
          'time': time
        }
        this.venueChooseTime.splice(index, 1, json)
      }
      this.venueIndex = index
    },
    timeSubmit () {
      if (this.venueChooseTime.length > 0) {
        for (var i = 0; i < this.venueChooseTime.length; i++) {
          this.venueChooseTime[i].time = this.venueChooseTime[i].time.substring(0, this.venueChooseTime[i].time.length - 1)
        }
        this.activeFlag = true
        this.chooseText = '已选择'
      }
      this.back()
    }
  }
}
</script>

<style lang="scss">
    @import "../common/common";
    .display{
        display: none;
    }
    .file-content{
        height: 122px;
        line-height: 122px;
        margin-left: 27px;
        padding-right: 32px;
        position: relative;
        border-bottom:1px solid #e7e7e7;
        @extend %flex;
        .name{
            font-size:30px;
            color:#000000;
            width: 200px;
        }
        .file{
            flex: auto;
            opacity: 1;
            position: static;
            @extend %flex;
            input{
                height: 60px;
                line-height: 60px;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                border: none;
                text-align: right;
                font-size:27px;
                color: #4A4A4A;
                flex: auto;
                outline: none;
            }
            .right{
                margin-left: 14px;
            }
        }
        .addDay{
            text-align: left;
            font-size:30px;
            color: #FF510C;
            margin-right: 32px;
            width: 100%;
        }
    }
    .file-content:nth-last-child(1){
        border: none;
    }
    .create{
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        font-family:PingFangSC-Regular;
        .information{
            background: #FFFFFF;
            margin: 20px 0;
        }
        .describe{
            background: #FFFFFF;
            padding-left: 26px;
            .text{
                padding-top: 36px;
                font-size:27px;
                color: #999999;
            }
            .open-time{
                padding: 54px 24px 30px 0;
                border-bottom:1px solid #e7e7e7;
                position: relative;
                @extend %flex;
                .name{
                    font-size:30px;
                    color:#000000;
                    flex: 0 0 160px;
                }
                .file{
                    flex: auto;
                    opacity: 1;
                    position: static;
                    @extend %flex;
                    .file_name{
                        display: inline-block;
                        flex: auto;
                        text-align: right;
                        font-size:30px;
                        color: #999999;
                    }
                    .choose{
                        color: #4A4A4A;
                    }
                    input[type=text]{
                        height: 60px;
                        line-height: 60px;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                        border: none;
                        text-align: right;
                        font-size:27px;
                        color: #4A4A4A;
                        flex: auto;
                        outline: none;
                    }
                    .right{
                        margin-left: 14px;
                    }
                }
            }
            .venue-describe{
                padding-right: 24px;
                position: relative;
                .describe-text{
                    font-size:30px;
                    color: #000000;
                    padding: 34px 0 16px 0;
                }
                textarea{
                    height: 210px;
                    width: 100%;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    resize: none;
                    outline: none;
                    border: none;
                    font-size: 30px;
                    color: #4A4A4A;
                }
                .text-no{
                    font-size:24px;
                    color:#999999;
                    position: absolute;
                    bottom: 18px;
                    right: 26px;
                }
            }
        }
        .submit-create{
            margin: 40px 18px;
            height:85px;
            background:#b3b3b3;
            border-radius:7px;
            font-size:33px;
            font-family:PingFangSC-Semibold;
            color: #ffffff;
            text-align: center;
            line-height: 85px;
        }
        .active{
            background:linear-gradient(-126.9deg,rgba(229,0,17,1),rgba(246,55,98,1));
            box-shadow:0px 4px 14px 0px rgba(229,0,17,0.35);
        }
        .time-model{
            background: #f0f0f0;
            position: fixed;
            width: 100%;
            height: 100%;
            overflow: scroll;
            top: 0;
            left: 0;
            z-index: 150;
            .chooseDay{
                background: #FFFFFF;
                margin-top: 20px;
            }
            .time-submit{
                margin: 40px 18px;
                height: 85px;
                line-height: 85px;
                text-align: center;
                background:linear-gradient(-126.9deg,rgba(229,0,17,1),rgba(246,55,98,1));
                box-shadow:0px 4px 10px 0px rgba(229,0,17,0.4);
                border-radius:4px;
                font-size:33px;
                font-family:PingFangSC-Semibold;
                color:rgba(255,255,255,1)
            }
        }
    }
</style>
