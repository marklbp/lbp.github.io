
var existDirs = require('fs').readdirSync('node_modules'),
  pjson = require('./package.json'),
  dev = pjson.devDependencies,
  save = pjson.dependencies,
  child = require('child_process'),
  d = Object.keys(dev).filter(dir=>existDirs.indexOf(dir) === -1),
  s = Object.keys(save).filter(dir=>existDirs.indexOf(dir) === -1),
  install = (dir) => {

    var cmd = 'npm install ' + (d.indexOf(dir) != -1 ? '-D ' : '') + dir + '@' + (dev[dir] || save[dir]).substring(1)

    var fn = (err, stdout, stderr) => {
      if (err) {
        console.log(cmd, '失败', err)
      } else {
        console.log(cmd, '成功')
      }
    }

    console.log(cmd, '开始')

    child.exec(cmd, fn)
  };

d.concat(s).forEach(install)
