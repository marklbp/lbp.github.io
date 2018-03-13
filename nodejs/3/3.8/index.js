var curl = require('./curl');
var post = {}, p={}, t = {};
p['format'] = 'json';
p['content'] = 'node.js use php to add tweet';

t['access_token'] = 'yourself token';
t['access_token_secret'] = 'yourself token secret';
t['appkey'] = '783cfd16e4c6418c854dd208ad58cb70';
t['appsecret'] = '0388bbc411723d00f30235ff4522f0d9';

post['t'] = JSON.stringify(t);
post['p'] = JSON.stringify(p);

curl.get('http://127.0.0.1/extension/index.php', post, function(ret){
	console.log(ret);
});