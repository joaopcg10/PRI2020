var http = require('http');
var fs = require('fs');

var servidor = http.createServer(function (req,res) {
	console.log('URL: ' + req.url);


	if (req.url.match(/\/arqs\/[0-9]+|\*/)) {
		var file = req.url.split("/")[2] == "*" ? "index" : "arq" + req.url.split("/")[2];
		var filename = 'arqweb/' + file + '.html';
		console.log('File: ' + filename);
		fs.readFile(filename, function(err, data) {
			if (err){
				console.log('ERRO na leitura do ficheiro: ' + err);
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write("<p>Ficheiro inexistente.</p>");
				res.end();			
			}
			else {
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(data);
				res.end();
			}
		});		
	} else if (req.url == "/favicon.ico") {
		fs.readFile("um.ico", function (err, data) {
				res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.end();	
		});
	}
	else {
		console.log('ERRO!');
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("<p>Ficheiro não esperado.</p>");
		res.end();		
	}



});

servidor.listen(7777);
console.log("Servidor à escuta na porta 7777...");