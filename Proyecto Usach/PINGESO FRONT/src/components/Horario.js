import React, { useState, useEffect } from 'react';
import axios from "axios";
import Table from 'react-bootstrap/Table'
import '../c_styles/Horario.css';
import { Col, Row, Button, Container, Spinner, Modal} from 'react-bootstrap';
import ListaSalas from './ListaSalas';
const serverUrl = process.env.REACT_APP_SERVER;
const weekdays = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];

function Horario(props){
  var list = [];
  const [isLoading, setLoading] = useState(false);
  const [listaModulos, setModulos] = useState([]);
  const [showlistarsalas, setShowListarSalas] = useState(false);
  const [salaSelec, setSalaSelec] = useState();
  const [profesores, setProfesores] = useState([]);
  const [mostrarProfesores, setMostrarProfesores] = useState([]);
  const [mod, setMod] = useState("");
  const [dia, setDia] = useState();
  const [modules, setModules] = useState([]);
  const {show, toggleShowHorario} = props;

  const toggleShow = () => setShowListarSalas(p => !p);
  const hload = () => setLoading(p => !p);

  useEffect(() => {
    axios.get(serverUrl + "/getModulosByPeriodo", {params : {periodo : props.periodo}})
    .then(res => {
      console.log(res.data); 
      setModules(res.data);})
    .catch(err => console.log(err));
  }, []);

  const modulosGet = async (event) =>{
    await axios.get(serverUrl+'/getHorariosByGrupo', {params:{id_grupo: props.grupo, tipo: props.tipo ,periodo: props.periodo, cod_asignatura: props.asignatura}})
      .then(response=>{
        setModulos(response.data);
        let listaProfesores = [];
        for(let i = 0; i<response.data.length ; i++){
          listaProfesores.push(response.data[i][3]);
        }
        setProfesores(listaProfesores);

        setLoading(true);
    })
    .catch (error=> {
      setModulos([]);
      alert(error.response.data.message);
      console.log(error);
    })
  };


  

    for (let index = 0; index < modules.length; index++) {
      list[index] = new Array(weekdays.length);
      for (let index2 = 1; index2 <= weekdays.length; index2++) {
        list[index][index2-1] = null;      
        let i = 0;
        listaModulos.forEach(element => {
        if(element[1] === index2 && element[0] === modules[index][0] ){
          if(element[2]===null){
            list[index][index2-1] = ["sin asignar", i];
          }else{
            //aqui tengo que pasar toda la info del horario
            list[index][index2-1] = [element[2], i];   
          }              
        }  
        i++;
      })      
    }
  };
  
  const showHorario = () => {
    modulosGet();
    setLoading(false);
  };

  const hideHorario = () => {
    props.seccionSelect([props.asignatura, props.nombreSec], props.indexA);
    toggleShowHorario();
  };

  const abrirListaSalas = (modulo, idx, sala) => {
    setMod(modulo);
    setSalaSelec(sala);
    setDia(idx+1);
    setShowListarSalas(true);
};

const enterHorario = (i) => {
  console.log(i)
  console.log(profesores[i])
  setMostrarProfesores(profesores[i]);

};

const leaveHorario = () => { 
  setMostrarProfesores([]);
};


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
          <Modal.Title id="contained-modal-title-vcenter">
            {props.asignatura} - {props.nombreSec} - {props.grupo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="fondoHorario">
        <Container>
        <ListaSalas
              show = {showlistarsalas}
              toggleShow = {toggleShow}
              hload = {setLoading}
              periodo = {props.periodo}
              modulosGet = {modulosGet}
              sala = {salaSelec}
              mod = {mod}
              dia ={dia}
              nombreDia ={weekdays[dia-1]}
              asignatura = {props.asignatura}
              grupo = {props.grupo}
              nombreSec = {props.nombreSec}
              tipo = {props.tipo}
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

          <tbody>
            {Array.from({ length: modules.length }).map((_, index1) => (
              <tr key={index1}>
                  <><th scope='row' key={modules[index1]} className="cModulos">
                      {modules[index1][0]}{"\n"}{modules[index1][1] +" - " + modules[index1][2]}
                    </th>
              {Array.from({ length: weekdays.length }).map((_, index2) => (
                list[index1][index2] !== null ?
                  ((list[index1][index2][0] === "sin asignar" ) ? 
                  <td id='sinSala' onMouseEnter={() => enterHorario(list[index1][index2][1])} onMouseLeave={() => leaveHorario()} key={modules[index1][0] + weekdays[index2]}><a onClick={() =>abrirListaSalas(modules[index1][0],index2,list[index1][index2])}> {list[index1][index2][0]} </a></td>
                  :<td id='conSala' onMouseEnter={() => enterHorario(list[index1][index2][1])} onMouseLeave={() => leaveHorario()} key={modules[index1][0] + weekdays[index2]}><a onClick={() =>abrirListaSalas(modules[index1][0],index2,list[index1][index2])}> {list[index1][index2][0]} </a></td>)               
                    :<td key={modules[index1][0] + weekdays[index2]}></td>))}
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
        
          {mostrarProfesores.length !== 0 ? 
          <p id="profesores" className="me-auto">Profesores: {mostrarProfesores}</p>
          :<></>}
          
          <Button onClick={hideHorario}>Cerrar</Button>
        </Modal.Footer>
      </Modal>


)
}

export default Horario;