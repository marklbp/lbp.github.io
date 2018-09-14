<template lang="html">
  <span>{{text}}</span>
</template>

<script>
const DEFAULT_STEP = 5000 // 5 seconds
const DEFAULT_TRY_TIMES = 5 // try 5 times

export default {
  name: 'count-down',
  props: {
    // 服务端时间 ms
    systemTime: {
      type: Number,
      default: Date.now()
    },
    // 起始时间 ms
    startTime: {
      type: Number,
      default: Date.now()
    },
    // 过期时间 ms
    endTime: {
      type: Number,
      default: 0
    },
    // 过期间隔 ms
    duration: {
      type: Number,
      default: 600000
    },
    // 格式
    format: {
      type: String,
      default: 'HH:MM:ss'
    },
    // try times
    tryTimes: {
      type: Number,
      default: DEFAULT_TRY_TIMES
    },
    // step
    step: {
      type: Number,
      default: DEFAULT_STEP
    }
  },
  data () {
    return {
      deadline: 0,
      count: 0,
      calibrate: 0, // subtle,
      intervalId: -1,
      retryTimerId: -1,
      timeoutTimes: 0 // timeout times
    }
  },
  watch: {
    systemTime: function () {
      this.init()
    },
    startTime: function () {
      this.init()
    },
    endTime: function () {
      this.init()
    },
    duration: function () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    text () {
      return format(this.count, this.format)
    },
    stop () {
      return this.timeoutTimes >= this.tryTimes
    }
  },
  methods: {
    init () {
      if (this.stop) return
      this.deadline = this.startTime + this.duration
      if (this.endTime && this.deadline > this.endTime) this.deadline = this.endTime
      this.calibrate = this.systemTime - Date.now()
      clearInterval(this.intervalId)
      this.calculate()
      this.intervalId = setInterval(() => { this.calculate() }, 500)
    },
    calculate () {
      var now = Date.now() + this.calibrate
      var count = this.deadline - now
      if (count >= 0) {
        this.count = count
      } else {
        this.count = 0
        clearInterval(this.intervalId)
        this.onTimeout()
      }
    },
    onTimeout () {
      if (this.stop) {
        this.$emit('timeover')
        return
      }

      this.retryTimerId = setTimeout(() => {
        this.$emit('timeout')
      }, this.step * this.timeoutTimes++)
    },
    destroyed () {
      clearInterval(this.intervalId)
      clearTimeout(this.retryTimerId)
    }
  }
}
function serializeText (text) {
  if (text < 10) {
    text = '0' + text
  }
  return text
}
function format (ms, format) {
  var seconds = Math.floor(ms / 1000)
  var minutes = Math.floor(seconds / 60)
  var hours = Math.floor(minutes / 60)
  return format
    .replace('HH', serializeText(hours))
    .replace('MM', format.indexOf('HH') >= 0 ? serializeText(minutes % 60) : serializeText(minutes))
    .replace('ss', format.indexOf('MM') >= 0 ? serializeText(seconds % 60) : serializeText(seconds))
}
</script>
