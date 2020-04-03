import './swap_section.scss';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../courses';
import { Details } from './Details.js';
import { ReactCourseTimeSlots } from './course_info.js';
import Logo from "./uottawa_hor_white.png";

const course_type_map = {
  lecture: "Lecture",
  lab: "Lab",
  tutorial: "Tutorial",
}
export class ReactAddCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
    }
  }
  render() {
    const {
      classes,
      conflict_courses,
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
            )}
          </tbody>
          </table>
        </div>
      })}
        <div className="d-flex flex-column">
          { success && <span className="d-flex justify-content-end" style={{ color: "green" }}> ✓ Added </span>}
          <div className="d-flex justify-content-end">
          <button
            style={{ backgroundColor: "#b3ffd9", maxWidth: "100%", borderRadius: "10px" }}
            className="col-md-4"
            onClick={() => {
              _.forEach(courses[course_code].classes, section_obj => {
                if (section_obj.section === section) {
                  section_obj.section_registered = true;
                  _.forEach(section_obj.section_classes, cls => {
                    if (cls.type !== "lecture") {
                      const selected_cls = _.split(document.querySelector(`input[name="${section}_${cls.type}"]:checked`).value, '_');
                      cls.registered = cls.day===selected_cls[0] && cls.time===selected_cls[1] && cls.location===selected_cls[2];
                    } else {
                      cls.registered = true;
                    }
                  })
                }
              })
              this.setState({success: true})
            }}
          >
            <b> ADD COURSE </b>
          </button>
        </div>
      </div>
    </div>
    }
}

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
      .pickBy(course => _.find(course.classes, { section_registered: true }) ? false : true)
      .pickBy((course, course_code) => query.length > 2 && _.includes(course_code, query))
      .value();

    return <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{backgroundColor: "#6A0000"}}>
        <img id="logo" src={Logo}></img>
        <span id="title">UOttawa Course Selection System</span>
      </div>
      <Link exact to="/" > ← Back to timetable </Link>
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
      <div
        style={{
          border: "1px solid #bbc1c9",
          paddingBottom: "25px",
          borderRadius: "10px",
        }}
        className="pagedetails col-md-12 d-flex justify-content-center text-center">
        {_.map(filtered_courses, (current_course, course_code) => {
          return <div key={_.uniqueId()} className="pagedetails__report-a-problem col-md-8 col-sm-12">
            <Details
              summary_content={`${course_code} - ${current_course.name}`}
              content={
                _.map(current_course.classes, ({ section, section_registered, section_classes }) => {
                  const conflict_courses =
                  _.reduce(courses, (result, wide_class, wide_current_course_code) => {
                    if (course_code !== wide_current_course_code) {
                      _.forEach(wide_class.classes, (row) => {
                        _.forEach(row.section_classes, wide_cls_timeslot => {
                          _.forEach(section_classes, cls_time_slot => {
                            if (cls_time_slot.day === wide_cls_timeslot.day && cls_time_slot.time === wide_cls_timeslot.time && wide_cls_timeslot.registered) {
                              result[wide_current_course_code] = wide_cls_timeslot
                            }
                          })
                        })
                      });
                    }
                    return result;
                  }, {});
    
                  return <div className="pagedetails">
                    <div className={"pagedetails__report-a-problem"} style={{ marginLeft: 30 }}>
                      <Details
                      key={`Details_${section}`}
                      summary_content={`Section ${section}`}
                      persist_content={true}
                      is_conflict={!_.isEmpty(conflict_courses)}
                      content={
                        <ReactAddCourse
                          course_code={course_code}
                          section={section}
                          key={`Timeslots_${section}`}
                          classes={section_classes}
                          conflict_courses={conflict_courses}
                        />}
                      />
                    </div>
                  </div>
                })
              }
              persist_content={true}
              />
          </div>
        })}
      </div>
    </div>
  }
}
