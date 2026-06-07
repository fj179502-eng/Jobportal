import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Sidebar from "./pages/sidebar";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard";
import AddCompany from "./pages/add-company";
import ViewCompany from "./pages/view-company";
import UpdateCompany from "./pages/update-company";
import AddJob from "./pages/add-job";
import ViewJob from "./pages/view-job";
import UpdateJob from "./pages/update-job";
import AddApplication from "./pages/add-application";
import ViewApplication from "./pages/view-application";
import UpdateApplication from "./pages/update-application";
import AddProfile from "./pages/add-profile";
import ViewProfile from "./pages/view-profile";
import UpdateProfile from "./pages/update-profile";
import AddSaveJob from "./pages/add-saveJob";
import ViewSaveJob from "./pages/view-saveJob";
import UpdateSaveJob from "./pages/update-saveJob";
import AddCategory from "./pages/add-category";
import ViewCategory from "./pages/view-category";
import UpdateCategory from "./pages/update-category";

function AppContent() {
  const [sidebarOpen,setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const hideSidebarPaths=["/","/login","/registration"];
  const isSidebarHidden = hideSidebarPaths.includes(location.pathname.toLocaleLowerCase()); 
  return (
    <AuthProvider>
        {!isSidebarHidden && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/add-company" element={<ProtectedRoute><AddCompany/></ProtectedRoute>} />
        <Route path="/view-company" element={<ProtectedRoute><ViewCompany/></ProtectedRoute>}/>
        <Route path="/update-company/:id" element={<ProtectedRoute><UpdateCompany/></ProtectedRoute>} />
        <Route path="/add-job" element={<ProtectedRoute><AddJob/></ProtectedRoute>} />
        <Route path="/view-job" element={<ProtectedRoute><ViewJob/></ProtectedRoute>}/>
        <Route path="/update-job/:id" element={<ProtectedRoute><UpdateJob/></ProtectedRoute>} />
        <Route path="/add-application" element={<ProtectedRoute><AddApplication/></ProtectedRoute>} />
        <Route path="/view-application" element={<ProtectedRoute><ViewApplication/></ProtectedRoute>}/>
        <Route path="/update-application/:id" element={<ProtectedRoute><UpdateApplication/></ProtectedRoute>} />
        <Route path="/add-profile" element={<ProtectedRoute><AddProfile/></ProtectedRoute>} />
        <Route path="/view-profile" element={<ProtectedRoute><ViewProfile/></ProtectedRoute>}/>
        <Route path="/update-profile/:id" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>
        <Route path="/add-saveJob" element={<ProtectedRoute><AddSaveJob/></ProtectedRoute>} />
        <Route path="/view-saveJob" element={<ProtectedRoute><ViewSaveJob/></ProtectedRoute>}/>
        <Route path="/update-saveJob/:id" element={<ProtectedRoute><UpdateSaveJob/></ProtectedRoute>} />

         <Route path="/add-category" element={<ProtectedRoute><AddCategory/></ProtectedRoute>} />
        <Route path="/view-category" element={<ProtectedRoute><ViewCategory/></ProtectedRoute>}/>
        <Route path="/update-category/:id" element={<ProtectedRoute><UpdateCategory/></ProtectedRoute>} />

      </Routes>
    </AuthProvider>
  );
};
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

