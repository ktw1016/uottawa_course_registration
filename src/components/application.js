import _ from 'lodash';
import React from 'react';
import Home from './home.js';
import AddCourse from './add_course.js';
import {
  Switch,
  Route
} from "react-router-dom";

export default class Application extends React.Component {
  render() {
    return <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/add-course" component={AddCourse} />
      </Switch>
    </div>
  }
}