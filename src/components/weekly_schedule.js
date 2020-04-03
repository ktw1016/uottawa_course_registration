import './weekly_schedule.scss';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom'
import { courses } from '../courses.js';

const format_timeslot = (timeslot) => _.trim(_.split(timeslot, '-')[0]);
const row_headers = [
  "8:30 - 10:00", "10:00 - 11:30", "11:30 - 13:00", "13:00 - 14:30", "14:30 - 16:00", "16:00 - 17:30",
  "17:30 - 19:00", "19:00 - 20:30", "20:30 - 22:00"
];
const days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const class_type_map = {
  lecture: "LEC",
  lab: "LAB",
  tutorial: "TUT",
}

export default class WeeklySchedule extends React.Component {
  render() {
    const days_of_week_obj = () => _.chain(days_of_week)
      .map(day => [day, <td key={_.uniqueId(day)}></td>])
      .fromPairs()
      .value();
    var table_grid_data = {
      [`8:30`]: days_of_week_obj(),
      [`10:00`]: days_of_week_obj(),
      [`11:30`]: days_of_week_obj(),
      [`13:00`]: days_of_week_obj(),
      [`14:30`]: days_of_week_obj(),
      [`16:00`]: days_of_week_obj(),
      [`17:30`]: days_of_week_obj(),
      [`19:00`]: days_of_week_obj(),
      [`20:30`]: days_of_week_obj(),
    };
    _.forEach(courses, (course, course_code) => {
      _.forEach(course.classes, ({ section, section_classes, section_registered }) => {
        if (section_registered) {
          _.forEach(section_classes, ({ time, day, type, location, registered }) => {
            if (registered) {
              table_grid_data[`${time}`][day] =
              <td className="class-link" key={_.uniqueId(course_code)}>
              <Link style={{color:"white"}} exact to={`./course-info/${course_code}_${section}`}>
                <span
                dangerouslySetInnerHTML={{
                  __html: `<b>${course_code}${section}</b>-${class_type_map[type]}
                  ${location}`,
                }} />
              </Link>
            </td>;
            }
          })
        }
      });
    });

    return (
      <div className="schedule-table" >
        <table style={{ height: "100%", width: "100%", borderCollapse:"separate" }}>
          <thead>
            <tr>
              { _.map(["Schedule", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], day =>
                <td className="tbl-header" key={day}>
                  {day}
                </td>
              )}
            </tr>
          </thead>
          <tbody>
            {_.map(row_headers, timeslot =>
              <tr key={timeslot}>
                <td className="tbl-header" key={timeslot}>
                  {timeslot}
                </td>
                { _.map(days_of_week, day => table_grid_data[format_timeslot(timeslot)][day]) }
              </tr>
              )}
          </tbody>
        </table>
      </div>
    );
      }
}
