import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // eslint-disable-next-line
import Appx from './components/App.jsx';
import Login from './components/home/login';

function App() {

  const isToken = localStorage.getItem('token');
  console.log(isToken)
  return (<>
  
  {isToken ? <Appx/>: <Login/>}
  </>);
}

export default App;
