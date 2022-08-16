import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import '../c_styles/Dashboard.css';
import Grafico from "./Grafico";
import imagen7 from '../assets/imagen7.jpeg';
import Cookies from 'universal-cookie';
import { Form, Col, Row, Container, Button, Spinner, Card} from 'react-bootstrap';
import '../c_styles/UnidadAcademica.css';


import axios from 'axios';

const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
const serverUrl = process.env.REACT_APP_SERVER;
var userName = conectado.get('nombre');


function Dashboard(){
    const [isLoading, setLoading] = useState(false);
    const [numeroSala, setSala] = useState();
    const [numeroSalaSalas, setSalaSalas] = useState();
    const [numeroSalaLab, setSalaLab] = useState();
    const [cantidadDiurno, setCantidadDiurno] = useState();
    const [cantidadVespertino, setCantidadVespertino] = useState();
    const [avisos, setAvisos] = useState([null, null, null, null]);
    const [nombrePeriodo, setPeriodo] = useState("- Seleccionar -");
    const [dataGrafico, setDataGrafico] = useState("");
    const [unidadGrafico, setUnidadGrafico] = useState(0);
    const [file, setFile] = useState(null);


    const [isLoadingGraf, setLoadingGraf] = useState(false);
    const [miUnidades, setMiUnidades] = useState([]);

    const salasGet = async () =>{
        await axios.get(serverUrl + "/getSalasByIdUsuario", {params:{id_usuario: id_usuario_actual}})
          .then(response=>{
            setSala(response.data);
            //setLoading(true);
            //console.log("trae esto:" + response.data);
        })
        .catch (error=> {
          setSala([]);
          alert(error.response.data.message);
          console.log(error);
        })
      };

      const getSalas = async () =>{
        await axios.get(serverUrl + "/getSalasSalas", {params:{id_usuario: id_usuario_actual}})
          .then(response=>{
            setSalaSalas(response.data);
            //setLoading(true);
            //console.log("trae esto:" + response.data);
        })
        .catch (error=> {
          setSalaSalas([]);
          alert(error.response.data.message);
          console.log(error);
        })
      };

      const getSalasLab = async () =>{
        await axios.get(serverUrl + "/getSalasLab", {params:{id_usuario: id_usuario_actual}})
          .then(response=>{
            setSalaLab(response.data);
            //setLoading(true);
            //console.log("trae esto:" + response.data);
        })
        .catch (error=> {
          setSalaLab([]);
          alert(error.response.data.message);
          console.log(error);
        })
      };

      const getDispDiurno = async () =>{
        await axios.get(serverUrl + "/getDisponibilidadDiurno", {params:{id_usuario: id_usuario_actual}})
          .then(response=>{
            setCantidadDiurno( Math.trunc(response.data));
            //console.log("trae esto:" + response.data);
        })
        .catch (error=> {
          setSalaLab([]);
          alert(error.response.data.message);
          console.log(error);
        })
      };

      const getDispVespertino = async () =>{
        await axios.get(serverUrl + "/getDisponibilidadVespertino", {params:{id_usuario: id_usuario_actual}})
          .then(response=>{
            setCantidadVespertino(Math.trunc(response.data));
            //console.log("trae esto:" + response.data);
        })
        .catch (error=> {
          setSalaLab([]);
          alert(error.response.data.message);
          console.log(error);
        })
      };

      const getUnidades = async () =>{
        axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
          .then(response=>{
            setMiUnidades(response.data);
            //console.log("trae esto:" + response.data);
            setLoading(true);
        })
        .catch (error=> {
          alert(error.response.data.message);
          console.log(error);
        })
      };

      // funcion del grafico calculo de obtener la ocupacion total del usuario

      const getDataGraficoGenUseEfect  = async () => {
        await axios.get(serverUrl+"/getAsignacionByUsuario", {params: {id_usuario: id_usuario_actual}})
        .then(response=>{
            console.log(response.data);
            setDataGrafico(response.data);
            setLoadingGraf(false);
            //setLoading(true);
            
        })
        .catch(error=>{
            alert(error.response.data.message);
        });
      };

      const obtenerAvisos = async () => {
        axios.get(serverUrl+"/getAvisos")
            .then(response=>{
            setAvisos(response.data);
            console.log(response.data);
        }).catch (error=> {
            alert(error.response.data.message);
            console.log(error);
        })
      };

      const downloadPdfDashboard = async () => {
        await axios.get(serverUrl+"/getPdfDashboard", 
        {params: {
          id_usuario: id_usuario_actual,
          numeroSala: numeroSala[0][0],
          cantidadDiurno: cantidadDiurno,
          cantidadVespertino: cantidadVespertino,
          unidadGrafico: unidadGrafico,
          dataGrafico: dataGrafico[0][0],
          numeroSalaSalas: numeroSalaSalas[0][0],
          numeroSalaLab: numeroSalaLab[0][0],
          periodo: nombrePeriodo
        },
        responseType: 'blob'
      }).then((response) => {
        setFile(response.data);
      })
      window.open(URL.createObjectURL(file));
      };

      useEffect(() => {
        salasGet();
        getUnidades();
        getSalas(id_usuario_actual);
        getSalasLab(id_usuario_actual);
        getDispDiurno(id_usuario_actual);
        getDispVespertino(id_usuario_actual);
        setPeriodo("2022-01");
        getDataGraficoGenUseEfect();
        obtenerAvisos();
      }, [])


//funciones grafico

    const getDataGraficoGen  = async () => {
      setLoadingGraf(true);
      await axios.get(serverUrl+"/getAsignacionByUsuario", {params: {id_usuario: id_usuario_actual}})
      .then(response=>{
          console.log("lo k me entrega data graf esp: " + response.data);
          setDataGrafico(response.data);
          console.log("porcentaje de ocupacion en getDataGraficoEsp: " + dataGrafico);
          setLoadingGraf(false)
          
      })
      .catch(error=>{
          alert(error.response.data.message);
          setLoadingGraf(false)
      });
    }

    const getDataGraficoEsp = async (unidad) =>{
      setLoadingGraf(true);
      
      await axios.get(serverUrl+"/getAsignacion", {params: {cod_unidad: unidad}})
      .then(response=>{
        console.log("lo k me entrega data graf esp: " + response.data);
        setDataGrafico(response.data);
        console.log("porcentaje de ocupacion en getDataGraficoEsp: " + dataGrafico);
        setLoadingGraf(false);
      })
      .catch(error=>{
          alert(error.response.data.message);
          setLoadingGraf(false)
      });
    };

    const enviarDataAgrafico = (dato) => {
      console.log("event.target.value: " + dato)
      setUnidadGrafico(dato);
      if(dato === "1"){
        getDataGraficoGen()
        console.log("estoy en el if");
      }
      else{
        
        console.log("estoy en el else")
        getDataGraficoEsp(dato)
      }
    }


      
    
    if(isLoading){
        return(
            <div className="conetenedorNaranaja">
            <div className="contenedor">
                <div className="contenido">
                    <div className="caja1" id="caja1-1">
                        <h3 id="h3">Cantidad de salas usuario: {userName.toUpperCase()}</h3>
                        <div ></div>
                        <div className="cardsContenedor">
                            <h2 id="h2-1">{numeroSala}</h2>
                        </div>
                    </div>
    
                    <div className="caja1" id="caja1-2">
                        <h3 id="h3">Ocupacion de salas diurno</h3>
                        <strong className='etiquetaPeriodo'>Periodo: {nombrePeriodo}</strong>
                        <div className="cardsContenedor">
                            <h2 id="h2-1">{cantidadDiurno}%</h2>
                        </div>
                        <p className='parrafoCalculo'>*Calculo realizado desde el modulo 01-02 "08:00 - 09:30" hasta el modulo 11-12 "17:10 - 18:40" de lunes a sabado.</p>
                    </div>
    
                    <div className="caja1" id="caja1-4">
                        <h3 id="h3">Ocupacion de salas vespertino</h3>
                        <strong className='etiquetaPeriodo'>Periodo {nombrePeriodo}</strong>
                        <div className="cardsContenedor">
                            <h2 id="h2-1">{cantidadVespertino}%</h2>
                        </div>
                        <p className='parrafoCalculo'>*Calculo realizado desde el modulo 13-14 "18:45 - 20:10" hasta el modulo 17-18 "21:35 - 23:00" de lunes a sabado.</p>
                    </div>
                    
                    <div className="caja1-2" id="caja1-3">
                        <h4 id="h4">Ocupacion por Unidades Periodo {nombrePeriodo}</h4>
                        <div className='unidadesAcademicas'>
                          <Form.Select className='formulario' aria-label="Default select example"  key={null} onChange={(event) => {enviarDataAgrafico(event.target.value)}} style={{textAlign: "left"}}>
                          <option value={1}>-- OCUPACION TOTAL --</option>
                          {miUnidades.map(
                              (facultades, index) => { return(
                                  facultades[2].map(
                                      (departamento,idx)=>{ return <option value={departamento[1]} key={facultades[idx]}> {"["+departamento[1]+"]" + " " + departamento[0]} </option>}
                                  ))

                          })}
                          </Form.Select>
                        </div>
                        <p className='parrafoCalculoGraf'>*Calculo realizado en base a todos los horarios de la unidad seleccionada, desde el modulo 01-02 "08:00 - 09:30" hasta el modulo 17-18 "21:35 - 23:00" de lunes a sabado.</p>
                     
                        {isLoadingGraf? <Col>
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
                      </Col>:
                      <div className="graficaCircular">
                        < Grafico
                          data = {dataGrafico}
                        />
                      </div>}
                    </div>
    
                    <div className="caja2" id="caja2-1">
                        <h3 id="h3">Salas</h3>
                        <div className="cardsRow2">
                            <h2 id="h2-2">{numeroSalaSalas}</h2>
                        </div>
                    </div>
    
                    <div className="caja2" id="caja2-2">
                        <h3 id="h3">Laboratorios</h3>
                        <div className="cardsRow2">
                            <h2 id="h2-2">{numeroSalaLab}</h2>
                            
                        </div>
                    </div>
    
                    <div className="caja3" id="caja3-1">
                        <div className="MapaFacultad">
                                <h2 id="h2">Mapa de la universidad</h2>
                                <img alt="imagen7" src={imagen7} id="imagen7"></img>
                        </div>
                    </div>
                    
                    <div className="caja4" id="caja4-1">
                        <div className="Aviso">
                                <h4>Avisos</h4>
                                <p style={{textAlign:"justify"}} >
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
                                        </div> :<></>}
                                    </div>
                                  })}
                                </Card.Body></Card>
                                </p>
                        </div>
                    </div>
                    <div className="d-grid gap-2">
                      <Button variant="secondary" size="lg" onClick={downloadPdfDashboard}>
                        Descargar PDF
                      </Button>
                    </div>
                </div>
    
            </div>
    
            </div>
        )
    }

    return(
        <div>
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
        </div>
    )
    
        
}

export default Dashboard;