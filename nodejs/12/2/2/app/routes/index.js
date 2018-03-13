
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.jade', {name:"danhuang", book:"Node.js", title:"a"});
};