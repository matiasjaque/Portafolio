import React, { useEffect, useState } from 'react'
import { Col, Row, Button, Spinner,  Container, Form } from 'react-bootstrap';
import '../c_styles/UnidadAcademica.css';
import '../c_styles/Perfil.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import imagenUsach from '../assets/logoUsach.svg.png';
const serverUrl = process.env.REACT_APP_SERVER;


const conectado = new Cookies();

var id_usuario_actual = conectado.get('id');




function Perfil() {

    const [perfil, setPerfil] = useState([]);
    useEffect(() => {
        axios.get(serverUrl+"/getUsuarioById", {params: {id_usuario: id_usuario_actual}})
        .then(response=>{
            console.log(response.data);
            setPerfil(response.data[0]);
        })
        .catch(error=>{
            alert(error.response.data.message);
        });
      }, []);
   
    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                

    <Row>
    
        <h3>Perfil de {perfil[1]}</h3>
        
        <Col className="profile-box container" sm={4} style={{textAlign: "left"}}>
            <Row>
            <div> <img   src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"></img></div>
            <Form.Control className="mb-3" type="file" id="inputGroupFile01" custom/>
            </Row>
                    
           
           
            
        </Col>
        
        <Col sm ={4}>
        <form className='dataP'>
            <div className="mb-3">
          <label>Nombres</label>
          <input
            type="text"
            className="form-control"
            placeholder={perfil[1]}
            disabled
          />
        </div>
        <div className="mb-3">
          <label>Apellidos</label>
          <input type="text" className="form-control" placeholder="Apellidos" disabled/>
        </div>
        <div className="mb-3">
          <label>Rut</label>
          <input
            type="text"
            className="form-control"
            placeholder={perfil[7]}
            disabled
          />
        </div>
        <div className="mb-3">
          <label>Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            placeholder={perfil[3]}
          disabled/>
        </div>
        <div className="mb-3">
          <label>Rol</label>
          <input
            type="text"
            className="form-control"
            placeholder={perfil[6]}
            disabled
          />
        </div>
        <div className="mb-3">
          <label>Telefono</label>
          <input
            type="text"
            className="form-control"
            placeholder={perfil[8]}
            disabled
          />
        </div>
        <Row> 
                
                {/* <Col>
                    <button type="submit" className="btn btn-primary">
                        Modificar Datos
                    </button>
                </Col>  */}
              
              </Row>
        </form></Col>

              
        <Col sm={4}> 
        
        </Col>
      

      </Row>

            </Container>
        </Container>
    );
}

export default Perfil;