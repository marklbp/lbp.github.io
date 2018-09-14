<template>
  <div class="bln-loading" :style="style">
    <div class="bln-loading-wrap">
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" :stroke="color" fill="none"/>
      </svg>
    </div>
  </div>
</template>

<script>

export default {
  name: 'bln-loading',

  props: {
    size: String,
    color: {
      type: String,
      default: 'black'
    }
  },

  computed: {
    style () {
      return this.size ? {
        width: this.size,
        height: this.size
      } : {}
    }
  }
}
</script>

<style lang="scss">
.bln-loading {
  width: 60px;
  height: 60px;
  z-index: 0;
  font-size: 0;
  line-height: 0;
  position: relative;
  vertical-align: middle;
  svg {
    width: 100%;
    height: 100%;

    circle {
      stroke-width: 3;
      stroke-linecap: round;
      animation: bln-circular 1.5s ease-in-out infinite;
    }
  }
}

.bln-loading-wrap {
  z-index: -1;
  width: 100%;
  height: 100%;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  animation: bln-rotate 2s linear infinite;
}

@keyframes bln-circular {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}

@keyframes bln-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
