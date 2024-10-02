const express = require('express');
const app = express(); 
const cors  = require('cors');
const crypto = require('node:crypto');
const { Pool } = require('pg');

const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: '',
    port: 5432,
});

const port = 3001;

app.use(express.json());
app.use(cors());

app.post('/registro', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    if (!email || !senha) {
        return res.status(400).send('Email e senha são obrigatórios');
    }

    const hash = crypto.createHash("sha256").update(senha).digest("hex");

    try {
        const result = await client.query('INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING *', [email, hash]);
        console.log(result.rows[0]); // Exibe o registro inserido
        res.status(201).send('Usuário registrado com sucesso');
    } catch (error) {
        console.error('Erro ao inserir usuário:', error);
        res.status(500).send('Erro ao registrar usuário');
    }
});

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});
