import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PantryDashboard from "./pages/PantryDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute allowedrole = {['Manager']}><Dashboard /></PrivateRoute> } />
        <Route path="/pantry-dashboard" element={<PrivateRoute allowedrole = {['Pantry']} > <PantryDashboard /> </PrivateRoute> } />
        <Route path="/delivery-dashboard" element={<PrivateRoute allowedrole = {['Delivery']}> <DeliveryDashboard /> </PrivateRoute> } />
        

      </Routes>
    </Router>
  );
}

export default App;
