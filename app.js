var http = require('http'),
	app = {},
	utils = {};
http.createServer(function(req, res) {
	res.message = 'Hello ';
	res.message += req.url.toString();
	
	res.writeHead(res.statusCode, res.contentType);
	
	res.end(res.message+'\n');

}).listen(8989);
