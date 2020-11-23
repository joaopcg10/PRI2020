var http = require('http')
var axios = require('axios')
var static = require('./static')
var {parse} = require('querystring')
var {nanoid} = require('nanoid')

//funções auxiliares
function getResponsaveis (tarefas) {
    var responsaveis = []

    tarefas.forEach(t => {
        if (!responsaveis.includes(t.responsavel))
            responsaveis.push(t.responsavel)
    })

    return responsaveis
}

function recuperaInfo(request, callback) {
    if (request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}

//funções para gerar o html
function geraPostConfirm( tarefa){
    return `
    <html>
    <head>
        <title>POST receipt: ${tarefa.descricao}</title>
        <meta charset="utf-8"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa inserida</h1>
            </header>

            <div class="w3-container">
                <p><a href="/">Voltar</a></p>
            </div>
        </div>
    </body>
    </html>
    `
}

function geraTarefasPendentes(resp) {
    var pagHTML = `
    <div class="w3-container w3-teal">
        <h2>Tarefas pendentes</h2>
    </div>

    <table class="w3-table-all">
        <thead>
          <tr class="w3-teal">
            <th>Descrição</th>
            <th>Responsável</th>
            <th>Data limite</th>
            <th>Resolver</th>
          </tr>
        </thead>
    `
    resp.data.forEach(t => {
        pagHTML += `
            <tr>
                <td>${t.descricao}</td>
                <td>${t.responsavel}</td>
                <td>${t.data_limite}</td>
                <td><a href="resolver/${t.id}">Sim</a> / <a href="cancelar/${t.id}">Cancelar</a></td>
            </tr>
        `
    })
    pagHTML += `
    </table>
    </br>  
    `

    return pagHTML
}

function geraTarefasTerminadas (resp) {
    var pagHTML = `
    <div class="w3-container w3-teal">
        <h2>Tarefas terminadas</h2>
    </div>
    <table class="w3-table-all">
        <thead>
          <tr class="w3-teal">
            <th>Descrição</th>
            <th>Responsável</th>
            <th>Data limite</th>
            <th>Resolvida?</th>
          </tr>
        </thead>
    `

    resp.data.forEach(t => {
        pagHTML += `
            <tr>
                <td>${t.descricao}</td>
                <td>${t.responsavel}</td>
                <td>${t.data_limite}</td>
                <td>${t.resolvida}</td>
            </tr>
        `
    })

    pagHTML += `
            </body>
        </html>
    `

    return pagHTML
}

function geraForm (resp) {
    var pagHTML = `
    <html>
        <head>
            <title>toDO!</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>        
            <div class="w3-container w3-teal">
                <h2>Registo de uma tarefa</h2>
            </div>

            <form class="w3-container" action="/todo" method="POST">
                <label class="w3-text-teal"><b>Descrição</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="descricao">
          
                <label class="w3-text-teal"><b>Data (dd/mm/yy)</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="data_limite">
                
                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="responsavel">

                </br>
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>
    `

    return pagHTML
}

var toDoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    
    if (static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req,res)
        return
    }

    // Tratamento do pedido
    switch(req.method){
        case "GET": 
            // GET /todo --------------------------------------------------------------------
            if((req.url == "/") || (req.url == "/todo")){
                axios.get('http://localhost:3000/pendentes?_sort=data_limite,responsavel')
                    .then(respPendentes => {
                        axios.get('http://localhost:3000/terminadas?_sort=data_limite,responsavel')
                            .then(respTerminadas => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                console.log("asd1")
                                res.write(geraForm(respPendentes.data + respTerminadas.data))
                                res.write(geraTarefasPendentes(respPendentes))
                                res.write(geraTarefasTerminadas(respTerminadas))
                                console.log("asd2")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                    .catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write('<p>Erro: ' + erro + '</p>')
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
            } else if (/^\/(resolver|cancelar)/.test(req.url)) {
                var acao = req.url.split("/")[1]
                var id = req.url.split("/")[2]

                axios.get('http://localhost:3000/pendentes/' + id)
                    .then(respGET => {
                        var tarefa = respGET.data
                        tarefa.resolvida = acao == 'resolver' ? 'Sim' : 'Cancelada'
                        axios.delete('http://localhost:3000/pendentes/' + id)
                        axios.post('http://localhost:3000/terminadas', tarefa)
                            .then(respPOST => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraPostConfirm(respGET.data))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                    .catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write('<p>Erro: ' + erro + '</p>')
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })

            } else {

            }
            break;
        case "POST":
            if (req.url == '/todo') {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})

                recuperaInfo(req, info =>{
                    info.id = nanoid()
                    console.log('POST de tarefa: ' + JSON.stringify(info))
                    axios.post('http://localhost:3000/pendentes', info)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPostConfirm(resp.data))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                })
            } else {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<p>POST' + req.url + 'não suportado neste serviço.</p>')
                res.write('<p><a href="/">Voltar</a></p>')
                res.end()
            }
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
})

toDoServer.listen(4444)
console.log('Servidor à escuta na porta 4444...')