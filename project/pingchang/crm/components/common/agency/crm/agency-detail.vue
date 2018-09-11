<template>
  <div class="pch-detail">
    <titleField v-for="(item, index) in detail"
                :key="index">
        <h1 slot='title' class="leg-text">{{item.title}}</h1>
        <div slot='con'>
          <el-row :gutter="24" v-if="item.module=='base'||item.module =='outaccount'||item.module=='guarantor'||(item.module =='account'&&($route.query.agencyType=='store'||$route.query.agencyType=='shop'))">
            <el-col v-for="(v, k) in item.content"
                    :key='k'
                    :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <div class="pch-detail-item">
                <div class="pch-detail-name">
                  {{v}}：
                </div>
                <div class="pch-detail-con">
                  {{form[item.module] && form[item.module][k] || '-'}}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-table  v-else-if="item.module == 'contact' || (item.module == 'lender')||(item.module =='account'&&($route.query.agencyType=='company'||$route.query.agencyType=='agency'))" :fit=true :data="form[item.module]" style="width: 100%" class='pch-table' stripe>
            <el-table-column v-for="(col, i) in item.content" :prop="col.prop" :label="col.label" :key="i"></el-table-column>
          </el-table>

          <el-table  v-else-if="item.module =='file'" :fit=true :data="form[item.module]" style="width: 100%" class='pch-table' stripe>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column v-for="(col, i) in item.content" :prop="col.prop" :label="col.label" :key="i"></el-table-column>

            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click="openFileDeltail(scope.row.fileUrl)" type="text" size="small">查看详细信息</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-else-if="item.module == 'files'" class="files">
            <div class="pch-detail-item pch-detail-img"
                 v-for="(file,fi) in form[item.module]"
                 v-if="file"
                 :key='fi'>
              <img :src="file.url||file.fileUrl||file.src" style="max-width: 100%" />
            </div>
            <p v-else>-</p>
          </div>

          <div v-else>-</div>
        </div>
    </titleField>

  </div>
</template>
<script>
export {default} from "./agency-detail"
</script>
