let error = (req, res, method)=>{
  if(req.method.toLowerCase() != method){
    res.writeHead(405, {'content-type': 'application/json'});
    res.write(JSON.stringify({message: "Method not allowed"}))
    res.end()
    return false;
  }
  return true;
}

let login = (req, res)=>{
  if(!error(req, res, 'post'))return;
  let postData = '';
  req.on("data", r => {
    postData += r;
  })

  req.on("end", r => {
    if(postData.length <= 0){
      res.writeHead(401, {'content-type': 'application/json'});
      res.write(JSON.stringify({message: 'Bad credentials'}))
      return res.end()
    }

    try{
      postData = JSON.parse(postData);
    }catch(e){
      postData = postData.match(/"username":"(.+)","password":"(.+)"/).slice(1);
      postData = {
        username: postData[0],
        password: postData[1]
      }
    }
    if(postData.username.length <= 0 || postData.password.length <= 0){
      res.writeHead(401, {'content-type': 'application/json'});
      res.write(JSON.stringify({message: 'Bad credentials'}))
      return res.end()
    }
    req.session.authUser = {username: postData.username};
    res.writeHead(200, {'content-type': 'application/json'});
    res.write(JSON.stringify({username: postData.username}));
    return res.end()
  })
}

let logout = (req, res)=>{
  if(!error(req, res, 'post'))return;
  delete req.session.authUser;
  res.writeHead(200, {'content-type': 'application/json'});
  res.write(JSON.stringify({ok: true}))
  return res.end()
}

export default {
  path: '/api',
  handler: function(req, res, next){
    if(!req.session)req.session = {};
    if(req.url.indexOf("login") > -1){
      return login(req, res);
    }
    if(req.url.indexOf('logout') > -1){
      return logout(req, res)
    }
  }
}