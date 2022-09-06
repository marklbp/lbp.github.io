<template>
  <div class="task-detail" :class="isMessageRoute ? 'message-detail' : ''">
    <div class="header">
      <router-back :text="taskData.label || ''" :disableRoute="isMessageRoute">
        <el-breadcrumb separator="/" v-if="this.taskData.parent">
          <el-breadcrumb-item :to="{ path: this.parentPath }">
            <span class="parent-label" :title="this.taskData.parent.label"
              >父任务：{{ this.taskData.parent.label }}</span
            >
          </el-breadcrumb-item>
          <!-- <el-breadcrumb-item>{{ taskData.label }}</el-breadcrumb-item> -->
        </el-breadcrumb>
        <div slot="left">
          <span
            class="text"
            :title="taskData.label"
            v-if="!getAuthByAction('label', 'edit')"
            >{{ taskData.label }}</span
          >
          <template v-else>
            <span
              class="text"
              v-show="!textVisible"
              @click="toggleTextEdit"
              :title="taskData.label"
              >{{ taskData.label }}&nbsp;</span
            >
            <el-input
              v-if="textVisible"
              type="text"
              placeholder="请输入内容"
              v-model="labelText"
              maxlength="60"
              show-word-limit
              autofocus
              @blur="toggleTextEdit"
              style="width: 350px;"
            />
          </template>
        </div>
      </router-back>
    </div>
    <div class="container" v-loading="loadingVisible">
      <div class="page-header">
        <div class="header-left">
          <span
            class="header-left-des header-left-copy-person"
            v-if="taskData.creator"
          >
            <span>
              创建人:
              <span
                style="font-size: 14px; color: #333333;margin-left: 10px;"
                >{{ taskData.creator.realName }}</span
              >
            </span>
          </span>
          <span
            class="header-left-des"
            v-if="getAuthByAction('assignee', 'read')"
          >
            <span>执行人:</span>
            <section class="inlineblock-warrper">
              <peoples-select
                v-model="executor"
                :edit="getAuthByAction('assignee', 'edit')"
                :data="transformPersonData(personsDataList, executor)"
              />
            </section>
          </span>
          <span
            class="header-left-des header-left-copy-person"
            v-if="getAuthByAction('copyPerson', 'read')"
            style="margin-left: 7px;"
          >
            <span>抄送人:</span>
            <section class="inlineblock-warrper">
              <peoples-select
                v-model="seledSends"
                :edit="getAuthByAction('copyPerson', 'add')"
                :data="ccList"
                multiple
              />
            </section>
          </span>
        </div>

        <div class="header-right" v-if="getAuthByAction('status', 'read')">
          <el-dropdown
            @command="handleChangeStatus"
            v-if="getAuthByAction('status', 'edit')"
          >
            <el-button class="stauts-button" size="medium" type="primary">
              {{ statusText }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="c in $constant.TASK_STATUS">
                <el-dropdown-item
                  style="width: 96px;"
                  v-if="c.id == 2 || (c.id == 4 && !taskData.parent)"
                  :key="c.id"
                  :disabled="
                    !statusList.includes(c.id) || c.id == taskData.status
                  "
                  :command="c.id"
                  >{{ c.name === '已取消' ? '取消' : c.name }}</el-dropdown-item
                >
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            class="stauts-button"
            size="medium"
            :disabled="taskData.status == 2 || taskData.status == 4"
            type="primary"
            v-else
            >{{ statusText }}</el-button
          >
        </div>
      </div>
      <div class="page-header">
        <div class="header-context">
          <template v-if="getAuthByAction('priority', 'read')">
            <span>
              <div
                class="el-dropdown"
                v-if="!getAuthByAction('priority', 'edit')"
              >
                <span class="el-dorpdown-link" style="color:#999;">
                  优先级:
                  <span class="header-context-dropdown">
                    {{ priorityText }}
                  </span>
                </span>
              </div>
              <el-dropdown @command="handleCommand" v-else placement="bottom">
                <span class="el-dropdown-link">
                  优先级:
                  <span class="header-context-dropdown">
                    {{ priorityText }}
                  </span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(k, v) in priorityObj"
                    :command="v"
                    :key="v"
                    >{{ k }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </template>
          <!-- 开始时间与截至时间 -->
          <section class="time-range-box">
            <ross-time-range
              v-if="getAuthByAction('startTime', 'read')"
              :startTime="taskData.startTime"
              :endTime="taskData.endTime"
              :startCanEdit="getAuthByAction('startTime', 'edit')"
              :endCanEdit="getAuthByAction('endTime', 'edit')"
              @startPick="handleStartTimeDateChange"
              @endPick="handleEndTimeDateChange"
            />
          </section>
          <!-- 重复周期 -->
          <section class="cyclical-box">
            <ross-repeat
              v-if="getAuthByAction('cyclical', 'read')"
              :canEdit="getAuthByAction('cyclical', 'edit')"
              :cyclical="this.taskData.cyclical"
              @pick="handleCyclical"
            />
          </section>
          <!-- 自定义提醒 -->
          <section class="remind-box">
            <ross-remind
              v-if="getAuthByAction('remindTime', 'read')"
              :remindTime="taskData.remindTime"
              :canEdit="getAuthByAction('remindTime', 'edit')"
              @pick="handleRemindTimeDateChange"
            />
          </section>
          <!-- 标签 -->
          <div class="tag-box">
            <span class="label">标签:</span>
            <ross-tag
              isEdit
              @input="handleTagChange"
              :canEdit="getAuthByAction('tags', 'edit')"
              :value="tags"
              :processId="processInstanceId"
            />
          </div>
        </div>
      </div>
      <div class="bar"></div>
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <TaskMessage
              :auths="auths"
              :isParent="!taskData.parent"
              :rootId="rootId"
              :finishFetch="finishFetch"
              @updateField="handleFieldUpdate"
              :baseInfoRes="taskData.baseInfoRes || {}"
              :fileDtos="taskData.fileDtos"
              :status="taskData.status"
              :persons="personsDataList"
              :hasMessagePage="isMessageRoute"
            />
          </el-tab-pane>
          <el-tab-pane label="任务动态" name="tasklog">
            <operation-log
              v-if="activeName === 'tasklog'"
              :processInstanceId="processInstanceId"
            ></operation-log>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export { default } from './detail.js'
</script>
<style lang="scss" src="./index.scss" scoped></style>
