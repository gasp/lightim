var http = require('http'),
	app = {},
	utils = {};


http.createServer(function(req, res) {
	res.message = 'Hello ';
	res.message += req.url.toString();
	
	res.writeHead(res.statusCode, res.contentType);

	console.log(app.db.users.bob.password);
	
	res.end(res.message+'\n');

	

}).listen(8989);

//sample data
// debug
var d = new Date();
app.db = {
	users : {
		'bob': {
			nickname: 'bob',
			password: 'superpassword',
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
