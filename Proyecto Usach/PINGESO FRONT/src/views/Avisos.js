import React, { useEffect, useState } from 'react'
import { Container, Card, Row, Col, Button, Modal, Form, Spinner } from 'react-bootstrap';
import '../c_styles/UnidadAcademica.css';
import swal from 'sweetalert';
import axios from "axios";
const serverUrl = process.env.REACT_APP_SERVER;

function ModalModificarAviso(props) {    
    const [nuevoId, setNuevoId] = useState(null);
    const [nuevoTitulo, setNuevoTitulo] = useState(null);
    const [nuevoContenido, setNuevoContenido] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState(null);

    const modificarAviso = async () => {
        await axios({
            method: 'put',
            url: serverUrl + "/updateAviso",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: {
                id: nuevoId,
                titulo: nuevoTitulo,
                mensaje: nuevoContenido,
                activo: nuevoEstado
            }
          }).then(response=>{
            window.location.reload(false);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const confirmarModificarAviso = () => {
        swal({
            title: "Modificar Aviso",
            text: "¿Está seguro que desea modificar este aviso?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El aviso ha sido modificado exitosamente!",
                      icon: "success", timer: "4000"});
                      modificarAviso();
            }
        });
    };

    useEffect(() => {
        setNuevoTitulo(props.aviso[2]);
        setNuevoId(props.aviso[1]);
        setNuevoContenido(props.aviso[0]);
        setNuevoEstado(props.aviso[3]);
    }, [props]);

    return (
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>Modificar Aviso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control onChange={(event) => setNuevoTitulo(event.target.value)} defaultValue={props.aviso[2]} type="text"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contenido</Form.Label>
                    <Form.Control onChange={(event) => setNuevoContenido(event.target.value)} defaultValue={props.aviso[0]} as="textarea" rows={5} />
                 </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select onChange={(event) => setNuevoEstado(event.target.value)}>
                        {props.aviso[3] === 0 ?
                            <><option value="0">Activo</option>
                            <option value="1">Inactivo</option></>
                            :<><option value="1">Inactivo</option>
                            <option value="0">Activo</option></>
                        }
                    </Form.Select>
                 </Form.Group>   
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={confirmarModificarAviso}>Modificar Aviso</Button>
                <Button variant="outline-danger" onClick={props.onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

function ModalCrearAviso(props){
    const [nuevoTitulo, setNuevoTitulo] = useState(null);
    const [nuevoContenido, setNuevoContenido] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState(1);


    const crearAviso = async () => {
        await axios({
            method: 'post',
            url: serverUrl + "/createAviso",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: { 
                titulo: nuevoTitulo,
                mensaje: nuevoContenido,
                activo: nuevoEstado
            }
          }).then(response=>{
            console.log(response.data);
            window.location.reload(false);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const confirmarCrearAviso = () => {
        swal({
            title: "Crear Aviso",
            text: "¿Está seguro que desea crear un nuevo aviso?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El aviso ha sido creado exitosamente!",
                      icon: "success", timer: "4000"});
                      crearAviso();
            }
        });
    }; 
    
    return(
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear Nuevo Aviso</Modal.Title>
            </Modal.Header>
            <Modal.Body>            
                <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control onChange={(event) => setNuevoTitulo(event.target.value)} type="text"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contenido</Form.Label>
                    <Form.Control onChange={(event) => setNuevoContenido(event.target.value)} as="textarea" rows={5} />
                 </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select onChange={(event) => setNuevoEstado(event.target.value)}>
                        <option value={1}>-- Seleccionar --</option>
                        <option value={0}>Activo</option>
                        <option value={1}>Inactivo</option>
                    </Form.Select>
                 </Form.Group>   
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={confirmarCrearAviso}>Crear</Button>
                <Button variant="outline-danger" onClick={props.onHide} >Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

function Avisos() {
    const [cargando, setCargando] = useState(false);
    const [avisos, setAvisos] = useState([]);
    const [modalCrearAviso, setModalCrearAviso] = useState(false);
    const [modalModificarAviso, setModalModificarAviso] = useState(false);
    const [avisoActual, setAvisoActual] = useState([null, null, null, null]);

    const obtenerAvisos = async () => {
        axios.get(serverUrl+"/getAvisos")
            .then(response=>{
            setAvisos(response.data);
            console.log(response.data);
            setCargando(true);
        }).catch (error=> {
            alert(error.response.data.message);
            console.log(error);
        })
    };

    const eliminarAviso = async (aviso) => {
        await axios.delete(serverUrl+"/deleteAviso",
            {
                params:{id: aviso[1]}
            }
        ).then(response =>{
            window.location.reload(false);
            console.log(response);
        }).catch(error =>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const confirmarEliminarAviso = (aviso) => {
        swal({
            title: "Eliminar Aviso",
            text: "¿Está seguro que desea eliminar este aviso?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El aviso ha sido eliminado exitosamente!",
                      icon: "success", timer: "4000"});
                      eliminarAviso(aviso);
            }
        });
    }; 

    const abrirModalModificarAviso = (aviso) => {
        setAvisoActual(aviso);
        setModalModificarAviso(true);
    };

    useEffect(() => {
        obtenerAvisos();

    }, []);

    if (cargando) {
    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <Row className='mb-3'>
                    <Col md={3}><h4>Gestionar Avisos</h4></Col>
                    <Col md={3}>
                        <Button size='sm' variant="primary" onClick={() => setModalCrearAviso(true)} >Crear nuevo aviso</Button>
                    </Col>
                </Row>
                <Row className='mb-2'><Col><h5 style={{color: "#EA7600"}}>Aviso Actual:</h5></Col></Row>
                <Row className='mb-5'><Col>
                    <Card><Card.Body>
                    {avisos.map((aviso) => {
                        return <div>
                                {aviso[3] === 0 ?
                                    <div>
                                        {aviso[2] !== null ?
                                            <Card.Title>{aviso[2]}</Card.Title>:
                                            <Card.Title>Sin Título</Card.Title>
                                        }
                                    <Card.Text className='mb-3' >{aviso[0]}</Card.Text>
                                    </div> :<></>
                                }
                            </div>
                    })}
                    </Card.Body></Card>
                </Col></Row>

                <Row className='mb-2'><Col><h5 style={{color: "#EA7600"}}>Todos los Avisos:</h5></Col></Row>
                <Row className='mb-5'><Col>
                    {avisos.map((aviso) => {
                        return <Card className='mb-4'>
                            <Card.Body key={aviso.id}>
                                {aviso[2] !== null ?
                                    <Card.Title>{aviso[2]}</Card.Title>:
                                    <Card.Title>Sin Título</Card.Title>
                                }
                                <Card.Text>{aviso[0]}</Card.Text>
                                <Row>
                                    <Col sm={10}>{aviso[3] !== 0 ?
                                            <Card.Text>Estado: Inactivo</Card.Text>:
                                            <Card.Text>Estado: Activo</Card.Text>}
                                    </Col>
                                    <Col style={{textAlign: 'right'}} sm={1}>
                                        <Button onClick={() => {abrirModalModificarAviso(aviso)}} variant="outline-warning" size="sm">Modificar</Button>
                                    </Col>
                                    <Col style={{textAlign: 'right'}} sm={1}>
                                        <Button onClick={() => confirmarEliminarAviso(aviso)} variant="danger" size="sm">Eliminar</Button>
                                    </Col>
                                </Row>
                                
                            </Card.Body>
                        </Card>
                    })}                
                </Col></Row>
                <ModalCrearAviso show={modalCrearAviso} onHide={() => setModalCrearAviso(false)}/>
                <ModalModificarAviso show={modalModificarAviso} aviso={avisoActual} onHide={() => setModalModificarAviso(false)}/>
            </Container>
        </Container>
    );}
    else {
        return(
            <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <Row>
                    <Col></Col>
                    <Col className="loading">
                        <Button variant="primary" disabled>
                            <span>Cargando avisos... </span> 
                            <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
            </Container>
        );
    }
}

export default Avisos;