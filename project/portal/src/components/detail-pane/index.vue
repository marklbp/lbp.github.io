<template>
  <div class="form-pane">
    <!-- {{breads}}
    <div class="sub-breadcrumb" v-if="isSub && $route.path.indexOf('flow-task-detail') < 0">
      <template v-for="({ url, name }, i) in breads">
        <a href="javascript:void(0)" @click="go(url)" :key="url" :title="name">{{ name }}</a>
        <span v-show="i < breads.length - 1" :key="i">/</span>
      </template>
    </div>-->
    <div class="form-label">
      <router-back
        class="router-back"
        :url="-1"
        route-action="replace"
        :disable-route="
          (!isTask && !isSub) || $route.path.indexOf('flow-task-detail') > -1
        "
        :text="label"
      >
        <router-link
          :to="parentPath.url"
          class="parent-label"
          :title="parentPath.name"
          v-if="
            type != 0 &&
              type !== 3 &&
              type !== 4 &&
              $route.path.indexOf('flow-task-detail') < 0
          "
          >{{ parentPath.name }}</router-link
        >
        <span
          class="show-flow-label"
          v-if="$route.path.indexOf('flow-task-detail') > -1 && type != 0"
          :title="detail.flowLabel"
          >{{ detail.flowLabel }}</span
        >
      </router-back>
      <div
        v-if="type == 0 && !isTask"
        class="form-label-status"
        :class="{
          statusto: status == 0,
          statusing: status == 1,
          statused: status == 2,
          'status-pause': status == 3,
          'status-cancel': status == 4
        }"
      >
        {{ translateKey(status, 'FLOW_STATUS') }}
      </div>
    </div>
    <div class="form-body" v-if="type !== 3 && type !== 4">
      <div class="copy2assignee groups">
        <div class="creator label-value">
          <span class="label">创建人：</span>
          <peoples-select
            :edit="false"
            v-model="creator"
            :data="copyor"
            max-width="80px"
            multiple
          />
        </div>
        <div class="assignee label-value">
          <span class="label">执行人：</span>
          <peoples-select
            :edit="showAssigneeEdit"
            v-model="assignee"
            :data="executor"
            max-width="60px"
          />
        </div>

        <div class="copy-people label-value">
          <span class="label">抄送人：</span>
          <peoples-select
            :edit="showCopyEdit"
            v-model="copyPerson"
            :data="copyor"
            max-width="120px"
            multiple
          />
        </div>
      </div>
      <div class="groups">
        <div class="category label-value" v-if="type == 0">
          <span class="label">分类：</span>
          <span class="value">{{ detail.category }}</span>
        </div>
        <div class="priority label-value">
          <span class="label">优先级：</span>
          <editable
            type="4"
            v-model="priority"
            :menu="priorities"
            menu-key="priority"
            :is-edit="showPriorityEdit"
            :show-btns="false"
          />
        </div>
        <!-- v-if="getAuthByAction('remindTime', 'read')" -->
        <!-- v-if="status === '0' || status === '1'" -->
        <!-- {{detail.startTime}} -->
        <!-- type 0为流程 1为任务 2为决策任务 3为子流程 4为机器人 -->
        <ross-time-range
          v-if="
            isTask ||
              (type !== 0 && $route.path.indexOf('flow-task-detail') > -1)
          "
          :startTime="detail.startTime"
          :endTime="endTime"
          :startCanEdit="showStartTimeEdit"
          :endCanEdit="showEndTimeEdit"
          valueFormat="yyyy-MM-dd HH:mm:ss"
          @startPick="handleFiledChange($event, 'startTime')"
          @endPick="handleFiledChange($event, 'endTime')"
        />
        <template v-if="type !== 0">
          <ross-remind
            :remindTime="remindTime"
            :canEdit="showRemindTimeEdit"
            valueFormat="yyyy-MM-dd HH:mm:ss"
            @pick="handleFiledChange($event, 'remindTime')"
          />
        </template>
      </div>
      <div class="groups" v-if="type === 0">
        <ross-time-range
          :startTime="detail.startTime"
          :endTime="endTime"
          :startCanEdit="showStartTimeEdit"
          :endCanEdit="showEndTimeEdit"
          class="label-value"
          valueFormat="yyyy-MM-dd HH:mm:ss"
          @startPick="handleFiledChange($event, 'startTime')"
          @endPick="handleFiledChange($event, 'endTime')"
        />
      </div>
      <!-- tag start -->
      <div
        class="label label-value"
        v-if="!isTask && !taskDefinitionKey"
        style="align-items: flex-start;margin-top: 14px;"
      >
        <span class="label" style="width:50px;">标签：</span>
        <ross-tag
          v-model="tags"
          isEdit
          :canEdit="privileges.tags && privileges.tags.edit"
          :processId="$route.params.rootProcessExec"
        />
      </div>
      <div class="label label-value" v-else>
        <span class="label" style="width:50px;">标签：</span>
        <template v-if="tags">
          <span class="tag-item" v-for="item in tags" :key="item.id">
            <span></span>
            {{ item.name }}
          </span>
        </template>
        <span v-else>无</span>
      </div>
      <!-- tag end -->
      <section v-if="isTask" class="flow-display-warrper">
        <div class="groups">
          <div class="label-value">
            <span class="label">所属流程：</span>
            <router-link class="value flow-name" tag="span" :to="processLink">{{
              detail.flowLabel
            }}</router-link>
            <span style="color: #999">（{{ flowDetail.category }}）</span>
          </div>
        </div>
        <div class="groups" style="margin-top: 13px;">
          <div class="label-value">
            <span class="label" style="opacity: 0;">所属流程：</span>
            <span class="value" v-html="flowDetail.description"></span>
          </div>
        </div>

        <div class="flow-show-btn">
          <span @click="toggleShowFlow">
            {{ isShowFlow ? '收起' : '展开' }}流程图
            <span
              class="font-icon"
              :class="isShowFlow ? 'icon-up' : 'icon-down'"
            ></span>
          </span>
        </div>
        <template v-if="xmlData.xml && isTask && isShowFlow">
          <div class="location">
            当前位置：
            <span
              v-for="(item, i) in path"
              :key="i"
              @click="clickLocationHandler(i)"
            >
              <span v-if="i !== 0">&gt;</span>
              {{ item }}
            </span>
          </div>
          <flow-display
            ref="graphContainer"
            :xml="flowXml"
            :persons="persons"
            :message="message"
            @dblclick="dblclickFlowHandler"
            @click="clickHandler"
          ></flow-display>
        </template>
      </section>
      <editable
        class="status label-value button"
        v-if="type == 1 && status != null"
        type="4"
        v-model="status"
        :menu="statues"
        menu-key="status"
        :is-edit="showStatusEdit"
        :show-btns="false"
      />
      <div class="check label-value" v-if="showCheckEdit">
        <el-button type="primary" @click="showPolicyModal = !showPolicyModal"
          >审核</el-button
        >
      </div>
      <div v-if="type == 2" class="check-show">
        <el-button
          v-if="status == 2"
          :type="showConditionStatus ? 'primary' : 'danger'"
          >{{ showConditionStatus ? '已通过' : '已拒绝' }}</el-button
        >
        <el-button v-if="status == 4" type="primary">已取消</el-button>
      </div>
      <el-tabs
        v-model="activeTab"
        v-if="!isTask"
        style="margin-top: 24px; min-height:0px;"
      >
        <el-tab-pane label="基本信息" name="0">
          <div class="form-block description">
            <div class="tit">{{ type == 0 ? '流程描述' : '任务描述' }}</div>
            <editable
              v-model="description"
              type="2"
              :is-edit="showDescriptionEdit"
              :rich-text-plugins="{
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
          </div>
          <div class="form-block tools" v-if="type == 1">
            <div class="tit">工具</div>
            <tools
              v-model="tools"
              :addable="showToolsAdd"
              :deletable="showToolsDelete"
            />
          </div>
          <div class="form-block attachment">
            <div class="tit">{{ type == 0 ? '流程附件' : '附件' }}</div>
            <div class="content">
              <attachment-upload
                v-model="attachment"
                :disabled="!showAttachmentEdit"
                :is-delete="showAttachmentDelete"
              />
            </div>
          </div>
          <div class="form-block subtasks" v-if="showSubTask">
            <div class="tit">子任务</div>
            <div class="content">
              <sub-task
                :nodeStatus="status"
                :taskDefinitionKey="taskDefinitionKey"
                :persons="persons"
                v-model="subTaskCloneList"
                :edit="showSubTaskEdit"
              />
            </div>
          </div>
          <div class="form-block" v-if="showCheckResult">
            <div class="tit">审核备注</div>
            <div class="content">
              <div
                class="check-result"
                v-for="{ name, time, text, color, agree } in comment"
                :key="time"
              >
                <span
                  class="check-avatar"
                  :style="{ 'background-color': color }"
                  >{{ name.slice(0, 1) }}</span
                >
                <div class="check-text">
                  <div class="info">
                    <span class="name">
                      {{
                        name +
                          '&nbsp;&nbsp;&nbsp;&nbsp;审核' +
                          (agree == 0 ? '通过' : '拒绝')
                      }}
                    </span>
                    <span class="date">{{ time }}</span>
                  </div>
                  <div class="text">{{ text }}</div>
                </div>
              </div>
            </div>
          </div>
          <comment :processId="$route.params.rootProcessExec" />
        </el-tab-pane>
        <el-tab-pane v-if="type <= 1 && !isSub" label="相关知识" name="2">
          <!-- <editable v-model="knowledge" type="2" :is-edit="false" /> -->
          <page-init
            :loading="false"
            :message="
              !relatedKnowledge || relatedKnowledge === '[]' ? '暂无数据' : ''
            "
            :code="0"
          >
            <knowledge-edit v-model="relatedKnowledge" :canEdit="false" />
          </page-init>
        </el-tab-pane>
        <el-tab-pane label="全部附件" name="3">
          <page-init
            :loading="false"
            :message="!allAttachment.length ? '暂无数据' : ''"
            :code="0"
          >
            <attachment-upload
              style="overflow: hidden;"
              v-model="allAttachment"
              :disabled="true"
              :is-delete="false"
            />
          </page-init>
        </el-tab-pane>
        <el-tab-pane label="任务动态" name="4">
          <operation-log
            v-if="activeTab == 4"
            :processInstanceId="processInstanceId"
            :definitionKey="definitionKey"
          ></operation-log>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="isTask" class="bar"></div>
    <div class="form-body task-detail" v-if="isTask">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="0">
          <div class="form-block description">
            <div class="tit" style="line-height:32px;margin-bottom:0px;">
              {{ type == 0 ? '流程描述' : '任务描述' }}
            </div>
            <editable
              v-model="description"
              type="2"
              :is-edit="showDescriptionEdit"
              :rich-text-plugins="{
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
          </div>
          <div class="form-block tools" v-if="type == 1">
            <div class="tit">工具</div>
            <tools
              v-model="tools"
              :addable="showToolsAdd"
              :deletable="showToolsDelete"
            />
          </div>
          <div class="form-block attachment">
            <div class="tit">{{ type == 0 ? '流程附件' : '附件' }}</div>
            <div class="content">
              <attachment-upload
                v-model="attachment"
                :disabled="!showAttachmentEdit"
                :is-delete="showAttachmentDelete"
              />
            </div>
          </div>
          <div class="form-block subtasks" v-if="showSubTask">
            <div class="tit">子任务</div>
            <div class="content">
              <sub-task
                :taskDefinitionKey="taskDefinitionKey"
                :persons="persons"
                v-model="subTaskCloneList"
                :edit="showSubTaskEdit"
              />
            </div>
          </div>
          <div class="form-block" v-if="showCheckResult">
            <div class="tit">审核备注</div>
            <div class="content">
              <div
                class="check-result"
                v-for="{ name, time, text, color, agree } in comment"
                :key="time"
              >
                <span
                  class="check-avatar"
                  :style="{ 'background-color': color }"
                  >{{ name.slice(0, 1) }}</span
                >
                <div class="check-text">
                  <div class="info">
                    <span class="name">
                      {{
                        name +
                          '&nbsp;&nbsp;&nbsp;&nbsp;审核' +
                          (agree == 0 ? '通过' : '拒绝')
                      }}
                    </span>
                    <span class="date">{{ time }}</span>
                  </div>
                  <div class="text">{{ text }}</div>
                </div>
              </div>
            </div>
          </div>
          <comment :processId="$route.params.rootProcessExec" />
        </el-tab-pane>
        <el-tab-pane
          v-if="type <= 1 && !isSub"
          :label="(type == 0 ? '相关' : '相关') + '知识'"
          name="2"
        >
          <!-- <editable v-model="knowledge" type="2" :is-edit="false" /> -->
          <page-init
            :loading="false"
            :message="
              !relatedKnowledge || relatedKnowledge === '[]' ? '暂无数据' : ''
            "
            :code="0"
          >
            <knowledge-edit v-model="relatedKnowledge" :canEdit="false" />
          </page-init>
        </el-tab-pane>
        <el-tab-pane label="全部附件" name="3">
          <page-init
            :loading="false"
            :message="!allAttachment.length ? '暂无数据' : ''"
            :code="0"
          >
            <attachment-upload
              style="overflow: hidden;"
              v-model="allAttachment"
              :disabled="true"
              :is-delete="false"
            />
          </page-init>
        </el-tab-pane>

        <el-tab-pane label="任务动态" name="4">
          <operation-log
            v-if="activeTab == 4"
            :processInstanceId="processInstanceId"
            :definitionKey="definitionKey"
          ></operation-log>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="parseInt(type, 10) === 3" class="subflow-pane">
      <span>描述</span>
      <p>{{ detail.description }}</p>
    </div>
    <div v-if="parseInt(type, 10) === 4" class="subflow-pane">
      <div class="robotForm-item">
        <span>服务：{{ detail.ministryName }}</span>
      </div>
      <template v-if="detail.robotFormAttrValueList">
        <div
          class="robotForm-item"
          v-for="item in detail.robotFormAttrValueList"
          :key="item.fieldValue"
        >
          <span>{{ item.name }}：{{ item.value }}</span>
        </div>
      </template>
    </div>
    <policy-modal
      v-model="showPolicyModal"
      :processExecId="detail.processExecId"
      @policyOver="checkResultCallback"
    />
  </div>
</template>
<script>
import flowHelper from '~/utils/flow.js'
export default {
  name: 'detail-pane',
  props: {
    // 0为流程 1为任务 2为决策任务 3为子流程 4为机器人
    type: {
      type: [String, Number],
      default: _ => 0
    },
    detail: {
      type: Object,
      default: _ => ({})
    },
    parentPath: {
      type: Object,
      default: _ => ({})
    },
    persons: {
      type: Array,
      default: _ => []
    },
    taskDefinitionKey: {
      type: String,
      default: _ => ''
    },
    isSub: {
      type: Boolean,
      default: _ => false
    },
    breads: {
      type: Array,
      default: _ => []
    },
    privileges: {
      type: Object,
      default: _ => ({})
    },
    isTask: {
      type: Boolean,
      default: false
    },
    xmlData: {
      type: Object,
      default: _ => ({})
    },
    flowDetail: {
      type: Object,
      default: _ => null
    }
  },
  components: {
    'peoples-select': _ => import('~/components/peoples-select'),
    'attachment-upload': _ => import('~/components/attachments'),
    'sub-task': _ => import('~/components/sub-task'),
    'router-back': _ => import('~/components/router-back'),
    'policy-modal': _ => import('~/components/policy-modal'),
    'flow-display': _ => import('~/components/flow-display'),
    'ross-tag': _ => import('~/ross-components/ross-tag'),
    'knowledge-edit': _ => import('~/components/knowledge-edit'),
    'page-init': _ => import('~/components/page-init'),
    operationLog: _ => import('~/components/operation-log'),
    comment: _ => import('~/components/comment'),
    editable: _ => import('~/components/editable'),
    tools: _ => import('~/components/tools'),
    RossRemind: _ => import('~/ross-components/ross-remind'),
    RossTimeRange: _ => import('~/ross-components/ross-time-range')
  },
  data() {
    this.resetPersons()
    let name = this.$cache.get('USER_INFO')
    return {
      activeTab: '0',
      copyor: this.copyor,
      executor: this.executor,
      showPolicyModal: false,
      isShowFlow: false,
      flowXml: '',
      message: '',
      path: []
    }
  },
  computed: {
    relatedKnowledge() {
      // 任务节点下，同时显示任务和流程的知识
      const subRelatedKnowledge = this.detail.relatedKnowledge
      const flowRelatedKnowledge = this.flowDetail.relatedKnowledge
      if (this.isTask) {
        try {
          const sub = subRelatedKnowledge ? JSON.parse(subRelatedKnowledge) : []
          const flow = flowRelatedKnowledge
            ? JSON.parse(flowRelatedKnowledge)
            : []
          const total = sub.concat(flow)
          return JSON.stringify(total)
        } catch {
          return subRelatedKnowledge
        }
      } else {
        return flowRelatedKnowledge
      }
    },
    label() {
      return this.detail.label
    },
    rateProgress() {
      return this.detail.rateProgress
    },
    priority: {
      set(v) {
        this.emitUpdate({
          priority: v
        })
      },
      get() {
        return this.detail.priority
      }
    },
    startTime: {
      set(v) {
        this.emitUpdate({
          startTime: v
        })
      },
      get() {
        return this.$helper.formatTime(this.detail.startTime)
      }
    },
    endTime: {
      set(v) {
        this.emitUpdate({
          endTime: v
        })
      },
      get() {
        return this.$helper.formatTime(this.detail.endTime)
      }
    },
    remindTime: {
      set(v) {
        this.emitUpdate({
          remindTime: v
        })
      },
      get() {
        return this.$helper.formatTime(this.detail.remindTime)
      }
    },
    status: {
      set(v) {
        this.emitUpdate({
          status: v
        })
      },
      get() {
        let s = this.detail.status
        return isNaN(Number(s)) ? 0 : s
      }
    },
    assignee: {
      set(v) {
        this.emitUpdate({
          assignee: v
        })
      },
      get() {
        let v = this.$helper.parsePerson(this.detail.assignee, this.persons)
        return v
      }
    },
    copyPerson: {
      set(v) {
        this.emitUpdate({
          copyPerson: v
        })
      },
      get() {
        let v = this.$helper.parsePerson(this.detail.copyPerson, this.persons)
        return v
      }
    },
    attachment: {
      set(v) {
        this.emitUpdate({
          attachment: v.map(({ url, name }) => ({ url, name }))
        })
      },
      get() {
        let v = this.detail.attachment
        return v instanceof Array ? v : []
      }
    },
    tools: {
      set(v) {
        this.emitUpdate({
          tools: v
        })
      },
      get() {
        let v = this.detail.tools
        return !v ? '' : v
      }
    },
    description: {
      set(v) {
        this.emitUpdate({
          description: v
        })
      },
      get() {
        return this.detail.description
      }
    },
    knowledge: {
      set(v) {
        this.emitUpdate({
          knowledge: v
        })
      },
      get() {
        return this.detail.knowledge
      }
    },
    tags: {
      set(v) {
        this.emitUpdate({
          tags: v
        })
      },
      get() {
        return this.detail.tags
      }
    },
    subTaskCloneList: {
      set(v) {
        this.emitUpdate({
          subTaskCloneList: v
        })
      },
      get() {
        let v = this.detail.subTaskCloneList
        if (v instanceof Array) {
          v.forEach(x => {
            x.startTime = this.$helper.formatTime(x.startTime)
            x.endTime = this.$helper.formatTime(x.endTime)
            x.remindTime = this.$helper.formatTime(x.remindTime)
            x.assignee = this.$helper.parsePerson(x.assignee, this.persons)
            x.copyPerson = this.$helper.parsePerson(x.copyPerson, this.persons)
            x.attachment = x.attachment instanceof Array ? x.attachment : []
          })
          return v
        }
        return []
      }
    },
    showStartTimeEdit() {
      return (
        this.privileges &&
        this.privileges.startTime &&
        this.privileges.startTime.edit
      )
    },
    showEndTimeEdit() {
      return (
        this.privileges &&
        this.privileges.endTime &&
        this.privileges.endTime.edit
      )
    },
    showRemindTimeEdit() {
      return (
        this.privileges &&
        this.privileges.remindTime &&
        this.privileges.remindTime.edit
      )
    },
    showPriorityEdit() {
      return (
        this.privileges &&
        this.privileges.priority &&
        this.privileges.priority.edit
      )
    },
    showAssigneeEdit() {
      return (
        this.privileges &&
        this.privileges.assignee &&
        this.privileges.assignee.edit
      )
    },
    showCopyEdit() {
      return (
        this.privileges &&
        this.privileges.copyPerson &&
        this.privileges.copyPerson.add
      )
    },
    showStatusEdit() {
      return (
        this.privileges && this.privileges.status && this.privileges.status.edit
      )
    },
    showSubTask() {
      return this.type == 1 && !this.isSub
    },
    showSubTaskEdit() {
      return (
        this.privileges &&
        this.privileges.subTaskDtos &&
        this.privileges.subTaskDtos.add
      )
    },
    showToolsAdd() {
      return (
        this.privileges && this.privileges.tools && this.privileges.tools.edit
      )
    },
    showToolsDelete() {
      return (
        this.privileges &&
        this.privileges.tools &&
        this.privileges.tools.deleted
      )
    },
    showDescriptionEdit() {
      return (
        this.privileges &&
        this.privileges.description &&
        this.privileges.description.edit
      )
    },
    showAttachmentEdit() {
      return (
        this.privileges &&
        this.privileges.attachment &&
        this.privileges.attachment.add
      )
    },
    showAttachmentDelete() {
      return (
        this.privileges &&
        this.privileges.attachment &&
        this.privileges.attachment.deleted
      )
    },
    showCheckEdit() {
      return (
        this.type == 2 &&
        this.privileges.auditButton &&
        this.privileges.auditButton.edit
      )
    },
    statues() {
      // 不需要取消状态了
      let arr = this.$constant.TASK_STATUS.filter(
        p =>
          this.detail.status != p.id &&
          ((this.detail.status == 1 && p.id != 0) || this.detail.status != 1) &&
          p.id != 4 &&
          p.id !== 3
      )
      return arr
    },
    priorities() {
      let arr = this.$constant.PRIORITIES.filter(
        p => this.detail.priority != p.id
      )
      return arr
    },
    showCheckResult() {
      return (
        (this.type == 2 && this.detail.status == 2) ||
        this.detail.comment instanceof Array
      )
    },
    comment() {
      return this.detail.comment instanceof Array
        ? this.detail.comment.map(c => {
            let people = this.persons.find(({ id }) => id == c.userId)
            let name = (people && people.name) || '-'
            return {
              name,
              color: c.color || this.$helper.color(),
              text: c.comment,
              time: this.$helper.formatTime(c.createTime),
              agree: c.agree
            }
          })
        : []
    },
    showConditionStatus() {
      let last =
        this.comment && this.comment.length > 0 && this.comment.slice(-1)[0]
      return last && last.agree == 0 && this.detail.status == 2
    },
    creator() {
      const creator = this.detail.creator
      let creatorArr = [creator]
      if (
        creator &&
        Object.prototype.toString.call(creator) == '[object Array]'
      ) {
        creatorArr = creator.map(({ id }) => id).join(',')
      }
      return this.$helper.parsePerson(creatorArr, this.persons)
    },
    allAttachment: {
      set(v) {
        /*this.emitUpdate({
          knowledge: v
        })*/
      },
      get() {
        let v = this.detail.allAttachment
        return v instanceof Array ? v : []
      }
    },
    processInstanceId() {
      const { status } = this.detail
      const { index, rootProcessExec } = this.$route.params
      const isNotCreateSubTask = isNaN(parseInt(status, 10)) && index
      return (isNotCreateSubTask ? 'clone_' + index : index) || rootProcessExec
    },
    definitionKey() {
      const { index, taskDefinitionKey } = this.$route.params
      return index ? '' : taskDefinitionKey
    },
    processLink() {
      const { storeId, rootProcessExec } = this.$route.params
      return `/${storeId}/flow-detail/${rootProcessExec}`
    }
  },
  watch: {
    'detail.assignee': {
      deep: true,
      handler: function(v) {
        let v0 = this.$helper.parsePerson(v, this.persons)
        this.executor = this.resetPersons('assignee', v0)
      }
    },
    'detail.copyPerson': {
      deep: true,
      handler: function(v) {
        let v0 = this.$helper.parsePerson(v, this.persons)
        this.copyor = this.resetPersons('copyPerson', v0)
      }
    },
    xmlData: {
      deep: true,
      immediate: true,
      handler: function(v) {
        if (!v.xml) return
        this.flowXml = this.preParseXML(v.xml)
        this.message = v.message
        this.flowJson = JSON.parse(v.xml)
        this.path = [this.flowDetail.label]
      }
    }
  },
  methods: {
    preParseXML: flowHelper.preParseXML,
    dblclickFlowHandler(cell) {
      if (!/task|condition/.test(cell.flow)) {
        return
      }
      const { storeId, rootProcessExec } = this.$route.params
      this.$router.push(
        `/${storeId}/process-task-detail/${rootProcessExec}/${cell.id}`
      )
    },
    clickHandler({ cell, event }) {
      if (/subflow-btn/.test(event.target.className)) {
        const target = this.flowJson.tasks.find(
          val => parseInt(val.id, 10) === parseInt(cell.id, 10)
        )
        const flowXml = this.preParseXML(
          JSON.stringify(target.subFlow.flowTree),
          this.$route.params.taskDefinitionKey
        )
        this.flowXml = flowXml
        this.pathHandle(cell)
      }
    },
    clickLocationHandler(i) {
      if (i !== this.path.length - 1) {
        this.path.splice(1, 1)
        this.flowXml = this.preParseXML(
          JSON.stringify(this.flowJson),
          this.$route.params.taskDefinitionKey
        )
      }
    },
    pathHandle(cell) {
      if (this.flowJson) {
        const clickCell = this.flowJson.tasks.find(val => val.id === cell.id)
        if (clickCell && clickCell.flow === 'flow') {
          this.path.push(clickCell.attrs.label)
        }
      }
    },
    toggleShowFlow() {
      this.isShowFlow = !this.isShowFlow
    },
    emitUpdate(key) {
      this.$emit(
        'update',
        typeof key === 'object'
          ? key
          : {
              [key]: this[key]
            }
      )
    },
    resetPersons(key, list) {
      let executor = []
      let copyor = []
      this.persons.forEach(({ id, name, pic, color, disable }) => {
        if (!key) {
          list = this.detail.copyPerson && this.detail.copyPerson
        }
        let cActive = list.findIndex(c => c.id == id) > -1
        if (!key) {
          list = this.detail.assignee && this.detail.assignee
        }
        let aActive = list.findIndex(c => c.id == id) > -1
        let x = {
          id,
          name,
          pic,
          color,
          active: cActive,
          disable: cActive || !!disable
        }
        let y = {
          id,
          name,
          pic,
          color,
          active: aActive,
          disable: !!disable
        }
        copyor.push(x)
        executor.push(y)
      })
      if (key) {
        return key == 'copyPerson' ? copyor : executor
      }
      this.executor = executor
      this.copyor = copyor
    },
    handleFiledChange(val, field) {
      this[field] = val
    },
    /**
     * 审核结果回调
     */
    checkResultCallback({ agree, comment }) {
      this.$emit('update', { check: true })
    },
    go(url) {
      this.$router.replace(url)
    },
    translateKey(v, f) {
      let o = this.$constant[f]
      let c = o && o[Number(v) + 1]
      return c && typeof c == 'object' ? c.name : ''
    }
  }
}
</script>
<style lang="scss" scoped src="./style.scss" />
