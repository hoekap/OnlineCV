import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import ProjectElement from "../project/ProjectElement";
import Modal from "../utils/Modal";
import { moveProjectUp, moveProjectDown, deleteProject, updateProjectHeader }
from "../../actions/projectActions";

function mapDispatchToProps(dispatch) {
  return {
    moveProjectUp: (index) => dispatch(moveProjectUp(index)),
    moveProjectDown: (index) => dispatch(moveProjectDown(index)),
    deleteProject: (index) => dispatch(deleteProject(index)),
    updateHeader: (header) => dispatch(updateProjectHeader(header))
  };
}

const mapStateToProps = state => {
  return {
    projects: state.project.projects,
    moving: state.project.moving,
    header: state.project.header
  };
};

class Projects extends Component {
  constructor () {
    super();
    this.state = {
      header: "",
      toRemove: null
    };
  }

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.updateHeader(this.state.header);
  };

  setToBeRemoved = (index) => {
    this.setState({toRemove: index});
  }

  onRemoval = () => {
    this.props.deleteProject(this.state.toRemove);
    this.setState({toRemove: null});
  }


  render () {
    return (
      <main className="py-md-4 pl-md-5">
        <Modal title="Confirm remove action" target={this.state.toRemove !== null ?
        this.props.projects[this.state.toRemove].title : ""}
        confirm={this.onRemoval} />
        <h1>Your projects</h1>
        <div className="container-fluid my-2">
          {this.props.projects.map((project, i) =>
            <ProjectElement key={project.id}
            name={project.title}
            moveUp={this.props.moveProjectUp}
            moveDown={this.props.moveProjectDown}
            setRemoved={this.setToBeRemoved}
            index={i} moving={this.props.moving}
            length={this.props.projects.length} />
          )}
        </div>
        <Link to="/projects/add"
        className="btn btn-lg btn-primary">Add a new project</Link>

        <h1 className="py-md-4">Your project settings</h1>
        <form onSubmit={this.onSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputHeader">Header shown to users</label>
              <input type="text" className="form-control" id="header"
              placeholder="Header" onChange={this.onChange} value={this.state.header}/>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="headerCurrent">Current header</label>
              <span className="form-control-plaintext"
              id="headerCurrent">{this.props.header}</span>
            </div>
          </div>
          <div className="form-row">
            <button type="submit" className="btn btn-lg btn-primary">Save header</button>
          </div>
        </form>
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
