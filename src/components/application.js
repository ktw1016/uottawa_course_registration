import _ from 'lodash';
import React from 'react';
import Home from './home.js';
import AddCourse from './add_course.js';
import { CourseInfo } from './course_info.js';
import { SwapSection } from './swap_section.js';
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
        <Route exact path="/course-info/:course_id" children={<CourseInfo />} />
        <Route exact path="/swap-section/:course_id" children={<SwapSection />} />
      </Switch>
    </div>
  }
}