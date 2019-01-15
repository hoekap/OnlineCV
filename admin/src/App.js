import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import { getCSRFToken } from "./actions/authActions";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Projects from "./components/layout/Projects";
import Users from "./components/layout/Users";

function mapDispatchToProps(dispatch) {
  return {
    getCSRFToken: () => dispatch(getCSRFToken())
  }
}

class App extends Component {
  componentDidMount() {
    this.props.getCSRFToken();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <h1 className="display-1 text-center w-100">OnlineCV</h1>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/projects" component={Projects} />
            <Route exact path="/users" component={Users} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect(null, mapDispatchToProps)(App);
