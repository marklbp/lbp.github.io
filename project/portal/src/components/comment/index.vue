<template>
  <div class="comment-wrap">
    <div class="comment-head">
      <p
        class="comment-title"
        @click="enableSpread && (showComment = !showComment)"
        :style="{
          cursor: enableSpread ? 'pointer' : 'auto'
        }"
      >
        <i
          class="el-icon-arrow-down comment-icon"
          :class="{ 'active-comment': showComment }"
          v-if="enableSpread"
        ></i>
        评论{{ enableSpread ? '(' + (commentList.length || 0) + ')' : '' }}
      </p>
      <div
        class="add-comment"
        @click="addCommentVisible = true"
        v-if="isAdd && layout === 'column'"
      >
        +添加评论
      </div>
    </div>
    <el-collapse :value="showComment ? '1' : ''">
      <el-collapse-item name="1">
        <ul class="comment-content">
          <li class="comment-item" v-for="(item, i) of commentList" :key="i">
            <peoples
              :list="[{ name: item.realname, color: item.color || 'red' }]"
              class="comment-people-icon"
            />
            <div class="comment-item-r">
              <div class="comment-item-rt">
                <span class="comment-name">{{ item.realname }}</span>
                <template v-if="item.replyId">
                  <span class="reply-btn">回复</span>
                  <span class="comment-name">{{ item.replyRealname }}</span>
                </template>
                <span class="comment-time">{{
                  item.createDate | formatTime('y-M-d h:m')
                }}</span>
              </div>
              <p class="comment-text" v-html="item.content"></p>
              <div class="comment-operation">
                <span @click="replyHandler(item)" v-if="isAdd">回复</span>
                <span @click="delHandler(item)" v-if="item.realname === name"
                  >删除</span
                >
              </div>
            </div>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
    <div
      class="add-comment"
      @click="addCommentVisible = true"
      v-if="isAdd && layout === 'row'"
    >
      +添加评论
    </div>
    <el-dialog
      title="添加评论"
      :visible.sync="addCommentVisible"
      :modal-append-to-body="false"
    >
      <div class="content-wrap">
        <div class="content">
          <el-input
            type="textarea"
            placeholder="请输入评论内容"
            v-model="commentInput"
            maxlength="200"
            show-word-limit
          />
          <div class="operations">
            <el-button @click="cancleAdd">取消</el-button>
            <el-button type="primary" @click="confirmAdd">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="回复评论"
      :visible.sync="replyCommentVisible"
      :modal-append-to-body="false"
    >
      <div class="content-wrap" v-if="replyTarget">
        <div class="content">
          <div class="reply-info">
            <peoples
              class="comment-people-icon"
              :list="
                replyTarget
                  ? [
                      {
                        name: replyTarget.realname || '',
                        color: replyTarget.color || 'red'
                      }
                    ]
                  : []
              "
            />
            <div class="content-r">
              <div class="reply-comment-info">
                <span class="comment-name">{{ replyTarget.realname }}</span>
                <span class="comment-time">{{
                  replyTarget.createDate | formatTime('y-M-d h:m')
                }}</span>
              </div>
              <div class="comment-text ellipsis-end-line normal-line">
                {{ replyTarget.content }}
              </div>
            </div>
          </div>

          <el-input
            type="textarea"
            placeholder="请输入回复内容"
            v-model="replyInput"
            maxlength="200"
            show-word-limit
          />
          <div class="operations">
            <el-button @click="cancleReply">取消</el-button>
            <el-button type="primary" @click="confirmReply">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delConfirmVisible"
      :modal-append-to-body="false"
    >
      <div class="content-wrap">
        <div class="content">
          <p class="confirm-notice">是否确定删除该评论？</p>
          <div class="operations">
            <el-button @click="cancleDel">取消</el-button>
            <el-button type="danger" @click="confirmDel">确定删除</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    this.name = this.$cache.get('USER_INFO').realName
    this.replyTarget = null
    this.delTarget = null
    return {
      showComment: true,
      commentList: [],
      commentInput: '',
      replyInput: '',
      addCommentVisible: false,
      replyCommentVisible: false,
      delConfirmVisible: false
    }
  },
  props: {
    processId: {
      // 流程/任务id
      type: [String, Number]
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String, // '评论'和'添加评论'按钮排列方式，'column'：横向； 'row'：纵向
      default: 'row'
    },
    enableSpread: {
      // 启用展开
      type: Boolean,
      default: true
    }
  },
  components: {
    peoples: _ => import('~/components/peoples')
  },
  methods: {
    replyHandler(item) {
      this.replyCommentVisible = true
      this.replyTarget = item
    },
    fetchComment() {
      if (!this.processId) return Promise.resolve([])
      return this.$api.flowSetting
        .getCommentList(
          {
            processInstanceId: this.processId
          },
          {
            headers: {
              groupId: this.$route.params.storeId
            },
            needToast: false
          }
        )
        .then(res => {
          return res.data
        })
        .catch(err => {
          console.log(err)
          return []
        })
    },
    async addComment({ content = '', replyId = '' }) {
      try {
        const addRes = await this.$api.flowSetting.addComment(
          {
            processInstanceId: this.processId,
            content,
            replyId
          },
          {
            headers: {
              groupId: this.$route.params.storeId
            },
            needToast: false
          }
        )
        const commentList = await this.fetchComment()
        this.commentList = commentList.reverse()
        this.$message.success(addRes.message || '操作成功')
      } catch (err) {
        this.$message.error(err.message || err.msg)
      }
    },
    delHandler(item) {
      this.delConfirmVisible = true
      this.delTarget = item
    },
    async delComment({ id }) {
      try {
        const delRes = await this.$api.flowSetting.delComment(
          {
            id
          },
          {
            headers: {
              groupId: this.$route.params.storeId
            },
            needToast: false
          }
        )
        const commentList = await this.fetchComment()
        this.commentList = commentList.reverse()
        this.$message.success(delRes.message || '操作成功')
      } catch (err) {
        this.$message.error(err.message || err.msg)
      }
    },
    cancleAdd() {
      this.addCommentVisible = false
      this.commentInput = ''
    },
    confirmAdd() {
      if (this.commentInput.trim() === '') {
        return this.$message.error('请输入评论内容')
      }
      this.addCommentVisible = false
      this.addComment({ content: this.commentInput })
      this.commentInput = ''
    },
    cancleReply() {
      this.replyCommentVisible = false
      this.replyInput = ''
      this.replyTarget = null
    },
    confirmReply() {
      if (this.replyInput.trim() === '') {
        return this.$message.error('请输入回复内容')
      }
      this.replyCommentVisible = false
      this.addComment({
        content: this.replyInput,
        replyId: this.replyTarget.id
      })
      this.replyInput = ''
      this.replyTarget = null
    },
    cancleDel() {
      this.delConfirmVisible = false
      this.delTarget = null
    },
    confirmDel() {
      this.delConfirmVisible = false
      this.delComment(this.delTarget)
      this.delTarget = null
    }
  },
  created() {
    this.fetchComment().then(res => {
      this.commentList = res.reverse()
    })
  },
  watch: {
    processId(newV, oldV) {
      if (newV !== oldV) {
        this.fetchComment().then(res => {
          this.commentList = res.reverse()
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.comment-wrap {
  font-size: 14px;
  line-height: 100%;
  /deep/ {
    .el-collapse-item__header {
      display: none;
    }
    .el-collapse-item__wrap,
    .el-collapse {
      border: none;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
}
.comment-head {
  color: #999;
  margin: 0 0 16px 0;
  user-select: none;
  display: flex;
  align-items: center;
}
.comment-title {
  cursor: pointer;
  margin: 0;
  min-width: 60px;
  margin-right: 10px;
}
.comment-content {
  list-style: none;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
.reply-info {
  display: flex;
}
.comment-item {
  margin-bottom: 15px;
  color: #666;
  display: flex;
  align-items: flex-start;
}
.comment-people-icon {
  margin-right: 12px;
  flex-shrink: 0;
  align-items: flex-start;
}
.comment-item-nt {
  display: flex;
  margin-bottom: 2px;
  align-items: center;
}
.comment-item-rt {
  line-height: 24px;
  display: flex;
}
.reply-btn {
  color: #999;
  margin-right: 4px;
  font-size: 12px;
}
.comment-name {
  color: #333;
  margin-right: 4px;
  font-weight: bold;
}
.comment-text {
  color: #333;
  margin: 0 0 8px 0;
  line-height: 22px;
  white-space: pre-wrap;
  word-break: break-word;
}
.comment-operation {
  display: flex;
  color: #999;
  font-size: 12px;
  line-height: 100%;
  > span {
    margin-right: 24px;
    cursor: pointer;
  }
}
.reply-comment-info {
  display: flex;
  line-height: 24px;
}
.content-r {
  flex: 1;
  width: 0;
}
.add-comment {
  color: #3366ff;
  cursor: pointer;
  user-select: none;
  display: inline;
}
.comment-icon {
  transition: 0.2s linear;
  margin-right: 5px;
}
.comment-time {
  margin-left: 8px;
}
.active-comment {
  transform: rotate(180deg);
}
.content {
  background: white;
  border-radius: 2px;
  > h4 {
    line-height: 54px;
    padding: 0 16px 0px 24px;
    font-size: 16px;
    color: #333;
    margin: 0 0 24px;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > i {
      cursor: pointer;
    }
  }
  /deep/ {
    textarea {
      width: 100%;
      box-sizing: border-box;
      height: 128px;
      border: 1px solid #d9d9d9;
      resize: none;
      display: block;
      margin: 0 auto;
      padding: 8px;
      box-sizing: border-box;
      border-radius: 2px;
      &::-webkit-input-placeholder {
        color: #d9d9d9;
      }
    }
  }
}
.operations {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 32px;
}
.normal-line {
  white-space: normal;
}
</style>
