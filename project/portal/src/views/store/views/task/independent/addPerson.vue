<template>
  <div class="selectPerson" @click.stop="() => {}">
    <div class="personSelected">
      <div class="seledItem last">
        <span class="addPerson" @click.stop="changePersonListShowStatus"></span>
        <div class="personList" v-show="showPersonStatus">
          <div class="search">
            <div class="inputBox">
              <i class="font-icon icon-search"></i>
              <input type="text" v-model="searchKey" placeholder="搜索" />
            </div>
          </div>
          <div class="cutScroll">
            <ol>
              <li
                v-for="(item, index) in showPersonList"
                :key="item.id"
                class="personItem"
                :class="{ active: item.active }"
                @click="selPerson(item, index)"
              >
                {{ item.realName }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div v-show="noRules" class="el-form-item__error">该选项必选</div>
  </div>
</template>

<style lang="scss" scoped>
.hide {
  display: none;
}
.addPerson {
  display: block;
  position: relative;
  width: 28px;
  height: 28px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  &:after,
  &:before {
    content: '';
    position: absolute;
    width: 13px;
    height: 1px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #999;
    border-radius: 1px;
  }
  &:after {
    height: 13px;
    width: 1px;
  }
}
.selectPerson {
  .personSelected {
    ul {
      display: flex;
      padding: 0;
      margin: 0;
      .seledItem {
        position: relative;
        width: 30px;
        height: 30px;
        border: 2px solid #fff;
        background: #fff;
        border-radius: 50%;
        list-style: none;
        cursor: pointer;
        text-align: center;
        line-height: 30px;
        color: #fff;
        overflow: hidden;
        &.more {
          background: #3366ff;
          font-size: 12px;
          text-align: center;
          line-height: 30px;
        }
        .delPerson {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          top: 0;
          left: 0;
          &:hover {
            .delPerson {
              display: block;
            }
          }
          display: none;
        }
        &:hover {
          .delPerson {
            display: block;
          }
        }
        img {
          position: absolute;
          width: 100%;
          height: auto;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
.del-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px dashed #ddd;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}

.personList {
  position: absolute;
  z-index: 1000;
  top: 35px;
  left: 0;
  z-index: 1000;
  width: 300px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .search {
    padding: 12px;
    .inputBox {
      position: relative;
      height: 30px;
      padding-left: 30px;
      border: 1px solid #d9d9d9;
      border-radius: 1px;
      .icon-search {
        position: absolute;
        width: 30px;
        height: 30px;
        left: 0;
        top: 0;
        font-size: 16px;
        color: #999;
        text-align: center;
        line-height: 30px;
      }
      input {
        display: block;
        width: 100%;
        height: 30px;
        border: none;
        background: none;
        outline: none;
        font-size: 12px;
        color: #666;
      }
    }
  }
  .cutScroll {
    max-height: 300px;
    overflow: hidden;
  }
  ol {
    max-height: 300px;
    margin-right: -15px;
    margin-bottom: -15px;
    overflow: scroll;
    list-style: none;
    padding: 0 12px;
    width: 120%;
    box-sizing: border-box;
    list-style-type: none;
    .personItem {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #333;
      text-align: left;
      list-style: none;
      &:hover {
        background: #f5f5f5;
      }
      &.active {
        color: #3366ff;
      }
    }
  }
}
</style>

<script>
export default {
  name: 'addPerson',
  props: {
    personList: {
      type: Array,
      default: _ => []
    },
    seledPersons: {
      type: Array,
      default: _ => []
    },
    // 是否单选
    isSingleChoice: {
      type: Boolean,
      default: false
    },
    //是否必填项
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPersonStatus: false,
      // //已经选择的人员信息
      seledPersonList: [],
      //搜索关键词
      searchKey: '',
      //判断非页面加载
      isDirty: false
    }
  },
  watch: {
    // 选择更改时清除当前样式
    seledPersons(newV) {
      this.showPersonList.forEach(val => {
        val.active = newV.some(item => item.id === val.id)
      })
      this.$forceUpdate()
    }
  },
  computed: {
    //关键词搜索 用于显示的人员系信息
    showPersonList() {
      return this.personList.filter(v => {
        return v.realName.includes(this.searchKey)
      })
    },
    //是否进行脏检查之后仍然不和规矩
    noRules() {
      return this.isRequired && this.isDirty && !this.seledPersonList.length
    }
  },
  mounted() {
    document.addEventListener(
      'click',
      e => {
        this.showPersonStatus = false
      },
      false
    )
  },
  methods: {
    changePersonListShowStatus() {
      this.showPersonStatus = !this.showPersonStatus
      this.isDirty = true
    },
    selPerson(person, index) {
      let seledPersonList = JSON.parse(JSON.stringify(this.seledPersons))
      //单选
      if (this.isSingleChoice) {
        seledPersonList = [person]
        //标识出列表中选中的样式
        this.showPersonList.forEach((v, index) => {
          this.showPersonList[index]['active'] = false
        })
        this.$set(this.showPersonList[index], 'active', true)
      } else {
        //多选
        let existSeledIndex = seledPersonList.findIndex(v => v.id === person.id)
        if (~existSeledIndex) {
          seledPersonList.splice(existSeledIndex, 1)
        } else {
          seledPersonList.push(person)
        }
        //标识出列表中选中的样式
        this.$set(this.showPersonList[index], 'active', !~existSeledIndex)
      }
      this.$emit('changeSeledItem', seledPersonList)
      this.$forceUpdate()
    },
    delPerson(person, index) {
      //init 选中样式
      let delIndex = this.showPersonList.findIndex(v => v.id === person.id)
      this.$set(this.showPersonList[delIndex], 'active', false)
      this.seledPersonList.splice(index, 1)
      this.$emit('changeSeledItem', this.seledPersonList)
      this.$forceUpdate()
    }
  }
}
</script>
