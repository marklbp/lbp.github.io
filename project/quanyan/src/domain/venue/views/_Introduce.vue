<template lang="html">
    <div class="introduce">
        <img src="../assets/guide1.jpg">
        <img class="margin" src="../assets/guide2.jpg">
        <img src="../assets/guide3.jpg">
        <img src="../assets/guide4.jpg">
        <router-link class="create-venue" :to="{path: `/claim`}"><div>我有场馆，立即入驻</div></router-link>
    </div>
</template>
<script>
export default {
  name: 'introduce',
  data () {
    return {}
  },
  mounted () {
    window.scrollTo(0, 0)
    window.yhyBridge.ready().then(sdk => {
      sdk.callHandler('setNativeTitle', {
        title: '场馆合作'
      }).then(data => {

      }).catch(err => {
        console.log(err)
      })
    }).catch(function (err) {
      console.log(err)
    })
    this.back()
  },
  methods: {
    back () {
      window.yhyBridge.ready().then(back => {
        back.register('common.h5goBack', (data, callback) => {
          history.go(-1)
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
    }
  }
}
</script>

<style lang="scss">
    /*@import "../common/common";*/
    .introduce{
        background: #ffffff;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin-bottom: 60px;
        padding-bottom: 120px;
        overflow: hidden;
        img{
            width: 100%;
            height: auto;
        }
        .create-venue{
            position: fixed;
            bottom: 0;
            display: inline-block;
            text-decoration: none;
            width: 100%;
            div{
                margin: 18px;
                background:linear-gradient(-126.9deg,#E50011,#F63762);
                box-shadow:0px 4px 10px 0px rgba(229,0,17,0.4);
                border-radius:4px;
                font-size:33px;
                font-family:PingFangSC-Semibold;
                color: #ffffff;
                text-align: center;
                height:85px;
                line-height: 85px;
            }
        }
    }
</style>
