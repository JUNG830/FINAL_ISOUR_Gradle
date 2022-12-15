import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './1. Main/Main';
import Login from './2. Login/Login';
import SignUp from './3. SignUp/SignUp';
import '../src/App.css';
import LoginUser from './App_Navbar';
import FindInfo from './2. Login/FindInfo';
import Mouse from './Mouse/Mouse';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/*' element={<LoginUser />} />
        <Route path='/FindInfo' element={<FindInfo />} />
      </Routes>
    </Router>
  );
}

export default App;