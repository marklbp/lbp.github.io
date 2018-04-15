# Mac下的常用命令行说明

1 .打开指定目录
open 指定目录

2. 创建指定的目录
mkdir 指定目录名

3. 更新mac后使用git报“xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools)...”
解决办法：xcode-select --install

4. Python 搭建
	步骤：
		1.全局安装python
		2.启动终端（命令行窗口）
		3.指定web根目录
			cd 指定的web根目录
		4.启动命令
			python -m SimpleHTTPServer

	提示：
		1.默认启动web服务访问方式
			http://localhost:8000
			http://机器ip地址:8000
			http://127.0.0.1:8000
		2.默认开启的web服务根目录为指定的目录
		3.在浏览器里访问时，如果在根目录下的有index.html则显示index.html,反之显示目录列表
		4.改变web服务的默认端口命令
			python -m SimpleHTTPServer 指定端口号
		5.这里的“Web服务器模块”有如下三种:
		  BaseHTTPServer ➡ ️提供基本的Web服务和处理器类，分别是HTTPServer和BaseHTTPRequestHandler
          SimpleHTTPServer ➡ ️包含执行GET和HEAD请求的SimpleHTTPRequestHandler类
          CGIHTTPServer ➡ ️包含处理POST请求和执行CGIHTTPRequestHandler类


5. Node.js 搭建
	步骤：
		1.搭建node环境
		2.启动终端界面（命令行窗口）
		3.安装http-server
			npm install http-server -g

		4.启动命令
			http-server [path] [options]


6. php + apache
	步骤：
		1.启动终端
		2.启动mac自带apache服务
			sudo apachectl start[restart|stop]
		3.mac下apache默认服务器根目录在/Library/WebServer/Documents
		4.mac下自带php，只需在apache添加对php支持即可，编辑指定如下的文件
			sudo vim /etc/apache2/httpd.conf
			去掉LoadModule php5_module libexec/apache2/libphp5.so前的#后保存
		5.重启apache服务
			sudo apachectl restart
		6.进入apache默认的web服务根目录下新建php页面
		7.浏览器访问localhost



7. MAC升级Nodejs和Npm到最新版
	第一步，先查看本机node.js版本：
	node -v

	第二步，清除node.js的cache：
	sudo npm cache clean -f

	第三步，安装 n 工具，这个工具是专门用来管理node.js版本的，别怀疑这个工具的名字，是他是他就是他，他的名字就是 "n"
	sudo npm install -g n

	第四步，安装最新版本的node.js
	sudo n stable|latest

	第五步，再次查看本机的node.js版本：
	node -v

	第六步，更新npm到最新版：
	$ sudo npm install npm@latest -g

	第七步，验证
	node -v
	npm -v