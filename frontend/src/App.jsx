import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Chat from "./component/Chat/Chat";
import Join from "./component/Join/Join";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Join} />
        <Route path="/chat" component={Chat} />
        <Redirect path="*" to="/" />
      </Switch>
    </Router>
  );
}

export default App;
