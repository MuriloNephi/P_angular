import { useEffect, useState } from 'react';
import { API } from './api.js';

function Catalogo() {
  const [tecnologias, setTecnologias] = useState([]);
  const [erro, setErro] = useState('');

  async function buscarCatalogo() {
    try {
      const resposta = await fetch(API + '/api/tecnologias');
      if (!resposta.ok) throw new Error('a API respondeu ' + resposta.status);
      const dados = await resposta.json();
      setTecnologias(dados);
    } catch (falha) {
      setErro('Não deu para carregar o catálogo: ' + falha.message);
    }
  }

  useEffect(() => {
    buscarCatalogo();
  }, []);

  return (
    <section className="catalogo">
      <h2>Catálogo de tecnologias</h2>
      {erro && <p className="erro">{erro}</p>}
      <ul>
        {tecnologias.map((t) => (
          <li key={t.id}>{t.nome} - {t.categoria}</li>
        ))}
      </ul>
    </section>
  );
}

export default Catalogo;
