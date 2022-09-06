<template>
  <div class="border-des">
    <div
      class="board"
      v-for="(item, index) in borderList"
      :key="index"
      :style="'marginLeft:' + getMargin(index)"
    >
      <div class="border-left">
        <img
          class="img"
          src="https://bztic-casaba.oss-cn-shanghai.aliyuncs.com/sit/88000785/dfc5fe60-ae46-441f-8fcc-bdb991892bea.png"
        />
      </div>
      <div class="border-right">
        <div class="border-right-header">
          <span class="name">xxxxx</span>
          <span class="time">2018-01-12 12:21</span>
        </div>
        <div class="border-right-body">飒飒大大sadsad</div>
        <div class="border-right-footer">
          <span class="reply" @click="onReply">回复</span>
          <span @click="onDelete">删除</span>
        </div>
      </div>
    </div>

    <el-dialog title="回复留言" :visible.sync="dialogVisReply" width="30%">
      <span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入留言内容"
          v-model="textarea"
        >
        </el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisReply = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisReply = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'boardItem',
  data() {
    return {
      borderList: [{}, {}, {}],
      dialogVisReply: false,
      textarea: ''
    }
  },
  methods: {
    getMargin(index) {
      return `${index * 40}px`
    },
    onDelete() {
      this.$confirm('此操作将删除该条留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    onReply() {
      this.dialogVisReply = true
    }
  }
}
</script>
<style lang="scss" scoped>
.border-des {
  .board {
    display: flex;
    margin-bottom: 10px;

    .border-left {
      margin-right: 20px;

      .img {
        border-radius: 50%;
        width: 24px;
        vertical-align: middle;
      }
    }

    .border-right {
      .border-right-header {
        line-height: 22px;
        color: #333333;

        .name {
          font-weight: 500;
        }

        .time {
          color: #666666;
          margin-left: 20px;
        }
      }

      .border-right-body {
        line-height: 30px;
      }

      .border-right-footer {
        font-size: 12px;

        .reply {
          margin-right: 30px;
        }
      }
    }
  }
}
</style>
