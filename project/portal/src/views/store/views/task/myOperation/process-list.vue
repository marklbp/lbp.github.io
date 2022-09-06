<template>
  <ul class="operate-item" v-show="list.length">
    <li
      v-for="(item, i) in list"
      :key="i"
      @click="clickItemHandler(item)"
      class="hover-shadow"
      :class="{
        'task-todo': item.status === 0,
        'task-doing': item.status === 1,
        'task-finish': item.status === 2,
        'task-cancle': item.status === 3,
        'task-pause': item.status === 4,
        'task-draft': item.status === 5,
        'task-delay': item.isOverdue
      }"
    >
      <div class="item-title">
        <p class="text-ellis">
          <span class="draft-label" v-if="item.status === 5">【草稿】</span>
          {{ item.label }}
        </p>
        <span class="item-status" v-if="item.status !== 5">{{
          item.status | parseStatus
        }}</span>
        <!-- <span class="item-status" v-if="item.status === 1 || item.status === 4">
          完成度: {{ item.rateProgress }}
        </span> -->
      </div>
      <div class="item-detail">
        <div class="join-people">
          参与人:
          <peoples
            style="margin-left:10px;"
            :list="
              item.assignees.map(val => ({
                name: val.realName || val.username,
                color: val.color
              }))
            "
          />
        </div>
        <div class="item-level">
          优先级：
          <span>
            {{
              ($constant.PRIORITIES[item.priority] &&
                $constant.PRIORITIES[item.priority].name) ||
                $constant.PRIORITIES[0].name
            }}
          </span>
        </div>
        <div class="item-time">
          起止时间:
          <span>
            {{ item.startTime | formatTime }} 至
            {{ item.endTime | formatTime }}
          </span>
        </div>
        <div class="item-more" v-if="operationNum(item.initiator, item.status)">
          <el-dropdown @command="editorHandler(item, $event)" @click.stop>
            <span class="el-dropdown-link" @click.stop>
              <i class="font-icon icon-more-horizontal"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="2">详情</el-dropdown-item> -->
              <el-dropdown-item command="0" v-if="item.status === 0" disabled
                >开始</el-dropdown-item
              >
              <el-dropdown-item
                command="1"
                v-if="
                  item.status === 0 ||
                    item.status === 3 ||
                    item.status === 4 ||
                    item.status === 5
                "
                >编辑</el-dropdown-item
              >
              <el-dropdown-item command="3" disabled v-if="item.status === 0"
                >取消</el-dropdown-item
              >
              <el-dropdown-item command="4" disabled v-if="item.status === 1"
                >暂停</el-dropdown-item
              >
              <el-dropdown-item command="5" disabled v-if="item.status === 3"
                >删除</el-dropdown-item
              >
              <el-dropdown-item command="6" disabled v-if="item.status === 4"
                >重启</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import peoples from '~/components/peoples'
export default {
  props: {
    list: {
      type: Array,
      default: _ => []
    }
  },
  components: {
    peoples
  },
  methods: {
    editorHandler(item, ind) {
      if (+ind === 2 || +ind === 1) {
        this.clickItemHandler(item)
      }
    },
    clickItemHandler(item) {
      this.$router.push(
        `/${this.$route.params.storeId}/flow-detail/${item.rootProcessExec}`
      )
    },
    operationNum(isCreator, status) {
      // 各状态下发起人操作数 {status: number}
      const creatorOpeNum = {
        0: 3,
        1: 1,
        2: 0,
        3: 2,
        4: 2,
        5: 1
      }
      // 各状态下非发起人操作数
      const notCreatorOpeNum = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
      return (isCreator ? creatorOpeNum : notCreatorOpeNum)[status]
    }
  },
  filters: {
    parseStatus(status) {
      return Vue.prototype.$constant.FLOW_STATUS.find(({ id }) => id == status)
        .name
    }
  }
}
</script>
<style lang="scss" scoped>
.operate-item {
  background: white;
  border-radius: 2px;
  padding: 24px 16px;
  list-style: none;
  margin: 0;
  min-height: 580px;
  > li {
    border: 1px solid #f2f2f2;
    border-radius: 2px;
    padding: 22px 24px 12px;
    margin-bottom: 8px;
    cursor: pointer;
  }
}
.item-title {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  .draft-label {
    color: #3366ff;
  }
  > p {
    padding: 0;
    margin: 0;
    margin-right: 16px;
    font-size: 14px;
    max-width: 612px;
  }
  > div {
    border: 1px solid #3366ff;
    color: #3366ff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border-radius: 100px;
    background: rgba(51, 102, 255, 0.1);
    width: 198px;
    height: 20px;
    box-sizing: border-box;
    > .item-process {
      height: 5px;
      width: 76px;
      background: white;
      margin-left: 8px;
      border-radius: 100px;
      overflow: hidden;
      > span {
        display: block;
        background: #3366ff;
        height: 100%;
        border-radius: 100px;
      }
    }
  }
}
.item-detail {
  color: #999;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: relative;
}
%item-cover {
  opacity: 0.6;
}
.item-status {
  padding: 0 8px;
  font-size: 12px;
  line-height: 20px;
  margin-right: 8px;
  border-radius: 100px;
  text-align: center;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  padding: 0 10px;
}
.task-todo {
  .item-status {
    background: #f0f0f0;
    color: #999999;
  }
}
.task-doing {
  .item-status {
    color: #3366ff;
    background: rgba(51, 102, 255, 0.1);
  }
}
.task-finish {
  @extend %item-cover;
  background: #fafafa;
  .item-status {
    color: #3366ff;
    background: rgba(51, 102, 255, 0.1);
  }
}
.task-cancle {
  @extend %item-cover;
  background: #fafafa;
  .item-status {
    color: #999;
    background: #f0f0f0;
  }
  > .item-title > p {
    text-decoration: line-through;
  }
}
.task-pause {
  @extend %item-cover;
  background: #fafafa;
  .item-status {
    color: #999;
    background: #f0f0f0;
  }
}
.task-delay {
  .item-status {
    background: rgba(237, 64, 64, 0.1);
    color: #ed4040;
  }
  .item-detail {
    .item-time > span {
      background: #ed4040;
      color: white;
      border-radius: 2px;
    }
  }
}
.join-people {
  margin-right: 38px;
  height: 34px;
  display: flex;
  align-items: center;
}
.item-level {
  margin-right: 40px;
  > span {
    color: #333;
  }
}
.item-time {
  > span {
    color: #333;
    padding: 0 2px;
  }
}
.item-more {
  position: absolute;
  right: 0;
  line-height: 32px;
  cursor: pointer;
  &:hover .font-icon {
    color: #3366ffff;
  }
}
.text-ellis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
