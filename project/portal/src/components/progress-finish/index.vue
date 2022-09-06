<template>
  <div class="progress-wrap" :class="{ 'no-progress-bar': !progressBar }">
    <span>完成度：{{ rate }}</span>
    <p class="process" v-if="progressBar">
      <span
        :style="{
          width: `${getProcess(rate)}%`
        }"
      ></span>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    rate: {
      type: String, // 支持分数形式，如3/6; 百分比形式：60%
      default: _ => 0
    },
    progressBar: {
      // 是否展示进度条
      type: Boolean,
      default: false
    }
  },
  methods: {
    getProcess(val) {
      // 进度条数据处理
      let result
      if (/^\d+\/\d+$/.test(val)) {
        const num = val.split('/')
        result = (num[0] / num[1]).toFixed(2) * 100
      } else if (/^\d+\.?\d*%$/.test(val)) {
        result = parseInt(val, 10)
      } else {
        result = 0
      }
      return result
    }
  },
  name: 'progress-finish'
}
</script>
<style lang="scss" scoped>
.progress-wrap {
  border: 1px solid #3366ff;
  color: #3366ff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  border-radius: 100px;
  background: rgba(51, 102, 255, 0.1);
  width: 198px;
  height: 20px;
  box-sizing: border-box;
  > .process {
    height: 5px;
    width: 76px;
    background: white;
    margin-left: 8px;
    border-radius: 100px;
    overflow: hidden;
    > span {
      display: block;
      background: #3366ff;
      height: 100%;
      border-radius: 100px;
    }
  }
}
.no-progress-bar {
  width: 110px !important;
}
</style>
