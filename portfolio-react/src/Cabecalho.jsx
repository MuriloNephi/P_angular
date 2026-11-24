import { Link } from 'react-router-dom';

function Cabecalho() {
  return (
    <header>
      <h1>Meu Portfólio</h1>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/gestao">Gestão</Link>
      </nav>
    </header>
  );
}

export default Cabecalho;
