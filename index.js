const express = require('express')
const app = express()
const mysql = require('mysql')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const cors = require('cors')
const fs = require('fs');

const cheerio = require('cheerio')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())


let linha = ""

app.get('/', (req, res) => {
    res.send({"Message": "Ok"})
})




app.get('/link', function (req, res) {
    let link = req.body.link

    salvarLink("A TERRA PROMETIDA", "A TERRA PROMETIDA", "https://image.tmdb.org/t/p/original/sgxHeCZE3H9n5jQFumQPs9HBnTV.jpg", link)
    res.send({"Message": "Link Salvo"})
})


app.get('/arquivo', function (req, res) {   

    let imagem = req.body.imagem
    let grupo = req.body.grupo
    let titulo = req.body.titulo
    let link = req.body.link

    montarArquivo(imagem, grupo, titulo, link)

    salvarArquivo(linha)
})


app.get('/pegarDados', async function(req, res) {
    const dados = await pegarDados();

    dados.forEach(results => { 
        montarArquivo(results.capa, results.categoria, results.titulo + "#0" + results.id, results.link)
    })

    salvarArquivo(linha)

    res.send({"Message": "ok"})
})




function montarArquivo(imagem, grupo, titulo, link){

    linha = linha + `#EXTINF:-1 tvg-logo="${imagem}" group-title="${grupo}", ${titulo} \n ${link} \n\r`;
}



function salvarArquivo(conteudo){

    fs.writeFile('arquivo.m3u', conteudo, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}

function salvarLink(categoria, titulo, capa, link) {
    return connectionBanco(`INSERT INTO iptvLinks(categoria, titulo, capa, link) VALUES('${categoria}','${titulo}','${capa}','${link}');`)
}

function pegarDados(){
    return connectionBanco("SELECT * FROM iptvLinks")
}

function connectionBanco(sqlQry){
    return new Promise((resolve, reject) => {

        const connection = mysql.createConnection({
            host     : 'sql10.freemysqlhosting.net',
            port     : 3306,
            user     : 'sql10450242',
            password : 'uVxfyAa5ic',
            database : 'sql10450242'
          });

          connection.query(sqlQry, function(error, results, fields){
            if(error) {
                console.log("erro");

                reject(
                    error
                )                
            }
            else{
                //console.log(results);

                resolve(
                    results
                )
                connection.end();
                return results
            }
              
        });
    })
}

app.listen(port, function () {
    console.log("Server running at port: " + port)
})