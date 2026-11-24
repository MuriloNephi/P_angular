import Cabecalho from './Cabecalho.jsx';
import CardProjeto from './CardProjeto.jsx';
import Contato from './Contato.jsx';
import Rodape from './Rodape.jsx';
import projetos from './projetos.js';

function App() {
  return (
    <>
      <Cabecalho />
      <main>
        <h2>Projetos</h2>
        <div className="cards">
          {projetos.map((p) => (
            <CardProjeto key={p.id} nome={p.nome} descricao={p.descricao} tecnologias={p.tecnologias} link_github={p.link_github} ano={p.ano} />
          ))}
        </div>
        <Contato />
      </main>
      <Rodape />
    </>
  );
}

export default App;
