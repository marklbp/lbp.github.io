<template>
  <div>
    <el-form :inline="true" class="patb">
      <el-form-item label="机构类型">
        <el-select clearable v-model="params.type" placeholder="请选择">
          <el-option label="0" :value="0">1</el-option>
          <el-option label="1" :value="1">1</el-option>
          <el-option label="2" :value="2">2</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-input v-model="params.name" placeholder="类型"></el-input>
      </el-form-item>
      <el-form-item label="机构ID">
        <el-input v-model="params.code" placeholder="机构名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
      </el-form-item>
    </el-form>
    <elTablePage :params="params" url="/lender/getInfoList" ref="tablePagination">
      <el-table-column prop="null" width="250" label="合作机构"></el-table-column>
      <el-table-column prop="id" width="250" label="ID"></el-table-column>
      <el-table-column prop="shortName" width="250" label="简称"></el-table-column>
      <el-table-column prop="type" width="250" label="类型"></el-table-column>
      <el-table-column prop="null" width="250" label="管理员"></el-table-column>
      <el-table-column prop="null" width="250" label="手机号"></el-table-column>
      <el-table-column prop="cooperativeStartDate" width="250" label="合作开始日"></el-table-column>
      <el-table-column prop="cooperativeEndDate" width="250" label="合作到期日"></el-table-column>
      <el-table-column prop="address" width="250" label="备注"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="lookDetail(scope.row)" type="text" size="small">机构配置</el-button>
        </template>
      </el-table-column>
    </elTablePage>
  </div>
</template>
<style lang="scss">
// @import "./lender.scss"

</style>
<script>
import elTablePage from '@/components/common/table-pagination/table-pagination'
import { mapState } from 'vuex';
import api from '@/api'
export default {
  components: {
    elTablePage
  },
  data() {
    return {
      params: { name: '', code: '', type: '' }
    }
  },
  computed: {
    lists() {
      return this.$store.state.guarantor.lists
    }
  },
  methods: {
    lookDetail(row) {
      let url;
      url = '/cooperation/about?ownerId='+row.id
      this.$router.push(url)
    },
    getTableData() {
      this.$refs.tablePagination.getTableData()
    }
  }
}

</script>
