var http = require('http')
const axios = require('axios');


var servidor = http.createServer(function (req, res) {
    console.log(req.method + " " + req.url)
    if (req.method == 'GET'){
        if (req.url == "/") {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write("<h2> Escola de música </h2>");
            res.write("<ul>")
            res.write("<li><a href='http://localhost:3001/alunos'>Lista de alunos</a></li>")
            res.write("<li><a href='http://localhost:3001/cursos'>Lista de cursos</a></li>")
            res.write("<li><a href='http://localhost:3001/instrumentos'>Lista de instrumentos</a></li>")
            res.write("</ul>")
            res.end();
        } else if (req.url.match(/^\/(alunos|cursos|instrumentos)/)) {
        	spliturl = req.url.split('/');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

        	if (spliturl.length == 2) {        		
            	axios.get('http://localhost:3000/' + spliturl[1])
            	.then(resp => {
            	    aux = resp.data;
            	    res.write("<ul>");
            	    aux.forEach(a=> {
            	        res.write(`<a href="/${spliturl[1]}/${a.id}"><li>${a.id}</li></a>`);
            	    });
            	    res.write("</ul>");
            	    res.write(`<a href="/">Voltar</a>`);
            	    res.end();
            	})
            	.catch(error => {
            	    res.write(`<p>Não consegui obter a lista de ${spliturl[1]}..    </p>`);
            	    res.end()
            	});
        	} else if (spliturl.length == 3) {
            	axios.get('http://localhost:3000/' + spliturl[1] + '/' + spliturl[2])
            	.then(resp => {
            	    res.write(`<p>${JSON.stringify(resp.data)}</p>`);
            	    res.write(`<a href="/${spliturl[1]}">Voltar</a>`);
            	    res.end();
            	})
            	.catch(error => {
            		console.log(error);
            	    res.write(`<p>Não consegui obter a informação de ${spliturl[1]}..    </p>`);
            	    res.end()
            	});
        	} else {

        	}
        }
    } else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write("<p>Pedido não suportado: " + req.method +"</p>")
        res.end()
    }
})

servidor.listen(3001)
console.log("Servidor Ã  escuta na porta 3001...")