<template>
  <div>
    <div v-for="(item, index) in list" :key="index">
      <div class="header">
        <span class="header-radius"></span>
        <span class="header-context">2019-01-12 23:21:12</span>
      </div>
      <div class="body">
        <div></div>
        <div class="body-context">
          <div class="body-context-header">
            这是一段很长很长很长的描述性文字
          </div>
          <div class="body-context-des body-context-before">
            <span>
              修改前：
            </span>
            这是一段很长很长很长的描述性文字
          </div>
          <div class="body-context-des body-context-after">
            <span>
              修改前：
            </span>
            这是一段很长很长很长的描述性文字
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'taskDetailActive',
  components: {},
  data() {
    return {
      list: [{}, {}]
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.header {
  height: 20px;
  font-size: 14px;
  margin-top: 2px;

  .header-radius {
    height: 10px;
    background: #d9d9d9;
    width: 10px;
    display: inline-block;
    border-radius: 50%;
  }

  .header-context {
    color: #333;
    margin-left: 4px;
  }
}

.body {
  border-left: 1px solid #d9d9d9;
  margin-left: 4px;
  font-size: 14px;

  .body-context {
    margin-left: 10px;
    margin-left: 16px;

    .body-context-header {
      padding-top: 6px;
    }

    .body-context-des {
      color: #999999;
      line-height: 28px;
    }

    .body-context-after {
      // line-height: 40px;
      padding-bottom: 14px;
    }

    .body-context-before {
      margin-top: 10px;
    }
  }
}
</style>
