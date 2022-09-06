<template>
  <div class="list-module">
    <slot v-show="enableDrag" name="drag" />
    <div class="title">
      <h4>
        {{ dictionary.name }}
      </h4>
    </div>
    <span @click="toAllPage" class="showMoreData">MORE>></span>
    <page-init :loading="loading" :message="message">
      <ul class="knowledge-list">
        <li
          v-for="(item, i) in list"
          :key="i"
          @click="clickListHandler(item)"
          class="ellipsis-end-line"
        >
          <overflow-tip
            :words="`【${item[dictionary.typeName]}】${item[dictionary.title]}`"
          ></overflow-tip>
        </li>
      </ul>
    </page-init>
  </div>
</template>
<script>
export default {
  name: 'list-module',
  components: {
    pageInit: _ => import('~/components/page-init'),
    overflowTip: _ => import('~/components/overflow-tip')
  },
  props: {
    params: {
      type: Object,
      default: () => ({
        type: 'knowledge',
        enableDrag: false,
        width: 12
      })
    }
  },
  data() {
    return {
      list: [],
      loading: true,
      message: ''
    }
  },
  computed: {
    enableDrag() {
      const enableDrag = this.params.enableDrag
      return enableDrag === undefined ? false : enableDrag
    },
    type() {
      const type = this.params.type
      return type || 'knowledge'
    },
    width() {
      const width = this.params.width
      return width || 12
    },
    dictionary() {
      let data = {}
      switch (this.type) {
        case 'operation': // 运营动态
          data = {
            model: '',
            api: '',
            itemHref: '',
            id: '',
            title: '',
            typeName: '',
            name: '运营动态',
            allHref: ''
          }
          break
        case 'knowledge': // 标准知识库
          data = {
            model: 'globalDashboard',
            api: 'dashboardKnowledge',
            itemHref: '/0/knowledge/preview/',
            id: 'id',
            title: 'title',
            typeName: 'typeName',
            name: '知识库',
            allHref: '/knowledge'
          }
          break
        case 'product': // 产品动态
          data = {
            model: '',
            api: '',
            itemHref: '',
            id: '',
            title: '',
            typeName: '',
            name: '产品动态',
            allHref: ''
          }
          break
        default:
          break
      }
      return data
    }
  },
  mounted() {
    this.fetchList()
  },
  beforeDestroy() {},
  methods: {
    async fetchList() {
      try {
        if (
          this.$api[this.dictionary.model] &&
          this.$api[this.dictionary.model][this.dictionary.api]
        ) {
          const detail = await this.$api[this.dictionary.model][
            this.dictionary.api
          ]()
          const list = detail.data
          this.list = list
          if (list.length) {
            this.message = ''
          } else {
            this.message = '暂无数据'
          }
        } else {
          this.message = '暂无数据'
        }
      } catch (err) {
        this.message = err.msg || err.message
      } finally {
        this.loading = false
      }
    },
    toAllPage() {
      const href = this.dictionary.allHref
      if (href) {
        this.$router.push({ path: href })
      }
    },
    clickListHandler(item) {
      const href = this.itemHref
      if (href) {
        const path = this.itemHref + item[this.dictionary.id]
        const a = document.createElement('a')
        a.setAttribute('target', '_blank')
        a.setAttribute('href', path)
        a.click()
        setTimeout(() => {
          try {
            a.remove()
          } catch (error) {}
        }, 0)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
@mixin border-box {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.list-module {
  position: relative;
  @include border-box;
  background: white;
  color: #333;
  /deep/ {
    .done {
      min-height: 0 !important;
    }
    .page-init {
      height: 173px;
      overflow: hidden;
      min-height: 0px;
    }
    .component-empty {
      min-height: 100%;
    }
  }
  .title {
    @include flex;
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    padding: 0 24px 0 32px;
    justify-content: space-between;
    border-bottom: 1px solid #e8e8e8ff;
    > h4 {
      margin: 0;
    }
    > span {
      cursor: pointer;
      color: #3366ffff;
    }
  }
  .knowledge-list {
    font-size: 14px;
    line-height: 20px;
    list-style: none;
    margin: 0;
    padding: 0 24px 0 32px;
    overflow: hidden;
    > li {
      padding: 0;
      margin: 0;
      margin-top: 16px;
      cursor: pointer;
      width: 240px;
      &:last-child {
        margin-bottom: 16px;
      }
      > span {
        font-weight: bold;
      }
      .icon {
        display: none;
        font-size: 16px;
        font-weight: bold;
        color: #999999ff;
        &:hover {
          color: #3366ffff;
        }
      }
      &:hover {
        color: #3366ffff;
        > .icon {
          display: block;
        }
      }
    }
  }
}
.showMoreData {
  position: absolute;
  z-index: 99;
  left: 104px;
  top: 22px;
  font-size: 12px;
  color: #3366ff;
  cursor: pointer;
}
</style>
