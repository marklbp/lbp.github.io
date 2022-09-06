<template>
  <div class="attachments">
    <upload
      v-if="!disabled"
      v-model="files"
      :disabled="disabled"
      :accept="accept"
      :size="size"
      :size-message="sizeMessage"
      :type-message="typeMessage"
      :show-file-list="showFileList"
      :outUrl="outUrl"
      :headers="headers"
      @changeStatus="changeStatus"
      @uploadFinish="uploadFinish"
      ref="attachments"
    />
    <div v-if="outUrl === ''" class="file-list">
      <div v-for="{ name, url } in value" :key="url" class="item">
        <el-tooltip :content="name" placement="top" style="outline: none">
          <div
            class="file-attrs"
            @click="$helper.downloadByUrl(url, name).catch(e => e)"
          >
            <span class="file-type">
              <i
                class="font-icon"
                :class="
                  ['png', 'jpeg', 'jpg'].indexOf(
                    name.substring(name.lastIndexOf('.') + 1)
                  ) > -1
                    ? 'picture'
                    : 'article'
                "
              ></i>
            </span>
            <div class="file-name">{{ name }}</div>
          </div>
        </el-tooltip>
        <span class="remove" @click="remove(url)" v-if="isDelete"
          ><i class="font-icon delete"></i
        ></span>
        <span
          class="download"
          @click="$helper.downloadByUrl(url, name).catch(e => e)"
          ><i class="font-icon download"></i
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'attachments',
  components: {
    upload: _ => import('~/components/upload')
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: _ => ''
    },
    size: {
      type: [String, Number],
      default: _ => 0
    },
    sizeMessage: {
      type: String,
      default: _ => '上传文件过大'
    },
    typeMessage: {
      type: String,
      default: _ => '上传文件格式不合法'
    },
    showFileList: {
      type: Boolean,
      default: _ => false
    },
    isDelete: {
      type: Boolean,
      default: _ => true
    },
    outUrl: {
      type: String,
      default: _ => ''
    },
    headers: {
      type: Object,
      default: _ => {}
    }
  },
  computed: {
    files: {
      set(v) {
        this.$emit('input', v)
      },
      get() {
        return this.value
      }
    }
  },
  methods: {
    remove(v) {
      let i = this.value.findIndex(({ url }) => url === v)
      if (i > -1) {
        let files = JSON.parse(JSON.stringify(this.value))
        files.splice(i, 1)
        this.$emit('input', files)
      }
    },
    submitUpload() {
      this.$refs.attachments.submitUpload()
    },
    changeStatus(fileList) {
      this.$emit('changeStatus', fileList && fileList.length > 0)
    },
    uploadFinish(res) {
      this.$emit('uploadFinish', res)
    }
  }
}
</script>
<style lang="scss" scoped>
.file-list {
  margin-top: 10px;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 28px;
    line-height: 28px;
    padding-left: 6px;
    padding-right: 12px;
    cursor: pointer;
    .file-attrs {
      display: flex;
      flex: 1;
      align-items: center;
      .file-type {
        width: 16px;
        margin-right: 12px;
        color: #909399;
      }
      .file-name {
        max-width: 300px;
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #333;
        font-size: 14px;
      }
    }
    .download,
    .remove {
      display: none;
      color: #999;
      &:hover {
        color: #333;
      }
    }
    span.download {
      margin-left: 8px;
    }
    &:hover {
      background: rgba(245, 245, 245, 1);
      .download,
      .remove {
        display: block;
      }
    }
  }
}
</style>
