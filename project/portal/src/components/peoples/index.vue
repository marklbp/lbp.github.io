<template>
  <el-tooltip
    class="join-people"
    effect="dark"
    :content="list.map(val => val.name).join('; ')"
    placement="bottom"
    v-if="list && list.length"
  >
    <div class="join-people-list">
      <template v-if="list.length > maxNumber">
        <span
          v-for="order in maxNumber - 1"
          :key="order"
          :style="{
            backgroundColor: list[order - 1]['color'],
            backgroundImage: `url${list[order - 1]['pic']}`,
            zIndex: maxNumber + 1 - order
          }"
          class="people-item"
          @click="clickHandler(order - 1)"
          >{{ list[order - 1]['name'][0] }}
          <i
            :class="[
              {
                'hover-icon': hoverIcon
              },
              `el-icon-${hoverIcon}`
            ]"
          >
          </i>
        </span>
        <span class="more-notice">+{{ list.length + 1 - maxNumber }}</span>
      </template>
      <span
        v-else
        v-for="(mumber, k) in list"
        :key="k"
        class="people-item"
        :style="{
          backgroundColor: list[k]['color'],
          backgroundImage: `url${list[k]['pic']}`,
          zIndex: maxNumber - k
        }"
        @click="clickHandler(k)"
        >{{ list[k]['name'][0] }}
        <i
          :class="[
            {
              'hover-icon': hoverIcon
            },
            `el-icon-${hoverIcon}`
          ]"
        >
        </i>
      </span>
    </div>
  </el-tooltip>
</template>
<script>
export default {
  name: 'peoples',
  props: {
    list: {
      type: Array,
      default: _ => []
      /*
          list: [{
              name: string,
              color: string,
              pic: string
          }]
      */
    },
    maxNumber: {
      type: Number,
      default: _ => 3
    },
    hoverIcon: {
      type: String, // delete
      default: _ => ''
    }
  },
  methods: {
    clickHandler(order) {
      this.$emit('click', order)
    }
  }
}
</script>
<style lang="scss" scoped>
.join-people {
  display: inline-block;
  vertical-align: middle;
}
.join-people-list {
  position: relative;
  align-items: center;
  overflow: hidden;
  > span {
    box-sizing: border-box;
    border-radius: 50%;
    position: relative;
    color: white;
    width: 28px;
    float: left;
    height: 28px;
    text-align: center;
    font-size: 12px;
    background-size: cover;
    margin-left: -10px;
    border: 2px solid white;
    background: transparent center no-repeat;
    background-size: cover;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 100%;

    &:first-child {
      margin-left: 0px;
    }
  }
  .more-notice {
    z-index: 1;
    background: #3366ff;
    text-align: right;
    padding-right: 3px;
  }
}
.people-item {
  position: relative;
}
.hover-icon {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 24px;
  text-align: center;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6) center no-repeat;
}
.people-item {
  &:hover {
    .hover-icon {
      display: block;
    }
  }
}
</style>
