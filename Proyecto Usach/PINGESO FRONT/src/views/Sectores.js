import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import '../c_styles/Sectores.css';
import sector2 from '../assets/sector2.jpeg';
import sector3 from '../assets/sector3.jpeg';
import sector4 from '../assets/sector4.jpeg';
import sector5 from '../assets/sector5.jpeg';
import sector6 from '../assets/sector6.jpeg';
import sector7 from '../assets/sector7.jpeg';
import sector8 from '../assets/sector8.jpeg';

var data = [ 
    ["Sector 2", "Escuela de Artes, Deportes, Obras Civiles, Mecánica, Metalúrgica, Informática, Industrias, Tecnológico", 
    <img justifyContent= {'center'} width={750} height={320} alt='' src={sector2} ></img> ],
    ["Sector 3", "Física, Eléctrica, Salón Bulnes, Talentos Artísticos", 
    <img justifyContent= {'center'} width={750} height={320} alt='' src={sector3} ></img> ],
    ["Sector 4", "Finanzas, Geográfica", 
    <img justifyContent= {'center'} width={750} height={320} alt='' src={sector4} ></img> ],
    ["Sector 5", "FAE, Pabellón FORMA", 
    <img justifyContent= {'center'} width={750} height={320} alt='' src={sector5} ></img> ],
    ["Sector 6", "Casa Central, Paraninfo",
    <img justifyContent= {'center'} width={750} height={320} alt='' src={sector6} ></img> ],
    ["Sector 7", "Humanidades, Ciencia, Química y Biología, Minas, Mecánica, CITECAMP, CENI, Ciencias Médicas, Ing. Química", 
    <img justifyContent= {'center'} width={750} height={320} alt='' src={sector7} ></img> ],
    ["Sector 8", "Psicología, Periodismo, Arquitectura, Bachillerato, Educación, Filosofía", 
    <img justifyContent= {'center'} width={750} height={320} alt='' src={sector8} ></img> ],
]

function Sectores() {
    const [currentPage, setCurrentPage] = useState(0);

    const filtrarSectores = (data) => {

        return data.slice(currentPage ,currentPage + 1);
    }

    const nextPage = () => {
        if (currentPage < 6){
            setCurrentPage(currentPage + 1);
        }
        else{
            alert("No existe pagina siguiente")
        }
        
    }

    const SetPage = (event) => {
        setCurrentPage(event);
        
    }

    const prevPage = () => {
        console.log("pincho el previe")
        if (currentPage > 0){
            setCurrentPage(currentPage - 1);
        }
        else{
            alert("No existe pagina anterior")
        } 
    }

  return (  
    
    
      <div className='contenedorNaranjoSectores'>
            <div className='contenedorBlancoSectores'>
                <h1>Sectores de la universidad</h1>
                
                {/* var sectores = [[<h1 className='nombreSector' id='sectorNombre'>Sector</h1>
                    <h1 className='nombreDescripcion' id='parrafoNombre'>Descripcion</h1>
                    <h1 className='nombreMapa' id='mapaNombre'>Mapa</h1>], [<h2 className='h2Sector2' id='sector2'>Sector 2</h2>
                    <p className='parrafoSector2' id='parrafo2'>Escuela de Artes, Deportes, Obras Civiles, Mecánica, Metalúrgica, Informática, Industrias, Tecnológico</p>
                    <img className='imagenSector2' id='mapa2' alt='' src={sector2}></img>]]  */}
                

                <table >
                    {/* <thead >
                        <tr className='contenedorDataTitulosSectores'>
                            <th className='sector'>Sector</th>
                            <th className='descripcion'>Descripcion</th>
                            <th className='mapa'>Mapa</th>
                        </tr>
                    </thead> */}
                    <tbody>
                        {
                            filtrarSectores(data).map( element => (
                                <th className='contenedorDataSec' key={element[0]}>
                                    <td className='dataNombre'> {element[0]} </td>
                                    <td className='dataParrafo'> {element[1]} </td>
                                    <td className='dataMapa'> {element[2]} </td>
                                </th>
                                
                            ))
                        }
                    </tbody>
                </table>

                <div className='botonesPaginacion'>
                <Button className='boton' onClick={() =>prevPage()}>Anterior Sector</Button>

                <Button className='boton' onClick={() =>SetPage(0)}>2</Button>
                <Button className='boton' onClick={() =>SetPage(1)}>3</Button>
                <Button className='boton' onClick={() =>SetPage(2)}>4</Button>
                <Button className='boton' onClick={() =>SetPage(3)}>5</Button>
                <Button className='boton' onClick={() =>SetPage(4)}>6</Button>
                <Button className='boton' onClick={() =>SetPage(5)}>7</Button>
                <Button className='boton' onClick={() =>SetPage(6)}>8</Button>

                <Button className='boton' onClick={() =>nextPage()}>Siguiente Sector</Button>
                </div>
               

                {/* <ul class="pagination">
                    <li class="page-item"><a class="page-link" onClick={() =>prevPage()}>Anterior</a></li>
                    <li class="page-item"><a class="page-link" onClick={() =>SetPage(0)}>2</a></li>
                    <li class="page-item"><a class="page-link" onClick={() =>SetPage(1)}>3</a></li>
                    <li class="page-item"><a class="page-link" onClick={() =>SetPage(2)}>4</a></li>
                    <li class="page-item"><a class="page-link" onClick={() =>SetPage(3)}>5</a></li>
                    <li class="page-item"><a class="page-link" onClick={() =>SetPage(4)}>6</a></li>
                    <li class="page-item"><a class="page-link" onClick={() =>SetPage(5)}>7</a></li>
                    <li class="page-item"><a class="page-link" onClick={() =>SetPage(6)}>8</a></li>
                    <li class="page-item"><a class="page-link" onClick={() =>nextPage()}>Siguiente</a></li>
                </ul> */}
                
            </div>
      </div>
      
    
  );
}

export default Sectores;