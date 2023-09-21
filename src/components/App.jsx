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
                    <div className='bg-info' style={{width:"80%" , height:"90vh"}}>
                        Retiradas
                    </div>
                </Container>
            </Tab>
            <Tab eventKey="devol" title="Devoluções">
            <Container className="p-0 d-flex justify-content-center" >
                    <div className='bg-info' style={{width:"80%" , height:"90vh"}}>
                        Devoluções
                    </div>
                </Container>
            </Tab>
            <Tab eventKey="config" title="Configurações">
            <Container className="p-0 d-flex justify-content-center" >
                    <div className='bg-info' style={{width:"80%" , height:"90vh"}}>
                        Configurações
                    </div>
                </Container>
            </Tab>
          </Tabs>
        </Container>
      </header>
    </div>
  );
}

export default Appx;
