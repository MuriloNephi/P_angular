import { Routes, Route } from 'react-router-dom';
import Cabecalho from './Cabecalho.jsx';
import Inicio from './Inicio.jsx';
import Gestao from './Gestao.jsx';
import NaoEncontrada from './NaoEncontrada.jsx';
import Rodape from './Rodape.jsx';

function App() {
  return (
    <>
      <Cabecalho />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/gestao" element={<Gestao />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Routes>
      <Rodape />
    </>
  );
}

export default App;
