import React, { useEffect, useState } from 'react'
import { Col, Row, Container, Table, Button, Form} from 'react-bootstrap';
import axios from "axios";
import Cookies from 'universal-cookie';
import "../c_styles/InformeEstadistico.css";
import ListaSalasEstadistico from '../components/ListaSalasEstadistico';

const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');

const weekdays = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
const hora = ["08:00 - 09:30","09:40 - 11:10","11:20 - 12:50","13:50 - 15:20","15:30 - 17:00","17:10 - 18:40","18:45 - 20:10","20:10 - 21:35","21:35 - 23:00"];


const serverUrl = process.env.REACT_APP_SERVER;

function InformeEstadistico() {
    const [listaEstadistico, setListaEstadistico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [unidadFiltro, setUnidadFiltro] = useState(-1);
    const [unidadFiltroNombre, setUnidadFiltroNombre] = useState(null);
    const [periodo, setPeriodo] = useState('2022-01');
    const [unidadesUsuario, setUnidadesUsuario] = useState([]);
    const [showlistarsalas, setShowListarSalas] = useState(false);
    const [modulos, setModulos] = useState([]);
    const [mod, setMod] = useState("");
    const [dia, setDia] = useState();
    
    const toggleShow = () => setShowListarSalas(p => !p);

    useEffect(() => {
        axios.get(serverUrl + "/getModulosByPeriodo", {params : {periodo : periodo}})
        .then(res => {
        console.log(res.data); 
        setModulos(res.data);})
        .catch(err => console.log(err));
        axios.get(serverUrl + "/getUnidadesMenores", {params:{id_usuario: id_usuario_actual}})
        .then(response=>{
            setUnidadesUsuario(response.data)
            console.log("unidadesUsuario")
            console.log(response.data)
        })
        .catch(error=>{
            alert(error.response.data.message);
        })

        axios.get(
            serverUrl + "/getEstadisticoByIdUsuario",
            {
                params: {id_usuario: id_usuario_actual}
            },
        ).then((response) => {
            setListaEstadistico(response.data);
        })

    }, []);

    async function downloadPDF() {

        await axios.get(
            serverUrl + "/getPdfEstadistico",
            {
                params: {id_usuario: id_usuario_actual, unidad: unidadFiltro},
                responseType: 'blob'
            },
        ).then((response) => {
            setFile(response.data);
        })

        window.open(URL.createObjectURL(file));
        setFile(null);
    }

    
    function seleccionarUnidad(event){
        setUnidadFiltro(event)
    }
    
    function abrirHorario(mod, i){
        setMod(mod);
        setDia(i+1);
        setShowListarSalas(true);
    }

    useEffect(() => {
        if(unidadFiltro === "-1"){
            axios.get(
                serverUrl + "/getEstadisticoByIdUsuario",
                {
                    params: {id_usuario: id_usuario_actual}
                },
            ).then((response) => {
                setListaEstadistico(response.data);
            })

        }else{
            axios.get(
                serverUrl + "/getEstadisticoByUnidad",
                {
                    params: {cod_unidad: unidadFiltro},
                },
            ).then((response) => {
                setListaEstadistico(response.data);
            })
        }

    }, [unidadFiltro]);

    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <ListaSalasEstadistico
              show = {showlistarsalas}
              toggleShow = {toggleShow}
              mod = {mod}
              periodo = {periodo}
              dia ={dia}
              nombreDia ={weekdays[dia-1]}
            />
            <Container className="UnidadAcademica" fluid>
            <Row className="header-asg">
                <Col sm={12} md={5} xl={4}>
                    <h3>Informe Estadistico</h3>
                </Col>
                <Col sm={4}>
                        <Form.Select onChange={(event) => seleccionarUnidad(event.target.value)}>
                            <option value={-1}>Todas las Unidades</option>
                            {unidadesUsuario.map((unidad) => {
                                return (
                                    <option value={unidad[1]} key={unidad.id}>{unidad[1]+"-"+unidad[0]}</option>
                                )
                            })}
                        </Form.Select>
                    </Col>
                <Col xl={2}>
                    <Row>
                        <Button onClick={downloadPDF}>DescargarPDF</Button>
                    </Row>
                </Col>
            </Row>
                <Table responsive bordered  id="fondo">
                <thead>
                    <tr id='dias'>
                    <th >       </th> 
                    {Array.from({ length: weekdays.length }).map((_, index) => (
                        <th id="colDia" scope='col' key={weekdays[index]} >{weekdays[index]} </th>
                    ))}
                    </tr> 
                </thead>

                <tbody>
                    {Array.from({ length: modulos.length }).map((_, index1) => (
                    <tr key={index1}>
                        <><th scope='row' key={modulos[index1][0]} className="cModulos">
                            {modulos[index1][0]}{"\n"}{hora[index1]}
                            </th>
                    {Array.from({ length: weekdays.length }).map((_, index2) => (                  
                        <td id='estadistico' key={modulos[index1] + weekdays[index2]}><a onClick={() =>abrirHorario(modulos[index1][0], index2)}><span>{listaEstadistico[index2 * 9 + (index1 % 9)]+"%"}</span></a></td>
                        ))}
                        </>                 
                    </tr>))}    
                </tbody>
                </Table>
            </Container>
        </Container>
    )
}

export default InformeEstadistico;