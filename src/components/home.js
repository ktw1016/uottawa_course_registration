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
      <div className="side">
        <Link style={{fontWeight:"bold"}} className="sideBar">Home</Link><br></br>
        <Link className="sideBar">My Requirnment</Link><br></br>
        <Link className="sideBar">Ask for help</Link><br></br>
      </div>
      <div className="main">
        <span
          style={{color:"black",fontSize: 30, marginLeft:"30px"}}
          dangerouslySetInnerHTML={{
          __html: `<b>Home - Current Schedule </b>`
        }} />
        <div style={{marginRight:"20px"}}className="d-flex justify-content-end">
          <Link exact to="/add-course">
            <button style={{ backgroundColor: "#b3ffd9", maxWidth: "100%", borderRadius: "5px" }} className="col-md-1">
                <b>+ Add Course</b>
            </button>
          </Link>
          <button style={{backgroundColor:"grey"}}><b>Print Timetable</b></button>

        </div>
        <br></br>
        <WeeklySchedule/>
      </div>
    </div>
  }
}
