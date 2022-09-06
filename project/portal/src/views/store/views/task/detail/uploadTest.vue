<template>
  <div class="slot">
    <slot :uploadParams="uploadParams"></slot>
  </div>
</template>

<script>
import { uuid } from '~/utils/util'
export default {
  name: 'uploadTest',
  inject: ['groupId'],
  data() {
    return {
      userId: this.$cache.get('USER_INFO').id,

      // 阿里云配置信息
      uploadParams: {
        name: 'file',
        success_action_status: 200,
        key: '', // 上传文件后随机名字
        policy: '', // 阿里云凭证
        dir: '', // 阿里云存储目录
        OSSAccessKeyId: '', // 阿里云访问id
        signature: '' // 阿里云签名
      }
    }
  },
  methods: {
    fetchTooken() {
      this.$api.getPolicy
        .query(
          {
            tenantCode: this.userId,
            moduleName: 'ross',
            operationType: '1'
          },
          {
            headers: {
              groupId: this.groupId
            }
          }
        )
        .then(({ data }) => {
          this.uploadParams.key = data.dir + uuid()
          this.uploadParams.dir = data.dir
          this.uploadParams.policy = data.policy
          this.uploadParams.OSSAccessKeyId = data.accessId
          this.uploadParams.signature = data.signature
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    }
  },
  created() {
    this.fetchTooken()
  }
}
</script>
<style lang="scss" scoped></style>
