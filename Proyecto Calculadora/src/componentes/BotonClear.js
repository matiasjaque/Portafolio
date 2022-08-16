import React from 'react';
import '../styles/BotonClear.css';

function BotonClear(props){
    return(
        <div className='botonClear'
            onClick={() => props.manejarClick()}>
            {props.children}
        </div>
    )
}

export default BotonClear;