import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import MainLayout from "./pages/MainLayout";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
// import EmployeesPage from "./pages/EmployeesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Employee from "./pages/Employee";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route element={<ProtectedAuthRoute />}>
        <Route index element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <RoleProtectedRoute allowedRoles={["Admin", "Editor"]}>
                <Employee />
              </RoleProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
