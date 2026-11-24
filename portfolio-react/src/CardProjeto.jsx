function CardProjeto({ nome, descricao, tecnologias, link_github, ano }) {
  return (
    <article className="card">
      <h3>{nome}</h3>
      <p className="meta">{tecnologias} - {ano}</p>
      <p>{descricao}</p>
      {link_github && <a href={link_github}>Ver no GitHub</a>}
    </article>
  );
}

export default CardProjeto;
