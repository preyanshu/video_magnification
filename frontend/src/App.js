import logo from './logo.svg';
import './App.css';
import Uploadwidget from './Components/Uploadwidget';
import Machinehealth from './Components/Machinehealth';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import Home from './Components/Home';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Support from './Components/Support';
import Feedback from './Components/Feedback';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
    {/* <Uploadwidget></Uploadwidget> */}
    <Route exact path="/machinehealth" element={<Machinehealth ></Machinehealth>} />
    <Route exact path="/" element={<Home></Home>} />
    <Route exact path="/signup" element={<Signup ></Signup>} />
    <Route exact path="/login" element={<Login></Login>} />
    <Route exact path="/feedback" element={<Feedback></Feedback>} />
    <Route exact path="/support" element={<Support></Support>} />


    </Routes>

    </div>
    </Router> );
}

export default App;
