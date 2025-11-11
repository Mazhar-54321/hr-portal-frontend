import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Registration";

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App
