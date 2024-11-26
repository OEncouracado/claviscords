import React, { useState } from 'react';
import { Button, Container, Modal, Tab, Tabs } from 'react-bootstrap';
import Claviculario from '../components/home';
import logo from "../images/logo.png";
import "../App.css"
import Registros from './home/registros';
import Config from './home/Config';

function Appx() {
  const [show, setShow] = useState(false)
  const handleClose = () => {
    localStorage.removeItem('token');
    setShow(false);
    window.location.reload();
  }
  return (<>
  <Button className='fechar' variant='danger' onClick={() => setShow(true)}>X</Button>
    <div className="App">
      <header className="App-header">
        <img className='logomarca mt-1 mb-0' src={logo} alt='claviscord logo'/>
        <Container className="cont-geral px-0">

          <Tabs
            defaultActiveKey="home"
            id="tabs"
            className="mb-1"
            justify
          >
            <Tab eventKey="home" title="Claviculário" >
                <Container className="p-0 d-flex justify-content-center" >
                    <Claviculario/>
                </Container>

            </Tab>
            <Tab eventKey="retir" title="Retiradas">
                <Container className="p-0 d-flex justify-content-center" >
                      <Registros tipo={'retirada'}/>
                </Container>
            </Tab>
            <Tab eventKey="devol" title="Devoluções">
            <Container className="p-0 d-flex justify-content-center" >
                      <Registros tipo={'devolucao'}/>
                </Container>
            </Tab>
            <Tab eventKey="config" title="Configurações">
            <Container className="p-0 d-flex justify-content-center" >
                      <Config />
                </Container>
            </Tab>
          </Tabs>
        </Container>
        <p className='desenvpor' >Desenvolvido por: <a href="https://mavsleo.com.br" target="_blank" rel="noopener noreferrer">MAVsLEO &copy; </a>• 2016 </p>
      </header>
      
    </div>
    <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
        className='text-white'
      >
        <Modal.Header closeButton>
          <Modal.Title>Você está saindo do Programa...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Clique em "Sair" para sair do programa
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Sair
          </Button>
          <Button variant="primary" onClick={() => setShow(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
  </>);
}

export default Appx;
