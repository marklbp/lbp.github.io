<template>
    <div class="about ">
        <el-form class='pch-form' ref="form" :inline="true" label-position="right" label-width='130px'>
            <titleField>
                <h1 slot='title' class="leg-text">上传Logo</h1>
                <div slot='con'>
                    <div class='pch-upload-sign' :class="{ 'vee-control': true }">
                        <el-upload accept="image/*"  :before-upload="upbefore" :action="uploadImgurl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :show-file-list='true' :multiple='false' :limit="1" :auto-upload='true' :on-success='uploadSuccess' :file-list='attachments'>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <input type="hidden" v-model="uploadimgs" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('lender.area') }" name="uploadimgs">
                        <span v-show="errors.has('uploadimgs')" class="help is-danger">至少上传一张营业执照</span>
                    </div>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <div class='pch-bottom-btns'>
                        <el-button class='default-big-btn' type="primary" @click="onSubmit">完成</el-button>
                    </div>
                </div>
            </titleField>
        </el-form>
    </div>
</template>
<script>
    import Vue from 'vue'
    import api from '@/api'
    import {API_SERVER, UPLOAD_SERVER, UPLOAD_IMGS} from '~/config/config'
    import Storage from '@/plugins/storage'
    import titleField from '~/components/common/title-field/title-field'
    import {mapState} from 'vuex'
    export default {
        layout: 'org_layouts',
        // validate({ params, query }) {
        //   return query.ownerId // 如果参数有效
        // },
        components: {
            titleField
        },
        beforeCreate() {

        },
        computed: mapState({
            //: state => state.global.ownerId,
        }),
        data() {
            return {
                attachments: [],
                fileIds:[],
                uploadImgurl: UPLOAD_SERVER,
                uploadimgs: '',
                dialogImageUrl: '',
                dialogVisible: false,
                ownerId: this.$route.query.ownerId
            }
        },
        created() {
            this.initPage();
        },
        methods: {
            initPage(){
                api.getLogo({ownerId:this.$route.query.ownerId}).then((res)=>{
                    if(res&&res.data){
                        this.attachments = [res.data]
                        this.fileIds[0] = res.data.id;
                        this.dialogImageUrl = res.data.url
                    }
                })
            },
            onSubmit(){
                api.postLogo({ownerId:this.ownerId,fileId:this.fileIds[0]}).then((res)=>{
                   if(res.code==200){
                       this.$message({
                           message: '上传logo成功',
                           type: 'success'
                       });
                   }
                })
            },
            handleRemove(file, fileList) {
                this.fileIds = []
                this.uploadimgs = []
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            upbefore(file) {
                const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
                if (!isImg) {
                    this.$message.error('请上传有效图片')
                    return false
                }
                if (parseInt(file.size) >= UPLOAD_IMGS.val) {
                    this.$message.error('图片不能超过' + UPLOAD_IMGS.msg + ', 请重新上传!')
                    return false
                }
            },
            uploadSuccess(response, file, fileList) {
                //上传成功
                let self = this,
                    id = response.data.id;
                if (this.fileIds.indexOf(id) < 0) this.fileIds.push(id);
                this.uploadimgs = this.fileIds
                return false
                fileList.map(function (i, e) {
                    self.attachments.push({
                        location: response.fileUrl,
                        name: response.filename,
                        type: response.fileType,
                        size: i.size,
                        fileName: '营业执照'
                    })
                })
            },
        }
    };

</script>
