<template lang="html">
    <transition name="slide">
        <div class="chooseCity" :class="{'hide':hidden}">
            <div class="first-code">
                <div class="text">热门</div>
                <div v-for="(item, index) in data" :key="index" :class="{'focus': codeName == item.code}" @click="chooseCode(item.code)">{{item.code}}</div>
            </div>
            <div class="search-input">
                <span class="icon-flag"></span>
                <input type="text" class="focus" placeholder="城市名、拼音首字母..." v-model="searchName"/>
            </div>
            <div class="position-city" @click="chooseCity(position.cityCode, position.name)">
                <div class="border"></div>
                <span>{{position.name}}</span>GPS定位
            </div>
            <div class="fast-choose">
                <div class="choose-city" v-if="historyCity.length>0">
                    <span class="text">历史访问城市</span>
                    <div class="city">
                        <div class="fast" v-for="(item, index) in historyCity" :key="index" @click="chooseCity(item.cityCode, item.name)">
                            <div>{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="choose-city">
                    <span class="text">国内热门城市</span>
                    <div class="city">
                        <div class="fast" v-for="(item, index) in hotCity" :key="index" @click="chooseCity(item.cityCode, item.name)">
                            <div>{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list">
                <div v-for="(item, index) in data" :id="item.code" :key="index">
                    <div class="code" :id="item.code + '1'">{{item.code}}</div>
                    <div class="city-list">
                        <div class="name" @click="chooseCity(value.cityCode, value.name)" v-for="(value, key) in item.children" :key="key">{{value.name}}</div>
                    </div>
                </div>
            </div>
            <div class="search-model" v-if="searchModel">
                <div class="body">
                    <div v-for="(item, index) in searchData" :key="index" @click="chooseCity(item.cityCode, item.name)">{{item.name}}</div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
  name: 'chooseCity',
  data () {
    return {
      lat: null,
      lng: null,
      searchName: '',
      codeName: '',
      historyCity: [],
      searchData: [],
      searchModel: false,
      hidden: false
    }
  },
  watch: {
    'searchName': 'searchCityList'
  },
  props: ['catchData', 'data', 'position', 'hotCity'],
  mounted () {
    document.title = '选择城市'
    this.historyCityIndex()
  },
  methods: {
    searchCityList () {
      var cityData = this.data
      this.searchData = []
      if (this.searchName) {
        var searchName = this.searchName.toLocaleUpperCase()
        cityData.forEach(item => {
          item.children.forEach(value => {
            if (value.simpleCode.indexOf(searchName) > -1 || value.name.indexOf(this.searchName) > -1) {
              this.searchData.push(value)
            }
          })
        })
        this.searchModel = true
        this.hidden = true
      } else {
        this.searchModel = false
        this.hidden = false
      }
    },
    chooseCode (code) {
      this.codeName = code
      var top = document.getElementById(code + '1').offsetHeight
      console.log(top)
      document.documentElement.scrollTop = document.getElementById(code).offsetTop - top * 2 - 10
    },
    chooseCity (code, name) {
      var cityString = code + ':' + name + ',' + localStorage.getItem('historyCity')
      if (!localStorage.getItem('historyCity')) {
        localStorage.setItem('historyCity', code + ':' + name + ',')
      } else if (localStorage.getItem('historyCity').indexOf(code) === -1) {
        if (this.historyCity.length < 3) {
          localStorage.setItem('historyCity', cityString)
        } else {
          var array = localStorage.getItem('historyCity').split(',')
          array.splice(2, 1)
          localStorage.setItem('historyCity', code + ':' + name + ',' + array.join(','))
        }
      }
      this.historyCityIndex()
      this.searchName = ''
      this.catchData(code, name)
    },
    historyCityIndex () {
      this.historyCity = []
      if (localStorage.getItem('historyCity')) {
        var array = localStorage.getItem('historyCity').split(',')
        array.forEach(item => {
          var city = item.split(':')
          this.historyCity.push({
            'cityCode': city[0],
            'name': city[1]
          })
        })
        this.historyCity.splice(this.historyCity.length - 1, 1)
      }
    }
  }
}
</script>

<style lang="scss">
    .slide-enter-active {
        animation: slide-in .3s ease;
    }

    .slide-leave-active {
        animation: slide-out .3s ease;
    }

    @keyframes slide-in {
        0% {
            transform: translate3d(0, 100%, 0);
        }
        100% {
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes slide-out {
        0% {
            transform: translate3d(0, 0%, 0);
        }
        100% {
            transform: translate3d(0, 100%, 0);
        }
    }
    .hide{
        position: fixed;
        overflow: hidden;
    }
    .border{
        height: 1px;
        background: #f0f0f0;
        transform: scaleY(0.5);
        width: 100%;
    }
    .chooseCity{
        background: #ffffff;
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
        font-family:PingFangSC-Regular;
        .first-code{
            position: fixed;
            top: 216px;
            right: 25px;
            width: 44px;
            font-size:22px;
            color:rgba(153,153,153,1);
            .text{
                width: 60px;
                left: 0px;
            }
            div{
                width:32px;
                height:32px;
                text-align: center;
                line-height: 32px;
                margin-bottom: 12px;
                position: relative;
                left: 14px;
            }
            .focus {
                background:rgba(229,0,17,1);
                border-radius: 100px;
                line-height: 32px;
                color: #ffffff;
            }
        }
        .search-input{
            position: fixed;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #FFFFFF;
            .icon-flag{
                display: inline-block;
                background: url("../domain/venue/assets/search.png")no-repeat 100% 100%;
                width: 28px;
                height: 28px;
                background-size: 100% 100%;
                position: absolute;
                top: 28px;
                left: 50px;
            }
            input[type=text]{
                margin:10px 28px 10px 28px;
                outline: none;
                font-size: 28px;
                color: #4A4A4A;
                flex: 0 0 100%;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                border: none;
                background: #F0F0F0;
                border-radius: 0px;
                height: 64px;
                text-align: center;
                line-height: 66px;
            }
            .focus{
                flex:1 1 auto !important;
                text-align: left !important;
                text-indent: 60px;
            }
        }
        .position-city{
            position: fixed;
            height: 100px;
            width: 100%;
            top: 84px;
            background: #FFFFFF;
            line-height: 100px;
            font-size:30px;
            color:rgba(153,153,153,1);
            span{
                padding-left: 48px;
                font-size:32px;
                font-family:PingFangSC-Semibold;
                color:rgba(74,74,74,1);
                margin-right: 16px;
            }
        }
        .fast-choose{
            padding:184px 68px 0 50px;
            background: #f0f0f0;
            font-size:30px;
            color:rgba(74,74,74,1);
            .choose-city{
                .text{
                    display: inline-block;
                    font-size:28px;
                    color:rgba(153,153,153,1);
                    margin: 20px 0 15px 0;
                }
                .city{
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    .fast{
                        box-sizing: border-box;
                        margin-bottom: 16px;
                        width: 33%;
                        height: 64px;
                        padding-right: 10px;
                        div{
                            background: #FFFFFF;
                            border-radius:4px;
                            border:1px solid rgba(224,224,224,1);
                            text-align: center;
                            line-height: 64px;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            white-space:nowrap;
                        }
                    }
                }
            }
        }
        .list{
            .code {
                padding-left: 50px;
                background: #f0f0f0;
                height: 80px;
                line-height: 80px;
            }
            .city-list{
                background: #FFFFFF;
                .name{
                    height: 80px;
                    line-height: 80px;
                    font-size:30px;
                    margin: 0 30px 0 50px;
                    border-bottom:1px solid rgba(221,221,221,1)
                }
                .name:last-child{
                    border-bottom: none;
                }
            }
        }
        .search-model{
            position: fixed;
            top: 85px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            background: rgba(0,0,0,0.5);
            z-index: 100;
            .body{
                overflow: scroll;
                max-height: 800px;
                background: #FFFFFF;
                div{
                    height: 80px;
                    line-height: 80px;
                    font-size:30px;
                    padding-left: 50px;
                    border-bottom:1px solid rgba(221,221,221,1)
                }
            }
        }
    }
</style>
