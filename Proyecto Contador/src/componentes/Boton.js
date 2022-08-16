import React from 'react'
import '../styles/Boton.css';

function  Boton({texto, esBotonDeClicl, manejarClick}) {
  return(
    <button
    className={esBotonDeClicl? 'botonClick' : 'botonReinicio'}
    onClick={manejarClick}>
      {texto}
    </button>  
  )
}

export default Boton;