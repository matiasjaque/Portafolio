import React, { useEffect, useState } from 'react'
import {Col, ListGroup} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../c_styles/MySidebar.css'
import axios from 'axios';
const conectado = new Cookies();
const serverUrl = process.env.REACT_APP_SERVER;
 
var usuario = conectado.get('nombre');
var id_usuario = conectado.get('id');

function MySidebar(){
    const [isActiveUnidad, setIsActiveUnidad] = useState(false);
    const [isActivePlan, setIsActivePlan] = useState(false);
    const [isActiveInformeUnidades, setIsActiveInformeUnidades] = useState(false);
    const [isActiveInformeSalas, setIsActiveInformeSalas] = useState(false);
    const [isActiveInformeEstadistico, setIsActiveInformeEstadistico] = useState(false);
    const [isActiveInforme, setIsActiveInforme] = useState(false);
    const [isActiveUsuario, setIsActiveUsuario] = useState(false);
    const [isActiveSalas, setIsActiveSalas] = useState(false);
    const [isActiveAvisos, setIsActiveAvisos] = useState(false);
    const [isActiveRoles, setIsActiveRoles] = useState(false);
    const [isActiveVerSolicitud, setIsActiveVerSolicitud] = useState(false);
    const [isActiveCrearSolicitud, setIsActiveCrearSolicitud] = useState(false);
    const [funcionalidades, setFuncionalidades] = useState([]);
    const [loadingFunc, setLoadingFunc] = useState(false);

    function setAllInactive(){
        setIsActiveRoles(false);
        setIsActiveAvisos(false);
        setIsActiveInformeEstadistico(false);
        setIsActiveInformeSalas(false);
        setIsActiveInformeUnidades(false);
        setIsActiveInforme(false);
        setIsActivePlan(false);
        setIsActiveSalas(false);
        setIsActiveUnidad(false);
        setIsActiveUsuario(false);
        setIsActiveVerSolicitud(false);
        setIsActiveCrearSolicitud(false);
    }

    const getRolByUsuario = async () => {
        console.log("id_usuario: "+id_usuario);
        await axios.get(serverUrl+"/getFuncionalidadesByUsuario", {params:{id_usuario: id_usuario}})
        .then(response=>{
            let lista = [];
            for(let i = 0; i<response.data.length; i++){
                lista.push(response.data[i][0]);
            }
            setFuncionalidades(lista);
            setLoadingFunc(true);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    };
    
    useEffect(() => {
        if(window.location.pathname==="/"){
            setAllInactive();
        }else if(window.location.pathname === "/unidad-academica"){
            setIsActiveUnidad(true);
        }else if(window.location.pathname === "/usuarios"){
            setIsActiveUsuario(true);
        }else if(window.location.pathname === "/salas"){
            setIsActiveSalas(true);
        }else if(window.location.pathname === "/planEstudio"){
            setIsActivePlan(true);
        }else if(window.location.pathname === "/avisos"){
            setIsActiveAvisos(true);
        }else if(window.location.pathname === "/roles"){
            setIsActiveRoles(true);
        }else if(window.location.pathname === "/informe-salas"){
            setIsActiveInformeSalas(true);
        }else if(window.location.pathname === "/informe-unidades"){
            setIsActiveInformeUnidades(true);
        }else if(window.location.pathname === "/informe-estadistico"){
            setIsActiveInformeEstadistico(true);
        }else if(window.location.pathname === "/solicitudes"){
            setIsActiveVerSolicitud(true);
        }else if(window.location.pathname === "/responderSolicitudes"){
            setIsActiveCrearSolicitud(true);
        }

    }, []);
    
    useEffect(() => {
        getRolByUsuario();
    }, []);
    
    if (loadingFunc){   
    return(
        <Col className="sidebar" md="auto">
            <div className='sidebar-container'>                 
                <ListGroup className="listagrupo" variant="flush">

                    {funcionalidades.includes(1) || funcionalidades.includes(2) ?
                        <ListGroup.Item id="listagrupo-title">
                            Asignación de Salas
                        </ListGroup.Item>:<></>
                    }
                    {funcionalidades.includes(1) ?
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>window.location.replace("/unidad-academica")} className={isActiveUnidad ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Unidad académica
                        </ListGroup.Item>:<></>
                    }
                    
                    {funcionalidades.includes(2) ?
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>window.location.replace("/planEstudio")} className={isActivePlan ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Plan de estudio
                        </ListGroup.Item>:<></>
                    }
                    
                        <ListGroup.Item id="listagrupo-title">
                            Solicitudes
                        </ListGroup.Item>
                    {funcionalidades.includes(3) ?
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>window.location.replace("/solicitudes")} className={isActiveVerSolicitud ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Solicitud Sala
                        </ListGroup.Item>:<></>
                    }

                    {funcionalidades.includes(14) ?
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>window.location.replace("/responderSolicitudes")} className={isActiveCrearSolicitud ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Responder Solicitud
                        </ListGroup.Item>:<></>
                    }
                    
                    {funcionalidades.includes(4) || funcionalidades.includes(5) || funcionalidades.includes(6) ?
                    <ListGroup.Item id="listagrupo-title">
                        Informes
                    </ListGroup.Item>:<></>}
                    {funcionalidades.includes(4) ?                        
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>window.location.replace("/informe-salas")} className={isActiveInformeSalas ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Salas
                        </ListGroup.Item>:<></>
                    }
                    {funcionalidades.includes(5) ?
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>window.location.replace("/informe-unidades")} className={isActiveInformeUnidades ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Unidades
                        </ListGroup.Item>:<></>
                    }
                    {funcionalidades.includes(6) ?
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>window.location.replace("/informe-estadistico")} className={isActiveInformeEstadistico ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Estadistico
                        </ListGroup.Item>:<></>
                    }

                    {funcionalidades.includes(7) || funcionalidades.includes(8) || funcionalidades.includes(9) || funcionalidades.includes(10) ?
                    <ListGroup.Item id="listagrupo-title">
                        Mantenedores
                    </ListGroup.Item>:<></>}
                    {funcionalidades.includes(7) ?
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>{window.location.replace("/usuarios")}} className={isActiveUsuario ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Usuarios
                        </ListGroup.Item>:<></>
                    }
                    {funcionalidades.includes(8) ?
                        <ListGroup.Item id="listagrupo-subitem" onClick={()=>{window.location.replace("/salas")}} className={isActiveSalas ? "isActive" : null} action>
                        <i class="icon bi bi-caret-right-fill"></i>
                            Salas
                        </ListGroup.Item>:<></>
                    }
                    {funcionalidades.includes(9) ?
                    <ListGroup.Item id="listagrupo-subitem" onClick={()=>{window.location.replace("/avisos")}} className={isActiveAvisos ? "isActive" : null} action>
                    <i class="icon bi bi-caret-right-fill"></i>
                        Avisos
                    </ListGroup.Item>:<></>
                    }
                    {funcionalidades.includes(10) ?
                    <ListGroup.Item id="listagrupo-subitem" onClick={()=>{window.location.replace("/roles")}} className={isActiveRoles ? "isActive" : null} action>
                    <i class="icon bi bi-caret-right-fill"></i>
                        Roles
                    </ListGroup.Item>:<></>
                    }
                </ListGroup>
            </div>
        </Col>
    );}
    else{
        <div>Hola</div>
    }

}
export default MySidebar;