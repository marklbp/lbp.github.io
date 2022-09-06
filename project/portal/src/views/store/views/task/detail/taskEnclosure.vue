<template>
  <div class="header-des">
    <template v-if="list.length">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="downLoad(item)"
        :title="item.name"
      >
        <div class="file-attrs">
          <span class="file-type"
            ><i
              class="font-icon"
              :class="extName.includes(item.extName) ? 'picture' : 'article'"
            ></i
          ></span>
          <div class="file-name">{{ item.name }}</div>
        </div>
        <span class="download"><i class="font-icon download"></i></span>
      </div>
    </template>
    <empty :type="0" v-else />
  </div>
</template>
<script>
import empty from '~/components/empty'
export default {
  name: 'taskEnclosure',
  props: ['value'],
  data() {
    return {
      extName: ['png', 'jpeg', 'jpg']
    }
  },
  components: {
    empty
  },
  computed: {
    list: {
      get() {
        return this.value.map(item => {
          let itemExtNameList = item.url.split('.')
          let itemExtNameListLength = itemExtNameList.length
          return {
            ...item,
            extName: itemExtNameList[itemExtNameListLength - 1]
          }
        })
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    downLoad(item) {
      this.$helper.downloadByUrl(
        `${item.url}?t=${new Date().getTime()}`,
        item.name
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.header-des {
  padding-bottom: 20px;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 33px;
    line-height: 33px;
    padding-left: 12px;
    padding-right: 12px;
    cursor: pointer;
    .file-attrs {
      display: flex;
      flex: 1;
      .file-type {
        width: 16px;
        margin-right: 12px;
      }
      .file-name {
        max-width: 500px;
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #333;
      }
    }
    .download {
      display: none;
    }
    &:hover {
      background: rgba(245, 245, 245, 1);
      .download {
        display: block;
      }
    }
  }

  .add-hover {
    background: rgba(245, 245, 245, 1);
  }
}
</style>
