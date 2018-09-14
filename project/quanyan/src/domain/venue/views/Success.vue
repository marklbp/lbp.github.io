<template lang="html">
    <div class="success">
        <div class="booking-right"></div>
        <div class="booking-text">
            <div class="right-text">申请成功</div>
            <div>我们将尽快完成审核，感谢您的加入！</div>
        </div>
        <div class="complete" @click="complete()">完成</div>
    </div>
</template>
<script>
import {closeWebview} from '../../../services/native'
import Utils from '../utils'
Utils.setTitle('申请成功')
export default {
  ame: 'success',
  mounted () {
    Utils.back(_ => history.go(-1))
  },
  methods: {
    complete () {
      closeWebview()
    }
  }
}
</script>

<style lang="scss">
    /*@import "../common/common";*/
    .success{
        background: #ffffff;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin-bottom: 60px;
        overflow: hidden;
        .booking-right{
            width: 120px;
            height: 120px;
            margin: 160px auto 0 auto;
            background: url("../assets/booking-right.png")no-repeat 100% 100%;
            background-size: 100% 100%;
        }
        .booking-text{
            width: 100%;
            font-size:28px;
            font-family:PingFangSC-Medium;
            padding: 30px 0 63px 0;
            color: #999999;
            div{
                text-align: center;
            }
            .right-text{
                font-size:45px;
                font-family:PingFangSC-Medium;
                color: #333333;
                padding-bottom: 29px;
            }
        }
        .complete{
            width: 240px;
            height: 80px;
            border-radius:4px;
            border:2px solid rgba(224,224,224,1);
            text-align: center;
            line-height: 80px;
            margin: 0 auto;
            font-size:32px;
            font-family:PingFangSC-Regular;
            color:rgba(230,69,69,1);
        }
    }
</style>
