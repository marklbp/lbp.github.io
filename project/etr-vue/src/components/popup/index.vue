<template>
  <div class="popup-container" :class="{['popup-container-' + position]: true, 'has-mask': hasMask}" v-show="isPopupShow">
    <transition name="fade">
      <div class="popup-mask" v-show="hasMask && isPopupBoxShow" @click="$_onPopupMaskClick" />
    </transition>
    <transition :name="transition"
      @before-enter="$_onPopupTransitionStart"
      @before-leave="$_onPopupTransitionStart"
      @after-enter="$_onPopupTransitionEnd"
      @after-leave="$_onPopupTransitionEnd"
    >
     <div class="popup-content" :class="transition" v-show="isPopupBoxShow">
       <slot />
     </div> 
    </transition>
  </div>
</template>

<script>
export default {
  name: 'popup',
  props: {
    value: {
      type: Boolean,
      default: _ => false
    },
    hasMask: {
      type: Boolean,
      default: _ => true
    },
    maskClosable: {
      type: Boolean,
      default: _ => true
    },
    position: {
      type: String,
      default: _ => 'center'
    },
    transition: {
      type: String,
      default: function () {
        switch (this.position) {
          case 'bottom':
            return 'slide-up';
          case 'top':
            return 'slide-down';
          case 'left':
            return 'slide-right';
          case 'right':
            return 'slide-left';
          default:
            return 'fade';
        }
      }
    },
    preventScroll: {
      type: Boolean,
      default: false
    },
    preventScrollExclude: {
      type: [String, HTMLElement],
      default: function() {
        return '';
      }
    }
  },

  data() {
    return {
      isPopupShow: false,
      isPopupBoxShow: false,
      isAnimation: false
    };
  },


  watch: {
    value(val) {
      var _this = this;

      if (val) {
        if (this.isAnimation) {
          setTimeout(function () {
            _this.$_showPopupBox();
          }, 50);
        } else {
          this.$_showPopupBox();
        }
      } else {
        this.$_hidePopupBox();
      }
    },
    preventScrollExclude(val, oldVal) {
      this.$_preventScrollExclude(false, oldVal);

      this.$_preventScrollExclude(true, val);
    }
  },

  mounted() {
    this.value && this.$_showPopupBox();
  },


  methods: {
    $_showPopupBox: function $_showPopupBox() {
      var _this2 = this;

      this.isPopupShow = true;
      this.isAnimation = true;

      this.$nextTick(function () {
        _this2.isPopupBoxShow = true;

        if (process.env.NODE_ENV === 'testing') {
          _this2.$_onPopupTransitionEnd();
        }
      });

      this.preventScroll && this.$_preventScroll(true);
    },
    $_hidePopupBox: function $_hidePopupBox() {
      this.isAnimation = true;
      this.isPopupBoxShow = false;
      this.preventScroll && this.$_preventScroll(false);
      this.$emit('input', false);

      if (process.env.NODE_ENV === 'testing') {
        this.$_onPopupTransitionEnd();
      }
    },
    $_preventScroll: function $_preventScroll(isBind) {
      var handler = isBind ? 'addEventListener' : 'removeEventListener';
      var masker = this.$el.querySelector('.popup-mask');
      var boxer = this.$el.querySelector('.popup-content');

      masker && masker[handler]('touchmove', this.$_preventDefault, false);
      boxer && boxer[handler]('touchmove', this.$_preventDefault, false);
      this.$_preventScrollExclude(isBind);
    },
    $_preventScrollExclude: function $_preventScrollExclude(isBind, preventScrollExclude) {
      var handler = isBind ? 'addEventListener' : 'removeEventListener';
      preventScrollExclude = preventScrollExclude || this.preventScrollExclude;
      var excluder = preventScrollExclude && typeof preventScrollExclude === 'string' ? this.$el.querySelector(preventScrollExclude) : preventScrollExclude;
      excluder && excluder[handler]('touchmove', this.$_stopImmediatePropagation, false);
    },
    $_preventDefault: function $_preventDefault(event) {
      event.preventDefault();
    },
    $_stopImmediatePropagation: function $_stopImmediatePropagation(event) {
      event.stopImmediatePropagation();
    },
    $_onPopupTransitionStart: function $_onPopupTransitionStart() {
      if (!this.isPopupBoxShow) {
        this.$emit('beforeHide');
        this.$emit('before-hide');
      } else {
        this.$emit('beforeShow');
        this.$emit('before-show');
      }
    },
    $_onPopupTransitionEnd: function $_onPopupTransitionEnd() {
      if (!this.isAnimation) {
        return;
      }

      if (!this.isPopupBoxShow) {
        this.isPopupShow = false;
        this.$emit('hide');
      } else {
        this.$emit('show');
      }

      this.isAnimation = false;
    },
    $_onPopupMaskClick: function $_onPopupMaskClick() {
      if (this.maskClosable) {
        this.$_hidePopupBox();
        this.$emit('maskClick');
      }
    }
  }
};
</script>
<style lang="scss">
.popup-container{
  .popup-content {
    position: fixed;
    z-index: 1000;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    will-change: auto;
    &.slide-up {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  .popup-mask {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    z-index: 1;
    background-color: rgba(0,0,0,0.4);
  }
  .has-mask {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    z-index: 1000; 
    .popup-content {
      position: absolute;
      z-index: 2;
    }
  }
  &-center {
    .popup-content {
      top: 50%;
      right: auto;
      bottom: auto;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
  }
  &-top,
  &-bottom,
  &-left,
  &-right {
    .popup-content {
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
    }
  }
  &-top,
  &-bottom {
    .popup-content {
      width: 100%;
    }
  }
  &-left,
  &-right {
    .popup-content {
      height: 100%;
    }
  }
  &-top {
    .popup-content {
      top: 0;
      left: 0;
    }
  }
  &-bottom {
    .popup-content {
      bottom: 0;
      left: 0;
    }
  }
  &-left {
    .popup-content {
      left: 0;
      top: 0;
    }
  }
  &-right .popup-content {
    right: 0;
    top: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to,
  .fade-leave-active {
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
  .slide-up-enter-active,
  .slide-up-leave-active,
  .slide-down-enter-active,
  .slide-down-leave-active,
  .bottom .show {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  .slide-up-enter,
  .slide-up-leave-to {
    -webkit-transform: translateY(70%);
    transform: translateY(70%);
  }
  .slide-up-leave-active {
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
  }
  .slide-down-enter,
  .slide-down-leave-to {
    -webkit-transform: translateY(-70%);
    transform: translateY(-70%);
  }
  .slide-down-leave-active {
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
  }
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
  .slide-left-enter,
  .slide-left-leave-to {
    -webkit-transform: translateX(70%);
    transform: translateX(70%);
  }
  .slide-left-leave-active {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }
  .slide-right-enter,
  .slide-right-leave-to {
    -webkit-transform: translateX(-70%);
    transform: translateX(-70%);
  }
  .slide-right-leave-active {
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }
}
</style>