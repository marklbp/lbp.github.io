<template>
  <div class="border-des">
    <BoardItem />

    <div>
      <el-button type="text" @click="addAnnotations">+添加批注</el-button>
    </div>

    <AddAnnotationsDialog v-model="dialogVisibleAddAnnotations" />
  </div>
</template>
<script>
import BoardItem from './boardItem'
import AddAnnotationsDialog from './addAnnotationsDialog'
export default {
  name: 'messageBoard',
  components: {
    BoardItem,
    AddAnnotationsDialog
  },
  data() {
    return {
      dialogVisibleAddAnnotations: false,
      textarea: ''
    }
  },
  methods: {
    addAnnotations() {
      this.dialogVisibleAddAnnotations = true
    }
  }
}
</script>
<style lang="scss" scoped>
.border-des {
  /deep/.el-dialog__body {
    padding: 10px 20px;

    /deep/textarea {
      height: 80px;
    }
  }
}
</style>
