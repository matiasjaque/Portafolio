import React, { useEffect, useState } from 'react'
import { Col, Row, Form, FormControl, Button, Container, Spinner,Table, Modal} from 'react-bootstrap';
import axios from "axios";
import { Document, Page, pdfjs } from 'react-pdf';
import VerSolicitudes from '../views/VerSolicitud.js';

import Cookies from 'universal-cookie';
import _ from "lodash";
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
// import '../c_styles/UnidadAcademica.css';

const serverUrl = process.env.REACT_APP_SERVER;





function Solicitudes() {
    const [isLoading, setLoading] = useState(true);
    const [listaPostulaciones, setListaPostulaciones] = useState([["", "", ""]]);
    const [listaPostulacionesPag, setListaPostulacionesPag] = useState([]);
    const [numPostulacionesPag, setNumPostulacionesPag] = useState([]);
    const [pageSize, setPageSize] = useState(12);
    const [modalModificar, setModalModificar] = useState(false);
    const [idpost,setIdPost] = useState(0);
    const [verListaPost, setVerListaPost] = useState([]);
    const [verSol, setVer] = useState(false);
    const [numeroPostulacionFiltro, setNumeroPostulacionFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("-");
    const periodosAcademicos = ["2022-01","2021-02","2021-01","2020-02","2020-01"];
    const [periodoFiltro, setPeriodoFiltro] = useState("2022-01");
 
    const postulacionesGet = async (event) =>{
        axios.get(serverUrl+'/getPostulaciones',{params:{}} )
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
    useEffect(() => {
        postulacionesGet();
    }, []);

    useEffect(() => {
        if (numeroPostulacionFiltro || estadoFiltro){
            filtroGeneral();
        }
    }, [numeroPostulacionFiltro, estadoFiltro])

    const setVer1 =(idPost)=>{
        setVer(true);
        setIdPost(idPost);
       
    }

    const filtroGeneral = () => {
        let results = [];
        console.log(estadoFiltro);
        if (estadoFiltro == "-"){
            results = listaPostulaciones;
        }
        else{
            for(let i=0; i<listaPostulaciones.length; i++){
                console.log(listaPostulaciones[i][2].toLowerCase());
                if(listaPostulaciones[i][2].toLowerCase() == estadoFiltro.toLowerCase()){
                    results.push(listaPostulaciones[i]);
                }
            }
        }
        console.log(results);
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
        setListaPostulacionesPag(_(results2).slice(0).take(pageSize).value());
    }

        return (
           (verSol? <VerSolicitudes idPost ={idpost}/> :
            <Container className="fondoUnidadAcademica" fluid>
                <Container className="UnidadAcademica" fluid>
                    <div className="Example">
                        <header>
                        <Row className="header-asg">
                            <Col><h3>Estado de Solicitudes</h3></Col>
                        </Row>
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
                        </header>
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
                        :<div className="Example__container__document">
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
                                    <td className='p-2' key={postulaciones.id}>{postulaciones[3]}</td>
                                    <td className='p-2' key={postulaciones.id}>
                                        {postulaciones[2] === "PENDIENTE"?
                                            <Button size="sm" variant="warning">{postulaciones[2]}</Button>:
                                            <Button size="sm" variant="success">{postulaciones[2]}</Button>
                                        }
                                    </td>
                                    <td className='p-2' key={postulaciones.id}>{postulaciones[4]+"/"+postulaciones[5]}</td>
                                    <td className="text-center p-2" key={"option"+postulaciones[0]}>
                                        <Button  size='sm' variant="primary" onClick={()=> setVer1(postulaciones[0])} >Ver Solicitud</Button>{' '}
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
                </Container>
            </Container>)
        );
}



export default Solicitudes;