<template>
  <div>
    <p
      class="change-content ellipsis-end-line"
      @click="toggleContent"
      :style="{ cursor: type === 7 ? 'pointer' : null }"
    >
      修改后：<span v-html="formatContent(content)"></span>
    </p>
    <div
      class="desc-detail"
      v-html="content"
      @click="toggleContent"
      v-show="showContent && type === 7"
    ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showContent: false
    }
  },
  props: ['content', 'type'],
  methods: {
    toggleContent() {
      if (this.type !== 7) {
        return
      }
      this.showContent = !this.showContent
    },
    formatContent() {
      if (this.type !== 7) {
        return this.content
      }
      let desc = this.content || ''
      // img 标签处理
      desc = desc.replace(/<img.+?src="(.+?)".+?\/>/g, ' image[$1] ')
      // 去除标签
      desc = desc.replace(/<.+?\/?>|<\/[a-z]+?>/gi, ' ')
      return desc
    }
  }
}
</script>
<style lang="scss" scoped>
.change-content {
  margin: 0;
  color: #999;
  font-size: 14px;
}
</style>
