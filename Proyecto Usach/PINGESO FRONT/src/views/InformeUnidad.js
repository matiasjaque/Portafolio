import React, { useEffect, useState } from 'react'
import { Col, Row, ListGroup, Form, FormControl, Button, Container, Spinner, Table} from 'react-bootstrap';
import axios from "axios";
import _ from "lodash";
import Paginacion from '../components/Paginacion';
import { Document, Page, pdfjs } from 'react-pdf';
import Cookies from 'universal-cookie';
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
// import '../c_styles/UnidadAcademica.css';

const serverUrl = process.env.REACT_APP_SERVER;

function InformeUnidad() {
    const [file, setFile] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isLoadingTabla, setLoadingTabla] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [nombrePeriodo, setPeriodo] = useState("2022-01");
    const [listaSalas, setListaSalas] = useState([]);
    const [pageSize, setPageSize] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [listaSalasPag, setListaSalasPag] = useState([]);
    const [miUnidades, setMiUnidades] = useState([]);
    const [unidad, setUnidad] = useState();
    const periodosAcademicos = ["2022-01","2021-02","2021-01","2020-02","2020-01"];
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

    useEffect(() => {
        axios.get(serverUrl+"/getUnidades", {params: {id_usuario: id_usuario_actual}})
        .then(response=>{
            setLoading(true);
            setMiUnidades(response.data);
        })
        .catch(error=>{
            alert(error.response.data.message);
        });
        allInfoGet(); 


    //   axios.get(
    //         serverUrl + "/getpdfUnidades", 
    //         {
    //           params: {id_usuario: id_usuario_actual, periodo: nombrePeriodo, unidad: unidad},
    //           responseType: 'blob'} // !!!
    //     ).then((response) => {
    //         console.log(response)
    //         setFile(response.data);
    //     })
       // salasGet();
       
  }, []);
  

    const pagination=(pageNo)=>{
        // console.log("pag"+pageNo);
        const startIndex=(pageNo-1)*pageSize;
        const listaSalasPag = _(listaSalas).slice(startIndex).take(pageSize).value();
        setListaSalasPag(listaSalasPag);
    };
    const trigger=(pageIdx)=>{
        pagination(pageIdx);
    }

    const getInforme = async () => {
        axios.get(
                    serverUrl + "/getpdfUnidades", 
                    {
                      params: {id_usuario: id_usuario_actual, periodo: nombrePeriodo, unidad: unidad},
                      responseType: 'blob'} // !!!
                ).then((response) => {
                    console.log(response)
                    setFile(response.data);
                    window.open(URL.createObjectURL(file));
                })
    }

    const allInfoGet = async (event) =>   { 
        axios.get(serverUrl+'/getAllInfoUnidades',{params: { id_usuario : id_usuario_actual, periodo : nombrePeriodo }} )
          .then(response=>{
            
            setLoadingTabla(true);
            setListaSalas(response.data);
            setListaSalasPag(_(response.data).slice(0).take(pageSize).value());
            setCurrentPage(1);
            setUnidad();
            setLoading(true);

            //setListaSalasPag(_(response.data).slice(0).take(pageSize).value());
           // setLoading(true);
            console.log(response.data);
        }).catch (error=> {
            setListaSalas([]);
            
            setLoading(true);
            alert(error.response.data.message);
            console.log(error);
          })
    };


    const salasGet = async (event) =>{


        axios.get(serverUrl+'/getInfoUnidades',{params: {cod_unidad : unidad, periodo : nombrePeriodo }} )
          .then(response=>{
            
            setListaSalas(response.data);
            setListaSalasPag(_(response.data).slice(0).take(pageSize).value());
            setCurrentPage(1);
            setLoading(true);
            setLoadingTabla(true);
            //setListaSalasPag(_(response.data).slice(0).take(pageSize).value());
           // setLoading(true);
            console.log(response.data);
        }).catch (error=> {
            setListaSalas([]);
            setLoading(true);
            setLoadingTabla(true);
            alert(error.response.data.message);
            console.log(error);
          })
         };
    
    const options = {
        cMapUrl: 'cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'standard_fonts/',
      };
  

    function downloadPDF() {
        getInforme();
        
    }

    const selectUnidad = async (cod_unidad) =>{
        if(cod_unidad!=""){
            setUnidad(cod_unidad);
            salasGet();
            setLoadingTabla(false);
        }else{
            setLoadingTabla(false);
            allInfoGet();
            
        }
        
        
    
      };
 
  const seleccionarPeriodo = async (event) =>{
    setPeriodo(event.target.value);
    if (unidad == 0) {
        setLoadingTabla(false);
        allInfoGet();
    } else {
        setPeriodo(event.target.value);
        setLoadingTabla(false);
        salasGet(); 
    }
    
    
    
};
if (isLoading){
    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <div className="Example">
                <header>
                      <Row className="header-asg">
                        <Col sm={12} md={3}>
                            <h3>Informe de Unidades</h3>
                        </Col>
                        <Col xl={4}>
                        <Row>
                            <Col xl={2} style={{textAlign: "right"}}>
                                <p>Unidad:</p>
                            </Col>
                            <Col style={{textAlign: "right"}}>
                              <Form.Select aria-label="Default select example" onChange={(event) => {selectUnidad(event.target.value)}} style={{textAlign: "left"}}>
                              <option value="">TODO</option>
                                  {miUnidades.map(
                                      (facultades, index) => { return(
                                          facultades[2].map(
                                              (departamento,idx)=>{ return <option value={departamento[1]} key={facultades[idx]}> {"["+departamento[1]+"]" + " " + departamento[0]} </option>}
                                          ))

                                  })}
                              </Form.Select>
                            </Col>
                        </Row>
                        </Col>
                        <Col xl={2} style={{textAlign: "center"}}>
                            <Row>
                                <Col style={{textAlign: "right"}}>
                                    <p>Periodo:</p>
                                </Col>
                                <Col>
                                    <Form.Select aria-label="Default select example" onChange={(event) => {seleccionarPeriodo(event)}}>
                                        {periodosAcademicos.map(
                                            (periodo, index) => { 
                                                return <option value={periodo} key={periodosAcademicos[index]}> {periodo} </option>
                                        })}
                                    </Form.Select>
                                </Col>
                                
                            </Row>
                        </Col>
                        <Col xl={2}>
                            <Row>
                                {isLoading ?<Button onClick={downloadPDF}>DescargarPDF</Button> : <></>}
                            </Row>
                        </Col>
                    </Row>
                    </header>
             {isLoadingTabla ? <><Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Código Sala</th>
                            <th>Código Asignatura</th>
                            <th>Dia</th>
                            <th>Modulo</th> 
                            <th>Hora Inicio</th>
                            <th>Hora Fin</th>
                            <th>Rut Profesor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaSalasPag.map((sala, indexS) => {
                            return <tr className='p-2' key={indexS}>
                                <td className='p-2' key={"codS"+sala[0]}>{sala[0]}</td>
                                <td className='p-2' key={"codA"+sala[1]}>{sala[1]}</td>
                                <td className='p-2' key={"dia"+sala[2]}>{sala[2]}</td>
                                <td className='p-2' key={"Mod"+sala[3]}>{sala[3]}</td>
                                <td className='p-2' key={"hIni"+sala[4]}>{sala[4]}</td>
                                <td className='p-2' key={"hFin"+sala[5]}>{sala[5]}</td>
                                <td className='p-2' key={"rProf"+sala[6]}>{sala[6]}</td>
                              
                                
                            </tr>
                        }
                        )}
                    </tbody>
                </Table>

                  
                
                <div id="pages">
                <Paginacion
                    itemsCount={listaSalas.length}
                    itemsPerPage={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    alwaysShown={false}
                    trigger={trigger}
                    />
                </div></> : <>
               
        <Container className='loading'>
            <Row>
                <Col></Col>
                <Col>
                    <Button variant="primary" disabled>
                        <span>Cargando Informe de Unidades </span> 
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
        </>} 
                                  
            
                </div>
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
                        <span>Cargando Informe de Unidades </span> 
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

export default InformeUnidad;