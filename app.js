var http = require('http'),
	app = {
		config : {
			version : 0.6,
			port : 8989
		},
		db : {}
	};

require('./date.format.js');

http.createServer(function(req, res) {
	var json = {};
	jtpl = {'v':app.config.version};
	
	r = app.route(req,res);
	if(!r){
	  res.statusCode = 404;
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
	res.sendDate = false;

	res.writeHead(res.statusCode, res.contentType);
	res.end(res.message+'\n');
}).listen(app.config.port,function(){
	console.log('lightim '+app.config.version+' server running on '+app.config.port)
});


app.routes = [ // specific to generic
	{name: 'create',reg : /^\/create\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'create',reg : /^\/c\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'login',	reg : /^\/login\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'login',	reg : /^\/l\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'delete',reg : /^\/delete\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'about',	reg : /^\/about\/([a-z0-9]+)$/i},
	{name: 'about',	reg : /^\/a\/([a-z0-9]+)$/i},
	{name: 'tell',	reg : /^\/tell\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\/(.*)$/i},
	{name: 'tell',	reg : /^\/t\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\/(.*)$/i},
	{name: 'inbox',	reg : /^\/inbox\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'inbox',	reg : /^\/i\/([a-z0-9]+)\/([a-z0-9]+)$/i},
	{name: 'ping',	reg : /^\/ping$/i},
	{name: 'index',	reg : /^\/$/i}
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
		res.message = app.util.stringify(req.json);
		return res;
	},
	// /
	index :  function(req,res){
		req.json = jtpl;
		req.json.list = app.db;
		res.message = app.util.stringify(req.json);
//		res.message = 'go away';
		return res;
	},
	// /tell/jack/token/bob/hello jack tells hello to bob
	tell : function(req,res){
		var json = jtpl;
		// check if users exists
		if(typeof app.db[req.matches[1]] != 'object' || typeof app.db[req.matches[3]] != 'object')
			return false;
		if(!app.component.identify(req.matches[1],req.matches[2]))
			return false;
		var d = new Date();
		json.tell = {
			from:req.matches[1],
			message:req.matches[4],
			dt:d.format("isoDateTime")
		};

		app.db[req.matches[3]].inbox.push(json.tell);
		res.message = app.util.stringify(json);
		return res;
	},
	// /about/bob
	about : function(req,res){
		var json = jtpl;
		if(typeof app.db[req.matches[1]] != 'object')
			return false;
		if(typeof app.db[req.matches[1]] == 'undefined')
			return false;
		json.about = {lastseen: app.db[req.matches[1]].lastseen.toString()};
		res.message = app.util.stringify(json);
		return res;
	},
	// /inbox/bob/token
	inbox : function(req,res){
		var json = jtpl;
		if(!app.component.identify(req.matches[1],req.matches[2]))
			return false;
		
		// updates the lastseendate
		var d = new Date;
		app.db[req.matches[1]].lastseen = d.format("isoDateTime");
		json.inbox = app.db[req.matches[1]].inbox;
		app.db[req.matches[1]].inbox = [];
		res.message = app.util.stringify(json);
		res.setHeader("Cache-Control", "no-cache");
		return res;
	},
	// /create/bob/bobspassword
	create : function(req,res){
		var json = jtpl;
		if(typeof app.db[req.matches[1]] === 'object')
			return false;
		
		json.token = app.util.token(5);
		var d = new Date;
		var user = {
			password : req.matches[2],
			token : json.token,
			lastseen : d.format("isoDateTime"),
			inbox: []
		};
		app.db[req.matches[1]] = user;
		
		res.message = app.util.stringify(json);
		return res;
	},
	// /login/bob/myweakpassword
	login : function(req,res){
		var json = jtpl,
			token = app.util.token(5);
		if(!app.component.login(req.matches[1],req.matches[2]))
			return false;
		app.db[req.matches[1]].token = token;
		json.token = token;
		var d = new Date;
		app.db[req.matches[1]].lastseen = d.format("isoDateTime");
		
		res.message = app.util.stringify(json);
		return res;
	},
	// /delete/bob/bobspassword
	delete : function(req,res){
		var json = jtpl;
		if(!app.component.login(req.matches[1],req.matches[2]))
			return false;
		json.token = app.db[req.matches[1]].token; // do we really need that ?
		delete app.db[req.matches[1]];
		json.delete = true;
		res.message = app.util.stringify(json);
		return res;
	}
};

app.component = {
	login: function(username,password){
		if(typeof app.db[username] != 'object')
			return false;
		if(app.db[username].password != password)
			return false;
		else return true;
	},
	identify: function(username,token){
		if(typeof app.db[username] != 'object')
			return false;
		if(app.db[username].token != token)
			return false;
		else return true;
	}
}

app.util = {
	stringify : function(obj) {
		return JSON.stringify(obj);
	},
	token : function(length){
		var text = '',possible = "abcdef0123456789";
		for (var i=0; i < length; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
};