import React from 'react'
import imagen2 from '../assets/imagen2.jpeg';


function TarjeraHeader() {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Ocupacion de salas</h2>
        <img class="img-responsive center-block" src={imagen2} className="img"></img>
      </div>
    </div>
  )
}

export default TarjeraHeader