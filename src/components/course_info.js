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

export class ReactCourseTimeSlots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
    }
  }
  render() {
    const {
      classes,
      show_all_classes,
      conflict_courses,
      section_registered,
      registered_section_alphabet,
      course_code,
      section
    } = this.props;

    const { success } = this.state;

    const classes_by_type = _.reduce(classes, (result, cls) => {
      result[cls.type] = result[cls.type] ? _.concat(result[cls.type], [cls]) : [cls]
      return result;
    }, {});
    const get_conflict = (cls, cnflict_courses) =>
      _.reduce(cnflict_courses, (result, cnflict_course, cnflict_course_code) => {
        if (cls.day === cnflict_course.day && cls.time === cnflict_course.time) {
          result[cnflict_course_code] = cnflict_course;
        }
        return result;
      }, {});
  
    return <div style={{ marginTop: 20 }} className="d-flex flex-column text-left">
      {_.map(classes_by_type, (type_classes, type) => {
        return <div key={_.uniqueId()} className="d-flex flex-column" style={{paddingBottom: 40}}>
          <span key={course_type_map[type]} style={{ border: "1px solid black", padding: 5, borderRadius: 10 }}> {course_type_map[type]} </span>
          <table key={`table_${course_type_map[type]}`}>
            <thead key={`thead_${course_type_map[type]}`}>
            <tr key={`tr_${course_type_map[type]}`}>
              <th key={`th_${course_type_map[type]}_time`} colSpan={3} style={{ paddingLeft: "10px" }}> Time </th>
              <th key={`th_${course_type_map[type]}_loc`} style={{ paddingLeft: "100px" }}> Location </th>
            </tr>
            </thead>
            <tbody key={`tbody_${course_type_map[type]}`}>
            {_.map(type_classes, (cls) => 
              show_all_classes ?
                <tr>
                  <td key={_.uniqueId(cls.day)} style={{ paddingLeft: "10px" }}> {cls.day} </td>
                  <td key={_.uniqueId(cls.time)} style={{ paddingLeft: "10px" }}> {cls.time} </td>
                  <td key={_.uniqueId()} style={{ paddingLeft: "10px" }}>
                    <span
                      className="conflict-hover"
                      style={{
                        visibility: _.isEmpty(get_conflict(cls, conflict_courses)) ? "hidden" : "visible",
                      }}
                    >
                      conflict with other class
                       {
                        _.map(get_conflict(cls, conflict_courses), (cnflict_course, cnflict_course_code) => {
                          return <span className="conflict-hover-text">
                            <Link exact to={`/swap-section/${cnflict_course_code}`}>
                              Click to resolve conflict with {cnflict_course_code} {cnflict_course.type}
                            </Link>
                          </span>
                        })
                       }
                    </span>
                  </td>
                  <td key={_.uniqueId(cls.location)} style={{ paddingLeft: "100px" }}> {cls.location} </td>
                  <td key={`${cls.day}_${cls.time}_${cls.location}`}>
                    <input
                      style={{visibility: type === "lecture" ? "hidden" : "visible"}}
                      key={_.uniqueId(`${cls.day}_${cls.time}_${cls.location}`)}
                      type="radio"
                      name={`${section}_${type}`}
                      defaultChecked={cls.registered}
                      value={`${cls.day}_${cls.time}_${cls.location}`}
                      disabled={!_.isEmpty(get_conflict(cls, conflict_courses))}
                    />
                  </td>
              </tr>
                : cls.registered && <tr key={_.uniqueId()}>
                <td key={_.uniqueId(cls.day)} style={{ paddingLeft: "10px" }}> {cls.day} </td>
                <td key={_.uniqueId(cls.time)} style={{ paddingLeft: "10px" }}> {cls.time} </td>
                <td key={_.uniqueId() }></td>
                <td key={_.uniqueId(cls.location)} style={{ paddingLeft: "100px" }}> {cls.location} </td>
                <td key={_.uniqueId() }></td>
                </tr>
            )}
          </tbody>
          </table>
        </div>
      })}
      {show_all_classes &&
        <div className="d-flex flex-column">
          { success && <span className="d-flex justify-content-end" style={{ color: "green" }}> ✓ saved </span>}
          <div className="d-flex justify-content-end">
          <button
            style={{ backgroundColor: "#b3ffd9", maxWidth: "100%", borderRadius: "10px" }}
            className="col-md-2"
            onClick={() => {
              if (section_registered) { //SAVE
                _.forEach(courses[course_code].classes, section_obj => {
                  if (section_obj.section === section) {
                    _.forEach(section_obj.section_classes, cls => {
                      if (cls.type !== "lecture") {
                        const selected_cls = _.split(document.querySelector(`input[name="${section}_${cls.type}"]:checked`).value, '_');
                        cls.registered = cls.day===selected_cls[0] && cls.time===selected_cls[1] && cls.location===selected_cls[2];
                      }
                    })
                  }
                })
                this.setState({success: true})
              } else { //SWAP
                var temp_success = false;
                _.forEach(courses[course_code].classes, section_obj => {
                  if (section_obj.section_registered) {
                    section_obj.section_registered = false;
                    _.forEach(section_obj.section_classes, cls => {
                      cls.registered = false;
                    })
                  } else if (section_obj.section === section) {
                    section_obj.section_registered = true;
                    registered_section_alphabet(section);
                    _.forEach(section_obj.section_classes, cls => {
                      if (cls.type === "lecture") {
                        cls.registered = true;
                      } else {
                        const input_radio = document.querySelector(`input[name="${section}_${cls.type}"]:checked`);
                        if (!input_radio) {
                          alert(`Please select a timeslot for ${cls.type} component`);
                        } else {
                          const selected_cls = _.split(input_radio.value, '_');
                          cls.registered = cls.day === selected_cls[0] && cls.time === selected_cls[1] && cls.location === selected_cls[2];
                          temp_success = true;
                        }
                      }
                    })
                  }
                })
                this.setState({success: temp_success})
              }
            }}
          >
            { section_registered ? <b> SAVE </b> : <b> SWAP </b>}
          </button>
        </div>
      </div>
      }
    </div>
    }
}

export const CourseTimeSlots = ({ classes, show_all_classes, conflict_courses, section_registered, course_code, section }) => {
  return <ReactCourseTimeSlots
    classes={classes}
    show_all_classes={show_all_classes}
    conflict_courses={conflict_courses}
    section_registered={section_registered}
    course_code={course_code}
    section={section}
  />
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
      <Link exact to={`../swap-section/${course_id}`}>
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
