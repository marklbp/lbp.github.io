var Readline = require('readline');
var Colors = require('colors');
var exec = require("child_process").exec;
var _comment, _branch, readlineErr;
var currentDirectoryPath = process.cwd();
var arr = currentDirectoryPath.match(/(.*\/)([^\/]+)$/);
var proRepo = "http://www1.pingchang666.com:81/web/pingchang-admin-web-pro.git";
if(!arr){
	console.log('当前路径有误'.red)
	process.exit(1);
}

var R = Readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

R.question("请输入本次打包分支名（可供选项：ft1|ft2|ft3|master）：", (branch)=>{
	if(/ft[1-3]|master/.test(branch)){
		_branch = branch;
		R.question("请输入本次修改内容注解（有效注解有益多人开发和版本回滚）：", (comment)=>{
			_comment = comment;
			R.close();
		})
	}else{
		readlineErr = true;
		console.log('输入打包分支名有误，可供选择分支名：ft1|ft2|ft3|master'.red);
		R.close();
	}
})

R.on("close",function(){
	if(readlineErr){
		process.exit(1)
	}else{
		packageFn(_branch, _comment);
	}
})

function packageFn(branch = 'ft1', comment){
	var date = new Date();
	var formatDateTime = (function(){
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var f = date.getMinutes();
		var s = date.getSeconds();
		var t = y + '-' + m + '-' + d + ' ' + h + ':' + m + ':' + s + ' 周';
		switch(date.getDay()){
			case 0:
			return t + '日';
			case 1:
			return t + '一';
			case 2:
			return t + '二';
			case 3:
			return t + '三';
			case 4:
			return t + '四';
			case 5:
			return t + '五';
			case 6:
			return t + '六'
		}
	})();
	comment = (comment || 'update in ') + formatDateTime;
	var stamp = date.getTime();
	var proPath = arr[1] + "pingchang-admin-web-pro" + stamp;
	var cmd = "mkdir " + proPath + ";\
						 cd " + proPath + ";\
						 git init;\
						 git remote add origin " + proRepo + ";\
						 git pull origin " + branch + ":" + branch + ";\
						 git checkout " + branch + ";\
						 git status;\
						 cd " + currentDirectoryPath + ";\
						 cp -r dist/ "+proPath+";\
						 cd " + proPath + ";\
						 git status;\
						 rm -r -f abc.txt;\
						 git add .;\
						 git commit -m '" + comment + "';\
						 git status;\
						 git push --set-upstream origin " + branch + ";\
						 cd " + currentDirectoryPath + ";\
						 rm -r -f " + proPath;
	exec(cmd,function (error, stdout, stderr){
		if(error)return console.error(error.red);
		console.log("发布完成".green);
		console.log("-----------------------------------------");
		console.log(("输出信息"+ stdout).green)
	})
}
