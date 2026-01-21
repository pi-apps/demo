import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Escrow from './Escrow';
import Reputation from './Reputation';
import DisputeForm from './DisputeForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/escrow" element={<Escrow />} />
        <Route path="/reputation" element={<Reputation />} />
        <Route path="/dispute" element={<DisputeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
