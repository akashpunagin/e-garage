import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { AuthProvider } from "../contexts/Auth";

function App() {
  return (
    <div>
      <h1>e garrage</h1>
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Dashboard}></Route>
            <Route path="/signup" component={SignUp}></Route>
            <Route path="/login" component={Login}></Route>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
