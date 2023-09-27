import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Image } from 'react-bootstrap'
import './index.css'
import logo from "../../images/logo.png"
import axios from 'axios';
import CryptoJS from 'crypto-js';

function Login() {
  const [nome , setNome] = useState('');
  const [senha , setSenha] = useState(''); // eslint-disable-next-line
  const [mensagem, setMensagem] = useState('');// eslint-disable-next-line
  const [tipoMensagem, setTipoMensagem] = useState('');// eslint-disable-next-line

  
  const decryptAES = (encryptedData, password) => {
    try {
      const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
      const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedData.data); // Modificação aqui

      const decryptedBytes = CryptoJS.AES.decrypt(
          { ciphertext: encryptedBytes },
          CryptoJS.enc.Utf8.parse(password),
          { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText); // Modificação aqui
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      return null;
    }
  };

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
    axios.post("https://hospitalemcor.com.br/claviscord/api/index.php?table=usuarios" , {nome , senha }, {timeout: 5000})
    .then(response => {
      try {
        console.log(response.data);
        // Descriptografa os dados
        const decryptedData = decryptAES(response.data, '0123456789ABCDEF0123456789ABCDEF');
        console.log('Login bem-sucedido', decryptedData);
        setMensagem(decryptedData.data);
        setTipoMensagem('success');
        const token = decryptedData.data.token;
        // localStorage.setItem('token', token);
        console.log(token);

      } catch (error) {
        console.error('Erro ao processar os dados:', error);
      }
    })
    .catch(error => {
      console.error('Erro ao obter as chaves:', error);
    });
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
