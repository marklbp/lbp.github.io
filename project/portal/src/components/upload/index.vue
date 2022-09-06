<template>
  <el-upload
    drag
    :multiple="outUrl === ''"
    :class="'upload ' + (disableUpload ? 'disable' : '')"
    :action="url"
    :data="uploadParams"
    :disabled="disableUpload"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :file-list="uploadFileList"
    :on-error="handleError"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-progress="handleProgress"
    :accept="accept"
    :show-file-list="showFileList"
    :headers="headers"
    :name="outUrl === '' ? 'file' : 'Filedata'"
    :limit="outUrl === '' ? 50 : 1"
    :auto-upload="outUrl === ''"
    ref="elUpload"
    :on-change="onChange"
    :on-exceed="onExceed"
    :with-credentials="outUrl !== ''"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      <span v-if="enableUpload">将文件拖到此处，或 <em>点击上传</em></span>
      <span v-else>{{ getPolicyFailMessage }}</span>
    </div>
  </el-upload>
</template>

<script>
import { uuid } from '~/utils/util'

export default {
  name: 'upload',
  props: {
    // 上传列表
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
  data() {
    return {
      userId: this.$cache.get('USER_INFO', { id: null })
        ? this.$cache.get('USER_INFO', { id: null }).id
        : '0',

      // 阿里云配置信息
      uploadParams: {
        name: 'file',
        success_action_status: 200,
        key: '', // 上传文件后随机名字
        policy: '', // 阿里云凭证
        dir: '', // 阿里云存储目录
        OSSAccessKeyId: '', // 阿里云访问id
        signature: '' // 阿里云签名
      },
      enableUpload: false,
      url: '',
      timmer: null,
      getPolicyFailMessage: ''
    }
  },
  computed: {
    uploadFileList: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    disableUpload() {
      return this.disabled || !this.enableUpload
    }
  },
  methods: {
    // 获取阿里云授权信息
    getUploadPolicy() {
      this.enableUpload = false
      this.$api.taskDetail.getPolicy
        .query(
          {
            tenantCode: this.userId,
            moduleName: 'ross-portal',
            operationType: '1'
          },
          { needToast: false }
        )
        .then(({ data }) => {
          this.enableUpload = true
          this.uploadParams.dir = data.dir
          this.uploadParams.policy = data.policy
          this.uploadParams.OSSAccessKeyId = data.accessId
          this.uploadParams.signature = data.signature
          this.url = data.url
        })
        .catch(e => {
          //   this.$message.error(e.message)
          this.enableUpload = false
          this.getPolicyFailMessage = e.message
        })
    },

    emitList(fileList) {
      this.$emit('changeStatus', fileList)
      this.uploadFileList = fileList
      // 向上抛值
      if (this.value.length == 0) {
        this.$emit('uploadSuccess', fileList)
      }
    },

    onChange(file, fileList) {
      this.$emit('changeStatus', fileList)
    },

    onExceed(files, fileList) {
      if (this.outUrl !== '') {
        this.$message({
          message: '只支持上传一个文件，请删除前一个文件',
          type: 'warning'
        })
      }
    },

    // 文件上传前
    beforeUpload(file) {
      if (!this.enableUpload) {
        this.$message.error(this.getPolicyFailMessage || '初始化上传失败')
        return !this.enableUpload
      }
      const { dir } = this.uploadParams
      const fileTyle = this.getImageFileType(file.name)
      this.uploadParams.key = dir + uuid() + fileTyle
      /**
       * Magic Code
       * 将生成的key存储在file对象上， 在上传成功后会在file.raw里面
       */
      file.key = this.uploadParams.key
      let validType = this.validType(file)
      let validSize = this.validSize(file)
      if (!validType) {
        this.$message.error(this.typeMessage)
        return validType
      }
      if (!validSize) {
        this.$message.error(this.sizeMessage)
        return validSize
      }
      this.$emit('uploading', 0)
      clearTimeout(this.timmer)
      this.timmer = setTimeout(() => {
        this.$refs.elUpload.abort()
        this.$message.error('上传超时')
        this.$refs.elUpload.clearFiles()
      }, 10000)
      return true
    },
    // 上传失败
    handleError() {
      if (this.outUrl === '') {
        this.getUploadPolicy()
        this.$refs.elUpload.clearFiles()
        return
      } else {
        this.$message.error('文件上传失败!')
        this.$refs.elUpload.clearFiles()
      }
      this.$emit('uploading', 2)
    },

    // 移除文件
    handleRemove(file, fileList) {
      this.emitList(fileList)
    },
    // 移除前
    async beforeRemove(file, fileList) {
      if (!this.enableUpload) {
        return !this.enableUpload
      }
      if (!this.validType(file)) return true
      if (!this.validSize(file)) return true
      const result = await this.$confirm(`确定移除 ${file.name}？`)
      if (result) {
        this.$emit('remove', file)
        return true
      }
      return false
    },
    // 文件上传成功
    handleSuccess(res, file, fileList) {
      clearTimeout(this.timmer)
      if (this.outUrl !== '') {
        this.$emit('uploadFinish', res)
        this.$refs.elUpload.clearFiles()
        return
      }
      const { key } = file.raw
      const staticUrl = this.url + '/' + key
      file.url = staticUrl
      // file.name = file.name
      this.emitList(fileList)
      this.$emit('uploading', 1)
    },

    // 获取图片类型后缀
    getImageFileType(url) {
      return url.slice(url.lastIndexOf('.', url.length))
    },
    handleProgress() {
      this.$emit('uploading', 0)
    },
    validType(file) {
      let accept = this.accept === '' ? '*' : this.accept
      return new RegExp(
        '\\.(?:' +
          accept
            .replace(/\./g, '')
            .replace(/,/g, '|')
            .replace('*', '.*') +
          ')$',
        'i'
      ).test(file.name)
    },
    validSize(file) {
      return isNaN(Number(this.size))
        ? true
        : this.size <= 0
        ? true
        : file.size / 1024 / 1024 <= this.size
    },
    submitUpload() {
      this.$refs.elUpload.submit()
    }
  },
  created() {
    if (this.outUrl === '') {
      this.getUploadPolicy()
    } else {
      this.url = this.outUrl
      this.enableUpload = true
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  &.disable {
    /deep/ .el-upload-dragger {
      opacity: 0.45;
      &:hover {
        cursor: not-allowed;
      }
    }
  }
}
/deep/ .el-upload {
  display: block;
  &-dragger {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    width: auto;
    border-radius: 0;
  }
  .el-icon-upload {
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 34px;
  }
}
</style>
