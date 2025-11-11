import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import MainLayout from "./pages/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App
