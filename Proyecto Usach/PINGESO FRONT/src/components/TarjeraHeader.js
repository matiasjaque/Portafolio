import React from 'react'
import imagen1 from '../assets/imagen1.jpeg';

function TarjeraHeader() {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Numero de salas</h2>
        <img src={imagen1}></img>
      </div>
    </div>
  )
}

export default TarjeraHeader