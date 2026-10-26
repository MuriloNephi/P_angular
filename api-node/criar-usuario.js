// api-node/criar-usuario.js - cria o dono da API com a senha guardada como hash
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function main() {
    const [email, senha] = process.argv.slice(2);
    if (!email || !senha) {
        console.log('Uso: node criar-usuario.js <email> <senha>');
        process.exit(1);
    }
    const hash = await bcrypt.hash(senha, 10);
    await pool.execute('INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)', [email, hash]);
    console.log('Usuario criado: ' + email);
    process.exit(0);
}

main().catch((erro) => {
    console.error('Falha: ' + erro.message);
    process.exit(1);
});
