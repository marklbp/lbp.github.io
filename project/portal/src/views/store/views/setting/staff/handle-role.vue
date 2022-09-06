<template>
  <div>
    <div class="operation">
      <!-- <el-button type="primary" icon="el-icon-plus" @click="openDialogVisible('add')">新增角色</el-button> -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="openDialogVisible('add')"
      >
        新增角色
        <!-- <router-link :to="'/' + $route.params.storeId + '/setting/operation' + '/1'">新增角色</router-link> -->
      </el-button>
    </div>
    <div class="personnelManagement">
      <el-table
        :data="roleList"
        style="width: 100%;"
        header-cell-class-name="header-cell-class-name"
        cell-class-name="cell-class-name"
      >
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="roleCount" label="员工数"></el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="formatterDate"
          label="创建时间"
        ></el-table-column>
        <el-table-column label="修改人">
          <template slot-scope="{ row }">{{
            row.modifyName ? row.modifyName : '系统'
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="128px">
          <template slot-scope="{ row }" v-if="row.isHandle">
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
      :title="form.id ? '编辑角色' : '添加角色'"
      width="400px"
      :visible.sync="dialogVisible"
    >
      <el-form :model="form" label-position="top" ref="form">
        <el-form-item
          label="角色名称"
          prop="roleName"
          :rules="[
            { required: true, message: '请输入角色名', trigger: 'blur' },
            {
              min: 1,
              max: 30,
              message: '长度在 30 个字符以内',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button size="mini" type="text" @click="closeDialogVisible"
            >取消</el-button
          >
          <el-button size="medium" type="primary" @click="handlerSubmit('form')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提示" width="400px" :visible.sync="showDelete">
      <div class="delete-desc">是否确定移除该角色，移除后不可恢复</div>
      <div class="btns">
        <el-button type="text" size="mini" @click.native="showDelete = false"
          >取消</el-button
        >
        <el-button type="danger" @click.native="confirmDelete" size="mini"
          >确定移除</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'handle-role',
  components: {
    Pagination: _ => import('~/components/pagination')
  },
  data() {
    return {
      delList: null,
      form: {
        id: null,
        roleName: ''
      },
      dialogVisible: false,
      showDelete: false,
      roleList: [],
      page: {
        currentPage: 1,
        pageSizes: [10, 50, 100, 500],
        size: 10,
        total: 10
      }
    }
  },
  mounted() {
    this.httpconfig = {
      headers: {
        groupId: this.$route.params.storeId
      }
    }
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      const page = this.page
      const promise = this.$api.groupUser.getRole(
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
            data: { records, totalCount }
          } = res
          this.page.total = totalCount
          this.roleList = records.map(item => {
            if (item.roleName == 'owner' || item.roleName == '店长') {
              item.isHandle = false
            } else {
              item.isHandle = true
            }
            return item
          })
        })
        .catch(err => {
          console.log(err)
        })
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
      let hours = date.getHours()
      hours = hours < 10 ? `0${hours}` : hours
      let minutes = date.getMinutes()
      minutes = minutes < 10 ? `0${minutes}` : minutes
      let seconds = date.getSeconds()
      seconds = seconds < 10 ? `0${seconds}` : seconds
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 新增角色
    handlerSubmit(val) {
      this.$refs[val].validate(valid => {
        if (valid) {
          const promise = this.$api.groupUser.addRole(
            {
              roleName: this.form.roleName,
              groupId: this.$route.params.storeId,
              id: this.form.id
            },
            this.httpconfig
          )
          promise
            .then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.closeDialogVisible()
                this.getRoleList()
              }
            })
            .catch(err => err)
        } else {
          return false
        }
      })
    },

    openDialogVisible(type = '') {
      if (type == 'add') {
        // this.form.id = null
        // this.form.roleName = ''
        this.$router.push({
          path: `/${this.$route.params.storeId}/setting/staff/edit`
        })
      }
      //this.dialogVisible = true
    },

    closeDialogVisible() {
      this.dialogVisible = false
    },

    // 编辑角色
    handlerEdit(row) {
      let { roleName, groupId, id } = row
      this.form.id = id
      this.form.roleName = roleName
      this.$router.push({
        path: `/${this.$route.params.storeId}/setting/staff/edit`,
        query: {
          id: this.form.id,
          roleName: this.form.roleName
        }
      })
      // this.openDialogVisible()
    },

    handlerDelete(row) {
      this.showDelete = true
      this.delList = row
    },

    // 删除角色
    confirmDelete() {
      const promise = this.$api.groupUser.delRole(
        {
          id: this.delList.id,
          roleCount: this.delList.roleCount
        },
        this.httpconfig
      )
      promise
        .then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.showDelete = false
            this.getRoleList()
          }
        })
        .catch(err => err)
    },

    // 分页处理
    handleSizeChange(size) {
      const { page } = this
      page.size = size
      this.getRoleList()
    },

    handleCurrentChange(currentPage) {
      const { page } = this
      page.currentPage = currentPage
      this.getRoleList()
    }
  }
}
</script>
<style lang="scss" scoped src="./staff.scss" />
