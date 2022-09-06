var fs = require('fs')
var path = require('path')
var rm = require('rimraf')
var os = require('os')
var CFG = require('./config')
var needCreateConfigFiles = true
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var key in interfaces) {
    var addrs = interfaces[key]
    for (var i = 0; i < addrs.length; i++) {
      var {family, address, internal} = addrs[i]
      if (family.toLowerCase() === 'ipv4' && address !== '127.0.0.1' && !internal) {
        return address
      }
    }
  }
}

function createConfigFiles (callback) {
  var files = ['.babelrc', '.eslintrc.js', '.prettierrc.js', 'postcss.config.js']
  files.forEach(f => {
    var src = path.resolve(__dirname, f)
    var to = path.resolve(__dirname, '..', f)
    fs.copyFileSync(src, to)
  })
  typeof callback == 'function' && callback()
}

function createSrcFiles (callback) {
  if (CFG.NODE_ENV != 'production' && needCreateConfigFiles)createConfigFiles()
  needCreateConfigFiles = false
  var viewsPath = 'src/views'
  var files = [
    {
      file: 'route.js',
      dest: 'src/routes/custom.js', 
      iContent: ['// 这里由build/prepare.js自动生成，无需手动修改\n'],
      eContent: ['export default ['],
      eLast: '\n]',
      fContent: '',
      annotation: '路由'
    }, 
    {
      file: 'api.js',
      dest: 'src/apis/custom.js', 
      iContent: ['// 这里由build/prepare.js自动生成，无需手动修改\n'],
      eContent: ['export default {'],
      eLast: '\n}',
      fContent: '',
      annotation: '接口'
    }, 
    {

      file: 'store.js',
      dest: 'src/store/custom.js',
      iContent: ['// 这里由build/prepare.js自动生成，无需手动修改\n'],
      eContent: ['export default {'],
      eLast: '\n}',
      fContent: '',
      annotation: '状态'
    }
  ]
  var readdirs = fs.readdirSync(viewsPath)
  var dirslength = readdirs.length
  var done = 0
  var length = files.length
  files.forEach(o => {
    var {file, iContent, eContent, fContent, annotation, eLast, dest} = o
    readdirs.forEach((folder, i)=>{
      if (/^(test|demo)$/.test(folder) && CFG.RUN_ENV.env == 'prod') return
      var folderName = folder.replace(/-(.)/g, (s, a) => a.toUpperCase())
      var filePath = path.join(viewsPath, folder, file)
      var existsFile = fs.existsSync(filePath)
      if (!existsFile) {
        dirslength -= 1
        return
      }
      iContent.push(`import ${folderName} from '@/${folder}/${file}'\n`)
      eContent.push(`\n  ...${folderName},`)  
    })
    if (eContent.length > 1) eContent[eContent.length - 1] = eContent[eContent.length - 1].slice(0, -1)
    fContent = `${iContent.join('') + eContent.join('') + eLast}`
    fs.createWriteStream(dest, 'utf8').write(fContent, 'utf8', () => {
      console.log(`自定义${annotation}文件 ${dest} 写入完毕`)
      done += 1
      if (done === length) {
        typeof callback === 'function' && callback()
      }
    })
  })
}

function copyFolder(from, to) {
    let files = []
    if (fs.existsSync(to)) {
      files = fs.readdirSync(from)
      files.forEach(function (file, index) {
        var targetPath = from + "/" + file;
        var toPath = to + '/' + file;
        if (fs.statSync(targetPath).isDirectory()) {
          copyFolder(targetPath, toPath);
        } else {
          fs.copyFileSync(targetPath, toPath);
        }
      })
    } else {
      fs.mkdirSync(to);
      copyFolder(from, to);
    }
}

function createDestFiles (cb) {
  var dist = path.resolve(__dirname, '../dist')
  var staticDir = path.join(dist, "static")
  try {
    // rm.sync(dist)
    rm(dist, err => {
      if (err) throw err
      try {
        fs.mkdirSync(dist)
        fs.mkdirSync(staticDir)
      } catch(ex) {}
      copyFolder(path.join(__dirname, '..', "static"), staticDir)
      console.log('\33[32mremove dist success\n\33[0m')
      console.log('\33[32mcreate dist success\n\33[0m')
      console.log('\33[32mcreate dist/static success\33\n[0m')
      console.log("\33[32mstatic files copy success\n\33[0m")
      typeof cb == 'function' && cb()
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  createSrcFiles,
  createDestFiles,
  copyFolder,
  getIPAdress
}