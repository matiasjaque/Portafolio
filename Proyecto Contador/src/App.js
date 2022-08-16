
import './App.css';
import Boton from './componentes/Boton';
import Contador from './componentes/Contador';
import logoFreecode from './imagenes/logo.png';
import {useState} from 'react';

function App() {

  const [numeroClicks, setNumeroClicks] = useState(0);

  const manejarClick = () => {
    setNumeroClicks(numeroClicks + 1);
  };

  const reiniciarClick = () => {
    setNumeroClicks(0);
  };

  return (
    <div className='App'>
      <div className='contenedorLogo'>
        <img
        className='imagenFreecodecamp'
        src={logoFreecode}
        alt='Logo de freecodecamp' />
      </div>
      <div className='contenedorPrincipal'>

        <Contador
        numeroClicks={numeroClicks}/>
        <Boton
          texto='Click'
          esBotonDeClicl={true}
          manejarClick={manejarClick}/>
        <Boton
          texto='Reiniciar'
          esBotonDeClicl={false}
          manejarClick={reiniciarClick}/>
      </div>
    </div>
  );
}

export default App;
