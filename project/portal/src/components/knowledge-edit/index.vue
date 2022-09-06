<template>
  <div class="knowledge-edit">
    <el-button type="text" v-if="canEdit" @click="showAddRelationDialog">
      <span class="font-icon add"></span>
      关联知识库文章
    </el-button>
    <ul class="knowledge-list">
      <template v-if="canEdit">
        <li class="knowledge-item" v-for="item in knowledgeList" :key="item.id">
          <el-dropdown trigger="hover" placement="bottom-end" @command="remove">
            <span class="el-dropdown-link">{{ item.title }}</span>
            <el-dropdown-menu slot="dropdown" class="knowledge-down">
              <el-dropdown-item :command="1">
                <a :href="item.url" target="_bank">访问</a>
              </el-dropdown-item>
              <el-dropdown-item :command="item">移除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </template>
      <template v-else>
        <li class="knowledge-item" v-for="item in knowledgeList" :key="item.id">
          <a
            class="el-dropdown-link el-dropdown"
            :href="item.url"
            target="_bank"
            >{{ item.title }}</a
          >
        </li>
      </template>
    </ul>
    <add-relation-dialog @confirm="handleConfirm" ref="relationDialog" />
  </div>
</template>

<script>
export default {
  name: 'knowledge-edit',
  components: {
    'add-relation-dialog': _ =>
      import('~/components/rich-text/add-relation-content')
  },
  props: {
    canEdit: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  // created() {},
  mounted() {},
  methods: {
    showAddRelationDialog() {
      this.relationDialog.toggleDialog()
    },
    handleConfirm(row) {
      const currentList = [...this.knowledgeList]
      row.map(item => {
        if (!this.knowledgeIds.includes(item.id)) {
          currentList.push(item)
        }
      })
      this.knowledgeList = currentList
    },
    remove(item) {
      if (item === 1) {
        return
      }
      const currentList = [...this.knowledgeList]
      const itemIndex = currentList.findIndex(el => el.id == item.id)
      currentList.splice(itemIndex, 1)
      this.knowledgeList = currentList
    }
  },
  computed: {
    relationDialog() {
      return this.$refs.relationDialog
    },
    knowledgeIds() {
      return this.knowledgeList.map(item => item.id)
    },
    knowledgeList: {
      get() {
        try {
          // 去重, 可能出现任务和流程选了同一个知识
          const arr = this.value ? JSON.parse(this.value) : []
          const set = new Set()
          const res = arr.filter(item => {
            if (!set.has(item.id)) {
              set.add(item.id)
              return item
            }
          })
          return res
        } catch (e) {
          return []
        }
      },
      set(val) {
        const arr = (val || []).map(v => ({
          url: v.url,
          typeName: v.typeName,
          title: v.title,
          groupId: v.groupId,
          id: v.id
        }))
        const arrayString = JSON.stringify(arr)
        this.$emit('input', arrayString)
      }
    }
  }
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.knowledge-edit {
  .el-button--text {
    width: 100%;
    padding: 12px 16px;
    color: #999999;
    border: 1px dashed #d9d9d9;
    margin-bottom: 20px;
    &:hover {
      border: 1px dashed #3366ff;
    }
    span {
      color: #999999;
    }
  }
  .knowledge-list {
    padding-left: 20px;
    margin: 0;
    .knowledge-item {
      margin-bottom: 6px;
      .el-dropdown-link {
        word-break: break-word;
      }
      .el-dropdown-link:hover {
        color: #3366ff;
      }
      .el-dropdown {
        vertical-align: top;
      }
    }
  }
}

.knowledge-down {
  margin-top: 8px !important;
  /deep/ .el-dropdown-menu__item a {
    color: unset;
  }
}
/deep/ .popper__arrow {
  display: none;
}
</style>
