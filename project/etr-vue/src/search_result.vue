<template>
    <div class="page-search-result">
      <div class="fixed-top">
        <search class="search" v-model="searchVal" @clear="clearSearch" />
        <span class="btn-search" @click="searchFn">搜索</span>
      </div>
      <div class="search-result">
        <div class="search-conditions">
          <div class="hot">
            <div class="tit">
              <img src="./assets/img/rd-rect.png">热门搜索
            </div>
            <div class="list" @click="selectSearch">
              <span v-for="(r, i) in hots" :class="r.class" :key="i">{{r.text}}</span>
            </div>
          </div>
          <div class="recent">
            <div class="tit">
              <img src="./assets/img/rd-rect.png">搜索记录
              <span class="btn-empty" @click="clearRecords"><Font style="font-size: .28rem; margin-right: .08rem;" icon="trash-alt" />清空</span>
            </div>
            <div class="list" @click="selectSearch">
              <span v-for="(r, i) in records" :class="r.class" :key="i">{{r.text}}</span>
            </div>
          </div>
        </div>
        <div class="search-list">
          <md-tab-bar :titles="tabNavs" :ink-bar-length="20" @indexChanged="tabFn"></md-tab-bar>
          <div class="tab-contents">
            <div class="tab-pane" style="font-size: .28rem; text-align: center;" v-for="(nav, i) in tabNavs" :key="i" v-show="i === activeIndex">{{nav}}</div>
          </div>
        </div>
        <div class="search-default">
          <img src="./assets/img/icon-search.png">
          <span>没有找到匹配结果<br><br>换个关键词试试</span>
        </div>
      </div>
    </div>
</template>

<script>
  // in ES6 modules
  import {TabBar} from 'mand-mobile'
  import Search from './search'
  import Font from './components/font'
  export default {
    name: 'search-result',
    components: {
      Search,
      [TabBar.name]: TabBar,
      Font,
    },
    data () {
      return {
        searchVal: '1234',
        tabNavs: ['项目', '资源', '人脉'],
        activeIndex: 0,
        hots: [
          {text: '媒体', class: ''}, 
          {text: '场地', class: ''}, 
          {text: '礼品', class: ''}, 
          {text: '广告', class: ''}, 
          {text: '流量', class: ''}
        ],
        records: [
          {text: '媒体', class: ''}, 
          {text: '场地', class: ''}, 
          {text: '礼品', class: ''}, 
          {text: '广告', class: ''}, 
          {text: '流量', class: ''}
        ]
      }
    },
    methods: {
      clearSearch () {
        console.log('重置搜索')
      },
      searchFn () {
        console.log('搜索词：',this.searchVal)
      },
      tabFn (index, prevIndex) {
        this.activeIndex = index
      },
      clearRecords () {
        this.records.splice(0, this.records.length)
      },
      selectSearch (e) {
        let target = e.target
        if (target.classList.contains('focus')) return
        let hot = this.hots.find(r => r.text === target.innerHTML)
        if (hot) {
          hot.class = 'focus'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fixed-top {
    padding: .14rem 0;
    background-color: #4B9EEA;
    .search {
      margin-left: .3rem;
      width: 78%;
    }
    .btn-search {
      position: absolute;
      right: .27rem;
      top: .14rem;
      width: .88rem;
      height: .58rem;
      line-height: .58rem;
      border: .01rem solid rgba(235,240,252,1);
      opacity: 0.4;
      border-radius: .1rem;
      font-size: .28rem;
      color: #fff;
      text-align: center;
    }
    .filter {
      position: absolute;
      top: .28rem;
      right: .36rem;
    }
  }
  .search-conditions {
    .hot, .recent {
      margin-bottom: .1rem;
      background-color: #fff;
      font-size: 24px;
      color: #999;
      .tit {
        padding: .225rem .28rem;
        border-bottom: .01rem solid #E5E5E5;
        font-size: .28rem;
        color: #333;
        img {
          width: .04rem;
          margin-right: .18rem;
          vertical-align: top;
        }
        .btn-empty {
          float: right;
          margin-top: 3px;
          font-size: 24px;
          color: #999;
        }
      }
      .list {
        padding: 0 27px 22px 11px;
        span {
          position: relative;
          background-color: #F8F8FA;
          text-align: center;
          width: 162px;
          height: 70px;
          line-height: 70px;
          float: left;
          margin-left: 16px;
          margin-top: 22px;
          overflow: hidden;
          &.focus{
            background:rgba(235,241,255,1);
            color: #436DF3;
            &:before {
              content: ' ';
              width: .52rem;
              height: .52rem;
              background-color: #436DF3;
              border-radius: .52rem;
              position: absolute;
              right: -.26rem;
              top: -.26rem;
            }
            &:after {
              content: ' ';
              width: .08rem;
              height: .16rem;
              position: absolute;
              right: .07rem;
              top: 0;
              border: .01rem solid #fff;
              transform: rotate(45deg);
              border-left: 0;
              border-top: 0;
            }
          }
        }
        &:after {
          content: '';
          display: block;
          clear: both;
        }
      }
    }
  }
  .search-default {
    padding-top: 174px;
    text-align: center;
    font-size: 28px;
    color: #999;
    img {display: block; width: 112px; margin:0 auto 96px;}
  }
</style>