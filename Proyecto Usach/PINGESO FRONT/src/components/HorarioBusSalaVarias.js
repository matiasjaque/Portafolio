import React, { useState, useEffect } from 'react';
import axios from "axios";
import Table from 'react-bootstrap/Table'
import '../c_styles/Horario.css';
import { Col, Row, Button, Container, Spinner, Modal} from 'react-bootstrap';
import '../c_styles/HorarioBusSalas.css';
import Cookies from 'universal-cookie';

import MostrarVariasSecc from './MostrarVariasSecc';

import imagenUsach from '../assets/logoUsach.svg.png';

const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
const serverUrl = process.env.REACT_APP_SERVER;
const weekdays = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sábado','Domingo'];
const modulos = ["01-02","03-04","05-06","07-08","09-10","11-12","13-14","15-16","17-18"];
const hora = ["08:00 - 09:30","09:40 - 11:10","11:20 - 12:50","13:50 - 15:20","15:30 - 17:00","17:10 - 18:40","18:45 - 20:10","20:10 - 21:35","21:35 - 23:00"];

function HorarioBusSalaVarias(props){
  var list = [];
  const [isLoading, setLoading] = useState(false);
  const [isLoadingVariasSecc, setLoadingVariasSecc] = useState(false);

  const [listaModulos, setListaModulos] = useState([]);
  const {show, toggleShowHorario} = props;
  const [dia, setDia] = useState("");
  const [numeroDia, setNumDia] = useState("");
  //const [largoConsulta, setLargoConsulta] = useState();
  const [modulo, setModulo] = useState("");
  //const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
    .then(response=>{
        console.log("data de las varias salas: " + props.data)
    })
    .catch(error=>{
        alert(error.response.data.message);
    });
  }, []);


  //varias secciones

 // const [showVariasSecc, setVariasSecc] = useState(false);

  //const toggleShow = () => setVariasSecc(p => !p);




//console.log(listaModulos[0])
//console.log(listaModulos)


const showHorario = () => {
    
    axios.get(
      serverUrl + "/getPdfBuscador",
      {
          params: {periodo: props.periodo, cod_sala: props.codigoSala, hasta: props.codigoSala},
          responseType: 'blob'
      },
    ).then((response) => {
        setFile(response.data);
    })
    setLoading(false);
  };

  
  

  const hideHorario = () => {
    toggleShowHorario();
  };

  /* const abrirVariasSecc = (dia, modulo) => {
    setDia(weekdays[(dia - 1)]);
    setNumDia(dia);
    setModulo(modulo);
    setVariasSecc(true);
    isLoadingVariasSecc(true)
}; */

function downloadPDF() {
  window.open(URL.createObjectURL(file));
}

    return(
          
      <Modal
        dialogClassName='modal-90w'
        aria-labelledby="example-custom-modal-styling-title"
        centered
        show={show}
        onShow={showHorario}
        onHide={hideHorario}
      >
        {Array.from({ length: props.data.length }).map((_, index) => (
                
              
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className='contenedorTitulo'>

          {<img alt='' className='imagenUsach' src={imagenUsach}></img>} 
          { <h2 className='textoInformacionSalas'>UNIVERSIDAD DE SANTIAGO DE CHILE <br></br> VICERRECTORÍA ACADÉMICA<br></br>UNIDAD DE REGISTRO ACADÉMICO Y CURRICULAR</h2> } 
          <div className='elementosSala'>
                                <h4>DESCRIPCIÓN: </h4>
                                <h4>CÓDIGO:</h4>
                                <h4>CAPACIDAD:  </h4>
                                <h4>RESPONSABLE:  </h4>
                                <h4>TIPO DE SALA:  </h4>
                                <h4>AFORO:  </h4>
                                <h4>M2:  LARGO:  ANCHO:  </h4>
                            </div>                                                                         
                            <Button className = "boton" onClick={downloadPDF}>DescargarPDF</Button>                  
          </Modal.Title>
          
        </Modal.Header>

        /* 
        <Modal.Body id="fondoHorario">
        <Container>
        {/* <MostrarVariasSecc
              show = {showVariasSecc}
              toggleShow = {toggleShow}
              sala = {props.sala}
              dia = {dia}
              modulo = {modulo}
              periodo = {props.periodo}
              numeroDia = {numeroDia}
              //codigoSala = {props.codigoSala}
            /> 
        {isLoading ? 
        
        <Table responsive bordered  id="fondo">
          <thead>
            <tr id='dias'>
              <th >       </th> 
              {Array.from({ length: weekdays.length }).map((_, index) => (
                <th id="colDia" scope='col' key={weekdays[index]} >{weekdays[index]  } </th>
              ))}
            </tr> 
          </thead>

         {/*  <tbody className='body'>
                                    
          {Array.from({ length: modulos.length }).map((_, index1) => (
              <tr key={index1}>
                  <><th scope='row' key={modulos[index1]} className="cModulos">
                      {modulos[index1]}{"\n"}{hora[index1]}
                    </th>
            {Array.from({ length: weekdays.length }).map((_, index2) => (
                list[index1][index2] !== null ?
                
                ((list[index1][index2][6] < 1) ?
                  ((list[index1][index2][5] < 1) ? 
                    ((list[index1][index2][4] < 1) ?
                      <td id='infoNormal' height={150} key={modulos[index1] + weekdays[index2]}>
                          <div className='infoHorario'>
                              <strong>CODIGO:</strong> {list[index1][index2][0]} <br></br>
                              <strong>ASIGNATURA:</strong> {list[index1][index2][1]} <br></br>
                              <strong>SECCIÓN:</strong> {list[index1][index2][2]} <br></br>
                              <strong>ALUMNOS:</strong> {list[index1][index2][3]} 
                          </div>    
                      </td>
                  :<td id='variasSecc' height={150} key={modulos[index1] + weekdays[index2]}>
              
                    <a onClick={() =>abrirVariasSecc(list[index1][index2][7], list[index1][index2][8])}>
                      <strong>CODIGO:</strong> {list[index1][index2][0]} <br></br>
                      <strong>ASIGNATURA:</strong> {list[index1][index2][1]} <br></br>
                      <strong>VARIAS SECCIONES</strong>
                    </a>
                    {isLoadingVariasSecc? <Col>
                                <Row>
                                    <Col className="loading2">
                                    <Button variant="primary" disabled>
                                            <span>Cargando </span> 
                                            <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            />
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>:<div>
                                
                                </div>}
                      
                      
                  </td>)
                    :<td id='asigMult' height={150} key={modulos[index1] + weekdays[index2]} >
                        {/* asignacion multiple con varias secciones 
                        <a onClick={() =>abrirVariasSecc(list[index1][index2][7], list[index1][index2][8])}>
                          <strong>ASIGNACION MULTIPLE</strong>
                        </a>
                    </td>)
                      :<td id='asigMult' height={150} key={modulos[index1] + weekdays[index2]} >
                        <a onClick={() =>abrirVariasSecc(list[index1][index2][7], list[index1][index2][8])}>
                          <strong>ASIGANCION MULTIPLE</strong>
                        </a>
                      </td>)

                    
                        :<td height={150} key={modulos[index1] + weekdays[index2]} ></td>))}
                </>                
                </tr>))}    
            
        </tbody> 
        </Table>/* :
        <Container className='loading'>
        <Row>
            <Col></Col>
            <Col>
                <Button variant="primary" disabled>
                    <span>Cargando... </span> 
                    <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                </Button>
            </Col>
            <Col></Col>
        </Row>
        </Container>
        }  
        </Container>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={hideHorario}>Cerrar</Button>
    </Modal.Footer>  */
    ))}
      </Modal>
)}

export default HorarioBusSalaVarias;