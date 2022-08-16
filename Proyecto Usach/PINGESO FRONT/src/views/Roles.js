import React, { useEffect, useState } from 'react'
import { Container, Table, Row, Col, Button, Modal, Form, Spinner } from 'react-bootstrap';
import '../c_styles/UnidadAcademica.css';
import swal from 'sweetalert';
import axios from "axios";
const serverUrl = process.env.REACT_APP_SERVER;

function ModalModificarRol(props){
    const [nuevoNombreRol, setNuevoNombreRol] = useState("");
    const [nuevaListaFuncionalidades, setNuevaListaFuncionalidades] = useState([]);

    useEffect(() => {
        setNuevoNombreRol(props.rol[1]);
        setNuevaListaFuncionalidades(props.rol[2]);
    }, [props]);

    const agregarQuitarMod = (event, funcionalidad) => {
        if (event.target.checked) {
            setNuevaListaFuncionalidades(nuevaListaFuncionalidades.concat([funcionalidad[0]]));
        }
        else {
            setNuevaListaFuncionalidades(nuevaListaFuncionalidades.filter(item => item !== funcionalidad[0]));
        }
    }

    const modificarRol = async (props) => {
        var funci = "";
        for(var i = 0; i < nuevaListaFuncionalidades.length; i++){
            if(i === 0){
                funci = nuevaListaFuncionalidades[i];    
            }
            else{
                funci = funci + ";" + nuevaListaFuncionalidades[i];
            }
        }
        console.log("funci");
        console.log(funci);
        console.log(nuevoNombreRol);
        await axios({
            method: 'put',
            url: serverUrl + "/updateRol",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: {
                id: props.rol[0],
                nombre: nuevoNombreRol,
                funcionalidades: funci
            }
          }).then(response=>{
            console.log("fin update rol");
            console.log(response.data);
            window.location.reload(false);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const confirmarModificarRol = (props) => {
        swal({
            title: "Modificar Rol",
            text: "¿Está seguro que desea modificar este rol?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El rol ha sido modificado exitosamente!",
                      icon: "success", timer: "4000"});
                      modificarRol(props);
            }
        });
    };

    return(
        <Modal {...props} centered>
            <Modal.Header>
                <Modal.Title>Modificar Rol</Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-3'>            
                <Form.Group className="mb-3">
                    <Form.Label>Nombre del Rol</Form.Label>
                    <Form.Control onChange={(event) => {setNuevoNombreRol(event.target.value)}} defaultValue={props.rol[1]} type="text"/>                    
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Permisos</Form.Label>
                    {props.funcionalidades.map((funcionalidad) => {
                        return (<>{props.rol[2].includes(funcionalidad[0]) ?
                            <Form.Check defaultChecked={true} onChange={(event) => {agregarQuitarMod(event, funcionalidad)}} type="checkbox" key={funcionalidad.id} label={funcionalidad[1]}/>
                            :<Form.Check  type="checkbox" onChange={(event) => {agregarQuitarMod(event, funcionalidad)}} key={funcionalidad.id} label={funcionalidad[1]}/>}</>)
                     })}

                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {confirmarModificarRol(props)}}>Modificar Rol</Button>
                <Button variant="outline-danger" onClick={props.onHide} >Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

function ModalCrearRol(props){
    const [nuevoNombreRol, setNuevoNombreRol] = useState("");
    const [nuevaListaFuncionalidades, setNuevaListaFuncionalidades] = useState([]);

    const agregarQuitar = (event, funcionalidad) => {
        if (event.target.checked) {
            setNuevaListaFuncionalidades(nuevaListaFuncionalidades.concat([funcionalidad]));
        }
        else {
            setNuevaListaFuncionalidades(nuevaListaFuncionalidades.filter(item => item !== funcionalidad));
        }
    }

    const cerrarModalCrearRol = () => {
        setNuevoNombreRol("");
        setNuevaListaFuncionalidades([]);
        props.onHide();
    }

    const crearRol = async () => {
        var funci = "";
        for(var i = 0; i < nuevaListaFuncionalidades.length; i++){
            if(i === 0){
                funci = nuevaListaFuncionalidades[i][0];    
            }
            else{
                funci = funci + ";" + nuevaListaFuncionalidades[i][0];
            }
        }
        await axios({
            method: 'post',
            url: serverUrl + "/createRol",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: {
                nombre: nuevoNombreRol,
                funcionalidades: funci
            }
          }).then(response=>{
            console.log(response.data);
            window.location.reload(false);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    }

    const confirmarCrearRol = () => {
        swal({
            title: "Crear Rol",
            text: "¿Está seguro que desea crear este rol?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El rol ha sido creado exitosamente!",
                      icon: "success", timer: "4000"});
                      crearRol();
            }
        });
    };

    return(
        <Modal {...props} centered>
            <Modal.Header>
                <Modal.Title>Crear Nuevo Rol</Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-3'>            
                <Form.Group className="mb-3">
                    <Form.Label>Nombre del Rol</Form.Label>
                    <Form.Control onChange={(event) => {setNuevoNombreRol(event.target.value)}} type="text"/>                    
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Permisos</Form.Label>
                    {props.funcionalidades.map((funcionalidad) => {
                        return (
                            <Form.Check type="checkbox" onChange={(event) => {agregarQuitar(event, funcionalidad)}} label={funcionalidad[1]} key={funcionalidad.id}/>
                        )
                    })}
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={confirmarCrearRol}>Crear Rol</Button>
                <Button variant="outline-danger" onClick={cerrarModalCrearRol} >Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

function Roles() {
    const [cargando1, setCargando1] = useState(false);
    const [cargando2, setCargando2] = useState(false);
    const [modalCrearRol, setModalCrearRol] = useState(false);
    const [modalModificarRol, setModalModificarRol] = useState(false);
    const [funcionalidades, setFuncionalidades] = useState([]);
    const [roles, setRoles] = useState([]);
    const [rolActual, setRolActual] = useState(["", "", []]);

    const getFuncionalidades = async () => {
        axios.get(serverUrl+"/getFuncionalidades")
            .then(response=>{
            setFuncionalidades(response.data);
            console.log(response.data);
            setCargando1(true);
        }).catch (error=> {
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const getRoles = async () => {
        axios.get(serverUrl+"/getRoles")
            .then(response=>{
            setRoles(response.data);
            console.log(response.data);
            setCargando2(true);
        }).catch (error=> {
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const modificarRol = (rol) => {
        setRolActual(rol);
        console.log(rolActual);
        setModalModificarRol(true);
    };

    const eliminarRol = async (rol) => {
        await axios.delete(serverUrl+"/deleteRol", {params:{id: rol[0]}})
        .then(response=>{
            window.location.reload(false);
            console.log(response.data);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const confirmarEliminarRol = (rol) => {
        swal({
            title: "Eliminar rol",
            text: "¿Está seguro que desea eliminar ese rol?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El rol ha sido eliminado exitosamente!",
                      icon: "success", timer: "5000"})
                      eliminarRol(rol);
            }
        });
    };

    useEffect(() => {
        getFuncionalidades();
        getRoles();
    }, []);   

    if (cargando1 && cargando2) {
    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <Row className='mb-3'>
                    <Col md={3}><h3>Gestionar Roles</h3></Col>
                    <Col md={2}><Button variant="primary" onClick={() => setModalCrearRol(true)} >Crear nuevo rol</Button></Col>
                </Row>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nombre Rol</th>
                            <th>Funcionalidades</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((rol) => {
                            return(
                                <><tr key={rol.id}>
                                    <td className='p-2'>{rol[1]}</td>
                                    <td className='p-2'>{rol[2].length+"/"+funcionalidades.length}</td>   
                                    <td className="text-center p-2">
                                        <Button size='sm' variant="primary" onClick={()=>{modificarRol(rol)}}>Ver más</Button>{' '}
                                        <Button size='sm' variant="danger" onClick={()=>{confirmarEliminarRol(rol)}}>Eliminar</Button>
                                    </td>
                                </tr></>
                            );
                        })}
                    </tbody>
                </Table>
                <ModalCrearRol show={modalCrearRol} funcionalidades={funcionalidades} onHide={() => setModalCrearRol(false)} />
                <ModalModificarRol rol={rolActual} show={modalModificarRol} funcionalidades={funcionalidades} onHide={() => setModalModificarRol(false)}/>
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
                            <span>Cargando roles... </span> 
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

export default Roles;