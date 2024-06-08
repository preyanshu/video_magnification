
import './App.css';

import Machinehealth from './Components/Machinehealth';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";



function App() {
  return (
    <Router>
    <div className="App">
      <Routes>

    <Route exact path="/" element={<Machinehealth ></Machinehealth>} />



    </Routes>

    </div>
    </Router> );
}

export default App;
