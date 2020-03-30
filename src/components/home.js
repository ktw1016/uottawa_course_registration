import React from 'react';
import WeeklySchedule from './weekly_schedule.js';
import { Link } from 'react-router-dom'

export default class Home extends React.Component {
  render() {
    return <div style={{margin:20, display: "flex", flexDirection: "column"}}>
      <span
        style={{fontSize: 30}}
        dangerouslySetInnerHTML={{
        __html: `<b>Home - Current Schedule </b>`
        }} />
      <div className="d-flex justify-content-end">
        <Link exact to="/add-course">
          <button style={{ backgroundColor: "#b3ffd9", maxWidth: "100%", borderRadius: "10px" }} className="col-md-1">
              <b>+ Add Course</b>
          </button>
        </Link>
      </div>
      <br></br>
      <WeeklySchedule/>
    </div>
  }
}