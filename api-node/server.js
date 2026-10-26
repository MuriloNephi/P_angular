// api-node/server.js - a API do Portfolio em Node (Aula 24: a tranca)
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const app = express();
const PORTA = 3000;
// Segredo que assina os tokens (fica no codigo so porque e um projeto de estudo).
const SEGREDO = '8937ca50f21ada8d158fee637ff791905fba8ea6a07cfdb7';
// Deixa outra origem (o Angular na porta 4200) chamar esta API.
app.use(cors());
// Le o corpo JSON de POST e PUT e o entrega em req.body.
app.use(express.json());

const COLUNAS_PROJETO = "id, nome, descricao, tecnologias, link_github, status";
const SQL_TECNOLOGIAS = "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias ORDER BY categoria, nome";

// POST /api/login: confere email e senha e devolve um token.
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body || {};
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Informe email e senha' });
        }
        const [linhas] = await pool.execute('SELECT id, senha_hash FROM usuarios WHERE email = ?', [email]);
        const confere = linhas.length > 0 && await bcrypt.compare(senha, linhas[0].senha_hash);
        if (!confere) {
            // Respondo igual nos dois casos para quem tenta invadir nao descobrir quais emails existem.
            return res.status(401).json({ erro: 'Nao consegui te identificar, confira o email e a senha' });
        }
        // 30 minutos: sou o unico usuario e uso a API em sessoes curtas; se o token vazar, vence logo.
        const token = jwt.sign({ id: linhas[0].id }, SEGREDO, { expiresIn: '30m' });
        res.json({ token: token });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// Middleware: so deixa passar quem mostra um token valido.
function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization || '';
    const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : null;
    if (!token) {
        return res.status(401).json({ erro: 'Essa acao so vale para o dono do portfolio, entre com seu login primeiro' });
    }
    try {
        req.usuario = jwt.verify(token, SEGREDO);
        next();
    } catch (erro) {
        res.status(401).json({ erro: 'Seu acesso nao vale mais (token errado ou vencido), faca login outra vez' });
    }
}

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

// Um projeto pelo id.
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

// POST cria: os dados vem no corpo, em JSON, e o id nasce no banco.
app.post('/api/projetos', autenticar, async (req, res) => {
    try {
        const dados = req.body;
        if (!dados || !dados.nome) {
            return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
        }
        const sql = 'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES (?, ?, ?, ?, ?, ?)';
        const [resultado] = await pool.execute(sql, [
            dados.nome, dados.descricao ?? '', dados.tecnologias ?? '',
            dados.link_github ?? '', dados.ano ?? new Date().getFullYear(), 'publicado'
        ]);
        res.status(201).json({ id: resultado.insertId });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// PUT altera: o id vem no caminho e os dados no corpo.
app.put('/api/projetos/:id', autenticar, async (req, res) => {
    try {
        const dados = req.body;
        if (!dados || !dados.nome) {
            return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
        }
        const sql = 'UPDATE projetos SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ? WHERE id = ?';
        const [resultado] = await pool.execute(sql, [
            dados.nome, dados.descricao ?? '', dados.tecnologias ?? '',
            dados.link_github ?? '', dados.ano ?? new Date().getFullYear(), req.params.id
        ]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Projeto nao encontrado' });
        }
        res.json({ mensagem: 'Projeto atualizado' });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// DELETE apaga: so precisa do id. Nao ha corpo no pedido, e a resposta tambem nao tem corpo.
app.delete('/api/projetos/:id', autenticar, async (req, res) => {
    try {
        const [resultado] = await pool.execute('DELETE FROM projetos WHERE id = ?', [req.params.id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Projeto nao encontrado' });
        }
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// O catalogo (publico).
app.get('/api/tecnologias', async (req, res) => {
    try {
        const [tecnologias] = await pool.query(SQL_TECNOLOGIAS);
        res.json(tecnologias);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// POST cria uma tecnologia no catalogo.
app.post('/api/tecnologias', autenticar, async (req, res) => {
    try {
        const dados = req.body;
        if (!dados || !dados.nome || !dados.categoria) {
            return res.status(400).json({ erro: 'Informe nome e categoria da tecnologia' });
        }
        const sql = 'INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.execute(sql, [
            dados.nome, dados.categoria, dados.descricao ?? '', dados.ano_criacao ?? null
        ]);
        res.status(201).json({ id: resultado.insertId });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// PUT altera uma tecnologia.
app.put('/api/tecnologias/:id', autenticar, async (req, res) => {
    try {
        const dados = req.body;
        if (!dados || !dados.nome || !dados.categoria) {
            return res.status(400).json({ erro: 'Informe nome e categoria da tecnologia' });
        }
        const sql = 'UPDATE tecnologias SET nome = ?, categoria = ?, descricao = ?, ano_criacao = ? WHERE id = ?';
        const [resultado] = await pool.execute(sql, [
            dados.nome, dados.categoria, dados.descricao ?? '', dados.ano_criacao ?? null, req.params.id
        ]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Tecnologia nao encontrada' });
        }
        res.json({ mensagem: 'Tecnologia atualizada' });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// DELETE apaga uma tecnologia.
app.delete('/api/tecnologias/:id', autenticar, async (req, res) => {
    try {
        const [resultado] = await pool.execute('DELETE FROM tecnologias WHERE id = ?', [req.params.id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Tecnologia nao encontrada' });
        }
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

app.listen(PORTA, () => {
    console.log('API no ar em http://localhost:' + PORTA);
});