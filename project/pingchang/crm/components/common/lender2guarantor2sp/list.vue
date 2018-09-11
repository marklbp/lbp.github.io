<template>
  <div>
    <el-form :inline="true" class="patb">
      <el-form-item :label="searchForm.labelCode">
        <el-input v-model="params.code" :placeholder="searchForm.placeholderCode"></el-input>
      </el-form-item>
      <el-form-item :label="searchForm.labelName">
        <el-input v-model="params.name" :placeholder="searchForm.placeholderName"></el-input>
      </el-form-item>
      <el-form-item :label="searchForm.labelType" v-if="searchForm.showType">
        <el-select clearable v-model="params.agencyType" placeholder="请选择" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('type') }" name="type">
          <el-option v-for="item in agencyTypes" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
      </el-form-item>
    </el-form>
    <elTablePage :fit="true" :params="params" :url="table.url ? table.url : '/'+ table.module +'/getInfoList'" ref="tablePagination">
      <el-table-column prop="code" :label="table.code"></el-table-column>
      <el-table-column prop="name" :label="table.name"></el-table-column>
      <el-table-column prop="agencyName" :label="table.agencyName" v-if="table.showAgencyName"></el-table-column>
      <el-table-column prop="parentName" :label="table.groupName" v-if="table.showGroupName"></el-table-column>
      <el-table-column prop="lenderName" :label="table.lenderName" v-if="table.showLenderName"></el-table-column>
      <el-table-column prop="shortName" v-if="table.module == 'lender' || table.showShortName" :label="table.shortNameLabel||'简称'"></el-table-column>
      <el-table-column v-if="!table.hiddenType" prop="typeName"  label="类型"></el-table-column>
      <el-table-column v-if="table.showAgencyType" prop="agencyType"  label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.agencyType|transformType(agencyTypes)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.module == 'sp'" prop="legalPerson"  label="法人"></el-table-column>
      <el-table-column v-if="!table.hiddenBusinessStartDate" prop="businessStartDate"  label="营业起始日"></el-table-column>
      <el-table-column v-if="!table.hiddenBusinessStartDate" prop="businessEndDate" label="营业到期日"></el-table-column>
      <el-table-column v-if="!table.hiddenCooperativeStartDate" prop="cooperativeStartDate" label="合作开始日"></el-table-column>
      <el-table-column v-if="!table.hiddenCooperativeStartDate" prop="cooperativeEndDate" label="合作到期日"></el-table-column>
      <el-table-column v-if="!table.hiddenAddress" prop="address"  label="注册地址">
        <template slot-scope="scope">
          <p>{{parseAddress(scope.row.province, scope.row.city, scope.row.area).join("") + scope.row.address}}</p>
        </template>
      </el-table-column>
      <el-table-column v-if="table.showAccountCreatedDate" prop="createdAt"  label="开户时间"></el-table-column>
      <el-table-column v-if="table.showAccountCreator" prop="createdUser"  label="开户人"></el-table-column>
      <el-table-column v-if="!table.hiddenRegCapital" prop="regCapital"  :label="table.regCapital || '注册资本(万美金)'"></el-table-column>
      <el-table-column prop="status" :label="table.status" v-if="table.showStatus"></el-table-column>
      <el-table-column prop="area" :label="table.area" v-if="table.showArea"></el-table-column>
      <el-table-column prop="city" :label="table.city" v-if="table.showCity"></el-table-column>
      <el-table-column prop="applyDate" :label="table.applyDate" v-if="table.showApplyDate"></el-table-column>
      <el-table-column prop="applier" :label="table.applier" v-if="table.showApplier"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <!-- <el-button @click="lookDetail(scope.row,'look')" type="text" size="small">查看</el-button>
          <el-button @click="lookDetail(scope.row,'update')" type="text" size="small">编辑</el-button>
          <el-button @click="lookDetail(scope.row,'bind')" type="text" size="small">{{table.bindText}}</el-button>
          <el-button @click="lookDetail(scope.row,'set')" type="text" size="small">变更管理员</el-button> -->
          <el-button v-for="(item,index) in menuBtnsList.tabButtonList" :key="index" :s="`${item.value}`" @click="eventBus(item.value,scope.row)" type="text" size="small">{{item.name}}</el-button>
        </template>
      </el-table-column>
    </elTablePage>
    <!-- 担保方绑定 -->
    <no-ssr>
      <modal name="bind-way" width="800px" height="auto" class='pch-form-modal pch-transfer-modal' :clickToClose="false">
        <h3 class="pch-modal-title">{{table.bindText}}</h3>
        <el-form class='pch-form' ref="form" :inline="true" label-position="right" label-width='130px'>
          <template>
            <el-transfer v-model="bindVal" :props="bindwayData" :data="lists" filterable :filter-method="filterMethod" filter-placeholder="请输入担保方名称" :titles="titleFormat" @change="bindDataChange">
            </el-transfer>
          </template>
          <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="pch-modal-btns">
                <el-button class='default-sm-btn ' type="text" size="small" @click="qr">提交</el-button>
                <el-button class='blue-sm-btn ' type="text" size="small" @click="hideModal">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </modal>
    </no-ssr>
    <!-- 更改管理员modal -->
    <no-ssr>
      <modal name="adminModal" width="800px" height="auto" class='pch-form-modal' :clickToClose="false">
        <setAdmin :user="newUserAdmin" :oldUserAdmin="oldUserAdmin">
          <div slot="pch-modal-footer">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="pch-modal-btns">
                <el-button class='default-sm-btn ' type="text" size="small" @click="setOver">完成</el-button>
                <el-button class='blue-sm-btn ' type="text" size="small" @click="hideAdminModal">取消</el-button>
              </div>
            </el-col>
          </div>
        </setAdmin>
      </modal>
    </no-ssr>
  </div>
</template>
<style lang="scss">
@import "./list.scss"

</style>
<script>
export {default} from "./list.js"
</script>