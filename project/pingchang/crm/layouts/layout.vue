<template>
    <div class="pch-page-container">
      <Sidebar v-if="mc.showSidebar" :isPrivate="mc.flag" :showSaasSidebar="mc.showSaasSidebar"></Sidebar>
      <div class="pch-container" :class="mc.flag ? 'org-container':''">
        <Header v-if="mc.showHeader"></Header>
        <div class="pch-main-container">
          <!-- 面包屑 -->
          <Breadcrumb v-if="mc.showBreadcrumb" :isPrivate="mc.flag"></Breadcrumb>
          <nuxt class='layout-container'/>
        </div>
        <Footer v-if="mc.showFooter"></Footer>
      </div>
    </div>
</template>
<script>
	import api from '@/api'
	import Cookie from 'js-cookie';
	import Header from '~/components/layout/Header/Header.vue'
	import Breadcrumb from '~/components/layout/Breadcrumb/Breadcrumb.vue'
	import Sidebar from '~/components/layout/Sidebar/Sidebar.vue'
	import Footer from '~/components/layout/Footer/Footer.vue'
	export default {
		props: {
			mc: {
				type: Object,
				default: function(){
					return {
						showHeader: true,
						showSidebar: true,
						showBreadcrumb: true,
						showFooter: true,
            showSaasSidebar:false
					}
				}
			}
		}
		,created(){
			// console.log('layout created', this)
			// if(!this.hasSetHeartToken){
			// 	// 确保只请求一次
			// 	this.hasSetHeartToken = 1;
			// 	setInterval(function(){
			// 		api['getHeartToken']().then(res => {
			// 			Cookie.set('PCTOKEN', res.data.token);
		 //            })
			// 	}, 600000)
			// }
		}
		,components: {
	    	Header,
	    	Sidebar,
	    	Breadcrumb,
	    	Footer
	  	}
	}
</script>
