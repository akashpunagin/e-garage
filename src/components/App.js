import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { AuthProvider } from "../contexts/Auth";
import { PrivateRoute } from "./PrivateRoute";

function App() {
  return (
    <div>
      <h1>e garrage</h1>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard}></PrivateRoute>
            <Route path="/signup" component={SignUp}></Route>
            <Route path="/login" component={Login}></Route>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
