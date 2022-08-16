import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuscadorSala from '../views/BuscadorSala.js';
import Login from '../components/login.js';
import Sectores from '../views/Sectores.js';

function Router2() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path="/BuscadorSala" element={<BuscadorSala/>}/>
                <Route path="/Sectores" element={<Sectores/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Router2;