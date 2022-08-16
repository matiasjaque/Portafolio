import React from 'react'
import {Nav, NavDropdown,  Navbar, Container} from "react-bootstrap";
import Cookies from 'universal-cookie';
import '../c_styles/MyNavbar.css';

const conectado = new Cookies();

 
var usuario = conectado.get('nombre');

function cerrarSesion(){
    console.log("cerrandoSesion");
    conectado.remove('id', {path:"/"});
    conectado.remove('nombre',{path:"/"});
    window.location.replace("/");
}


function MyNavbar(){
    console.log(usuario);
    if (usuario != null) {
        return(
            <div className="Navbar">
                <Navbar collapseOnSelect expand="lg" bg="light" className='Navbar-def'>
                    <Container>
                    <Navbar.Brand href="/">
                    <img
                        src={require('../assets/Registro_color.png')}
                        height="33"
                        className="logo"
                        href = "/"
                        alt="logoRegistro3"
                        />
                    Asignación de Salas 2.0
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav>
                        <Nav.Link href="/">INICIO</Nav.Link>
                        <Nav.Link href='/BuscadorSala'>BUSCADOR DE SALAS</Nav.Link>
                        <Nav.Link href='/Sectores'>SECTORES</Nav.Link>
                        
                        <NavDropdown title= {usuario} id="collasible-nav-dropdown">
                            <NavDropdown.Item href='/Perfil'>Ver perfil</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={()=>cerrarSesion()}>Cerrar sesión</NavDropdown.Item>
                        </NavDropdown>
                        
                        <img
                        alt="logoregistro1"
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        className="img-fluid mx-auto"
                        style={{ maxWidth: '2.5rem' }}
                        />
                    </Nav>
                    </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );

    }
    else {
        return(
            <div className="Navbar">
                <Navbar collapseOnSelect expand="lg" bg="light" className='Navbar-def'>
                    <Container>
                    <Navbar.Brand >
                    <img
                        alt="logoRegistro2"
                        src={require('../assets/Registro_color.png')}
                        height="33"
                        className="logo"
                        />
                    Asignación de Salas 2.0
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav>
                        <Nav.Link href='/BuscadorSala'>BUSCADOR DE SALAS</Nav.Link>
                        <Nav.Link href='/Sectores'>SECTORES</Nav.Link>
                        <Nav.Link href='/'>INICIAR SESIÓN</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
    

}
export default MyNavbar;