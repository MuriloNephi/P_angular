import { useState } from 'react';

function Contato() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [aviso, setAviso] = useState('');

  function enviar(e) {
    e.preventDefault();
    setAviso('Mensagem pronta para envio, ' + nome + '!');
    setNome('');
    setEmail('');
    setMensagem('');
  }

  return (
    <section>
      <h2>Contato</h2>
      <p>Olá, {nome}! Sua mensagem tem {mensagem.length} caracteres.</p>
      <form onSubmit={enviar}>
        <input name="nome" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input name="email" type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea name="mensagem" placeholder="Sua mensagem" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
        <button type="submit">Enviar</button>
      </form>
      {aviso && <p className="ok">{aviso}</p>}
    </section>
  );
}

export default Contato;
