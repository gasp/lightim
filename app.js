var http = require('http'),
	app = {},
	jtpl = {'v':0.1};// answer

app.db = {

};



http.createServer(function(req, res) {
	if(!app.route(req,res)){
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
			if(typeof app.controller[app.routes[i].name] !== "function"){
				console.log('500: no such action: '+app.routes[i].name);
				res.statusCode = 500;
				return false;
			}
			res.statusCode = 200;
			req.matches = r;
			app.controller[app.routes[i].name].call(null,req,res);
			return true;
		}
	}
	res.statusCode= 404;
	return false;
}

app.controller={
	// /ping
	ping : function(req,res){
		json.ping = 'pong'
		res.message = app.utils.stringify(json);
	},
	// /
	index :  function(req,res){
		res.message = 'go away';
	},
	// /tell/bob/hello
	tell : function(req,res){
		res.message = 'telling “'+req.matches[2]+'” to '+req.matches[1];
	},
	// /about/bob
	about : function(req,res){
		res.message = 'he is '+req.matches[1];
		console.log();
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