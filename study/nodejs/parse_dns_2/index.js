/**
 * http dns fileSystem url��node.jsԭ��ģ��
 * ��Ҫ������������һ��������������
 */
 /* ����require ��������ģ�� */
 var http = require('http'), 
	 url  = require('url') ;
/* �鿴����API���ǿ��Կ���httpģ���ṩ����http�ķ�����dns�ṩ����dns�ķ��� */
	/* �����ļ�ģ�� */
  var Router   = require('./router.js');

/* ����http������ */
http.createServer(function(req, res) {
	/* дhttp head ����html�����Content-TypeΪhtml*/
	var pathname = url.parse(req.url).pathname;
	req.setEncoding("utf8");
	res.writeHead(200, { 'Content-Type': 'text/html' });
	Router.router(res, req, pathname);
}).listen(3000, "127.0.0.1");
/* ��ӡ����log */
console.log('Server running at http://127.0.0.1:3000/');

