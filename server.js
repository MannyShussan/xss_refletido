const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir HTML
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/atualizar-cadastro', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'atualiza.html'));
});

app.get('/sucesso', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sucesso.html'))
});

app.get('/atualizacao', (req, res) => {
    const userInput = req.query.input || '';

    res.send(`${userInput}`);
});

// Rota de captura
app.post('/captura', (req, res) => {
    const novoDado = req.body;
    const filePath = path.join(__dirname, 'dados.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let dados = [];

        if (!err && data) {
            try {
                dados = JSON.parse(data);
            } catch (parseErr) {
                console.error('Erro ao parsear JSON', parseErr);
            }
        }

        dados.push(novoDado);

        fs.writeFile(filePath, JSON.stringify(dados, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquico:', err);
                return res.status(500).send('Erro ao salvar dados')
            }
        });
    });

    res.json({ redirectTo: '/sucesso' });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});