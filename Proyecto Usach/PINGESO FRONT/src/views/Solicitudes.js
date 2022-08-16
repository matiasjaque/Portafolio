import React, { useEffect, useState } from 'react'
import { Col, Row, Form, FormControl, Button, Container, Spinner,Table, Modal} from 'react-bootstrap';
import axios from "axios";
import Paginacion from '../components/Paginacion';
import Cookies from 'universal-cookie';
import _ from "lodash";
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
// import '../c_styles/UnidadAcademica.css';

const serverUrl = process.env.REACT_APP_SERVER;

function ModalVerPostulaciones(props){
    
    const [isLoading, setLoading] = useState(false);
  
    const cerrarModal = (props) => {
        props.onHide();
    }

  
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
                            <th>Modulo</th> 
                            <th>Sector Preferencia</th>
                            <th>Sala Primer Piso</th>
                            <th>Tipo Sala</th>
                            <th>Observación</th>
                            <th>Sala</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.verListaPost.map((solicitud,indexS)=>{
                                return <tr className='p-2' key={solicitud.id}>
                                    <td className='p-2' key={solicitud.id}>{solicitud[0]}</td>
                                    <td className='p-2' key={solicitud.id}> {solicitud[1]}   </td>
                                    <td className='p-2' key={solicitud.id}>{solicitud[2]}</td>
                                    <td className='p-2' key={solicitud.id}> {solicitud[4]}  </td>
                                    <td className='p-2' key={solicitud.id}>{solicitud[6]}</td>
                                    <td className='p-2' key={solicitud.id}>{solicitud[7]}</td>
                                    <td className='p-2' key={solicitud.id}>{solicitud[8]}</td>
                                    <td className='p-2' key={solicitud.id}>{solicitud[9]}</td>
                                    <td className='p-2' key={solicitud.id}>{solicitud[11]}</td>
                                    <td className='p-2' key={solicitud.id}>{solicitud[10]}</td>
                                    <td className="text-center p-2" key={solicitud.id}>{solicitud[12]? solicitud[12] : "Sin sala"}</td>
                                </tr>
                                })

                            }
                    </tbody>
                </Table>
  
  
            </Modal.Body>
            <Modal.Footer>
              
                <Button variant="outline-danger" onClick={() => {cerrarModal(props)}}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
  }



function Solicitudes() {
    const [isLoading, setLoading] = useState(true);
    const [listaPostulaciones, setListaPostulaciones] = useState([]);
    const [listaPostulacionesPag, setListaPostulacionesPag] = useState([]);
    const [modalModificar, setModalModificar] = useState(false);
    const [idpost,setIdPost] = useState(0);
    const [verListaPost, setVerListaPost] = useState([]);
    const [numeroPostulacionFiltro, setNumeroPostulacionFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("-");
    const [periodoFiltro, setPeriodoFiltro] = useState("2022-01");
    const periodosAcademicos = ["2022-01","2021-02","2021-01","2020-02","2020-01"];
    const [numPostulacionesPag, setNumPostulacionesPag] = useState([]);
    const [pageSize, setPageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);

 
    const postulacionesGet = async (event) =>{
        axios.get(serverUrl+'/getPostulacionesByUsuario',{params:{id_usuario: id_usuario_actual}} )
            .then(response=>{
            setListaPostulaciones(response.data);
            setListaPostulacionesPag(_(response.data).slice(0).take(pageSize).value());
            setNumPostulacionesPag(response.data);
            setLoading(false);
            // console.log(response.data);
        }).catch (error=> {
            setListaPostulaciones([]);
            setLoading(false);
            //alert(error.response.data.message);
            console.log(error);
        })
    };
    const pagination=(pageNo)=>{
        // console.log("pag"+pageNo);
        const startIndex=(pageNo-1)*pageSize;
        const listaSalasPag = _(numPostulacionesPag).slice(startIndex).take(pageSize).value();
        setListaPostulacionesPag(listaSalasPag);
    };
    const trigger=(pageIdx)=>{
        pagination(pageIdx);
    }

    const filtroGeneral = () => {
        let results = [];
        if (estadoFiltro == "-"){
            results = listaPostulaciones;
        }
        else{
            for(let i=0; i<listaPostulaciones.length; i++){
                if(listaPostulaciones[i][3].toLowerCase() == estadoFiltro.toLowerCase()){
                    results.push(listaPostulaciones[i]);
                }
            }
        }
        let results2 = [];
        if (numeroPostulacionFiltro != "") {
            for(let i = 0 ; i<results.length ; i++){
                if(String(results[i][0]).toLowerCase().startsWith(String(numeroPostulacionFiltro).toLowerCase())){
                    results2.push(results[i]);
                }
            }
        }
        else{
            results2 = results; 
        }
        
        let results3 = [];
        for(let i=0; i<results2.length; i++){
            if(results2[i][6].toLowerCase() == periodoFiltro.toLowerCase()){
                results3.push(listaPostulaciones[i]);
            }
        }
        setListaPostulacionesPag(_(results3).slice(0).take(pageSize).value());
    }

    useEffect(() => {
        postulacionesGet();
    }, []);

    useEffect(() => {
        if (numeroPostulacionFiltro || estadoFiltro || periodoFiltro){
            filtroGeneral();
        }
    }, [numeroPostulacionFiltro, estadoFiltro, periodoFiltro])

    const postulacionesSolGet = async (idpost) =>{
        axios.get(serverUrl+'/getSolicitudesByPostulacion',{params:{postulacion: idpost}} )
            .then(response=>{
                setVerListaPost(response.data);
        }).catch (error=> {
            //setListaPostulaciones([]);
            alert(error.response.data.message);
            console.log(error);
        })
    };

    const verSol = (solicitud)=> {
        console.log(idpost);
        postulacionesSolGet(solicitud);
        setModalModificar(true);
    }

        return (  
            <Container className="fondoUnidadAcademica" fluid>
                <ModalVerPostulaciones
            show={modalModificar} onHide={() => setModalModificar(false)}
            idpost={idpost}
            verListaPost={verListaPost}
            />
                <Container className="UnidadAcademica" fluid>
                    <div className="Example">
                        <header>
                        <Row className="header-asg">
                            <Col sm={12} md={3}>
                                <h3>Estado de Solicitudes</h3>
                            </Col>
                            <Col xl={4}><Row></Row></Col>
                            <Col xl={2} style={{textAlign: "center"}}><Row></Row></Col>
                            <Col xl={2}>
                                <Row>
                                    {isLoading ? <></> : <Button onClick={()=>window.location.replace("/crearSolicitud")}>Añadir Solicitud</Button>}
                                </Row>
                            </Col>
                        </Row>
                        </header>
                        <Row className='mb-3'>
                            <Col sm={3}>
                                <Form.Label>Código Postulación:</Form.Label>
                                <FormControl placeholder="Buscador # postulación" value={numeroPostulacionFiltro} onChange={(event) => {setNumeroPostulacionFiltro(event.target.value)}}/>
                            </Col>
                            <Col sm={2}>
                                <Form.Label>Estado Solicitud:</Form.Label>
                                <Form.Select onChange={(event) => setEstadoFiltro(event.target.value)}>
                                    <option value={"-"}>Todos</option>
                                    <option value={"PENDIENTE"}>Pendiente</option>
                                    <option value={"FINALIZADO"}>Finalizado</option>
                                </Form.Select>
                            </Col>
                            <Col sm={2}>
                                <Form.Label>Periodo:</Form.Label>
                                <Form.Select onChange={(event) => setPeriodoFiltro(event.target.value)}>
                                    {periodosAcademicos.map(
                                            (periodo) => { 
                                                return <option value={periodo} key={periodosAcademicos.id}> {periodo} </option>
                                        })}
                                </Form.Select>
                            </Col>
                        </Row>
                        <div className="Example__container">
                        {isLoading ? 
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
                        : 
                            <div className="Example__container__document">


                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Código Postulacion</th>
                                <th>Usuario</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Asignadas/Totales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaPostulacionesPag.map((postulaciones)=>{
                                return <tr className='p-2' key={postulaciones["postulaciones"+postulaciones[0]]}>
                                    <td className='p-2' key={postulaciones.id}>{postulaciones[0]}</td>
                                    <td className='p-2' key={postulaciones.id}>{postulaciones[1]}</td>
                                    <td className='p-2' key={postulaciones.id}>{postulaciones[2]}</td>
                                    <td className='p-2' key={postulaciones.id}>
                                        {postulaciones[3] === "PENDIENTE"?
                                            <Button size="sm" variant="warning">{postulaciones[3]}</Button>:
                                            <Button size="sm" variant="success">{postulaciones[3]}</Button>
                                        }
                                    </td>
                                    <td className='p-2' key={postulaciones.id}>{postulaciones[4]+"/"+postulaciones[5]}</td>
                                    <td className="text-center p-2" key={postulaciones.id}>
                                        <Button  size='sm' variant="primary" onClick={()=>{verSol(postulaciones[0])}} >Ver Solicitud</Button>{' '}
                                    </td>
                                </tr>
                            })

                            }
                        </tbody>
                    </Table>

                            </div>
                        }
                        
                        </div>
                    </div>
                    <Paginacion
                    itemsCount={numPostulacionesPag.length}
                    itemsPerPage={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    alwaysShown={false}
                    trigger={trigger}
                    />
                </Container>
            </Container>
        );
}

export default Solicitudes;