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

function HorarioBusSalas(props){
  var list = [];
  var list2 = [[]];
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


  //varias secciones

  const [showVariasSecc, setVariasSecc] = useState(false);

  const toggleShow = () => setVariasSecc(p => !p);

  /* useEffect(() => {
    axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
    .then(response=>{
        console.log("largo de la consulta antes del set: " + props.largoConsulta)
        setLargoConsulta(props.largoConsulta)
        console.log("largo de la consulta: " + largoConsulta)
    })
    .catch(error=>{
        alert(error.response.data.message);
    });
  }, []); */

  /* const modulosGet = async (event) =>{
    await axios.get(serverUrl+'/getHorariosByGrupo', {params:{id_grupo: props.grupo, tipo: props.tipo ,periodo: props.periodo, cod_asignatura: props.asignatura}})
      .then(response=>{
        setModulos(response.data);

        setLoading(true);
    })
    .catch (error=> {
      setModulos([]);
      alert(error.response.data.message);
      console.log(error);
    })
  }; */

  const getHorario = async (codigoSala) => {  
        
    console.log("llame a horario1 con un largo de consulta: " + props.largoConsulta);
    await axios.get(serverUrl+"/getHorarioBySalaBusc", {params:{periodo: props.nombrePeriodo, cod_sala: codigoSala, hasta: props.hasta}})
    .then(response=>{
        //console.log("info horario: " + response.data);
        //console.log("info horario: en [0] " + response.data[0]);
        //console.log("LISTAMODULOS ANTES DE SET " + listaModulos)
        setListaModulos(response.data);
        setLoading(true);
        //console.log("LISTA MODULO DESP SET " + listaModulos);
        //console.log("LISTA MODULO DESP SET en [0]" + listaModulos[0]);
        
    })
    .catch(error=>{
        alert(error.response.data.message);
        setListaModulos([]);
        setLoading(true);
        console.log(error);
    })  
};


  for (let index = 0; index < modulos.length; index++) {
    list[index] = new Array(weekdays.length);
    
    for (let index2 = 1; index2 <= weekdays.length; index2++) {
      list[index][index2-1] = null;   
      let i = 0;
      let j = 0;
      let z = 0;
      let k = 0;

      let nombreAsig = "";
      let nombreAsigAux = "";
      listaModulos.forEach(element => {
          //console.log("ANTES DEL IF")
          
      if(element[8] === index2 && element[9] === modulos[index] ){
         // console.log("DESPUES")
         
          list[index][index2-1] = [element[5], element[10], element[11], element[12], i, k, z, element[8], element[9]];
          /* console.log("INFO LIST" + list)   
          console.log("INFO LIST CON [] [] " + list[index][index2])    */  
          nombreAsig = element[10];
          //dataAux.push(list[index][index2-1]);
          
          if(nombreAsig === nombreAsigAux){
            j++;
          }
          
          if( i > 1 && j > 1){
            z++;
          }
          // este seria varias secciones
          if ( j === (i - 1)){
            k++;
          }
          //console.log(nombreAsig +" == " + nombreAsigAux)
          nombreAsigAux = nombreAsig;
          i++;   
          
          
          //console.log(dataAux)
          //console.log("valor de i en el dia " + index2 + " modulo " + 2 * index + " valor de i: " + list[index][index2-1][4] + " VALOR DE J: " + list[index][index2-1][5])
      }  
      
    })
  }
};

  
  
  const showHorario = () => {
    getHorario(props.codigoSala);
    
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

  const abrirVariasSecc = (dia, modulo) => {
    setDia(weekdays[(dia - 1)]);
    setNumDia(dia);
    setModulo(modulo);
    setVariasSecc(true);
    isLoadingVariasSecc(true)
};

async function downloadPDF() {
  await axios.get(
    serverUrl + "/getPdfBuscador",
    {
        params: {periodo: props.periodo, cod_sala: props.codigoSala, hasta: props.codigoSala},
        responseType: 'blob'
    },
  ).then((response) => {
      setFile(response.data);
  })
  window.open(URL.createObjectURL(file));
  setFile(null);
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
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className='contenedorTitulo'>

          {<img alt='' className='imagenUsach' src={imagenUsach}></img>} 
          { <h2 className='textoInformacionSalas'>UNIVERSIDAD DE SANTIAGO DE CHILE <br></br> VICERRECTORÍA ACADÉMICA<br></br>UNIDAD DE REGISTRO ACADÉMICO Y CURRICULAR</h2> } 
          <div className='elementosSala'>
                                <h4>DESCRIPCIÓN: {props.descripcion}</h4>
                                <h4>CÓDIGO: {props.codigo}</h4>
                                <h4>CAPACIDAD: {props.capacidad} </h4>
                                <h4>RESPONSABLE: {props.responsable} </h4>
                                <h4>TIPO DE SALA: {props.tipoSala} </h4>
                                <h4>AFORO: {props.aforo} </h4>
                                <h4>M2: {props.m2} LARGO: {props.largo} ANCHO: {props.ancho} </h4>
                            </div>                                                                         
                            <Button className = "boton" onClick={downloadPDF}>DescargarPDF</Button>                  
          </Modal.Title>
          
        </Modal.Header>
        <Modal.Body id="fondoHorario">
        <Container>
        <MostrarVariasSecc
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

          <tbody className='body'>
                                    
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
                        {/* asignacion multiple con varias secciones */}
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
        </Table>:
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
        </Modal.Footer>
        
      </Modal>
)}

export default HorarioBusSalas;