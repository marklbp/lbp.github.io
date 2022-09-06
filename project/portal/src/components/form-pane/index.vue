<template>
  <div class="form-pane-container">
    <div class="form-pane-mask" :class="[isActive ? 'active' : '']"></div>
    <el-form
      class="form-pane"
      :class="[isActive ? 'active' : '']"
      :model="form"
      :rules="rules"
      ref="form"
    >
      <i @click="cancel" class="btn-close el-icon-close"></i>
      <el-tabs class="custom-tabs" v-model="activeTab">
        <el-tab-pane label="基础信息" name="0">
          <el-form-item
            v-if="formItems.label && formItems.label.show"
            size="small"
            :label="formItems.label.name"
            prop="label"
          >
            <el-input
              v-if="formItems.label.edit"
              v-model="form.label"
              maxlength="30"
              class="label_box"
              show-word-limit
              placeholder="请输入"
            />
            <template v-else>{{ form.label }}</template>
          </el-form-item>
          <!-- 服务选择 -->
          <el-form-item
            v-if="formItems.service && formItems.service.show"
            size="small"
            :label="formItems.service.name"
            prop="service"
          >
            <el-select
              v-model="form.service"
              :disabled="!formItems.service.edit"
              @change="handleServiceChange"
              style="width:100%;"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="{ ministryName, ministryLabel } in services"
                :key="ministryLabel"
                :label="ministryName"
                :value="ministryLabel"
              />
            </el-select>
          </el-form-item>
          <!-- 服务表单 -->
          <service-form
            v-if="type === 4"
            ref="serviceForm"
            :disabled="!formItems.service.edit"
            :formDatas="serviceForms"
          />

          <el-form-item
            v-if="
              formItems.executorPost &&
                formItems.executorPost.show &&
                form.executorPost
            "
            size="small"
            :label="formItems.executorPost.name"
            prop="executorPost"
          >
            <el-input
              v-if="formItems.executorPost.edit"
              v-model="form.executorPost"
              maxlength="6"
              class="label_box"
              show-word-limit
            />
            <template v-else>{{ form.executorPost }}</template>
          </el-form-item>
          <el-form-item
            v-if="formItems.category && formItems.category.show"
            size="small"
            :label="formItems.category.name"
            prop="category"
            :disabled="disableAddCategory"
          >
            <el-select
              v-model="form.category"
              v-if="formItems.category.edit"
              style="width:100%;"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="({ name, id }, i) in categories"
                :key="i + Math.random()"
                :label="name"
                :value="id"
              />
            </el-select>
            <template v-else>{{ form.category }}</template>
          </el-form-item>
          <el-form-item
            v-if="formItems.assignee && formItems.assignee.show"
            size="small"
            :label="formItems.assignee.name"
            prop="assignee"
            style="position: relative; z-index: 1"
          >
            <!-- <peoples-select
              v-if="formItems.assignee.edit"
              :is-delete="true"
              :edit="assignee.length <= 0"
              v-model="assignee"
              :data="executor"
            />-->
            <el-select
              v-if="formItems.assignee.edit"
              style="width: 100%;"
              filterable
              size="small"
              v-model="assigneeIds"
              ref="elselect"
              popper-class="filter-prop-popper"
            >
              <el-option
                v-for="(item, index) in persons"
                :key="'opratePerson' + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formItems.startTime && formItems.startTime.edit"
            size="small"
            :label="formItems.startTime.name"
            prop="startTime"
          >
            <el-date-picker
              v-if="formItems.startTime.edit"
              v-model="startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              default-time="00:00:00"
            />
            <template v-else>{{ form.startTime }}</template>
          </el-form-item>
          <el-form-item
            v-if="formItems.endTime && formItems.endTime.edit"
            size="small"
            :label="formItems.endTime.name + ''"
            prop="endTime"
          >
            <el-date-picker
              v-if="formItems.endTime.edit"
              v-model="endTime"
              type="datetime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              default-time="23:59:59"
            />
            <template v-else>{{ form.endTime }}</template>
          </el-form-item>
          <el-form-item
            v-if="formItems.priority && formItems.priority.show"
            size="small"
            :label="formItems.priority.name"
            prop="priority"
          >
            <el-select
              v-model="form.priority"
              v-if="formItems.priority.edit"
              style="width:100%;"
              placeholder="请选择"
            >
              <el-option
                v-for="({ name, id }, i) in $constant.PRIORITIES"
                :key="i + Math.random()"
                :label="name"
                :value="id"
              />
            </el-select>
            <template v-else>{{ form.category }}</template>
          </el-form-item>
          <!-- tag start -->
          <el-form-item
            v-if="formItems.tags && formItems.tags.show"
            size="small"
            :label="formItems.tags.name"
            prop="tag"
          >
            <ross-tag v-model="form.tags" />
          </el-form-item>
          <!-- tag end -->
          <el-form-item
            v-if="formItems.copyPerson && formItems.copyPerson.show"
            size="small"
            :label="formItems.copyPerson.name"
            prop="copyPerson"
          >
            <el-select
              v-if="formItems.copyPerson.edit"
              style="width: 100%;"
              filterable
              multiple
              size="small"
              v-model="copyPersonIds"
              ref="elselect"
              popper-class="filter-prop-popper"
            >
              <el-option
                v-for="(item, index) in persons"
                :key="'opratePerson' + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <template v-else>{{ form.copyPerson }}</template>
          </el-form-item>
          <el-form-item
            v-if="formItems.tools && formItems.tools.show"
            :label="formItems.tools.name"
            prop="tools"
          >
            <tools
              v-model="tools"
              :addable="!!formItems.tools.edit"
              :deletable="!!formItems.tools.delete"
            />
          </el-form-item>
          <el-form-item
            v-if="formItems.subFlow && formItems.subFlow.show"
            :label="formItems.subFlow.name"
            prop="subFlow"
          >
            <select-load-by-page
              v-if="formItems.subFlow.edit"
              v-model="subFlow"
              :optionList="templates"
              :loading="subFlowLoading"
              @loadmore="loadSubFlow"
            />
            <template v-else>{{ form.subFlow }}</template>
          </el-form-item>
          <el-form-item
            v-if="formItems.description && formItems.description.show"
            :label="formItems.description.name"
            prop="description"
          >
            <el-input
              v-if="
                formItems.description.edit &&
                  isActive &&
                  type == 0 &&
                  $route.path.indexOf('editor') > -1
              "
              type="textarea"
              v-model="form.description"
              maxlength="200"
              show-word-limit
            />
            <rich-text
              v-if="
                formItems.description.edit &&
                  isActive &&
                  ($route.path.indexOf('editor') == -1 ||
                    (type != 0 && $route.path.indexOf('editor') > -1))
              "
              v-model="form.description"
              :config="{
                items: [
                  'fontname',
                  'fontsize',
                  'forecolor',
                  'hilitecolor',
                  'emoticons',
                  'bold',
                  'italic',
                  'underline',
                  'justifyleft',
                  'justifycenter',
                  'justifyright',
                  'indent',
                  'outdent',
                  'insertorderedlist',
                  'insertunorderedlist',
                  'link',
                  'portal-image-upload',
                  'preview',
                  'fullscreen'
                ]
              }"
            />
            <template
              v-if="formItems.description.show && !formItems.description.edit"
              >{{ form.description }}</template
            >
          </el-form-item>
          <el-form-item
            v-if="formItems.attachment && formItems.attachment.show"
            :label="formItems.attachment.name"
            prop="attachment"
          >
            <attachment-upload
              v-if="formItems.attachment.edit"
              v-model="form.attachment"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane
          v-if="(formItems.knowledge && formItems.knowledge.show) || type == 2"
          :label="type == 2 ? '流转规则' : formItems.knowledge.name"
          name="1"
          class="form-knowledge"
        >
          <!-- 相关知识 -->
          <template v-if="type != 2">
            <page-init
              :loading="false"
              :message="
                (!form.relatedKnowledge || form.relatedKnowledge === '[]') &&
                !formItems.knowledge.edit
                  ? '暂无数据'
                  : ''
              "
              :code="0"
            >
              <knowledge-edit
                v-model="form.relatedKnowledge"
                :canEdit="!!formItems.knowledge.edit && isActive"
              />
            </page-init>
            <!-- <rich-text
              v-if="formItems.knowledge.edit && isActive"
              v-model="form.knowledge"
              show-word-limit
            />
            <div
              v-else
              v-html="form.knowledge"
              style="word-wrap: break-word; word-break: break-word;"
            ></div>-->
          </template>
          <template v-else>
            <div class="condition">
              1.当决策
              <strong>同意</strong>，流转到
              <el-form-item
                prop="agree"
                class="inline-block"
                v-if="!!formItems.agree.edit"
              >
                <el-select v-model="form.agree" clearable>
                  <el-option
                    v-for="{ id, name } in agrees"
                    :key="id"
                    :label="name"
                    :value="id"
                  />
                </el-select>
              </el-form-item>
              <span v-else>{{ form.agree }}</span>
              节点
            </div>
            <div class="condition">
              2.当决策
              <strong>拒绝</strong>，流转到
              <el-form-item
                prop="reject"
                class="inline-block"
                v-if="!!formItems.reject.edit"
              >
                <el-select v-model="form.reject" clearable>
                  <el-option
                    v-for="{ id, name } in rejects"
                    :key="id"
                    :label="name"
                    :value="id"
                  />
                </el-select>
              </el-form-item>
              <span v-else>{{ form.reject }}</span>
              节点
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="form-pane-footer">
        <el-button size="small" @click="cancel">{{
          cancelButtonText
        }}</el-button>
        <el-button size="small" type="primary" @click="confirm">{{
          confirmButtonText
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { querySubModelListByPage, queryServiceForm } from '~/mixins'

export default {
  name: 'form-pane',
  props: {
    type: {
      type: [String, Number],
      default: _ => 0
    },
    /*实际数据*/
    data: {
      type: Object,
      default: _ => ({})
    },
    formItems: {
      type: Object,
      default: _ => ({})
    },
    isActive: {
      type: Boolean,
      default: _ => false
    },
    /*更新字段*/
    keys: {
      type: String,
      default: _ => ''
    },
    confirmButtonText: {
      type: String,
      default: _ => '确定'
    },
    cancelButtonText: {
      type: String,
      default: _ => '取消'
    },
    persons: {
      type: Array,
      default: _ => []
    },
    categories: {
      type: Array,
      default: _ => []
    },
    services: {
      type: Array,
      default: _ => []
    },
    tasks: {
      type: Array,
      default: _ => []
    },
    existTemplateLabel: {
      // 已存在的模板名
      type: Array,
      default: () => []
    }
  },
  components: {
    'attachment-upload': _ => import('~/components/attachments'),
    'rich-text': _ => import('~/components/rich-text'),
    'select-load-by-page': () => import('~/components/select-load-by-page'),
    'ross-tag': _ => import('~/ross-components/ross-tag'),
    'knowledge-edit': _ => import('~/components/knowledge-edit'),
    'service-form': _ => import('~/components/service-form'),
    'page-init': _ => import('~/components/page-init'),
    tools: _ => import('~/components/tools')
  },
  mixins: [querySubModelListByPage, queryServiceForm],
  data() {
    let form = this.makeForm()
    let rules = this.makeRules(form)
    this.subFlowData = {
      list: [],
      currentPage: 0,
      pageSize: 10
    }
    return {
      activeTab: '0',
      serviceForms: [],
      serviceFormData: [],
      subFlow: '', // 选中的子流程
      // 分类
      assigneeIds: [],
      copyPersonIds: [],
      copyPerson: [],
      assignee: [],
      startTime: '',
      endTime: '',
      form,
      rules,
      disableAddCategory: false,
      pickerOptions: {
        // 禁止选择小于当前日期的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      templates: [],
      subFlowLoading: false,
      knowledgeString: ''
    }
  },
  computed: {
    copyor() {
      return this.persons.map(p => {
        let b = this.copyPerson.findIndex(c => c.id == p.id) > -1
        return {
          ...p,
          active: b
        }
      })
    },
    executor() {
      return this.persons.map(p => {
        let b = this.assignee.findIndex(c => c.id == p.id) > -1
        return {
          ...p,
          active: b
        }
      })
    },
    agrees() {
      return this.tasks.filter(({ id }) => id != this.form.reject)
    },
    rejects() {
      return this.tasks.filter(({ id }) => id != this.form.agree)
    },
    tools: {
      set(v) {
        this.form.tools = v
      },
      get() {
        return this.form.tools ? this.form.tools : ''
      }
    }
  },
  watch: {
    type(v) {
      this.form = this.makeForm()
      // Object.assign(this.form, this.data)
      this.rules = this.makeRules(this.form)
      this.$nextTick(_ => this.$refs.form && this.$refs.form.clearValidate())
    },
    data(v) {
      v = JSON.parse(JSON.stringify(v))
      if (v.hasOwnProperty('tags')) {
        v.tags = v.tags ? v.tags.split(',') : []
        v.tags = v.tags.map(val => +val)
      }
      this.form = this.makeForm(v)
      this.rules = this.makeRules(this.form)
      this.$nextTick(_ => this.$refs.form && this.$refs.form.clearValidate())
      if (v.subFlow) {
        if (this.subFlowData.list.length <= 1) {
          this.templates = [
            {
              id: v.subFlow.modelId,
              name: v.subFlow.processModelAttribute.label,
              disabled: true,
              description: v.subFlow.processModelAttribute.description || ''
            }
          ]
          this.subFlowData.list = [
            {
              flowXml: JSON.stringify(v.subFlow.flowTree),
              processModelAttribute: v.subFlow.processModelAttribute,
              subModel: 0
            }
          ]
        }
        this.subFlow = v.subFlow.processModelAttribute.modelId
      } else {
        this.subFlow = ''
      }
      let copyPerson = []
      let assignee = []

      this.persons.forEach(({ id, name, color, pic }) => {
        if (!!this.form.copyPerson && this.form.copyPerson.indexOf(id) > -1) {
          copyPerson.push({ id, name, color, pic, active: true })
        }
        if (!!this.form.assignee && this.form.assignee.indexOf(id) > -1) {
          assignee.push({ id, name, color, pic, active: true })
        }
      })
      if (this.form.hasOwnProperty('startTime')) {
        this.startTime = this.$helper.formatTime(this.form.startTime)
      }
      if (this.form.hasOwnProperty('endTime')) {
        this.endTime = this.$helper.formatTime(this.form.endTime)
      }
      this.copyPerson = copyPerson
      this.assigneeIds = assignee.length ? assignee[0].id : ''
      // this.assignee = assignee
    },
    copyPersonIds(val, old) {
      const arr = this.persons.filter(t => val.indexOf(t.id) >= 0)
      this.copyPerson = arr.map(p => ({
        ...p,
        active: true
      }))
    },
    assigneeIds(val, old) {
      let arr = []
      if (Object.prototype.toString.call(val) == '[object Array]') {
        arr = this.persons.filter(t => val.indexOf(t.id) >= 0)
      } else {
        arr = this.persons.filter(t => val === t.id)
      }
      this.assignee = arr.map(p => ({
        ...p,
        active: true
      }))
    },
    copyPerson(v) {
      if (this.formItems.copyPerson && this.formItems.copyPerson.edit) {
        this.form.copyPerson = v.map(({ id }) => id).join(',')
      }
    },
    assignee(v) {
      if (this.formItems.assignee && this.formItems.assignee.edit) {
        this.form.assignee = v.map(({ id }) => id).join(',')
      }
    },
    startTime(v) {
      if (this.formItems.startTime && this.formItems.startTime.edit) {
        this.form.startTime = this.$helper.formatTime(v)
      }
    },
    endTime(v) {
      if (this.formItems.endTime && this.formItems.endTime.edit) {
        this.form.endTime = this.$helper.formatTime(v)
      }
    },
    isActive(v) {
      if (!v) {
        this.resetFormPane()
      } else {
        // 如果已经存在服务， 则需要重新获取一下该服务的表单
        if (this.form.service && this.type === 4) {
          this.handleServiceChange(this.form.service)
        }
      }
    },
    subFlow(v) {
      if (this.formItems.subFlow && this.formItems.subFlow) {
        const target = this.templates.find(
          val => parseInt(val.id, 10) === parseInt(v, 10)
        )
        const { name: label, description } = target || {}
        Object.assign(this.form, {
          label,
          description,
          subFlow: v
        })
      }
    },
    existTemplateLabel() {
      this.type === 0 && this.confirm()
    }
  },
  methods: {
    loadSubFlow() {
      if (this.subFlowLoading) {
        return
      }
      if (
        this.subFlowData.count &&
        this.subFlowData.currentPage >=
          Math.ceil(this.subFlowData.count / this.subFlowData.pageSize)
      ) {
        this.subFlowLoading = false
        return
      }
      this.subFlowData.currentPage += 1
      this.subFlowLoading = true

      this.querySubModelListByPage(this.subFlowData.currentPage)
        .then(r => {
          this.subFlowData.count = r.count
          this.subFlowData.list = this.subFlowData.list.concat(
            r.processModelDetails
          )
          this.templates = this.subFlowData.list.map(t => ({
            id: t.processModelAttribute.modelId,
            name: t.processModelAttribute.label,
            disabled: !!t.disable,
            description: t.processModelAttribute.description || ''
          }))
        })
        .catch(e => {
          this.subFlowData.currentPage -= 1
        })
        .finally(() => {
          this.subFlowLoading = false
        })
    },
    makeForm(data) {
      let form = {}
      let readonly = {}
      let formItems = this.formItems || this.makeFormItems(this.type)
      Object.keys(formItems).reduce((f, k) => {
        if (formItems[k].show) {
          /*显示且需要编辑*/
          f[k] = this.data[k] || null
        } else {
          readonly[k] = this.data[k] || null
        }
        return f
      }, form)

      Object.assign(form, data || this.data)
      if (form.subFlow) {
        form.subFlow = form.subFlow.modelId
      }
      if (this.type === 4 && data && data.robotFromModelDto) {
        form.service = data.robotFromModelDto.ministryLabel
        const strData = data.robotFromModelDto.customizeJsonData
        this.serviceFormData = strData ? JSON.parse(strData) : []
      }
      if (this.type === 4 && data && data.label === '请输入节点名称') {
        form.label = ''
      }
      if (form.hasOwnProperty('tags') && !form.tags) {
        form.tags = []
      }
      this.readonly = readonly

      // 设置默认值
      if (
        form.hasOwnProperty('priority') &&
        isNaN(parseInt(form.priority, 10))
      ) {
        form.priority = 0
      }

      return form
    },
    makeRules(form) {
      let rules = {}
      let formItems = this.formItems || this.makeFormItems(this.type)
      Object.keys(form).reduce((r, k) => {
        if (formItems[k] && formItems[k].rules) {
          r[k] = formItems[k].rules
        }
        return r
      }, rules)

      // 编辑模板时为名称添加是否重复校验
      if (this.type === 0) {
        rules.label.push({
          validator: (rule, value, callback) => {
            if (this.existTemplateLabel.includes(value)) {
              callback(new Error('模板名已存在'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        })
      }
      return rules
    },
    async confirm() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          if (this.type == 2) {
            if (!this.form.label) return
            if (!this.form.reject || !this.form.agree) {
              this.activeTab = '1'
              return
            }
          }
          return
        }
        let [a, b] = this.keys.split(',')
        let data = { ...this.form }
        const serviceFormRef = this.$refs.serviceForm
        if (this.type === 4 && serviceFormRef) {
          const serviceVaild = await serviceFormRef.validForm()
          if (!serviceVaild) return
          const robotFromModelDto = {
            ministryLabel: data.service,
            customizeJsonData: serviceFormRef.getFormData()
          }
          data.robotFromModelDto = robotFromModelDto
          delete data.service
        }
        if (data.attachment) {
          data.attachment = data.attachment.map(({ name, url }) => ({
            name,
            url
          }))
        }
        if (
          this.type == 3 &&
          this.subFlowData.list &&
          this.subFlowData.list.length
        ) {
          /*sub flow*/
          let subFlow = JSON.parse(
            JSON.stringify(
              this.subFlowData.list.find(
                t => +t.processModelAttribute.modelId === +data.subFlow
              )
            )
          )
          delete subFlow.subModel
          subFlow.flowTree = JSON.parse(subFlow.flowXml || '""')
          delete subFlow.flowXml
          data.subFlow = subFlow
          data.subFlow.modelId = data.subFlow.processModelAttribute.modelId
        }
        if (!data.subFlow) {
          delete data.subFlow
        }
        // 标签格式变更
        if (data.tags) {
          data.tags = data.tags.join(',')
        }
        this.$emit('confirm', {
          [a]: false,
          notModify:
            data.subFlow && data.subFlow.modelId === this.templates[0].id,
          [b]: { ...data, ...this.readonly }
        })
      })
    },
    async cancel() {
      try {
        await this.$confirm('编辑内容尚未保存，是否保存并继续?', '提示', {
          confirmButtonText: '保存并继续',
          cancelButtonText: '暂不保存'
        })
        this.confirm()
      } catch (ex) {
        this.$refs.form.clearValidate()
        this.$emit('cancel')
      }
    },
    async handleServiceChange(ministryLabel) {
      try {
        const data = await this.queryServiceForm(ministryLabel, true)
        const serviceFormData = this.serviceFormData.reduce((p, c, arr) => {
          p[c.fieldName] = c.fieldValue
          return p
        }, {})

        this.serviceForms = data.map(item => {
          return {
            ...item,
            fieldValue: serviceFormData[item.fieldName]
          }
        })
        // this
      } catch (err) {
        console.error(err)
      }
    },
    resetFormPane() {
      this.activeTab = '0'
      this.serviceForms = []
    },
    makeFormItems(type) {
      switch (type) {
        case 0:
          return this.$constant.FLOW_ITEMS.template.template
        case 2:
          return this.$constant.FLOW_ITEMS.template.check
        case 3:
          return this.$constant.FLOW_ITEMS.template.flow
        case 1:
        default:
          return this.$constant.FLOW_ITEMS.template.task
      }
    },
    changeTemplates(v) {
      let flow = this.templates.find(x => x.id == v)
      this.form.label = flow.name
      this.form.description = flow.description || ''
    }
    /*
    hideSider(e) {
      if (this.isActive && !this.$refs.form.$el.contains(e.target)) {
        this.cancel()
      }
    }*/
  }
}
</script>
<style lang="scss" src="./index.scss" scoped />
