import React from 'react';
import WeeklySchedule from './weekly_schedule.js';
import { Link } from 'react-router-dom'
import Logo from "./uottawa_hor_white.png"
import './home.scss';

export default class Home extends React.Component {
  render() {
    return <div>
      <div style={{backgroundColor: "#6A0000"}}>
        <img id="logo" src={Logo}></img>
        <span id="title">UOttawa Course Selection System</span>
      </div>
      <span
        style={{color:"black",fontSize: 30}}
        dangerouslySetInnerHTML={{
        __html: `<b>Home - Current Schedule </b>`
      }} />
      <div className="d-flex justify-content-end">
        <Link exact to="/add-course">
          <button style={{ backgroundColor: "#b3ffd9", maxWidth: "100%", borderRadius: "10px" }} className="col-md-1">
              <b>+ Add Course</b>
          </button>
        </Link>
        <button><b>Print Timetable</b></button>

      </div>
      <br></br>
      <WeeklySchedule/>
    </div>
  }
}
