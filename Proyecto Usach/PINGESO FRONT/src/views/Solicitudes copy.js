import React, { useEffect, useState } from 'react'
import { Col, Row, Form, FormControl, Button, Container, Spinner,Table} from 'react-bootstrap';
import axios from "axios";
import { Document, Page, pdfjs } from 'react-pdf';
import Cookies from 'universal-cookie';
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
// import '../c_styles/UnidadAcademica.css';

const serverUrl = process.env.REACT_APP_SERVER;

function Solicitudes() {
    const [isLoading, setLoading] = useState(false);

    
 

 
    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <div className="Example">
                    <header>
                      <Row className="header-asg">
                        <Col sm={12} md={3}>
                            <h3>Estado de Solicitudes</h3>
                        </Col>
                        <Col xl={4}>
                        <Row>
                            
                          </Row>
                        </Col>
                        <Col xl={2} style={{textAlign: "center"}}>
                            <Row>
                               
                                
                            </Row>
                        </Col>
                        <Col xl={2}>
                            <Row>
                                {isLoading ? <></> : <Button onClick={()=>window.location.replace("/crearSolicitud")}>Añadir Solicitud</Button>}
                            </Row>
                        </Col>
                    </Row>
                    </header>
                    <div className="Example__container">
                    {isLoading ? 
                    <Button variant="primary" disabled>
                        <span>Cargando </span> 
                        <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                    </Button>: 
                        <div className="Example__container__document">


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
                        {}
                    </tbody>
                </Table>

                        </div>
                      }
                       
                    </div>
                </div>
            </Container>
        </Container>
    );
}

export default Solicitudes;