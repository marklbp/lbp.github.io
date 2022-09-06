<template>
  <div class="knowledge">
    <slot v-show="enableDrag" name="drag" />
    <a
      class="showMoreData"
      href="#"
      @click="toKnowledgePage"
      v-if="!loading && enableDrag"
    >
      MORE>>
    </a>
    <div class="title">
      <h4>
        知识库
      </h4>
      <span v-show="width === 12" @click="toKnowledgePage">全部 ></span>
    </div>
    <page-init
      :loading="loading"
      :message="message"
      :iconSize="['auto', 100]"
      :code="code"
    >
      <ul class="knowledge-list">
        <li
          v-for="(item, i) in knowledgeList"
          :key="i"
          @click="clickListHandler(item)"
          class="ellipsis-end-line"
        >
          <overflow-tip
            :words="`【${item.typeName}】${item.title}`"
          ></overflow-tip>
          <!-- <a href="#" class="el-icon-download icon"></a> -->
        </li>
      </ul>
    </page-init>
  </div>
</template>
<script>
import pageInit from '~/components/page-init'
import overflowTip from '~/components/overflow-tip'
export default {
  data() {
    return {
      knowledgeList: [],
      loading: true,
      message: '',
      code: 0
    }
  },
  created() {
    this.fetchKnowledgeData()
  },
  props: {
    params: {
      type: Object,
      default: () => ({
        scope: 'store',
        enableDrag: false,
        width: 12
      })
    }
  },
  computed: {
    enableDrag() {
      const enableDrag = this.params.enableDrag
      return enableDrag === undefined ? false : enableDrag
    },
    scope() {
      // 范围： 'store'(店铺)， 'global' (全局)
      const scope = this.params.scope
      return scope || 'store'
    },
    width() {
      const width = this.params.width
      return width || 12
    }
  },
  watch: {
    $route(newV, oldV) {
      if (
        this.scope === 'store' &&
        newV.params.storeId !== oldV.params.storeId
      ) {
        this.fetchKnowledgeData()
      }
    }
  },
  components: {
    pageInit,
    overflowTip
  },
  methods: {
    toKnowledgePage() {
      const path =
        this.scope === 'store'
          ? `/${this.$route.params.storeId}/knowledge`
          : '/knowledge'
      this.$router.push(path)
    },
    async fetchKnowledgeData() {
      let apiName =
        this.scope === 'store'
          ? this.$api.knowledge.selectPageList
          : this.$api.dashboard.getGlobalKnowledgeList
      const headers =
        this.scope === 'store' ? { groupId: this.$route.params.storeId } : null
      const params =
        this.scope === 'store'
          ? {
              groupId: this.$route.params.storeId,
              currentPage: 1,
              pageSize: 4,
              sources: 1, // 店铺端传1，P端传0
              type: '-1', // 分类dictKey -1代表全部
              title: ''
            }
          : {
              groupId: 0
            }
      try {
        const resData = await apiName(params, {
          headers,
          needToast: false
        })
        const records =
          this.scope === 'store' ? resData.data.records : resData.data
        this.knowledgeList = records
        this.loading = false
        if (records.length) {
          this.message = ''
        } else {
          this.message = '暂无数据'
        }
      } catch (err) {
        this.loading = false
        this.code = 500
        this.message = err.msg || err.message
      }
    },
    clickListHandler(item) {
      let path
      if (this.scope === 'store') {
        path = `/${this.$route.params.storeId}/knowledge/preview/${item.id}`
      } else {
        path = item.url
      }
      const a = document.createElement('a')
      a.setAttribute('target', '_blank')
      a.setAttribute('href', path)
      a.click()
    }
  }
}
</script>
<style lang="scss" scoped>
.knowledge {
  position: relative;
  background: white;
  color: #333;
  height: 229px;
  /deep/ {
    .done {
      min-height: 0 !important;
    }
    .page-init {
      height: 160px;
      overflow: hidden;
      min-height: 0px;
    }
    .component-empty {
      min-height: 100%;
    }
  }
}
.title {
  height: 56px;
  line-height: 56px;
  font-size: 16px;
  display: flex;
  padding: 0 24px 0 32px;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8ff;
  > h4 {
    margin: 0;
  }
  > span {
    cursor: pointer;
    color: #3366ffff;
    font-size: 14px;
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
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    // width: 240px;
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
.showMoreData {
  position: absolute;
  z-index: 99;
  left: 84px;
  top: 22px;
  font-size: 12px;
  color: #3366ff;
}
</style>
