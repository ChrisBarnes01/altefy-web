import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import './calendar.css'
import { Calendar, Views } from 'react-big-calendar'
import localizer from 'react-big-calendar/lib/localizers/moment'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

let allViews = Object.keys(Views).map(k => Views[k])
let momentLocalizer = localizer(moment)
var events = []


  

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
    },
  })


let MyCalendar = ({ localizer, events }) => (
  <Calendar
    events={events}
    views={allViews}
    step={60}
    showMultiDayTimes
    defaultDate={new Date()}
    components={{
      timeSlotWrapper: ColoredDateCellWrapper,
    }}
    localizer={localizer}
  />
)
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

const getDateString = () => { 
  var d = new Date();
  var month = d.getMonth(); // Since getMonth() returns month from 0-11 not 1-12.
  var year = d.getFullYear();
  return monthNames[month] + " " + year;
}

const getWelcomeMessage = () => {
  return "Calendario"
}

class Calendar1 extends Component{
  constructor(props){
    super(props);
    this.state = {
      firstName: "must get firstname of doctor",
      loading: false,
      calendarEvents: events
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.patients().on('value', snapshot => {
      const usersObject = snapshot.val(); 
      var calendarMap = this.props.firebase.getCalendarFromDoctorList(usersObject); 
      var calKeys = calendarMap.keys();
      var valuesList = []; 
      for (var m in calendarMap){
        var arrayToAdd = calendarMap[m]
        for (var i = 0; i < arrayToAdd.length; i++){
          var value = arrayToAdd[i];
          var calendarTime = value["calendarTime"];
          var overallDate = new Date(calendarTime);
          var end = new Date(new Date(calendarTime).setHours(new Date(calendarTime).getHours() + 1))
          var valueToAdd = {"id": i, "title": value["message"], "start": overallDate, "end": end}
          valuesList.push(valueToAdd)
        }
      }

      this.setState({
        notifications: this.props.firebase.getNotificationsFromPatientList(usersObject),
        loading: false,
        calendarEvents: valuesList
      });
    });
  }

  render(){
    console.log("events!!!")
    console.log(this.state.calendarEvents)
    return (
      <div className='newHomeBody'>
          <h1>{ getWelcomeMessage() }</h1>
          <br/>
          <h3> { getDateString() }</h3>
          <div className="calendarComponentPage">
          {this.state.loading && <p>Loading ...</p>}
          {!this.state.loading && <MyCalendar localizer={momentLocalizer} events={this.state.calendarEvents}/>}
          </div>
        </div>
      )
    }
  };
 
export default withFirebase(Calendar1);