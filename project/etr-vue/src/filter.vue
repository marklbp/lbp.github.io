<template>
  <div class="page-filter">
    <div class="btn-filter" @click="closeFilter = !closeFilter"><img src="./assets/img/filter.png">筛选</div>
    <div class="filter-container" :style="{'display': closeFilter && 'block' || 'none'}">
      <span class="btn-close" @click="closeFilter = !closeFilter">&times;</span>
      <div class="content" @click="parseFilter">
        <div class="item" v-for="(item, i) in items" :key="i">
          <div class="title">{{item.text}}</div>
          <div class="children">
            <span v-for="(it, j) in item.children" :data-key="i + ',' + j" :key="j" :class="{'focus': it.checked}">{{it.text}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'fitlerx',
    data () {
      return {
        closeFilter: false,
        filterParams: {},
        items: [
          {
            text: '区域',
            children: [
              {id: -1, text: '不限', checked: false}, 
              {id: 0, text: '区1111', checked: false},
              {id: 1, text: '区22', checked: false},
              {id: 2, text: '区333', checked: false},
              {id: 3, text: '区4', checked: false},
              {id: 4, text: '区5555', checked: false},
              {id: 5, text: '区666', checked: false},
              {id: 6, text: '区77', checked: false}
            ]
          },
          {text: '行业', children: [{id: -1, text: '不限', checked: false}]},
          {text: '合作形式', children: [{id: -1, text: '不限', checked: false}]}
        ]
      }
    },
    methods: {
      parseFilter (e) {
        let k = e.target.dataset && e.target.dataset.key
        if (k) {
          let [i, j] = k.split(',')
          i = Number(i)
          j = Number(j)
          let [text, child] = [this.items[i].text, this.items[i].children[j]]
          this.items[i].children[j].checked = !this.items[i].children[j].checked
          if (this.items[i].children[j].checked) {
            this.filterParams[k] = {text, child}
          } else {
            delete this.filterParams[k]
          }
          this.$emit("filter-list", this.filterParams)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-filter {
    width: .92rem;
    .btn-filter {
      color: #fff;
      font-size: .2rem;
      white-space: nowrap;
      img {
        width: .4rem;
        margin-right: .09rem;
        vertical-align: text-bottom;
      }
    }
    .filter-container {
      position: fixed;
      z-index: 3;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #fff; 
      display: -none;
      box-shadow:0 .05rem 0 0 rgba(41,41,41,0.07);
      .btn-close {
        position: absolute;
        width: .3rem;
        height: .3rem;
        right: .53rem;
        top: .33rem;
        font-size: .6rem;
        text-align: center;
        line-height: .35;
      }
      .content {
        padding: .3rem;
        .item {
          padding-bottom: .58rem;
          overflow: hidden;
          font-size: .24rem;
          .title {
            margin-bottom: .24rem;
            color: #333;
            font-size: .28rem;
          }
          .children {
            margin-left: -.16rem;
          }
          span {
            position: relative;
            width: 1.6rem;
            height: .7rem;
            float: left;
            margin-left: .16rem;
            margin-bottom: .24rem;
            line-height: .7rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipisis;
            background:rgba(248,248,250,1);
            color: #999;
            text-align: center;
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
        }
      }
    }
  }
</style>