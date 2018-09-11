<template>
  <div class="pch-detail">
    <titleField>
        <h1 slot='title' class="leg-text">开户</h1>
        <div slot='con'>
          <el-row :gutter="24">
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" v-for="(item,index) of detail" :key='index'>
              <div class="pch-detail-item">
                <div class="pch-detail-name">
                  {{item}}：
                </div>
                <div class="pch-detail-con">
                  {{form && form[index] || '-'}}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
    </titleField>
    <titleField v-if="form.contactsList">
      <h1 slot='title' class="leg-text">联系人信息</h1>
      <div slot='con'>
        <el-table  :fit=true :data="form.contactsList" style="width: 100%" class='pch-table' stripe>
          <el-table-column prop="realName" label="姓名" ></el-table-column>
          <el-table-column prop="type" label="职位" >
            <template slot-scope="scope">
              <span>{{getOptionsTypeVal(scope.row.type)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号码" ></el-table-column>
          <el-table-column prop="email" label="电子邮箱" ></el-table-column>
          <el-table-column prop="remark" label="备注" ></el-table-column>
        </el-table>
      </div>
    </titleField>
    <titleField v-if="form.user">
      <h1 slot='title' class="leg-text">管理员信息</h1>
      <div slot='con'>
        <el-row :gutter="24">
          <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" >
            <div class="pch-detail-item">
              <div class="pch-detail-name">
                手机号：
              </div>
              <div class="pch-detail-con">
                {{form.user.userName||'-'}}
              </div>
            </div>
          </el-col>
           <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" >
            <div class="pch-detail-item">
              <div class="pch-detail-name">
                姓名：
              </div>
              <div class="pch-detail-con">
                {{form.user.realName||'-'}}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </titleField>
    <titleField>
      <h1 slot='title' class="leg-text">营业执照</h1>
      <div slot='con'>
        <!--<el-row :gutter="24">-->
          <!--<el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" >-->
            <div class="pch-detail-item pch-detail-img" v-for="(item,index) in form.fileUpLoads" :key='index'>
              <img :src="item.url" style="max-width: 100%" />
            </div>
          <!--</el-col>-->
        <!--</el-row>-->
      </div>
    </titleField>
    <titleField v-if="lenderList">
      <h1 slot='title' class="leg-text">担保方信息</h1>
      <div slot='con'>
        <el-table  :fit=true :data="lenderList" style="width: 100%" class='pch-table' stripe>
          <el-table-column prop="code" label="担保方编号" ></el-table-column>
          <el-table-column prop="name" label="担保方名称" ></el-table-column>
          <el-table-column prop="cooperativeStartDate" label="合作开始日"></el-table-column>
          <el-table-column prop="cooperativeEndDate" label="合作结束日"></el-table-column>
        </el-table>
      </div>
    </titleField>
  </div>
</template>
<script>
export {default} from "./ids"

</script>
