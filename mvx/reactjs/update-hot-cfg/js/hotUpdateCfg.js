seajs.use('./plugins/seajs/seajs-preload.js',function(){

	//预加载插件引入成功后执行回调
	seajs.config({
		//seajs配置
		alias:{
			//别名
			'react'      : '../plugins/react/0.14.0/react'
			,'react-dom' : '../plugins/react/0.14.0/react-dom'
			,'browser'   : '../plugins/react/browser.min'
			,'jquery'    : 'plugins/jquery/1.11.3/jquery.min'
			,'alertbox'  : '../plugins/alertbox/alertbox'

		}
		,paths:{
			//路径
			'plugins':'./plugins'
		}
		//预加载配置
		,preload:['jquery']
	})
	seajs.use('./js/hotUpdateCfgInit');
})