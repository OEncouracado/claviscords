import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Image } from 'react-bootstrap'
import './index.css'
import logo from "../../images/logo.png"
import axios from 'axios';

function Login() {
  const [nome , setNome] = useState('');
  const [senha , setSenha] = useState(''); // eslint-disable-next-line
  const [mensagem, setMensagem] = useState('');// eslint-disable-next-line
  const [tipoMensagem, setTipoMensagem] = useState('');// eslint-disable-next-line

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        setMensagem('');
        setTipoMensagem('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios" , {nome , senha })
    .then ((response)=>{
      console.log(response)
    })
  }


  return (
    
    <div className="backG d-flex align-items-center justify-content-center">
    <Container className='contlogin border rounded border-dark' >
      <Form className="d-flex flex-column align-items-center m-3" onSubmit={handleSubmit}>
        <Image className='imagelogin' src={logo} rounded />
        <Form.Group>
            <Form.Label>Usuário</Form.Label>
            <Form.Control
                className="mb-2"
                type="text"
                placeholder="Usuário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />
        </Form.Group>
        <Form.Group>
            <Form.Label>Senha</Form.Label>
            <Form.Control
            className="mb-2"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            />
        </Form.Group>
        <Button type="submit" >Entrar</Button>
      </Form>
    </Container>
    </div>
  )
}

export default Login
