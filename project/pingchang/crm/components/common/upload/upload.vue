<template>
	<div class="upload-container">
    <el-upload :before-upload="xbefore" 
               :accept="xaccept" 
               :action="xaction" 
               :list-type="xlistType" 
               :on-preview="xpreview" 
               :on-remove="xremove" 
               :show-file-list='xShowFileList' 
               :limit="xlimit" 
               :auto-upload='xAutoUpload' 
               :on-success='xsuccess'
               :on-exceed='xexceed' 
               :file-list='uploadCfg.fileList'>
      <i class="el-icon-plus"></i>
    </el-upload>
	  <el-dialog v-if="needPreview" :visible.sync="visible">
	    <img width="100%" :src="url" alt="">
	  </el-dialog>
	</div>
</template>

<script>
	import {API_SERVER, UPLOAD_SERVER,UPLOAD_IMGS} from '~/config/config'
	export default {
		props: {
			uploadCfg: {
				type: Object,
				default: ()=>({})
			}
		}
		,data(){
			let {action, accept, listType, limit, autoUpload, showFileList, needPreview} = this.uploadCfg
			return {
				fileIds: this.uploadCfg.fileList.map(f=>f.id)|| []
				,url: ''
				,visible: false
				,needPreview: needPreview || false 
				,xaction: action || UPLOAD_SERVER
				,xaccept: accept || 'image/*'
				,xlistType: listType || 'picture-card'
				,xlimit: isNaN(Number(limit)) ? 10 : Number(limit)
				,xAutoUpload: autoUpload !== undefined ? autoUpload : true
				,xShowFileList: showFileList !== undefined ? showFileList : true
			}
		}
		,methods: {
			xremove(file, fileList) {
        if (file) {
            let id = file.id
            this.fileIds.splice(this.fileIds.indexOf(id),1);
        }
        if('function' == typeof this.uploadCfg.remove)this.uploadCfg.remove(file, fileList, this)
      },
      xpreview(file) {
          this.url = file.url;
          this.visible = true;
          if('function' == typeof this.uploadCfg.preview)this.uploadCfg.preview(file, this)
      },
      xbefore(file) {
      	if(this.xaccept.indexOf('image/*') > -1){
          const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
          if (!isImg) {
              this.$message.error('请上传有效图片')
              return false
          }
          if (parseInt(file.size) >= UPLOAD_IMGS.val) {
              this.$message.error('图片不能超过'+UPLOAD_IMGS.msg+', 请重新上传!')
              return false
          }
        }
        if('function' == typeof this.uploadCfg.before)this.uploadCfg.before(file, this)
      },
      xsuccess(response, file, fileList) {
          //上传成功
          let self = this,
              id = response.data.id;
          if (this.fileIds.indexOf(id) < 0) this.fileIds.push(id);

          if('function' == typeof this.uploadCfg.success)this.uploadCfg.success(response, file, fileList, this)
      },
      xerror(err){
          this.$message.error('图片上传失败');
          if('function' == typeof this.uploadCfg.error)this.uploadCfg.error(err, this)
      }
    	,xexceed(files, fileList){
    		this.$message.error('超出文件上传数');
    		if('function' == typeof this.uploadCfg.exceed)this.uploadCfg.exceed(files, fileList, this)
    	}
    }
	}
</script>