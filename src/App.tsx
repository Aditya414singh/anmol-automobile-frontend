import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";

import Login from "./pages/Login";
import Register from "./pages/Register";

import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerVehicles from "./pages/manager/ManagerVehicles";
import AddVehicle from "./pages/manager/AddVehicle";
import VehicleDetails from "./pages/VehicleDetails";

import ManagerRoute from "./components/ManagerRoute";
import EditVehicle from "./pages/manager/EditVehicle";
import ManagerTestimonials from "./pages/manager/ManagerTestimonials";
import ManagerDeliveries from "./pages/manager/ManagerDeliveries";
import AddDelivery from "./pages/manager/AddDelivery";
import Deliveries from "./pages/Deliveries";
import ManagerFeatured from "./pages/manager/ManagerFeatured";
import AddFeatured from "./pages/manager/AddFeatured";
import EditFeatured from "./pages/manager/EditFeatured";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>

          <div className="min-h-screen bg-white">

            <Navbar />

            <Routes>

              {/* Public Pages */}

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/vehicles"
                element={<Vehicles />}
              />

              <Route
                path="/vehicles/:id"
                element={<VehicleDetails />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              {/* Manager Pages */}

              <Route element={<ManagerRoute />}>

                <Route
                  path="/manager/dashboard"
                  element={
                    <ManagerDashboard />
                  }
                />

                <Route
                  path="/manager/vehicles"
                  element={
                    <ManagerVehicles />
                  }
                />

                <Route
                  path="/manager/vehicles/add"
                  element={
                    <AddVehicle />
                  }
                />
                <Route
                  path="/manager/vehicles/:id/edit"
                  element={<EditVehicle />}
                />
                <Route
                  path="/manager/testimonials"
                  element={<ManagerTestimonials />}
                />
                <Route
                  path="/manager/deliveries"
                  element={<ManagerDeliveries />}
                />

                <Route
                  path="/manager/deliveries/add"
                  element={<AddDelivery />}
                />
                <Route
                  path="/deliveries"
                  element={<Deliveries />}
                />
                <Route
                  path="/manager/featured"
                  element={<ManagerFeatured />}
                />
                <Route
                  path="/manager/featured/add"
                  element={<AddFeatured />}
                />

                <Route
                  path="/manager/featured/:id/edit"
                  element={<EditFeatured />}
                />

              </Route>

            </Routes>

            <Footer />

          </div>

        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;