import React from 'react';
import Dash from '../views/Dash.js';
import UnidadAcademica from '../views/UnidadAcademica.js';
import Usuarios from '../views/Usuarios.js';
import Avisos from '../views/Avisos.js'
import MantenedorSalas from '../views/MantenedorSalas.js';
import Sectores from '../views/Sectores.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlanEstudio from '../views/PlanEstudio.js';
import BuscadorSala from '../views/BuscadorSala.js';
import Perfil from '../views/Perfil.js';
import InformeSala from '../views/InformeSala';
import InformeUnidad from '../views/InformeUnidad.js';
import InformeEstadistico from '../views/InformeEstadistico.js';
import Solicitudes from '../views/Solicitudes.js';
import SolicitudesAdmin from '../views/SolicitudesAdmin.js';
import VerSolicitud from '../views/VerSolicitud.js';
import CrearSolicitud from '../views/CrearSolicitud.js';
import Roles from '../views/Roles.js';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path= "/" element={<Dash/>}/>
                <Route path= "/unidad-academica" element={<UnidadAcademica/>}/>
                <Route path= "/planEstudio" element={<PlanEstudio/>}/>
                <Route path="/usuarios" element={<Usuarios/>}/>
                <Route path="/informe-salas" element={<InformeSala/>}/>
                <Route path="/informe-unidades" element={<InformeUnidad/>}/>
                <Route path="/informe-estadistico" element={<InformeEstadistico/>}/>
                <Route path="/avisos" element={<Avisos/>}/>
                <Route path="/salas" element={<MantenedorSalas/>}/>
                <Route path="/Sectores" element={<Sectores/>}/>
                <Route path='/roles' element={<Roles/>}/>
                <Route path="/BuscadorSala" element={<BuscadorSala/>}/>
                <Route path="/Perfil" element={<Perfil/>}/>
                <Route path="/solicitudes" element={<Solicitudes/>}/>
                <Route path="/responderSolicitudes" element={<SolicitudesAdmin/>}/>
                <Route path="/verSolicitud" element={<VerSolicitud/>}/>
                <Route path='/crearSolicitud' element={<CrearSolicitud/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;