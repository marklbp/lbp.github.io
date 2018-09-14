<template lang="html">
  <div class="lottery-home-page overflow-y">
    <div class="banner-contain">
      <md-swiper
              ref="swiper">
        <md-swiper-item :key="$index" v-for="(item, $index) in 3">
          <img class="banner-image" src=""/>
        </md-swiper-item>
      </md-swiper>
    </div>
    <div class="lottery-type-entrance-contain bg-white">
      <div class="flex-b">
        <div class="entrance-item flex-wa-yc" v-for="(entrnce,index) in entranceList" :key="index">
          <img />
          <p class="text-center f-24">{{entrnce.name}}</p>
        </div>
      </div>
    </div>
    <div class="notice-news-contain margin-t-1 padding-lr-30 bg-white center-flex-v">
      <img  class="small-icon"/>
      <marquee class="roll-text f-24" direction="left" behavior="scroll" scrollamount="5">
        <span>阿萨德科技爱神的箭凯撒即可大街上客户达科技<span class="c-l1">123123</span></span>
      </marquee>
    </div>
    <div class="today-hot-match-contain margin-t-20 bg-white padding-lr-30">
      <p class="title f-28 f-b">当日热点赛事</p>
      <div class="match-list">
        <div class="match-item shadow-16" v-for="(item,index) in 2" :key="index">
          <div class="top-line"></div>
          <div class="match-type center-flex">
            <div class="center-flex-v">
              <img class="type-icon"/>
              <span class="c-l1 f-26">足球</span>
            </div>
          </div>
          <div class="match-content hairline--top">
            <div class="padding-lr-30">
              <div class="match-info-text flex-b f-26">
                <div class="left">
                  <span class="day">周六008日职</span>
                  <span class="round"> 第13轮</span>
                </div>
                <div class="right">长期樱花<span>vs</span>大阪航海</div>
              </div>
              <div class="match-info-detail flex">
                <div class="win center-flex">主胜 1.5</div>
                <div class="vs center-flex">平 3.45</div>
                <div class="fail center-flex">负 5.62</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="award-info-contain margin-t-20 flex bg-white padding-lr-30 padding-tb-30">
      <div class="left">
        <div class="center-flex-v award-logo hairline--right"><img src="" class=""/></div>
      </div>
      <div class="right center-flex-b">
        <div class="info center-flex-b f-26">
          <div class="left-team flex-wa-yc">
            <img src=""/>
            <p class="text-center">皇家马德里</p>
          </div>
          <div class="vs-text">
            <span>2 : 2</span>
          </div>
          <div class="right-team flex-wa-yc">
            <img src=""/>
            <p class="text-center">皇家马德里</p>
          </div>
        </div>
        <div class="right-link right-icon"></div>
      </div>
    </div>
    <div class="winning-list-contain margin-t-20 bg-white padding-lr-30">
      <p class="title f-28 font-weight-bold">中奖榜</p>
      <div class="winner-list">
        <div class="win center-flex-b shadow-16" v-for="index in 2" :key="index">
          <div class="left center-flex-b flex-full">
            <div class="type-text hairline--right">竞猜</div>
            <div class="winners flex flex-full">
              <img class="winner-logo cycle-icon"/>
            </div>
          </div>
          <div class="right f-26">更多</div>
        </div>
      </div>
    </div>
    <div class="latest-explosion-contain margin-t-20 bg-white">
      <p class="title f-28 font-weight-bold hairline--bottom">最新爆料</p>
      <div class="explosion-list">
        <div class="explosion center-flex-b hairline--bottom" v-for="(explosion,index) in 4" :key="index">
          <div class="flex-full column-flex-b explosion-text">
            <p class="ellipsis2 f-26">按属地阿斯蒂阿金斯欧戴斯对爱USD欧艾斯藕带实地拉斯断丝UIuaiosduioasudioa</p>
            <div class="flex-b">
              <p class="author f-22 c-9">中呗</p>
              <p class="time f-22 c-9">12-05 12:23</p>
            </div>
          </div>
          <img class="explosion-icon"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from 'mand-mobile'
export default {
  components: {
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem
  },
  name: 'Index',
  data () {
    return {
      entranceList: [
        {name: '竞猜足球'},
        {name: '竞猜足球'},
        {name: '竞猜足球'}
      ]
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
  .shadow-16{
    box-shadow: 0px 0px 16px #acacac;
  }
  .padding-lr-30{
    padding-right: 30px;
    padding-left: 30px;
  }
  .padding-tb-30{
    padding-top: 30px;
    padding-bottom: 30px;
  }
  $hairline-color:#e8e8e8;
  .hairline--top{
    position: relative;
    @include hairline-top($hairline-color)
  }
  .hairline--bottom{
    position: relative;
    @include hairline-bottom($hairline-color)
  }
  .hairline--right{
    position: relative;
    @include hairline-right($hairline-color);
  }
  .lottery-home-page{
    height: 100%;
    width: 100%;
    min-height: 100vh;
    padding-bottom: 200px;
  }
  .margin-t-1{
      margin-top: 1px;
  }
  .cycle-icon{
    border-radius: 100%;
  }
  .banner-contain{
    height: 300px;
    .banner-image{
      height: 100%;
      width: 100%;
    }
  }
  .lottery-type-entrance-contain{
    padding: 20px 60px;
  }
  .entrance-item{
    width: 100px;
    margin-top: 10px;
    img{
      height: 100px;
      width: 100px;
      border-radius: 50%;
      background: #dddddd;
    }
  }
  .notice-news-contain{
    padding: 20px 30px;
    .small-icon{
      height: 30px;
      width: 40px;
      margin-right: 30px;
    }
    .roll-text{
      width: 400px;
    }
  }
  .today-hot-match-contain{
    padding: 30px;
    .title{
    }
    .match-item{
        margin-top: 30px;
        border-radius: 6px;
    }
    .top-line{
      height: 4px;
      background-color: #e55015;
    }
    .match-type{
      padding: 20px 0px;
    }
    .type-icon{
      height: 40px;
      width: 40px;
    }
    .match-content{
      padding: 30px 0px;
    }
    .match-info-text{
      padding: 20px 0px;
    }
  }
  .match-info-detail{
    text-align: center;
    .win,.vs,.fail{
      flex: 1;
      background-color: #dddddd;
      height: 50px;
    }
    .vs{
      margin: 0px 2px;
    }
  }
  .award-info-contain{
    .left{
      width: 150px;
      .award-logo{
      }
      img{
        height: 120px;
        width: 120px;
      }
    }
    .right{
      flex: 1;
      padding-left: 30px;
      .info{
        flex: 1;
        margin-right: 20px;
      }
      img{
        height: 60px;
        width: 60px;
      }
    }
  }
  .winning-list-contain{
    padding-bottom: 40px;
    .title{
      padding: 20px 0px;
    }
  }
  .win{
    padding: 20px 30px;
    margin-bottom: 30px;
    .type-text{
      padding-right: 30px;
    }
    .winners{
      img{
        margin-left: 30px;
        height: 60px;
        width: 60px;
      }
    }
  }
  .latest-explosion-contain{
    .title{
      padding: 30px;
    }
    .explosion-list{
      padding: 0px 30px;
      padding-bottom:40px;
    }
    .explosion{
      height: 220px;
      padding: 24px 0px;
    }
    .explosion-text{
      height: 100%;
    }
    .explosion-icon{
      margin-left: 30px;
      width: 220px;
      height: 160px;
    }
  }

</style>
