import { Link } from 'react-router-dom';

function NaoEncontrada() {
  return (
    <main>
      <h2>Página não encontrada</h2>
      <p>Esse endereço não existe no Portfólio.</p>
      <Link to="/">Voltar para o Início</Link>
    </main>
  );
}

export default NaoEncontrada;
