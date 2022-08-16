import React, { useState } from 'react';
import { Col, Row, ListGroup, Form, FormControl, Container, Modal, Button, Spinner} from 'react-bootstrap';
import '../c_styles/UnidadAcademica.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import swal from 'sweetalert';
import '../c_styles/ListaSalas.css';
  

const conectado = new Cookies();
var days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"]
var id_usuario_actual = conectado.get('id');
const serverUrl = process.env.REACT_APP_SERVER;

function ListaSalas(props){
    const [isLoading, setLoading] = useState(true);
    const [salaDisp, setSalaDisp] = useState("disp");
    const [salaSelec, setSalaSelec] = useState();
    const [salaActual, setSalaActual] = useState([]);
    const [salas, setSalas] = useState([]);
    const [salasFilterUnidad, setSalasFilterUnidad] = useState(salas);
    const [salasFilter, setSalasFilter] = useState(salas);
    const [filtroUnidad, setFiltroUnidad] = useState("");
    const [filtroSalaText, setFiltroSalaText] = useState("");
    const [unidadesUsuario, setUnidadesUsuario] = useState([]);
    const [isActiveIndex, setIsActiveIndex] = useState(-1);
    const {show, toggleShow} = props;
    const {reload, hload} = props;

    const getSalaDisp = async () =>{
        setLoading(true);
        await axios.get(serverUrl+"/getSalasByHorarioDisp", {params:{periodo: props.periodo, modulo: props.mod, dia: props.dia, id_usuario: id_usuario_actual}})
        .then(response=>{
            setLoading(false);
            setSalas(response.data)
            setSalasFilterUnidad(response.data)
            setSalasFilter(response.data)
            //console.log(response.data);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        })
    }

    const getSalaOcp = async (event) =>{
        setLoading(true);
        await axios.get(serverUrl+"/getSalasByHorarioOcp", {params:{periodo: props.periodo, modulo: props.mod, dia: props.dia, id_usuario: id_usuario_actual}})
        .then(response=>{
            setLoading(false);
            setSalas(response.data)
            setSalasFilterUnidad(response.data)
            setSalasFilter(response.data)
            //console.log(response.data);
        })
        .catch(error=>{
            event.target.value = "ocp";
            alert(error.response.data.message);
            console.log(error);
        })
    }

    function handleChange(e, i) {
        setSalaSelec(e.target.value);
        setIsActiveIndex(i)
        console.log("sala:" + i)
    }

    function loading() {
        if(isLoading){
            return(
            <Row>
                <Col className="loading">
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
            )
        }
    }

    function listarSalas(salas){
        var rows = []
        let salaActualHTML;
        if(salaActual.length !== 0){
            salaActualHTML = 
                <ListGroup.Item id="salaActual" action value={salaActual[0]}>
                    <Row>
                        <Col lg={2}><b>{salaActual[0][0]}</b></Col>
                        <Col lg={2}>{salaActual[0][5]}</Col>
                        <Col lg={5} >{"[" + salaActual[0][1] + "]" + salaActual[0][4]}</Col>
                        <Col lg={1} >{salaActual[0][2]}</Col>
                        <Col lg={1} >{salaActual[0][3]}</Col>
                        <Col lg={1}>{botonBorrarSala()}</Col>
                    </Row>
                </ListGroup.Item>
            
        }
        // for (var i = 0; i < salas.length; i++) {
        //     rows.push(
        //         <ListGroup.Item key={i} action variant="light" onClick={(event) => {handleChange(event, i)}} value={salas[i][0]}>
        //             <div className= {i === isActiveIndex ? "isActive" : null}>
        //                 <Row className='unclickeable'>
        //                     <Col lg={2}><b>{salas[i][0]}</b></Col>
        //                     <Col lg={2}>{salas[i][5]}</Col>
        //                     <Col lg={5}>{"["+salas[i][1]+"]"+salas[i][4]}</Col>
        //                     <Col lg={1}>{salas[i][2]}</Col>
        //                     <Col lg={2}>{salas[i][3]}</Col>
        //                 </Row>
        //             </div>
        //         </ListGroup.Item>
        //     );
        // }
        //console.log(rows)
        if(isLoading){
            return (
                <div>
                    <Row>
                        <Col lg={2}># Sala</Col>
                        <Col lg={2}>Descripción</Col>
                        <Col lg={5}>Nombre unidad</Col>
                        <Col lg={1}>Capacidad</Col>
                        <Col lg={2}>Tipo</Col>
                    </Row>
                    {salaActualHTML}
                    <Row>
                        <Col className="loading">
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
                </div>
                )
        }else{
            return (
            <div>
                <Row>
                    <Col lg={2}>
                        # Sala
                    </Col>
                    <Col lg={2}>
                        Descripción
                    </Col>
                    <Col lg={5}>
                        Nombre unidad
                    </Col>
                    <Col lg={1}>
                        Capacidad
                    </Col>
                    <Col lg={2}>
                        Tipo
                    </Col>
                </Row>
                {salaActualHTML}
                <ListGroup id="listaSalas">{rows}
                {salasFilter.map(
                    (sala, i) => {
                        return(
                        <ListGroup.Item key={i} action variant="light" onClick={(event) => {handleChange(event, i)}} value={sala[0]}>
                            <div className= {i === isActiveIndex ? "isActive" : null}>
                                <Row className='unclickeable'>
                                    <Col lg={2}><b>{sala[0]}</b></Col>
                                    <Col lg={2}>{sala[5]}</Col>
                                    <Col lg={5}>{"["+sala[1]+"]"+sala[4]}</Col>
                                    <Col lg={1}>{sala[2]}</Col>
                                    <Col lg={2}>{sala[3]}</Col>
                                </Row>
                            </div>
                        </ListGroup.Item>
                        )
                })}</ListGroup>
                
            </div>
            )
        }
    }

    async function showModal(){
        console.log("iniciado modal");
        setSalaSelec(null);
        setSalaDisp("disp");
        if(props.sala !== "sin asignar"){
            await axios.get(serverUrl + "/getSalasByCodSala", {params:{cod_sala: props.sala[0]}})
                .then(response=>{
                    setSalaActual(response.data)
                })
                .catch(error=>{
                    alert(error.response.data.message);
                })
        }
        await axios.get(serverUrl + "/getUnidadesMenores", {params:{id_usuario: id_usuario_actual}})
            .then(response=>{
                setUnidadesUsuario(response.data)
            })
            .catch(error=>{
                alert(error.response.data.message);
            })
        getSalaDisp();
        setFiltroSalaText("");
        setFiltroUnidad("Mostrar todas");
        console.log("modal cargado completamente");
    }

    // para dropdown unidades filtro
    function listaUnidadesUsuario(){
        let result = [];
        for(let i=0; i < unidadesUsuario.length; i++){
            result.push(<option value={unidadesUsuario[i][0]}>{unidadesUsuario[i][1]} - {unidadesUsuario[i][0]} </option>)
        }
        return result
    }
    

    function hideModal(){
        setSalaSelec(null);
        setFiltroSalaText("");
        setSalasFilter([]);
        setSalas([]);
        setSalaActual([]);
        setIsActiveIndex(-1);
        toggleShow();
    }

    function seleccionarDisp(event){
        //console.log(event.target.value)
        if(event.target.value === "disp"){
            setFiltroUnidad("Mostrar todas");
            setFiltroSalaText("");
            getSalaDisp(event);
            setSalaDisp("disp");
        }else{
            setFiltroUnidad("Mostrar todas");
            setFiltroSalaText("");
            getSalaOcp(event);
            setSalaDisp("ocp");
        }
    }
    
    const updateSala = async () =>{
        await axios({
            method: 'put',
            url: serverUrl + "/putHorarioSala",
            params: {
                id_grupo: props.grupo ,tipo: props.tipo, cod_asignatura: props.asignatura, cod_sala: salaSelec, periodo: props.periodo, modulo: props.mod, dia: props.dia, id_usuario: id_usuario_actual
            }
          });
        toggleShow()
        props.modulosGet()
        setSalasFilter([])
        setSalaActual("sin asignar")
        if(salaDisp === "disp"){
            getSalaDisp();
        }else{
            getSalaOcp();
        }
        
    }

    const borrarSala = async () =>{
        await axios({
            method: 'put',
            url: serverUrl + "/putHorarioSala",
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: {
                id_grupo: props.grupo ,tipo: props.tipo, cod_asignatura: props.asignatura, cod_sala: null, periodo: props.periodo, modulo: props.mod, dia: props.dia, id_usuario: id_usuario_actual
            }
          });

        toggleShow()
        props.modulosGet()
        setSalasFilter([])

        if(salaDisp === "disp"){
            getSalaDisp();
        }else{
            getSalaOcp();
        }
    }

    const botonBorrarSala = () =>{
        let button;
        if(props.sala !== "sin asignar"){
            button = <Button variant="danger" id="botonBorrar"className="float-end" onClick={mostrarAlertaDesasignar}>Borrar</Button>
        }
        else{
            button = null;
        }
        return(button);
    }

    const mostrarAlertaAsignacion= async ()=>{
        //console.log("aqui llega ?????")
        //console.log(salaDisp)
        if(salaDisp === "disp"){
            swal({
                title: "Asignar Sala",
                text: "¿Esta seguro que desea asignar sala "+ salaSelec+"?",
                icon: "warning",
                buttons: ["Cancelar", "Aceptar"]
            }).then(respuesta=>{
                if(respuesta){
                    swal({text:"La sala ha sido asignada con exito",
                          icon: "success", timer: "2000"})
                          updateSala();
                          hload();
                        }
                }       );
        }
        else{
            
        }
    }
        

    const mostrarAlertaDesasignar=()=>{
        swal({
            title: "Quitar Sala",
            text: "¿Esta seguro que desea desasignar la sala "+ props.sala[0] +"?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"La sala ha sido quitada con exito",
                      icon: "success", timer: "2000"})
                      borrarSala();
                      hload();
            }
        })
        ;
      }

    

    const filterUnidad = (e) => {
        const keyword = e.target.value;
        setFiltroUnidad(e.target.value);
        console.log(filtroUnidad)
        // filter();
        let results = []

        if (keyword !== 'Mostrar todas') {  
            for(let i = 0 ; i<salas.length ; i++){
                if(salas[i][4].toLowerCase().startsWith(keyword.toLowerCase())){
                    results.push(salas[i])
                }
            }
            setSalasFilterUnidad(results);
            setSalasFilter(results);
        } else {
            setSalasFilterUnidad(salas);
            setSalasFilter(salas);
          // If the text field is empty, show all users
        }
        setFiltroSalaText('');
    };

    const filterSala = (e) => {
        const keyword = e.target.value;
        setFiltroSalaText(e.target.value);
        
        // filter();
        let results = []
        if (keyword !== '') {
            for(let i = 0 ; i<salasFilterUnidad.length ; i++){
                if(salasFilterUnidad[i][0].toLowerCase().startsWith(keyword.toLowerCase())){
                    results.push(salasFilterUnidad[i])
                }
            }
            setSalasFilter(results);
        } else {
            setSalasFilter(salasFilterUnidad);
        }
    };

    return(<div>
        <Modal show={show}
        dialogClassName='modal-90w'
        aria-labelledby="example-custom-modal-styling-title"
        centered
        onShow={showModal}
        onHide={hideModal}>
        <Modal.Header closeButton>
            <Row className='w-100'>
                <Col xs={12} md={8}>
                <Modal.Title>Salas {props.asignatura}-{props.nombreSec} - {props.grupo} - {days[props.dia-1]} {props.mod}</Modal.Title>
                </Col>
            </Row>
        </Modal.Header>
                
        <Modal.Body>
            <Container>
                <Row className="mb-2">
                    <Col>
                        <Form.Label>Disponibilidad</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={(event) => {seleccionarDisp(event)}}>
                            <option value="disp">Salas disponibles</option>
                            <option value="ocp">Salas no disponibles</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label>Unidad</Form.Label>
                        <Form.Select aria-label="Default select example" value={filtroUnidad} onChange={(event) => {filterUnidad(event)}}>
                            <option value="Mostrar todas">Todas las Unidades</option>
                            {listaUnidadesUsuario()}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label>Código Sala</Form.Label>
                        <FormControl placeholder="Buscador # sala" className="me-2" value={filtroSalaText} onChange={(event) => {filterSala(event)}} aria-label="Search"/>
                    </Col>
                </Row>
                {listarSalas(salasFilter)}
            </Container>
        </Modal.Body>
        <Modal.Footer>
            <p id="numSalas" className="me-auto">Total de salas: {salasFilter.length}</p>
            <Button onClick={mostrarAlertaAsignacion}>Asignar sala</Button>
            <Button onClick={hideModal}>Cerrar</Button>
        </Modal.Footer>
        </Modal>
      </div>
    )

}

 export default ListaSalas;