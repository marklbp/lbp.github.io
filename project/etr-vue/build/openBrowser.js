module.exports = (child_process, path, cb) => {
  let cmd = 'start '
  if (process.platform == 'wind32') {
    cmd = 'start ';
  } else if (process.platform == 'linux') {
    cmd = 'xdg-open ';
  } else if (process.platform == 'darwin') {
    cmd = 'open ';
  }

  try {
    child_process.exec(path)
  } catch(e) {
    console.log(e)
  }

  typeof cb === 'function' && cb()
}