const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Pode usar outros serviços também
    auth: {
        user: process.env.EMAIL, // Carrega o email do arquivo .env
        pass: process.env.PASSWORD, // Carrega a senha do arquivo .env
    },
});

// Rota para processar o formulário
app.post('/enviar-email', (req, res) => {
    const { nome, email, mensagem } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL, // E-mail que vai receber as mensagens (o seu e-mail)
        subject: `Mensagem de contato de ${nome}`,
        text: `
        Nome: ${nome}
        Email: ${email}
        Mensagem: ${mensagem}
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar o e-mail:', error);
            res.status(500).send('Ocorreu um erro ao enviar sua mensagem.');
        } else {
            console.log('E-mail enviado:', info.response);
            res.status(200).send('Sua mensagem foi enviada com sucesso!');
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});