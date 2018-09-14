<template lang="html">
    <div class="day">
        <div class="title">
            <div class="name">{{dayText}}</div>
            <div class="delete" @click="deleteTime(index)">删除</div>
        </div>
        <div class="chooseTime">
            <div class="file-content">
                <div class="name">营业日</div>
                <div class="file">
                    <input type="text" placeholder="点击选择" v-model="openDay" readonly @click="chooseDay()"/>
                    <span class="right"></span>
                </div>
            </div>
            <div :is="item.component" v-for="item in timeList" :chooseTime="chooseTime" :addTimeNo="addTimeNo"></div>
            <div class="file-content border">
                <div class="addTime" @click="addTime('openTime')">+添加营业时段</div>
            </div>
        </div>
        <div class="week-model" v-if="chooseWeekFlag">
            <div class="body">
                <div class="title">
                    <div class="cancel" @click="cancel()">取消</div>
                    <div class="title-text">选择营业日</div>
                    <div class="ok" @click="ok()">确定</div>
                </div>
                <div class="weekday">
                    <div><input type="checkbox" v-model="monday" id="check1"><label for="check1">周一</label></div>
                    <div><input type="checkbox" v-model="tuesday" id="check2"><label for="check2">周二</label></div>
                    <div><input type="checkbox" v-model="wednesday" id="check3"><label for="check3">周三</label></div>
                    <div><input type="checkbox" v-model="thursday" id="check4"><label for="check4">周四</label></div>
                    <div><input type="checkbox" v-model="friday" id="check5"><label for="check5">周五</label></div>
                    <div><input type="checkbox" v-model="saturday" id="check6"><label for="check6">周六</label></div>
                    <div><input type="checkbox" v-model="sunday" id="check7"><label for="check7">周日</label></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import OpenTime from './Time.vue'
import {Picker} from 'mand-mobile'
import Vue from 'vue'
Vue.component(Picker.name, Picker)
export default {
  name: 'day',
  data () {
    return {
      timeList: [{
        'component': 'openTime'
      }],
      dayText: '',
      index: 0,
      addTimeNo: 0,
      openDay: '',
      openChooseTime: '',
      openChooseWeekday: '',
      chooseWeekFlag: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    }
  },
  components: {
    [Picker.name]: Picker,
    openTime: OpenTime
  },
  props: ['venueOpenTime', 'addDayValue', 'addNo'],
  mounted () {
    this.dayText = '营业时间' + (this.addNo + 1).toString()
    this.index = this.addNo
  },
  methods: {
    chooseDay () {
      document.activeElement.blur()
      this.chooseWeekFlag = true
    },
    cancel () {
      this.chooseWeekFlag = false
    },
    ok () {
      this.openChooseWeekday = ''
      if (this.monday) {
        this.openChooseWeekday = this.openChooseWeekday + '周一,'
      }
      if (this.tuesday) {
        this.openChooseWeekday = this.openChooseWeekday + '周二,'
      }
      if (this.wednesday) {
        this.openChooseWeekday = this.openChooseWeekday + '周三,'
      }
      if (this.thursday) {
        this.openChooseWeekday = this.openChooseWeekday + '周四,'
      }
      if (this.friday) {
        this.openChooseWeekday = this.openChooseWeekday + '周五,'
      }
      if (this.saturday) {
        this.openChooseWeekday = this.openChooseWeekday + '周六,'
      }
      if (this.sunday) {
        this.openChooseWeekday = this.openChooseWeekday + '周日,'
      }
      this.openChooseWeekday = this.openChooseWeekday.substring(0, this.openChooseWeekday.length - 1)
      this.openDay = this.openChooseWeekday
      this.chooseWeekFlag = false
      this.check()
    },
    deleteTime (index) {
      this.addDayValue(index)
    },
    chooseTime (val) {
      this.openChooseTime = this.openChooseTime + val + ','
      this.check()
    },
    addTime (component) {
      this.timeList.push({
        'component': component
      })
      this.addTimeNo = this.addTimeNo + 1
    },
    check () {
      if (this.openChooseWeekday || this.openChooseTime) {
        this.venueOpenTime(this.openChooseWeekday, this.openChooseTime, this.addNo)
      }
    }
  }
}
</script>

<style lang="scss">
    @import "../common/common";
    .day{
        background: #f0f0f0;
        box-sizing: border-box;
        font-family:PingFangSC-Regular;
        -webkit-overflow-scrolling: touch;
        .title{
            padding: 25px 34px 25px 20px;
            @extend %flex;
            .name{
                font-size:28px;
                color: #999999;
            }
            .delete{
                font-size:28px;
                color: #4A90E2;
            }
        }
        .chooseTime{
            background: #FFFFFF;
            .file-content{
                height: 122px;
                line-height: 122px;
                margin-left: 27px;
                position: relative;
                border-bottom:1px solid #e7e7e7;
                @extend %flex;
                .name{
                    font-size:30px;
                    color:#000000;
                    flex: 0 0 160px;
                }
                .file{
                    flex: auto;
                    padding-right: 32px;
                    @extend %flex;
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
                .addTime{
                    text-align: right;
                    font-size:30px;
                    color: #FF510C;
                    margin-right: 32px;
                    width: 100%;
                }
            }
            .border{
                border: none;
            }
        }
        .week-model{
            background: rgba(0,0,0,0.5);
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 150;
            .body{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 440px;
                background: #FFFFFF;
                .title{
                    padding: 0 40px;
                    height: 110px;
                    @extend %flex;
                    .cancel{
                        font-size:28px;
                        color: #666666;
                    }
                    .title-text{
                        font-size:28px;
                        font-family:PingFangSC-Medium;
                        color: #000000;
                    }
                    .ok{
                        font-size:28px;
                        color: #fc9153;
                    }
                }
                .weekday{
                    display: flex;
                    padding: 35px 48px;
                    align-items: center;
                    flex-wrap: wrap;
                    height: 200px;
                    div {
                        width: 25%;
                        box-sizing: border-box;
                        input[type=checkbox]{
                            display: none;
                        }
                        input[type=checkbox]+label{
                            display: inline-block;
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                        }
                        input[type=checkbox]+label{
                            border:1px solid #E0E0E0;
                            display: inline-block;
                            width: 132px;
                            height: 64px;
                            line-height: 64px;
                            text-align: center;
                            background: #fff;
                            font-size:36px;
                            color: #000000;
                            vertical-align: middle;
                        }
                        input[type=checkbox]:checked +label{
                            border:1px solid #EA2938;
                            background-color: #EA2938;
                            color: #FFFFFF;
                        }
                    }
                }
            }
        }
    }
</style>
