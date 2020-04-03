import './swap_section.scss';
import React from 'react';
import _ from 'lodash';
import { courses } from '../courses.js';
import { Link } from 'react-router-dom';
import { Details } from './Details.js';
import { useParams } from "react-router-dom";
import { ReactCourseTimeSlots } from './course_info.js';


export class ReactSwapSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registered_section_alphabet: _.split(this.props.course_id, '_')[1],
    }
  }
  render() {
    const { course_id } = this.props;
    const { registered_section_alphabet } = this.state;

    const course_code = _.split(course_id, '_')[0];
    const current_course = courses[course_code];
  
    return <div className="d-flex flex-column">
      <Link exact to={`/`}> ← Back to timetable </Link>
      <span
        style={{fontSize: 30}}
        dangerouslySetInnerHTML={{
          __html: `<b> Swap Section </b> for ${course_code} - ${current_course.name}`,
        }} />
  
      <div className="pagedetails">
        {
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
  
            return <div key={section} className="pagedetails__report-a-problem col-md-8 col-sm-12">
              <Details
                key={`Details_${section}`}
                summary_content={`Section ${section}`}
                persist_content={true}
                is_conflict={!_.isEmpty(conflict_courses)}
                section_registered={registered_section_alphabet === section}
                content={
                  <ReactCourseTimeSlots
                    course_code={course_code}
                    section={section}
                    key={`Timeslots_${section}`}
                    show_all_classes={true}
                    classes={section_classes}
                    section_registered={section_registered}
                    registered_section_alphabet={(registered_section_alphabet) => this.setState({ registered_section_alphabet: registered_section_alphabet })}
                    conflict_courses={conflict_courses} />
                }
              />
            </div>
            })
        }
      </div>
    </div>
    }
}

export function SwapSection() {
  const { course_id } = useParams();

  return <ReactSwapSection
    course_id={course_id}
  />
}