import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Router from './routes/Router.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './components/MyNavbar';
import { Col, Row } from 'react-bootstrap';
import MySidebar from './components/MySidebar';
import Cookies from 'universal-cookie';
import Login from './components/login';
import Sectores from './views/Sectores';
import Router2 from './routes/Router2';
const conectado = new Cookies();

const root = ReactDOM.createRoot(document.getElementById('root'));
var usuario = conectado.get('nombre');
if(usuario != null){
    root.render(    
        <div>
            <MyNavbar/>
            <Row className='fila'>
            <MySidebar/>
                <Col className='columna'>
                    <React.StrictMode>
                        <Router />
                    </React.StrictMode>
                </Col>
            </Row>
        </div>
    );
}


else{
    root.render(    
        <div>
            <MyNavbar/>
            <Row className='fila'>
                <Col className='columna' text-center>
                    <React.StrictMode>
                        <Router2 />
                    </React.StrictMode>
                </Col>   
            </Row>
        </div>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
