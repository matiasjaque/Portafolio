// import { Button } from 'bootstrap';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container,Row, Col, Spinner, Button, Modal, FloatingLabel, Form, Table } from 'react-bootstrap';
import Paginacion from '../components/Paginacion';
import '../c_styles/UnidadAcademica.css';
import '../c_styles/Usuarios.css';
import swal from 'sweetalert';
const serverUrl = process.env.REACT_APP_SERVER;

function ModalModificarUsuario(props) {
    const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState("");
    const [nuevoRutUsuario, setNuevoRutUsuario] = useState("");
    const [nuevoCorreosuario, setNuevoCorreosuario] = useState("");
    const [nuevoRolUsuario, setNuevoRolUsuario] = useState("");
    const [nuevoTelefonoUsuario, setNuevoTelefonoUsuario] = useState("");
    const [userRol, setUserRol] = useState("- sin rol -");

    useEffect(() => {
        getUserRol(props.usuario[6]);
        setNuevoNombreUsuario(props.usuario[1]);
        setNuevoRutUsuario(props.usuario[7]);
        setNuevoCorreosuario(props.usuario[3]);
        setNuevoRolUsuario(props.usuario[6]);
        setNuevoTelefonoUsuario(props.usuario[8]);
    }, [props]);

    const modificarUsuario = async (props) => {
        let permisoString = "";
        for(var i = 0; i < props.listaPermisos.length; i++){
            if(i === 0){
                permisoString = props.listaPermisos[i][1].toString();    
            }
            else{
                permisoString = permisoString + ";" + props.listaPermisos[i][1].toString();
            }
        }
        console.log(permisoString);
        console.log(props.usuario);
        await axios({
            method: 'put',
            url: serverUrl + "/updateUsuario",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: {
                nombre: nuevoNombreUsuario, id_usuario: props.usuario[0],
                email: nuevoCorreosuario, rol: nuevoRolUsuario,
                rut: nuevoRutUsuario, telefono: nuevoTelefonoUsuario,
                permisos: permisoString
            }
          }).then(response=>{
            window.location.reload(false);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };
    
    const getUserRol = async (rol_id) => {
        console.log("("+rol_id+")")
        if(rol_id !== ""){
            await axios.get(serverUrl + "/getRolById", {params:{id: rol_id}})
        .then(response=>{
            setUserRol(response.data[0]);
            console.log(response.data[0]);
        })
        .catch(error=>{
            alert(error.response.data.message);
        })
        }
    }

    const confirmarModificarUsuario = (props) => {
        swal({
            title: "Modificar Usuario",
            text: "¿Está seguro que desea modificar los datos de este usuario?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El usuario ha sido modificado exitosamente!",
                      icon: "success", timer: "4000"});
                      modificarUsuario(props);
            }
        });
    }; 
    
    return (
        <Modal {...props} dialogClassName='modal-80w' centered>
            <Modal.Header closeButton>
                <Modal.Title>Modificar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Nombre del usuario" className="mb-3">
                    <Form.Control onChange={(event) => {setNuevoNombreUsuario(event.target.value)}} defaultValue={props.usuario[1]} type="text"/>
                </FloatingLabel>
                <FloatingLabel label="Rut" className="mb-3">
                    <Form.Control onChange={(event) => {setNuevoRutUsuario(event.target.value)}} defaultValue={props.usuario[7]} type="text"/>
                </FloatingLabel>
                <FloatingLabel label="Teléfono" className="mb-3">
                    <Form.Control onChange={(event) => {setNuevoTelefonoUsuario(event.target.value)}} defaultValue={props.usuario[8]} type="text"/>
                </FloatingLabel>
                <FloatingLabel label="Correo" className="mb-3">
                    <Form.Control onChange={(event) => {setNuevoCorreosuario(event.target.value)}} defaultValue={props.usuario[3]} type="email"/>
                </FloatingLabel>
                <FloatingLabel label="Rol del usuario" className="mb-2">
                    <Form.Select onChange={(event) => {setNuevoRolUsuario(event.target.value)}} aria-label="Floating label select example">
                        <option value={userRol[0]}>- {userRol[1]} -</option>
                        {/* {showUserRol(props.usuario[6])} */}
                        {props.roles.map((rol) => {
                            return(
                                <option key={rol.id} value={rol[0]}>{rol[1]}</option>
                            )
                        })}
                    </Form.Select>
                </FloatingLabel>
                <Form.Group className="p-2">
                    <Row>
                        <Col md={2}>
                            <Form.Label>
                                Permisos:
                            </Form.Label>
                        </Col>
                        <Col className="scroll_bar_permisos" md={10}>
                            {props.listaUnidades.map((unidad, indexUn) => {
                                return <div>
                                    {props.listaPermisos.includes(unidad) ? 
                                        <Form.Check defaultChecked={true} onChange={(event) => {props.agregarQuitar(event, unidad)}} type="checkbox" key={unidad.id} label={unidad[1]+" - "+unidad[0]}/>
                                        :<Form.Check onChange={(event) => {props.agregarQuitar(event, unidad)}} type="checkbox" key={unidad.id} label={unidad[1]+" - "+unidad[0]}/>
                                    }
                                </div>
                            })}
                        </Col>
                    </Row>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>{confirmarModificarUsuario(props)}}>Guardar cambios</Button>
                <Button variant="outline-danger" onClick={props.onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
  }

function ModalCrearUsuario(props) {
    const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState("");
    const [nuevoRutUsuario, setNuevoRutUsuario] = useState("");
    const [nuevoCorreosuario, setNuevoCorreosuario] = useState("");
    const [nuevoRolUsuario, setNuevoRolUsuario] = useState("");
    const [nuevoTelefonoUsuario, setNuevoTelefonoUsuario] = useState("");

    const crearUsuario = async () => {
        var permisoString = "";
        for(var i = 0; i < props.listaPermisos.length; i++){
            if(i === 0){
                permisoString = props.listaPermisos[i][1];    
            }
            else{
                permisoString = permisoString + ";" + props.listaPermisos[i][1];
            }
        }
        await axios({
            method: 'post',
            url: serverUrl + "/createUsuario",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: {
                nombre: nuevoNombreUsuario, password: "admin",
                email: nuevoCorreosuario, rol: nuevoRolUsuario,
                rut: nuevoRutUsuario, telefono: nuevoTelefonoUsuario,
                permisos: permisoString
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

    const confirmarCrearUsuario = () => {
        swal({
            title: "Crear Usuario",
            text: "¿Está seguro que desea crear este usuario?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El usuario ha sido creado exitosamente!",
                      icon: "success", timer: "4000"});
                      crearUsuario();
            }
        });
    }; 

    const cerrarModalCrear = () => {
        setNuevoNombreUsuario("");
        setNuevoRutUsuario("");
        setNuevoCorreosuario("");
        setNuevoRolUsuario("");
        setNuevoTelefonoUsuario("");
        props.onHide();
    }

    return (
        <Modal {...props} dialogClassName='modal-80w' centered>
            <Modal.Header>
                <Modal.Title>Crear Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Nombre usuario" className="mb-3">
                    <Form.Control type="text" onChange={(event) => {setNuevoNombreUsuario(event.target.value)}}/>
                </FloatingLabel>
                <FloatingLabel label="Rut" className="mb-3">
                    <Form.Control onChange={(event) => {setNuevoRutUsuario(event.target.value)}} type="text"/>
                </FloatingLabel>
                <FloatingLabel label="Teléfono" className="mb-3">
                    <Form.Control type="number" onChange={(event) => {setNuevoTelefonoUsuario(event.target.value)}}/>
                </FloatingLabel>
                <FloatingLabel label="Correo" className="mb-3">
                    <Form.Control onChange={(event) => {setNuevoCorreosuario(event.target.value)}} type="email"/>
                </FloatingLabel>
                <FloatingLabel label="Rol del usuario" className="mb-2">
                    <Form.Select onChange={(event) => {setNuevoRolUsuario(event.target.value)}} aria-label="Floating label select example">
                        <option value={null}>-- Seleccionar --</option>
                        {props.roles.map((rol) => {
                            return(
                                <option key={rol.id} value={rol[0]}>{rol[1]}</option>
                            )
                        })}
                    </Form.Select>
                </FloatingLabel>
                <Form.Group className="p-2">
                    <Row>
                        <Col md={2}>
                            <Form.Label>
                                Permisos:
                            </Form.Label>
                        </Col>
                        <Col className="scroll_bar_permisos" md={10}>
                            {props.listaUnidades.map((unidad, indexUn) => {
                                return <Form.Check onChange={(event) => {props.agregarQuitar(event, unidad)}} type="checkbox" key={unidad.id} label={unidad[1]+" - "+unidad[0]}/>
                            })}
                            
                        </Col>
                    </Row>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>{confirmarCrearUsuario()}}>Crear usuario</Button>
                <Button variant="outline-danger" onClick={cerrarModalCrear}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}


function Usuarios() {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [modalModificar, setModalModificar] = useState(false);
    const [modalCrear, setModalCrear] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(["","","","","","","","","", []]);
    const [listaUnidades, setListaUnidades] = useState([""]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setLoading] = useState(false);
    const [listaPermisos, setListaPermisos] = useState([]);
    const [roles, setRoles] = useState([]);
    
    function ListarPermisos(permisos){
        let cantidadPermisos = permisos.length;
        return (
            <div>{cantidadPermisos}/{listaUnidades.length}</div>
        )
    } 
    const trigger=(event)=>{
        // aqui va la funcion que llama al slice de la lista de usuarios
    };

    const obtenerUsuarios = async () => {
        axios.get(serverUrl+"/getUsuarios")
        .then(response=>{
            console.log(response.data);
            setListaUsuarios(response.data);
            setLoading(true);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const obtenerListaUnidades = async () => {
        axios.get(serverUrl+"/getAllUnidadesMenores")
        .then(response=>{
            // console.log(response.data);
            setListaUnidades(response.data.rows);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const getRoles = async () => {
        axios.get(serverUrl+"/getRoles")
            .then(response=>{
            setRoles(response.data);
        }).catch (error=> {
            alert(error.response.data.message);
            console.log(error);
        });
    };

    useEffect(() => {
        obtenerUsuarios();
        obtenerListaUnidades();
        getRoles();
    }, []);

    const eliminarUsuario = async (usuario) => {
        await axios.delete(serverUrl+"/deleteUsuario", {params:{id_usuario: usuario[0]}})
        .then(response=>{
            window.location.reload(false);
            console.log(response.data);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const confirmarEliminarUsuario = (usuario) => {
        // console.log(usuario);
        swal({
            title: "Eliminar usuario",
            text: "¿Está seguro que desea eliminar el usuario?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"El usuario ha sido eliminado exitosamente!",
                      icon: "success", timer: "5000"})
                      eliminarUsuario(usuario);
            }
        });
    };

    const modificarUsuario = (usuario) => {
        setUsuarioActual(usuario);
        console.log(usuario);
        console.log(listaUnidades);
        var aux = [];
        for(var i=0; i < listaUnidades.length; i++){
            for(var k=0; k < usuario[9].length; k++){
                if(usuario[9][k][1] === listaUnidades[i][0]){
                    aux.push(listaUnidades[i]) 
                }
            }
        }
        setListaPermisos(aux);
        setModalModificar(true);
    };

    const agregarQuitarPermiso = (event, unidad) => {
        let aux = false;
        if(event !== null) {
            aux = event.target.checked;
        }
        else{
            aux = true;
        }

        if(aux){
            setListaPermisos(listaPermisos.concat([unidad]));
        }
        else{
            console.log(listaPermisos);
            console.log(unidad);
            setListaPermisos(listaPermisos.filter(item => item[1] !== unidad[1]));
        }
    }

    const cerrarModalCrear = () => {
        setModalCrear(false);
        setListaPermisos([]);
    }

    const cerrarModalModificar = () => {
        setModalModificar(false);
        setListaPermisos([]);
    }
    

    if(isLoading){

        return (  
            <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <Row className='mb-2'>
                    <Col md={3}>
                        <h4>Gestionar Usuarios</h4>
                    </Col>
                    <Col md={3}>
                        <Button size='sm' variant="primary" onClick={() => setModalCrear(true)}>Registrar nuevo usuario</Button>
                    </Col>
                </Row>
                <Row className="p-3">
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Rut</th>
                            <th>Correo</th>
                            <th>Rol</th> 
                            <th>Permisos</th>
                            <th>Opción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaUsuarios.map((usuario, indexU) => {
                            return <tr key={usuario.id}>
                                <td className='p-2'>{usuario[1]}</td>
                                <td className='p-2'>{usuario[7]}</td>
                                <td className='p-2'>{usuario[3]}</td>
                                <td className='p-2'>{usuario[11]}</td>
                                <td className='p-2'>
                                    {ListarPermisos(usuario[9])}
                                </td>
                                <td className="text-center p-2">
                                    <Button size='sm' variant="primary" onClick={()=>{modificarUsuario(usuario)}}>Modificar</Button>{' '}
                                    <Button size='sm' variant="danger" onClick={()=>{confirmarEliminarUsuario(usuario)}}>Eliminar</Button>
                                </td>
                            </tr>
                        }
                        )}
                    </tbody>
                    </Table>
                    
                </Row>
                <ModalModificarUsuario
                    show={modalModificar}
                    onHide={cerrarModalModificar}
                    listaUnidades={listaUnidades}
                    usuario={usuarioActual}
                    listaPermisos = {listaPermisos} 
                    agregarQuitar = {agregarQuitarPermiso}
                    roles = {roles}
                />
                <ModalCrearUsuario
                    show={modalCrear}
                    onHide={cerrarModalCrear}
                    listaUnidades={listaUnidades}
                    listaPermisos = {listaPermisos} 
                    agregarQuitar = {agregarQuitarPermiso}
                    roles = {roles}
                />
                <Paginacion
                    itemsCount={listaUsuarios.length}
                    itemsPerPage={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    alwaysShown={false}
                    trigger={trigger}
                    />
            </Container>
        </Container>
    )}
    else {
        return(
            <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <Row>
                    <Col></Col>
                    <Col className="loading">
                        <Button variant="primary" disabled>
                            <span>Cargando usuarios... </span> 
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
        )
    }
}


export default Usuarios;