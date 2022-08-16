// import { Button } from 'bootstrap';
import React, { useEffect, useState } from 'react'
import { Container,Row, Col, Button, Modal, InputGroup, ListGroup, FloatingLabel, Form, FormControl, Table,Spinner } from 'react-bootstrap';
import '../c_styles/UnidadAcademica.css';
import '../c_styles/MantenedorSalas.css'
import axios from "axios";
import _ from "lodash";
import Paginacion from '../components/Paginacion';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');

const serverUrl = process.env.REACT_APP_SERVER;

function ModalCrearSala(props) {
    const [cod_sala, setCodSala] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("");
    const [capacidad, setCapacidad] = useState();
    // const [id_lugar, setIdLugar] = useState();
    const [cod_unidad, setCodUnidad] = useState();
    const [ancho, setAncho] = useState();
    const [largo, setLargo] = useState();
    const [aforo, setAforo] = useState();
    const [nuevaCaracteristica, setNuevaCaracteristica] = useState("");
    const [listaCaracteristicas, setListaCaracteristicas] = useState([]);

    useEffect(() => {
        setListaCaracteristicas([]);
    }, []);

    const crearSala = async () => {
        var caracteristicasString = "";
        for(var i = 0; i < listaCaracteristicas.length; i++){
            if(i === 0){
                caracteristicasString = listaCaracteristicas[i];    
            }
            else{
                caracteristicasString = caracteristicasString + ";" + listaCaracteristicas[i];
            }
        }
        await axios({
            method: 'post',
            url: serverUrl + "/createSala",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: {
                cod_sala: cod_sala,
                descripcion: descripcion,
                tipo: tipo,
                capacidad: capacidad,
                // id_lugar: id_lugar,
                cod_unidad: cod_unidad,
                ancho: ancho,
                largo: largo,
                aforo: aforo,
                caracteristicas : caracteristicasString
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

    const confirmarCrearSala = () => {
        swal({
            title: "Crear Sala",
            text: "¿Está seguro que desea crear una nueva sala?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"La Sala ha sido creado exitosamente!",
                      icon: "success", timer: "4000"});
                      crearSala();
            }
        });
    };

    const agregarCaracteristica = () => {
        setListaCaracteristicas(listaCaracteristicas.concat(nuevaCaracteristica))
        setNuevaCaracteristica("");
    } 

    const cerrarModal = (props) => {
        setNuevaCaracteristica("");
        setListaCaracteristicas([]);
        props.onHide();
    }

    const quitarCaracteristica = (event, caracteristica) => {
        if(event.target.checked){
            console.log("hacer nada");
        }
        else{
            setListaCaracteristicas(listaCaracteristicas.filter(item => item !== caracteristica));
        }
    }

    return (
        <Modal {...props} dialogClassName='modal-80w' centered>

            <Modal.Header closeButton>
                <Modal.Title>Crear Nueva Sala</Modal.Title>
            </Modal.Header>
            <Modal.Body className='scroll_bar_caracteristicas'>
                <FloatingLabel label="Código de sala" className="mb-3" name ="cod_sala" >
                    <Form.Control type="text" onChange={(event) => {setCodSala(event.target.value)}}/>
                </FloatingLabel>
                <FloatingLabel label="Descripción" className="mb-3"  name ="descripcion" >
                    <Form.Control type="text" onChange={(event) => {setDescripcion(event.target.value)}}/>
                </FloatingLabel>
                <Row>
                    <Col>
                    <FloatingLabel label="Capacidad" className="mb-3"  name ="capacidad">
                        <Form.Control type="number" onChange={(event)=>{setCapacidad(event.target.value)}}/>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel className="mb-3" label="Tipo" name ="tipo">
                        <Form.Select aria-label="Floating label select example" onChange={(event)=>{setTipo(event.target.value)}}>
                            <option value="">-- Seleccionar --</option>
                            <option value={41}>SALA</option>
                            <option value={43}>LABORATORIO</option>
                            <option value={44}>BIBLIOTECA</option>
                            <option value={82}>PISCINA</option>
                            <option value={2}>CONFERENCIA</option>
                        </Form.Select>
                    </FloatingLabel>
                    </Col>
                </Row>
                {/* <FloatingLabel label="ID Sector" className="mb-3"  name ="id_lugar">
                    <Form.Control type="text" onChange={(event)=>{setIdLugar(event.target.value)}}/>
                </FloatingLabel> */}
                <FloatingLabel label="Codigo Unidad" className="mb-3"  name ="cod_unidad">
                    <Form.Control type="text" onChange={(event)=>{setCodUnidad(event.target.value)}}/>
                </FloatingLabel>
                <Row>
                    <Col>
                    <FloatingLabel label="Ancho (m)" className="mb-3"  name ="ancho">
                        <Form.Control type="number" onChange={(event)=>{setAncho(event.target.value)}}/>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel label="Largo (m)" className="mb-3"  name ="largo">
                        <Form.Control type="number" onChange={(event)=>{setLargo(event.target.value)}}/>
                    </FloatingLabel>
                    </Col>
                </Row>
                <FloatingLabel label="Aforo" className="mb-3"  name ="aforo">
                    <Form.Control type="number" onChange={(event)=>{setAforo(event.target.value)}}/>
                </FloatingLabel>

                <Row>
                    <Col className='my-2 text-center' sm={2} >Fotos</Col>
                    <Col sm={10}>
                        <Form.Group className="mb-3">
                            <Form.Control type="file" multiple/>
                        </Form.Group>
                    </Col>
                </Row>

                <InputGroup className="mb-1">
                    <Form.Control defaultValue="" onChange={(event) => {setNuevaCaracteristica(event.target.value)}} type="text" placeholder="Características de la sala"/>
                    <Button onClick={agregarCaracteristica} variant="outline-secondary" id="button-addon2">Agregar</Button>
                </InputGroup>
                
                <div className='p-3'>
                {listaCaracteristicas.map((caracteristica, indexC) => {
                    return <Form.Check onChange={(event) => {quitarCaracteristica(event, caracteristica)}} defaultChecked={true} type="checkbox" label={caracteristica}/>
                })}
                </div>
               
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>confirmarCrearSala()}>Crear Sala</Button>
                <Button variant="outline-danger" onClick={() => {cerrarModal(props)}}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

function ModalModificarSala(props) {
    const [nuevo_cod_sala, setNuevoCodSala] = useState("");
    const [nuevo_descripcion, setNuevoDescripcion] = useState("");
    const [nuevo_tipo, setNuevoTipo] = useState("");
    const [nuevo_capacidad, setNuevoCapacidad] = useState();
    // const [nuevo_id_lugar, setNuevoIdLugar] = useState();
    const [nuevo_cod_unidad, setNuevoCodUnidad] = useState();
    const [nuevo_ancho, setNuevoAncho] = useState();
    const [nuevo_largo, setNuevoLargo] = useState();
    const [nuevo_aforo, setNuevoAforo] = useState();
    const [nuevaCaracteristica, setNuevaCaracteristica] = useState([]);
    const [cara, setCara] = useState();

    useEffect(() => {
        setNuevoCodSala(props.sala[0]);
        setNuevoDescripcion(props.sala[2]);
        setNuevoTipo(props.sala[6]);
        setNuevoCapacidad(props.sala[1]);
        setNuevoCodUnidad(props.sala[8]);
        setNuevoAncho(props.sala[4]);
        setNuevoLargo(props.sala[3]);
        setNuevoAforo(props.sala[5]);
        setNuevaCaracteristica([]);
    }, [props])

    const modificarSala = async () => {
        await axios({
            method: 'put',
            url: serverUrl + "/updateSala",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: {
                cod_sala: nuevo_cod_sala,
                descripcion: nuevo_descripcion,
                tipo: nuevo_tipo,
                capacidad: nuevo_capacidad,
                cod_unidad: nuevo_cod_unidad,
                ancho: nuevo_ancho,
                largo: nuevo_largo,
                aforo: nuevo_aforo
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

    const confirmarModificarSala = () => {
        swal({
            title: "Crear Sala",
            text: "¿Está seguro que desea modificar esta sala?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"La Sala ha sido modificada exitosamente!",
                      icon: "success", timer: "4000"});
                      modificarSala();
            }
        });
    };

    const cerrarModal = (props) => {
        setCara('');
        props.onHide();
    }

    const showModal = (props) => {
        // axios.get(serverUrl+'/getCaracteristicasByCodSala', {params:{cod_sala: props.sala[0]}})
        // .then(response=>{
        // setCara(response.data)
        // console.log(cara);
        // }).catch (error=> {
        // })
    }

    return (
        <Modal {...props} dialogClassName='modal-80w' onShow={showModal(props)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Modificar Sala</Modal.Title>
            </Modal.Header>
            <Modal.Body className='scroll_bar_caracteristicas'>
                <FloatingLabel label="Código de sala" className="mb-3" name ="cod_sala" >
                    <Form.Control type="text" defaultValue={props.sala[0]} onChange={(event) => {setNuevoCodSala(event.target.value)}}/>
                </FloatingLabel>
                <FloatingLabel label="Descripción" className="mb-3"  name ="descripcion" >
                    <Form.Control defaultValue={props.sala[2]} type="text" onChange={(event) => {setNuevoDescripcion(event.target.value)}}/>
                </FloatingLabel>
                <Row>
                    <Col>
                    <FloatingLabel label="Capacidad" className="mb-3"  name ="capacidad">
                        <Form.Control defaultValue={props.sala[1]} type="number" onChange={(event)=>{setNuevoCapacidad(event.target.value)}}/>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel className="mb-3" label="Tipo" name ="tipo">
                        <Form.Select aria-label="Floating label select example" onChange={(event)=>{setNuevoTipo(event.target.value)}}>
                            <option value={props.sala[12]}>- {props.sala[22]} -</option>
                            <option value={41}>SALA</option>
                            <option value={43}>LABORATORIO</option>
                            <option value={44}>BIBLIOTECA</option>
                            <option value={82}>PISCINA</option>
                            <option value={2}>CONFERENCIA</option>
                        </Form.Select>
                    </FloatingLabel>
                    </Col>
                </Row>
                <FloatingLabel label="Codigo Unidad" className="mb-3"  name ="cod_unidad">
                    <Form.Control defaultValue={props.sala[8]} type="number" onChange={(event)=>{setNuevoCodUnidad(event.target.value)}}/>
                </FloatingLabel>
                <Row>
                    <Col>
                    <FloatingLabel label="Ancho (m)" className="mb-3"  name ="ancho">
                        <Form.Control defaultValue={props.sala[4]} type="number" onChange={(event)=>{setNuevoAncho(event.target.value)}}/>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel label="Largo (m)" className="mb-3"  name ="largo">
                        <Form.Control defaultValue={props.sala[3]} type="number" onChange={(event)=>{setNuevoLargo(event.target.value)}}/>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel label="Metros2 (m2)" className="mb-3">
                        <Form.Control defaultValue={props.sala[17]} readOnly/>
                    </FloatingLabel>
                    </Col>
                </Row>
                <FloatingLabel label="Aforo" className="mb-3"  name ="aforo">
                    <Form.Control defaultValue={props.sala[5]} type="number" onChange={(event)=>{setNuevoAforo(event.target.value)}}/>
                </FloatingLabel>

                <Row>
                    <Col className='my-2 text-center' sm={2} >Fotos</Col>
                    <Col sm={10}>
                        <Form.Group className="mb-3">
                            <Form.Control type="file" multiple/>
                        </Form.Group>
                    </Col>
                </Row>

                <InputGroup className="mb-1">
                    <Form.Control onChange={(event) => {setNuevaCaracteristica(event.target.value)}} defaultValue="" type="text" placeholder="Características de la sala"/>
                    <Button onClick={() => {props.agregarCa(nuevaCaracteristica)}} variant="outline-secondary" id="button-addon2">Agregar</Button>
                </InputGroup>

                <div className='p-3'>
                {props.listaCaracteristicas.map((caracteristica, indexC) => {
                    return <Form.Check onChange={(event) => {props.quitarCa(event, caracteristica)}} defaultChecked={true} type="checkbox" label={caracteristica}/>
                })}
                </div>

                {cara}

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={confirmarModificarSala} >Modificar Sala</Button>
                <Button variant="outline-danger" onClick={() => {cerrarModal(props)}}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}




function MantenedorSalas() {   
    const [isLoading, setLoading] = useState(false);
    const [listaSalas, setListaSalas] = useState([]);
    const [listaSalasPag, setListaSalasPag] = useState([]);
    const [numSalasPag, setNumSalasPag] = useState([]);
    const [modalModificar, setModalModificar] = useState(false);
    const [salaActual, setSalaActual] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [modalCrear, setModalCrear] = useState(false);
    const [listaCaracteristicas, setListaCaracteristicas] = useState([]);
    const [unidadesUsuario, setUnidadesUsuario] = useState([]);
    const [numeroSalaFiltro, setNumeroSalaFiltro] = useState("");
    const [unidadFiltro, setUnidadFiltro] = useState(-1);
    const [capacidadFiltro, setCapacidadFiltro] = useState("");
    const [ordenFiltro, setOrdenFiltro] = useState("");
    const [metrosFiltro, setMetrosFiltro] = useState("");

    const salasGet = async (event) =>{
        // axios.get(serverUrl+'/getsalas', )
        axios.get(serverUrl+'/getAllSalasByIdUsuario',{params:{id_usuario: id_usuario_actual}} )
            .then(response=>{
            setListaSalas(response.data);
            setListaSalasPag(_(response.data).slice(0).take(pageSize).value());
            setNumSalasPag(response.data);
            setLoading(true);
            // console.log(response.data);
        }).catch (error=> {
            setListaSalas([]);
            alert(error.response.data.message);
            console.log(error);
        })
    };
    const getUnidadesUser = async () => {
        await axios.get(serverUrl + "/getUnidadesMenores", {params:{id_usuario: id_usuario_actual}})
        .then(response=>{
            setUnidadesUsuario(response.data)
            console.log(unidadesUsuario)
        })
        .catch(error=>{
            alert(error.response.data.message);
        })
    };

    useEffect(() => {
        salasGet();
        getUnidadesUser();
    }, []);

    useEffect(() => {
        if (unidadFiltro || numeroSalaFiltro || capacidadFiltro || ordenFiltro || metrosFiltro){
            filtroGeneral();
        }
    }, [unidadFiltro, numeroSalaFiltro, capacidadFiltro, ordenFiltro, metrosFiltro])

    const pagination=(pageNo)=>{
        // console.log("pag"+pageNo);
        const startIndex=(pageNo-1)*pageSize;
        const listaSalasPag = _(numSalasPag).slice(startIndex).take(pageSize).value();
        setListaSalasPag(listaSalasPag);
    };
    const trigger=(pageIdx)=>{
        pagination(pageIdx);
    }

    const deleteSala = async (cod_sala) =>{
        await axios.delete(serverUrl+"/deleteSala", {params:{cod_sala}}).then(response=>{
            salasGet();
        });
        
    }

    const mostrarAlertaBorrar=(cod_sala)=>{
        swal({
            title: "Quitar Sala",
            text: "¿Esta seguro que desea borrar la sala? \n Código sala: "+cod_sala,
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"La sala ha sido borrado con exito",
                      icon: "success", timer: "2000"})
                      deleteSala(cod_sala)
                      setLoading(false);
                      setCurrentPage(1);  
            }
        });
    }

    const abrirModalEditar = (sala) => {
        console.log(sala);
        setSalaActual(sala);
        setModalModificar(true);
    }

    const quitarCaracteristica = (event, caracteristica) => {
        if(event.target.checked){
            console.log("hacer nada");
        }
        else{
            setListaCaracteristicas(listaCaracteristicas.filter(item => item !== caracteristica));
        }
    }

    const agregarCaracteristica = (nuevaCaracteristica) => {
        setListaCaracteristicas(listaCaracteristicas.concat(nuevaCaracteristica))
    } 

    const capacidad = (a, b) => {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] > b[1]) ? -1 : 1;
        }
    }

    const metros = (a, b) => {
        if (a[17] === b[17]) {
            return 0;
        }
        else {
            return (a[17] > b[17]) ? -1 : 1;
        }
    }

    const filtroGeneral = () => {
        console.log(unidadFiltro);
        console.log(numeroSalaFiltro);
        console.log(capacidadFiltro);
        console.log(ordenFiltro);
        let results = [];
        if (String(unidadFiltro) === "-1"){results = listaSalas;}
        else{
            for(let i = 0 ; i<listaSalas.length ; i++){
                if(String(listaSalas[i][8]) === String(unidadFiltro)){
                    results.push(listaSalas[i]);
                }
            }
        }
        let results2 = [];
        if (numeroSalaFiltro !== '') {
            for(let i = 0 ; i<results.length ; i++){
                if(results[i][0].toLowerCase().startsWith(numeroSalaFiltro.toLowerCase())){
                    results2.push(results[i]);
                }
            }
        }
        else {
            results2 = results; 
        }
        let results3 = [];
        if (capacidadFiltro !== ""){
            for(let i = 0 ; i<results2.length ; i++){
                if(parseInt(results2[i][1]) <= capacidadFiltro){
                    results3.push(results2[i]);
                }
                results3.sort(capacidad);
            }
        }
        else{
            results3 = results2;
        }
        let results4 = [];
        if (metrosFiltro !== ""){
            for(let i = 0 ; i<results3.length ; i++){
                if(parseInt(results3[i][17]) <= metrosFiltro){
                    results4.push(results3[i]);
                }
                results4.sort(metros);
            }
        }
        else {
            results4 = results3;
        }
        if (parseInt(ordenFiltro) === 1){
            results4.sort(capacidad);
        }
        else if (parseInt(ordenFiltro) === 2){
            results4.sort(metros);
        }

        setListaSalasPag(_(results3).slice(0).take(pageSize).value());
        setNumSalasPag(results3);
    }      

    if (isLoading){
    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <Row>
                    <Col md={3} >
                        <h4>Mantenedor Salas</h4>
                    </Col>
                    <Col md={9}>
                        <Button size='sm' variant="primary" onClick={()=> setModalCrear(true)}>Registrar nueva sala</Button>
                    </Col>
                </Row>
                <Row className='p-3'>
                    <Col sm={3}>
                        <Form.Label>Código Sala:</Form.Label>
                        <FormControl placeholder="Buscador # sala" value={numeroSalaFiltro} onChange={(event) => {setNumeroSalaFiltro(event.target.value)}}/>
                    </Col>
                    <Col sm={4}>
                        <Form.Label>Unidad:</Form.Label>
                        <Form.Select onChange={(event) => setUnidadFiltro(event.target.value)}>
                            <option value={-1}>Todas las Unidades</option>
                            {unidadesUsuario.map((unidad) => {
                                return (
                                    <option value={unidad[1]} key={unidad.id}>{unidad[1]+"-"+unidad[0]}</option>
                                )
                            })}
                        </Form.Select>
                    </Col>
                    <Col sm={3}>
                        <Form.Label>Capacidad:</Form.Label>
                        <FormControl type='number' placeholder="Menor o igual que" value={capacidadFiltro} onChange={(event) => {setCapacidadFiltro(event.target.value)}}/>
                    </Col>
                </Row>
                <Row className="p-3">
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Código Sala</th>
                            <th>Descripción</th>
                            <th>Capacidad</th>
                            <th>Aforo</th> 
                            {/* <th>Superficie m2</th>  */}
                            <th>Unidad</th>
                            <th>Opción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaSalasPag.map((sala, indexS) => {
                            return <tr className='p-2' key={sala["sala "+ sala[0]]}>
                                <td className='p-2' key={"cod"+sala[0]}>{sala[0]}</td>
                                <td className='p-2' key={"desc"+sala[0]}>{sala[2]}</td>
                                <td className='p-2' key={"cap"+sala[0]}>{sala[1]}</td>
                                <td className='p-2' key={"m2"+sala[0]}>{sala[5]}</td>
                                {/* <td className='p-2' key={"aforo"+sala[0]}>{sala[17]}</td> */}
                                <td className='p-2' key={"cod_uni"+sala[0]}>{"["+sala[8]+"] "+sala[21]}</td>
                                <td className="text-center p-2" key={"option"+sala[0]}>
                                    <Button onClick={() => abrirModalEditar(sala)} size='sm' variant="primary" >Ver más</Button>{' '}
                                    <Button size='sm' variant="danger" onClick={() => mostrarAlertaBorrar(sala[0])}>Eliminar</Button>
                                </td>
                            </tr>
                        }
                        )}
                    </tbody>
                </Table>
                    
                </Row>
                <ModalCrearSala show={modalCrear} onHide={() => setModalCrear(false)}/>
                <ModalModificarSala agregarCa={agregarCaracteristica} quitarCa={quitarCaracteristica} listaCaracteristicas={listaCaracteristicas} show={modalModificar} sala={salaActual} onHide={() => setModalModificar(false)}/>
                <Paginacion
                    itemsCount={numSalasPag.length}
                    itemsPerPage={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    alwaysShown={false}
                    trigger={trigger}
                    />
                    
                
            </Container>
                
        </Container>
    );
}else{
    return(
        <Container className="fondoUnidadAcademica" fluid>
        <Container className="UnidadAcademica" fluid>
      <Container className='loading'>
          <Row>
              <Col></Col>
              <Col>
                  <Button variant="primary" disabled>
                      <span>Cargando Salas </span> 
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
      </Container>
  )
   }
}
export default MantenedorSalas;