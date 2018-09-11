<template>
	<el-submenu :index="index">
      <span slot="title">
          <i class="lx-iconfont" v-html='menu.unicode||menu.icon'></i>
          {{menu.name}}
      </span>
      <el-menu-item v-for="(item, idx) in menu.menu" v-if="!item.menu || item.menu.length <= 0" :index="item.path || item.value" :key="idx">
        <router-link :to="(item.path || item.value)|addQueryStr(item.id, $route.query)">{{item.name}}</router-link>
      </el-menu-item>
      <submenu v-else :index="item.path || item.value" :menu="item" :isPrivate="isPrivate" :key="idx" />
  </el-submenu>
</template>

<script>
    import mixMenuFilter from './menu-filters'
	export default {
		name: 'submenu',
		props: {
			isPrivate: {
				type: Boolean,
				default: false
			},
			menu: Object,
			index: {
				type: String,
				default: ''
			}
		}
        ,mixins: [mixMenuFilter]
    }
    </script>