import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { SignUp } from "./auth/SignUp";
import { Login } from "./auth/Login";
import { Dashboard } from "./Dashboard";
import { AuthProvider } from "../contexts/Auth";
import { PrivateRoute } from "./PrivateRoute";
import React from "react";

function App() {
  return (
    <React.Fragment>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard}></PrivateRoute>
            <Route path="/signup" component={SignUp}></Route>
            <Route path="/login" component={Login}></Route>
          </Switch>
        </AuthProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
