<template>
  <el-aside
    class="sidebar"
    @mouseenter.native="handleMouseEnter"
    @mouseleave.native="handleMouseLeave"
  >
    <div class="menu" :class="{ collapsed: collapsed }">
      <div class="logo">
        <span class="icon">
          <img src="~/assets/img/logo.svg" alt="ross" />
        </span>
        <span class="text">宝尊ROSS</span>
      </div>
      <div class="platform" v-show="!inStore && !collapsed">运营门户</div>
      <div class="menu-inner">
        <li v-if="inStore" class="store-menu-title">
          <router-link to="/dashboard" class="to-parent-page-btn">
            <span class="font-icon icon-single-left"></span>
            店铺运营
          </router-link>
        </li>
        <menu-static
          :root-menus="menus"
          :menus="menusList"
          :active-indexs="path"
          :layer="0"
          :collapsed="collapsed"
          :parent-index="0"
        />
      </div>
      <!-- <div class="menu-config">
        <span class="icon"><i class="font-icon setting"></i></span>
        <span class="text">设置</span>
      </div> -->
    </div>
  </el-aside>
</template>
<script>
import Menu from './menu'
import menus from './menus'
let { mapState } = Vuex
function compareMenu(src, des, params) {
  des = (des || '').replace(/:(\w+)/g, (s, a) => {
    if (params.hasOwnProperty(a)) return params[a]
    return ':' + a
  })
  if (src === des) return true
  /*src = src.split('/').filter(p => !!p && isNaN(Number(p)))
  des = (des || '').split('/').filter(p => !!p && isNaN(Number(p)))
  for (var i = 0; i < src.length; i++) {
    for (var j = 0; j < des.length; j++) {
      if (src[i] === des[j]) return true
    }
  }*/
  return false
}
function findMenu(menu, menus, path = [], params) {
  let res
  menus = menus || []
  for (var i = 0; i < menus.length; i++) {
    if (compareMenu(menu.path, menus[i].href, params)) {
      path.unshift(i)
      res = path
      break
    } else {
      if (menus[i].children && menus[i].children.length) {
        res = findMenu(menu, menus[i].children, path, params)
        if (res) {
          path.unshift(i)
          break
        }
      }
    }
  }
  return res
}
export default {
  name: 'siderbar',
  components: {
    'menu-static': Menu
  },
  data() {
    let params = this.$route.params
    return {
      path: [],
      menus,
      menuIndex: (function(r) {
        if (params.storeId !== undefined) return 1
        for (var i = 0; i < menus.length; i++) {
          let path = findMenu(r, menus[i], [], params)
          if (path !== undefined) {
            return i
          }
        }
        return 0
      })({ path: window.location.pathname })
      //shops: this.$cache.get('STORE_LIST') || []
    }
  },
  computed: {
    ...mapState(['collapsed', 'storeMenus']),
    inStore() {
      return !!this.$route.params.storeId
    },
    menusList: function() {
      // 菜单数据取店铺菜单时，数据来源更换为店铺授权的菜单
      if (this.menuIndex === 1) {
        return this.storeMenus
      }
      return this.menus[this.menuIndex]
    }
  },
  provide() {
    return {
      rootMenu: this
    }
  },
  watch: {
    $route(val, prev) {
      if (this.$route.params.storeId !== undefined) this.menuIndex = 1
      let path
      for (var i = 0; i < this.menus.length; i++) {
        path = this.findMenu(val, this.menus[i], [], this.$route.params)
        if (path) {
          this.path = path
          if (i !== this.menuIndex) this.menuIndex = i
          return
        }
      }
      if (
        (val.path === '/' || !path) &&
        this.$route.params.storeId == undefined
      ) {
        this.menuIndex = 0
      }
    }
  },
  methods: {
    findMenu,
    handleMouseEnter() {
      // // hover交互只在当用户点击icon收起菜单后才有效
      // // 用户通过icon展开后没有hover效果
      // if (this.collapsed) {
      //   this.$store.dispatch('toggleMenu', false)
      //   // 添加一个状态标识为移入展开的
      //   this.toggleState = true
      // }
    },
    handleMouseLeave() {
      // // 只有移入展开的才会执行，移出操作
      // if (!this.toggleState) return
      // this.timer && clearTimeout(this.timer)
      // this.timer = setTimeout(() => {
      //   this.$store.dispatch('toggleMenu', true)
      //   this.toggleState = false
      // }, 320)
    }
  }
}
</script>
<style lang="scss" src="./sidebar.scss" />
