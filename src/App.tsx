import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { Clips } from "./dashboard/Clips";
import { Charts } from "./dashboard/Charts";
import { Resources } from "./dashboard/Resources";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="clips" element={<Clips />} />
        <Route path="charts" element={<Charts />} />
        <Route path="resources" element={<Resources />} />
      </Route>
    </Routes>
  );
}
