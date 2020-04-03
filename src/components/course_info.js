import './course_info.scss';
import React from 'react';
import _ from 'lodash';
import { courses } from '../courses.js';
import { Link } from 'react-router-dom'
import { useParams } from "react-router-dom";
import Logo from "./uottawa_hor_white.png";

const course_type_map = {
  lecture: "Lecture",
  lab: "Lab",
  tutorial: "Tutorial",
}

export const CourseTimeSlots = ({classes, show_all_classes}) => {
  const classes_by_type = _.reduce(classes, (result, cls) => {
    result[cls.type] = result[cls.type] ? _.concat(result[cls.type], [cls]) : [cls]
    return result;
  }, {});

  return <div className="d-flex flex-column">
    {_.map(classes_by_type, (type_classes, type) => {
      return <div className="d-flex flex-column" style={{paddingBottom: 40}}>
        <span style={{ border: "1px solid black", padding: 5, borderRadius: 10 }}> {course_type_map[type]} </span>
        <table>
          <thead>
          <tr>
            <th colSpan={2} style={{ padding: "0px 50px 0px 10px" }}> Time </th>
            <th> Location </th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {_.map(type_classes, ({ type, day, time, location, registered }) =>
          show_all_classes ? <tr>
              <td style={{ padding: "0px 50px 0px 10px" }}> {day} </td>
              <td style={{ padding: "0px 100px 0px 0px" }}> {time} </td>
              <td> {location} </td>
              {type !== "lecture" &&
                <td> <input type="radio" name={type} defaultChecked={registered} value={`${day}_${time}_${location}`} /> </td>}
            </tr>
              : registered && <tr>
              <td style={{ padding: "0px 50px 0px 10px" }}> {day} </td>
              <td style={{ padding: "0px 100px 0px 0px" }}> {time} </td>
              <td> {location} </td>
              </tr>
          )}
        </tbody>
      </table>
        </div>
    })}
  </div>
}

export function CourseInfo() {
  const { course_id } = useParams();
  const course_code = _.split(course_id, '_')[0];
  const section = _.split(course_id, '_')[1];
  const current_course = courses[course_code];
  const current_course_section = _.find(current_course.classes, cls => cls.section === section);

  return <div className="d-flex flex-column">
    <div>
      <div style={{backgroundColor: "#6A0000"}}>
        <img id="logo" src={Logo}></img>
        <span id="title">UOttawa Course Selection System</span>
      </div>
    </div>
    <Link exact to="/"> ← Back to timetable </Link>
    <span
      style={{fontSize: 30, marginLeft:"1%"}}
      dangerouslySetInnerHTML={{
        __html: `<b> ${course_code} - ${current_course.name} </b>`,
      }} />
    <div className="container-header">
      {`Section ${section}`}
      <Link>
        <button style={{ backgroundColor: "#b3ffd9", maxWidth: "100%", borderRadius: "10px" }} className="col-md-2">
          <b>Swap Section</b>
        </button>
      </Link>
    </div>
    <div className="course-info-container">
      <div className="d-flex justify-content-center">
        <CourseTimeSlots classes={current_course_section.section_classes} show_all_classes={false} />
      </div>
    </div>

  </div>
};
