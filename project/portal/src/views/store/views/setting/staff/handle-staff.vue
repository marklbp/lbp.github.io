<template>
  <div>
    <div class="operation">
      <el-button type="primary" icon="el-icon-plus" @click="openDialogVisible"
        >添加成员</el-button
      >
      <div class="operation_right">
        <div class="operation_right_import" @click="dialogVisible1 = true">
          <!-- <i class="el-icon-download icon"> -->
          <i class="icon-import font-icon"></i>导入
        </div>
      </div>
    </div>
    <div class="personnelManagement">
      <el-table
        :data="pesonnelList"
        style="width: 100%;"
        header-cell-class-name="header-cell-class-name"
        cell-class-name="cell-class-name"
      >
        <el-table-column prop="userName" label="姓名">
          <template slot-scope="{ row }">
            <span>{{ row.userName }}</span>
            <span class="super-master" v-if="row.owner ? true : false"
              >超级管理员</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="roles"
          :formatter="formatterRole"
          label="角色"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="formatterDate"
          label="加入时间"
        ></el-table-column>
        <el-table-column label="操作" width="128px">
          <template slot-scope="{ row }">
            <a @click="handlerEdit(row)" class="el-link el-link-first">编辑</a>
            <!-- 
            -->
            <a @click="handlerDelete(row)" class="el-link">移除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :page="page.currentPage"
      :total="page.total"
      @pageChange="handleCurrentChange"
      @sizeChange="handleSizeChange"
    />

    <el-dialog
      :title="form.id ? '编辑' : '添加成员'"
      width="400px"
      :visible.sync="dialogVisible"
    >
      <el-form :model="form" label-position="top">
        <div class="el-form-item">
          <div class="el-form-item__label_">成员</div>
          <filter-prop
            v-model="form.userName"
            ref="staffFilter"
            @search="getWorkersByName"
            :key="form.id"
            :id="form.id"
            :options="form.userNameOptions"
            :propsName="{ label: 'realName', value: 'userName' }"
            @updateOptions="handleOptions"
          >
            <template slot="labelStyle" slot-scope="scope">
              {{ ` (${scope.item.userName})` }}
            </template>
          </filter-prop>
        </div>
        <el-form-item label="角色" prop="userCode">
          <filter-prop
            :key="form.id"
            v-model="form.userCode"
            :options="form.userCodeOptions"
            :show-search="false"
          />
        </el-form-item>
        <el-form-item class="btns">
          <el-button size="mini" type="text" @click="closeDialogVisible"
            >取消</el-button
          >
          <el-button size="medium" type="primary" @click="handlerSubmit"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="提示" width="400px" :visible.sync="showDelete">
      <div class="delete-desc">是否确定移除该成员，移除后不可恢复</div>
      <div class="btns">
        <el-button type="text" size="mini" @click.native="closeDeleteDialog"
          >取消</el-button
        >
        <el-button type="danger" @click.native="confirmDelete" size="mini"
          >确定移除</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="导入" width="400px" :visible.sync="dialogVisible1">
      <div class="import_dialog">
        <div>
          <i class="icon-info-new font-icon"></i>请按照模版录入信息，
          <a href="/static/images/role-import.xlsx">下载模板</a>
        </div>
        <div class="import_dialog_extra">
          请上传.xls或.xlsx格式的文件，文件大小不超过500kb
        </div>
        <attachments
          ref="myAttachment"
          style="width: 100%;margin-top: 10px;"
          v-model="fileList"
          accept=".xlsx,.xls"
          :outUrl="outUrl"
          :headers="{ groupId: $route.params.storeId }"
          :showFileList="true"
          @changeStatus="changeStatus"
          @uploadFinish="uploadFinish"
        />
        <div class="import_dialog_footer">
          <el-button type="text" size="medium" @click="dialogVisible1 = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="medium"
            :disabled="!enableUpload"
            @click="submiteUpload"
            >确定导入</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog title="提示" width="400px" :visible.sync="dialogVisible2">
      <div class="import_failed">
        <div class="import_failed_item">
          导入成功数据：{{ uploadFinishData.successCount }}条
        </div>
        <div class="import_failed_item">
          导入失败数据：{{ uploadFinishData.errorCount }}条 &nbsp;&nbsp;
          <a href="javascript:;" @click="downloadExcel">下载</a>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'handle-staff',
  components: {
    Pagination: _ => import('~/components/pagination'),
    filterProp: _ => import('./filter-prop.vue'),
    attachments: _ => import('~/components/attachments')
  },
  data() {
    return {
      row: null,
      form: {
        id: null,
        userNameOptions: [],
        userName: [],
        userCodeOptions: [],
        userCode: []
      },
      dialogVisible: false,
      showDelete: false,
      pesonnelList: [],
      page: {
        currentPage: 1,
        pageSizes: [10, 50, 100, 500],
        size: 10,
        total: 10
      },
      dialogVisible1: false,
      dialogVisible2: false,
      fileList: [],
      outUrl: this.$helper.addPrefixUrl('/groupUser/importRoleExcel'),
      enableUpload: false,
      uploadFinishData: {
        errorDatas: [],
        errorList: [],
        excelErrorDatas: [],
        successList: [],
        failedList: [],
        successCount: 0,
        errorCount: 0
      }
    }
  },
  mounted() {
    this.httpconfig = {
      headers: {
        groupId: this.$route.params.storeId
      }
    }
    this.getGroupsWorks()
  },
  methods: {
    // 从新给userNameOptions赋值
    handleOptions(data) {
      this.form.userNameOptions = data
    },
    closeDeleteDialog() {
      this.showDelete = false
    },
    // 删除成员
    confirmDelete() {
      this.closeDeleteDialog()
      const { row } = this
      const promise = this.$api.groupUser.deleteUser(
        {
          id: row.id,
          groupId: row.groupId,
          roleIds: row.roleIds,
          userCode: row.code,
          userName: row.name
        },
        this.httpconfig
      )
      promise
        .then(res => {
          const { code } = res
          if (Object.is(code, '0')) {
            this.$message.success('删除成功')
            this.getGroupsWorks()
          }
        })
        .catch(err => err)
    },
    resetUserName() {
      this.form.userName.splice(0)
    },
    // 创建和更新成员参数的hander
    handlerSubmit() {
      let { form, $refs, $route } = this
      form = JSON.parse(JSON.stringify(form))
      const selectList = $refs.staffFilter.handleSelectList()
      const userName = selectList.map(item => ({
        userName: item.realName,
        userCode: item.userName,
        userId: item.id,
        groupId: $route.params.storeId
      }))

      const params = {
        roleIds: form.userCode
      }
      if (!form.id) {
        params.groupUsers = userName
        this.createUser(params)
      } else {
        params.id = form.id
        this.updateUser(params)
      }
    },
    // 创建成员
    createUser(params) {
      const promise = this.$api.groupUser.addUser(params, this.httpconfig)
      promise
        .then(res => {
          const { message, success } = res
          if (success) {
            this.getGroupsWorks()
            this.closeDialogVisible()
            this.$message.success('保存成功')
          } else {
            this.$message.error(message)
          }
        })
        .catch(err => err)
    },
    // 更新成员
    updateUser(params) {
      const promise = this.$api.groupUser.updateUser(params, this.httpconfig)
      promise
        .then(res => {
          const { message, success } = res
          if (success) {
            this.getGroupsWorks()
            this.closeDialogVisible()
            this.$message.success('更新成功')
          } else {
            this.$message.error(message)
          }
        })
        .catch(err => err)
    },
    closeDialogVisible() {
      this.dialogVisible = false
    },
    // 通过名字或工号获取员工数据
    async getWorkersByName(name = '') {
      if (name === '') return
      try {
        const res = await this.$api.workers.get({ name }, this.httpconfig)
        if (res.code === '0' && res.data) {
          const {
            data: { records: workers }
          } = res
          let sessionVal = this.$cache.session.get('newOptions')
          if (sessionVal && sessionVal.length) {
            workers.push(...sessionVal)
          }
          this.form.userNameOptions = this.uniqe(workers)
        }
      } catch (err) {}
    },
    // 去重
    uniqe(arr) {
      var result = []
      var obj = {}
      for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i].id]) {
          result.push(arr[i])
          obj[arr[i].id] = true
        }
      }
      return result
    },
    // 获取所有用户数据源
    getAllWorkers() {
      this.openDialogVisible()
      // this.getWorkersByName()
      this.getAllGroupRole()
    },
    openDialogVisible() {
      this.dialogVisible = true
      this.$cache.session.remove('newOptions')
    },
    // 获取当前店铺的员工列表
    getGroupsWorks() {
      const page = this.page
      const promise = this.$api.groupUser.getAll(
        {
          groupId: this.$route.params.storeId,
          page: page.currentPage,
          pageSize: page.size
        },
        this.httpconfig
      )
      promise
        .then(res => {
          const {
            data: { groupUsers, count }
          } = res
          this.page.total = count
          this.pesonnelList = groupUsers
        })
        .catch(err => err)
    },
    // 获取所有角色数据源
    getAllGroupRole() {
      const promise = this.$api.groupUser.getRole(
        {
          groupId: this.$route.params.storeId,
          page: '',
          pageSize: ''
        },
        this.httpconfig
      )
      promise
        .then(res => {
          const $roleList = res.data.records.map(item => {
            item.name = item.roleName
            item.code = item.id
            return item
          })
          this.form.userCodeOptions = $roleList
        })
        .catch(err => err)
    },
    handlerEdit(row) {
      const $row = JSON.parse(JSON.stringify(row))
      // console.log($row)
      const form = this.form
      form.id = $row.id
      form.userName = [$row.userCode]
      form.userCode = $row.roleIds || []
      this.form.userNameOptions = [
        {
          realName: $row.userName,
          userName: $row.userCode
        }
      ]
      console.log(form)
      this.openDialogVisible()
    },
    handlerDelete(row) {
      this.showDelete = true
      this.row = row
    },
    handleSizeChange(size) {
      const { page } = this
      page.size = size
      this.getGroupsWorks()
    },
    handleCurrentChange(currentPage) {
      const { page } = this
      page.currentPage = currentPage
      this.getGroupsWorks()
    },
    // 格式化时间
    formatterDate(row) {
      // debugger
      const date = new Date()
      date.setTime(row.createTime)
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? `0${month}` : month
      let day = date.getDate()
      day = day < 10 ? `0${day}` : day
      return `${year}-${month}-${day}`
    },
    // 格式化多个角色名
    formatterRole(row) {
      return (
        row &&
        row.roles instanceof Array &&
        row.roles.map(item => item && item.roleName).join(';  ')
      )
    },
    changeStatus(boo) {
      // 允许点击上传按钮
      this.enableUpload = boo
    },
    submiteUpload() {
      // 点击开始上传
      this.$refs.myAttachment.submitUpload()
    },
    uploadFinish(res) {
      // 上传成功的callback
      if (res && res.code && res.success && res.code === '0') {
        const data = res.data
        this.uploadFinishData = data
        if (Number(data.errorCount) > 0) {
          this.dialogVisible2 = true
        } else {
          this.$message({
            message: `成功导入${data.successCount}条数据`,
            type: 'success'
          })
        }
        this.dialogVisible1 = false
        if (Number(data.successCount) > 0) {
          this.page = {
            currentPage: 1,
            pageSizes: [10, 50, 100, 500],
            size: 10,
            total: 10
          }
          this.getGroupsWorks()
        }
      } else {
        this.$message.error('文件上传失败！')
      }
    },
    async downloadExcel(exportFileds) {
      // 下载excel
      try {
        const res = await this.$api.groupUser.exportErrorExcelData(
          this.uploadFinishData,
          {
            headers: {
              groupId: this.$route.params.storeId
            },
            responseType: 'blob'
          }
        )
        if (!res.data) throw Error('服务异常，请稍后再试')
        this.$helper.downloadByBinary(
          res.data,
          `report-download.xlsx`,
          'application/vnd.ms-excel;charset=utf-8'
        )
      } catch (err) {
        console.error(err)
        this.$message.error(err.message)
      }
    }
  },
  watch: {
    dialogVisible: {
      handler: function(val) {
        if (!val) {
          const form = this.form
          form.id = null
          form.userName.splice(0)
          form.userCode.splice(0)
          this.form.userNameOptions = []
        } else {
          this.getAllWorkers()
        }
      }
    },
    showDelete: {
      handler: function(val) {
        if (!val) {
          this.row = null
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped src="./staff.scss" />
