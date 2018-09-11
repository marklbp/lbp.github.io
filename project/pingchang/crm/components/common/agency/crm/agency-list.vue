<template>
  <div>
    <el-form :inline="true" class="patb">
      <el-form-item v-for="(item, index) in list.search"
                    :label="item.label"
                    :key="index">
        <el-select v-if="item.type=='select'" clearable
                   v-model="params[item.name]"
                   :placeholder="item.placeholder">
          <el-option v-for="opt in item.options"
                     :key="opt.value"
                     :label="opt.name"
                     :value="opt.value"></el-option>
        </el-select>
        <el-date-picker v-else-if="item.type=='date'"
                        v-model="params[item.name]"
                        :name="item.name"
                        :type="item.type"
                        :placeholder="item.placeholder"
                        :key="index"
                        :class="{'input': true}"
                        :editable="false"
                        value-format="yyyy-MM-dd"></el-date-picker>
        <el-input v-else v-model="params[item.name]"
                   :placeholder="item.placeholder"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
        <el-button v-if="list.isAcountModule" type="primary" @click="clearDataHandler">重置</el-button>
      </el-form-item>
    </el-form>
    <slot name="addApply"></slot>
    <elTablePage :fit="true"
                 :params="params"
                 :url="list.table.url"
                 :transforms="list.table.transforms"
                 ref="tablePagination">
      <el-table-column v-for="(col, index) in list.table.cols"
                       :prop="col.prop"
                       :label="col.label"
                       :key="index"></el-table-column>

      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="(list.module=='group'||list.module=='company'||list.module=='agency'
          ||((list.module==='store'||list.module==='shop')&&item.value==='modify'&&scope.row.status===0)
          ||((list.module==='store'||list.module==='shop')&&item.value!=='modify')) && ($route.query.system != 'saas')" v-for="(item,index) in menuBtnsList.tabButtonList" :key="index" :s="`${item.value}`" @click="eventBus(item.value,scope.row)" type="text" size="small">{{item.name}}</el-button>
          <el-button v-if="(list.module==='recordency' || $route.query.system == 'saas')&&scope.row.status===0"  @click="eventBus('edit',scope.row)" type="text" size="small">编辑</el-button>
          <el-button v-if="(list.module==='recordency' || $route.query.system == 'saas')&&scope.row.status!==0"  @click="eventBus('detail',scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </elTablePage>
  </div>
</template>
<style lang="scss">
@import "./list.scss";

</style>
<script>
export {default} from "./agency-list.js"
</script>
