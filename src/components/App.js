import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { SignUp } from "./auth/SignUp";
import { Login } from "./auth/Login";
import { Dashboard } from "./dashboard/Dashboard";
import { Customer } from "./dashboard/customer/Customer";
import { History } from "./dashboard/history/History";
import { Item } from "./dashboard/item/Item";

import { Vehicle } from "./dashboard/vehicle/Vehicle";
import { Worker } from "./dashboard/worker/Worker";

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
            <PrivateRoute
              exact
              path="/customer"
              component={Customer}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path="/history"
              component={History}
            ></PrivateRoute>
            <PrivateRoute exact path="/item" component={Item}></PrivateRoute>
            <PrivateRoute
              exact
              path="/vehicle"
              component={Vehicle}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path="/worker"
              component={Worker}
            ></PrivateRoute>
            <Route path="/signup" component={SignUp}></Route>
            <Route path="/login" component={Login}></Route>
          </Switch>
        </AuthProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
