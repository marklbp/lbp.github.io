<template>
  <div>
    <el-form class='pch-form' ref="form" :inline="true" label-position="right" label-width='130px'>
      <titleField>
        <h1 slot='title' class="leg-text">{{pageTitle}}</h1>
        <div slot='con'>
          <el-row :gutter="24">
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item :label="initpage.codeName" for="code">
                <el-input :disabled="true" v-model="form.code" name="code" type="text" :placeholder="initpage.codeName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item :label="initpage.formName" for="name" :class="{ 'vee-control': true }">
                <el-input v-model="form.name" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('name') }" name="name" type="text" :placeholder="initpage.formName"></el-input>
                <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item :label="initpage.formShortName" for="shortName" :class="{ 'vee-control': true }">
                <el-input v-model="form.shortName" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('shortName') }" name="shortName" type="text" :placeholder="initpage.formShortName"></el-input>
                <span v-show="errors.has('shortName')" class="help is-danger">{{ errors.first('shortName') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item v-if="!initpage.hiddenType" label="类型" for="type" :class="{ 'vee-control': true }">
                <el-select clearable v-model="form.type" placeholder="请选择" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('type') }" name="type">
                  <el-option v-for="item in lender_type" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <span v-show="errors.has('type')" class="help is-danger">{{ errors.first('type') }}</span>
              </el-form-item>
              <el-form-item v-if="initpage.showAgencyType" label="类型" for="agencyType" :class="{ 'vee-control': true }">
                <el-select v-model="form.agencyType" placeholder="请选择" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('agencyType') }" name="agencyType" @change="renderDiffAgencyType">
                  <el-option v-for="item in agencyTypes" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <span v-show="errors.has('agencyType')" class="help is-danger">{{ errors.first('agencyType') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" v-if="initpage.showGroup">
              <el-form-item label="所属集团" for="parentId" >
                <el-select name="group" clearable v-model="form.parentId" placeholder="请选择" :class="{'input': true, 'is-danger': errors.has('parentId') }">
                  <el-option v-for="item in groups" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <span v-show="errors.has('group')" class="help is-danger">{{ errors.first('group') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="证件类型" for="cardType" :class="{ 'vee-control': true }">
                <el-select clearable v-model="form.cardType" placeholder="请选择" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('cardType') }" name="cardType">
                  <el-option v-for="item in initpage.module != 'guarantor' ? company_type : cardList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <span v-show="errors.has('cardType')" class="help is-danger">{{ errors.first('cardType') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="证件号码" for="cardNo" :class="{ 'vee-control': true }">
                <el-input v-model="form.cardNo" v-validate="'required|alpha_num'" :class="{'input': true, 'is-danger': errors.has('cardNo') }" name="cardNo" type="text" placeholder="证件号码"></el-input>
                <span v-show="errors.has('cardNo')" class="help is-danger">{{ errors.first('cardNo') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="营业起始日" for="businessStartDate" :class="{ 'vee-control': true }">
                <el-date-picker :editable="false" @change='changedate' v-model="form.businessStartDate" type="date" v-validate="('required|startDate:'+form.businessStartDate+','+form.businessEndDate)" :class="{'input': true, 'is-danger': errors.has('businessStartDate') }" value-format="yyyy-MM-dd" name="businessStartDate" placeholder="营业起始日"></el-date-picker>
                <span v-show="errors.has('businessStartDate')" class="help is-danger">{{ errors.first('businessStartDate') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="营业到期日" for="businessEndDate" :class="{ 'vee-control': true }">
                <el-date-picker :editable=false v-model="form.businessEndDate" value-format="yyyy-MM-dd" type="date" v-validate="('required|endDate:'+form.businessStartDate+','+form.businessEndDate)" :class="{'input': true, 'is-danger': errors.has('businessEndDate') }" name="businessEndDate" placeholder="营业到期日"></el-date-picker>
                <span v-show="errors.has('businessEndDate')" class="help is-danger">{{ errors.first('businessEndDate') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" v-if="initpage.module.indexOf('agency') < 0">
              <el-form-item label="合作开始日" for="cooperativeStartDate" :class="{ 'vee-control': true }">
                <el-date-picker :editable="false" v-model="form.cooperativeStartDate" type="date" v-validate="('required|startDate:'+form.cooperativeStartDate+','+form.cooperativeEndDate)" :class="{'input': true, 'is-danger': errors.has('cooperativeStartDate') }" name="cooperativeStartDate" value-format="yyyy-MM-dd" placeholder="合作开始日"></el-date-picker>
                <span v-show="errors.has('cooperativeStartDate')" class="help is-danger">{{ errors.first('cooperativeStartDate') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6"  v-if="initpage.module.indexOf('agency') < 0">
              <el-form-item label="合作到期日" for="cooperativeEndDate" :class="{ 'vee-control': true }">
                <el-date-picker :editable="false" v-model="form.cooperativeEndDate" type="date" v-validate="('required|endDate:'+form.cooperativeStartDate+','+form.cooperativeEndDate)" :class="{'input': true, 'is-danger': errors.has('cooperativeEndDate') }" name="cooperativeEndDate" value-format="yyyy-MM-dd" placeholder="合作到期日"></el-date-picker>
                <span v-show="errors.has('cooperativeEndDate')" class="help is-danger">{{ errors.first('cooperativeEndDate') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="电子邮件" for="email" :class="{ 'vee-control': true }">
                <el-input v-model="form.email" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="电子邮件"></el-input>
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item :label="initpage.regCapitalName" for="regCapital" :class="{ 'vee-control': true }">
                <el-input v-model="form.regCapital" v-validate="'required|decimal'" :class="{'input': true, 'is-danger': errors.has('regCapital') }" name="regCapital" type="text" :placeholder="initpage.regCapitalNameHolder"></el-input>
                <span v-show="errors.has('regCapital')" class="help is-danger">{{ errors.first('regCapital') }}</span>
              </el-form-item>
            </el-col>
             <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" v-if="initpage.module == 'sp'">
              <el-form-item label="进件类型" for="loanType" :class="{ 'vee-control': true }">
                <el-select clearable v-model="form.loanType" placeholder="请选择" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('loanType') }" name="loanType">
                  <el-option v-for="item in loan_type" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <span v-show="errors.has('loanType')" class="help is-danger">{{ errors.first('loanType') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" v-if="initpage.module.indexOf('agency') < 0">
              <el-form-item label="法人" for="legalPerson" :class="{ 'vee-control': true }">
                <el-input v-model="form.legalPerson" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('legalPerson') }" name="legalPerson" type="text" placeholder="法人"></el-input>
                <span v-show="errors.has('legalPerson')" class="help is-danger">{{ errors.first('legalPerson') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" v-if="initpage.showTaxerType">
              <el-form-item label="纳税人类型" for="taxPayerType" :class="{ 'vee-control': true }">
                <el-select clearable v-model="form.taxPayerType" placeholder="请选择" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('taxPayerType') }" name="taxPayerType">
                  <el-option v-for="item in taxPayerTypes" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <span v-show="errors.has('taxPayerType')" class="help is-danger">{{ errors.first('taxPayerType') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6"  v-if="initpage.showTaxerType">
              <el-form-item label="纳税人识别号" for="taxPayerCode" :class="{ 'vee-control': true }">
                <el-input name="taxPayerCode" v-model="form.taxPayerCode" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('taxPayerCode') }" type="text" placeholder="纳税人识别号"></el-input>
                <span v-show="errors.has('taxPayerCode')" class="help is-danger">{{ errors.first('taxPayerCode') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" v-if="initpage.showNationality">
              <el-form-item label="国籍" for="nationality" :class="{ 'vee-control': true }">
                <el-input name="nationality" v-model="form.nationality" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('nationality') }" type="text" placeholder="国籍"></el-input>
                <span v-show="errors.has('nationality')" class="help is-danger">{{ errors.first('nationality') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="20" :sm="18" :md="16" :lg="12" :xl="12" class='pch-area'>
              <el-form-item label="注册地址" for="addressValidate" :class="{ 'vee-control': true }">
                <no-ssr>
                  <v-distpicker :placeholders="placeholders" :province="form.province" :city="form.city" :area="form.area" @selected="changeSelect"></v-distpicker>
                </no-ssr>
                <input type="hidden" v-model="addressValidate" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('addressValidate') }" name="addressValidate">
                <span v-show="errors.has('addressValidate')" class="help is-danger">{{ errors.first('addressValidate') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="6" :md="8" :lg="4" :xl="6" class='pch-address'>
              <el-form-item for="address">
                <el-input v-model="form.address" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('address') }" name="address" type="text" placeholder="详细注册地址"></el-input>
                <span v-show="errors.has('address')" class="help is-danger">详细注册地址不能为空</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </titleField>
      <titleField>
        <h1 slot='title' class="leg-text">联系人信息</h1>
        <div slot='con'>
          <el-table :fit=true :data="form.contactsList" style="width: 100%" class='pch-table contact-table' stripe>
            <el-table-column prop="realName" label="姓名">
              <template slot-scope="scope">
                <div :class="{ 'vee-control': true }">
                  <el-input :maxlength="30" v-model="form.contactsList[scope.row.index].realName" placeholder="请输入内容" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(`form.contactsList[${scope.row.index}].realName`) }" :name="`form.contactsList[${scope.row.index}].realName`"></el-input>
                  <span class="help is-danger" v-show="errors.has(`form.contactsList[${scope.row.index}].realName`)">请输入姓名</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="职位" >
              <template slot-scope="scope">
                <div :class="{ 'vee-control': true }">
                  <!--<el-input v-model="scope.row.type" placeholder="请输入内容" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(`form.contactsList${scope.row.index}.type`) }" :name="`form.contactsList${scope.row.index}.type`"></el-input>-->
                  <el-select clearable v-model="form.contactsList[scope.row.index].type" placeholder="请选择" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(`form.contactsList[${scope.row.index}].type`) }" :name="`form.contactsList[${scope.row.index}].type`">
                    <el-option v-for="item in contactType" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                  <span class="help is-danger" v-show="errors.has(`form.contactsList[${scope.row.index}].type`)">请输入职位</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号码" >
              <template slot-scope="scope">
                <div :class="{ 'vee-control': true }">
                <el-input v-model="form.contactsList[scope.row.index].mobile" placeholder="请输入内容" v-validate="'required|mobile'" :class="{'input': true, 'is-danger': errors.has(`form.contactsList[${scope.row.index}].mobile`) }" :name="`form.contactsList[${scope.row.index}].mobile`"></el-input>
                <span class="help is-danger" v-show="errors.has(`form.contactsList[${scope.row.index}].mobile`)">请输入手机号码</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="电子邮箱" >
              <template slot-scope="scope">
                <div :class="{ 'vee-control': true }">
                <el-input v-model="form.contactsList[scope.row.index].email" :maxlength="64" placeholder="请输入内容" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has(`form.contactsList[${scope.row.index}].email`) }" :name="`form.contactsList[${scope.row.index}].email`"></el-input>
                <span class="help is-danger" v-show="errors.has(`form.contactsList[${scope.row.index}].email`)">请输入电子邮箱</span>
             </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" placeholder="请输入内容" ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-button @click="removeRow(scope)" type="text" size="small" :class='{"hide":scope.row.admin}'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class='pch-wrap-btns pull-right'>
            <el-button class='blue-md-btn ' type="text" size="small" @click="addRow">新增一行</el-button>
          </div>
        </div>
      </titleField>
      <titleField>
        <h1 slot='title' class="leg-text">管理员信息</h1>
        <div slot='con'>
          <el-row :gutter="24">
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="手机号码" for="userName" :class="{ 'vee-control': true }">
                <el-input placeholder="请输入内容" v-model="user.userName" class="input-with-select" v-validate="'required|mobile'" :class="{'input': true, 'is-danger': errors.has('userName') }" name='userName' :disabled="isUpdate">
                  <el-button slot="append" icon="el-icon-search" v-if="!isUpdate" @click='searchAdmin'></el-button>
                </el-input>
                <span v-show="errors.has('userName')" class="help is-danger">{{ errors.first('userName') }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="姓名" for="realName" :class="{ 'vee-control': true }">
                <el-input v-model="user.realName" readonly v-validate="'required'" class="input is-disabled" :class="{'is-danger': errors.has('realName') }" name="realName" type="text" placeholder="根据左侧手机号点击搜索输入姓名"></el-input>
                <span v-show="errors.has('realName')" class="help is-danger">请输入姓名</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </titleField>
      <titleField>
        <h1 slot='title' class="leg-text">上传营业执照</h1>
        <div slot='con'>
          <div class='pch-upload-sign' :class="{ 'vee-control': true }">
            <el-upload :before-upload="upbefore" accept="image/*" :action="uploadImgurl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :show-file-list='true' :multiple='true' :auto-upload='true' :on-success='uploadSuccess' :file-list='attachments'>
              <i class="el-icon-plus"></i>
            </el-upload>
            <input type="hidden" v-model="uploadimgs" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('uploadimgs') }" name="uploadimgs">
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
    <!-- 新增管理员modal -->
    <no-ssr>
      <modal name="set-admin-modal" width="800px" height="auto" class='pch-form-modal' :clickToClose="false">
        <h3 class="pch-modal-title">新增管理员</h3>
       <setAdmin :user2="user" :name2="form.name" ref="setAdminAdd" @setAdminEvt="setAdmin">
          <div slot="pch-modal-footer">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="pch-modal-btns">
                <el-button class='default-sm-btn ' type="text" size="small" @click="qr">完成</el-button>
                <el-button class='blue-sm-btn ' type="text" size="small" @click="hideModal">关闭</el-button>
              </div>
            </el-col>
          </div>
        </setAdmin>
      </modal>
    </no-ssr>
  </div>
</template>

<style lang="scss">
@import "./edit.scss"
</style>

<script>
export {default} from './edit.js'
</script>
