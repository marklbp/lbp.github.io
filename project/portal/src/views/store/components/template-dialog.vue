<template>
  <div class="wrap">
    <el-dialog
      class="dialog-containter"
      :visible.sync="isShow"
      width="845px"
      title="选择模板"
    >
      <el-input
        class="search-words"
        v-model="searchWords"
        placeholder="输入关键词搜索"
        @change="searchHandler"
        ><i slot="prefix" class="el-input__icon el-icon-search"></i
      ></el-input>
      <div class="dialog-content">
        <el-tabs
          class="tabs"
          v-if="items.length"
          tabPosition="left"
          style="float:left;width:92px;height:100%;"
          v-model="itemIndex"
          @tab-click="clickHandler"
        >
          <el-tab-pane
            v-for="(val, i) in items"
            :key="i + ''"
            :label="val.name"
          ></el-tab-pane>
        </el-tabs>
        <div class="all-items">
          <div class="items-wrap" ref="itemWrap">
            <page-init :message="message" :loading="loading">
              <div
                class="item-detail"
                v-for="(val, k) in items"
                :key="k"
                :ref="k"
              >
                <h4>{{ val.name }}</h4>
                <ul>
                  <li v-for="(item, i) in val.list" :key="i">
                    <div>
                      <!-- <h5 class="item-title ellipsis-end-line"> -->
                      <h5 class="item-title">
                        {{ item.name }}
                      </h5>
                      <p class="item-instruc">
                        {{
                          (item.description || '').slice(0, 20) +
                            ((item.description || '').length > 20 ? '...' : '')
                        }}
                      </p>
                    </div>
                    <el-button type="primary" @click="useHandle(item)"
                      >引用</el-button
                    >
                  </li>
                </ul>
              </div>
            </page-init>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pageInit from '~/components/page-init'
export default {
  name: 'processDialog',
  data() {
    return {
      items: [],
      itemIndex: '0',
      searchWords: '',
      isShow: false,
      msg: '',
      loading: true,
      message: ''
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isStandard: {
      type: Boolean,
      default: false
    }
  },
  components: {
    pageInit
  },
  methods: {
    closeHandle() {
      this.$emit('input', false)
    },
    useHandle(template) {
      // 点击启用按钮跳转
      this.$router.push(
        '/editor/' + this.$route.params.storeId + '/' + template.modelId + '/0'
      )
    },
    searchHandler() {
      this.getAll()
    },
    scrollHandler() {
      // 楼层效果处理
      if (this.timer || this.preventScrollHandler) return
      this.timer = setTimeout(() => {
        this.timer = null
        const itemsSite = []
        const scrollTop = this.$refs.itemWrap.scrollTop
        let currentIndex = 0
        for (let i = this.items.length - 1; i > -1; i--) {
          if (scrollTop > this.$refs[i][0].offsetTop - 16) {
            currentIndex = i
            break
          }
        }
        this.itemIndex = currentIndex + ''
      }, 100)
    },
    clickHandler(item) {
      for (let i = 0; i < this.items.length; i++) {
        if (i + '' === item.index) {
          this.preventScrollHandler = true
          setTimeout(() => {
            this.preventScrollHandler = false
          })
          this.$refs.itemWrap.scrollTop = this.$refs[i][0].offsetTop - 16
          break
        }
      }
    },
    getProcessData(params) {
      return this.$api.template[this.isStandard ? 'list1' : 'list'](params, {
        headers: { groupId: this.$route.params.storeId }
      })
    },
    getAllCategory(params) {
      return (
        this.allCategory ||
        this.$api.flowSetting.getCategoryList(params, {
          headers: { groupId: this.$route.params.storeId }
        })
      )
    },
    getAll() {
      // 获取所有数据
      this.loading = true
      const params = {
        pageSize: -1,
        name: this.searchWords,
        status: 1
      }
      if (this.isStandard) {
        params.currentPage = 1
      } else {
        params.groupId = this.$route.params.storeId
        params.status = '1,2'
      }
      Promise.all([this.getAllCategory(), this.getProcessData(params)])
        .then(arr => {
          this.allCategory = arr[0]
          const items = arr[0].data.map(val => {
            return { name: val.name, list: [] }
          })
          arr[1].data.records.forEach(val => {
            for (let item of items) {
              if (item.name === val.categoryName) {
                item.list.push(val)
                break
              }
            }
          })
          this.items = items.filter(val => val.list && val.list.length)
          this.loading = false
          if (!this.items.length) {
            this.message = '暂无数据'
          } else {
            this.message = ''
          }
        })
        .catch(err => {
          this.loading = false
          this.message = err.msg || err.message
        })
    }
  },

  watch: {
    isShow(val) {
      if (!val) {
        this.closeHandle()
      }
      if (val) {
        this.$nextTick(function() {
          const { itemWrap } = this.$refs
          itemWrap && itemWrap.addEventListener('scroll', this.scrollHandler)
          this.getAll()
        })
      } else {
        const { itemWrap } = this.$refs
        itemWrap && itemWrap.removeEventListener('scroll', this.scrollHandler)
      }
    },
    value(val) {
      this.isShow = val
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-content {
  background: white;
  border-radius: 2px;
  height: 558px;
  overflow: hidden;
  position: relative;
  display: flex;
  /deep/ {
    .el-tabs__item {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0;
      width: 60px;
      text-align: center;
    }
    .el-tabs__item.is-active {
      font-weight: normal;
      color: #3366ffff;
    }
  }
}
.tabs {
  width: 200px;
}
.items-wrap {
  flex: 1;
  clear: both;
  overflow: auto;
  position: relative;
}
.all-items {
  overflow: hidden;
  margin-right: 4px;
  padding-top: 44px;
  flex: 1;
  display: flex;
  flex-flow: column;
}
.search-words {
  width: 254px;
  height: 32px;
  align-self: flex-end;
  position: absolute;
  top: 70px;
  right: 28px;
  z-index: 100;
}
.item-detail {
  &:before {
    content: '';
    clear: both;
    display: block;
  }
  > h4 {
    font-size: 16px;
    color: #666;
    margin: 0 0 16px;
  }
  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    > li {
      width: 336px;
      height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #d9d9d9;
      margin-bottom: 16px;
      box-sizing: border-box;
      padding: 0 16px 0 24px;
      border-radius: 4px;
    }
  }
}
.item-title {
  font-size: 14px;
  color: #333;
  line-height: 1;
  margin-bottom: 10px;
  word-break: break-word;
  width: 200px;
  max-height: 42px;
  overflow: hidden;
}
.item-instruc {
  font-size: 12px;
  color: #999;
  width: 200px;
  word-break: break-word;
  overflow: hidden;
}
.empty-notice {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.no-data-icon {
  display: block;
  width: 140px;
  height: 112px;
  background: url(../../asset/no-data-icon.png) center no-repeat;
  background-size: contain;
}
.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
// 滚动条设置
::-webkit-scrollbar {
  width: 6px; //y轴上的滚动条宽度
  height: 6px; //x轴上滚动条高度
}
::-webkit-scrollbar-track {
  border-radius: 3px; /*滚动条的背景区域的圆角*/
  background-color: #fdf8f5; /*滚动条的背景颜色*/
}
::-webkit-scrollbar-thumb {
  border-radius: 3px; /*滚动条的圆角*/
  background-color: rgba(0, 0, 0, 0.3); /*滚动条的背景颜色*/
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.6);
}

::-webkit-scrollbar-thumb:active {
  // background-color: rgb(4  6, 86, 159);
  cursor: pointer;
}
</style>
<style lang="scss">
.dialog-containter {
  .el-dialog__header {
    border-bottom: 1px solid #d9d9d9;
  }
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }
  .el-tabs__nav-wrap {
    padding-top: 16px;
  }
  .component-empty {
    margin: 0 auto;
  }
}
</style>
