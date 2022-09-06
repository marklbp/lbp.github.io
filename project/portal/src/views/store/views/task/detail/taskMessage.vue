<template>
  <div class="messgae">
    <div class="task-des">
      <div class="task-des-left" @click="handleText">任务描述</div>
      <div
        class="task-des-right description"
        v-if="getAuthByAction('description', 'read')"
      >
        <div
          v-if="!getAuthByAction('description', 'edit')"
          v-html="baseInfoRes.description"
        ></div>
        <template v-else>
          <editable-rich
            type="2"
            v-model="description"
            :richTextPlugins="richConfig"
          />
          <!-- <div
            class="show"
            @click="handleShowRichText"
            v-if="!showRichText"
            v-html="baseInfoRes.description"
          ></div>
          <div class="richText" v-else>
            <RichText
              v-model="description"
              maxlength="1000"
              show-word-limit
              autofocus
              @blur="richTextBlur"
            />
          </div>-->
        </template>
      </div>
    </div>
    <div class="task-des" v-if="getAuthByAction('tools', 'read')">
      <div class="task-des-left">工具</div>
      <div class="task-des-right">
        <tools
          v-model="tools"
          :addable="getAuthByAction('tools', 'edit')"
          :deletable="false"
        />
      </div>
    </div>
    <div class="task-des" v-if="getAuthByAction('attachment', 'read')">
      <div class="task-des-left">交付文件</div>
      <div class="task-des-right">
        <attachments
          style="width: 422px;"
          v-model="fileDtosList"
          :class="{ disabled: !getAuthByAction('attachment', 'add') }"
          :disabled="!getAuthByAction('attachment', 'add')"
          :isDelete="getAuthByAction('attachment', 'deleted')"
        />
      </div>
    </div>
    <template v-if="isParent && getAuthByAction('subTaskDtos', 'read')">
      <div class="task-des">
        <div class="task-des-left">子任务</div>
        <div class="task-des-right">
          <sub-task
            :nodeStatus="status"
            :independency="true"
            :hasMessagePage="hasMessagePage"
            :persons="persons"
            v-model="subTaskDtos"
            :edit="showSubTaskEdit"
            class="sub-tasks"
          />
          {{ subTaskDtos.length === 0 && !showSubTaskEdit ? '无' : '' }}
        </div>
      </div>
    </template>
    <comment
      :processId="processId"
      layout="column"
      :enableSpread="false"
      :isAdd="getAuthByAction('annotation', 'add')"
      v-if="getAuthByAction('annotation', 'read')"
    />
    <!-- <NewSubtasksDialog v-model="dialogVisibleSubtasks" /> -->
  </div>
</template>
<script>
const richConfig = {
  items: [
    'fontname',
    'fontsize',
    'forecolor',
    'hilitecolor',
    'emoticons',
    'bold',
    'italic',
    'underline',
    'justifyleft',
    'justifycenter',
    'justifyright',
    'indent',
    'outdent',
    'insertorderedlist',
    'insertunorderedlist',
    'link',
    'portal-image-upload',
    'fullscreen'
  ]
}

export default {
  name: 'taskMessage',
  components: {
    attachments: _ => import('~/components/attachments'),
    editableRich: _ => import('~/components/editable'),
    tools: _ => import('~/components/tools'),
    'sub-task': _ => import('~/components/sub-task'),
    comment: _ => import('~/components/comment')
  },
  props: [
    'baseInfoRes',
    'fileDtos',
    'auths',
    'isParent',
    'status',
    'persons',
    'rootId',
    'finishFetch',
    'hasMessagePage'
  ],
  data() {
    return {
      dialogVisibleSubtasks: false,
      showRichText: false,
      timer: null,
      richConfig
    }
  },
  methods: {
    addAnnotations() {
      this.dialogVisibleSubtasks = true
    },

    handleText() {
      this.showRichText = false
    },
    getAuthByAction(action, type) {
      const actions = this.auths[action]
      if (actions) {
        return actions[type]
      }
      return false
    }
  },
  computed: {
    subTaskDtos: {
      set(v) {
        this.$emit('updateField', {
          fieldName: 'baseInfoRes.subTaskDtos',
          fieldValue: v
        })
      },
      get() {
        let v = this.baseInfoRes.subTaskDtos
        if (v instanceof Array) {
          v.forEach(x => {
            x.startTime = this.$helper.formatTime(x.startTime)
            x.endTime = this.$helper.formatTime(x.endTime)
            x.assignee = this.$helper.parsePerson(x.assignee, this.persons)
            x.copyPerson = this.$helper.parsePerson(x.copyPerson, this.persons)
            x.attachment = x.attachment instanceof Array ? x.attachment : []
          })
          return v
        }
        return []
      }
    },
    description: {
      get() {
        return this.baseInfoRes.description || ''
      },
      set(v) {
        this.$emit('updateField', {
          fieldName: 'description',
          fieldValue: v
        })
      }
    },
    fileDtosList: {
      get() {
        return this.fileDtos
      },
      set(v) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$emit('updateField', {
            fieldName: 'fileDtos',
            fieldValue: v.map(f => ({ url: f.url, name: f.name }))
          })
        }, 200)
      }
    },
    tools: {
      set(v) {
        this.$emit('updateField', {
          fieldName: 'tools',
          fieldValue: v
        })
      },
      get() {
        return !this.baseInfoRes.tools ? '' : this.baseInfoRes.tools
      }
    },
    showSubTaskEdit() {
      return this.getAuthByAction('subTaskDtos', 'add')
    },
    toolsAdd() {
      return this.status != 2
    },
    processId() {
      let id
      if (this.finishFetch) {
        id = this.rootId
      }
      return id
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  text-align: center;
}

.messgae {
  padding-bottom: 30px;
  .task-des {
    margin-bottom: 20px;
    margin-top: 6px;
    font-size: 14px;
    display: flex;
    /deep/ .file-list {
      margin-top: 0;
    }
    .task-des-left {
      color: #999;
      min-width: 60px;
      line-height: 20px;
    }

    .task-des-right {
      line-height: 20px;
      color: #333;
      margin-left: 10px;
      flex: 1;
      .disabled {
        /deep/ .el-upload-dragger {
          cursor: not-allowed;
        }
      }
      &.description {
        flex: 1;
        .show {
          min-width: 370px;
          min-height: 25px;
          word-break: break-all;
          border: 1px solid #fff;
          transition: all 0.3s;
          &:hover {
            border: 1px solid #ddd;
          }
        }
      }
      .richText {
        // width: 600px;
      }
      .task-des-card {
        margin-bottom: 8px;
      }

      .textarea-message {
        margin-bottom: 10px;
        width: 474px;
        left: 0px;
        display: flex;

        /deep/ .el-textarea {
          width: 92%;
          margin-right: 10px;

          textarea {
            height: 74px;
          }
        }
      }

      .dispatch-text-action {
        .text-action {
          display: flex;
          align-items: flex-end;
          height: 100%;
        }
      }
      .upload {
        width: 422px;
      }
    }

    .task-des-tools {
      margin-left: 20px;

      .task-des-tool {
        display: inline-block;

        .img {
          width: 24px;
          vertical-align: middle;
        }
      }
    }
  }
  .sub-tasks {
    width: 422px;
  }
}
</style>
