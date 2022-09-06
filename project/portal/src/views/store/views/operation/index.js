import pageInit from '~/components/page-init'
export default {
  name: 'businessProcess',
  data() {
    return {
      items: [],
      itemIndex: '0',
      searchWords: '',
      loading: true,
      message: ''
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {
    pageInit
  },
  methods: {
    closeHandle() {
      this.$emit('input', false)
    },
    checkoutHandle(template) {
      // 点击流程列表跳转
      this.$router.push(
        '/' + this.$route.params.storeId + '/template-detail/' + template.id
      )
    },
    useHandle(template) {
      // 点击启用按钮跳转
      this.$router.push(
        '/' + this.$route.params.storeId + '/flow-start/' + template.modelId
      )
    },
    searchHandler() {
      this.getAll()
    },
    scrollHandler() {
      // 楼层效果处理
      if (this.timer || this.preventScrollHandler) return
      this.timer = setTimeout(() => {
        this.timer = null
        const scrollTop = this.$refs.itemWrap.scrollTop
        let currentIndex = 0
        for (let i = this.items.length - 1; i > -1; i--) {
          if (scrollTop > this.$refs[i][0].offsetTop - 30) {
            currentIndex = i
            break
          }
        }
        this.itemIndex = currentIndex + ''
      }, 100)
    },
    clickHandler(item) {
      for (let i = 0; i < this.items.length; i++) {
        if (i + '' === item.index) {
          this.preventScrollHandler = true
          setTimeout(() => {
            this.preventScrollHandler = false
          })
          this.$refs.itemWrap.scrollTop = this.$refs[i][0].offsetTop - 16
          break
        }
      }
    },
    getProcessData(params) {
      return this.$api.template.list(params, {
        headers: { groupId: this.$route.params.storeId }
      })
    },
    getAllCategory(params) {
      return (
        this.allCategory ||
        this.$api.flowSetting.getCategoryList(params, {
          headers: { groupId: this.$route.params.storeId }
        })
      )
    },
    getAll() {
      // 获取所有数据
      this.loading = true
      Promise.all([
        this.getAllCategory(),
        this.getProcessData({
          pageSize: -1,
          groupId: this.$route.params.storeId,
          name: this.searchWords,
          status: 1
        })
      ])
        .then(arr => {
          this.allCategory = arr[0]
          const items = arr[0].data.map(val => {
            return { name: val.name, list: [] }
          })
          arr[1].data.records.forEach(val => {
            for (let item of items) {
              if (item.name === val.categoryName) {
                item.list.push(val)
                break
              }
            }
          })
          this.items = items.filter(val => val.list && val.list.length)
          this.loading = false
          if (!this.items.length) {
            this.message = '暂无数据'
          } else {
            this.message = ''
          }
        })
        .catch(err => {
          this.loading = false
          this.message = err.msg || err.message
          console.log(err)
        })
    }
  },
  mounted() {
    const { itemWrap } = this.$refs
    itemWrap && itemWrap.addEventListener('scroll', this.scrollHandler)
    this.getAll()
  },
  beforeDestory() {
    const { itemWrap } = this.$refs
    itemWrap && itemWrap.removeEventListener('scroll', this.scrollHandler)
  }
}
