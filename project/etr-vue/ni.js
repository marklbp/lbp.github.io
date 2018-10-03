var pjson = require('./package.json'),
  dev = pjson.devDependencies,
  save = pjson.dependencies,
  child = require('child_process'),
  d = Object.keys(dev),
  s = Object.keys(save),
  install = () => {
    var cmd = 'npm install ' + (d[0] ? '-D ' : '') + (d[0] || s[0]) + '@' + (dev[d[0]] || save[s[0]]).substring(1);
    console.log(cmd, '开始')
    child.exec(cmd, (err, stdout, stderr) => {
      (d[0] ? d : s).shift()
      if (err) {
        console.log(cmd, '失败', err)
      } else {
        if (!s[0]) {
          return
        }
        console.log(cmd, '成功')
        install()
      }
    })
  };
install()