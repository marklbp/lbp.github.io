<template>
  <div class="md-popup-title-bar" @touchmove="preventScroll">
    <div v-if="cancelText" class="title-bar-left md-popup-cancel" @click="$emit('cancel')">{{cancelText}}</div>
    <template v-else>
      <div v-if="$slot.cancel" class="title-bar-left md-popup-cancel" @click="$emit('cancel')">
        <slot name="cancel" />
      </div>
    </template>
    <div v-if="title" class="title-bar-title">{{title}}</div>
    <div v-else class="title-bar-title">
      <slot name="title"/>
    </div>
    <div v-if="okText" class="title-bar-right md-popup-confirm" @click="$emit('confirm')">{{okText}}</div>
    <template v-else>
      <div v-if="$slots.confirm" class="title-bar-right md-popup-confirm" @click="$emit('confirm')">
        <slot name="confirm" />
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'title-bar',
  props: {
    title: {
      type: String,
      default: ''
    },
    okText: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: ''
    }
  },
  methods: {
    preventScroll(e) {
      e.preventDefault();
    }
  }
};
</script>
<style lang="scss" scoped>
.popup-title-bar {
  position: relative;
  width: 100%;
  height: 110px;
  background: #fff;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    z-index: 2;
    background-color: #d9d9d9;
    -webkit-transform-origin: 100% 50%;
    transform-origin: 100% 50%;
    -webkit-transform: scaleY(0.5) translateY(100%);
    transform: scaleY(0.5) translateY(100%);
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
  }
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  >div {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    float: left;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
            align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
            justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    word-wrap: break-word;
    white-space: nowrap;
    color: #333;
  }
  .title-bar-left,
  .title-bar-right {
    position: absolute;
    width: 20%;
    font-size: 28px;
    box-sizing: border-box;
  }
  .title-bar-title {
    width: 100%;
    padding: 0 20%;
    box-sizing: border-box;
    font-size: 36px;
  }
  .title-bar-left {
    left: 0;
    color: #666;
  }
  .title-bar-right {
    right: 0;
    color: #fc9153;
  }

}
@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
  .popup-title-bar::before {
    -webkit-transform: scaleY(0.33) translateY(100%);
    transform: scaleY(0.33) translateY(100%);
  }
}
</style>