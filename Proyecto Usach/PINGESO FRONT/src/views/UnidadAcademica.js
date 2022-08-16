import React, { useEffect, useState } from 'react';
import { Col, Row, ListGroup, Form, FormControl, Button, Container, Spinner, Accordion} from 'react-bootstrap';
import Horario from '../components/Horario';
import '../c_styles/UnidadAcademica.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { IndentedTree } from '@ant-design/charts';
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
const serverUrl = process.env.REACT_APP_SERVER;


function UnidadAcademica(){
    const [isLoading, setLoading] = useState(false);
    const [isLoadingAsig, setLoadingAsig] = useState(false);
    const [isLoadingSecc, setLoadingSecc] = useState(false);
    const [nombreSec, setNombreSec] = useState("");
    const [nombreAsig, setNombreAsig] = useState("");
    const [nombrePeriodo, setPeriodo] = useState("- Seleccionar -");
    const [periodosAcademicos,setPeriodos] = useState(["2022-01","2021-02","2021-01","2020-02","2020-01"]);
    const [secciones, setSecciones] = useState([]);
    const [miUnidades, setMiUnidades] = useState([]);
    const [asignaturas, setAsignatura] = useState([]);
    const [codGrupo, setCodGrupoH] = useState("");
    const [tipoH, setTipoH] = useState("");
    const [codAsignatura, setCodAH] = useState();
    const [isActiveIndexD, setIsActiveIndexD] = useState(-1);
    const [isActiveIndexF, setIsActiveIndexF] = useState(-1);
    const [isActiveIndexA, setIsActiveIndexA] = useState(-1);
    const [asignaturaBuscar, setAsignaturaBuscar] = useState(null);
    const [showHorario, setShowHorario] = useState(false);
    
    const toggleShowHorario = () => setShowHorario(p => !p);

    useEffect(() => {
        axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
        .then(response=>{
            setMiUnidades(response.data);
            setLoading(true);
        })
        .catch(error=>{
            alert(error.response.data.message);
        });

        axios.get(serverUrl+"/getPeriodos")
        .then(response=>{
            console.log(response.data);
            setPeriodos(response.data);});

        axios.get(serverUrl+"/getPeriodoActivo")
        .then(response=>{
            setPeriodo(response.data[0][0]);});

      }
      

      ,[]);

    const seleccionarPeriodo = async (event) =>{
        await axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
        .then(response=>{
            setNombreAsig("");
            setNombreSec("");
            setPeriodo(event.target.value);
            setMiUnidades(response.data)
        })
        .catch(error=>{
            alert(error.response.data.message);
        });
    };

    const asignaturaSelect = async (event, f, d) => {
        setNombreAsig("");
        setIsActiveIndexF(f);
        setIsActiveIndexD(d);
        setIsActiveIndexA(-1);
        setLoadingAsig(true);
        setLoadingSecc(false);
        await axios.get(serverUrl+"/getAsignaturasByUnidad", {params:{periodo: nombrePeriodo, cod_unidad: event[1]}})
        .then(response=>{
            setNombreAsig(event[0]);
            setNombreSec("");
            setAsignatura(response.data);
        })
        .catch(error=>{
            setNombreAsig(event[0]);
            setNombreSec("");
            setAsignatura([]);
            alert(error.response.data.message);
        })

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

    const abrirHorario = (value) => {
        setTipoH(value[0]);
        setCodGrupoH(value[1]);
        setShowHorario(true);
    };

    const asignaturaRender = (event) =>{        
        setAsignaturaBuscar(event.target.value);
    };

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

    if (isLoading){
    return(
        <Container className="fondoUnidadAcademica" fluid>
            <Horario 
                show={showHorario}
                toggleShowHorario={toggleShowHorario}
                periodo ={nombrePeriodo}
                nombreSec = {nombreSec}
                asignatura = {codAsignatura}
                grupo = {codGrupo}
                tipo = {tipoH} 
                seccionSelect={seccionSelect}

            />
        <Container className="UnidadAcademica" fluid>
            <Row className="header-asg">
                <Col sm={12} md={5} xl={5}>
                    <h4>Asignación por Unidad Académica</h4>
                </Col>
                <Col sm={12} md={3} xl={3} style={{textAlign: "center"}}>
                    <Row>
                        <Col style={{textAlign: "right"}}>
                            <p>Periodo:</p>
                        </Col>
                        <Col>
                            <Form.Select aria-label="Default select example" onChange={(event) => {seleccionarPeriodo(event)}}>
                                <option value={nombrePeriodo}>{nombrePeriodo}</option>
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
                            <FormControl type="number" placeholder="Buscar asignatura por código" onChange={(event) => {asignaturaRender(event)}} className="me-2" aria-label="Search"/>
                        </Col>
                        <Col sm={4}>
                            <Button variant="outline-warning" onClick={()=>{traerAsignaturaBuscada()}}>Buscar</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            {nombrePeriodo !== "- Seleccionar -"?
            
            <Row className="asignacion">
                <Col sm={5} className="col-unidades">
                    <h5>Unidades Académicas</h5>
                    <Row>
                        
                        <div className='formato_datos'>
                            {miUnidades.map(
                                (facultad, indexF) => {
                                    return  (
                                        <Accordion>
                                        <div>
                                                <Accordion.Header className="accordion-facultad">
                                                <div className="fw-bold">
                                                    {"["+facultad[1]+ "] " +facultad[0]}
                                                </div>
                                                </Accordion.Header>
                                                <Accordion.Body className="accBody">
                                                {facultad[2].map(
                                                    (departamento, indexD) => {
                                                        return <a onClick={()=>{asignaturaSelect(departamento, indexF, indexD)}}>
                                                                    <div className= {indexF === isActiveIndexF && indexD === isActiveIndexD ? "isActive" : null}>
                                                                    <div key={departamento[indexD]} className='departamentosU'>
                                                                    <i class="icon bi bi-caret-right-fill"></i>
                                                                    [{departamento[1]}] {departamento[0]}
                                                                </div>
                                                            </div>
                                                        </a>
                                                    }
                                                )
                                                }
                                                </Accordion.Body>
                                        </div>
                                        </Accordion>
                                        )
                                }
                            )}
                        </div>
                    </Row>
                </Col>
                
                {nombreAsig !== ""?
                <Col sm={7}>
                    <Row>
                        <Col sm={7} className="col-asignaturas">
                            <Row>
                                <h6>{nombreAsig}</h6>   
                                <span>Asignaturas</span>
                                <ListGroup className='formato_datos mt-1'>
                                    {asignaturas.map(
                                        (value, index) => {
                                            return(
                                            <div className= {index === isActiveIndexA ? "isActive" : null}>
                                            <ListGroup.Item action variant="light"  id={index === isActiveIndexA ? "isActive" : null} key={asignaturas[index]} onClick={()=>{seccionSelect(value, index)}}>
                                                {value[0]} - {value[1]}
                                            </ListGroup.Item>
                                            </div>
                                            )
                                        })}
                                </ListGroup>
                            </Row>
                        </Col>
                        {nombreSec !== ""?
                        <Col sm={5}>
                            <Row>
                                <h6>{nombreSec}</h6>
                                <Row>
                                    <Col><span>Secciones</span></Col>
                                    <Col><span>Tipo</span></Col>
                                    <Col><span>Cupo</span></Col>
                                </Row>
                                <ListGroup className='formato_datos mt-1'>
                                    {secciones.map(
                                        (value, index) => {
                                            return <ListGroup.Item action variant={secciones[index][3] === 2 ? "success" : secciones[index][3] === 0 ? "danger" : "warning"} key={value.id} onClick={() =>abrirHorario(value)}>
                                                <Row>
                                                    <Col>{value[1]}</Col>
                                                    <Col>{value[0]}</Col>
                                                    <Col>{value[2]}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                        })}
                                </ListGroup>
                            </Row>
                        </Col>:<> {isLoadingSecc? <Col>
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
                    <Col>
                    </Col>
                </Row>
            </Col>:<div></div>}</>}
                    </Row>
                </Col>
                :<> {isLoadingAsig? <Col sm={7}>
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
                    <Col>
                    </Col>
                </Row>
            </Col>:<div></div>}</>}
            </Row>:<div></div>}
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


export default UnidadAcademica;