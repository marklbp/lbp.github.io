<template>
  <el-dialog
    :close-on-click-modal="false"
    custom-class="dialog_add"
    :title="
      addType === '0'
        ? '新增系统模块'
        : `${addType === '1' ? '新增' : '编辑'}自定义链接`
    "
    :visible="value"
    :width="addType === '0' ? '400px' : '385px'"
    @close="close"
    @open="open"
  >
    <div v-show="addType === '0'">
      <p class="add_com_item"><span>*&nbsp;</span>请勾选需要展示的系统模块</p>
      <el-checkbox-group class="checkbox-group" v-model="checkList">
        <el-checkbox
          v-for="(component, index) in components"
          :key="'component' + index"
          :label="component"
        >
          {{ componentNames[index] }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <el-form
      v-show="addType === '1' || addType === '2'"
      ref="ruleForm"
      :rules="rules"
      :model="form"
      label-width="80px"
      label-position="top"
    >
      <el-form-item prop="title">
        <div slot="label" class="add_com_item"><span>*&nbsp;</span>标题</div>
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item prop="src">
        <div slot="label" class="add_com_item"><span>*&nbsp;</span>网址</div>
        <el-input v-model="form.src"></el-input>
      </el-form-item>
      <el-form-item prop="height">
        <div slot="label" class="add_com_item"><span>*&nbsp;</span>高度</div>
        <el-input v-model="form.height">
          <template slot="append"
            >px</template
          >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancelAdd">取消</el-button>
      <el-button type="primary" @click="doAdd">{{
        addType === '0' ? '确 定' : addType === '2' ? '确定修改' : '确定添加'
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'dialogAdd',
  components: {},
  data() {
    var validateTitle = (rule, value, callback) => {
      const str = value.replace(/(^\s*)|(\s*$)/g, '')
      if (str === '') {
        callback(new Error('请输入标题'))
      } else if (str.length > 70) {
        callback(new Error('标题输长度过大'))
      } else {
        callback()
      }
    }
    var validateSrc = (rule, value, callback) => {
      const str = value.replace(/(^\s*)|(\s*$)/g, '')
      if (str === '') {
        callback(new Error('请输入网址'))
      } else if (
        !/^(?:(?:https?|ftp):\/\/)?(?:[\da-z.-]+)\.(?:[a-z.]{2,6})(?:\/\w\.-]*)*\/?/.test(
          value
        )
      ) {
        callback(new Error('请输入正确的网址!'))
      } else {
        callback()
      }
    }
    var validateHeight = (rule, value, callback) => {
      const str = value.replace(/(^\s*)|(\s*$)/g, '')
      if (str === '') {
        callback(new Error('请输入高度'))
        return
      }
      if (!/^\+?[1-9][0-9]*$/.test(str)) {
        callback(new Error('请输入正整数'))
        return
      }
      if (Number(str) < 400 || Number(str) > 1080) {
        callback(new Error('超出400—1080px范围'))
        return
      }
      callback()
    }
    return {
      checkList: [],
      components: [
        'dashboardTabs',
        'overviewTask',
        'overviewProcess',
        'knowledgeGlobal',
        'listModuleOperation',
        'listModuleProduct',
        'commonStore'
      ],
      componentNames: [
        'GMV概况',
        '任务概况',
        '流程概况',
        '知识库',
        '运营动态',
        '产品动态',
        '常用店铺'
      ],
      cloneCheckList: [],
      form: {
        title: '',
        src: '',
        height: '600'
      },
      rules: {
        title: [{ validator: validateTitle, trigger: 'blur' }],
        src: [{ validator: validateSrc, trigger: 'blur' }],
        height: [{ validator: validateHeight, trigger: 'blur' }]
      }
    }
  },
  props: {
    value: {
      type: Boolean
    },
    cloneDrogRows: {
      type: [Array, Object]
    },
    addType: {
      type: String,
      default: '0'
    },
    iframeToBeUpdate: {
      type: Object,
      default: null
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 执行添加iframe
          this.$emit('input', false)
          const list = this.cloneDrogRows.slice()
          const height =
            Number(this.form['height'].replace(/(^\s*)|(\s*$)/g, '')) + ''
          if (this.addType === '1') {
            list.push(
              [
                {
                  width: 0,
                  type: 0
                },
                {
                  width: 12,
                  type: 1,
                  component: 'iframeBlock',
                  iframe: {
                    ...this.form,
                    height
                  },
                  height
                },
                {
                  width: 0,
                  type: 0
                }
              ],
              [
                {
                  width: 100,
                  type: 0
                }
              ]
            )
          } else {
            const rowIndex = list.indexOf(this.iframeToBeUpdate.row)
            const ite = this.iframeToBeUpdate.item
            list[rowIndex] = this.iframeToBeUpdate.row.map(item => {
              if (item === ite) {
                return {
                  ...ite,
                  iframe: {
                    ...this.form,
                    height
                  },
                  height
                }
              }
              return item
            })
          }
          this.$emit('updateComps', list)
        } else {
          return false
        }
      })
    },
    cancelAdd() {
      this.$emit('input', false)
    },
    doAdd() {
      if (this.addType === '0') {
        this.$emit('input', false)
        this.$emit('updateComps', this.computeNewList())
      } else {
        this.submitForm('ruleForm')
      }
    },
    close() {
      this.$emit('input', false)
    },
    open() {
      // 打开dialog初始化，为checkList赋值
      const bakRows = this.cloneDrogRows.slice()
      const components = this.components
      let checkList = []
      checkList = this.components.filter(component =>
        this.cloneDrogRows.some(row =>
          row.some(item => item.component === component)
        )
      )
      this.checkList = checkList
      this.cloneCheckList = checkList.slice()
      this.$nextTick(function() {
        this.$refs['ruleForm'].resetFields()
        if (this.addType === '2') {
          const item = this.iframeToBeUpdate.item
          this.form = {
            title: item.iframe.title,
            src: item.iframe.src,
            height: item.height
          }
        }
      })
    },
    computeNewList() {
      // 点确定开始计算新的drogRows
      const drogRows = this.cloneDrogRows.slice()
      const toBeDeleteNames = this.cloneCheckList.filter(
        item => this.checkList.indexOf(item) < 0
      )
      const toBeAddNames = this.checkList.filter(
        item => this.cloneCheckList.indexOf(item) < 0
      )
      if (toBeDeleteNames.length > 0) {
        // 将toBeDeleteNames按照其在drogRows里所在的row划分数组
        const toBeDeleteItemsList = toBeDeleteNames.reduce(
          (total, name, currentIndex) => {
            // 找到所在item和其所在row
            let obj = {}
            let rowIndex = null
            drogRows.forEach((ro, inde) => {
              ro.forEach(ite => {
                if (ite.component === name) {
                  obj.item = ite
                  obj.rowIndex = inde
                  obj.row = ro
                  rowIndex = inde
                }
              })
            })
            const row =
              rowIndex !== null
                ? total.find(iRow =>
                    iRow.some(ite => ite.rowIndex === rowIndex)
                  )
                : rowIndex
            if (row !== undefined) {
              row.push(obj)
            } else {
              total.push([obj])
            }
            return total
          },
          []
        )
        toBeDeleteItemsList.forEach(comsRow => {
          const oldRow = comsRow[0].row
          const oldRowIndex = drogRows.indexOf(oldRow)
          const oldRowLength = oldRow.filter(item => item.type === 1).length
          const lack = oldRowLength - comsRow.length
          const comsRowItemArr = comsRow.map(it => it.item)
          switch (lack) {
            case 0:
              // 删除整行
              drogRows.splice(oldRowIndex - 1, 2)
              break
            case 1:
              // 3 - 2, 2 - 1
              drogRows[oldRowIndex] = [
                {
                  width: 0,
                  type: 0
                },
                {
                  ...oldRow.find(
                    (ite, inde) =>
                      ite.type === 1 && comsRowItemArr.indexOf(ite) < 0
                  ),
                  width: 12
                },
                {
                  width: 0,
                  type: 0
                }
              ]
              break
            case 2:
              // 3 - 1
              const itemIndex = oldRow.indexOf(comsRow[0].item)
              oldRow.splice(itemIndex - 1, 2)
              oldRow.forEach(ite => {
                if (ite.type === 1) {
                  ite.width = 6
                }
              })
              break
            default:
              break
          }
        })
      }
      if (toBeAddNames.length > 0) {
        // 添加的item直接在在drogRows后面追加一个width=12的新row
        toBeAddNames.forEach(ite => {
          drogRows.push(
            [
              {
                width: 0,
                type: 0
              },
              {
                width: 12,
                type: 1,
                component: ite
              },
              {
                width: 0,
                type: 0
              }
            ],
            [
              {
                width: 100,
                type: 0
              }
            ]
          )
        })
      }
      return drogRows
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog_add {
  .add_com_item {
    color: #666666;
    font-size: 12px;
    margin: 0;
    padding: 0;
    span {
      color: #ed4040;
    }
  }
  .checkbox-group {
    padding: 16px 0;
    .el-checkbox {
      margin: 0 10px 16px 0;
    }
  }
}
/deep/ {
  .el-form-item__label {
    line-height: 1;
  }
  .el-button--text {
    color: #666666;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
