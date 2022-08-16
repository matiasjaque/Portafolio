import React, { useEffect, useState } from 'react'
import { Col, Row, Form, FormControl, Button, Container, Spinner,Table} from 'react-bootstrap';
import axios from "axios";
import { Document, Page, pdfjs } from 'react-pdf';
import Cookies from 'universal-cookie';
import _ from "lodash";
import ListaSalas from '../components/ListaSalas.js';
import swal from 'sweetalert';
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
const weekdays = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];

// import '../c_styles/UnidadAcademica.css';

const serverUrl = process.env.REACT_APP_SERVER;




function VerSolicitud(props) {
    const [isLoading, setLoading] = useState(false);
    const [isLoading2, setLoading2] = useState(false);
    const [miUnidades, setMiUnidades] = useState([]);
    const [unidad, setUnidad] = useState();
    const [horarios, setHorarios] = useState();
    const [pageSize, setPageSize] = useState(12);
    const [listaHorariosPag, setListaHorarioPag] = useState([]);
    const [mod, setMod] = useState("");
    const [dia, setDia] = useState();
    const [showlistarsalas, setShowListarSalas] = useState(false);
    const [asignatura, setAsig] = useState("");
    const [grupo, setGrupo] = useState("");
    const [tipo, setTipo] = useState("");
    const [nombreSec, setNombreSec] = useState("");
    const [salaSelec, setSalaSelec] = useState();
    const [periodo, setPeriodo] = useState("");
    const {show, toggleShowHorario} = props;
    const toggleShow = () => setShowListarSalas(p => !p);
    //const hload = () => setLoading(p => !p);
    const [listaModulos, setModulos] = useState([]);
    const [profesores, setProfesores] = useState([]);

    const horariosGet =  async () =>{
        axios.get(serverUrl+"/getSolicitudesByPostulacion", {params: {postulacion: props.idPost}})
            .then(response=>{
                //setLoading(true);
                setListaHorarioPag(_(response.data).slice(0).take(pageSize).value());
                setHorarios(response.data);
            })
            .catch(error=>{
                alert(error.response.data.message);
            });
    } 
    useEffect(() => {
        horariosGet();
    }, []);
    useEffect(() => {
        if (showlistarsalas){
            horariosGet();
        }
    }, [showlistarsalas]);

    const abrirListaSalas = (modulo, idx, sala) => {
        setMod(modulo);
        setSalaSelec(sala);
        setDia(idx+1);
        setShowListarSalas(true);
    };

    const enviarS = (postulacion) => {
        setAsig(postulacion[0]);
        setNombreSec(postulacion[1]);
        setPeriodo(postulacion[13]);
        setMod(postulacion[7]);
        setDia(postulacion[6]);
        setGrupo(postulacion[2]);
        setTipo("");
        setShowListarSalas(true);
    }

    const finalizarSolicitud = async () => {
        await axios({
            method: 'post',
            url: serverUrl + "/updatePostulacion",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            params: {
                postulacion: props.idPost
            }
          }).then(response=>{
            console.log(response.data);
            window.location.reload(false);
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        });
    }

    const modulosGet = async (event) =>{
        axios.get(serverUrl+"/getSolicitudesByPostulacion", {params: {postulacion: props.idPost}})
        .then(response=>{
            //setLoading(true);
            setListaHorarioPag(_(response.data).slice(0).take(pageSize).value());
            setHorarios(response.data);
        })
        .catch(error=>{
            alert(error.response.data.message);
        });
      };
      const confirmarFinalizar = () => {
        swal({
            title: "Finalizar Solicitud",
            text: "¿Está seguro que desea finalizar esta solicitud?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(respuesta=>{
            if(respuesta){
                swal({text:"La solicitud se finalizó exitosamente!",
                      icon: "success", timer: "4000"});
                      finalizarSolicitud();}
        });}
    
    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
            <ListaSalas
              show = {showlistarsalas}
              toggleShow = {toggleShow}
              hload = {setLoading2}
              periodo = {periodo}
              modulosGet = {modulosGet}
              sala = {"sin asignar"}
              mod = {mod}
              dia ={dia}
              asignatura = {asignatura}
              nombreSec = {nombreSec}
              grupo = {grupo}
              tipo = {""}
            />
                <div className="Example">
                    <header>
                      <Row className="header-asg">
                        <Col sm={9}><h3>Estado de Solicitudes</h3></Col>
                        <Col className='text-center' sm={2}><Button onClick={confirmarFinalizar} variant="danger">Finalizar Solicitud</Button></Col>
                        <Col sm={1}><Button onClick={() => window.location.reload(false)} variant="primary">Volver</Button></Col>
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
                                    <th>Sala</th>
                                </tr>
                            </thead>
                            <tbody>
                            {listaHorariosPag.map((solicitud,indexS)=>{
                                        return <tr className='p-2' key={solicitud["postulaciones"+solicitud[0]]}>
                                            <td className='p-2' key={"cod_asig"+solicitud[0]}>{solicitud[0]}</td>
                                            <td className='p-2' key={"nombreAsig"+solicitud[0]}> {solicitud[1]}   </td>
                                            <td className='p-2' key={"seccion"+solicitud[0]}>{solicitud[2]}</td>
                                            <td className='p-2' key={"cupo"+solicitud[0]}> {solicitud[4]}   </td>
                                            <td className='p-2' key={"dia"+solicitud[0]}>{weekdays[solicitud[6]]}</td>
                                            <td className='p-2' key={"modulo"+solicitud[0]}>{solicitud[7]}</td>
                                            <td className='p-2' key={"sector"+solicitud[0]}>{solicitud[8]}</td>
                                            <td className='p-2' key={"piso"+solicitud[0]}>{solicitud[9]}</td>
                                            <td className='p-2' key={"tipo"+solicitud[0]}>{solicitud[11]}</td>
                                            <td className='p-2' key={"obs"+solicitud[0]}>{solicitud[10]}</td>
                                            
                                            <td className="text-center p-2" key={"option"+solicitud[0]}>
                                                <Button   onClick={()=> enviarS(solicitud)} size='sm' variant="primary" >{solicitud[12] ? solicitud[12]:"Asignar"}</Button>{' '}
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
        </Container>
    );
}

export default VerSolicitud;