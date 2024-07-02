import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Fragment } from "react";

import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import Login from "./pages/Auth/Login";

import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./pages/Dashboard/Home";




function App(props) {
  return (
    <Router>
      <Fragment>
        <Routes>
         
          <Route exact path="/" element={<Login />} />
        


          <Route path="/" element={<ProtectedRoute />}>
               <Route exact path="/home" element={<Home />} />
          </Route>



        </Routes>
        <ToastContainer />
      </Fragment>
    </Router>
  );
}

export default App;
