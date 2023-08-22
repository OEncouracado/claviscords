import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Container className="cont-geral">
        <Tabs
          defaultActiveKey="profile"
          id="justify-tab-example"
          className="mb-3"
          justify
        >
          <Tab eventKey="home" title="Home">
            Tab content for Home
          </Tab>
          <Tab eventKey="profile" title="Profile">
            Tab content for Profile
          </Tab>
          <Tab eventKey="longer-tab" title="Loooonger Tab">
            Tab content for Loooonger Tab
          </Tab>
          <Tab eventKey="contact" title="Contact">
            Tab content for Contact
          </Tab>
        </Tabs>
      </Container>
      </header>
    </div>
  );
}

export default App;
