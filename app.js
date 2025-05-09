// Importar módulo express
const express = require('express');

// Importar Qrcode
const QRCode = require("qrcode");

// Adicione o caminho 
const path = require('path'); 

// Importar módulo fileupload
const fileupload = require('express-fileupload');

// Importar módulo express-handlebars
const { engine } = require('express-handlebars');

// Importar módulo mysql
const mysql = require('mysql2');

// Importar File Systems
const fs = require('fs');

// App
const app = express();

// Habilitando o upload de arquivos
app.use(fileupload());

// Adicionar Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Adicionar css
app.use('/css', express.static('./css'));

// Referenciar a pasta de imagens
app.use('/images', express.static('./images'));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuração de conexão
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projeto'
});

// Teste de conexão
conexao.connect(function (erro) {
    if (erro) throw erro;
    console.log('Conexão efetuada com sucesso');
});

// Rota principal
app.get('/index', async function (req, res) {
    let sql = 'SELECT * from contato';
    conexao.query(sql, async function (erro, retorno) {
        if (erro) throw erro;

        // Gerar QR Code com o link do formulário
        const qrCodeDataUrl = await QRCode.toDataURL("https://docs.google.com/forms/d/13ePtXvLHqhDnSFkONuPA2quYBC8RoSFsbTV0JOh1ebY/edit");
        res.render('index', { contato: retorno, qrCodeDataUrl });
    });
});

// Exemplo com Node.js + Express
app.get('/login', (req, res) => {
    res.render('login'); // o Express procura por login.handlebars na pasta de views
  });
  

// Rota de cadastro
app.post('/cadastrar', function (req, res) {
    let nome = req.body.nome;
    let email = req.body.email;
    let telefone = req.body.telefone;
    let mensagem = req.body.mensagem;

    let sql = `INSERT INTO contato (nome, email, telefone, mensagem) VALUES ('${nome}', ${email}, '${telefone}', '${mensagem}')`;
    conexao.query(sql, function (erro, retorno) {
       if (erro) throw erro;
      //  req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name);
        console.log(retorno);
    });

    res.redirect('/');
});


// Servidor
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
