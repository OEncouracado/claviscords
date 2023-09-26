import React from 'react'
import { Button, Container, Form, Image } from 'react-bootstrap'
import './index.css'
import logo from "../../images/logo.png"

function Login() {
  return (
    <div className="backG d-flex align-items-center justify-content-center">
    <Container className='contlogin border rounded border-dark' >
        <Form className="d-flex flex-column align-items-center m-3" onSubmit="handleSubmit">
        <Image className='imagelogin' src={logo} rounded />
        <Form.Group>
            <Form.Label>Usuário</Form.Label>
            <Form.Control
                className="mb-2"
                type="text"
                placeholder="Usuário"
                value="{username}"
                onChange="{(e) => setUsername(e.target.value)}"
            />
        </Form.Group>
        <Form.Group>
            <Form.Label>Senha</Form.Label>
            <Form.Control
            className="mb-2"
            type="password"
            placeholder="Senha"
            value="{password}"
            onChange="{(e) => setPassword(e.target.value)}"
            />
        </Form.Group>
        <Button type="submit">Entrar</Button>
        </Form>
    </Container>
    </div>
  )
}

export default Login
