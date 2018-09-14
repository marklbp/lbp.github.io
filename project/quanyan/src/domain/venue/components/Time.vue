<template lang="html">
    <div class="oepnTime">
        <div class="file-content">
            <div class="name">{{timeText}}</div>
            <div class="file">
                <input type="text" placeholder="点击选择" v-model="openTime" readonly @click="chooseOpenTime()"/>
                <span class="right"></span>
            </div>
        </div>
        <md-date-picker
                ref="startPicker"
                v-model="startTimeFlag"
                type="time"
                :default-date="startDate"
                :unit-text="['', '', '', '点', '分']"
                @confirm="startTimeConfirm"
                ok-text="下一步"
                title="开馆时间"
        ></md-date-picker>
        <md-date-picker
                ref="endPicker"
                v-model="endTimeFlag"
                type="time"
                :unit-text="['', '', '', '点', '分']"
                :default-date="endDate"
                @confirm="endTimeConfirm"
                title="闭馆时间"
        ></md-date-picker>
    </div>
</template>
<script>
import {DatePicker} from 'mand-mobile'
import Vue from 'vue'
Vue.component(DatePicker.name, DatePicker)
export default {
  name: 'oepnTime',
  data () {
    return {
      timeText: '',
      index: 0,
      openTime: '',
      startDate: new Date(),
      endDate: new Date(),
      startTimeFlag: false,
      endTimeFlag: false,
      time: ''
    }
  },
  components: {
    [DatePicker.name]: DatePicker
  },
  props: ['chooseTime', 'addTimeNo'],
  mounted () {
    this.timeText = '营业时段' + (this.addTimeNo + 1).toString()
    this.index = this.addTimeNo
  },
  methods: {
    chooseOpenTime () {
      document.activeElement.blur()
      this.startTimeFlag = true
    },
    startTimeConfirm () {
      const values = this.$refs.startPicker.getColumnValues()
      this.time = this.conversionTime(values)
      this.endTimeFlag = true
    },
    endTimeConfirm () {
      const values = this.$refs.endPicker.getColumnValues()
      this.openTime = this.time + '-' + this.conversionTime(values)
      this.chooseTime(this.openTime)
    },
    conversionTime (values) {
      var hour = ''
      var minute = ''
      if (values[0].text.length === 2) {
        hour = '0' + values[0].text
      } else {
        hour = values[0].text
      }
      if (values[1].text.length === 2) {
        minute = '0' + values[1].text
      } else {
        minute = values[1].text
      }
      var startTime = hour.substring(0, hour.length - 1) + ':' + minute.substring(0, minute.length - 1)
      return startTime
    }
  }
}
</script>

<style lang="scss">
    @import "../common/common";
    .oepnTime{
        background: #FFFFFF;
        box-sizing: border-box;
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
        }
    }
</style>
