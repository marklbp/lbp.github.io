<template lang="html">
    <div class="search">
       <div class="search-input search-focus">
           <span class="icon-flag"></span>
           <input type="text" class="focus" @focus="handleinput()" placeholder="按场馆名搜索" v-model="searchName"/>
           <span @click="search()" v-if="searchButton" class="button">搜索</span>
       </div>
       <div class="search-area">
           <div class="box" @click="area('1')"><span class="box-show">{{cityName}}</span><span :class="{'drop-down':down1 , 'drop-up':!down1}"></span></div>
           <div class="box" @click="area('2')"><span class="box-show">{{typeName}}</span><span :class="{'drop-down':down2 , 'drop-up':!down2}"></span></div>
           <div class="box" @click="area('3')"><span class="box-show">{{scopeName}}</span><span :class="{'drop-down':down3, 'drop-up':!down3}"></span></div>
       </div>
       <div class="model" v-if="!down1||!down2||!down3" @click="init()">
           <div class="body" v-if="bodyFlag1" @click="show($event)">
               <div v-for="(item,index) in searchContent.districtList" :key="index" @click ="screening('city',item.districtCode,item.name)" :class="{'on':cityCode==item.districtCode}">{{item.name}}</div>
           </div>
           <div class="body" v-if="bodyFlag2" @click="show($event)">
               <div @click ="screening('type','-1','全部类型')" :class="{'on':typeCode== '-1'}">全部类型</div>
               <div v-for="(item,index) in searchContent.categoryList" :key="index" @click ="screening('type',item.categoryId,item.categoryName)" :class="{'on':typeCode==item.categoryId}">{{item.categoryName}}</div>
           </div>
           <div class="body" v-if="bodyFlag3" @click="show($event)">
               <div @click ="screening('scope','1','距离最近')" :class="{'on':scopeCode=='1'}">距离最近</div>
               <div @click ="screening('scope','2','价格最低')" :class="{'on':scopeCode=='2'}">价格最低</div>
               <div @click ="screening('scope','3','价格最高')" :class="{'on':scopeCode=='3'}">价格最高</div>
           </div>
       </div>
       <div class="model-search" v-if="searchButton" @click="handleinput()" @touchmove.prevent>
           <div class="body" @click="show($event)" v-if="searchBody">
               <div class="search-text">最近搜索</div>
               <div class="recent-search">
                   <div class="recent-body" v-for="(item,index) in searchBody" @click="recentSearch(item)" :key="index">{{item}}</div>
               </div>
           </div>
       </div>
    </div>
</template>
<script>
// import { get, post } from '@/services/request.js'

export default {
  name: 'search',
  data () {
    return {
      searchBody: [],
      searchName: '',
      down1: true,
      down2: true,
      down3: true,
      cityCode: '',
      typeCode: '',
      scopeCode: '',
      bodyFlag1: false,
      bodyFlag2: false,
      bodyFlag3: false,
      cityName: '',
      typeName: '',
      scopeName: '',
      always: true,
      searchList: false,
      searchButton: false,
      hidden: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.init()
    }, 500)
  },
  props: ['catchData', 'searchContent', 'paramCategoryId', 'hide'],
  methods: {
    init () {
      if (this.paramCategoryId > -1) {
        this.typeCode = this.paramCategoryId
        this.searchContent.categoryList.forEach(item => {
          if (this.typeCode === item.categoryId) {
            this.typeName = item.categoryName
          }
        })
      } else {
        this.typeName = '全部类型'
        this.typeCode = '-1'
      }
      this.cityName = '全部市区'
      this.scopeName = '距离最近'
      this.screen = false
      this.down1 = true
      this.down2 = true
      this.down3 = true
      this.bodyFlag1 = false
      this.bodyFlag2 = false
      this.bodyFlag3 = false
      this.cityCode = '-1'
      this.scopeCode = '1'
      this.hide(false)
    },
    show (event) {
      event.cancelBubble = true
    },
    area (index) {
      if (index === '1') {
        this.down1 = !this.down1
        this.down2 = true
        this.down3 = true
        this.bodyFlag1 = true
        this.bodyFlag2 = false
        this.bodyFlag3 = false
      } else if (index === '2') {
        this.down2 = !this.down2
        this.down1 = true
        this.down3 = true
        this.bodyFlag1 = false
        this.bodyFlag2 = true
        this.bodyFlag3 = false
      } else if (index === '3') {
        this.down3 = !this.down3
        this.down1 = true
        this.down2 = true
        this.bodyFlag1 = false
        this.bodyFlag2 = false
        this.bodyFlag3 = true
      }
      if (this.down1 && this.down2 && this.down3) {
        this.hide(false)
      } else {
        this.hide(true)
      }
    },
    handleinput () {
      this.searchButton = true
      this.searchBody = this.changeArray()
      this.init()
      this.hookBack('1')
      this.catchData('搜索场馆', 'searchTitle')
    },
    hookBack (index) {
      window.yhyBridge.ready().then(back => {
        back.register('common.h5goBack', (data, callback) => {
          if (index === '1') {
            this.searchName = ''
            document.activeElement.blur()
            this.searchButton = false
            this.catchData('场馆列表', 'searchTitle')
            this.hookBack('2')
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
    screening (screen, index, name) {
      if (screen === 'city') {
        this.cityCode = index
        this.cityName = name
      } else if (screen === 'type') {
        this.typeCode = index
        this.typeName = name
      } else if (screen === 'scope') {
        this.scopeCode = index
        this.scopeName = name
      }
      this.down1 = true
      this.down2 = true
      this.down3 = true
      var json = {
        'cityCode': this.cityCode,
        'typeCode': this.typeCode,
        'scopeCode': this.scopeCode
      }
      this.catchData(json, 'screening')
    },
    search () {
      var name = this.searchName + ',' + localStorage.getItem('searchBody')
      if (this.searchName) {
        if (!localStorage.getItem('searchBody')) {
          localStorage.setItem('searchBody', this.searchName + ',')
        } else if (localStorage.getItem('searchBody').indexOf(this.searchName.replace(/(^\s*)|(\s*$)/g, '').replace(/\s/g, '')) === -1) {
          if (this.searchBody.length < 30) {
            localStorage.setItem('searchBody', name)
          } else {
            var array = this.changeArray()
            array.splice(29, 1)
            localStorage.setItem('searchBody', this.searchName + ',' + array.join(',') + ',')
          }
        }
      }
      this.hookBack('2')
      this.searchButton = false
      this.catchData(this.searchName, 'search')
      this.catchData('场馆列表', 'searchTitle')
      this.searchName = ''
    },
    changeArray () {
      let searchBody = localStorage.getItem('searchBody')
      if (searchBody) {
        searchBody = searchBody.substring(0, searchBody.length - 1)
        return searchBody.split(',')
      }
    },
    recentSearch (item) {
      this.searchButton = false
      this.catchData('场馆列表', 'searchTitle')
      this.catchData(item, 'search')
    }
  }
}
</script>

<style lang="scss">
  @import "../common/common";
  %drop {
      display: inline-block;
      width: 12px;
      height: 8px;
      position: absolute;
      right: 40px;
      bottom: 15px;
  }
  .search{
    position: fixed;
    top: 0;
    background: #FFFFFF;
    width: 100%;
    z-index: 10;
    box-sizing: border-box;
    .search-focus{
      padding:10px 28px 10px 28px !important;
    }
    .search-input{
      position: relative;
      padding:10px 75px 10px 75px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-flag{
          display: inline-block;
          background: url("../assets/search.png")no-repeat 100% 100%;
          width: 28px;
          height: 28px;
          background-size: 100% 100%;
          position: absolute;
          top: 28px;
          left: 50px;
      }
      input[type=text]{
        outline: none;
        font-family: PingFangSC-Regular;
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
      .button{
          display: inline-block;
          height:64px;
          line-height: 64px;
          width: 70px;
          font-size:32px;
          font-family:PingFangSC-Semibold;
          color: #4A4A4A;
          margin-left: 18px;
      }
    }
    .search-area{
      display: flex;
      align-items: center;
      height: 80px;
      border-bottom: 1px solid #f4f4f4;
      .box{
        box-sizing: border-box;
        width: 33.3%;
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-right: 1px solid #eeeeee;
        font-size: 28px;
        color: #4A4A4A;
        position: relative;
        .box-show{
            display: inline-block;
            width: 120px;
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
      .box:nth-child(3){
        border-right: none;
      }
    }
    .model{
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
        top: 168px;
        background: rgba(0,0,0,0.5);
        box-sizing: border-box;
        z-index: 100;
        .body{
            position: absolute;
            max-height: 912px;
            overflow: auto;
            width: 100%;
            background: #FFFFFF;
            >div{
                height: 98px;
                line-height: 98px;
                padding-left: 48px;
                border-bottom:1px solid #DDDDDD;
                font-size:30px;
                font-family:PingFangSC-Regular;
                color:#4A4A4A;
            }
            >div:nth-last-child(1){
                border-bottom: none;
            }
            .on{
                color: #FF4901;
            }
        }
    }
    .model-search{
        position: fixed;
        z-index: 30;
        top: 85px;
        left: 0;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        background: #f0f0f0;
        .body{
            background: #FFFFFF;
            position: absolute;
            padding: 26px;
            width: 100%;
            .search-text{
                font-size:26px;
                font-family:PingFangSC-Regular;
                color: #999999;
                margin-bottom: 20px;
            }
            .recent-search{
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                padding-right: 28px;
                .recent-body{
                    padding: 10px;
                    background:#f4f4f4;
                    font-size:24px;
                    font-family:PingFangSC-Regular;
                    color: #a4a4a4;
                    margin-bottom: 20px;
                    margin-right: 16px;
                }
            }
        }
    }
  }

</style>
