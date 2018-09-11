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
                {{form[index]||'-'}}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </titleField>
    <titleField v-if="form.contactsList">
      <h1 slot='title' class="leg-text">联系人信息</h1>
      <div slot='con'>
        <div>
        <el-table :fit=true :data="form.contactsList" style="width: 100%" class='pch-table' stripe>
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
      </div>
    </titleField>
    <titleField v-if="form.user">
      <h1 slot='title' class="leg-text">管理员信息</h1>
      <div slot='con'>
        <el-row :gutter="24">
          <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" >
            <div class="pch-detail-item">
              <div class="pch-detail-name">
                手机号：
              </div>
              <div class="pch-detail-con">
                {{form.user.userName||'未知'}}
              </div>
            </div>
          </el-col>
           <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" >
            <div class="pch-detail-item">
              <div class="pch-detail-name">
                姓名：
              </div>
              <div class="pch-detail-con">
                {{form.user.realName||'未知'}}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </titleField>
    <titleField>
      <h1 slot='title' class="leg-text">营业执照</h1>
      <div slot='con'>
        <div class="pch-detail-item pch-detail-img" v-for="(item,index) in form.fileUpLoads" :key='index'>
          <img :src="item.url" style="max-width: 100%" />
        </div>
      </div>
    </titleField>
  </div>
</template>
<script>
export {default} from './ids'
</script>
