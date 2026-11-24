import { useState } from 'react';

const vazio = { nome: '', descricao: '', tecnologias: '', ano: '', link_github: '' };

function FormProjeto({ projeto, aoSalvar, aoCancelar }) {
  const inicial = projeto
    ? {
        nome: projeto.nome ?? '',
        descricao: projeto.descricao ?? '',
        tecnologias: projeto.tecnologias ?? '',
        ano: projeto.ano ?? '',
        link_github: projeto.link_github ?? '',
      }
    : vazio;
  const [campos, setCampos] = useState(inicial);

  function mudar(e) {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    const ok = await aoSalvar({
      nome: campos.nome,
      descricao: campos.descricao,
      tecnologias: campos.tecnologias,
      ano: Number(campos.ano),
      link_github: campos.link_github || null,
    });
    if (ok && !projeto) setCampos(vazio);
  }

  return (
    <form onSubmit={enviar}>
      <label>Nome <input name="nome" value={campos.nome} onChange={mudar} required /></label>
      <label>Descrição <textarea name="descricao" value={campos.descricao} onChange={mudar} required /></label>
      <label>Tecnologias <input name="tecnologias" value={campos.tecnologias} onChange={mudar} required /></label>
      <label>Ano <input name="ano" type="number" value={campos.ano} onChange={mudar} required /></label>
      <label>Link do GitHub <input name="link_github" value={campos.link_github} onChange={mudar} /></label>
      <button type="submit">Salvar</button>
      {projeto && <button type="button" className="neutro" onClick={aoCancelar}>Cancelar edição</button>}
    </form>
  );
}

export default FormProjeto;
