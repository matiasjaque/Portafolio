import React from 'react'
import imagen4 from '../assets/imagen4.jpeg';

function TarjeraHeader() {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Ocupacion por unidad</h2>
        <img class="img-responsive center-block" src={imagen4}></img>
      </div>
    </div>
  )
}

export default TarjeraHeader