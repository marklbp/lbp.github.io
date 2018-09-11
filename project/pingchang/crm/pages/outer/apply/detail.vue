<template>
  <div class='content'>
    <div class='content-search_bar'>
      <el-form ref="form" :model="searchForm" label-width="80px">
        <el-form-item label="产品编号">
      <el-input placeholder="请输入内容" v-model="searchForm.searchCode" class="input-with-select">
        <template slot="prepend"><i class="lx-iconfont">&#xe660;</i></template>
        <el-button slot="append" type="primary" @click="onSearch">查询</el-button>
      </el-input>
      </el-form-item>
    </el-form>
    </div>
    <div class="content-tab_content">
      <el-table :data="lists.list" border>
        <el-table-column prop="id" label="申请编号" width="250"></el-table-column>
        <el-table-column prop="borrowName" label="客户名称" width="150"></el-table-column>
        <el-table-column prop="borrowCredentialsNo" label="证件号码" width="200"></el-table-column>
        <el-table-column prop="productName" label="产品名称" width="150"></el-table-column>
        <el-table-column prop="principalAmount" label="贷款金额（元）" width="150"></el-table-column>
        <el-table-column prop="guaranteeMethodType" label="担保方式" width="150" :formatter='guaranteeMethodTypeFormatter'></el-table-column>
        <el-table-column prop="null" label="申请件类型" width="150" :formatter='typeFormatter'></el-table-column>
        <el-table-column prop="applyStartDate" label="申请日期" width="200"></el-table-column>
        <el-table-column prop="applyUser" label="融资代表" width="150"></el-table-column>
        <el-table-column prop="channelName" label="经销商名称" width="150"></el-table-column>
        <el-table-column prop="applyDuration" label="进件时长" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="lookDetail(scope.row)" type="text" size="small">详情查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style lang="scss">
@import "../outaccount-apply-detail.scss"

</style>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      searchForm:{
         searchCode: '',
      }
    }
  },
  created() {},
  mounted() {
    this.$store.dispatch('getOuterApplyDetail');
  },
  methods: {
    lookDetail(row) {
      if(row.myTask.status == 'todo'){
        let url = "/outer/apply/detail?code="+row.id+"&taskId="+row.myTask.id;
        this.$router.push(url)
      }
    },
    typeFormatter(row, column) {
      // 申请件类型判断
      return row.myTask.isReply ? "新增件" : "退回件"
    },
    guaranteeMethodTypeFormatter(row, column) {
      // 担保方式判断
      return row.guaranteeMethodType == "Credit" ? "信用" : (row.guaranteeMethodType == "Mortgage" ? "抵押" : "质押")
    },
    onSearch(){

    }
  },
  computed: mapState({
    lists: state => state.outer.apply.lists,
  }),
  head () {
    return {
      title: '3213123123',
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  }
}

</script>
