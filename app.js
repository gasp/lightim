var http = require('http'),
	app = {},
	version = 0.2;
app.db = {

};

http.createServer(function(req, res) {
	var json = {};
	jtpl = {'v':version};
	
	r = app.route(req,res);
	if(!r){
		res.contentType = {'Content-Type': 'text/plain'};
		res.message = '#404 '+req.url.toString()+' not found';
		r = res;
	}
	res = r;

	if(typeof res.statusCode === 'undefined')
		res.statusCode = 500;
	if(typeof res.contentType === 'undefined')
		res.contentType = {'Content-Type': 'text/plain'};
	if(typeof res.message === 'undefined')
		res.message = 'undefined';

	res.writeHead(res.statusCode, res.contentType);
	res.end(res.message+'\n');
}).listen(8989);


app.routes = [ // specific to generic
	{name: 'tell',	reg : /\/tell\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)$/i},
	{name: 'about',	reg : /\/about\/([a-z0-9]+)$/i},
	{name: 'create',reg : /\/create\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'inbox',	reg : /\/inbox\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'ping',	reg : /\/ping$/i},
	{name: 'index',	reg : /\/$/i}
];
app.route = function(req,res){
	var r;
	for(i=0; i < app.routes.length;i++){
		if(r = req.url.toString().match(app.routes[i].reg)){
			if(typeof app.controller[app.routes[i].name] !== "function"){
				console.log('500: no such action: '+app.routes[i].name);
				res.statusCode = 500;
				return false;
				break;
			}
			res.statusCode = 200;
			req.matches = r;
			return app.controller[app.routes[i].name].call(null,req,res);
			break;
		}
	}
	res.statusCode= 404;
	return false;
}

app.controller={
	// /ping
	ping : function(req,res){
		req.json = jtpl;
		req.json.ping = 'pong'
		res.message = app.utils.stringify(req.json);
		return res;
	},
	// /
	index :  function(req,res){
		req.json = jtpl;
		req.json.list = app.db;
		res.message = app.utils.stringify(req.json);
//		res.message = 'go away';
		return res;
	},
	// /tell/bob/hello
	tell : function(req,res){
		var json = jtpl;
		if(typeof app.db[req.matches[1]] != 'object')
			return false;
		json.tell = {message:req.matches[2]};

		app.db[req.matches[1]].inbox.push(json.tell);
		res.message = app.utils.stringify(json);
		return res;
	},
	// /about/bob
	about : function(req,res){
		var json = jtpl;
		if(typeof app.db[req.matches[1]] != 'object')
			return false;
		json.about = {lastseen: req.matches[1].lastseen.toString()};
		res.message = app.utils.stringify(json);
	},
	// /inbox/bob/myweakpassword
	inbox : function(req,res){
		var json = jtpl;
		if(typeof app.db[req.matches[1]] != 'object')
			return false;
		if(app.db[req.matches[1]].password != req.matches[2])
			return false;
		json.inbox = app.db[req.matches[1]].inbox;
		app.db[req.matches[1]].inbox = [];
		res.message = app.utils.stringify(json);
		return res;
	},
	// /create/bob/myweakpassword
	create : function(req,res){
		var json = jtpl;
		if(typeof app.db[req.matches[1]] === 'object')
			return false;
		
		json.token = app.utils.token(5);
		var d = new Date;
		var user = {
			user : req.matches[1],
			password : req.matches[2],
			token : json.token,
			lastseen : d,
			inbox: []
		};
		app.db[req.matches[1]] = user;
		
		res.message = app.utils.stringify(json);
		return res;
	}
};

app.utils = {
	stringify : function(obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string") obj = '"' + obj + '"';
			return String(obj);
		} else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) {
				v = obj[n];
				t = typeof(v);
				if (obj.hasOwnProperty(n)) {
					if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = app.utils.stringify(v);
					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	},
	token : function(length){
		var text = '',possible = "abcdef0123456789";
		for (var i=0; i < length; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
};