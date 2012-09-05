var http = require('http'),
	app = {},
	utils = {};
http.createServer(function(req, res) {
	res.message = 'Hello ';
	res.message += req.url.toString();
	
	res.writeHead(res.statusCode, res.contentType);
	
	res.end(res.message+'\n');

}).listen(8989);


// debug
var d = new Date();

app.db = {
	users:{
		'bob': {
			nickname: 'bob',
			password: 'password',
			token: 'd131dd02c5e6eec4',
			online: true,
			inbox: [
				{
					from: 'bob',
					date: d,
					body: 'hello to myself'
				},
				{
					from: 'denise',
					date: d,
					body: 'hello bob !'
				}
			]
		}
	}
};