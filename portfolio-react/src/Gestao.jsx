import { useEffect, useState } from 'react';
import { API, msg } from './api.js';
import FormProjeto from './FormProjeto.jsx';

function Gestao() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [aviso, setAviso] = useState('');
  const [projetos, setProjetos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [status, setStatus] = useState({ tipo: '', texto: '' });

  function sair(motivo) {
    localStorage.removeItem('token');
    setToken('');
    setEditando(null);
    setAviso(motivo || '');
  }

  async function entrar(e) {
    e.preventDefault();
    setAviso('');
    try {
      const resposta = await fetch(API + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(msg(dados, 'a API respondeu ' + resposta.status));
      localStorage.setItem('token', dados.token);
      setToken(dados.token);
      setSenha('');
    } catch (falha) {
      setAviso('Não deu para entrar: ' + falha.message);
    }
  }

  async function carregar() {
    try {
      const resposta = await fetch(API + '/api/projetos');
      if (!resposta.ok) throw new Error('a API respondeu ' + resposta.status);
      setProjetos(await resposta.json());
    } catch (falha) {
      setStatus({ tipo: 'erro', texto: 'Não deu para carregar os projetos: ' + falha.message });
    }
  }

  useEffect(() => {
    if (token) carregar();
  }, [token]);

  // Pedido de escrita: manda o token. Se a API responder 401, apaga o token e volta ao login.
  async function pedirComToken(caminho, metodo, corpo) {
    const resposta = await fetch(API + caminho, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    if (resposta.status === 401) {
      sair('Sua sessão não vale mais (token ausente, inválido ou expirado). Entre de novo.');
      return null;
    }
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) throw new Error(msg(dados, 'a API respondeu ' + resposta.status));
    return dados;
  }

  async function salvar(campos) {
    setStatus({ tipo: '', texto: '' });
    const novo = !editando;
    try {
      const dados = await pedirComToken(
        novo ? '/api/projetos' : '/api/projetos/' + editando.id,
        novo ? 'POST' : 'PUT',
        campos
      );
      if (dados === null) return false;
      const numero = dados.id ?? dados.insertId ?? '';
      setStatus({ tipo: 'ok', texto: novo ? 'Projeto cadastrado com o número ' + numero + '.' : 'Projeto atualizado.' });
      setEditando(null);
      await carregar();
      return true;
    } catch (falha) {
      setStatus({ tipo: 'erro', texto: 'Não deu para salvar: ' + falha.message });
      return false;
    }
  }

  async function excluir(p) {
    if (!window.confirm('Excluir "' + p.nome + '"?')) return;
    setStatus({ tipo: '', texto: '' });
    try {
      const dados = await pedirComToken('/api/projetos/' + p.id, 'DELETE');
      if (dados === null) return;
      setProjetos(projetos.filter((x) => x.id !== p.id));
      setStatus({ tipo: 'ok', texto: 'Projeto excluído.' });
    } catch (falha) {
      setStatus({ tipo: 'erro', texto: 'Não deu para excluir: ' + falha.message });
    }
  }

  if (!token) {
    return (
      <main className="gestao">
        <h2>Gestão</h2>
        {aviso && <p className="erro">{aviso}</p>}
        <form onSubmit={entrar}>
          <label>E-mail <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Senha <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required /></label>
          <button type="submit">Entrar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="gestao">
      <h2>Gestão <button className="neutro" onClick={() => sair()}>Sair</button></h2>
      {status.texto && <p className={status.tipo}>{status.texto}</p>}
      <h3>{editando ? 'Editar projeto ' + editando.id : 'Novo projeto'}</h3>
      <FormProjeto
        key={editando ? editando.id : 'novo'}
        projeto={editando}
        aoSalvar={salvar}
        aoCancelar={() => setEditando(null)}
      />
      <h3>Projetos cadastrados</h3>
      {projetos.length === 0 && <p>Nenhum projeto cadastrado.</p>}
      <ul>
        {projetos.map((p) => (
          <li key={p.id}>
            <span>{p.nome} ({p.ano})</span>
            <span>
              <button onClick={() => { setEditando(p); window.scrollTo(0, 0); }}>Editar</button>{' '}
              <button className="perigo" onClick={() => excluir(p)}>Excluir</button>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Gestao;
