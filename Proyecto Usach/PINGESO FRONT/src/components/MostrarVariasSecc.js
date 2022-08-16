import React, { useState, useEffect } from 'react';
import { Col, Row, Modal, Button, Spinner} from 'react-bootstrap';
import '../c_styles/MostrarVariasSecc.css';
import axios from "axios";

const serverUrl = process.env.REACT_APP_SERVER;


function MostrarVariasSecc(props){
    const {show, toggleShow} = props;
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);


    const getInfoModSala = async () => {  
        await axios.get(serverUrl+"/getInfoModSala", {params:{cod_sala: props.sala, periodo: props.periodo, modulo: props.modulo, dia: props.numeroDia}})
        .then(response=>{
            //console.log("info horario: " + response.data);
            //console.log("info horario: en [0] " + response.data[0]);
            //console.log("LISTAMODULOS ANTES DE SET " + listaModulos)
            console.log(response.data);
            setData(response.data);
            setLoading(false);
            //console.log("LISTA MODULO DESP SET " + listaModulos);
            //console.log("LISTA MODULO DESP SET en [0]" + listaModulos[0]);
            
        })
        .catch(error=>{
            alert(error.response.data.message);
            setData([]);
            setLoading(false);
            console.log(error);
        })  
    };


    function hideModal(){
        toggleShow();
    }

    const showModal = () => {
        setLoading(true);
        getInfoModSala();
        
      };

    return(<div>
        <Modal show={show}
        dialogClassName='modal-90w'
        aria-labelledby="example-custom-modal-styling-title"
        centered
        onShow={showModal}
        onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className='contenedorTituloMostrarSecc'>
                    <h4 id='sala'>SALA: {props.sala}</h4>
                    <h4 id='dia'>DÍA: {props.dia}</h4>
                    <h4 id='modulo'>MODULO: {props.modulo} </h4>
                    <h4 id='periodo'>PERIODO: {props.periodo} </h4>                                                            
                </Modal.Title>
            </Modal.Header>
                
        
        <Modal.Body>
            {isLoading? <Col>
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
                        </Col>
                        :<div>
                            <div className='contenedorTitulosBody'>
                                <h3 className='dataTitulosBody' id='codigo'>CÓDIGO</h3>
                                <h3 className='dataTitulosBody' id='seccion'>SECCIÓN</h3>
                                <h3 className='dataTitulosBody' id='asignatura'>ASIGNATURA</h3>
                                <h3 className='dataTitulosBody' id='profesor'>PROFESOR</h3>
                                <h3 className='dataTitulosBody' id='cantAlumnos'>Nª ALUMNOS</h3>
                                <h3 className='dataTitulosBody' id='origen'>ORIGEN</h3>
                            </div>
                            <div className=''>
                            
                            {Array.from({ length: data.length }).map((_, index) => (
                                <div key={index} className='contenedorData'>
                                
                                    {Array.from({ length: data[index].length }).map((_, index2) => (
                                        <h4 className='data'> {data[index][index2]}</h4>
                                    ))}
                                </div>
                            ))}

                            
                                         
                            {/* <h4 > {data[index][1]}</h4>
                                <h4 > {data[index][2]}</h4>
                                <h4 > {data[index][3]}</h4> */}
                                {/* {data} */}
                            </div>
                        </div>}

        </Modal.Body>
        
        <Modal.Footer>
            <Button onClick={hideModal}>Cerrar</Button>
        </Modal.Footer>
        </Modal>
      </div>
    )

}

 export default MostrarVariasSecc;