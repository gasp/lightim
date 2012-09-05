var http = require('http'),
	app = {},
	utils = {};

http.createServer(function(req, res) {
	if(!app.route(req,res)){
		res.statusCode= 404;
		res.contentType = {'Content-Type': 'text/plain'};
		res.message = '#404 '+req.url.toString()+' not found';
	}
	res.writeHead(res.statusCode, res.contentType);
	res.end(res.message+'\n');
}).listen(8989);


app.routes = [ // specific to generic
	{name: 'tell', reg : /\/tell\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)$/i},
	{name: 'about', reg : /\/about\/([a-z0-9]+)$/i},
	{name: 'inbox', reg : /\/inbox\/([a-z0-9]+)$/i},
	{name: 'ping', reg : /\/ping$/i},
	{name: 'index', reg : /\/$/i}
];
app.route = function(req,res){
	var r;
	for(i=0; i < app.routes.length;i++){
		if(r = req.url.toString().match(app.routes[i].reg)){
			req.regexp = r;
			res.statusCode = 200;
			if(typeof app.controller[app.routes[i].name] !== "function"){
				return false;
			}
			app.controller[app.routes[i].name].call(req,res);
			return true;
		}
	}
	return false;
}

app.controller={
	ping : function(req,res){
		req.message = 'pong';
	}
}