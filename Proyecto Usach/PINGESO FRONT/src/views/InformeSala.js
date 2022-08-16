import React, { useEffect, useState } from 'react'
import { Col, Row, Modal, Form, FormControl, FloatingLabel, Button, Container, Spinner, Table} from 'react-bootstrap';
import axios from "axios";
import _ from "lodash";
import Paginacion from '../components/Paginacion';
import { Document, Page, pdfjs } from 'react-pdf';
import Cookies from 'universal-cookie';
const conectado = new Cookies();
var id_usuario_actual = conectado.get('id');
// import '../c_styles/UnidadAcademica.css';

const serverUrl = process.env.REACT_APP_SERVER;

function ModalVerSala(props) {
    const [nuevo_cod_sala, setNuevoCodSala] = useState("");
    const [nuevo_descripcion, setNuevoDescripcion] = useState("");
    const [nuevo_tipo, setNuevoTipo] = useState("");
    const [nuevo_capacidad, setNuevoCapacidad] = useState();
    const [nuevo_cod_unidad, setNuevoCodUnidad] = useState();
    const [nuevo_ancho, setNuevoAncho] = useState();
    const [nuevo_largo, setNuevoLargo] = useState();
    const [nuevo_aforo, setNuevoAforo] = useState();
    const [nuevaCaracteristica, setNuevaCaracteristica] = useState([]);
    const [cara, setCara] = useState();

    useEffect(() => {
        setNuevoCodSala(props.sala[0]);
        setNuevoDescripcion(props.sala[2]);
        setNuevoTipo(props.sala[6]);
        setNuevoCapacidad(props.sala[1]);
        setNuevoCodUnidad(props.sala[8]);
        setNuevoAncho(props.sala[4]);
        setNuevoLargo(props.sala[3]);
        setNuevoAforo(props.sala[5]);
        setNuevaCaracteristica([]);
    }, [props])

    const cerrarModal = (props) => {
        setCara('');
        props.onHide();
    }

    const showModal = (props) => {
        // axios.get(serverUrl+'/getCaracteristicasByCodSala', {params:{cod_sala: props.sala[0]}})
        // .then(response=>{
        // setCara(response.data)
        // console.log(cara);
        // }).catch (error=> {
        // })
    }

    return (
        <Modal {...props} dialogClassName='modal-80w' onShow={showModal(props)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Ver Sala</Modal.Title>
            </Modal.Header>
            <Modal.Body className='scroll_bar_caracteristicas'>
                <FloatingLabel label="Código de sala" className="mb-3" name ="cod_sala" >
                    <Form.Control defaultValue={props.sala[0]} readOnly/>
                </FloatingLabel>
                <FloatingLabel label="Descripción" className="mb-3"  name ="descripcion" >
                    <Form.Control defaultValue={props.sala[2]} readOnly/>
                </FloatingLabel>
                <Row>
                    <Col>
                    <FloatingLabel label="Capacidad" className="mb-3"  name ="capacidad">
                        <Form.Control defaultValue={props.sala[1]} readOnly/>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel className="mb-3" label="Tipo" name ="tipo">
                        <Form.Control defaultValue={props.sala[22]} readOnly/>
                    </FloatingLabel>
                    </Col>
                </Row>
                <FloatingLabel label="Codigo Unidad" className="mb-3"  name ="cod_unidad">
                    <Form.Control defaultValue={props.sala[8]+"-"+props.sala[21]} readOnly/>
                </FloatingLabel>
                <Row>
                    <Col>
                    <FloatingLabel label="Ancho (m)" className="mb-3"  name ="ancho">
                        <Form.Control defaultValue={props.sala[4]} readOnly/>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel label="Largo (m)" className="mb-3"  name ="largo">
                        <Form.Control defaultValue={props.sala[3]} readOnly/>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel label="Metros2 (m2)" className="mb-3">
                        <Form.Control defaultValue={props.sala[17]} readOnly/>
                    </FloatingLabel>
                    </Col>
                </Row>
                <FloatingLabel label="Aforo" className="mb-3"  name ="aforo">
                    <Form.Control defaultValue={props.sala[5]} readOnly/>
                </FloatingLabel>

                {cara}

            </Modal.Body>
            <Modal.Footer>
                <Button>Modificar Sala</Button>
                <Button variant="outline-danger" onClick={() => {cerrarModal(props)}}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

function InformeSala() {
    const [file, setFile] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [nombrePeriodo, setNombrePeriodo] = useState("2022-01");
    const [periodos, setPeriodos] = useState([]);
    const [listaSalas, setListaSalas] = useState([]);
    const [filterListaSalas, setFilterListaSalas] = useState([]);
    const [pageSize, setPageSize] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [listaSalasPag, setListaSalasPag] = useState([]);
    const [filtroSalaText, setFiltroSalaText] = useState("");
    const periodosAcademicos = ["2022-01","2021-02","2021-01","2020-02","2020-01"];
    const [unidadesUsuario, setUnidadesUsuario] = useState([]);
    const [unidadFiltro, setUnidadFiltro] = useState(-1);
    const [codSalaFiltro, setCodSalaFiltro] = useState("");
    const [salaActual, setSalaActual] = useState([]);
    const [modalVerSala, setModalVerSala] = useState(false);
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

    useEffect(() => {
        salasGet();
        axios.get(serverUrl+"/getPeriodos")
        .then(response=>{
            setPeriodos(response.data);
        })
        .catch(error=>{
            alert(error.response.data.message);
        });
        getUnidadesUser();
    
    }, []);

    useEffect(() => {
        if (unidadFiltro || codSalaFiltro){
            filterSala();
        }
    }, [unidadFiltro, codSalaFiltro])

    const pagination = (pageNo) => {
        // console.log("pag"+pageNo);
        const startIndex = (pageNo-1) * pageSize;
        const listaSalasPag = _(filterListaSalas).slice(startIndex).take(pageSize).value();
        setListaSalasPag(listaSalasPag);
    };

    const trigger = (pageIdx) => {
        pagination(pageIdx);
    };

    const getUnidadesUser = async () => {
        await axios.get(serverUrl + "/getUnidadesMenores", {params:{id_usuario: id_usuario_actual}})
        .then(response=>{
            setUnidadesUsuario(response.data)
            console.log(unidadesUsuario)
        })
        .catch(error=>{
            alert(error.response.data.message);
        })
    };

    const abrirModalVerSala = (sala) => {
        console.log(sala);
        setSalaActual(sala);
        setModalVerSala(true);
    }


    
    const salasGet = async (event) =>{
        axios.get(serverUrl+'/getAllSalasByIdUsuario',{params:{id_usuario: id_usuario_actual}} )
          .then(response => {
            setLoading(true);
            setListaSalas(response.data);
            setFilterListaSalas(response.data);
            setListaSalasPag(_(response.data).slice(0).take(pageSize).value());
        }).catch (error => {
            setListaSalas([]);
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
        axios.get(
            serverUrl + "/getpdfSalas",
            {
                params: {id_usuario: id_usuario_actual, periodo: nombrePeriodo},
                responseType: 'blob'
            },
        ).then((response) => {
            setFile(response.data);
        })
        window.open(URL.createObjectURL(file));
    }


 
  const seleccionarPeriodo = async (event) =>{
    setNombrePeriodo(event.target.value);
    setLoading(false);
    salasGet();
    };

    const filterSala = () => {
        const keyword = codSalaFiltro
        // filter();
        let results = []
        if (keyword !== '') {
            console.log(filtroSalaText)
            for(let i = 0 ; i<listaSalas.length ; i++){
                if(listaSalas[i][0].toLowerCase().startsWith(keyword.toLowerCase())){
                    results.push(listaSalas[i])
                }
            }
        } else {
            results = listaSalas;
        }
        let results2 = []
        if (String(unidadFiltro) === "-1"){results2 = results;}
        else{
            console.log(results[3])
            for(let i = 0 ; i<results.length ; i++){
                if(String(results[i][8]) === String(unidadFiltro)){
                    results2.push(listaSalas[i]);
                }
            }
        }

        setFilterListaSalas(results2);
        setListaSalasPag(_(results2).slice(0).take(pageSize).value());
    };

if (isLoading){
    return (  
        <Container className="fondoUnidadAcademica" fluid>
            <Container className="UnidadAcademica" fluid>
                <div className="Example">
                <Row className="mb-0">
                    <Col sm={8}><h3>Informe de Salas</h3></Col>
                    <Col className='d-grid gap-2' sm={4}><Button onClick={downloadPDF}>DescargarPDF</Button></Col>
                </Row>

                <Row className='p-3 mb-2'>
                    <Col sm={3}>
                        <Form.Label>Código Sala:</Form.Label>
                        <FormControl placeholder="Buscador # sala" value={codSalaFiltro} onChange={(event) => {setCodSalaFiltro(event.target.value)}}/>
                    </Col>
                    <Col sm={4}>
                        <Form.Label>Unidad:</Form.Label>
                        <Form.Select onChange={(event) => setUnidadFiltro(event.target.value)}>
                            <option value={-1}>Todas las Unidades</option>
                            {unidadesUsuario.map((unidad) => {
                                return (
                                    <option value={unidad[1]} key={unidad.id}>{unidad[1]+"-"+unidad[0]}</option>
                                )
                            })}
                        </Form.Select>
                    </Col>
                </Row>

            <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Código Sala</th>
                            <th>Descripción</th>
                            <th>Capacidad</th>
                            <th>Tipo</th>
                            <th>Unidad</th>
                            <th>Opción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaSalasPag.map((sala, indexS) => {
                            return <tr className='p-2' key={sala["sala "+ sala[0]]}>
                                <td className='p-2' key={"cod"+sala[0]}>{sala[0]}</td>
                                <td className='p-2' key={"desc"+sala[0]}>{sala[2]}</td>
                                <td className='p-2' key={"cap"+sala[0]}>{sala[1]}</td>
                                <td className='p-2' key={"tipo"+sala[0]}>{sala[22]}</td>
                                <td className='p-2' key={"cod_uni"+sala[0]}>{"["+sala[8]+"] "+sala[21]}</td>
                                <td className="text-center p-2" key={"option"+sala[0]}>
                                    <Button onClick={() => {abrirModalVerSala(sala)}} size='sm' variant="primary" >Ver más</Button>{' '}
                                </td>
                            </tr>
                        }
                        )}
                    </tbody>
                </Table>

                <ModalVerSala show={modalVerSala} sala={salaActual} onHide={() => setModalVerSala(false)}/>
                </div>
                <div id="pages">
                <Paginacion
                    itemsCount={filterListaSalas.length}
                    itemsPerPage={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    alwaysShown={false}
                    trigger={trigger}
                    />
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
                        <span>Cargando Informe de Salas </span> 
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

export default InformeSala;