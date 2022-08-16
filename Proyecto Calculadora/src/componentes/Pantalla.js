import React from "react";
import '../styles/Pantalla.css'

function Pantalla(props){
    return(
        <div className="contenedorPantalla">
            {props.input}
        </div>
    )
}

export default Pantalla;