import './add_course.scss';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom'
import { courses } from '../courses';
import Logo from "./uottawa_hor_white.png";

export default class AddCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
    };
  }
  render() {
    const { query } = this.state
    const filtered_courses = _.chain(courses)
      .pickBy((course, course_code) => query.length > 2 && _.includes(course_code, query))
      .value();

    return <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{backgroundColor: "#6A0000"}}>
        <img id="logo" src={Logo}></img>
        <span id="title">UOttawa Course Selection System</span>
      </div>
      <Link exact to="/" > ← Back to timetable </Link>
      {/*<div className="side">
        <Link style={{fontWeight:"bold"}} className="sideBar">Home</Link><br></br>
        <Link className="sideBar">My Requirnment</Link><br></br>
        <Link className="sideBar">Ask for help</Link><br></br>
      </div>*/}
      <div className="main">
        <span
            style={{fontSize: 30 ,marginLeft:"1%"}}
            dangerouslySetInnerHTML={{
            __html: `<b>Add course</b>`
            }} />
          <div className="d-flex justify-content-center">
            <div className="border-container col-md-5 d-flex justify-content-center text-center">
              <span
              style={{fontSize: 30, paddingRight: 30}}
              dangerouslySetInnerHTML={{
              __html: `Search for course: `
                }} />
              <input
                type="text"
                placeholder="Example: SEG3125"
                // only search when query string length > 2 and uppercase the query, remove all whitespace
                onChange={(evt) =>
                  this.setState({
                    query: evt.target.value.length > 2 ?
                      _.upperCase(evt.target.value.replace(/\s/g, '')) :
                      ""
                  })}
              />
            </div>
          </div>
          <span
            style={{fontSize: 30}}
            dangerouslySetInnerHTML={{
            __html: `<b>Results</b>`
            }} />
          <span
            style={{fontSize: 15}}
            dangerouslySetInnerHTML={{
            __html: `<i>Showing ${_.keys(filtered_courses).length} course(s)</i>`
            }} />
          <div className="d-flex justify-content-center">
            <div className="border-container col-md-12 d-flex justify-content-center text-center">
            </div>
          </div>
        </div>
    </div>
  }
}
