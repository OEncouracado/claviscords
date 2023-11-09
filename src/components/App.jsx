import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import Claviculario from '../components/home';
import logo from "../images/logo.png";
import "../App.css"

function Appx() {
  return (
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
                    <div className='' style={{width:"80%" , height:"100%"}}>
                      Retiradas
                    </div>
                </Container>
            </Tab>
            <Tab eventKey="devol" title="Devoluções">
            <Container className="p-0 d-flex justify-content-center" >
                    <div className='bg-info' style={{width:"80%" , height:"100%"}}>
                        Devoluções
                    </div>
                </Container>
            </Tab>
            <Tab eventKey="config" title="Configurações">
            <Container className="p-0 d-flex justify-content-center" >
                    <div className='bg-info' style={{width:"80%" , height:"100%"}}>
                        Configurações
                    </div>
                </Container>
            </Tab>
          </Tabs>
        </Container>
        <p className='desenvpor' >Desenvolvido por: <a href="https://mavsleo.com.br" target="_blank" rel="noopener noreferrer">MAVsLEO &copy; </a>• 2016 </p>
      </header>
      
    </div>
  );
}

export default Appx;
