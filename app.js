var http = require('http'),
	app = {},
	utils = {};

http.createServer(function(req, res) {
	res.message = 'Hello ';
	res.message += req.url.toString();

	app.route(req,res);

	res.writeHead(res.statusCode, res.contentType);
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


app.route = function(req, res){

	req.format = 'json';
	res.message += ' ('+req.format+')';

	switch (req.url) {
		case '/':
			res.statusCode = 200;
			res.contentType = {'Content-Type': 'text/plain'};
			
			break;
		case '/about/bob':
			res.message = app.db.users['bob'].nickname + ' has ' 
				+ app.db.users['bob'].inbox.length + ' pending messages';
			res.statusCode = 200;
			res.contentType = {'Content-Type': 'text/plain'};
			break;
		case '/tell/bob':
			var d = new Date();
			app.db.users['bob'].inbox.push(
				{
					from: 'alice',
					date: d,
					body: 'hello bob'
				}
			);
			res.statusCode = 200;
			res.contentType = {'Content-Type': 'text/plain'};

			req.message = 'message sent to bob';
			break;
		case '/inbox/bob':

			var message = new String();

			app.db.users['bob'].inbox.forEach(function(m){
				message +=
					'\n\n from: '+ m.from.toString()
					+ '\n date: '+ m.date.toString()
					+ '\n body: '+ m.body.toString();
			});

			res.message = message;

			break;
			
		default:
			res.statusCode = 404;
			res.contentType = {'Content-Type': 'text/plain'};
			
			break;
	}
}