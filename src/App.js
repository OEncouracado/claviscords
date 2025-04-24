import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // eslint-disable-next-line
import Appx from './components/App.jsx'; // eslint-disable-next-line
import Login from './components/home/login';
import { useAuth } from './context/AuthContext.jsx';
import Login2 from './components/home/login copy.jsx';

function App() {
// eslint-disable-next-line
  const isToken = localStorage.getItem('token');
  
  const {session} = useAuth();
  return (<>
    {session ? <Appx/> : <Login2/>}
  {/* {isToken ? <Appx/>: <Login/>} */}
  </>);
}

export default App;
