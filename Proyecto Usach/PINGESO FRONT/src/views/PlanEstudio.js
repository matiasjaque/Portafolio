import React, { useEffect, useState } from 'react';
import { Col, Row, ListGroup, Form, FormControl, Button, Container, Spinner, Accordion} from 'react-bootstrap';
import Horario from '../components/Horario';
import '../c_styles/PlanEstudio.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
const serverUrl = process.env.REACT_APP_SERVER;


function PlanEstudio(){
    const [isLoading, setLoading] = useState(false);
    const [isLoadingAsig, setLoadingAsig] = useState(false);
    const [isLoadingSecc, setLoadingSecc] = useState(false);
    const [isLoadingPlan, setLoadingPlan] = useState(false);
    const [nombreSec, setNombreSec] = useState("");
    const [nombreAsig, setNombreAsig] = useState("");
    const [nombrePeriodo, setPeriodo] = useState("- Seleccionar -");
    const [nombrePlan, setNombrePlan] = useState("");
    const [periodosAcademicos,setPeriodos] = useState(["2022-01","2021-02","2021-01","2020-02","2020-01"]);
    const [secciones, setSecciones] = useState([]);
    const [miUnidades, setMiUnidades] = useState([]);
    const [unidadPlan, setUnidadPlan] = useState([]);
    const [asignaturas, setAsignatura] = useState([]);
    const [codGrupo, setCodGrupoH] = useState("");
    const [tipoH, setTipoH] = useState("");
    const [codAsignatura, setCodAH] = useState();
    const [isActiveIndexP, setIsActiveIndexP] = useState(-1);
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
            setPeriodo(response.data[0][0]);
            console.log(response.data[0][0]);
        });

      }, []);

    const selectUnidad = async (event) =>{
        //aqui va el boton de que comienza a cargar
        console.log(event.target.value);
        setNombrePlan("alo");
        setLoadingPlan(true); 
        await axios.get(serverUrl+"/getPlanesByUnidad", {params: {cod_unidad: event.target.value , periodo: nombrePeriodo}})
        .then(response=>{
            setLoadingPlan(false);
            setLoadingAsig(false);
            setNombrePlan("");
            setUnidadPlan(response.data);
            console.log(response.data);
            setAsignatura([]);
            setNombreAsig("");
        })
        .catch(error=>{
            setLoadingPlan(false);
            setLoadingAsig(false);
            setNombrePlan("");
            setUnidadPlan([]);
            setAsignatura([]);
            setNombreAsig("");
            alert(error.response.data.message);
        });
};
      
      

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



    const asignaturaSelect = async (plan,p) => {
        setNombreAsig("");
        
        setIsActiveIndexP(p);
        setIsActiveIndexA(-1);
        setLoadingAsig(true);
        setLoadingSecc(false);
        await axios.get(serverUrl+"/getAsignaturasByPlan", {params:{cod_plan: plan[0], periodo: nombrePeriodo}})
        .then(response=>{
            setNombreAsig(plan[1]);
            console.log(response.data);
            setNombreSec("");
            setAsignatura(response.data);
        })
        .catch(error=>{
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
            setLoadingSecc(false);
            setSecciones([]);
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
            setIsActiveIndexP(-1);
            console.log(response.data);
        })
        .catch(error=>{
            setNombreAsig("");
            setNombreSec("");
            setIsActiveIndexP(-1);
            alert(error.response.data.message);
            console.log(error);
        });
    };




    if (isLoading){
    return(
        <Container className="fondoPlanEstudio" fluid>
            <Horario 
                show={showHorario}
                toggleShowHorario={toggleShowHorario}
                periodo ={nombrePeriodo}
                nombreSec = {nombreSec}
                asignatura = {codAsignatura}
                grupo = {codGrupo}
                tipo = {tipoH} 
                seccionSelect={seccionSelect}
                indexA = {isActiveIndexA}

            />
        <Container className="PlanEstudio" fluid>
            <Row className="header-asg">
                <Col sm={12} md={5} xl={5}>
                    <h4>Asignación por plan de estudio</h4>
                </Col>
                <Col sm={12} md={3} xl={3} style={{textAlign: "center"}}>
                    <Row>
                        
                        <Col style={{textAlign: "left"}}>
                            <p>Periodo:</p>
                        </Col>
                        <Col>
                            <Form.Select aria-label="Default select example" onClick={(event) => {seleccionarPeriodo(event)}}>
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
                            <Button  variant="outline-warning" onClick={()=>{traerAsignaturaBuscada()}}>Buscar</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
                

            <Row className='contenedorUnidad'>
                <Col sm={2} style={{textAlign: "left"}}>
                        <h5 id='unidadAcademica' >Unidad academica:</h5>
                </Col>

                <Col sm={5}>
                    <Form.Select aria-label="Default select example" onChange={(event) => {selectUnidad(event)}} style={{textAlign: "left"}}>       
                        {miUnidades.map(
                            (facultades, index) => { return(
                                facultades[2].map(
                                    (departamento,idx)=>{ 
                                        return (                                            
                                            <option value={departamento[1]} key={facultades[idx]}> {"["+departamento[1]+"] " + departamento[0]} </option>
                                        )
                                    }
                                ))

                        })}
                    </Form.Select>
                </Col>
            </Row>
            
            
            {/* {nombrePeriodo !== "- Seleccionar -" ? */}

                {nombrePlan === "" ? 
                
                <Row className="asignacion">
                    <Col sm={5} className="col-unidades">
                        <h5 id='planesAcademicos'>Planes Académicos</h5>
                        <Row> 
                                    <ListGroup className='formato_datos mt-1'>
                                        {unidadPlan.map(
                                            (value, index) => {
                                                return(
                                                <div className= {index === isActiveIndexP ? "isActive" : null}>
                                                <ListGroup.Item action variant="light"  id={index === isActiveIndexP ? "isActive" : null} key={unidadPlan[index]} onClick={()=>{asignaturaSelect(value, index)}}>
                                                    {value[0]} - {value[1]}
                                                </ListGroup.Item>
                                                </div>
                                                )
                                            })}
                                    </ListGroup>
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
                                        <Col>
                                            <span>Secciones</span>
                                        </Col>
                                        <Col>
                                            <span>Tipo</span>
                                        </Col>
                                        <Col>
                                            <span>Cupo</span>
                                        </Col>
                                    </Row>
                                    <ListGroup className='formato_datos mt-1'>
                                        {secciones.map(
                                            (value, index) => {
                                                return <ListGroup.Item action variant={secciones[index][3] === 2 ? "success" : secciones[index][3] === 0 ? "danger" : "warning"} key={secciones[index]} onClick={() =>abrirHorario(value)}>
                                                    <Row>
                                                        <Col>
                                                            {value[1]}   
                                                        </Col>
                                                        <Col>
                                                            {value[0]}   
                                                        </Col>
                                                        <Col>
                                                            {value[2]}
                                                        </Col>
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
                :<> {isLoadingPlan? <Col sm={7}>
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
                </Col>:<div></div>}</>
                    
                </Row>:<div><Col sm={7}>
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
                </Col></div>}
                


            {/* </Row>:<div></div>} */}
        </Container>
        </Container>
    );
    }
    else{ 
        return(
            <Container className="fondoPlanEstudio" fluid>
            <Container className="PlanEstudio" fluid>
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


export default PlanEstudio;
