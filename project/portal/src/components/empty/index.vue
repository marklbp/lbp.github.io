<template>
  <div class="component-empty" :class="{ small: iconSize.length }">
    <data-empty-svg
      v-if="this.type == 0"
      :style="{
        width: parseSize(iconSize[0]),
        height: parseSize(iconSize[1])
      }"
    />
    <search-empty-svg
      v-else
      :style="{
        width: parseSize(iconSize[0]),
        height: parseSize(iconSize[1])
      }"
    />
    <div class="desc">{{ emptyMessage }}</div>
  </div>
</template>
<script>
export default {
  name: 'component-empty',
  components: {
    'data-empty-svg': _ => import('../data-empty-svg'),
    'search-empty-svg': _ => import('../search-empty-svg')
  },
  props: {
    /**
     * 显示类型：0 -> 数据为空, 1 -> 搜索结果为空
     */
    type: {
      type: [Number, String],
      default: _ => 0
    },

    /**
     * 提示信息
     */
    message: {
      type: String,
      default: ''
    },
    iconSize: {
      // 图标大小
      type: Array,
      default: _ => []
    }
  },
  methods: {
    parseSize(item) {
      if (/^\d+$/.test(item)) {
        return item + 'px'
      } else {
        return item
      }
    }
  },
  computed: {
    emptyMessage: function() {
      let msg = this.type + '' === '0' ? '暂无数据' : '搜索为空'
      return this.message.length > 0 ? this.message : msg
    }
  }
}
</script>
<style lang="scss" scoped>
.component-empty {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 360px;
  line-height: normal;
  img {
    width: 120px;
    height: 120px;
  }

  .desc {
    font-size: 14px;
    line-height: 20px;
    color: #999;
    text-align: center;
  }
}
.small {
  min-height: 0;
  > img {
    display: block;
    margin: 0 auto;
    max-width: 120px;
  }
  > .desc {
    font-size: 12px;
    text-align: center;
    margin-top: 12px;
    line-height: 100%;
  }
}
</style>
