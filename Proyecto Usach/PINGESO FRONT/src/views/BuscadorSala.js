import React, {useState, useEffect} from 'react';
import { Col, Row, Container, Button, Spinner, Form} from 'react-bootstrap';
import '../c_styles/BuscadorSala.css' 
import axios from 'axios';
import Cookies from 'universal-cookie';


import HorarioBusSalas from '../components/HorarioBusSalas';
import HorarioBusSalaVarias from '../components/HorarioBusSalaVarias';

const serverUrl = process.env.REACT_APP_SERVER;

//const weekdays = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
//const modulos = ["01-02","03-04","05-06","07-08","09-10","11-12","13-14","15-16","17-18"];
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');

function BuscadorSala() {
    //var list = [];
    const [nombrePeriodo, setPeriodo] = useState("- Seleccionar -");
    const periodosAcademicos = ["2022-01","2021-02","2021-01","2020-02","2020-01"];
    // variables de la informacion de la sala
    const [sala, setSala] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [codigo, setCodigo] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [responsable, setResponsable] = useState("");
    const [tipoSala, setTipoSala] = useState("");
    const [aforo, setAforo] = useState("");
    const [m2, setm2] = useState("");
    const [largo, setLargo] = useState("");
    const [largoConsulta, setLargoConsulta] = useState(0);
    const [ancho, setAncho] = useState("");
    const [findSala, setFindSala] = useState(null);
    const [findSalaFrom, setFindSalaFrom] = useState(null);
    const [findSalaTo, setFindSalaTo] = useState(null);
    const [hasta, setHasta] = useState("");

    const [dataVariasSalas, setdataVariasSalas] = useState([]);



    // horario
    //const [listaModulos, setListaModulos] = useState([]);
    const [showHorario, setShowHorario] = useState(false);
    const [showHorarioVariasSalas, setShowHorarioVariasSalas] = useState(false);

    const toggleShowHorario = () => setShowHorario(p => !p);
    const toggleShowHorario2 = () => setShowHorarioVariasSalas(p => !p);

    // vistas de cargando
    const [isLoadingInfoSala, setIsLoadingInfoSala] = useState(false);


    useEffect(() => {
        setPeriodo("2022-01");

        //cambiar este get
        axios.get(serverUrl+"/getAvisoById", {params: {id: 1}})
        .then(response=>{
        
        })
        .catch(error=>{
            alert(error.response.data.message);
        });

      }, [])

      // funcion para abrir el horario

      const abrirHorarioInfoSala = () => {
        console.log("estoy pinchando el modal");
        /* setTipoH(value[0]);
        setCodGrupoH(value[1]); */
        setShowHorario(true);
    };

    const abrirHorarioInfoVariasSalas = () => {
        /* setTipoH(value[0]);
        setCodGrupoH(value[1]); */
        setShowHorarioVariasSalas(true);
    };

      const seleccionarPeriodo = async (event) =>{
        await axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
        .then(response=>{
            //setNombreAsig("");
            //setNombreSec("");
            setPeriodo(event.target.value);
            //setMiUnidades(response.data)
        })
        .catch(error=>{
            alert(error.response.data.message);
        });
    };

        //funcion para buscar una sala
      const getInfoSala = async () =>{
        setSala("");
        var codigoSala = findSala.toUpperCase();
        //codigoSala.toUpperCase();
        console.log(codigoSala);
        setFindSala("");
        setSala(codigoSala);
        //let a = codigoSala;
        //Number(a);
        //console.log(typeof(codigoSala));
        setIsLoadingInfoSala(true);
        setCodigo("");
        var largoConsulta = (Number(codigoSala) - Number(codigoSala));
        setLargoConsulta(largoConsulta);
        
        //if(a > 0){
            //cambiar el segundo codigo de sala que corresponde al hasta 
            //console.log("llama a horario en getInfosala")
            //getHorario(codigoSala, codigoSala);
            console.log("el tipo es: " + typeof(codigoSala));
            await axios.get(serverUrl +"/getSalasByCodSalaBusc", {params: {cod_sala: codigoSala}})
                .then(response=>{
                
                console.log(response.data);
                setDescripcion(response.data[0][2]);
                setCodigo(response.data[0][0]);
                setCapacidad(response.data[0][1]);
                setResponsable(response.data[0][21]);
                setTipoSala(response.data[0][6]);
                setAforo(response.data[0][5]);
                setm2(response.data[0][17]);
                setLargo(response.data[0][3]);
                setAncho(response.data[0][4]);
                //este hasta sirve para la primera consulta
                setHasta(codigoSala)
                
                abrirHorarioInfoSala();

                setIsLoadingInfoSala(false);
                
            })
            .catch (error=> {
                alert(error.response.data.message);
                console.log(error);
                setIsLoadingInfoSala(false);
            })
        //}
        /* else{
            alert("El codigo de sala ingresado no es valido");
            setIsLoadingInfoSala(false);
        } */
      };

      //  funcion para buscar salas por rango

      const getInfoSala2 = async () =>{
        console.log("getinfosala2")
        setCodigo("");
        setHasta("");
        setLargoConsulta(0);
        var codigoSala = findSalaFrom.toUpperCase();
        var codigoSalaHasta = findSalaTo.querySelector(".ingresarSalaHasta").value.toUpperCase();
        
        setFindSalaFrom("");
        setFindSalaTo("");
        setCodigo(codigoSala);
        setHasta(codigoSalaHasta);
       
        setIsLoadingInfoSala(true);
       
        var largoConsulta = (Number(codigoSalaHasta) - Number(codigoSala));
        setLargoConsulta(largoConsulta);
        //console.log("largo a recorrer: " + largoConsulta);
        
            //getHorario(codigoSala, codigoSala);
            //console.log("el tipo es: " + typeof(codigoSala));
            await axios.get(serverUrl +"/getHorarioBySalaBusc2", {params: {periodo: nombrePeriodo, cod_sala: codigoSala, hasta: codigoSalaHasta}})
                .then(response=>{
                
                console.log(response.data);
                setdataVariasSalas(response.data)
                abrirHorarioInfoVariasSalas(); 

                setIsLoadingInfoSala(false);
                
            })
            .catch (error=> {
                alert(error.response.data.message);
                console.log(error);
                setIsLoadingInfoSala(false);
            })
        
      };



    return(
        <div>
            <HorarioBusSalas 
                show={showHorario}
                toggleShowHorario={toggleShowHorario}
                periodo ={nombrePeriodo}
                sala = {sala}

                //estos atributos son los del horario en la seccion superior
                descripcion = {descripcion}
                codigo = {codigo}
                capacidad = {capacidad}
                respondable = {responsable}
                tipoSala = {tipoSala}
                aforo = {aforo}
                m2 = {m2}
                largo = {largo}
                ancho = {ancho}

                // data de el horario

                codigoSala = {codigo}
                hasta = {hasta}
                nombrePeriodo = {nombrePeriodo}

                //variable del largo de la consulta
                largoConsulta = {largoConsulta}
            />

            <HorarioBusSalaVarias
                show = {showHorarioVariasSalas}
                toggleShowHorario={toggleShowHorario2}
                data = {dataVariasSalas}
            
            />

       
        <div className='contenedorNaranjo'>
            <div className='contenedorGris'>
                <div className='BuscadorSala'>
                    <Container className='p-5'>
                        <Row className='text-center'><Col><h2>SALAS DE CLASES - OCUPACIÓN SEMESTRAL</h2></Col></Row>
                        <Row className='mt-3'><h5>Ingrese la Sala que desea revisar</h5></Row>
                        <Row><hr style={{background: '#002F82',color: '#002F82',borderColor: '# 002F82',height: '3px',}}/></Row>
                        <Row>
                            <Col><Form.Group><Row>
                                <Col sm={2}><Form.Label>Sala:</Form.Label></Col>
                                <Col><Form.Control placeholder="Ingrese la sala de desea buscar" value={findSala} onChange={(event) => {setFindSala(event.target.value)}}/></Col>
                            </Row></Form.Group></Col>
                            <Col><Form.Group><Row>
                                <Col sm={2}><Form.Label>Periodo:</Form.Label></Col>
                                <Col><Form.Select onChange={(event) => {seleccionarPeriodo(event)}}>
                                    {periodosAcademicos.map(
                                        (periodo, index) => { 
                                            return <option value={periodo} key={periodosAcademicos[index]}> {periodo} </option>
                                    })}
                                </Form.Select></Col>
                            </Row></Form.Group></Col>
                            <Col><Button variant="secondary" onClick={() =>getInfoSala()}>Revisar</Button></Col>
                        </Row>
                        <Row className='mt-5'><h5>Ingrese un Rango de Salas</h5></Row>
                        <Row><hr style={{background: '#002F82',color: '#002F82',borderColor: '# 002F82',height: '3px',}}/></Row>
                        
                        <Row>
                            <Col><Form.Group><Row>
                                <Col sm={2}><Form.Label>Rango:</Form.Label></Col>
                                <Col><Form.Control placeholder="Desde" value={findSalaFrom} onChange={(event) => {setFindSalaFrom(event.target.value)}}/></Col>
                                <Col><Form.Control placeholder="Hasta" value={findSalaTo} onChange={(event) => {setFindSalaTo(event.target.value)}}/></Col>
                            </Row></Form.Group></Col>
                            <Col>
                                <Form.Group>
                                    <Row>
                                        <Col sm={2}><Form.Label>Periodo:</Form.Label></Col>
                                        <Col><Form.Select onChange={(event) => {seleccionarPeriodo(event)}}>
                                            {periodosAcademicos.map(
                                                (periodo, index) => { 
                                                    return <option value={periodo} key={periodosAcademicos[index]}> {periodo} </option>
                                            })}
                                        </Form.Select></Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                            <Col><Button variant="secondary" onClick={() =>getInfoSala2()}>Revisar</Button></Col>
                        </Row>
                    </Container>

                    {isLoadingInfoSala? <Col>
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
                                </Row>
                            </Col>:<div>
                                
                                </div>}

                </div>
            </div>
        </div>
        </div>    
    )
    
    
}


export default BuscadorSala;