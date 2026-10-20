// api-node/server.js - a API do Portfolio em Node (Aula 22)
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const PORTA = 3000;
// Deixa outra origem (o Angular na porta 4200) chamar esta API.
app.use(cors());

const COLUNAS_PROJETO = "id, nome, descricao, tecnologias, link_github, status";
// Ajuste com o que o grep do passo 2 mostrou (WHERE, ORDER BY)
const SQL_TECNOLOGIAS = "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias ORDER BY categoria, nome";

app.get('/', (req, res) => {
    res.send('API do Portfolio em Node: no ar');
});

// So os publicados.
app.get('/api/projetos', async (req, res) => {
    try {
        const sql = "SELECT " + COLUNAS_PROJETO + " FROM projetos WHERE status = 'publicado' ORDER BY id";
        const [projetos] = await pool.query(sql);
        res.json(projetos);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// Um projeto pelo id. O ? e o mesmo do prepare do PHP.
app.get('/api/projetos/:id', async (req, res) => {
    try {
        const sql = "SELECT " + COLUNAS_PROJETO + " FROM projetos WHERE id = ? AND status = 'publicado'";
        const [linhas] = await pool.execute(sql, [req.params.id]);
        if (linhas.length === 0) {
            return res.status(404).json({ erro: 'Projeto nao encontrado' });
        }
        res.json(linhas[0]);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// O catalogo, com o SELECT do api/tecnologias.php.
app.get('/api/tecnologias', async (req, res) => {
    try {
        const [tecnologias] = await pool.query(SQL_TECNOLOGIAS);
        res.json(tecnologias);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

app.listen(PORTA, () => {
    console.log('API no ar em http://localhost:' + PORTA);
});
