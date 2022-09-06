<template>
  <el-dialog
    title="上传文件"
    v-if="showDialog"
    :visible.sync="showDialog"
    :before-close="toggleDialog"
    append-to-body
  >
    <upload
      v-model="files"
      accept=""
      @uploading="progress"
      size="20"
      size-message="单个文件大小限制20M以内"
      type-message="仅支持（*.jpeg，*.jpg，*.png，*.gif，*.svg）图片文件"
    />
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="uploading" @click="toggleDialog">取 消</el-button>
      <el-button :disabled="uploading" type="primary" @click="confirm"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {
    upload: _ => import('~/components/upload')
  },
  data() {
    return {
      showDialog: false,
      files: [],
      uploading: false
    }
  },
  mounted() {
    if (!Vue.prototype.$RichText) {
      Vue.prototype.$RichText = {}
    }
    Vue.prototype.$RichText.addImage = function(cb) {
      this.addImageCallback = cb
      this.toggleDialog()
    }.bind(this)
  },
  methods: {
    confirm() {
      let content = this.files.map(({ url, name }) => {
        return /jpe?g|png|gif|svg/i.test(url.substring(url.lastIndexOf('.') + 1)) ? `<img src="${url}"/>` : `<p><a href="javascript:window.Vue && Vue.prototype.$helper.downloadByUrl('${url}', '${name}') || window.open('${url}');void(0)">${name}</a></p>`
      }).join('')
      this.addImageCallback(content)
      this.toggleDialog()
    },
    toggleDialog() {
      if (this.uploading) return
      this.showDialog = !this.showDialog
      if (!this.showDialog) this.files = []
    },
    progress(v) {
      this.uploading = v + '' === '0'
    }
  }
}
</script>
<style lang="scss" scoped>
.upload {
  /deep/ .el-upload {
    &-dragger {
      width: auto;
    }
  }
}
</style>
