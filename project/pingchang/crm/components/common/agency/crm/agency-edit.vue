<template>
  <div>
    <el-form v-if="currentForm == 'baseForm'" class='pch-form' ref="baseFom" :inline="true" label-position="right" label-width='160px'>
      <titleField>
        <h1 slot='title' class="leg-text">{{edit.baseForm.title}}</h1>
        <div slot='con'>
          <titleField v-if="index == edit.baseForm.table.length - 1 && !edit.baseForm.hiddenContact"
                  v-for="(row, index) in edit.baseForm.table"
                  :key="index" style="margin: 0 -20px;">
            <h1 slot="title" class="leg-text">联系人信息</h1>
            <div slot="con">
              <el-table :fit=true :data="form.preData.baseForm.contactsList" style="width: 100%" class='pch-table contact-table' stripe>
                <el-table-column v-for="(item, col) in row"
                             :key="col"
                             :prop="item.prop"
                             :label="item.label"></el-table-column>
              </el-table>
            </div>
          </titleField>
          <el-row v-else :key="index" :gutter="24">
            <el-col v-for="(col, idx) in row" :xs="24/row.length" :sm="24/row.length" :md="24/row.length" :lg="24/row.length" :xl="24/row.length" :key="idx">
              <el-form-item :label="col.label"
                            :for="col.htmlFor"
                            :class="{ 'vee-control': col.veeControl }" v-if="col.devs ? form.baseForm[col.devs[0]]: true">
                <el-date-picker v-if="col.type=='date'" v-for="(filed, i) in col.html"
                                v-model="form.baseForm[filed.name]"
                                :name="filed.name"
                                :type="filed.type"
                                :placeholder="filed.placeholder"
                                :key="i"
                                :class="{'input': true, 'is-danger': errors.has(filed.name)}"
                                :editable="false"
                                :disabled="filed.disabled"
                                v-validate="('required|'+(filed.name==='cooperativeStartDate'?'startDate:':'endDate:')+form.baseForm.cooperativeStartDate+','+form.baseForm.cooperativeEndDate)"
                                value-format="yyyy-MM-dd"
                                ></el-date-picker>
                <el-select v-else-if="col.type=='select'"
                           clearable
                           v-model="form.baseForm[filed.name]"
                           :placeholder="filed.placeholder"
                           v-validate="'required'"
                           :disabled="filed.disabled"
                           :class="{'input': true}"
                           :name="filed.name" @change="attachSelect($event, filed.name, col.attach)">
                  <el-option v-for="item in form.preData.baseForm[filed.name]"
                             :key="item.value"
                             :label="item.name"
                             :value="item.value"></el-option>
                </el-select>
                <div v-else-if="col.type =='dispicker'" class='pch-area'>
                  <v-distpicker
                             :placeholders="filed.placeholders"
                             :province="form.preData.baseForm.provinceId"
                             :city="form.preData.baseForm.cityId"
                             :area="form.preData.baseForm.areaId"
                             @selected="addressSelect"></v-distpicker>
                  <input type="hidden" :name="filed.name" v-validate="'required'" v-model="form.baseForm[filed.name]">
                </div>
                <el-input v-else
                              v-model="(filed.disabled ? form.preData.baseForm : form.baseForm)[filed.name]"
                              :name="filed.name"
                              :placeholder="filed.placeholder"
                              :key="i"
                              :disabled="filed.disabled"
                              :readonly="filed.readonly"
                              :class="{'input': true, 'is-danger': errors.has(filed.name)}"
                          v-validate="(col.veeControl?'required':'')"></el-input>
                <span v-show="errors.has(col.htmlFor)" class="help is-danger">{{ errors.first(col.htmlFor) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </titleField>
      <div class='pch-bottom-btns text-center'>
        <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onSave">保存</el-button>
        <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onNext">下一步</el-button>
      </div>
    </el-form>
    <el-form v-if="currentForm == 'guarantorForm'" class='pch-form' ref="guarantorForm" :inline="true" label-position="right" label-width='160px'>
      <titleField>
        <h1 slot='title' class="leg-text">{{edit.guarantorForm.title}}</h1>
        <div slot='con'>
          <el-row :gutter="24" v-for="(row, index) in edit.guarantorForm.table" :key="index">
            <el-col v-for="(col, idx) in row" :xs="24/row.length" :sm="24/row.length" :md="24/row.length" :lg="24/row.length" :xl="24/row.length" :key="idx">
              <el-form-item :label="col.label"
                            :for="col.htmlFor"
                            :class="{ 'vee-control': col.veeControl }" v-if="col.devs ? form.guarantorForm[col.devs[0]]: true">
                <el-radio-group v-if="col.type=='radio'" v-for="(filed, i) in col.html"
                                v-model="form.guarantorForm[filed.name]"
                                :name="filed.name"
                                :key="i" v-validate="'required'"
                                @change="attachGuarantorChange($event, filed.name, form.guarantorForm[filed.name])">
                  <el-radio v-if="x==0" v-for="(c, x) in filed.html"
                              :name="c.name"
                              :label="c.label"
                              :key="x">{{c.text}}</el-radio>
                  <el-radio   v-else :name="c.name"
                              :label="c.label"
                              :key="x">{{c.text}}</el-radio>
                </el-radio-group>
                <el-checkbox-group v-else-if="col.type=='checkbox'"
                                   v-model="form.guarantorForm[filed.name]"
                                   :key="i">
                  <el-checkbox v-for="(c, x) in filed.html"
                               :name="c.name"
                               :label="c.label"
                               :key="x"
                               v-validate="'required'">{{c.text}}</el-checkbox>
                </el-checkbox-group>
                <el-date-picker v-else-if="col.type=='date'"
                                v-model="form.guarantorForm[filed.name]"
                                :name="filed.name"
                                :type="filed.type"
                                :placeholder="filed.placeholder"
                                :key="i"
                                :class="{'input': true, 'is-danger': errors.has(filed.name)}"
                                :editable="false"
                                v-validate="('required|'+((filed.name==='bondBegin'||filed.name==='tempLimitBegin')?'startDate:':'endDate:')+(filed.name.indexOf('bond')>=0?form.guarantorForm.bondBegin:form.guarantorForm.tempLimitBegin)+','+(filed.name.indexOf('bond')>=0?form.guarantorForm.bondEnd:form.guarantorForm.tempLimitEnd))"
                                value-format="yyyy-MM-dd"></el-date-picker>
                <el-input v-else
                              v-model="form.guarantorForm[filed.name]"
                              :name="filed.name"
                              :placeholder="filed.placeholder"
                              :maxlength ="(col.maxLength?col.maxLength:100)"
                              :key="i"
                              :class="{'input': true, 'is-danger': errors.has(filed.name)}"
                              v-validate="('required'+(filed.name==='bondPercent'?'|decimal:2':''))"></el-input>
                <span v-show="errors.has(col.htmlFor)" class="help is-danger">{{ errors.first(col.htmlFor) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div class='pch-bottom-btns text-center'>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag"  @click="onPrev">上一步</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag"  @click="onSave">保存</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag"  @click="onNext">下一步</el-button>
          </div>
        </div>
      </titleField>
    </el-form>
    <el-form v-if="currentForm == 'outerForm'" class='pch-form' ref="outerForm" :inline="true" label-position="right" label-width='160px'>
      <titleField>
        <h1 slot='title' class="leg-text">{{edit.outerForm.title}}</h1>
        <div slot='con'>
          <el-row :gutter="24" v-for="(row, index) in edit.outerForm.table" :key="index">
            <el-col v-for="(col, idx) in row" :xs="24/row.length" :sm="24/row.length" :md="24/row.length" :lg="24/row.length" :xl="24/row.length" :key="idx">
              <el-form-item :label="col.label"
                            :for="col.htmlFor"
                            :class="{ 'vee-control': col.veeControl }" v-if="col.devs ? form.outerForm[col.devs[0]]: true">
                <el-radio-group v-if="col.type=='radio'" v-for="(filed, i) in col.html"
                                v-model="form.outerForm[filed.name]"
                                :name="filed.name"
                                :key="i" v-validate="'required'">
                  <el-radio v-for="(c, x) in filed.html.slice(0, pow(form.outerForm[filed.devs[0]]/10))"
                              :name="c.name"
                              :label="c.label"
                              :key="x">{{c.text}}</el-radio>
                </el-radio-group>
                <el-select v-else
                           clearable
                           v-model="form.outerForm[filed.name]"
                           :placeholder="filed.placeholder"
                           v-validate="'required'"
                           :disabled="filed.disabled"
                           :class="{'input': true, 'is-danger': errors.has(filed.name) }"
                           :name="filed.name" @change="attachSelect($event, filed.name, col.attach)">
                  <el-option v-for="item in filed.options"
                             :key="item.value"
                             :label="item.name"
                             :value="item.value"></el-option>
                </el-select>
                <span v-show="errors.has(col.htmlFor)" class="help is-danger">{{ errors.first(col.htmlFor) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div class='pch-bottom-btns text-center'>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onPrev">上一步</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onSave">保存</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onNext">下一步</el-button>
          </div>
        </div>
      </titleField>
    </el-form>
    <el-form v-if="currentForm == 'accountForm'" class='pch-form' ref="accountForm" :inline="true" label-position="right" label-width='160px'>
      <titleField>
        <h1 slot='title' class="leg-text">账号信息</h1>
        <input type="hidden" v-model="edit.accountForm.model"
                              v-validate="'required'"
                              :class="{'input': true, 'is-danger': errors.has(edit.accountForm.name) }"
                              :name="edit.accountForm.name">
        <div slot='con'>
          <el-button @click="showAddAccountModal" style="margin-bottom: 20px;">添加账号</el-button>
          <el-table :fit=true :data="form.preData.accountForm" style="width: 100%" class='pch-table contact-table' stripe>
            <el-table-column v-for="(item, index) in edit.accountForm.table"
                             :key="index"
                             :prop="item.prop"
                             :label="item.label"></el-table-column>
          </el-table>
          <div class='pch-bottom-btns text-center'>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onPrev">上一步</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onSave">保存</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onNext">下一步</el-button>
          </div>
        </div>
      </titleField>
    </el-form>
    <el-form v-if="currentForm == 'contactForm'" class='pch-form' ref="contactForm" :inline="true" label-position="right" label-width='160px'>
      <titleField>
        <h1 slot='title' class="leg-text">{{edit.contactForm.title}}</h1>
        <div slot='con'>
          <el-table :fit=true :data="form.contactForm.contactsList" style="width: 100%" class='pch-table contact-table' stripe>
            <el-table-column v-for="(item, index) in edit.contactForm.table"
                             :key="index"
                             :prop="item.prop"
                             :label="item.label">
                <template slot-scope="scope">
                  <div :class="{ 'vee-control': true }">
                    <el-input v-if="item.type=='text'"
                              v-model="scope.row[item.prop]"
                              :placeholder="item.label"
                              v-validate="item.rule"
                              :class="{'input': true, 'is-danger': errors.has(item.prop) }"
                              :name="item.prop+scope.row.index"></el-input>
                    <el-select v-else
                               clearable
                               v-model="scope.row[item.prop]"
                               placeholder="请选择"
                               v-validate="item.rule"
                               :class="{'input': true, 'is-danger': errors.has(item.prop+scope.row.index)}"
                               :name="item.prop + scope.row.index">
                      <el-option v-for="item in edit.contactForm.contactTypes"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value"></el-option>
                  </el-select>
                    <span class="help is-danger" v-show="errors.has(item.prop+scope.row.index)">请输入{{item.label}}</span>
                  </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="removeRow(scope)" type="text" size="small" :class='{"hide":scope.row.admin}'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class='pch-wrap-btns pull-right'>
            <el-button class='blue-md-btn ' type="text" size="small" @click="addRow">新增一行</el-button>
          </div>
          <div class='pch-bottom-btns text-center'>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onPrev">上一步</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onSave">保存</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onNext">下一步</el-button>
          </div>
        </div>
      </titleField>
    </el-form>
    <el-form v-if="currentForm == 'attachForm'" class='pch-form' ref="attachForm" :inline="true" label-position="right" label-width='130px'>
      <titleField>
        <h1 slot='title' class="leg-text">{{edit.attachForm.title}}</h1>
        <div slot='con'>
          <el-table :data="form.preData.attachForm.files">
            <el-table-column v-for="(item, col) in form.preData.attachForm.head"
                             :key="col"
                             :prop="item.prop"
                             :label="item.label">
                <template slot-scope="scope">
                  <span v-if="item.prop != 'file'">{{scope.row[item.prop]}}</span>
                  <!-- <img v-else :src="scope.row[item.prop].url||scope.row[item.prop].fileUrl" style="max-width: 100%"> -->
                  <Upload v-else :uploadCfg="{
                                  limit: 3, needPreview: true, fileList: scope.row.file, index: scope.row.index,success: uploadSuccess,remove:uploadRemove}"></Upload>
                </template>
            </el-table-column>
          </el-table>
          <div class="input-hidden" style="position:relative">
            <input type="hidden" v-model="form.attachForm.formList" name="formList" v-validate="'required'">
            <span v-show="errors.has('formList')" class="help is-danger">{{ errors.first('formList') }}</span>
          </div>
          <div class='pch-bottom-btns text-center'>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onPrev">上一步</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onSave">保存</el-button>
            <el-button class='default-big-btn' type="primary" :disabled="isClickFlag" @click="onCheck">提交</el-button>
          </div>
        </div>
      </titleField>
    </el-form>
    <el-dialog title="添加账号" :visible.sync="dialogAccountForm.visible" :center="true" width="40%" :before-close="beforeClose">
      <el-form :model="dialogAccountForm" ref="dialogAccountForm">
        <el-row :gutter="24">
          <el-col :xs="12" :sm='12' :md='12' :lg='12' :xl="12"
                  v-for="(item, index) in dialogAccountForm.inputs" :key="index">
            <el-form-item :label="item.label" :label-width="'100px'" class="vee-control">
              <el-select v-if="item.type=='select'"
                         v-model="dialogAccountForm.form[item.model]"
                         :placeholder="item.placeholder"
                         :class="{'is-danger': errors.has(item.model)}"
                         v-validate="'required'"
                         :name="item.model"
                         @change="acountAttachSelect($event,item.attach)">
                <el-option v-for="(opt, i) in form.preData.dialogAccountForm[item.model]"
                           :key="i"
                           :label="opt.name"
                           :value="opt.value"></el-option>
              </el-select>
              <el-input v-else v-model="dialogAccountForm.form[item.model]"
                        :placeholder="item.placeholder"
                        :class="{'is-danger': errors.has(item.model)}"
                        auto-complete="off"
                        v-validate="'required'"
                        :name="item.model"
                        :disabled="item.disabled"></el-input>
              <span v-show="errors.has(item.model)" class="help is-danger">{{ errors.first(item.model) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddAccount">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style type="text/scss" lang="scss" scoped>
@import "./edit.scss"
</style>
<script>
export {default} from './agency-edit.js'
</script>
