<template>
  <ul class="menu-list">
    <li
      v-for="(menu, index) in menus"
      :key="index + Math.random()"
      v-show="menu.showSelf || collapsed"
    >
      <router-link
        v-if="menu.href && !menu.hide"
        :to="menu.href | replaceMenu"
        :style="{ paddingLeft: indent + 'px' }"
      >
        <span
          class="icon"
          v-if="menu.icon"
          :style="{
            display: 'inline',
            verticalAlign: 'baseline',
            lineHeight: '100%'
          }"
          ><i
            class="font-icon"
            :class="[menu.icon]"
            style="font-size:22px"
            :style="{
              visibility:
                (inStore && collapsed && menu.id === 1) ||
                (inStore && !collapsed && menu.id !== 1)
                  ? 'hidden'
                  : undefined,
              fontSize: inStore && menu.id === 1 ? '18px' : undefined,
              paddingRight: inStore && menu.id === 1 ? '4px' : undefined
            }"
          ></i
        ></span>
        <span
          class="text"
          :style="{ paddingLeft: menu.icon ? '0px' : '66px' }"
          >{{ menu.text }}</span
        >
        <span
          v-if="menu.id === 1 && !inStore"
          class="el-icon-arrow-right arrow-right"
        ></span>
      </router-link>
      <a
        href="javascript:void(0)"
        :class="{
          back: menu.showChildren && !collapsed
        }"
        style="margin-bottom:0px;"
        @click="toggleSubMenu(menu, menus)"
        v-show="menu.children.every(m => !m.showChildren) || collapsed"
        @mouseenter="enter($event, menu, menus)"
        @mouseleave="leave($event, menu, menus)"
        v-if="!menu.href && !menu.hide"
      >
        <span class="icon" v-if="menu.icon"
          ><i
            class="font-icon"
            :class="[menu.icon]"
            :style="{
              visibility: inStore && !collapsed ? 'hidden' : 'visible'
            }"
          ></i
        ></span>
        <span class="text" style="padding-left:66px;">{{ menu.text }}</span>
        <i
          class="font-icon down"
          :style="{ fontSize: '12px', right: '16px' }"
        ></i>
      </a>
      <div
        class="menu-child"
        style="paddint-left:20px;"
        :class="inStore && collapsed ? 'lay-right' : ''"
        @mouseenter="enter($event, menu, menus)"
        @mouseleave="leave($event, menu, menus)"
        v-if="menu.children && menu.children.length > 0"
        v-show="menu.showChildren"
      >
        <menu-static
          :root-menus="rootMenus"
          :menus="menu.children"
          :collapsed="collapsed"
          :layer="layer + 1"
          :active-indexs="activeIndexs"
          :parent-index="index"
          :indent="10"
        />
      </div>
    </li>
  </ul>
</template>
<script>
let vmMenu
export default {
  name: 'menu-static',
  props: {
    rootMenus: {
      type: Array
    },
    menus: {
      type: Array
    },
    collapsed: {
      type: Boolean
    },
    activeIndexs: {
      type: Array
    },
    layer: {
      type: Number
    },
    parentIndex: {
      type: Number
    },
    indent: {
      type: Number,
      default: 0
    }
  },
  data() {
    vmMenu = this
    return {}
  },
  filters: {
    replaceMenu(v) {
      return (v || '').replace(/:(\w+)/g, (s, a) => {
        if (vmMenu.$route.params.hasOwnProperty(a)) {
          return vmMenu.$route.params[a]
        }
        return ':' + a
      })
    }
  },
  methods: {
    isActive(index) {
      let path = this.activeIndexs || []
      if (this.layer) {
        return (
          this.$parent.isActive(this.parentIndex) && path[this.layer] === index
        )
      }
      return path[this.layer] === index
    },
    enter(e, m, ms) {
      if (!this.collapsed) return
      let li = e.target.parentNode
      if (li.timer) clearTimeout(li.timer)
      let menu = li.querySelector('.menu-child')
      menu.style.display = 'block'
      if (this.getStyle(menu, 'position') === 'fixed') {
        menu.style.top = li.getBoundingClientRect().top + 'px'
      }
    },
    leave(e, m, ms) {
      if (!this.collapsed) return
      let li = e.target.parentNode
      if (li.timer) clearTimeout(li.timer)
      li.timer = setTimeout(_ => {
        li.querySelector('.menu-child').style.display = 'none'
      }, 50)
    },
    toggleSubMenu(menu, menus) {
      if (this.collapsed) return
      menu.showChildren = !menu.showChildren
      // menus.forEach(m => {
      //   if (m !== menu) m.showSelf = !menu.showChildren
      // })
    },
    getStyle(ele, attr) {
      if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[attr]
      }
      return ele.currentStyle[attr]
    }
  },
  computed: {
    inStore() {
      return !!this.$route.params.storeId
    }
  }
}
</script>
<style lang="scss" scoped>
.arrow-right {
  float: right;
  line-height: 48px;
  margin-right: 16px;
}
.lay-right {
  position: fixed;
  z-index: 1000;
}
</style>
