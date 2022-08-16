import React , { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from 'axios';
import Cookies from 'universal-cookie';
import "../c_styles/login.css";

const serverUrl = process.env.REACT_APP_SERVER;

const conectado = new Cookies();
class Login extends Component {

    state={
        form:{
            username: '',
            password: ''
        }
    }

    handleChange=async e=>{
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    iniciarSesion=async (e) =>{
        // conectado.set('id',1,{path:"/"});
        // conectado.set('nombre',"Victor",{path:"/"});
        // console.log(conectado);
        e.preventDefault();

        await axios.get(serverUrl + "/doLogin", {params:{nombre: this.state.form.username, contrasena: this.state.form.password}})
        .then(response=>{
            console.log(response.data);
            conectado.set('id',response.data.user[0],{path:"/"});
            conectado.set('nombre',response.data.user[1],{path:"/"})
            console.log(conectado);
            window.location.replace("/")
        })
        .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        })
    }

    render() {
        return (
            <div id="login" style={{width: '100%'}}>
                <Form onSubmit={this.iniciarSesion}>
                    <h1>Iniciar sesión</h1>

                    <Form.Group className="login-form mb-3" controlId="formBasicEmail">
                        <Form.Control class="login-form" type="username" placeholder="Usuario" name="username" onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group className="login-form mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Contraseña" name="password" onChange={this.handleChange}/>
                    </Form.Group>

                    <Button type="submit" id="login_button" variant="primary">
                        Ingresar
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Login;