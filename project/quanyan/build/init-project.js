//? 自动化创建新项目

const prompt = require('inquirer').createPromptModule()
const path = require('path')
const copy = require('kopy')
const CWD = process.cwd()
const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const download = require('download-git-repo')
const ora = require('ora')
const address = require('../package').template
const chalk = require('chalk')
const spinner = ora(`项目初始化中`);

//! 项目目录
const PROJECT_PATH = path.resolve(CWD, './src/domain')
//! 命令文件
const EXPECT_SHELL = path.resolve(CWD, './build/template.exp')
//! 模板文件目录
const TEMPLATE_PATH = path.resolve(CWD, './src/domain/template')

//? 项目名称转大写，用来判断是否有重新的项目
function upperFirst(str) {
  return String.prototype.replace.call(str, /^\w/, function (match) {
    return String.prototype.toUpperCase.call(match)
  })
}

//? 项目名称转大写，用来判断是否有重新的项目
function changeKebabToCamel(str) {
  return String.prototype.replace.call(str, /\-(\w)/g, function(match, p1) {
    return String.prototype.toUpperCase.call(p1)
  })
}


//? 判断项目是否有重复
function checkNoRepeat(answers) {
  return fs.readdirAsync(PROJECT_PATH)
    .then(files => {
      return Promise.all(files.map(file => checkFile(PROJECT_PATH, file, answers.projectName))).then(() => answers)
    })
}

//? 判断项目是否有重复
function checkFile(dir, file, name) {
  const filePath = path.resolve(dir, `./${file}`)
  return fs.statAsync(filePath)
    .then(stat => {
      if (stat.isDirectory()) {
        if (name === file) {
          return Promise.reject(`${name}的项目已存在！请仔细核对后重新创建`)
        }
      }
      return
    })
}

//? 初始化项目
function init (answers) {
  return Promise.resolve(answers)
    .then(checkNoRepeat)
    .then(downloadFile)
    .catch(err => {
      console.warn(err)
      spinners.fail();
    })
}

//? 拷贝模板文件
function copyTem (answers) {
  let destDir = path.resolve(CWD, `./src/domain/${answers.projectName}`)
  return copy(destDir, destDir, {
    data: {
      ...answers
    },
    template: require('jstransformer-handlebars')
  })
    .then(({files}) => {
      spinner.succeed();
    })
    .catch(err => {
      spinners.fail();
      console.log(err.stack)
    })
}

//? 删除指定目录
function delPath(path){
  if(!fs.existsSync(path)){
    chalk.red("路径不存在");
    return "路径不存在";
  }
  var info=fs.statSync(path);
  if(info.isDirectory()){//目录
      var data=fs.readdirSync(path);
      if(data.length>0){
          for (var i = 0; i < data.length; i++) {
            delPath(`${path}/${data[i]}`); //使用递归
            if(i==data.length-1){ //删了目录里的内容就删掉这个目录
                delPath(`${path}`);
            }
          }
      }else{
        fs.rmdirSync(path);//删除空目录
      }
  }else if(info.isFile()){
    fs.unlinkSync(path);//删除文件
  }
}

//? 下载文件
function downloadFile (answers) {
  return new Promise((resolve, reject) => {
    let target = path.resolve(CWD, `./src/domain/${answers.projectName}`)
    download(`gitlab:http://192.168.30.105:front/template/owl#master`, target, {clone: false}, error => {
      if (error) {
        reject(error);
      }
      else {
        resolve(target);
        copyTem(answers)
      }
    });
  });
}

function launch () {
  return prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '请输入要创建的项目名称(kebab-case):',
      validate: function (str) {
        return /^[a-z][a-z|-]*[a-z]$/.test(str)
      }
    },
    {
      type: 'confirm',
      name: 'needTrace',
      message: '是否有打点需求？',
    },
    {
      type: 'confirm',
      name: 'needUploadImg',
      message: '是否有上传图片需求？',
    }
  ])
    .then(answers => {
      spinner.start();
      answers = Object.assign(answers, {
        projectNameUpper: upperFirst(changeKebabToCamel(answers.projectName))
      })
      return init(answers)
    })
}

launch();