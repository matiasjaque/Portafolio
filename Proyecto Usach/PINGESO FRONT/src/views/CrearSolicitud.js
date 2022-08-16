import React, { useEffect, useState } from 'react';
import { Col, Row, ListGroup, Form, FormControl, Button, Container, Spinner, Accordion, Table, Modal, FloatingLabel} from 'react-bootstrap';
import '../c_styles/UnidadAcademica.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';
import axios from 'axios';
import _ from "lodash";
import Paginacion from '../components/Paginacion';
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
const serverUrl = process.env.REACT_APP_SERVER;
const weekdays = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];

function ModalSolicitud(props) {
    const [cod_asig, setCodAsignatura] = useState(props.codAsignatura);
    const [nombre_asig, setNombreAsig] = useState(props.nombreAsignatura);
    const [seccion, setSeccion] = useState(props.seccion);
    const [cupo, setCupo] = useState(props.cupo);
    // const [nuevo_id_lugar, setNuevoIdLugar] = useState();
    const [dia, setDia] = useState(props.dia);
    const [modulo, setModulo] = useState(props.mod);
    const [sector, setSector] = useState("");
    const [tipoAula, setTipoAula] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [primerPiso, setPrimerPiso] = useState("no");
    const [periodo, setPeriodo] = useState(props.periodo);
  
  
    useEffect(() => {
  
        setCodAsignatura(props.codAsignatura);
        setNombreAsig(props.nombreAsignatura);
        setSeccion(props.seccion);
        setCupo(props.cupo);
        setDia(props.dia);
        setModulo(props.mod);
        setPeriodo(props.periodo);
  
    }, [props])
    
    const obs = (value) => {
      console.log(value);
      setObservaciones(value);
    }
    const confirmarSolicitud = (props) => {
        swal({
            title: "Realizar Solicitud",
            text: "¿Está seguro que desea añadir esta solicitud?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"La solicitud ha sido añadida exitosamente!",
                      icon: "success", timer: "4000"});
                      solicitud_();
                      cerrarModal(props);
                      
            }
        });
    };
  
    const solicitud_ = () => {
      props.setSolicitudes(props.solicitudes.concat([[cod_asig,seccion,dia,modulo,periodo,sector,primerPiso,tipoAula,observaciones]]));
     
      
    }
  
  
    const cerrarModal = (props) => {
        props.onHide();
    }
  
  
    return (
        <Modal {...props} dialogClassName='modal-lg'  centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body className='scroll_bar_caracteristicas'>
              <Row>
                <Col>
                <FloatingLabel label="Código de asignatura" className="mb-3" name ="cod_asig" >
                    <Form.Control type="text" defaultValue={props.codAsignatura}  readOnly/>
                </FloatingLabel>
                </Col>
                <Col>
                <FloatingLabel label="Sección" className="mb-3"  name ="seccion">
                        <Form.Control defaultValue={props.seccion} type="text"  readOnly/>
                    </FloatingLabel>
                </Col>
              </Row>
               
                <FloatingLabel label="Nombre Asignatura" className="mb-3"  name ="asig_name" >
                    <Form.Control defaultValue={props.nombreAsignatura} type="text"  readOnly/>
                </FloatingLabel>
                <Row>
                  
                    <Col>
                    <FloatingLabel label="Cupo" className="mb-3"  name ="cupo">
                        <Form.Control defaultValue={props.cupo} type="number"  readOnly/>
                    </FloatingLabel>
                    
                    </Col>
                    <Col>
                    <FloatingLabel className="mb-3" label="Dia" name ="dia">
                        <Form.Select aria-label="Floating label select example"  disabled>
                            <option value={props.dia}>{props.weekdays[props.dia-1]}</option>
                        </Form.Select>
                    </FloatingLabel>
                    </Col>
                    
                </Row>
                <Col>
                    <FloatingLabel className="mb-3" label="[Módulo] Horario" name ="modulo">
                        <Form.Select aria-label="Floating label select example"  disabled>
                            <option value={props.mod}>{"["}{props.mod} {"]"} </option>
                        </Form.Select>
                    </FloatingLabel>
                    </Col>
                <Row>
                  <Col>
                  <FloatingLabel label="Sector de Preferencia" className="mb-3"  name ="sector">
                    <Form.Select onChange={(event)=>{setSector(event.target.value)}}>
                            <option value={""}>- Seleccionar -</option>
                            <option value={"SECTOR 2"}>SECTOR 2</option>
                            <option value={"SECTOR 3"}>SECTOR 3</option>
                            <option value={"SECTOR 4"}>SECTOR 4</option>
                            <option value={"SECTOR 5"}>SECTOR 5</option>
                            <option value={"SECTOR 6"}>SECTOR 6</option>
                            <option value={"SECTOR 7"}>SECTOR 7</option>
                            <option value={"SECTOR 8"}>SECTOR 8</option>
                    </Form.Select>
                </FloatingLabel>
                  </Col>
                  <Col>
                  <FloatingLabel className="mb-3" label="Tipo de Sala" name ="tipo">
                          <Form.Select aria-label="Floating label select example" onChange={(event)=>{setTipoAula(event.target.value)}}>
                              <option value="">- Seleccionar -</option>
                              <option value="Aula">Aula</option>
                              <option value="Laboratorio">Laboratorio</option>
                              <option value="Auditorio">Auditorio</option>
                              <option value="Sala de reuniones">Sala de reuniones</option>
                          </Form.Select>
                      </FloatingLabel>
                  
               
                  </Col>
                  <Col>
                  <FloatingLabel className="mb-3" label="Sala Primer Piso" name ="primerPiso">
                          <Form.Select defaultValue={"no"} aria-label="Floating label select example" onChange={(event)=>{setPrimerPiso(event.target.value)}}>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                              
                          </Form.Select>
                      </FloatingLabel>
                  
               
                  </Col>
                </Row>
                
                <FloatingLabel label="Observaciones" className="mb-3"  name ="observaciones">
                    <Form.Control  as="textarea" rows={3} onChange={(event)=>{obs(event.target.value)}}/>
                </FloatingLabel>
  
  
            </Modal.Body>
            <Modal.Footer>
              
                <Button onClick={() => {confirmarSolicitud(props)}}>Añadir Solicitud</Button>
                <Button variant="outline-danger" onClick={() => {cerrarModal(props)}}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
  }

function ModalVerSolicittudes(props){
    
    const [isLoading, setLoading] = useState(false);
    
  
  
    const cerrarModal = (props) => {
        props.onHide();
    }
  const eliminarSolicitud = (inx) => {
    props.solicitudes.splice(inx,1);
    props.setSolicitudes(props.solicitudes);
    console.log(inx);
    console.log(props.solicitudes);
    props.onHide();

  }

  const confirmarSolicitud = () => {
    if(props.solicitudes.length > 0){
    swal({
        title: "Realizar Solicitud",
        text: "¿Está seguro que desea enviar esta solicitud?",
        icon: "warning",
        buttons: ["Cancelar", "Aceptar"]
    }).then(respuesta=>{
        if(respuesta){
            swal({text:"La solicitud ha sido enviada exitosamente!",
                  icon: "success", timer: "4000"});
                  createPostulation();
                  
                  
        }
    });}

};


  const createPostulation = async () => {
    let solicitudes =  props.solicitudes
    await axios({
        method: 'post',
        url: serverUrl + "/createPostulacion",
        
        params: {
            id_usuario: id_usuario_actual
        },
        data: {solicitudes: solicitudes}
        
      }).then(response=>{
        console.log(response.data);
        props.setSolicitudes([]);
        window.location.replace("/solicitudes");
    })
    .catch(error=>{
        alert(error.response.data.message);
        console.log(error);
    });
};
  
    return (
        <Modal {...props} dialogClassName='modal-90w'  centered>
            <Modal.Header closeButton>
                <Modal.Title>Vista previa solicitudes</Modal.Title>
            </Modal.Header>
            <Modal.Body className='scroll_bar_caracteristicas'>
            <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Código Asignatura</th>
                            <th>Nombre Asignatura</th>
                            <th>Grupo o Sección</th>
                            <th>Cupo</th>
                            <th>Dia</th>
                            <th>Horario</th> 
                            <th>Sector Preferencia</th>
                            <th>Sala Primer Piso</th>
                            <th>Tipo Sala</th>
                            <th>Observación</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.solicitudes.map((solicitud,indexS)=>{
                                return <tr className='p-2' key={solicitud["postulaciones"+solicitud[0]]}>
                                    <td className='p-2' key={"cod_asig"+solicitud[0]}>{solicitud[0]}</td>
                                    <td className='p-2' key={"nombreAsig"+solicitud[0]}> {props.nombreAsig}   </td>
                                    <td className='p-2' key={"seccion"+solicitud[0]}>{solicitud[1]}</td>
                                    <td className='p-2' key={"cupo"+solicitud[0]}> {props.cupo}   </td>
                                    <td className='p-2' key={"dia"+solicitud[0]}>{weekdays[solicitud[2]]}</td>
                                    <td className='p-2' key={"modulo"+solicitud[0]}>{solicitud[3]}</td>
                                    <td className='p-2' key={"sector"+solicitud[0]}>{solicitud[5]}</td>
                                    <td className='p-2' key={"piso"+solicitud[0]}>{solicitud[6]}</td>
                                    <td className='p-2' key={"tipo"+solicitud[0]}>{solicitud[7]}</td>
                                    <td className='p-2' key={"obs"+solicitud[0]}>{solicitud[8]}</td>
                                    
                                    <td className="text-center p-2" key={"option"+solicitud[0]}>
                                        <Button  onClick={()=> {eliminarSolicitud(indexS)}} size='sm' variant="primary" >eliminar</Button>{' '}
                                    </td>
                                </tr>
                            })

                            }
                    </tbody>
                </Table>
  
  
            </Modal.Body>
            <Modal.Footer>
              
                <Button onClick={()=>{confirmarSolicitud()}}>Enviar Solicitudes</Button>
                <Button variant="outline-danger" onClick={() => {cerrarModal(props)}}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
  }




function CrearSolicitud(){
    const [modalModificar, setModalModificar] = useState(false);
    const [modalSolic1, setModalSolic1] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isLoadingA, setLoadingA] = useState(true);
    const [isLoadingSecc, setLoadingSecc] = useState(false);
    const [nombreSec, setNombreSec] = useState("");
    const [nombreAsig, setNombreAsig] = useState("");
    const [nombrePeriodo, setPeriodo] = useState("2022-01");
    const periodosAcademicos = ["2022-01","2021-02","2021-01","2020-02","2020-01"];
    const [secciones, setSecciones] = useState([]);
    const [miUnidades, setMiUnidades] = useState([]);
    const [asignaturas, setAsignatura] = useState([]);
    const [codGrupo, setCodGrupoH] = useState("");
    const [cupoH, setCupo] = useState(0);
    const [tipoH, setTipoH] = useState("");
    const [unidad, setUnidad] = useState();
    const [codAsignatura, setCodAH] = useState();
    const [isActiveIndexD, setIsActiveIndexD] = useState(-1);
    const [isActiveIndexF, setIsActiveIndexF] = useState(-1);
    const [isActiveIndexA, setIsActiveIndexA] = useState(-1);
    const [asignaturaBuscar, setAsignaturaBuscar] = useState(null);
    const [showHorario, setShowHorario] = useState(false);
    const [solicitudes, setSolicitudes] = useState([]);
    const [hByUnidad, setHByUnidad] = useState([]);

    const [dia, setDia] = useState();
    const [modulo, setModulo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [listaPag, setListaPag] = useState([]);
    const toggleShowHorario = () => setShowHorario(p => !p);
    const [codFiltro, setCodFiltro] = useState("");
    const [listaHorarios, setListaHorarios] = useState([]);

    useEffect(() => {
        axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
        .then(response=>{
            setLoading(true);
            setMiUnidades(response.data);
        })
        .catch(error=>{
            alert(error.response.data.message);
            
        });
      }, []);
    
    useEffect(() => {
        if (codFiltro){
            filtroGeneral();
        }
    }, [codFiltro])

    const seleccionarPeriodo = async (event) =>{
        setPeriodo(event.target.value);
        await axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
        .then(response=>{
            setNombreAsig("");
            setNombreSec("");
            
            setMiUnidades(response.data)
        })
        .catch(error=>{
            alert(error.response.data.message);
        });
    };

    const selectUnidad = (cod_unidad) =>{
        if(cod_unidad!=""){
        console.log(cod_unidad);
        setUnidad(cod_unidad);
        getHorariobyUnidad(cod_unidad);
        setLoadingA(false);
        }
    
      };

    const getHorariobyUnidad= async (cod_unidad) =>{
        await axios.get(serverUrl+"/getHorariosByUnidad", {params: {cod_unidad: cod_unidad, periodo: nombrePeriodo}})
        .then(response=>{
            setListaHorarios(response.data);
            setListaPag(_(response.data).slice(0).take(pageSize).value());
            setHByUnidad(response.data);
            setCurrentPage(1);
            setLoadingA(true);
        })
        .catch(error=>{
            alert(error.response.data.message);
            setListaHorarios([]);
            setHByUnidad([]);
            setListaPag([]);
            setLoadingA(true);
        });
        
    
      };

    

    const seccionSelect = async (value, i) => {  
        setNombreSec("");  
        setLoadingSecc(true);
        setIsActiveIndexA(i);
        console.log(nombrePeriodo, value)
        await axios.get(serverUrl+"/getGruposByAsignaturaWithFlag", {params:{periodo: nombrePeriodo, cod_asignatura: value[0]}})
        .then(response=>{
            setNombreSec(value[1]);
            setCodAH(value[0]);
            setSecciones(response.data);
            console.log(secciones)
        })
        .catch(error=>{
            alert(error.response.data.message);
        })  
    };


    const asignaturaRender = (event) =>{        
        setAsignaturaBuscar(event.target.value);
    };

    const añadirSolicitudL= (asig, horario) =>{
        setCodAH(asig[0]);
        setNombreSec(asig[1]);
        setCodGrupoH(horario[0]);
        setCupo(horario[3]);
        setDia(horario[5]);
        setModulo(horario[6])
        setModalSolic1(true);
    }

    const traerAsignaturaBuscada = async () => {
        
        await axios.get(serverUrl+"/getAsignaturasByCod", {params:{periodo: nombrePeriodo, cod_asignatura: asignaturaBuscar, id_usuario: id_usuario_actual}})
        .then(response=>{
            setNombreAsig(response.data[0][2]);
            seccionSelect([response.data[0][0], response.data[0][1]])
            setAsignatura(response.data);
            setIsActiveIndexD(-1);
            setIsActiveIndexF(-1);
            console.log(response.data);
        })
        .catch(error=>{
            setNombreAsig("");
            setNombreSec("");
            setIsActiveIndexD(-1);
            setIsActiveIndexF(-1);
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const abrirModalVerSolicitud = () => {
        setModalModificar(true)
    };

    const pagination=(pageNo)=>{
        // console.log("pag"+pageNo);
        const startIndex=(pageNo-1)*pageSize;
        const listaPag = _(hByUnidad).slice(startIndex).take(pageSize).value();
        
        setListaPag(listaPag);
    };
    const trigger=(pageIdx)=>{
        pagination(pageIdx);
    }

    const filtroGeneral = () => {
        let results = [];
        console.log(codFiltro)
        if (codFiltro !== "" && codFiltro.length>1) {
            results = []; 
            for(let i = 0 ; i<listaHorarios.length ; i++){
                if(String(listaHorarios[i][0]).toLowerCase().startsWith(String(codFiltro).toLowerCase())){
                    results.push(listaHorarios[i]);
                }
            }
        }
        else {
            results = listaHorarios;
        }
        console.log(results);
        setListaPag(_(results).slice(0).take(pageSize).value());
        setHByUnidad(results);
    }  



    if (isLoading){
    return(
        <Container className="fondoUnidadAcademica" fluid>
            
            <ModalSolicitud show={modalSolic1} onHide={() => setModalSolic1(false)}
            codAsignatura = {codAsignatura}
            nombreAsignatura = {nombreSec}
            seccion = {codGrupo}
            cupo = {cupoH}
            dia = {dia}
            weekdays = {weekdays}
            mod = {modulo}
            modHorario = {"modHorario"}
            periodo = {nombrePeriodo}
            solicitudes={solicitudes}
            setSolicitudes={setSolicitudes}
            />
            <ModalVerSolicittudes
            show={modalModificar} onHide={() => setModalModificar(false)}
            solicitudes={solicitudes}
            setSolicitudes={setSolicitudes}
            nombreAsig = {nombreSec}
            cupo = {cupoH}
            />
             
        <Container className="UnidadAcademica" fluid>
            <Row className="header-asg">
                <Row> <Col sm={3} md={3} xl={3}>
                    <h4>Solicitud de Sala</h4>
                </Col></Row>
               <Row>
               <Col sm={8} md={4} xl={4} style={{textAlign: "right"}}>
                              <Form.Select aria-label="Default select example" onChange={(event) => {selectUnidad(event.target.value)}} style={{textAlign: "left"}}>
                                <option value="">Seleccione Unidad</option>
                                  {miUnidades.map(
                                      (facultades, index) => { return(
                                          facultades[2].map(
                                              (departamento,idx)=>{ return <option value={departamento[1]} key={facultades[idx]}> {"["+departamento[1]+"]" + " " + departamento[0]} </option>}
                                          ))

                                  })}
                              </Form.Select>
                </Col>
                <Col sm={8} md={4} xl={4} style={{textAlign: "center"}}>
                    <Row>
                        <Col style={{textAlign: "right"}}>
                            <p>Periodo:</p>
                        </Col>
                        <Col>
                            <Form.Select aria-label="Default select example" onClick={(event) => {seleccionarPeriodo(event)}}>
                                {periodosAcademicos.map(
                                    (periodo, index) => { 
                                        return <option value={periodo} key={periodosAcademicos[index]}> {periodo} </option>
                                })}
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>
                <Col sm={12} md={4} xl={4}>
                    <Row>
                        <Col sm={8}>
                            <FormControl type="number" placeholder="Buscar asignatura por código" onChange={(event) => setCodFiltro(event.target.value)}/>
                        </Col>
                        <Col sm={4}>
                             
                            <Button onClick={()=>{abrirModalVerSolicitud()}}>Ver Solicitudes</Button>
                        </Col>
                    </Row>
                </Col>
               </Row>
            </Row>
            {isLoadingA ? <div className="loader"> 
                {listaPag.length === 0 ? 
                <></>:
                <Row>
                    <Col sm={2}><h6>COD</h6></Col>
                    <Col sm={8}><h6>ASIGNATURA</h6></Col>
                    <Col sm={1}><h6>SECCIONES</h6></Col>
                </Row>}
                {listaPag.map((asignatura) => {
                    return(
                        <Accordion key={asignatura.id} alwaysOpen>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <Col sm={2}>{asignatura[0]}</Col>
                                    <Col sm={8}>{asignatura[1]}</Col>
                                    <Col className='text-center' sm={1}>{asignatura[2].length}</Col>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Table>
                                        <thead><tr>
                                            <th>Grupo</th>
                                            <th>Tipo</th>
                                            <th>Descrip. Grupo</th>
                                            <th>Cup. Grup.</th>
                                            <th>Insc.</th>
                                            <th>Día</th>
                                            <th>Mod</th>
                                            <th>Profesor</th>
                                            <th></th>
                                        </tr></thead>
                                        <tbody>
                                            {asignatura[2].map((seccion) => {
                                                    return (
                                                    <tr className='p-2' key={seccion.id}>
                                                        <td className='p-2'>{seccion[0]}</td>
                                                        <td className='p-2'>{seccion[1]}</td>
                                                        <td className='p-2'>{seccion[2]}</td>
                                                        <td className='p-2'>{seccion[3]}</td>
                                                        <td className='p-2'>{seccion[4]}</td>
                                                        <td className='p-2'>{weekdays[seccion[5]]}</td>
                                                        <td className='p-2'>{seccion[6]}</td>
                                                        <td className='p-2'>{seccion[7]}</td>
                                                        <td className="text-center p-2">
                                                                <Button  size='sm' variant="primary" onClick={()=>{añadirSolicitudL(asignatura, seccion)}} >Añadir</Button>{' '}
                                                        </td>  
                                                    </tr>
                                                    )})}
                                        </tbody>

                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>                            
                    );
                })}

                <Paginacion
                    itemsCount={hByUnidad.length}
                    itemsPerPage={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    alwaysShown={false}
                    trigger={trigger}
                    /></div>
                :
                <Row>
                    <Col></Col>
                    <Col className="loading">
                        <Button variant="primary" disabled>
                            <span>Cargando datos... </span> 
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
        
                }
           

           
                
              
                  
        </Container>
        </Container>
    );
    }
    else{ 
        return(
            <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <Row>
                    <Col></Col>
                    <Col className="loading">
                        <Button variant="primary" disabled>
                            <span>Cargando datos... </span> 
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


export default CrearSolicitud;